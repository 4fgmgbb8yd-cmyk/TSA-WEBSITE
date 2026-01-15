document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".carousel-track");
  const prevBtn = document.querySelector(".carousel-btn.left");
  const nextBtn = document.querySelector(".carousel-btn.right");
  if (!track || !prevBtn || !nextBtn) return;

  let items = Array.from(document.querySelectorAll(".carousel-item"));
  let currentIndex = 1;

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
    const itemStyle = window.getComputedStyle(item);
    const marginRight = parseFloat(itemStyle.marginRight);
    const marginLeft = parseFloat(itemStyle.marginLeft);
    const totalWidth = itemWidth + marginLeft + marginRight;
    return totalWidth * index - trackWidth / 2 + totalWidth / 2;
  }

  function updateCarousel(animate = true) {
    track.style.transition = animate ? "transform 0.5s ease" : "none";
    const offset = getItemOffset(currentIndex);
    track.style.transform = `translateX(${-offset}px)`;

    items.forEach((item, index) => {
      item.classList.toggle("active", index === currentIndex);
    });
  }

  // initial
  updateCarousel(false);

  // next
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

  // prev
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

  // responsive
  window.addEventListener("resize", () => {
    updateCarousel(false);
  });
});
