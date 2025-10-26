document.addEventListener("DOMContentLoaded", () => {
  loadHTML("header.html", "#header", "css/header.css");
  loadHTML("footer.html", "#footer", "css/footer.css");
});

function loadHTML(file, targetSelector, cssFile) {
  fetch(file)
    .then(res => res.text())
    .then(data => {
      document.querySelector(targetSelector).innerHTML = data;
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = cssFile;
      document.head.appendChild(link);
    });
}
