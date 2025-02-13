const express = require("express");
const multer = require("multer");
const { Pool } = require("pg");
const path = require("path");
const bodyParser = require("body-parser");

// Налаштування сервера
const app = express();
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
  console.log("Body:", req.body); // Вивести всі поля форми
  console.log("File:", req.file); // Вивести інформацію про файл
  const { mangaName, author, category } = req.body;
  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    // Вставка даних в таблицю manga
    const result = await pool.query(
      "INSERT INTO manga (title, author, category, image) VALUES ($1, $2, $3, $4) RETURNING id",
      [mangaName, author, category, imagePath] // Оновлені змінні для таблиці
    );

    res.status(200).send("Manga added successfully!");
  } catch (error) {
    console.error("Error inserting into the database:", error); // Лог помилки
    res.status(500).send(`Something went wrong: ${error.message}`); // Виведення повідомлення про помилку
  }
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

app.get("/", (req, res) => {
  res.send("Welcome to the Manga Add Form!");
});
