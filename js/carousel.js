const track = document.querySelector(".carousel-track");
const items = Array.from(document.querySelectorAll(".carousel-item"));
const prevBtn = document.querySelector(".carousel-btn.left");
const nextBtn = document.querySelector(".carousel-btn.right");

let currentIndex = 0;

function updateCarousel() {
  // Calculate the offset to center the active image
  const offset = -currentIndex * (items[0].offsetWidth + 20); // 20px gap
  track.style.transform = `translateX(${offset}px)`;

  items.forEach((item, index) => {
    item.classList.remove("active");
    if (index === currentIndex) {
      item.classList.add("active");
    }
  });
}

prevBtn.addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + items.length) % items.length;
  updateCarousel();
});

nextBtn.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % items.length;
  updateCarousel();
});

// Initialize
updateCarousel();
const track = document.querySelector(".carousel-track");
let items = Array.from(document.querySelectorAll(".carousel-item"));
const prevBtn = document.querySelector(".carousel-btn.left");
const nextBtn = document.querySelector(".carousel-btn.right");

const visibleIndexOffset = 1; // center image
let currentIndex = visibleIndexOffset;

// Clone first and last items for infinite loop
const firstClone = items[0].cloneNode(true);
const lastClone = items[items.length - 1].cloneNode(true);

track.appendChild(firstClone);
track.insertBefore(lastClone, items[0]);

items = Array.from(document.querySelectorAll(".carousel-item"));

const itemWidth = items[0].offsetWidth;

function updateCarousel(animate = true) {
  track.style.transition = animate ? "transform 0.6s ease" : "none";
  track.style.transform = `translateX(${-itemWidth * currentIndex}px)`;

  items.forEach((item, index) => {
    item.classList.toggle("active", index === currentIndex);
  });
}

// Initial position
updateCarousel(false);

// Next
nextBtn.addEventListener("click", () => {
  currentIndex++;
  updateCarousel();

  if (currentIndex === items.length - 1) {
    setTimeout(() => {
      currentIndex = 1;
      updateCarousel(false);
    }, 600);
  }
});

// Previous
prevBtn.addEventListener("click", () => {
  currentIndex--;
  updateCarousel();

  if (currentIndex === 0) {
    setTimeout(() => {
      currentIndex = items.length - 2;
      updateCarousel(false);
    }, 600);
  }
});
