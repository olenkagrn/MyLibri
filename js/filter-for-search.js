const body = document.querySelector("body");
const filterDialog = document.getElementById("filterDialog");
const filterButton = document.getElementById("filterButton");
const closeBtn = document.querySelector(".close-btn");
const btnGroup = document.querySelectorAll(".filter-window__btn-group");
const btnChoose = document.querySelectorAll(".filter-window__btn");

async function showFilterDialog() {
  await filterDialog.showModal();
  body.classList.toggle("overflow-hidden");
}

filterButton.addEventListener("click", showFilterDialog);

async function closeFilterDialog() {
  await filterDialog.close();
  body.classList.remove("overflow-hidden");
}

closeBtn.addEventListener("click", closeFilterDialog);

// Закриття модалки при натисканні на фон (за межами модалки)
filterDialog.addEventListener("click", (event) => {
  // Перевіряємо, чи натиснута саме зовнішня частина модалки
  if (event.target === filterDialog) {
    closeFilterDialog();
  }
});

btnChoose.forEach((btn) => {
  btn.addEventListener("click", () => {
    btn.classList.toggle("selected");
  });
});
