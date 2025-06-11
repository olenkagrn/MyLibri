function init() {
  import("./filter-for-search.js");
  import("./search-manga.js");

  import("./my-library-pagination.js").then((pagination) => {
    fetchMangaData().then((mangaData) => {
      pagination.updatePagination(mangaData);
    });
  });
}

async function fetchMangaData() {
  console.log("🔄 Виконуємо запит до сервера...");

  try {
    const response = await fetch("https://mylibri.onrender.com/manga");
    return await response.json();
  } catch (error) {
    console.error("Error loading manga:", error);
    return [];
  }
}

const totalPartials = document.querySelectorAll(
  '[hx-trigger="load"], [data-hx-trigger="load"]'
).length;
let loadedPartialsCount = 0;

document.body.addEventListener("htmx:afterOnLoad", () => {
  loadedPartialsCount++;
  if (loadedPartialsCount === totalPartials) init();
});
