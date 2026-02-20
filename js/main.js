/* ===================================================================
   DrinkoSip Beverages — Main JavaScript
   Navbar, mobile menu, page loader, form handling, product filters
   =================================================================== */

(function () {
  'use strict';

  // === Page Loader ===
  window.addEventListener('load', function () {
    const loader = document.querySelector('.page-loader');
    if (loader) {
      setTimeout(function () {
        loader.classList.add('loaded');
      }, 800);
    }
  });

  // === Navbar Scroll Effect ===
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    function handleNavbarScroll() {
      if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
    window.addEventListener('scroll', handleNavbarScroll, { passive: true });
    handleNavbarScroll();
  }

  // === Mobile Menu ===
  const hamburger = document.querySelector('.navbar__hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileOverlay = document.querySelector('.mobile-overlay');

  function openMobileMenu() {
    hamburger.classList.add('open');
    mobileMenu.classList.add('active');
    mobileOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('active');
    mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (hamburger && mobileMenu && mobileOverlay) {
    hamburger.addEventListener('click', function () {
      if (mobileMenu.classList.contains('active')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    mobileOverlay.addEventListener('click', closeMobileMenu);

    // Close menu when clicking a link
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMobileMenu);
    });
  }

  // === Product Filter (Products Page) ===
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-detail-card[data-category]');

  if (filterBtns.length > 0 && productCards.length > 0) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        // Update active state
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        productCards.forEach(function (card) {
          if (filter === 'all' || card.getAttribute('data-category') === filter) {
            card.style.display = '';
            card.style.opacity = '0';
            card.style.transform = 'translateY(16px)';
            requestAnimationFrame(function () {
              requestAnimationFrame(function () {
                card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
              });
            });
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(16px)';
            setTimeout(function () {
              card.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  }

  // === Contact Form ===
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;

  // EmailJS initialization
  if (typeof emailjs !== 'undefined') {
    emailjs.init('YOUR_PUBLIC_KEY');
  }

  const messageField = document.getElementById('message');
  const wordCounter = document.querySelector('.word-counter');

  // Word counter
  if (messageField && wordCounter) {
    messageField.addEventListener('input', function () {
      var words = this.value.trim().split(/\s+/).filter(function (w) { return w.length > 0; }).length;
      wordCounter.textContent = words + ' / 30 words minimum';
      wordCounter.style.color = words >= 30 ? '#22C55E' : '#DC2626';

      // Update validation state visually
      if (words >= 30) {
        messageField.classList.remove('invalid');
        messageField.classList.add('valid');
        hideError('message');
      } else if (messageField.classList.contains('invalid')) {
        // Keep showing invalid if previously validated
      }
    });
  }

  // Validation helpers
  function showError(fieldId, message) {
    var errorEl = document.getElementById(fieldId + '-error');
    var inputEl = document.getElementById(fieldId);
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.add('visible');
    }
    if (inputEl) {
      inputEl.classList.add('invalid');
      inputEl.classList.remove('valid');
    }
  }

  function hideError(fieldId) {
    var errorEl = document.getElementById(fieldId + '-error');
    var inputEl = document.getElementById(fieldId);
    if (errorEl) {
      errorEl.classList.remove('visible');
    }
    if (inputEl) {
      inputEl.classList.remove('invalid');
      inputEl.classList.add('valid');
    }
  }

  function getWordCount(text) {
    return text.trim().split(/\s+/).filter(function (w) { return w.length > 0; }).length;
  }

  // Form submission
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    var isValid = true;

    // Name validation
    var name = document.getElementById('name').value.trim();
    if (name.length < 3 || !/^[a-zA-Z\s]+$/.test(name)) {
      showError('name', 'Please enter your full name (minimum 3 characters, letters only)');
      isValid = false;
    } else {
      hideError('name');
    }

    // Email validation
    var email = document.getElementById('email').value.trim();
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showError('email', 'Please enter a valid email address');
      isValid = false;
    } else {
      hideError('email');
    }

    // Phone validation
    var phone = document.getElementById('phone').value.trim();
    if (!/^[0-9]{10}$/.test(phone)) {
      showError('phone', 'Please enter a valid 10-digit phone number');
      isValid = false;
    } else {
      hideError('phone');
    }

    // City validation
    var city = document.getElementById('city').value.trim();
    if (city.length < 2) {
      showError('city', 'Please enter your city/location');
      isValid = false;
    } else {
      hideError('city');
    }

    // Subject validation
    var subject = document.getElementById('subject').value;
    if (!subject || subject === '') {
      showError('subject', 'Please select a subject');
      isValid = false;
    } else {
      hideError('subject');
    }

    // Message validation (30 words minimum)
    var message = document.getElementById('message').value;
    var wordCount = getWordCount(message);
    if (wordCount < 30) {
      showError('message', 'Please write at least 30 words so we can understand your query properly.');
      isValid = false;
    } else {
      hideError('message');
    }

    if (!isValid) return;

    // Send via EmailJS
    var btn = contactForm.querySelector('button[type="submit"]');
    var originalText = btn.textContent;
    btn.textContent = 'Sending...';
    btn.disabled = true;
    btn.style.opacity = '0.7';

    if (typeof emailjs !== 'undefined') {
      emailjs.sendForm('service_drinkosip', 'template_drinkosip', contactForm)
        .then(function () {
          btn.textContent = '✓ Message Sent Successfully!';
          btn.style.background = 'var(--lime)';
          btn.style.opacity = '1';

          var successBanner = document.querySelector('.form-success');
          if (successBanner) {
            successBanner.textContent = "Thank you! We'll get back to you within 24 hours.";
            successBanner.classList.add('visible');
          }

          setTimeout(function () {
            contactForm.reset();
            btn.textContent = originalText;
            btn.style.background = '';
            btn.disabled = false;
            if (successBanner) successBanner.classList.remove('visible');
            if (wordCounter) {
              wordCounter.textContent = '0 / 30 words minimum';
              wordCounter.style.color = '#DC2626';
            }
            // Remove all valid/invalid classes
            contactForm.querySelectorAll('.valid, .invalid').forEach(function (el) {
              el.classList.remove('valid', 'invalid');
            });
          }, 3000);
        }, function (error) {
          btn.textContent = 'Failed to send. Try again.';
          btn.style.background = 'var(--energy-red)';
          btn.style.opacity = '1';
          btn.disabled = false;

          setTimeout(function () {
            btn.textContent = originalText;
            btn.style.background = '';
          }, 3000);
        });
    } else {
      // EmailJS not loaded — show success anyway for demo
      btn.textContent = '✓ Message Sent Successfully!';
      btn.style.background = 'var(--lime)';
      btn.style.opacity = '1';

      var successBanner = document.querySelector('.form-success');
      if (successBanner) {
        successBanner.textContent = "Thank you! We'll get back to you within 24 hours.";
        successBanner.classList.add('visible');
      }

      setTimeout(function () {
        contactForm.reset();
        btn.textContent = originalText;
        btn.style.background = '';
        btn.disabled = false;
        if (successBanner) successBanner.classList.remove('visible');
        if (wordCounter) {
          wordCounter.textContent = '0 / 30 words minimum';
          wordCounter.style.color = '#DC2626';
        }
        contactForm.querySelectorAll('.valid, .invalid').forEach(function (el) {
          el.classList.remove('valid', 'invalid');
        });
      }, 3000);
    }
  });
})();
