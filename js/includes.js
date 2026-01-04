document.addEventListener("DOMContentLoaded", () => {
  const navContainer = document.getElementById("site-nav");
  if (!navContainer) return;

  const isGithubPages = location.hostname.endsWith("github.io");
  const repoName = isGithubPages ? "/" + location.pathname.split("/")[1] : "";

  fetch(repoName + "/partials/nav.html")
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.text();
    })
    .then((html) => {
      navContainer.innerHTML = html;
    })
    .catch((error) => {
      console.error("Navigation failed to load:", error);
    });
});
