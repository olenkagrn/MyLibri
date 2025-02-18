document.body.addEventListener("input", (e) => {
  if (e.target && e.target.id === "search") {
    const value = e.target.value.toLowerCase();
    let found = false; // змінна для перевірки, чи знайдена манга

    window.mangaData.forEach((manga) => {
      const isVisible =
        manga.title.toLowerCase().includes(value) ||
        manga.author.toLowerCase().includes(value);

      manga.element.classList.toggle("hide", !isVisible);

      // Якщо хоча б одна манга відповідає запиту, ставимо found в true
      if (isVisible) {
        found = true;
      }
    });

    // Отримуємо контейнер для манги
    const mangaContainer = document.getElementById("manga-container");
    let noMangaMessage = document.getElementById("no-manga-message");

    // Якщо повідомлення не знайдено, додаємо його
    if (!noMangaMessage) {
      noMangaMessage = document.createElement("div");
      noMangaMessage.id = "no-manga-message";
      noMangaMessage.classList.add("no-manga-message");
      noMangaMessage.innerHTML =
        "Sorry, but this manga wasn't added <br> to your library.";

      mangaContainer.appendChild(noMangaMessage);
    }

    // Показуємо або ховаємо повідомлення
    if (!found) {
      noMangaMessage.style.display = "block"; // Показуємо повідомлення, якщо не знайдена манга
    } else {
      noMangaMessage.style.display = "none"; // Ховаємо повідомлення, якщо манга знайдена
    }
  }
});
