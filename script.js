const MAX_PHOTOS = 12;
const EXTENSIONS = ["jpg", "jpeg", "png", "webp"];
const FEATURED_PHOTOS = [
  "https://uploads.onecompiler.io/44ve7ewwc/455yjgu3t/WhatsApp%20Image%202026-10-12%20at%2020.53.16%20(1).jpeg",
  "https://uploads.onecompiler.io/44ve7ewwc/455yjgu3t/WhatsApp%20Image%202026-10-12%20at%2020.53.16.jpeg",
  "https://uploads.onecompiler.io/44ve7ewwc/455yjgu3t/WhatsApp%20Image%202026-10-12%20at%2020.53.14.jpeg",
  "https://uploads.onecompiler.io/44ve7ewwc/455yjgu3t/Gemini_Generated_Image_iimi9aiimi9aiimi.jfif",
  "https://uploads.onecompiler.io/44ve7ewwc/455yjgu3t/Gemini_Generated_Image_bnvhsmbnvhsmbnvh.jfif"
];


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
    const found = [...FEATURED_PHOTOS];

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

let pageTurning = false;

function turnLightbox(dir) {
  const photos = window.__photos || [];
  if (!photos.length || pageTurning) return;

  const nextIndex = (lbIndex + dir + photos.length) % photos.length;
  const stage = document.querySelector(".lb-stage");
  const nextPage = document.getElementById("lbNextImg");
  const currentPage = document.getElementById("lbImg");
  pageTurning = true;
  nextPage.src = photos[nextIndex];
  stage.classList.remove("turn-next", "turn-prev");
  void stage.offsetWidth;
  stage.classList.add(dir > 0 ? "turn-next" : "turn-prev");

  setTimeout(() => {
    lbIndex = nextIndex;
    currentPage.src = photos[lbIndex];
    nextPage.src = "";
    stage.classList.remove("turn-next", "turn-prev");
    document.getElementById("lbCap").textContent = `Yiğit'in güzel anısı (${lbIndex + 1}/${photos.length})`;
    pageTurning = false;
  }, 620);
}

function closeLightbox() {
  document.getElementById("lightbox").hidden = true;
  document.body.style.overflow = "";
}

function stepLightbox(dir) {
  turnLightbox(dir);
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

function initCountdown() {
  const ids = ["countDays", "countHours", "countMinutes", "countSeconds"];
  const title = document.querySelector(".countdown-title");
  const storageKey = "yigitBirthdayWednesday";
  let targetTime = Number(localStorage.getItem(storageKey));
  let countdownInterval;

  if (!targetTime) {
    const target = new Date();
    const daysUntilWednesday = (3 - target.getDay() + 7) % 7;
    target.setDate(target.getDate() + daysUntilWednesday);
    target.setHours(23, 59, 59, 999);
    targetTime = target.getTime();
    localStorage.setItem(storageKey, String(targetTime));
  }

  function update() {
    const remaining = Math.max(0, targetTime - Date.now());
    const values = [
      Math.floor(remaining / 86400000),
      Math.floor((remaining % 86400000) / 3600000),
      Math.floor((remaining % 3600000) / 60000),
      Math.floor((remaining % 60000) / 1000)
    ];

    ids.forEach((id, index) => {
      document.getElementById(id).textContent = String(values[index]).padStart(2, "0");
    });
    if (remaining === 0) {
      title.textContent = "İyi ki doğdun Yiğit! 🎂";
      window.clearInterval(countdownInterval);
    }
  }

  update();
  countdownInterval = window.setInterval(update, 1000);
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
  initCountdown();

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
