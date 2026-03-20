/* ========================================================
   BrightMinds Tuition Centre — script.js
======================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ===== 1. NAVBAR: Scroll shadow + active link ===== */
  const navbar  = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link:not(.nav-cta)');
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    // Shadow on scroll
    navbar.classList.toggle('scrolled', window.scrollY > 20);

    // Back-to-top visibility
    backToTop.classList.toggle('visible', window.scrollY > 300);

    // Active nav link
    let current = '';
    sections.forEach(sec => {
      const secTop = sec.offsetTop - 100;
      if (window.scrollY >= secTop) current = sec.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) link.classList.add('active');
    });

    // Reveal elements
    revealOnScroll();
  }

  window.addEventListener('scroll', onScroll, { passive: true });


  /* ===== 2. HAMBURGER MENU ===== */
  const hamburger = document.getElementById('hamburger');
  const navLinksEl = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinksEl.classList.toggle('open');
  });

  // Close menu on link click (mobile)
  navLinksEl.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinksEl.classList.remove('open');
    });
  });


  /* ===== 3. SCROLL REVEAL ===== */
  const revealEls = document.querySelectorAll('.reveal');

  function revealOnScroll() {
    const trigger = window.innerHeight * 0.88;
    revealEls.forEach(el => {
      const top = el.getBoundingClientRect().top;
      if (top < trigger) el.classList.add('visible');
    });
  }

  // Trigger on load too
  revealOnScroll();


  /* ===== 4. COUNTER ANIMATION ===== */
  const counters = document.querySelectorAll('.stat-num');
  let countersStarted = false;

  function startCounters() {
    if (countersStarted) return;
    const heroSection = document.getElementById('home');
    if (!heroSection) return;
    const rect = heroSection.getBoundingClientRect();
    if (rect.bottom > 0) {
      countersStarted = true;
      counters.forEach(counter => {
        const target = parseInt(counter.dataset.target, 10);
        const duration = 1800;
        const step = target / (duration / 16);
        let current = 0;
        const update = () => {
          current += step;
          if (current < target) {
            counter.textContent = Math.floor(current);
            requestAnimationFrame(update);
          } else {
            counter.textContent = target;
          }
        };
        requestAnimationFrame(update);
      });
    }
  }

  // Start counters after a short delay so user sees animation
  setTimeout(startCounters, 600);
  window.addEventListener('scroll', startCounters, { passive: true, once: true });


  /* ===== 5. TESTIMONIAL SLIDER ===== */
  const track     = document.getElementById('testimonialsTrack');
  const cards     = track ? Array.from(track.children) : [];
  const dotsWrap  = document.getElementById('sliderDots');
  const prevBtn   = document.getElementById('prevBtn');
  const nextBtn   = document.getElementById('nextBtn');

  let currentSlide  = 0;
  let autoSlideTimer = null;

  function getVisibleCount() {
    return window.innerWidth <= 560 ? 1 : window.innerWidth <= 820 ? 2 : 3;
  }

  function buildDots() {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = '';
    const total = cards.length - getVisibleCount() + 1;
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('button');
      dot.className = 'dot' + (i === currentSlide ? ' active' : '');
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      dot.addEventListener('click', () => goToSlide(i));
      dotsWrap.appendChild(dot);
    }
  }

  function updateSlider() {
    const cardWidth = cards[0] ? cards[0].offsetWidth + 24 : 0;
    track.style.transform = `translateX(-${currentSlide * cardWidth}px)`;

    // Update dots
    document.querySelectorAll('.dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
    });
  }

  function goToSlide(index) {
    const max = cards.length - getVisibleCount();
    currentSlide = Math.max(0, Math.min(index, max));
    updateSlider();
    resetAutoSlide();
  }

  if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));

  function autoSlide() {
    const max = cards.length - getVisibleCount();
    currentSlide = currentSlide >= max ? 0 : currentSlide + 1;
    updateSlider();
    document.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === currentSlide));
  }

  function resetAutoSlide() {
    clearInterval(autoSlideTimer);
    autoSlideTimer = setInterval(autoSlide, 4500);
  }

  if (cards.length) {
    buildDots();
    updateSlider();
    resetAutoSlide();
    window.addEventListener('resize', () => { buildDots(); updateSlider(); });
  }


  /* ===== 6. FAQ ACCORDION ===== */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question');
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all
      faqItems.forEach(i => i.classList.remove('open'));

      // Toggle clicked
      if (!isOpen) item.classList.add('open');
    });
  });

  // Open first FAQ by default
  if (faqItems.length) faqItems[0].classList.add('open');


  /* ===== 7. CONTACT FORM ===== */
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Basic validation
      const name  = document.getElementById('name').value.trim();
      const phone = document.getElementById('phone').value.trim();

      if (!name || !phone) {
        shakeForm();
        return;
      }

      // Simulate submission
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.textContent = '✅ Submitted!';
        formSuccess.classList.add('show');
        contactForm.reset();

        setTimeout(() => {
          submitBtn.textContent = 'Book My Free Demo Class 🎓';
          submitBtn.disabled = false;
          formSuccess.classList.remove('show');
        }, 5000);
      }, 1200);
    });
  }

  function shakeForm() {
    const form = document.getElementById('contactForm');
    form.style.animation = 'none';
    form.offsetHeight; // reflow
    form.style.animation = 'shake 0.4s ease';
  }

  // Inject shake keyframe if not present
  const shakeStyle = document.createElement('style');
  shakeStyle.textContent = `
    @keyframes shake {
      0%,100%{ transform: translateX(0); }
      20%    { transform: translateX(-8px); }
      40%    { transform: translateX(8px); }
      60%    { transform: translateX(-6px); }
      80%    { transform: translateX(6px); }
    }
  `;
  document.head.appendChild(shakeStyle);


  /* ===== 8. SMOOTH SCROLL for anchor links ===== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: offset, behavior: 'smooth' });
      }
    });
  });


  /* ===== 9. BACK TO TOP ===== */
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  /* ===== 10. GALLERY items — stagger reveal ===== */
  const galleryItems = document.querySelectorAll('.gallery-item');
  galleryItems.forEach((item, i) => {
    item.style.setProperty('--delay', (i * 0.1) + 's');
    item.classList.add('reveal');
  });

  // Initial call
  revealOnScroll();

});