/* ============================================
   DRINKOSIP — Main JavaScript
   Navbar, scroll reveals, counters, filters, form
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Page Loader ── */
  const loader = document.querySelector('.page-loader');
  if (loader) {
    const hideLoader = () => loader.classList.add('loaded');
    window.addEventListener('load', () => setTimeout(hideLoader, 900));
    setTimeout(hideLoader, 2500); // fallback
  }

  /* ── Navbar scroll ── */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const checkScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    };
    window.addEventListener('scroll', checkScroll, { passive: true });
    checkScroll();
  }

  /* ── Mobile menu ── */
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const mobileOverlay = document.querySelector('.mobile-overlay');

  if (navToggle && navLinks) {
    const toggleMenu = () => {
      navToggle.classList.toggle('open');
      navLinks.classList.toggle('open');
      if (mobileOverlay) mobileOverlay.classList.toggle('show');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    };

    navToggle.addEventListener('click', toggleMenu);
    if (mobileOverlay) mobileOverlay.addEventListener('click', toggleMenu);

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('open');
        navLinks.classList.remove('open');
        if (mobileOverlay) mobileOverlay.classList.remove('show');
        document.body.style.overflow = '';
      });
    });
  }

  /* ── Scroll Reveal (IntersectionObserver) ── */
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  /* ── Counter Animation ── */
  const counters = document.querySelectorAll('[data-count]');
  const counted = new Set();

  if (counters.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !counted.has(entry.target)) {
          counted.add(entry.target);
          animateCounter(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => counterObserver.observe(el));
  }

  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const duration = 2200;
    const start = performance.now();

    function tick(now) {
      const elapsed = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - elapsed, 3); // ease-out cubic
      const current = Math.floor(eased * target);
      el.textContent = prefix + current + suffix;

      if (elapsed < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = prefix + target + suffix;
      }
    }

    requestAnimationFrame(tick);
  }

  /* ── Product Filter (products page) ── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('[data-category]');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      productCards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;

        if (match) {
          card.style.display = '';
          requestAnimationFrame(() => {
            card.style.opacity = '1';
            card.style.transform = '';
          });
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(16px) scale(0.97)';
          setTimeout(() => { card.style.display = 'none'; }, 350);
        }
      });
    });
  });

  /* ── Contact Form ── */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData);

      if (!data.name || !data.email || !data.message) {
        showToast('Please fill in all required fields.', 'error');
        return;
      }

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = 'Sending...';
      submitBtn.disabled = true;

      // Simulate send
      setTimeout(() => {
        submitBtn.innerHTML = 'Sent Successfully!';
        submitBtn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';

        const successMsg = document.querySelector('.form-success');
        if (successMsg) successMsg.classList.add('show');

        showToast('Thank you! We\'ll get back to you soon.', 'success');
        contactForm.reset();

        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.style.background = '';
          submitBtn.disabled = false;
          if (successMsg) successMsg.classList.remove('show');
        }, 4000);
      }, 1500);
    });
  }

  /* ── Toast notification ── */
  function showToast(message, type) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.style.cssText = `
      position: fixed; bottom: 2rem; right: 2rem; z-index: 100001;
      padding: 1rem 1.5rem; border-radius: 16px;
      color: #fff; font-weight: 600; font-size: 0.9rem;
      box-shadow: 0 12px 40px rgba(0,0,0,0.15);
      animation: toastIn 0.4s cubic-bezier(0.22,1,0.36,1);
      background: ${type === 'success'
        ? 'linear-gradient(135deg, #22c55e, #16a34a)'
        : 'linear-gradient(135deg, #ef4444, #dc2626)'};
    `;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(16px)';
      toast.style.transition = '0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  /* ── Smooth anchor scroll ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

});
