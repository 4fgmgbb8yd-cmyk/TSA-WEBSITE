document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".carousel-track");
  const prevBtn = document.querySelector(".carousel-btn.left");
  const nextBtn = document.querySelector(".carousel-btn.right");
  if (!track || !prevBtn || !nextBtn) return;

  let items = Array.from(document.querySelectorAll(".carousel-item"));
  let currentIndex = 1;

  // ===== Clone first and last for infinite loop =====
  const firstClone = items[0].cloneNode(true);
  const lastClone = items[items.length - 1].cloneNode(true);
  track.appendChild(firstClone);
  track.insertBefore(lastClone, items[0]);
  items = Array.from(document.querySelectorAll(".carousel-item"));

  // ===== Helper: preload image =====
  function preloadImage(img) {
    if (!img || img.dataset.preloaded) return;
    const preload = new Image();
    preload.src = img.src;
    img.dataset.preloaded = "true";
  }

  // ===== Preload first batch of images =====
  function preloadNextImages(currentIndex, count = 3) {
    for (let i = 1; i <= count; i++) {
      const nextIndex = (currentIndex + i) % items.length;
      preloadImage(items[nextIndex].querySelector("img"));
    }
  }

  // ===== Calculate offset to center item =====
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

    // preload the next 3 images
    preloadNextImages(currentIndex, 3);
  }

  // ===== Infinite loop snapping =====
  track.addEventListener("transitionend", () => {
    if (currentIndex === 0) {
      track.style.transition = "none";
      currentIndex = items.length - 2;
      updateCarousel(false);
    }
    if (currentIndex === items.length - 1) {
      track.style.transition = "none";
      currentIndex = 1;
      updateCarousel(false);
    }
  });

  // ===== Initial positioning =====
  updateCarousel(false);

  // ===== Next / Prev buttons =====
  nextBtn.addEventListener("click", () => {
    currentIndex++;
    updateCarousel(true);
  });

  prevBtn.addEventListener("click", () => {
    currentIndex--;
    updateCarousel(true);
  });

  // ===== Recenter on window resize =====
  window.addEventListener("resize", () => updateCarousel(false));

  // ===== Preload initial images to avoid teleport =====
  preloadNextImages(currentIndex, 3);
});
