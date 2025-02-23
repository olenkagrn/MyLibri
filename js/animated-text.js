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

const featuresContainer = document.querySelector(".features__container");
const features = document.querySelectorAll(".features__container .feature");
const featureInfoBlock = document.querySelector(".features__info");
const featureLogoBlock = document.querySelector(".features__logo-container");

const animatedFeatures = () => {
  console.log("Анімація почалася...");
  featureLogoBlock.classList.add("show"); // Додаємо клас show
  featureInfoBlock.classList.add("show"); // Додаємо клас show

  features.forEach((feature, index) => {
    setTimeout(() => {
      feature.classList.add("show"); // Додаємо клас show
      console.log(`Крок ${index + 1} анімований`);
    }, index * 300); // Затримка для кожного елемента
  });
};

// Використовуємо IntersectionObserver для відслідковування прокрутки
const observer = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Якщо елемент видимий на екрані, запускаємо анімацію
        animatedFeatures();

        animateElements();
        observer.disconnect(); // Зупиняємо спостереження після того, як анімація запущена
      }
    });
  },
  { threshold: 0.5 } // Виконати анімацію, коли 50% елемента буде видно на екрані
);

// Спостерігаємо за контейнером інструкцій
observer.observe(featuresContainer);
observer.observe(instructionsContainer);
