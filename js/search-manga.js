import { updatePagination } from "./my-library-pagination.js";

let originalMangaData = [];

document.body.addEventListener("input", (e) => {
  if (e.target && e.target.id === "search") {
    const value = e.target.value.toLowerCase();
    if (!window.mangaData) return;

    if (originalMangaData.length === 0) {
      originalMangaData = [...window.mangaData];
    }

    const mangaContainer = document.getElementById("manga-container");
    let noMangaMessage = document.getElementById("no-manga-message");

    if (!noMangaMessage) {
      noMangaMessage = document.createElement("div");
      noMangaMessage.id = "no-manga-message";
      noMangaMessage.classList.add("no-manga-message");
      noMangaMessage.innerHTML =
        "Sorry, but this manga wasn't added <br> to your library.";
      mangaContainer.appendChild(noMangaMessage);
      mangaContainer.style.height = "60vh";
    }

    if (value.trim() === "") {
      noMangaMessage.style.display = "none";
      window.mangaData = [...originalMangaData];
      updatePagination(window.mangaData);
      return;
    }

    const filteredManga = window.mangaData.filter(
      (manga) =>
        manga.title.toLowerCase().includes(value) ||
        manga.author.toLowerCase().includes(value)
    );

    if (filteredManga.length > 0) {
      noMangaMessage.style.display = "none";
      updatePagination(filteredManga);
    } else {
      noMangaMessage.style.display = "block";
      mangaContainer.innerHTML = "";
      mangaContainer.appendChild(noMangaMessage);
    }
  }
});
