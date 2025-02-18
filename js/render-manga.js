console.log("✅ render-manga.js loaded");

document.body.addEventListener("htmx:afterOnLoad", async () => {
  const mangaContainer = document.getElementById("manga-container");
  if (!mangaContainer) return;

  try {
    console.log("🔄 Виконуємо запит до сервера...");

    const response = await fetch("http://localhost:4000/manga");
    const mangaData = await response.json();

    window.mangaData = mangaData; // Зберігаємо дані в глобальну змінну

    renderManga(mangaData);
  } catch (error) {
    console.error("Error loading manga:", error);
  }
});

// Функція для рендерингу манг
function renderManga(mangaData) {
  const mangaContainer = document.getElementById("manga-container");
  mangaContainer.innerHTML = "";

  mangaData.forEach((manga) => {
    const mangaItem = document.createElement("div");
    mangaItem.classList.add("manga-item");

    const img = document.createElement("img");
    img.src = manga.image;
    img.alt = "Manga Poster";
    img.classList.add("manga-img");

    const mangaContent = document.createElement("div");
    mangaContent.classList.add("manga-content");

    const title = document.createElement("h2");
    title.classList.add("manga-title");
    title.textContent = manga.title;

    const author = document.createElement("p");
    author.classList.add("manga-author");
    author.textContent = manga.author;

    mangaContent.appendChild(title);
    mangaContent.appendChild(author);
    mangaItem.appendChild(img);
    mangaItem.appendChild(mangaContent);
    mangaContainer.appendChild(mangaItem);

    // Додаємо посилання на елемент у масиві
    manga.element = mangaItem;
  });
}
