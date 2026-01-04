document.addEventListener("DOMContentLoaded", () => {
  const navContainer = document.getElementById("site-nav");

  if (!navContainer) return;

  fetch("partials/nav.html")
    .then(response => response.text())
    .then(html => {
      navContainer.innerHTML = html;
    })
    .catch(error => {
      console.error("Navigation failed to load:", error);
    });
});
