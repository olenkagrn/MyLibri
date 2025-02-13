const dropArea = document.getElementById("drop-area");
const inputFile = document.getElementById("input-file");
const imageView = document.getElementById("img-view");

inputFile.addEventListener("change", uploadImage);

function uploadImage() {
  try {
    const file = inputFile.files[0];

    if (!file) throw new Error("Файл не вибрано.");
    if (!["image/png", "image/jpeg"].includes(file.type)) {
      throw new Error(
        "Непідтримуваний формат файлу. Дозволені тільки PNG та JPEG."
      );
    }

    let imgLink = URL.createObjectURL(file);
    imageView.style.backgroundImage = `url(${imgLink})`;
    imageView.innerHTML = "";
    imageView.style.border = 0;
  } catch (error) {
    alert(error.message);
    inputFile.value = ""; // Очищуємо вибір файлу, якщо він не відповідає вимогам
  }
}

dropArea.addEventListener("dragover", function (e) {
  e.preventDefault();
});

dropArea.addEventListener("drop", function (e) {
  e.preventDefault();

  try {
    const file = e.dataTransfer.files[0];

    if (!file) throw new Error("Файл не визначено.");
    if (!["image/png", "image/jpeg"].includes(file.type)) {
      throw new Error(
        "Unsupported file format. Only PNG and JPEG are allowed."
      );
    }

    inputFile.files = e.dataTransfer.files;
    uploadImage();
  } catch (error) {
    alert(error.message);
  }
});
