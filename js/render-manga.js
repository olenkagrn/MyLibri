console.log("✅ render-manga.js loaded");
const API_URL = process.env.API_URL;

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
    const btnEditItemId = "btnEditItemId";

    editModal.innerHTML = `
    <img class="edit-manga__img" src="${manga.image}" />
    <div class="edit-manga__info">
      <div class="edit-manga__details">
        <h2 class="edit-manga__title">${manga.title}</h2>
        <p class="edit-manga__author">${manga.author}</p>
        <p class="edit-manga__categ">${manga.category}</p>
      </div>
      
<svg id="${editEditDeleteId}" class="edit-manga__options-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M10 5h4a2 2 0 1 0-4 0M8.5 5a3.5 3.5 0 1 1 7 0h5.75a.75.75 0 0 1 0 1.5h-1.32l-1.17 12.111A3.75 3.75 0 0 1 15.026 22H8.974a3.75 3.75 0 0 1-3.733-3.389L4.07 6.5H2.75a.75.75 0 0 1 0-1.5zm2 4.75a.75.75 0 0 0-1.5 0v7.5a.75.75 0 0 0 1.5 0zM14.25 9a.75.75 0 0 1 .75.75v7.5a.75.75 0 0 1-1.5 0v-7.5a.75.75 0 0 1 .75-.75m-7.516 9.467a2.25 2.25 0 0 0 2.24 2.033h6.052a2.25 2.25 0 0 0 2.24-2.033L18.424 6.5H5.576z"/></svg>    </div>
    <div class="edit-manga__btn-container">
      <button id="${btnEditItemId}" class="edit-manga__btn">Edit Manga</button>
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
    deleteButton.addEventListener("click", async () => {
      const isDeleted = await deleteManga(manga.id);
      if (isDeleted) {
        const mangaItemToDelete = document.getElementById(`manga-${manga.id}`);
        if (mangaItemToDelete) {
          mangaItemToDelete.remove();
        }
        closeEditDialog();
      }
    });

    const btnEditItem = editModal.querySelector(`#${btnEditItemId}`);

    btnEditItem.addEventListener("click", () => {
      console.log("added");
      const applyChanges = "applyChanges";

      const editOptionWindow = document.createElement("dialog");
      editOptionWindow.id = "editOptionWindow";
      editOptionWindow.classList.add("edit-option__dialog");

      editOptionWindow.innerHTML = `
      <div class="edit-option__container">
        <h3 class="edit-manga__parameter">${manga.title}</h3>
        <input id="ChangeTitle" class="edit-manga__input" type="text" placeholder="Change title" />
        <p class="edit-manga__parameter">${manga.author}</p>
        <input id="ChangeAuthor" class="edit-manga__input" type="text" placeholder="Change author" />
        <p class="edit-manga__parameter">${manga.category}</p>
        <input id="ChangeCategory" class="edit-manga__input" type="text" placeholder="Change category" />
      </div>
      <button class="edit-manga__apply-changes btn-primary" id="${applyChanges}">Apply Changes</button>`;

      document.body.appendChild(editOptionWindow);
      editOptionWindow.showModal();

      const applyChangesBtn = document.getElementById(`${applyChanges}`);
      applyChangesBtn.addEventListener("click", () => {
        const newTitle = document.getElementById("ChangeTitle").value;
        const newAuthor = document.getElementById("ChangeAuthor").value;
        const newCategory = document.getElementById("ChangeCategory").value;

        manga.title = newTitle || manga.title; // Якщо поле пусте, залишаємо старе значення
        manga.author = newAuthor || manga.author;
        manga.category = newCategory || manga.category;

        const updatedData = {
          mangaName: newTitle,
          author: newAuthor,
          category: newCategory,
        };

        updateManga(manga.id, updatedData);

        const mangaItem = document.getElementById(`manga-${manga.id}`);
        if (mangaItem) {
          mangaItem.querySelector(".manga-title").textContent = manga.title;
          mangaItem.querySelector(".manga-author").textContent = manga.author;
        }

        // Оновлюємо дані в модальному вікні
        editModal.querySelector(".edit-manga__title").textContent = manga.title;
        editModal.querySelector(".edit-manga__author").textContent =
          manga.author;
        editModal.querySelector(".edit-manga__categ").textContent =
          manga.category;

        console.log(manga);
        editOptionWindow.close();
      });
    });
  });
}

async function updateManga(mangaId, updatedData) {
  try {
    const response = await fetch(`${API_URL}/update-manga/${mangaId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });

    const data = await response.json();
    if (response.ok) {
      console.log("Manga updated:", data);
    } else {
      console.error("Failed to update manga:", data);
    }
  } catch (error) {
    console.error("Error updating manga:", error);
  }
}

async function deleteManga(mangaId) {
  try {
    const response = await fetch(`${API_URL}/delete-manga/${mangaId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      console.log("Manga deleted successfully");
      return true; // Повертаємо true, якщо видалення пройшло успішно
    } else {
      console.error("Failed to delete manga");
      return false;
    }
  } catch (error) {
    console.error("Error deleting manga:", error);
    return false;
  }
}
