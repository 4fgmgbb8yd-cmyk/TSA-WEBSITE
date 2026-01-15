document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".carousel-track");
  const prevBtn = document.querySelector(".carousel-btn.left");
  const nextBtn = document.querySelector(".carousel-btn.right");
  if (!track || !prevBtn || !nextBtn) return;

  let items = Array.from(document.querySelectorAll(".carousel-item"));
  let currentIndex = 1;

  // ===== Preload all images initially =====
  function preloadImages(items) {
    items.forEach(item => {
      const img = item.querySelector("img");
      if (img) {
        const preload = new Image();
        preload.src = img.src;
      }
    });
  }

  preloadImages(items);

  // ===== Clone first and last for infinite loop =====
  const firstClone = items[0].cloneNode(true);
  const lastClone = items[items.length - 1].cloneNode(true);
  track.appendChild(firstClone);
  track.insertBefore(lastClone, items[0]);
  items = Array.from(document.querySelectorAll(".carousel-item"));

  // ===== Helper: Calculate offset to center an item =====
  function getItemOffset(index) {
    const item = items[index];
    const trackWidth = track.offsetWidth;
    const itemWidth = item.offsetWidth;
    const style = window.getComputedStyle(item);
    const marginRight = parseFloat(style.marginRight);
    const marginLeft = parseFloat(style.marginLeft);
    const totalWidth = itemWidth + marginLeft + marginRight;
    return totalWidth * index - trackWidth / 2 + totalWidth / 2;
  }

  // ===== Update carousel position =====
  function updateCarousel(animate = true) {
    track.style.transition = animate ? "transform 0.5s ease" : "none";
    track.style.transform = `translateX(${-getItemOffset(currentIndex)}px)`;
    items.forEach((item, index) => {
      item.classList.toggle("active", index === currentIndex);
    });

    // Preload the next 2 images to avoid teleport
    preloadNextImages(currentIndex, items, 2);
  }

  // ===== Preload next few images dynamically =====
  function preloadNextImages(currentIndex, items, count = 2) {
    for (let i = 1; i <= count; i++) {
      const nextIndex = (currentIndex + i) % items.length;
      const img = items[nextIndex].querySelector("img");
      if (img && !img.dataset.preloaded) {
        const preload = new Image();
        preload.src = img.src;
        img.dataset.preloaded = "true";
      }
    }
  }

  // ===== Initial positioning =====
  updateCarousel(false);

  // ===== Infinite loop snapping =====
  track.addEventListener("transitionend", () => {
    if (currentIndex === 0) {
      track.style.transition = "none";
      currentIndex = items.length - 2; // real last item
      updateCarousel(false);
    }
    if (currentIndex === items.length - 1) {
      track.style.transition = "none";
      currentIndex = 1; // real first item
      updateCarousel(false);
    }
  });

  // ===== Next button =====
  nextBtn.addEventListener("click", () => {
    currentIndex++;
    updateCarousel(true);
  });

  // ===== Previous button =====
  prevBtn.addEventListener("click", () => {
    currentIndex--;
    updateCarousel(true);
  });

  // ===== Handle window resize =====
  window.addEventListener("resize", () => updateCarousel(false));
});
