document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".carousel-track");
  const prevBtn = document.querySelector(".carousel-btn.left");
  const nextBtn = document.querySelector(".carousel-btn.right");
  if (!track || !prevBtn || !nextBtn) return;

  let items = Array.from(document.querySelectorAll(".carousel-item"));

  // ===== Helper: preload a single image =====
  function preloadImage(img) {
    return new Promise((resolve) => {
      if (!img) return resolve();
      if (img.complete) return resolve(); // already loaded
      const preload = new Image();
      preload.src = img.src;
      preload.onload = () => resolve();
      preload.onerror = () => resolve();
    });
  }

  // ===== Preload all images including clones =====
  async function preloadAllImages() {
    // preload original images first
    await Promise.all(items.map(item => preloadImage(item.querySelector("img"))));

    // clone first and last for infinite loop
    const firstClone = items[0].cloneNode(true);
    const lastClone = items[items.length - 1].cloneNode(true);
    track.appendChild(firstClone);
    track.insertBefore(lastClone, items[0]);

    // rebuild items array to include clones
    items = Array.from(document.querySelectorAll(".carousel-item"));

    // preload clone images too
    await Promise.all(items.map(item => preloadImage(item.querySelector("img"))));
  }

  // ===== Initialize carousel after preloading =====
  preloadAllImages().then(() => {
    track.classList.add("loaded"); // show track

    let currentIndex = 1;

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

    function updateCarousel(animate = true) {
      track.style.transition = animate ? "transform 0.5s ease" : "none";
      track.style.transform = `translateX(${-getItemOffset(currentIndex)}px)`;
      items.forEach((item, index) => {
        item.classList.toggle("active", index === currentIndex);
      });
    }

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

    updateCarousel(false);

    nextBtn.addEventListener("click", () => {
      currentIndex++;
      updateCarousel(true);
    });

    prevBtn.addEventListener("click", () => {
      currentIndex--;
      updateCarousel(true);
    });

    window.addEventListener("resize", () => updateCarousel(false));
  });
});
