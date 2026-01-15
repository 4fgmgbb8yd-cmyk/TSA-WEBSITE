document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".carousel-track");
  const prevBtn = document.querySelector(".carousel-btn.left");
  const nextBtn = document.querySelector(".carousel-btn.right");
  if (!track || !prevBtn || !nextBtn) return; // stop if elements not found

  let items = Array.from(document.querySelectorAll(".carousel-item"));
  let currentIndex = 1;

  // Clone first and last items for infinite loop
  const firstClone = items[0].cloneNode(true);
  const lastClone = items[items.length - 1].cloneNode(true);
  track.appendChild(firstClone);
  track.insertBefore(lastClone, items[0]);
  items = Array.from(document.querySelectorAll(".carousel-item"));

  // Function to center active item
  function updateCarousel(animate = true) {
    const trackWidth = track.offsetWidth;
    const itemWidth = items[0].offsetWidth;

    // Calculate offset to center the active item
    const offset = itemWidth * currentIndex - trackWidth / 2 + itemWidth / 2;

    track.style.transition = animate ? "transform 0.5s ease" : "none";
    track.style.transform = `translateX(${-offset}px)`;

    // Update active class for scale/fade effect
    items.forEach((item, index) => {
      item.classList.toggle("active", index === currentIndex);
    });
  }

  // Initial position
  updateCarousel(false);

  // Next button
  nextBtn.addEventListener("click", () => {
    currentIndex++;
    updateCarousel();

    if (currentIndex === items.length - 1) {
      setTimeout(() => {
        currentIndex = 1; // jump to real first
        updateCarousel(false);
      }, 500);
    }
  });

  // Previous button
  prevBtn.addEventListener("click", () => {
    currentIndex--;
    updateCarousel();

    if (currentIndex === 0) {
      setTimeout(() => {
        currentIndex = items.length - 2; // jump to real last
        updateCarousel(false);
      }, 500);
    }
  });

  // Recalculate positions on window resize
  window.addEventListener("resize", () => {
    updateCarousel(false);
  });
});


