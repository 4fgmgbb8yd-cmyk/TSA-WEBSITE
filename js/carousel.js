document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".carousel-track");
  const prevBtn = document.querySelector(".carousel-btn.left");
  const nextBtn = document.querySelector(".carousel-btn.right");
  if (!track || !prevBtn || !nextBtn) return;

  let items = Array.from(document.querySelectorAll(".carousel-item"));
  let currentIndex = 1;

  // ===== Preload all images first =====
  function preloadAllImages(items, callback) {
    let loaded = 0;
    items.forEach(item => {
      const img = item.querySelector("img");
      if (!img) {
        loaded++;
        if (loaded === items.length && callback) callback();
        return;
      }
      const preload = new Image();
      preload.src = img.src;
      preload.onload = () => {
        loaded++;
        if (loaded === items.length && callback) callback();
      };
    });
  }

  // ===== Initialize carousel after all images are loaded =====
  preloadAllImages(items, () => {
    track.classList.add("loaded"); // optional: show carousel

    // ===== Clone first and last items for infinite loop =====
    const firstClone = items[0].cloneNode(true);
    const lastClone = items[items.length - 1].cloneNode(true);
    track.appendChild(firstClone);
    track.insertBefore(lastClone, items[0]);
    items = Array.from(document.querySelectorAll(".carousel-item"));

    // ===== Helper: calculate center offset =====
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
    }

    // ===== Snap for infinite loop =====
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

    // ===== Initial render =====
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

    // ===== Responsive =====
    window.addEventListener("resize", () => updateCarousel(false));
  });
});
