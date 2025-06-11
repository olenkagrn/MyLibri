const body = document.querySelector("body");
const modal = document.getElementById("add-manga__success-modal");
const close = document.querySelector(".close-btn");
const open = document.querySelector(".add-manga__btn");

const form = document.querySelector(".add-manga__form");
const inputFile = document.getElementById("input-file");
const imageView = document.getElementById("img-view");
const API_URL = "https://mylibri.onrender.com";

form.addEventListener("submit", async function (event) {
  event.preventDefault(); // Зупиняємо оновлення сторінки
  if (!isFormValid(form)) {
    alert("Please fill in all fields."); // Повідомлення про помилку
    return; // Зупиняємо відправлення форми
  } else {
    open.addEventListener("click", openModal);
  }

  const formData = new FormData(form); // Отримуємо дані форми

  try {
    const response = await fetch(`${API_URL}/add-manga`, {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      openModal();
      form.reset();

      // Очищення поля файлу
      inputFile.value = "";
      imageView.style.backgroundImage = "";
      imageView.innerHTML = `
        <svg class="input-upload__svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56 56">
          <path fill="currentColor" fill-rule="evenodd" d="M29.956 39.852v6.722a2 2 0 1 1-4 0v-6.722H10.872c-5.71 0-10.34-4.629-10.34-10.34c0-4.907 3.42-9.017 8.007-10.075l-.004-.264a8.744 8.744 0 0 1 11.225-8.387c2.747-4.223 7.508-7.015 12.921-7.015c8.507 0 15.403 6.896 15.403 15.402q0 .726-.066 1.435c4.303 1.014 7.506 4.88 7.506 9.492c0 5.386-4.366 9.752-9.752 9.752zm-2.012-19.794c-.468 0-.89.164-1.359.633l-7.922 7.64c-.351.352-.539.727-.539 1.243c0 .96.727 1.64 1.711 1.64a1.7 1.7 0 0 0 1.266-.562l3.539-3.773l1.594-1.664l-.141 3.492v9.98c0 .984.844 1.805 1.851 1.805s1.875-.82 1.875-1.805v-9.98l-.164-3.492l1.594 1.664l3.563 3.773c.328.375.82.563 1.289.563c.984 0 1.687-.68 1.687-1.641c0-.516-.21-.89-.562-1.242l-7.922-7.64c-.469-.47-.867-.634-1.36-.634"/>
        </svg>
        <p class="input-upload__description">Drag and drop or click here to upload an image</p>
        <span class="input-upload__subdescription">Upload any images from desktop</span>
      `;
      imageView.style.border = "";
    } else {
      alert("Error adding manga.");
    }
  } catch (error) {
    console.error("Request failed", error);
    alert("Something went wrong.");
  }
});

function openModal() {
  modal.style.display = "block";
  body.classList.toggle("overflow-hidden");
}

function closeModal() {
  modal.style.display = "none";
}

close.addEventListener("click", closeModal);

function isFormValid(form) {
  const inputs = form.querySelectorAll(
    "input[type='text'], input[type='file'], select, textarea"
  ); // Виберіть всі поля форми
  for (const input of inputs) {
    if (!input.value.trim()) {
      // Перевірка на порожні значення
      return false; // Якщо хоча б одне поле порожнє, повертаємо false
    }
  }
  return true; // Якщо всі поля заповнені, повертаємо true
}
