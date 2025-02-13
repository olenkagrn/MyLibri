const modal = document.getElementById("add-manga__success-modal");
const close = document.querySelector(".close-btn");
const open = document.querySelector(".add-manga__btn");
function openModal() {
  modal.style.display = "block";
}

function closeModal() {
  modal.style.display = "none";
}

close.addEventListener("click", closeModal);
open.addEventListener("click", openModal);
document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".add-manga__form");

  form.addEventListener("submit", async function (event) {
    event.preventDefault(); // Зупиняємо оновлення сторінки

    const formData = new FormData(form); // Отримуємо дані форми

    try {
      const response = await fetch("http://localhost:4000/add-manga", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Manga added successfully!");
        form.reset(); // Очищаємо форму
      } else {
        alert("Error adding manga.");
      }
    } catch (error) {
      console.error("Request failed", error);
      alert("Something went wrong.");
    }
  });
});
