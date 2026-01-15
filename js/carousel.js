document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".carousel-track");
  const prevBtn = document.querySelector(".carousel-btn.left");
  const nextBtn = document.querySelector(".carousel-btn.right");
  if (!track || !prevBtn || !nextBtn) return;

  let items = Array.from(document.querySelectorAll(".carousel-item"));
  let currentIndex = 1;

  // Preload images
  items.forEach(item => {
    const img = item.querySelector("img");
    if (img) {
      const preload = new Image();
      preload.src = img.src;
    }
  });

  // clone first and last items
  const firstClone = items[0].cloneNode(true);
  const lastClone = items[items.length - 1].cloneNode(true);
  track.appendChild(firstClone);
  track.insertBefore(lastClone, items[0]);
  items = Array.from(document.querySelectorAll(".carousel-item"));

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

  // Snap to real item after transition
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

  // initial
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
