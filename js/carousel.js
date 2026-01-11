const images = document.querySelectorAll(".carousel-track img");
const prevBtn = document.querySelector(".carousel-btn.left");
const nextBtn = document.querySelector(".carousel-btn.right");

let currentIndex = 0;

function updateCarousel() {
  images.forEach((img, index) => {
    img.classList.remove("active", "prev", "next");

    if (index === currentIndex) {
      img.classList.add("active");
    } else if (index === (currentIndex - 1 + images.length) % images.length) {
      img.classList.add("prev");
    } else if (index === (currentIndex + 1) % images.length) {
      img.classList.add("next");
    }
  });
}

prevBtn.addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  updateCarousel();
});

nextBtn.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % images.length;
  updateCarousel();
});

updateCarousel();
