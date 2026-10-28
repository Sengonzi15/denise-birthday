document.addEventListener("DOMContentLoaded", () => {
  const giftBox = document.getElementById("gift-box");
  const giftModal = document.getElementById("gift-modal");
  const mainContent = document.getElementById("main-content");
  const bgMusic = document.getElementById("bg-music");
  const musicBtn = document.getElementById("music-toggle-btn");
  const candle = document.getElementById("candle");
  const flame = document.getElementById("flame");
  const cakeStatus = document.getElementById("cake-status-text");

  // 1. Gift Opening Interaction
  giftBox.addEventListener("click", () => {
    giftBox.classList.add("opened");
    
    // Play Background Audio
    if (bgMusic) {
      bgMusic.play().catch(err => {
        console.log("Audio autoplay prevented by browser policy:", err);
      });
    }

    // Trigger Initial Confetti Burst
    launchConfetti();

    // Reveal main page after lid animation
    setTimeout(() => {
      giftModal.classList.add("hidden");
      mainContent.classList.remove("content-hidden");
      startSparkles();
    }, 700);
  });

  // 2. Music Toggle Button
  let isPlaying = true;
  musicBtn.addEventListener("click", () => {
    if (isPlaying) {
      bgMusic.pause();
      musicBtn.innerText = "🎵 Play Music";
    } else {
      bgMusic.play();
      musicBtn.innerText = "🎵 Pause Music";
    }
    isPlaying = !isPlaying;
  });

  // 3. Countdown Timer to Denise's Next Birthday (Oct 29, 2027)
  function updateCountdown() {
    const nextBirthday = new Date("October 29, 2027 00:00:00").getTime();
    const now = new Date().getTime();
    const diff = nextBirthday - now;

    if (diff > 0) {
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      document.getElementById("days").innerText = d < 10 ? "0" + d : d;
      document.getElementById("hours").innerText = h < 10 ? "0" + h : h;
      document.getElementById("minutes").innerText = m < 10 ? "0" + m : m;
      document.getElementById("seconds").innerText = s < 10 ? "0" + s : s;
    }
  }
  setInterval(updateCountdown, 1000);
  updateCountdown();

  // 4. Blow Candle Interaction
  candle.addEventListener("click", () => {
    if (!flame.classList.contains("out")) {
      flame.classList.add("out");
      cakeStatus.innerText = "✨ Wish Granted! Happy Birthday Denise! 🎉";
      launchConfetti();
    }
  });

  // 5. Confetti Engine
  const confettiCanvas = document.getElementById("confetti-canvas");
  const ctx = confettiCanvas.getContext("2d");
  let particles = [];

  function resizeCanvas() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  function launchConfetti() {
    particles = [];
    const colors = ["#ffd700", "#8a2be2", "#b15eff", "#ffffff", "#ff69b4"];
    for (let i = 0; i < 120; i++) {
      particles.push({
        x: confettiCanvas.width / 2,
        y: confettiCanvas.height / 2,
        vx: (Math.random() - 0.5) * 14,
        vy: (Math.random() - 0.5) * 14 - 3,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rSpeed: (Math.random() - 0.5) * 10
      });
    }
    animateConfetti();
  }

  function animateConfetti() {
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    particles.forEach((p, idx) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.2; // Gravity
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

  // 6. Background Sparkle Particles
  function startSparkles() {
    const canvas = document.getElementById("sparkle-canvas");
    const sCtx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const sparkles = Array.from({ length: 45 }, () => ({
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