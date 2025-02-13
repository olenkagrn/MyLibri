const selectCategory = document.querySelector(".manga__select-wrapper");
const selectCategoryIcon = document.querySelector(".manga__select-wrapper");

selectCategory.addEventListener("click", function () {
  selectCategoryIcon.classList.toggle("open");
});
