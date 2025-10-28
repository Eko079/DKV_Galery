document.addEventListener("DOMContentLoaded", () => {
  const base = window.__PATH_PREFIX__ || "";

  loadHTML("/header.html", "#header", "/css/header.css", base);
  loadHTML("/footer.html", "#footer", "/css/footer.css", base);

  // ===== Optional: feature marquee logic (safe if not present) =====
  const tracks = document.querySelectorAll(".marquee-track");
  if (tracks.length) {
    tracks.forEach(t => { t.innerHTML += t.innerHTML; });
    const chips = document.querySelectorAll(".feature-section .tag");
    chips.forEach(chip => {
      chip.addEventListener("mouseenter", () => tracks.forEach(tt => tt.style.animationPlayState = "paused"));
      chip.addEventListener("mouseleave", () => tracks.forEach(tt => tt.style.animationPlayState = "running"));
    });
  }
});

function loadHTML(file, targetSelector, cssFile, base) {
  fetch(file)
    .then(res => res.text())
    .then(html => {
      const slot = document.querySelector(targetSelector);
      if (!slot) return;
      slot.innerHTML = html;

      // Attach stylesheet once
      if (cssFile && !document.querySelector(`link[href="${cssFile}"]`)) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = cssFile;
        document.head.appendChild(link);
      }

      // Fix all relative links & images INSIDE the injected partial
      fixRelativeUrls(slot, base);
    })
    .catch(() => {});
}

/* Prefix relative paths with the provided base ("../" on /pages, "" on root) */
function fixRelativeUrls(root, base = "") {
  const isRel = url =>
    url &&
    !url.startsWith("#") &&
    !url.startsWith("mailto:") &&
    !url.startsWith("tel:") &&
    !/^https?:\/\//i.test(url) &&
    !url.startsWith("/") &&        // keep root-absolute intact if you use them
    !url.startsWith("data:");

  // <a href>, <img src>, <link href> (if any inside partial), <script src> (rare)
  root.querySelectorAll("a[href]").forEach(a => {
    const raw = a.getAttribute("href");
    if (isRel(raw)) a.setAttribute("href", base + raw);
  });

  root.querySelectorAll("img[src]").forEach(img => {
    const raw = img.getAttribute("src");
    if (isRel(raw)) img.setAttribute("src", base + raw);

    // graceful fallback: if the logo image fails, keep the text lockup visible
    img.addEventListener("error", () => {
      img.style.display = "none";
      const siblingText = img.nextElementSibling;
      if (siblingText) siblingText.style.display = "inline";
    });
  });

  root.querySelectorAll('link[rel="stylesheet"][href]').forEach(l => {
    const raw = l.getAttribute("href");
    if (isRel(raw)) l.setAttribute("href", base + raw);
  });

  root.querySelectorAll("script[src]").forEach(s => {
    const raw = s.getAttribute("src");
    if (isRel(raw)) s.setAttribute("src", base + raw);
  });
}

