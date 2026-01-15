// js/carousel.js (replace current file)
document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".carousel-track");
  const prevBtn = document.querySelector(".carousel-btn.left");
  const nextBtn = document.querySelector(".carousel-btn.right");
  if (!track || !prevBtn || !nextBtn) return;

  // Grab all original items (before cloning)
  let items = Array.from(track.querySelectorAll(".carousel-item"));

  // --- Clone first and last immediately for infinite loop (so clones are preloaded too)
  const firstClone = items[0].cloneNode(true);
  const lastClone = items[items.length - 1].cloneNode(true);
  track.appendChild(firstClone);
  track.insertBefore(lastClone, items[0]);

  // Rebuild items array now that clones are inserted
  items = Array.from(track.querySelectorAll(".carousel-item"));

  // ===== Helper: preload & decode a single image (ensures browser has bitmap decoded) =====
  function preloadImageAndDecode(img) {
    return new Promise((resolve) => {
      if (!img) return resolve();
      // If already complete and has natural size, try decode (safer)
      if (img.complete && img.naturalWidth) {
        if (typeof img.decode === "function") {
          img.decode().then(resolve).catch(resolve);
        } else {
          resolve();
        }
        return;
      }

      // Otherwise wait for load/error then decode
      const onLoad = () => {
        if (typeof img.decode === "function") {
          img.decode().then(cleanup).catch(cleanup);
        } else {
          cleanup();
        }
      };
      const onError = () => cleanup();
      function cleanup() {
        img.removeEventListener("load", onLoad);
        img.removeEventListener("error", onError);
        resolve();
      }
      img.addEventListener("load", onLoad);
      img.addEventListener("error", onError);

      // In case src was not set or browser optimized caching; reassigning isn't necessary,
      // but this ensures the browser has begun fetching if it hadn't already.
      // img.src = img.src;
    });
  }

  // ===== Preload & decode all carousel images (including clones) =====
  async function preloadAll() {
    const imgs = items.map(i => i.querySelector("img")).filter(Boolean);
    await Promise.all(imgs.map(preloadImageAndDecode));
  }

  // ===== Initialize carousel AFTER all images decoded =====
  preloadAll().then(() => {
    // show the track once everything is ready (CSS .loaded controls visibility)
    track.classList.add("loaded");

    let currentIndex = 1; // start at first real item

    // calculate center offset for any index (accounts for margin)
    function getOffset(index) {
      const item = items[index];
      const trackWidth = track.offsetWidth;
      const itemWidth = item.offsetWidth;
      const style = window.getComputedStyle(item);
      const marginRight = parseFloat(style.marginRight) || 0;
      const marginLeft = parseFloat(style.marginLeft) || 0;
      const totalWidth = itemWidth + marginLeft + marginRight;
      return totalWidth * index - trackWidth / 2 + totalWidth / 2;
    }

    // update transform and active class
    function update(animate = true) {
      track.style.transition = animate ? "transform 0.5s ease" : "none";
      track.style.transform = `translateX(${-getOffset(currentIndex)}px)`;
      items.forEach((it, i) => it.classList.toggle("active", i === currentIndex));
    }

    // snap when landing on clones
    track.addEventListener("transitionend", () => {
      if (currentIndex === 0) {
        track.style.transition = "none";
        currentIndex = items.length - 2;
        update(false);
      } else if (currentIndex === items.length - 1) {
        track.style.transition = "none";
        currentIndex = 1;
        update(false);
      }
    });

    // initial placement
    update(false);

    // extra stabilization: re-run update across next frames in case of small late layout shifts
    requestAnimationFrame(() => update(false));
    setTimeout(() => update(false), 40);
    setTimeout(() => update(false), 200);
    setTimeout(() => update(false), 600);

    // observe DOM mutations briefly (catches late nav/content injection like includes.js)
    // we'll re-run update(false) on first mutation and disconnect after a few triggers.
    let mutationsHandled = 0;
    const mo = new MutationObserver((mutations) => {
      // if mutation affects layout (childList, attributes etc.), recenter once or twice
      mutationsHandled++;
      update(false);
      if (mutationsHandled > 3) mo.disconnect();
    });
    mo.observe(document.body, { childList: true, subtree: true, attributes: true });

    // next / prev handlers
    nextBtn.addEventListener("click", () => {
      currentIndex++;
      update(true);
    });

    prevBtn.addEventListener("click", () => {
      currentIndex--;
      update(true);
    });

    // recenter on resize
    window.addEventListener("resize", () => update(false));
  }).catch((err) => {
    // If preload somehow fails, fallback to enabling the carousel but still attempt to center.
    console.warn("Carousel preload failed or errored:", err);
    track.classList.add("loaded");
    // We still want the carousel to function; set a basic init if needed.
    let currentIndex = 1;
    function getOffset(index) {
      const item = Array.from(track.querySelectorAll(".carousel-item"))[index];
      const trackWidth = track.offsetWidth;
      return item ? (item.offsetWidth * index - trackWidth / 2 + item.offsetWidth / 2) : 0;
    }
    function update(animate = true) {
      track.style.transition = animate ? "transform 0.5s ease" : "none";
      track.style.transform = `translateX(${-getOffset(currentIndex)}px)`;
    }
    update(false);
    nextBtn.addEventListener("click", () => { currentIndex++; update(true); });
    prevBtn.addEventListener("click", () => { currentIndex--; update(true); });
    window.addEventListener("resize", () => update(false));
  });
});
