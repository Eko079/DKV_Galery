// main.js

document.addEventListener("DOMContentLoaded", () => {
  // 'base' masih berguna untuk fungsi 'fixRelativeUrls' nanti,
  // tapi jangan gunakan untuk panggilan 'loadHTML'.
  const base = window.__PATH_PREFIX__ || "";

  // ⬇️ PERUBAHAN DI SINI ⬇️
  // Gunakan "/" untuk memulai dari folder root domain Anda.

  loadHTML("/header.html", "#header", "/css/header.css", base);
  loadHTML("/footer.html", "#footer", "/css/footer.css", base);

  // ... sisa kode Anda (marquee, dll.) ...
});

function loadHTML(file, targetSelector, cssFile, base) {
  fetch(file) // 'file' sekarang adalah "/header.html", ini path yang benar
    .then(res => {
      // ❗️ Tambahkan ini untuk debugging! Jangan biarkan catch kosong!
      if (!res.ok) {
        console.error(`Gagal memuat ${file}. Status: ${res.status} (Not Found)`);
        throw new Error('Gagal memuat file');
      }
      return res.text();
    })
    .then(html => {
      const slot = document.querySelector(targetSelector);
      if (!slot) return;
      slot.innerHTML = html;

      // Attach stylesheet
      // 'cssFile' sekarang juga path absolut seperti "/css/header.css"
      if (cssFile && !document.querySelector(`link[href="${cssFile}"]`)) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = cssFile;
        document.head.appendChild(link);
      }

      // Fungsi ini sudah benar, 'base' digunakan untuk memperbaiki link
      // *di dalam* HTML yang baru dimuat (misal: <a href="pages/about.html">)
      fixRelativeUrls(slot, base);
    })
    .catch((err) => {
      // ❗️ Jangan sembunyikan error!
      console.warn(`Gagal menjalankan loadHTML untuk ${file}:`, err);
    });
}

/* Fungsi fixRelativeUrls Anda (Tidak perlu diubah) */
function fixRelativeUrls(root, base = "") {
  // ... kode Anda ...
}
