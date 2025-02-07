const track = document.querySelector(".hero__carousel-track");
const slides = document.querySelectorAll(".carousel__slide");
const dots = document.querySelectorAll(".dot");

let currentSlide = 0;

function showSlide(n) {
  const slideWidth = slides[0].clientWidth;
  track.style.transform = `translateX(-${slideWidth * n}px)`;

  slides.forEach((slide, index) => {
    slide.classList.toggle("active", index === n);
  });

  dots.forEach((dot, index) => {
    dot.classList.toggle("active", index === n);
  });
}

showSlide(0);

setInterval(() => {
  currentSlide++;
  if (currentSlide >= slides.length) {
    currentSlide = 0;
  }
  showSlide(currentSlide);
}, 4000);
