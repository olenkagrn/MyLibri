import { updatePagination } from "./my-library-pagination.js";

let originalMangaData = []; // Змінна для збереження початкових даних

document.body.addEventListener("input", (e) => {
  if (e.target && e.target.id === "search") {
    const value = e.target.value.toLowerCase();
    if (!window.mangaData) return; // Переконуємося, що дані існують

    // Зберігаємо оригінальні дані при першому завантаженні
    if (originalMangaData.length === 0) {
      originalMangaData = [...window.mangaData]; // Копіюємо дані манги в оригінальну змінну
    }

    const mangaContainer = document.getElementById("manga-container");
    let noMangaMessage = document.getElementById("no-manga-message");

    // Якщо повідомлення ще немає, додаємо його
    if (!noMangaMessage) {
      noMangaMessage = document.createElement("div");
      noMangaMessage.id = "no-manga-message";
      noMangaMessage.classList.add("no-manga-message");
      noMangaMessage.innerHTML =
        "Sorry, but this manga wasn't added <br> to your library.";
      mangaContainer.appendChild(noMangaMessage);
    }

    // Якщо поле пошуку пусте – повертаємо початковий список
    if (value.trim() === "") {
      noMangaMessage.style.display = "none"; // Ховаємо повідомлення
      window.mangaData = [...originalMangaData]; // Відновлюємо початкові дані
      updatePagination(window.mangaData); // Повертаємо весь список
      return;
    }

    const filteredManga = window.mangaData.filter(
      (manga) =>
        manga.title.toLowerCase().includes(value) ||
        manga.author.toLowerCase().includes(value)
    );

    if (filteredManga.length > 0) {
      noMangaMessage.style.display = "none"; // Ховаємо повідомлення
      updatePagination(filteredManga); // Оновлюємо пагінацію з новими даними
    } else {
      noMangaMessage.style.display = "block"; // Показуємо повідомлення
      mangaContainer.innerHTML = ""; // Очищаємо контент
      mangaContainer.appendChild(noMangaMessage); // Залишаємо лише повідомлення
    }
  }
});
