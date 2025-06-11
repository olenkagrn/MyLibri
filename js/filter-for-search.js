import { renderManga } from "./render-manga.js";
const API_URL = "https://mylibri.onrender.com";

const body = document.querySelector("body");
const filterDialog = document.getElementById("filterDialog");
const filterButton = document.getElementById("filterButton");
const closeBtn = document.querySelector(".close-btn");
const genreButtons = document.querySelectorAll(".filter-window__btn[id]"); // Вибираємо тільки кнопки з id
const submitFiltersBtn = document.getElementById("submitFiltersBtn");

let selectedGenre = null;

// Відкриття модального вікна
function showFilterDialog() {
  filterDialog.showModal();
  body.classList.toggle("overflow-hidden");
}

filterButton.addEventListener("click", showFilterDialog);

// Закриття модального вікна
function closeFilterDialog() {
  filterDialog.close();
  body.classList.remove("overflow-hidden");
}

closeBtn.addEventListener("click", closeFilterDialog);
filterDialog.addEventListener("click", (event) => {
  if (event.target === filterDialog) {
    closeFilterDialog();
  }
});

// Вибір жанру (лише один)
genreButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    genreButtons.forEach((b) => b.classList.remove("selected")); // Скидаємо вибір
    btn.classList.add("selected");
    selectedGenre = btn.id;
    console.log("Selected Genre:", selectedGenre);
  });
});

// Отримання даних з сервера після натискання "Submit"
submitFiltersBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  if (!selectedGenre) return;

  const lowerCaseGenre = selectedGenre.toLowerCase();

  try {
    const response = await fetch(`${API_URL}/manga?category=${lowerCaseGenre}`);
    if (!response.ok) throw new Error("Failed to fetch filtered manga.");

    const filteredManga = await response.json();
    renderManga(filteredManga, 1, 8);
  } catch (error) {
    console.error(error);
  }

  closeFilterDialog();
});

// Додаємо клас "selected" до кнопки "Manga" при завантаженні сторінки
document.addEventListener("DOMContentLoaded", () => {
  const mangaCategoryButton = document.querySelector(
    ".filter-window__btn:not([id])"
  ); // Вибираємо кнопку без id
  if (mangaCategoryButton) {
    mangaCategoryButton.classList.add("selected");
  }
});
