/* ============================================
   DRINKOSIP — Subtle Champagne Bubbles
   Very subtle, translucent circles floating upward
   ============================================ */

(function () {
  const canvas = document.getElementById('bubbles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H;
  let bubbles = [];
  const MAX = window.innerWidth < 768 ? 18 : 30;

  // Mouse tracking for gentle interaction
  let mx = -9999, my = -9999;
  window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createBubble(fromBottom) {
    const r = Math.random() * 3.5 + 1;
    return {
      x: Math.random() * W,
      y: fromBottom ? H + Math.random() * 60 : Math.random() * H,
      r: r,
      speed: Math.random() * 0.6 + 0.15,
      wobbleAngle: Math.random() * Math.PI * 2,
      wobbleSpeed: Math.random() * 0.015 + 0.005,
      wobbleRadius: Math.random() * 20 + 6,
      opacity: Math.random() * 0.04 + 0.01,
      // Soft green and gold tints
      hue: Math.random() > 0.5 ? 140 : 48,
      sat: 40 + Math.random() * 20,
    };
  }

  function init() {
    resize();
    bubbles = [];
    for (let i = 0; i < MAX; i++) {
      bubbles.push(createBubble(false));
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    for (let i = 0; i < bubbles.length; i++) {
      const b = bubbles[i];

      // Move upward
      b.y -= b.speed;

      // Wobble
      b.wobbleAngle += b.wobbleSpeed;
      const wx = Math.sin(b.wobbleAngle) * b.wobbleRadius * 0.04;

      // Gentle mouse repel
      const dx = b.x - mx;
      const dy = b.y - my;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100 && dist > 0) {
        b.x += dx / dist * 0.5;
        b.y += dy / dist * 0.3;
      }

      const px = b.x + wx;

      // Draw bubble
      ctx.beginPath();
      ctx.arc(px, b.y, b.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${b.hue}, ${b.sat}%, 60%, ${b.opacity})`;
      ctx.fill();

      // Tiny highlight
      if (b.r > 1.5) {
        ctx.beginPath();
        ctx.arc(px - b.r * 0.25, b.y - b.r * 0.3, b.r * 0.25, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(0, 0%, 100%, ${b.opacity * 1.5})`;
        ctx.fill();
      }

      // Recycle when off screen
      if (b.y < -20) {
        bubbles[i] = createBubble(true);
      }
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  init();
  draw();
})();
