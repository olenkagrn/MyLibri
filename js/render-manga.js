console.log("✅ render-manga.js loaded");

export function renderManga(mangaData, currentPage, itemsPerPage) {
  const mangaContainer = document.getElementById("manga-container");
  if (!mangaContainer) return;

  mangaContainer.innerHTML = "";

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedManga = mangaData.slice(start, end);

  if (paginatedManga.length === 0) {
    const mangaContainerEmpty = document.createElement("div");
    mangaContainerEmpty.classList.add("manga-empty__container");

    const mangaTitleEmpty = document.createElement("h2");
    mangaTitleEmpty.classList.add("manga-title__empty");
    mangaTitleEmpty.textContent = "Your library is currently empty :(";

    const mangaSubTitleEmpty = document.createElement("p");
    mangaSubTitleEmpty.classList.add("manga-subtitle__empty");
    mangaSubTitleEmpty.textContent = "Time to add your favorite manga!";

    mangaContainerEmpty.appendChild(mangaTitleEmpty);
    mangaContainerEmpty.appendChild(mangaSubTitleEmpty);
    mangaContainer.appendChild(mangaContainerEmpty);
    return;
  }

  paginatedManga.forEach((manga) => {
    const mangaItem = document.createElement("div");
    mangaItem.classList.add("manga-item");
    mangaItem.id = `manga-${manga.id}`;

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

    const editButton = document.createElement("button");
    editButton.classList.add("manga-item__edit-button", "hide");
    editButton.textContent = "Edit Manga";

    mangaContent.appendChild(title);
    mangaContent.appendChild(author);
    mangaItem.appendChild(img);
    mangaItem.appendChild(mangaContent);
    mangaItem.appendChild(editButton);
    mangaContainer.appendChild(mangaItem);

    // Створення модального вікна
    const editModal = document.createElement("dialog");
    editModal.id = "editModal";
    editModal.classList.add("edit-manga__container");
    const btnEditCloseId = "editClose";
    const editEditDeleteId = "editDelete";

    editModal.innerHTML = `
    <img class="edit-manga__img" src="${manga.image}" />
    <div class="edit-manga__info">
      <div class="edit-manga__details">
        <h2 class="edit-manga__title">${manga.title}</h2>
        <p class="edit-manga__author">${manga.author}</p>
        <p class="edit-manga__categ">${manga.category}</p>
      </div>
      
      <svg class="edit-manga__options-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M16.293 3.293a1 1 0 0 1 1.414 0l3 3a1 1 0 0 1 0 1.414l-9 9A1 1 0 0 1 11 17H8a1 1 0 0 1-1-1v-3a1 1 0 0 1 .293-.707zM9 13.414V15h1.586l8-8L17 5.414zM3 7a2 2 0 0 1 2-2h5a1 1 0 1 1 0 2H5v12h12v-5a1 1 0 1 1 2 0v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
    </div>
    <div class="edit-manga__btn-container">
      <button id="${editEditDeleteId}" class="edit-manga__btn">Delete Manga</button>
      <button id="${btnEditCloseId}" class="edit-manga__btn">Close</button>

    </div>
  `;
    document.body.appendChild(editModal);

    const editClose = editModal.querySelector(`#${btnEditCloseId}`);
    //ADD TO SEPARATE FILE
    const editButtons = mangaItem.querySelectorAll(".manga-item__edit-button");
    const body = document.querySelector("body");

    function showEditDialog() {
      editModal.showModal();
      body.classList.toggle("overflow-hidden");
    }

    function closeEditDialog() {
      editModal.close();
      body.classList.remove("overflow-hidden");
      body.style.opacity = "1";
    }

    mangaItem.addEventListener("mouseenter", () => {
      console.log("mouseenter");
      img.style.transition = "all ease-in-out 0.3s";

      img.style.opacity = "0.3";
      editButtons.forEach((editButton) => {
        editButton.style.display = "inline-block";
      });
    });

    // Подія при миші на елементі
    mangaItem.addEventListener("mouseleave", () => {
      img.style.opacity = "1";
      editButtons.forEach((editButton) => {
        editButton.style.display = "none";
      });
    });

    editButtons.forEach((editButton) => {
      editButton.addEventListener("click", (event) => {
        event.stopPropagation();

        showEditDialog();
        body.style.opacity = "0.3";
      });
    });

    editClose.addEventListener("click", () => {
      closeEditDialog();
    });

    const deleteButton = editModal.querySelector(`#${editEditDeleteId}`);
    deleteButton.addEventListener("click", () => {
      // Remove the manga item from the DOM by referencing its unique ID
      const mangaItemToDelete = document.getElementById(`manga-${manga.id}`);
      if (mangaItemToDelete) {
        mangaItemToDelete.remove();
      }

      // Close the modal after deletion
      closeEditDialog();
    });
  });
}
