document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".carousel-track");
  const prevBtn = document.querySelector(".carousel-btn.left");
  const nextBtn = document.querySelector(".carousel-btn.right");
  if (!track || !prevBtn || !nextBtn) return;

  let items = Array.from(track.querySelectorAll(".carousel-item"));

  // ===== Preload single image =====
  function preloadImage(img) {
    return new Promise((resolve) => {
      if (!img) return resolve();
      if (img.complete) return resolve();
      const preload = new Image();
      preload.src = img.src;
      preload.onload = () => resolve();
      preload.onerror = () => resolve();
    });
  }

  // ===== Preload all images + clones =====
  async function preloadAllImages() {
    await Promise.all(items.map(item => preloadImage(item.querySelector("img"))));

    // Clone first and last for infinite loop
    const firstClone = items[0].cloneNode(true);
    const lastClone = items[items.length - 1].cloneNode(true);
    track.appendChild(firstClone);
    track.insertBefore(lastClone, items[0]);

    items = Array.from(track.querySelectorAll(".carousel-item"));
    await Promise.all(items.map(item => preloadImage(item.querySelector("img"))));
  }

  // ===== Initialize Carousel =====
  preloadAllImages().then(() => {
    track.classList.add("loaded");

    let currentIndex = 1; // start at first real item

    function getItemOffset(index) {
      const item = items[index];
      return item.offsetLeft - track.offsetWidth / 2 + item.offsetWidth / 2;
    }

    function updateCarousel(animate = true) {
      track.style.transition = animate ? "transform 0.5s ease" : "none";
      track.style.transform = `translateX(${-getItemOffset(currentIndex)}px)`;
      items.forEach((item, index) => item.classList.toggle("active", index === currentIndex));
    }

    // Looping logic
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

    // Buttons
    nextBtn.addEventListener("click", () => {
      currentIndex++;
      updateCarousel(true);
    });
    prevBtn.addEventListener("click", () => {
      currentIndex--;
      updateCarousel(true);
    });

    // Responsive
    window.addEventListener("resize", () => updateCarousel(false));

    // Initial render
    updateCarousel(false);
  });
});
