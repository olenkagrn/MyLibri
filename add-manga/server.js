const { createClient } = require("@supabase/supabase-js");

const express = require("express");
const multer = require("multer");
const path = require("path");
const bodyParser = require("body-parser");
require("dotenv").config();
// Налаштування сервера
const app = express();
const cors = require("cors");
app.use(
  cors({
    origin: "*", // Дозволити запити з будь-якого домену (для тестування)
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Дозволити всі методи
    preflightContinue: false,
    optionsSuccessStatus: 204, // Дозволити OPTIONS запити
  })
);
const port = process.env.PORT || 4000;

// Підключення до PostgreSQL
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);
// Налаштування Multer для збереження файлів
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Збереження файлів у папці uploads
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Унікальне ім'я для кожного файлу
  },
});

const upload = multer({ storage });

// Мідлвар для парсингу JSON-даних
app.use(bodyParser.json());

// Статичний доступ до папки uploads
app.use("/uploads", express.static("uploads"));

// Маршрут для обробки форми
app.post("/add-manga", upload.single("image"), async (req, res) => {
  const { mangaName, author, category } = req.body;
  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

  if (!mangaName || !author || !category) {
    return res.status(400).send("Missing required fields!");
  }

  const { data, error } = await supabase.from("manga").insert([
    {
      title: mangaName,
      author,
      category: [category], // Supabase supports arrays like this
      image: imagePath,
    },
  ]);

  if (error) {
    console.error("Error inserting into Supabase:", error);
    return res.status(500).send("Something went wrong.");
  }

  res.status(200).send("Manga added successfully!");
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

app.get("/manga", async (req, res) => {
  const { category } = req.query;

  let query = supabase.from("manga").select("*");

  if (category) {
    query = query.contains("category", [category]);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching manga:", error);
    return res.status(500).send("Something went wrong.");
  }

  res.json(data);
});

app.put("/update-manga/:id", async (req, res) => {
  const { id } = req.params;
  const { mangaName, author, category } = req.body;

  if (!mangaName || !author || !category) {
    return res.status(400).send("Missing required fields!");
  }

  const { data, error } = await supabase
    .from("manga")
    .update({
      title: mangaName,
      author,
      category: [category],
    })
    .eq("id", id)
    .select();

  if (error) {
    console.error("Error updating manga:", error);
    return res.status(500).send("Something went wrong.");
  }

  if (data.length === 0) {
    return res.status(404).send("Manga not found!");
  }

  res
    .status(200)
    .json({ message: "Manga updated successfully!", manga: data[0] });
});

app.delete("/delete-manga/:id", async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase.from("manga").delete().eq("id", id);

  if (error) {
    console.error("Error deleting manga:", error);
    return res.status(500).json({ error: "Failed to delete manga" });
  }

  res.status(200).json({ message: "Manga deleted successfully" });
});

app.get("/", (req, res) => {
  res.send("Welcome to the Manga Add Form!");
});
