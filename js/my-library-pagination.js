console.log("✅ my-library-pagination.js loaded");

import { renderManga } from "./render-manga.js";

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let currentPage = 1;
const itemsPerPage = 8;
let mangaData = [];

export function updatePagination(newMangaData) {
  if (newMangaData) {
    mangaData = newMangaData;
    window.mangaData = newMangaData; // Додаємо глобальне збереження
  }

  const totalPages = Math.ceil(mangaData.length / itemsPerPage);

  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;

  renderManga(mangaData, currentPage, itemsPerPage);

  setTimeout(() => {
    updateActiveLink();
    addPaginationEventListeners();
  }, 100);
}

function updateActiveLink() {
  const paginationLinks = document.querySelectorAll(".pagination__link");

  if (paginationLinks.length === 0) return; // Якщо кнопки ще не завантажилися, виходимо

  paginationLinks.forEach((link, index) => {
    link.classList.toggle("active", index + 1 === currentPage);
  });
}

function addPaginationEventListeners() {
  const paginationLinks = document.querySelectorAll(".pagination__link");

  paginationLinks.forEach((link, index) => {
    link.addEventListener("click", () => {
      currentPage = index + 1;
      updatePagination();
    });
  });
}

// Обробники кнопок "Назад" і "Вперед"
prevBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    updatePagination();
  }
});

nextBtn.addEventListener("click", () => {
  const totalPages = Math.ceil(mangaData.length / itemsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    updatePagination();
  }
});
