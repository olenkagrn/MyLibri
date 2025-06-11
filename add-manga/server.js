// server.js

const { createClient } = require("@supabase/supabase-js");
const express = require("express");
const multer = require("multer"); // Multer для обробки завантаження файлів
const path = require("path"); // Для роботи зі шляхами файлів
const cors = require("cors"); // Для Cross-Origin Resource Sharing
require("dotenv").config(); // Завантаження змінних середовища з .env файлу (тільки для локальної розробки)

// Налаштування сервера Express
const app = express();
const port = process.env.PORT || 4000; // Порт, на якому буде працювати сервер

// Middleware для CORS: дозволяє запити з будь-якого домену.
// В production рекомендується вказувати конкретні домени замість "*".
app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

// Підключення до Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// Перевірка, чи встановлені змінні середовища Supabase
if (!supabaseUrl || !supabaseKey) {
  console.error(
    "Помилка: Змінні середовища SUPABASE_URL та SUPABASE_KEY не встановлені."
  );
  // Завершити процес, якщо ключі не встановлені, щоб уникнути подальших помилок
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// --- Налаштування Multer для завантаження файлів у пам'ять ---
// Використовуємо memoryStorage, оскільки файлова система Render.com тимчасова.
// Це дозволяє отримати файл як буфер і завантажити його безпосередньо в Supabase Storage.
const upload = multer({
  storage: multer.memoryStorage(), // Зберігати файл у пам'яті як буфер
  limits: {
    fileSize: 5 * 1024 * 1024, // Обмеження розміру файлу 5MB
  },
});

// Middleware для парсингу JSON-даних з тіла запитів
app.use(express.json()); // Замінює bodyParser.json()
app.use(express.urlencoded({ extended: true })); // Для парсингу URL-кодованих даних (якщо потрібно)

// *Зверніть увагу*: Оскільки ми завантажуємо файли в Supabase Storage,
// статичний доступ до папки 'uploads' не потрібен для завантажених зображень.
// Цей рядок можна видалити, якщо ви не зберігаєте інші статичні файли локально.
// app.use("/uploads", express.static(path.join(__dirname, 'uploads')));

// --- Маршрут для додавання манги ---
app.post("/add-manga", upload.single("image"), async (req, res) => {
  try {
    const { mangaName, author, category } = req.body;
    let imageUrl = null; // Змінна для зберігання URL зображення з Supabase Storage

    // Перевірка наявності обов'язкових полів
    if (!mangaName || !author || !category) {
      return res
        .status(400)
        .send("Відсутні обов'язкові поля: назва манги, автор або категорія.");
    }

    // --- Обробка завантаження зображення в Supabase Storage ---
    if (req.file) {
      const file = req.file;
      // Створюємо унікальне ім'я файлу для Supabase Storage
      const fileName = `manga_images/${Date.now()}-${file.originalname.replace(
        /\s+/g,
        "_"
      )}`; // Замінюємо пробіли
      const bucketName = "manga-covers"; // *** ЗАМІНІТЬ НА НАЗВУ ВАШОГО BUCKET В SUPABASE ***

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          upsert: false, // Запобігти перезапису, якщо файл з таким іменем вже існує
          cacheControl: "3600", // Налаштування кешування
        });

      if (uploadError) {
        console.error(
          "Помилка завантаження зображення в Supabase Storage:",
          uploadError
        );
        // Повертаємо 500 помилку, якщо завантаження зображення не вдалося
        return res
          .status(500)
          .send("Не вдалося завантажити зображення. Спробуйте ще раз.");
      }

      // Отримання публічного URL завантаженого зображення
      const { data: publicUrlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);

      if (publicUrlData && publicUrlData.publicUrl) {
        imageUrl = publicUrlData.publicUrl;
      } else {
        console.warn(
          "Попередження: Не вдалося отримати публічний URL для завантаженого зображення."
        );
      }
    }

    // Вставка даних манги в таблицю Supabase
    const { data, error: insertError } = await supabase.from("manga").insert([
      {
        title: mangaName,
        author,
        category: [category], // Переконайтесь, що стовпець 'category' в Supabase має тип TEXT[]
        image: imageUrl, // Тепер це буде URL з Supabase Storage
      },
    ]);

    if (insertError) {
      console.error("Помилка вставки даних в Supabase:", insertError);
      // Повертаємо 500 помилку з більш детальною інформацією для налагодження
      return res
        .status(500)
        .send(
          `Помилка сервера при додаванні манги: ${
            insertError.message || JSON.stringify(insertError)
          }`
        );
    }

    res.status(201).send("Манга успішно додана!"); // 201 Created для успішної вставки
  } catch (error) {
    console.error("Неочікувана помилка в маршруті /add-manga:", error);
    // Загальна 500 помилка для необроблених винятків
    res.status(500).send("Виникла неочікувана помилка на сервері.");
  }
});

// --- Маршрут для отримання манги (без змін) ---
app.get("/manga", async (req, res) => {
  try {
    const { category } = req.query;
    let query = supabase.from("manga").select("*");

    if (category) {
      // Використовуйте 'cs' (contains) або 'overlap' для пошуку в масиві
      // 'cs' перевіряє, чи містить масив точно вказане значення
      // 'overlap' перевіряє, чи є спільні елементи між масивами
      query = query.contains("category", [category]);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Помилка отримання манги:", error);
      return res
        .status(500)
        .send(`Помилка сервера: ${error.message || JSON.stringify(error)}`);
    }

    res.json(data);
  } catch (error) {
    console.error("Неочікувана помилка в маршруті /manga:", error);
    res.status(500).send("Виникла неочікувана помилка на сервері.");
  }
});

// --- Маршрут для оновлення манги (змінено для обробки помилок) ---
app.put("/update-manga/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { mangaName, author, category } = req.body;

    if (!mangaName || !author || !category) {
      return res.status(400).send("Відсутні обов'язкові поля для оновлення!");
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
      console.error("Помилка оновлення манги:", error);
      return res
        .status(500)
        .send(`Помилка сервера: ${error.message || JSON.stringify(error)}`);
    }

    if (data.length === 0) {
      return res.status(404).send("Мангу не знайдено!");
    }

    res
      .status(200)
      .json({ message: "Манга успішно оновлена!", manga: data[0] });
  } catch (error) {
    console.error("Неочікувана помилка в маршруті /update-manga:", error);
    res.status(500).send("Виникла неочікувана помилка на сервері.");
  }
});

// --- Маршрут для видалення манги (змінено для обробки помилок) ---
app.delete("/delete-manga/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase.from("manga").delete().eq("id", id);

    if (error) {
      console.error("Помилка видалення манги:", error);
      return res.status(500).json({
        error: `Не вдалося видалити мангу: ${
          error.message || JSON.stringify(error)
        }`,
      });
    }

    // Зазвичай, при успішному видаленні 'data' буде порожнім або null,
    // а 'error' буде null.
    res.status(200).json({ message: "Манга успішно видалена" });
  } catch (error) {
    console.error("Неочікувана помилка в маршруті /delete-manga:", error);
    res.status(500).send("Виникла неочікувана помилка на сервері.");
  }
});

// --- Базовий маршрут ---
app.get("/", (req, res) => {
  res.send("Welcome to the Manga Add Form!");
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер працює на http://localhost:${port}`);
});
