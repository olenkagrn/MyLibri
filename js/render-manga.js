console.log("✅ render-manga.js loaded");

document.body.addEventListener("htmx:afterOnLoad", async () => {
  const mangaContainer = document.getElementById("manga-container");
  if (!mangaContainer) return; // Якщо контейнер ще не з'явився, не виконувати код.

  try {
    console.log("🔄 Виконуємо запит до сервера...");

    const response = await fetch("http://localhost:4000/manga");
    const mangaData = await response.json();

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
    });
  } catch (error) {
    console.error("Error loading manga:", error);
  }
});
