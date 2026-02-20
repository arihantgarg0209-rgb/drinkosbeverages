/* ===================================================================
   DrinkoSip Beverages — Scroll Animations & Intersection Observers
   =================================================================== */

(function () {
  'use strict';

  // === Scroll Reveal (IntersectionObserver) ===
  const revealElements = document.querySelectorAll('.reveal, .reveal-stagger, .scale-in, .slide-left, .slide-right');

  if (revealElements.length > 0 && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback: just show everything
    revealElements.forEach((el) => el.classList.add('active'));
  }

  // === Counter Animation ===
  const counterElements = document.querySelectorAll('[data-counter]');

  if (counterElements.length > 0 && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counterElements.forEach((el) => counterObserver.observe(el));
  }

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-counter'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 2000;
    const startTime = performance.now();
    const startVal = target > 100 ? Math.floor(target * 0.8) : 0;

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(startVal + (target - startVal) * eased);

      el.textContent = current.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target.toLocaleString() + suffix;
      }
    }

    requestAnimationFrame(update);
  }

  // === Subtle Bubbles (CSS-only approach — created via JS) ===
  function createBubbles() {
    const container = document.querySelector('.bubbles-container');
    if (!container) return;

    const bubbleCount = 20;
    for (let i = 0; i < bubbleCount; i++) {
      const bubble = document.createElement('div');
      bubble.classList.add('bubble');
      const size = Math.random() * 4 + 3; // 3-7px
      bubble.style.width = size + 'px';
      bubble.style.height = size + 'px';
      bubble.style.left = Math.random() * 100 + '%';
      bubble.style.animationDuration = Math.random() * 10 + 12 + 's';
      bubble.style.animationDelay = Math.random() * 10 + 's';
      container.appendChild(bubble);
    }
  }

  createBubbles();
})();
