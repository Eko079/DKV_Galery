/* ===== main.js (Lengkap dengan Perbaikan) ===== */

document.addEventListener("DOMContentLoaded", () => {
  // 'base' ini tetap berguna untuk fungsi fixRelativeUrls
  const base = window.__PATH_PREFIX__ || "";

  // --- PERUBAHAN UTAMA ---
  // Kita gunakan path absolut (dimulai dengan "/") agar server
  // selalu mencari file dari folder root (domain.com/header.html).
  // Ini sesuai dengan struktur folder Anda.
  loadHTML("/header.html", "#header", "/css/header.css", base);
  loadHTML("/footer.html", "#footer", "/css/footer.css", base);
  // -----------------------

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

/**
 * Memuat file HTML partial ke dalam elemen target.
 * @param {string} file - Path absolut ke file HTML (misal: "/header.html")
 * @param {string} targetSelector - Selector CSS untuk elemen target (misal: "#header")
 * @param {string} cssFile - Path absolut ke file CSS terkait (misal: "/css/header.css")
 * @param {string} base - Path prefix (biasanya "" atau "../") untuk fixRelativeUrls
 */
function loadHTML(file, targetSelector, cssFile, base) {
  fetch(file) // 'file' sekarang = "/header.html" atau "/footer.html"
    .then(res => {
      // --- PERBAIKAN ERROR HANDLING ---
      // Cek apakah file-nya 404 Not Found atau error lain
      if (!res.ok) {
        console.error(`Gagal memuat ${file}. Status: ${res.status} (Not Found)`);
        throw new Error(`Server tidak menemukan file: ${file}`);
      }
      // ------------------------------
      return res.text();
    })
    .then(html => {
      const slot = document.querySelector(targetSelector);
      if (!slot) {
        // Peringatan jika elemen <div id="header"> tidak ditemukan
        console.warn(`Elemen target "${targetSelector}" tidak ditemukan di halaman ini.`);
        return;
      }
      slot.innerHTML = html;

      // Attach stylesheet 'cssFile' sekarang = "/css/header.css", dll.
      if (cssFile && !document.querySelector(`link[href="${cssFile}"]`)) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = cssFile;
        document.head.appendChild(link);
      }

      // Fix all relative links & images INSIDE the injected partial
      fixRelativeUrls(slot, base); // 'base' digunakan di sini
    })
    .catch((err) => {
      // --- PERBAIKAN ERROR HANDLING ---
      // Jangan sembunyikan error! Tampilkan di console (F12) browser.
      console.warn(`Gagal menjalankan loadHTML untuk ${file}:`, err);
    });
}

/* * Prefix relative paths with the provided base ("../" on /pages, "" on root) 
 * --- TIDAK ADA PERUBAHAN DI FUNGSI INI ---
 */
function fixRelativeUrls(root, base = "") {
  const isRel = url =>
    url &&
    !url.startsWith("#") &&
    !url.startsWith("mailto:") &&
    !url.startsWith("tel:") &&
    !/^https?:\/\//i.test(url) &&
    !url.startsWith("/") &&        // keep root-absolute intact
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
    const raw = s.getAttribute("href");
    if (isRel(raw)) s.setAttribute("href", base + raw);
  });
}
