document.addEventListener("DOMContentLoaded", () => {
  const giftBox = document.getElementById("gift-box");
  const giftModal = document.getElementById("gift-modal");
  const mainContent = document.getElementById("main-content");
  
  const music1 = document.getElementById("bg-music-1");
  const music2 = document.getElementById("bg-music-2");
  const musicBtn = document.getElementById("music-toggle-btn");

  const candle = document.getElementById("candle");
  const flame = document.getElementById("flame");
  const cakeStatus = document.getElementById("cake-status-text");
  const deniseVideo = document.getElementById("denise-video");

  let currentTrack = 1;
  let isPlaying = false;

  // ==========================================
  // 1. DUAL AUDIO PLAYLIST SYSTEM WITH CROSSFADE
  // ==========================================
  function playTrack(trackNum) {
    if (trackNum === 1) {
      music2.pause();
      music2.currentTime = 0;
      music1.volume = 1.0;
      music1.play().catch(err => console.log("Autoplay check:", err));
      currentTrack = 1;
    } else {
      music1.pause();
      music1.currentTime = 0;
      music2.volume = 1.0;
      music2.play().catch(err => console.log("Autoplay check:", err));
      currentTrack = 2;
    }
    isPlaying = true;
    musicBtn.innerText = "🎵 Pause Music";
  }

  // Crossfade transition when song 1 ends -> transition to song 2
  music1.addEventListener("ended", () => {
    fadeCrossTrack(music1, music2, 2);
  });

  // Crossfade transition when song 2 ends -> loop back to song 1
  music2.addEventListener("ended", () => {
    fadeCrossTrack(music2, music1, 1);
  });

  function fadeCrossTrack(activeAudio, nextAudio, nextTrackNum) {
    let fadeInterval = setInterval(() => {
      if (activeAudio.volume > 0.1) {
        activeAudio.volume -= 0.1;
      } else {
        clearInterval(fadeInterval);
        activeAudio.pause();
        activeAudio.currentTime = 0;
        playTrack(nextTrackNum);
      }
    }, 150);
  }

  // Toggle button for audio playback
  musicBtn.addEventListener("click", () => {
    const activeAudio = currentTrack === 1 ? music1 : music2;
    if (isPlaying) {
      activeAudio.pause();
      musicBtn.innerText = "🎵 Play Music";
      isPlaying = false;
    } else {
      activeAudio.play();
      musicBtn.innerText = "🎵 Pause Music";
      isPlaying = true;
    }
  });

  // ==========================================
  // 2. GIFT BOX UNWRAPPING INTERACTION
  // ==========================================
  giftBox.addEventListener("click", () => {
    giftBox.classList.add("opened");
    
    // Start playlist
    playTrack(1);

    // Launch initial celebratory dense confetti burst
    launchConfetti(300);

    // Reveal main page after gift lid opens
    setTimeout(() => {
      giftModal.classList.add("hidden");
      mainContent.classList.remove("content-hidden");
      startSparkles();
      initScrollReveal();
    }, 700);
  });

  // ==========================================
  // 3. VIDEO POSTER RESET ON FINISH
  // ==========================================
  if (deniseVideo) {
    deniseVideo.addEventListener("ended", () => {
      deniseVideo.load(); // Reloads video element to reset back to cover photo/poster
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
  // 6. SMOOTH SCROLL REVEAL OBSERVER
  // ==========================================
  function initScrollReveal() {
    const revealElements = document.querySelectorAll(".reveal-on-scroll");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    }, { threshold: 0.15 });

    revealElements.forEach(el => observer.observe(el));
  }

  // ==========================================
  // 7. DENSE CONFETTI CANVAS ENGINE
  // ==========================================
  const confettiCanvas = document.getElementById("confetti-canvas");
  const ctx = confettiCanvas.getContext("2d");
  let particles = [];

  function resizeCanvas() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  function launchConfetti(count = 200) {
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