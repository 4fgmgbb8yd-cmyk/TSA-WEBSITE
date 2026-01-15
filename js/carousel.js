document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".carousel-track");
  const prevBtn = document.querySelector(".carousel-btn.left");
  const nextBtn = document.querySelector(".carousel-btn.right");
  if (!track || !prevBtn || !nextBtn) return;

  let items = Array.from(track.querySelectorAll(".carousel-item"));

  // ===== Clone first & last for infinite loop =====
  const firstClone = items[0].cloneNode(true);
  const lastClone = items[items.length - 1].cloneNode(true);
  track.appendChild(firstClone);
  track.insertBefore(lastClone, items[0]);
  items = Array.from(track.querySelectorAll(".carousel-item"));

  // ===== Preload all images =====
  function preloadImage(img) {
    return new Promise(resolve => {
      if (!img) return resolve();
      if (img.complete) return resolve();
      const preload = new Image();
      preload.src = img.src;
      preload.onload = () => resolve();
      preload.onerror = () => resolve();
    });
  }

  async function preloadAll() {
    await Promise.all(items.map(item => preloadImage(item.querySelector("img"))));
  }

  preloadAll().then(() => {
    track.classList.add("loaded");

    let currentIndex = 1; // start at first real item

    // ===== Helper: calculate total width of item including margins =====
    function getTotalWidth(item) {
      const style = window.getComputedStyle(item);
      const marginLeft = parseFloat(style.marginLeft) || 0;
      const marginRight = parseFloat(style.marginRight) || 0;
      return item.offsetWidth + marginLeft + marginRight;
    }

    // ===== Calculate offset to center active item =====
    function getOffset(index) {
      const trackWidth = track.offsetWidth;
      let offset = 0;
      for (let i = 0; i < index; i++) {
        offset += getTotalWidth(items[i]);
      }
      offset += getTotalWidth(items[index]) / 2 - trackWidth / 2;
      return offset;
    }

    // ===== Update carousel position =====
    function update(animate = true) {
      track.style.transition = animate ? "transform 0.5s ease" : "none";
      track.style.transform = `translateX(${-getOffset(currentIndex)}px)`;

      items.forEach((item, i) => {
        item.classList.toggle("active", i === currentIndex);
      });
    }

    // ===== Infinite loop snap =====
    track.addEventListener("transitionend", () => {
      if (currentIndex === 0) {
        track.style.transition = "none";
        currentIndex = items.length - 2;
        update(false);
      }
      if (currentIndex === items.length - 1) {
        track.style.transition = "none";
        currentIndex = 1;
        update(false);
      }
    });

    // ===== Buttons =====
    nextBtn.addEventListener("click", () => {
      currentIndex++;
      update(true);
    });

    prevBtn.addEventListener("click", () => {
      currentIndex--;
      update(true);
    });

    // ===== Responsive =====
    window.addEventListener("resize", () => update(false));

    // ===== Initial render =====
    update(false);
  });
});
