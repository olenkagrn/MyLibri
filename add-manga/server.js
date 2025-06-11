const express = require("express");
const multer = require("multer");
const { Pool } = require("pg");
const path = require("path");
const bodyParser = require("body-parser");

// Налаштування сервера
const app = express();
const cors = require("cors");
app.use(
  cors({
    origin: "https://calm-tulumba-187140.netlify.app/",
  })
);

const port = 4000;

// Підключення до PostgreSQL
const pool = new Pool({
  user: "postgres", // Замініть на ваше ім'я користувача PostgreSQL
  host: "localhost",
  database: "manga_db", // Назва вашої бази даних
  password: "2146", // Ваш пароль
  port: 5432,
});

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
  console.log("Body:", req.body);
  console.log("File:", req.file);

  const { mangaName, author, category } = req.body;
  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

  if (!mangaName || !author || !category) {
    return res.status(400).send("Missing required fields!");
  }

  try {
    const result = await pool.query(
      "INSERT INTO manga (title, author, category, image) VALUES ($1, $2, $3, $4) RETURNING id",
      [mangaName, author, `{${category}}`, imagePath]
    );

    res.status(200).send("Manga added successfully!");
  } catch (error) {
    console.error("Error inserting into the database:", error);
    res.status(500).send(`Something went wrong: ${error.message}`);
  }
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

app.get("/manga", async (req, res) => {
  try {
    const { category } = req.query;
    let query = "SELECT * FROM manga";
    let values = [];

    if (category) {
      query += " WHERE category @> $1";
      values.push(`{"${category}"}`); // Формуємо JSON-об'єкт для PostgreSQL
    }

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching manga:", error);
    res.status(500).send("Something went wrong.");
  }
});
app.put("/update-manga/:id", async (req, res) => {
  const { id } = req.params;
  const { mangaName, author, category } = req.body;

  if (!mangaName || !author || !category) {
    return res.status(400).send("Missing required fields!");
  }

  try {
    const result = await pool.query(
      "UPDATE manga SET title = $1, author = $2, category = $3 WHERE id = $4 RETURNING *",
      [mangaName, author, `{${category}}`, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).send("Manga not found!");
    }

    res
      .status(200)
      .json({ message: "Manga updated successfully!", manga: result.rows[0] });
  } catch (error) {
    console.error("Error updating manga:", error);
    res.status(500).send(`Something went wrong: ${error.message}`);
  }
});

app.delete("/delete-manga/:id", async (req, res) => {
  const mangaId = req.params.id;

  try {
    // Переконаємося, що ID – це число
    const parsedId = parseInt(mangaId, 10);
    if (isNaN(parsedId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    // Видалити мангу з бази
    const result = await pool.query(
      "DELETE FROM manga WHERE id = $1 RETURNING *",
      [parsedId]
    );

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Manga not found" });
    }

    res.status(200).json({ message: "Manga deleted successfully" });
  } catch (error) {
    console.error("Error deleting manga:", error);
    res.status(500).json({ error: "Failed to delete manga" });
  }
});

app.get("/", (req, res) => {
  res.send("Welcome to the Manga Add Form!");
});
