document.addEventListener("DOMContentLoaded", () => {
  const giftBox = document.getElementById("gift-box");
  const giftModal = document.getElementById("gift-modal");
  const mainContent = document.getElementById("main-content");
  
  // Single Audio Engine to bypass browser autoplay/switching blocks
  const bgMusic = document.getElementById("bg-music-1");
  const musicBtn = document.getElementById("music-toggle-btn");

  const candle = document.getElementById("candle");
  const flame = document.getElementById("flame");
  const cakeStatus = document.getElementById("cake-status-text");
  const deniseVideo = document.getElementById("denise-video");

  // Playlist array
  const playlist = [
    "./assets/birthday_song.mp3",
    "./assets/birthday-song2.mp3"
  ];
  let currentTrackIndex = 0;
  let isPlaying = false;

  // ==========================================
  // 1. PLAYLIST ENGINE (SWITCHES TRACKS RELIABLY)
  // ==========================================
  function startAudio() {
    bgMusic.src = playlist[currentTrackIndex];
    bgMusic.volume = 1.0;
    bgMusic.play().then(() => {
      isPlaying = true;
      if (musicBtn) musicBtn.innerText = "🎵 Pause Music";
    }).catch(err => console.log("Audio play error:", err));
  }

  // When current track ends, advance to next track automatically
  if (bgMusic) {
    bgMusic.addEventListener("ended", () => {
      currentTrackIndex = (currentTrackIndex + 1) % playlist.length; // Loops back to 0 after last track
      bgMusic.src = playlist[currentTrackIndex];
      bgMusic.play().catch(err => console.log("Track transition error:", err));
    });
  }

  // Toggle button for audio playback
  if (musicBtn) {
    musicBtn.addEventListener("click", () => {
      if (isPlaying) {
        bgMusic.pause();
        musicBtn.innerText = "🎵 Play Music";
        isPlaying = false;
      } else {
        bgMusic.play();
        musicBtn.innerText = "🎵 Pause Music";
        isPlaying = true;
      }
    });
  }

  // ==========================================
  // 2. GIFT BOX UNWRAPPING INTERACTION
  // ==========================================
  if (giftBox) {
    giftBox.addEventListener("click", () => {
      giftBox.classList.add("opened");
      
      // Start playlist on explicit user click
      startAudio();

      // Launch initial celebratory confetti burst
      launchConfetti(300);

      // Reveal main page after gift lid opens
      setTimeout(() => {
        if (giftModal) giftModal.classList.add("hidden");
        if (mainContent) mainContent.classList.remove("content-hidden");
        startSparkles();
        initScrollReveal();
      }, 700);
    });
  }

  // ==========================================
  // 3. VIDEO POSTER RESET ON FINISH
  // ==========================================
  if (deniseVideo) {
    deniseVideo.addEventListener("ended", () => {
      deniseVideo.load(); // Reloads video element to reset back to cover photo
    });
  }

  // ==========================================
  // 4. COUNTDOWN TIMER TO DENISE'S NEXT BIRTHDAY (Oct 29, 2027)
  // ==========================================
  function updateCountdown() {
    const nextBirthday = new Date("October 29, 2027 00:00:00").getTime();
    const now = new Date().getTime();
    const diff = nextBirthday - now;

    if (diff > 0) {
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      const dElem = document.getElementById("days");
      const hElem = document.getElementById("hours");
      const mElem = document.getElementById("minutes");
      const sElem = document.getElementById("seconds");

      if (dElem) dElem.innerText = d < 10 ? "0" + d : d;
      if (hElem) hElem.innerText = h < 10 ? "0" + h : h;
      if (mElem) mElem.innerText = m < 10 ? "0" + m : m;
      if (sElem) sElem.innerText = s < 10 ? "0" + s : s;
    }
  }
  setInterval(updateCountdown, 1000);
  updateCountdown();

  // ==========================================
  // 5. INTERACTIVE VIRTUAL CAKE & CANDLE
  // ==========================================
  if (candle) {
    candle.addEventListener("click", () => {
      if (!flame.classList.contains("out")) {
        flame.classList.add("out");
        cakeStatus.innerText = "✨ Wish Granted! Happy 29th Birthday Denise! 🎉👑";
        launchConfetti(250);
      }
    });
  }

  // ==========================================
  // 6. CONTINUOUS SMOOTH SCROLL REVEAL OBSERVER
  // ==========================================
  function initScrollReveal() {
    const revealElements = document.querySelectorAll(".reveal-on-scroll");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        } else {
          // Removes class when out of view so it animates continuously whenever scrolled past!
          entry.target.classList.remove("visible");
        }
      });
    }, { threshold: 0.15 });

    revealElements.forEach(el => observer.observe(el));
  }

  // ==========================================
  // 7. DENSE CONFETTI CANVAS ENGINE
  // ==========================================
  const confettiCanvas = document.getElementById("confetti-canvas");
  const ctx = confettiCanvas ? confettiCanvas.getContext("2d") : null;
  let particles = [];

  function resizeCanvas() {
    if (!confettiCanvas) return;
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  function launchConfetti(count = 200) {
    if (!confettiCanvas || !ctx) return;
    const colors = ["#ffd700", "#8a2be2", "#b15eff", "#ffffff", "#ff69b4", "#ff4500"];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: confettiCanvas.width / 2 + (Math.random() - 0.5) * 200,
        y: confettiCanvas.height / 3,
        vx: (Math.random() - 0.5) * 18,
        vy: (Math.random() - 0.5) * 18 - 4,
        size: Math.random() * 9 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rSpeed: (Math.random() - 0.5) * 12
      });
    }
    if (particles.length === count) {
      animateConfetti();
    }
  }

  function animateConfetti() {
    if (!ctx) return;
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    particles.forEach((p, idx) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.22; // Gravity physics
      p.rotation += p.rSpeed;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();

      if (p.y > confettiCanvas.height) particles.splice(idx, 1);
    });

    if (particles.length > 0) {
      requestAnimationFrame(animateConfetti);
    }
  }

  // ==========================================
  // 8. AMBIENT SPARKLE PARTICLES
  // ==========================================
  function startSparkles() {
    const canvas = document.getElementById("sparkle-canvas");
    if (!canvas) return;
    const sCtx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const sparkles = Array.from({ length: 50 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2 + 1,
      alpha: Math.random(),
      speed: Math.random() * 0.02 + 0.005
    }));

    function drawSparkles() {
      sCtx.clearRect(0, 0, canvas.width, canvas.height);
      sparkles.forEach(s => {
        s.alpha += s.speed;
        if (s.alpha > 1 || s.alpha < 0) s.speed = -s.speed;

        sCtx.beginPath();
        sCtx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        sCtx.fillStyle = `rgba(255, 215, 0, ${Math.abs(s.alpha)})`;
        sCtx.fill();
      });
      requestAnimationFrame(drawSparkles);
    }
    drawSparkles();
  }
});