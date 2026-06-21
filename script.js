/* Iron Forge Fitness — script.js */
(function () {
  'use strict';

  /* --------------------------------------------------
     NAV: Mobile toggle + sticky scroll class
  -------------------------------------------------- */
  const navToggle = document.querySelector('.nav__toggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.nav__mobile-link, .nav__mobile-cta');
  const nav = document.getElementById('nav');

  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', function () {
      const isOpen = mobileMenu.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        mobileMenu.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* Sticky nav shade on scroll */
  window.addEventListener('scroll', function () {
    if (nav) {
      nav.style.borderBottomColor = window.scrollY > 40
        ? 'rgba(255,255,255,0.1)'
        : 'rgba(255,255,255,0.06)';
    }
  }, { passive: true });

  /* --------------------------------------------------
     SCROLL REVEAL
  -------------------------------------------------- */
  const revealEls = document.querySelectorAll(
    '.benefit-card, .program-card, .testimonial, .pricing-card, .section__header, .contact__copy'
  );

  revealEls.forEach(function (el, i) {
    el.classList.add('reveal');
    // Stagger cards in grids
    const parent = el.parentElement;
    if (parent && parent.children.length > 1) {
      const idx = Array.from(parent.children).indexOf(el);
      if (idx === 1) el.classList.add('reveal--delay-1');
      if (idx === 2) el.classList.add('reveal--delay-2');
      if (idx === 3) el.classList.add('reveal--delay-3');
    }
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    // Fallback: show all immediately
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* --------------------------------------------------
     FORM: Validation + success state
  -------------------------------------------------- */
  const form = document.getElementById('trialForm');
  const formSuccess = document.getElementById('formSuccess');

  if (form && formSuccess) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const fields = form.querySelectorAll('[required]');
      let valid = true;

      fields.forEach(function (field) {
        field.classList.remove('is-invalid');
        const isEmpty = !field.value.trim();
        const isSelect = field.tagName === 'SELECT' && !field.value;

        if (isEmpty || isSelect) {
          field.classList.add('is-invalid');
          valid = false;
        }
      });

      if (!valid) {
        const firstInvalid = form.querySelector('.is-invalid');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      /* Simulate async submit */
      const submitBtn = form.querySelector('[type="submit"]');
      submitBtn.textContent = 'Booking...';
      submitBtn.disabled = true;

      setTimeout(function () {
        form.hidden = true;
        formSuccess.hidden = false;
      }, 900);
    });

    /* Clear invalid state on input */
    form.querySelectorAll('[required]').forEach(function (field) {
      field.addEventListener('input', function () {
        field.classList.remove('is-invalid');
      });
      field.addEventListener('change', function () {
        field.classList.remove('is-invalid');
      });
    });
  }

  /* --------------------------------------------------
     SMOOTH ANCHOR SCROLL (with nav offset)
  -------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH = nav ? nav.offsetHeight : 64;
      const top = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

})();