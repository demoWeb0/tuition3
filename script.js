/* ============================================================
   BrightMinds Tuition Centre  ·  script.js
============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* =========================================================
     1. NAVBAR  — scroll shadow + active link
  ========================================================= */
  const navbar   = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link:not(.nav-cta)');
  const sections = document.querySelectorAll('section[id]');
  const backTop  = document.getElementById('backToTop');
  const fabWa    = document.querySelector('.fab-wa');

  function onScroll() {
    const y = window.scrollY;

    navbar.classList.toggle('scrolled', y > 20);

    // FAB visibility
    if (backTop) backTop.classList.toggle('visible', y > 300);
    if (fabWa)   fabWa.classList.toggle('visible',   y > 300);

    // Active link
    let current = '';
    sections.forEach(sec => {
      if (y >= sec.offsetTop - 120) current = sec.id;
    });
    navLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });

    revealCheck();
  }

  window.addEventListener('scroll', onScroll, { passive: true });


  /* =========================================================
     2. HAMBURGER
  ========================================================= */
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('navLinks');

  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navMenu.classList.toggle('open');
  });

  navMenu?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navMenu.classList.remove('open');
  }));


  /* =========================================================
     3. SCROLL REVEAL
  ========================================================= */
  const revealEls = document.querySelectorAll('.reveal');

  function revealCheck() {
    const trigger = window.innerHeight * 0.90;
    revealEls.forEach(el => {
      if (el.getBoundingClientRect().top < trigger) el.classList.add('visible');
    });
  }

  revealCheck(); // run on load


  /* =========================================================
     4. COUNTER ANIMATION
  ========================================================= */
  const counters = document.querySelectorAll('.stat-n');
  let counted = false;

  function runCounters() {
    if (counted) return;
    counted = true;
    counters.forEach(el => {
      const target = +el.dataset.target;
      const dur = 1600;
      const step = target / (dur / 16);
      let cur = 0;
      const tick = () => {
        cur = Math.min(cur + step, target);
        el.textContent = Math.floor(cur);
        if (cur < target) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }

  // Fire when stats bar is in view
  const statsBar = document.querySelector('.stats-bar');
  const counterObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) { runCounters(); counterObs.disconnect(); }
  }, { threshold: 0.3 });
  if (statsBar) counterObs.observe(statsBar);


  /* =========================================================
     5. TESTIMONIALS SLIDER  — Rebuilt & Fixed
  ========================================================= */
  const viewport = document.getElementById('sliderViewport');
  const track    = document.getElementById('sliderTrack');
  const dotsWrap = document.getElementById('slDots');
  const btnPrev  = document.getElementById('slPrev');
  const btnNext  = document.getElementById('slNext');

  if (track && viewport) {
    const cards  = Array.from(track.children);
    const TOTAL  = cards.length;
    const GAP    = 22; // must match CSS gap
    let   current = 0;
    let   autoTimer = null;

    function getPerPage() {
      const w = window.innerWidth;
      if (w <= 560)  return 1;
      if (w <= 820)  return 2;
      return 3;
    }

    function getCardWidth() {
      const perPage = getPerPage();
      const vw = viewport.clientWidth;
      return (vw - GAP * (perPage - 1)) / perPage;
    }

    function setCardSizes() {
      const w = getCardWidth();
      cards.forEach(c => {
        c.style.width    = w + 'px';
        c.style.flexShrink = '0';
      });
    }

    function maxIndex() {
      return Math.max(0, TOTAL - getPerPage());
    }

    function goTo(idx) {
      current = Math.max(0, Math.min(idx, maxIndex()));
      const offset = current * (getCardWidth() + GAP);
      track.style.transform = `translateX(-${offset}px)`;
      updateDots();
    }

    function buildDots() {
      if (!dotsWrap) return;
      dotsWrap.innerHTML = '';
      const count = maxIndex() + 1;
      for (let i = 0; i < count; i++) {
        const btn = document.createElement('button');
        btn.className = 'sl-dot' + (i === 0 ? ' active' : '');
        btn.setAttribute('aria-label', `Slide ${i + 1}`);
        btn.addEventListener('click', () => { goTo(i); resetAuto(); });
        dotsWrap.appendChild(btn);
      }
    }

    function updateDots() {
      dotsWrap?.querySelectorAll('.sl-dot').forEach((d, i) => {
        d.classList.toggle('active', i === current);
      });
    }

    function resetAuto() {
      clearInterval(autoTimer);
      autoTimer = setInterval(() => goTo(current >= maxIndex() ? 0 : current + 1), 4500);
    }

    // Init
    setCardSizes();
    buildDots();
    goTo(0);
    resetAuto();

    btnPrev?.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
    btnNext?.addEventListener('click', () => { goTo(current + 1); resetAuto(); });

    // Recalculate on resize
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        setCardSizes();
        buildDots();
        goTo(Math.min(current, maxIndex()));
      }, 150);
    });

    // Touch / swipe support
    let touchStartX = 0;
    viewport.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    viewport.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) { diff > 0 ? goTo(current + 1) : goTo(current - 1); resetAuto(); }
    }, { passive: true });
  }


  /* =========================================================
     6. FAQ ACCORDION
  ========================================================= */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    item.querySelector('.faq-q')?.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      faqItems.forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  if (faqItems.length) faqItems[0].classList.add('open');


  /* =========================================================
     7. CONTACT FORM
  ========================================================= */
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  const submitBtn = document.getElementById('submitBtn');

  form?.addEventListener('submit', e => {
    e.preventDefault();

    const name  = document.getElementById('name')?.value.trim();
    const phone = document.getElementById('phone')?.value.trim();

    if (!name || !phone) {
      form.style.animation = 'none';
      void form.offsetHeight;
      form.style.animation = 'shake .4s ease';
      return;
    }

    submitBtn.textContent = 'Sending…';
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.textContent = '✅ Submitted!';
      success?.classList.add('show');
      form.reset();
      setTimeout(() => {
        submitBtn.textContent = 'Book My Free Demo Class 🎓';
        submitBtn.disabled = false;
        success?.classList.remove('show');
      }, 5000);
    }, 1200);
  });

  // Inject shake keyframe
  const s = document.createElement('style');
  s.textContent = `@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-6px)}80%{transform:translateX(6px)}}`;
  document.head.appendChild(s);


  /* =========================================================
     8. SMOOTH SCROLL
  ========================================================= */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      window.scrollTo({ top: target.offsetTop - 76, behavior: 'smooth' });
    });
  });


  /* =========================================================
     9. BACK TO TOP
  ========================================================= */
  backTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));


  /* =========================================================
     10. Initial checks
  ========================================================= */
  onScroll();

});

function startTyping() {
  const el = document.getElementById("hero");
  const plain = "Learn Smarter,\nScore ";
  const gradWord = "Higher";
  const full = plain + gradWord;
  let i = 0;

  el.innerHTML = '<span class="cursor"></span>';

  const interval = setInterval(() => {
    i++;
    if (i > full.length) { clearInterval(interval); return; }

    let html = "";
    if (i <= plain.length) {
      html = plain.slice(0, i).replace("\n", "<br/>");
    } else {
      html = plain.replace("\n", "<br/>") +
             `<span class="grad-text">${gradWord.slice(0, i - plain.length)}</span>`;
    }
    el.innerHTML = html + '<span class="cursor"></span>';
  }, 75);
}

startTyping();
