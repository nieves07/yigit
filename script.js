const MAX_PHOTOS = 12;
const EXTENSIONS = ["jpg", "jpeg", "png", "webp"];

function probePhoto(index) {
  return new Promise((resolve) => {
    let extIndex = 0;
    const tryNext = () => {
      if (extIndex >= EXTENSIONS.length) return resolve(null);
      const file = `photos/${index}.${EXTENSIONS[extIndex++]}`;
      const img = new Image();
      img.onload = () => resolve(file);
      img.onerror = tryNext;
      img.src = file;
    };
    tryNext();
  });
}

async function loadGallery() {
  const masonry = document.getElementById("masonry");
  const hint = document.getElementById("galleryHint");
  const found = [];

  for (let i = 1; i <= MAX_PHOTOS; i++) {
    const file = await probePhoto(i);
    if (file) found.push(file);
  }

  if (found.length === 0) {
    hint.style.display = "block";
    masonry.innerHTML = `
      <div class="tile">
        <div class="tile-placeholder">
          <span class="ph-icon">🚗</span>
          <span>Fotoğraflar burada belirecek</span>
          <span>photos/1.jpg, photos/2.jpg ...</span>
        </div>
      </div>`;
    return;
  }

  hint.style.display = "none";

  found.forEach((file, i) => {
    const tile = document.createElement("div");
    tile.className = "tile";
    tile.style.animationDelay = `${i * 0.07}s`;
    tile.innerHTML = `
      <img src="${file}" alt="Yiğit'in fotoğrafı ${i + 1}" loading="lazy" />
      <span class="tile-label">Yiğit 🚗</span>`;
    tile.addEventListener("click", () => openLightbox(i));
    masonry.appendChild(tile);
  });

  window.__photos = found;
}

let lbIndex = 0;

function openLightbox(index) {
  const photos = window.__photos || [];
  if (!photos.length) return;
  lbIndex = index;
  const lightbox = document.getElementById("lightbox");
  lightbox.hidden = false;
  renderLightbox();
  document.body.style.overflow = "hidden";
}

function renderLightbox() {
  const photos = window.__photos || [];
  document.getElementById("lbImg").src = photos[lbIndex];
  document.getElementById("lbCap").textContent = `Yiğit'in güzel anısı (${lbIndex + 1}/${photos.length})`;
}

function closeLightbox() {
  document.getElementById("lightbox").hidden = true;
  document.body.style.overflow = "";
}

function stepLightbox(dir) {
  const photos = window.__photos || [];
  lbIndex = (lbIndex + dir + photos.length) % photos.length;
  renderLightbox();
}

function blowCandles() {
  const candles = document.querySelectorAll(".candle");
  const alreadyOut = candles[0].classList.contains("out");
  const msg = document.getElementById("cakeMsg");

  if (alreadyOut) {
    candles.forEach((c) => c.classList.remove("out"));
    msg.textContent = "";
    document.getElementById("blowBtn").textContent = "Mumları Üfle! 🎂";
    return;
  }

  candles.forEach((c, i) => setTimeout(() => c.classList.add("out"), i * 220));
  setTimeout(() => {
    msg.textContent = "Tebrikler! Dileğin kabul oldu 🎉";
    launchConfetti();
  }, candles.length * 220 + 200);
  document.getElementById("blowBtn").textContent = "Tekrar Üfle 🔁";
}

function launchConfetti() {
  const colors = ["#ef5350", "#ffd54f", "#66bb6a", "#4fc3f7", "#ab47bc", "#ff7043"];
  for (let i = 0; i < 90; i++) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    piece.style.left = Math.random() * 100 + "vw";
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDuration = 2.2 + Math.random() * 2 + "s";
    piece.style.animationDelay = Math.random() * 0.6 + "s";
    piece.style.width = 8 + Math.random() * 8 + "px";
    piece.style.height = 12 + Math.random() * 10 + "px";
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 5000);
  }
}

function initReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}

function initNav() {
  const nav = document.getElementById("nav");
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 30);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

document.addEventListener("DOMContentLoaded", () => {
  loadGallery();
  initReveal();
  initNav();

  document.getElementById("lbClose").addEventListener("click", closeLightbox);
  document.getElementById("lbPrev").addEventListener("click", () => stepLightbox(-1));
  document.getElementById("lbNext").addEventListener("click", () => stepLightbox(1));
  document.getElementById("lightbox").addEventListener("click", (e) => {
    if (e.target.id === "lightbox") closeLightbox();
  });
  document.getElementById("blowBtn").addEventListener("click", blowCandles);

  document.addEventListener("keydown", (e) => {
    if (document.getElementById("lightbox").hidden) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") stepLightbox(-1);
    if (e.key === "ArrowRight") stepLightbox(1);
  });
});
