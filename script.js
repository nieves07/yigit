const MAX_PHOTOS = 12;
const EXTENSIONS = ["jpg", "jpeg", "png", "webp"];
const FEATURED_PHOTOS = [
  "https://uploads.onecompiler.io/44ve7ewwc/455yjgu3t/magnific__sana-verdigim-oyuncak-aracn-icerisine-verdigim-kar__73917.png",
  "https://uploads.onecompiler.io/44ve7ewwc/455yjgu3t/1f13f705-4ac7-4ee6-9a3d-9bef4387f91c.jfif",
  "https://uploads.onecompiler.io/44ve7ewwc/455yjgu3t/WhatsApp%20Image%202026-10-12%20at%2020.53.16.jpeg",
  "https://uploads.onecompiler.io/44ve7ewwc/455yjgu3t/WhatsApp%20Image%202026-10-12%20at%2020.53.14.jpeg",
  "https://uploads.onecompiler.io/44ve7ewwc/455yjgu3t/Gemini_Generated_Image_iimi9aiimi9aiimi.jfif",
  "https://uploads.onecompiler.io/44ve7ewwc/455yjgu3t/WhatsApp%20Image%202026-10-12%20at%2021.41.54.jpeg",
  "https://uploads.onecompiler.io/44ve7ewwc/455yjgu3t/WhatsApp%20Image%202026-10-12%20at%2021.34.03.jpeg",
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

function loadGallery() {
  const masonry = document.getElementById("masonry");
  const hint = document.getElementById("galleryHint");
  const photos = [];
  window.__photos = photos;

  function addPhoto(file) {
    const index = photos.length;
    photos.push(file);

    const tile = document.createElement("div");
    tile.className = "tile is-loading";
    tile.innerHTML = `
      <img src="${file}" alt="Yiğit'in fotoğrafı ${index + 1}" loading="lazy" />
      <span class="tile-label">Yiğit 🚗</span>`;
    const image = tile.querySelector("img");
    function markLoaded() {
      tile.classList.remove("is-loading");
      tile.classList.add("is-loaded");
    }
    image.addEventListener("load", markLoaded, { once: true });
    image.addEventListener("error", () => {
      tile.classList.remove("is-loading");
      tile.classList.add("is-error");
    }, { once: true });
    if (image.complete) {
      tile.classList.remove("is-loading");
      tile.classList.add(image.naturalWidth ? "is-loaded" : "is-error");
    }
    tile.addEventListener("click", () => openLightbox(index));
    masonry.appendChild(tile);
  }

  FEATURED_PHOTOS.forEach(addPhoto);
  hint.style.display = photos.length ? "none" : "block";

  for (let i = 1; i <= MAX_PHOTOS; i++) {
    probePhoto(i).then((file) => {
      if (file) {
        hint.style.display = "none";
        addPhoto(file);
      }
    });
  }
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
  const cake = document.getElementById("cake");
  const candles = document.querySelectorAll(".candle");
  const button = document.getElementById("blowBtn");
  const msg = document.getElementById("cakeMsg");
  if (button.disabled) return;

  if (candles[0].classList.contains("out")) {
    candles.forEach((c) => c.classList.remove("out"));
    cake.classList.remove("celebrating");
    msg.textContent = "";
    button.textContent = "Mumları Üfle! 🎂";
    return;
  }

  button.disabled = true;
  button.textContent = "Fuuuu… 💨";
  cake.classList.add("blowing");
  candles.forEach((candle, i) => {
    setTimeout(() => {
      candle.classList.add("out");
      for (let j = 0; j < 3; j++) {
        const smoke = document.createElement("span");
        smoke.className = "candle-smoke";
        smoke.style.animationDelay = `${j * 0.12}s`;
        smoke.style.setProperty("--drift", `${(j - 1) * 18}px`);
        candle.appendChild(smoke);
        setTimeout(() => smoke.remove(), 2000);
      }
    }, 350 + i * 180);
  });

  setTimeout(() => {
    cake.classList.remove("blowing");
    cake.classList.add("celebrating");
    msg.textContent = "Dileğin yıldızlara ulaştı! İyi ki doğdun Yiğit! 🎉";
    for (let i = 0; i < 24; i++) {
      const sparkle = document.createElement("span");
      const angle = (i / 24) * Math.PI * 2;
      sparkle.className = "cake-sparkle";
      sparkle.textContent = i % 3 === 0 ? "✦" : "✧";
      sparkle.style.setProperty("--x", `${Math.cos(angle) * (100 + Math.random() * 65)}px`);
      sparkle.style.setProperty("--y", `${Math.sin(angle) * (75 + Math.random() * 55)}px`);
      sparkle.style.color = ["#fbbf24", "#f472b6", "#818cf8"][i % 3];
      sparkle.style.animationDelay = `${Math.random() * 0.2}s`;
      cake.appendChild(sparkle);
      setTimeout(() => sparkle.remove(), 1800);
    }
    launchConfetti();
    button.disabled = false;
    button.textContent = "Mumları Yeniden Yak ✨";
  }, 350 + candles.length * 180 + 150);
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

function initMusic() {
  const toggle = document.getElementById("musicToggle");
  const seek = document.getElementById("musicSeek");
  const volume = document.getElementById("musicVolume");
  const mute = document.getElementById("musicMute");
  const status = document.getElementById("musicStatus");
  const time = document.getElementById("musicTime");
  const volumeValue = document.getElementById("musicVolumeValue");
  let player;
  let ready = false;
  let playing = false;
  let seeking = false;
  const formatTime = (seconds) => {
    const value = Math.max(0, Math.floor(seconds || 0));
    return `${Math.floor(value / 60)}:${String(value % 60).padStart(2, "0")}`;
  };
  function syncVolume() {
    const muted = player.isMuted() || player.getVolume() === 0;
    mute.textContent = muted ? "🔇" : "🔊";
    mute.setAttribute("aria-pressed", String(muted));
    mute.setAttribute("aria-label", muted ? "Sesi aç" : "Sesi kapat");
    volumeValue.textContent = `%${muted ? 0 : Math.round(player.getVolume())}`;
  }
  function syncTime() {
    if (!ready) return;
    const duration = player.getDuration() || 0;
    seek.max = Math.floor(duration);
    seek.disabled = duration <= 0;
    if (!seeking) seek.value = Math.floor(player.getCurrentTime() || 0);
    time.textContent = `${formatTime(seek.value)} / ${formatTime(duration)}`;
  }
  toggle.addEventListener("click", () => {
    if (!ready) return;
    if (playing) player.pauseVideo();
    else player.playVideo();
  });
  seek.addEventListener("input", () => {
    seeking = true;
    time.textContent = `${formatTime(seek.value)} / ${formatTime(seek.max)}`;
  });
  seek.addEventListener("change", () => {
    if (ready) player.seekTo(Number(seek.value), true);
    seeking = false;
  });
  volume.addEventListener("input", () => {
    if (!ready) return;
    player.setVolume(Number(volume.value));
    if (Number(volume.value) > 0) player.unMute();
    else player.mute();
    syncVolume();
  });
  mute.addEventListener("click", () => {
    if (!ready) return;
    if (player.isMuted() || player.getVolume() === 0) {
      if (player.getVolume() === 0) {
        player.setVolume(70);
        volume.value = 70;
      }
      player.unMute();
    } else player.mute();
    syncVolume();
  });
  const timeout = setTimeout(() => {
    if (!ready) status.textContent = "Oynatıcı yüklenemedi; aşağıdaki bağlantıyı kullanabilirsin.";
  }, 15000);
  function createPlayer() {
    player = new YT.Player("musicVideo", {
      events: {
        onReady: () => {
          clearTimeout(timeout);
          ready = true;
          toggle.disabled = volume.disabled = mute.disabled = false;
          player.setVolume(Number(volume.value));
          status.textContent = "Şarkı hazır 🎵";
          syncVolume();
          syncTime();
          setInterval(syncTime, 500);
        },
        onStateChange: (event) => {
          playing = event.data === YT.PlayerState.PLAYING;
          toggle.textContent = playing ? "❚❚ Duraklat" : "▶ Oynat";
          toggle.setAttribute("aria-label", playing ? "Şarkıyı duraklat" : "Şarkıyı oynat");
          status.textContent = playing ? "Şimdi çalıyor 🎶" : event.data === YT.PlayerState.BUFFERING ? "Yükleniyor…" : "Müzik durdu";
          syncTime();
        },
        onError: () => {
          clearTimeout(timeout);
          ready = false;
          toggle.disabled = seek.disabled = volume.disabled = mute.disabled = true;
          status.textContent = "Şarkı burada oynatılamıyor; YouTube bağlantısını kullanabilirsin.";
        }
      }
    });
  }
  if (window.YT && window.YT.Player) createPlayer();
  else {
    window.onYouTubeIframeAPIReady = createPlayer;
    const api = document.createElement("script");
    api.src = "https://www.youtube.com/iframe_api";
    api.onerror = () => {
      clearTimeout(timeout);
      status.textContent = "Müzik servisine ulaşılamadı; YouTube bağlantısını kullanabilirsin.";
    };
    document.head.appendChild(api);
  }
}

function initNav() {
  const nav = document.getElementById("nav");
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 30);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

function initRace() {
  const canvas = document.getElementById("raceCanvas");
  const ctx = canvas.getContext("2d");
  const start = document.getElementById("raceStart");
  const message = document.getElementById("raceMessage");
  const scoreLabel = document.getElementById("raceScore");
  const timeLabel = document.getElementById("raceTime");
  const bestLabel = document.getElementById("raceBest");
  const livesLabel = document.getElementById("raceLives");
  const left = document.getElementById("raceLeft");
  const right = document.getElementById("raceRight");
  if (!ctx) {
    message.textContent = "Tarayıcınız bu oyunu desteklemiyor.";
    start.disabled = left.disabled = right.disabled = true;
    return;
  }
  let best = 0;
  try { best = Number(localStorage.getItem("yigitRaceBest")) || 0; } catch (_) {}
  bestLabel.textContent = best;
  let running = false;
  let lane = 1;
  let score = 0;
  let lives = 3;
  let starsCollected = 0;
  let roadOffset = 0;
  const raceSpeed = () => Math.min(500, 190 + starsCollected * 15);
  let elapsed = 0;
  let spawn = 0;
  let last = 0;
  let frame = 0;
  let items = [];
  let flash = 0;
  const centers = [140, 300, 460];

  function draw() {
    ctx.clearRect(0, 0, 600, 600);
    ctx.fillStyle = "#0d1324";
    ctx.fillRect(0, 0, 600, 600);
    ctx.fillStyle = "#252b39";
    ctx.fillRect(60, 0, 480, 600);
    for (let y = -40; y < 600; y += 40) {
      ctx.fillStyle = Math.floor(y / 40) % 2 ? "#f472b6" : "#f1f4fc";
      ctx.fillRect(48, y, 12, 38);
      ctx.fillRect(540, y, 12, 38);
    }
    ctx.strokeStyle = "rgba(255,255,255,0.45)";
    ctx.lineWidth = 4;
    ctx.setLineDash([30, 30]);
    ctx.lineDashOffset = -roadOffset;
    for (const x of [220, 380]) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 600); ctx.stroke();
    }
    ctx.setLineDash([]);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (const item of items) {
      ctx.font = item.star ? "44px sans-serif" : "48px sans-serif";
      ctx.fillStyle = "#fbbf24";
      ctx.fillText(item.star ? "★" : "🚧", centers[item.lane], item.y);
    }
    const x = centers[lane];
    ctx.fillStyle = "#070b18";
    ctx.fillRect(x - 35, 468, 12, 28); ctx.fillRect(x + 23, 468, 12, 28);
    ctx.fillRect(x - 35, 526, 12, 28); ctx.fillRect(x + 23, 526, 12, 28);
    ctx.fillStyle = "#818cf8";
    ctx.fillRect(x - 26, 460, 52, 100);
    ctx.fillStyle = "#bfe9ff";
    ctx.fillRect(x - 20, 481, 40, 22);
    ctx.fillStyle = "#f472b6";
    ctx.fillRect(x - 6, 460, 12, 100);
    ctx.fillStyle = "#fff3bd";
    ctx.fillRect(x - 22, 462, 10, 6); ctx.fillRect(x + 12, 462, 10, 6);
    if (flash > 0) {
      ctx.fillStyle = `rgba(244,114,182,${flash * 0.35})`;
      ctx.fillRect(0, 0, 600, 600);
    }
  }
  function finish(text) {
    running = false;
    cancelAnimationFrame(frame);
    start.textContent = "Tekrar Yarış 🏁";
    left.disabled = right.disabled = true;
    message.textContent = `${text} Puanın: ${score}.`;
    if (score > best) {
      best = score;
      bestLabel.textContent = best;
      message.textContent += " Yeni rekor! 🏆";
      try { localStorage.setItem("yigitRaceBest", String(best)); } catch (_) {}
    }
    draw();
  }
  function tick(now) {
    if (!running) return;
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    elapsed += dt;
    spawn += dt;
    const speed = raceSpeed();
    roadOffset = (roadOffset + speed * dt) % 60;
    flash = Math.max(0, flash - dt * 2);
    if (spawn >= Math.max(0.5, 0.85 - starsCollected * 0.015)) {
      spawn = 0;
      items.push({ lane: Math.floor(Math.random() * 3), y: -40, star: Math.random() < 0.72 });
    }
    for (const item of items) {
      item.y += speed * dt;
      if (!item.hit && item.lane === lane && Math.abs(item.y - 510) < 55) {
        item.hit = true;
        score = item.star ? score + 10 : Math.max(0, score - 15);
        if (item.star) {
          starsCollected++;
          message.textContent = `★ ${starsCollected} yıldız · Hız: ${(raceSpeed() / 190).toFixed(1)}× · Haydi şampiyon!`;
        } else {
          flash = 1;
          lives--;
          livesLabel.textContent = lives;
          message.textContent = `Çarptın! Kalan can: ${lives} ❤️`;
        }
        scoreLabel.textContent = score;
        if (lives === 0) {
          items = items.filter((item) => !item.hit);
          return finish("3 kez çarptın, yarış bitti! 🏁");
        }
      }
    }
    items = items.filter((item) => !item.hit && item.y < 650);
    timeLabel.textContent = Math.max(0, Math.ceil(45 - elapsed));
    draw();
    if (elapsed >= 45) return finish("Yarış tamamlandı! 🎉");
    frame = requestAnimationFrame(tick);
  }
  function move(direction) { if (running) { lane = Math.max(0, Math.min(2, lane + direction)); draw(); } }
  left.addEventListener("click", () => move(-1));
  right.addEventListener("click", () => move(1));
  start.addEventListener("click", () => {
    if (running) return finish("Yarış durduruldu.");
    lane = 1; score = 0; lives = 3; starsCollected = 0; roadOffset = 0;
    elapsed = 0; spawn = 0; items = []; flash = 0;
    scoreLabel.textContent = "0"; timeLabel.textContent = "45";
    livesLabel.textContent = "3";
    message.textContent = "★ +10 puan ve hız artışı · 🚧 −15 puan ve −1 can · 3 can ❤️";
    start.textContent = "Yarışı Durdur";
    left.disabled = right.disabled = false;
    running = true;
    last = performance.now();
    frame = requestAnimationFrame(tick);
  });
  document.addEventListener("keydown", (event) => {
    if (!running || !document.getElementById("lightbox").hidden) return;
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      move(event.key === "ArrowLeft" ? -1 : 1);
    }
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && running) finish("Sekme değiştiği için yarış durduruldu.");
  });
  left.disabled = right.disabled = true;
  draw();
}

document.addEventListener("DOMContentLoaded", () => {
  initMusic();
  initRace();
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
