const instructionsContainer = document.querySelector(".app-instructions__info");
const headingContainer = instructionsContainer.querySelector(
  ".app-instructions__heading-container"
);
const steps = instructionsContainer.querySelectorAll(".app-instructions__step");

const animateElements = () => {
  console.log("Анімація почалася...");

  setTimeout(() => {
    headingContainer.style.opacity = 1;
    headingContainer.style.transform = "translateX(0)";
    console.log("Заголовок анімований");
  }, 1000);

  steps.forEach((step, index) => {
    setTimeout(() => {
      step.style.opacity = 1;
      step.style.transform = "translateX(0)";
      console.log(`Крок ${index + 1} анімований`);
    }, 1500 + index * 1000);
  });
};

// Використовуємо IntersectionObserver для відслідковування прокрутки
const observer = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Якщо елемент видимий на екрані, запускаємо анімацію
        animateElements();
        observer.disconnect(); // Зупиняємо спостереження після того, як анімація запущена
      }
    });
  },
  { threshold: 0.25 } // Виконати анімацію, коли 50% елемента буде видно на екрані
);

// Спостерігаємо за контейнером інструкцій
observer.observe(instructionsContainer);
