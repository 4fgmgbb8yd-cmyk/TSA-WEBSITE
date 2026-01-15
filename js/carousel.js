const track = document.querySelector(".carousel-track");
let items = Array.from(document.querySelectorAll(".carousel-item"));
const prevBtn = document.querySelector(".carousel-btn.left");
const nextBtn = document.querySelector(".carousel-btn.right");

let currentIndex = 1;

// clone for infinite loop
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

// initial position
updateCarousel(false);

// next
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

// prev
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
