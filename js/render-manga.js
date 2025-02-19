console.log("✅ render-manga.js loaded");

export function renderManga(mangaData, currentPage, itemsPerPage) {
  const mangaContainer = document.getElementById("manga-container");
  if (!mangaContainer) return;

  mangaContainer.innerHTML = "";

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedManga = mangaData.slice(start, end);

  paginatedManga.forEach((manga) => {
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
}
