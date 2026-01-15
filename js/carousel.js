/* ===== CENTERED FOCUSED CAROUSEL ===== */
.carousel {
  position: relative;
  width: 100%;
  max-width: 900px; /* narrower to look more compressed */
  margin: 0 auto;
  padding: 2rem 0;
}

.carousel-viewport {
  overflow: hidden;
  width: 100%;
}

.carousel-track {
  display: flex;
  align-items: center;
  transition: transform 0.5s ease;
}

/* carousel items */
.carousel-item {
  flex: 0 0 50%; /* more compressed width */
  display: flex;
  justify-content: center;
  opacity: 0.4; /* faded side images */
  transform: scale(0.8);
  transition: transform 0.5s ease, opacity 0.5s ease;
  margin: 0 -60px; /* overlap slightly for side images */
  border-radius: 24px; /* rounded corners */
  overflow: hidden; /* ensures images don’t spill over rounded edges */
}

.carousel-item img {
  width: 100%;
  border-radius: 24px;
  object-fit: cover;
}

/* active/focused item */
.carousel-item.active {
  opacity: 1;
  transform: scale(1);
  z-index: 2;
}

/* arrows */
.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0,0,0,0.5);
  color: #fff;
  border: none;
  font-size: 2.2rem;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  z-index: 10;
}

.carousel-btn.left { left: 10px; }
.carousel-btn.right { right: 10px; }

.carousel-btn:hover {
  background: rgba(0,0,0,0.75);
}

/* responsive */
@media (max-width: 768px) {
  .carousel-item {
    flex: 0 0 70%;
    margin: 0 -40px;
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

function updateCarousel(animate = true) {
  const trackWidth = track.offsetWidth;
  const itemWidth = items[0].offsetWidth;

  // Calculate offset to center the active item
  const offset = itemWidth * currentIndex - trackWidth / 2 + itemWidth / 2;

  track.style.transition = animate ? "transform 0.5s ease" : "none";
  track.style.transform = `translateX(${-offset}px)`;

  items.forEach((item, index) => {
    item.classList.toggle("active", index === currentIndex);
  });
}

// initial position
updateCarousel(false);

// handle next
nextBtn.addEventListener("click", () => {
  currentIndex++;
  updateCarousel();

  if (currentIndex === items.length - 1) {
    setTimeout(() => {
      currentIndex = 1;
      updateCarousel(false);
    }, 500);
  }
});

// handle prev
prevBtn.addEventListener("click", () => {
  currentIndex--;
  updateCarousel();

  if (currentIndex === 0) {
    setTimeout(() => {
      currentIndex = items.length - 2;
      updateCarousel(false);
    }, 500);
  }
});

// recalc on window resize
window.addEventListener("resize", () => {
  updateCarousel(false);
});
  }
}

