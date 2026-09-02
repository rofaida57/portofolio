
/* ==========================================================================
   Rofaida Bouchama — Portfolio  |  script.js
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ──────────────────────────────────────────────
     THEME TOGGLE
  ────────────────────────────────────────────── */
  const body      = document.body;
  const themeBtn  = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('theme');
  const prefDark  = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme === 'dark' || (!savedTheme && prefDark)) {
    body.classList.replace('light-theme', 'dark-theme');
  }

  themeBtn && themeBtn.addEventListener('click', () => {
    if (body.classList.contains('dark-theme')) {
      body.classList.replace('dark-theme', 'light-theme');
      localStorage.setItem('theme', 'light');
    } else {
      body.classList.replace('light-theme', 'dark-theme');
      localStorage.setItem('theme', 'dark');
    }
  });


  /* ──────────────────────────────────────────────
     LANGUAGE SWITCH  (EN default lives in HTML, AR/FR come from TRANSLATIONS)
  ────────────────────────────────────────────── */
  const langBtns = document.querySelectorAll('.lang-btn');
  const originalText = new Map(); // caches the original English text per element

  document.querySelectorAll('[data-i18n]').forEach(el => {
    originalText.set(el, el.innerHTML);
  });

  function applyLanguage(lang) {
    const dict = (typeof TRANSLATIONS !== 'undefined' && TRANSLATIONS[lang]) ? TRANSLATIONS[lang] : null;

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (lang === 'en' || !dict || !dict[key]) {
        el.innerHTML = originalText.get(el);
      } else {
        el.textContent = dict[key];
      }
    });

    document.documentElement.lang = lang;
    document.documentElement.dir = (lang === 'ar') ? 'rtl' : 'ltr';

    langBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.lang === lang));
    localStorage.setItem('lang', lang);

    // Re-measure the sliding nav underline after text/direction changes
    setTimeout(() => setUnderline(null), 50);
  }

  langBtns.forEach(btn => {
    btn.addEventListener('click', () => applyLanguage(btn.dataset.lang));
  });

  const savedLang = localStorage.getItem('lang') || 'en';
  applyLanguage(savedLang);


  /* ──────────────────────────────────────────────
     SCROLL PROGRESS BAR
  ────────────────────────────────────────────── */
  const progressBar = document.getElementById('scroll-progress');

  window.addEventListener('scroll', () => {
    if (!progressBar) return;
    const scrollTop  = window.scrollY;
    const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = docHeight > 0 ? (scrollTop / docHeight * 100) + '%' : '0%';
  }, { passive: true });


  /* ──────────────────────────────────────────────
     HEADER SHRINK ON SCROLL
  ────────────────────────────────────────────── */
  const header = document.getElementById('header');

  window.addEventListener('scroll', () => {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 80);
  }, { passive: true });


  /* ──────────────────────────────────────────────
     BACK TO TOP
  ────────────────────────────────────────────── */
  const backToTop = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    if (!backToTop) return;
    backToTop.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  backToTop && backToTop.addEventListener('click', () =>
    window.scrollTo({ top: 0, behavior: 'smooth' })
  );


  /* ──────────────────────────────────────────────
     MOBILE NAV TOGGLE
  ────────────────────────────────────────────── */
  const navToggle = document.getElementById('nav-toggle');
  const navMenu   = document.getElementById('nav');
  const navLinks  = document.querySelectorAll('.nav-link');

  navToggle && navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    navToggle.classList.toggle('active');
    navMenu && navMenu.classList.toggle('active');
  });

  navLinks.forEach(link => link.addEventListener('click', () => {
    navToggle && navToggle.setAttribute('aria-expanded', 'false');
    navToggle && navToggle.classList.remove('active');
    navMenu  && navMenu.classList.remove('active');
  }));


  /* ──────────────────────────────────────────────
     SLIDING NAV UNDERLINE + SCROLL SPY
  ────────────────────────────────────────────── */
  const navList = document.getElementById('nav-list');
  let underline = null;

  if (navList) {
    underline = document.createElement('div');
    underline.className = 'nav-underline';
    navList.appendChild(underline);
  }

  function setUnderline(target) {
    if (window.innerWidth <= 768 || !underline || !navList) {
      if (underline) underline.style.opacity = '0';
      return;
    }
    const active = target || navList.querySelector('.nav-link.active');
    if (!active) { underline.style.opacity = '0'; return; }
    const listRect = navList.getBoundingClientRect();
    const rect     = active.getBoundingClientRect();
    underline.style.left    = (rect.left - listRect.left + navList.scrollLeft) + 'px';
    underline.style.width   = rect.width + 'px';
    underline.style.opacity = '1';
  }

  navLinks.forEach(link => {
    link.addEventListener('mouseenter', () => setUnderline(link));
    link.addEventListener('click',      () => {
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      setUnderline(link);
    });
  });

  navList && navList.addEventListener('mouseleave', () => setUnderline(null));
  window.addEventListener('resize', () => setUnderline(null));

  // Scroll spy
  const sections = document.querySelectorAll('section[id]');

  function scrollSpy() {
    const pos = window.scrollY + 160;
    let current = '';

    sections.forEach(sec => {
      if (pos >= sec.offsetTop && pos < sec.offsetTop + sec.offsetHeight)
        current = sec.id;
    });

    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 80)
      current = 'contact';

    if (!current) return;
    let changed = false;
    navLinks.forEach(link => {
      const active = link.getAttribute('href') === '#' + current;
      if (active && !link.classList.contains('active'))      { link.classList.add('active');    changed = true; }
      else if (!active && link.classList.contains('active')) { link.classList.remove('active'); changed = true; }
    });
    if (changed) setUnderline(null);
  }

  window.addEventListener('scroll', scrollSpy, { passive: true });
  setTimeout(setUnderline, 100);
  scrollSpy();


  /* ──────────────────────────────────────────────
     CURSOR GLOW (lerp-smoothed, expands on hover)
  ────────────────────────────────────────────── */
  const glow = document.getElementById('cursor-glow');
  const isTouchOrSmall = window.matchMedia('(hover: none), (max-width: 900px)').matches;

  if (glow && !isTouchOrSmall) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let glowX  = mouseX;
    let glowY  = mouseY;
    let active = false;

    window.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!active) { active = true; glow.classList.add('active'); }
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
      active = false;
      glow.classList.remove('active');
    });

    const growTargets = document.querySelectorAll(
      '.btn, .research-card, .skills-card, .pub-card, .edu-card, .timeline-card, .info-item, .contact-form, .filter-btn, .theme-btn, .lang-btn'
    );
    growTargets.forEach(el => {
      el.addEventListener('mouseenter', () => glow.classList.add('cursor-glow--big'));
      el.addEventListener('mouseleave', () => glow.classList.remove('cursor-glow--big'));
    });

    function tickGlow() {
      glowX += (mouseX - glowX) * 0.15;
      glowY += (mouseY - glowY) * 0.15;
      glow.style.transform = `translate(${glowX}px, ${glowY}px) translate(-50%, -50%)`;
      requestAnimationFrame(tickGlow);
    }
    tickGlow();
  } else if (glow) {
    glow.style.display = 'none';
  }


  /* ──────────────────────────────────────────────
     ANIMATED COUNTERS (0 → target on scroll into view)
  ────────────────────────────────────────────── */
  const counters = document.querySelectorAll('[data-count]');
  const counterObs = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.count, 10) || 0;
      const duration = 1400;
      const startTime = performance.now();

      function step(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased    = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target;
      }
      requestAnimationFrame(step);
      obs.unobserve(el);
    });
  }, { threshold: 0.4 });

  counters.forEach(el => counterObs.observe(el));


  /* ──────────────────────────────────────────────
     SCROLL REVEAL (IntersectionObserver)
  ────────────────────────────────────────────── */
  const revealEls = document.querySelectorAll('.scroll-reveal');
  const revealObs = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('revealed');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  revealEls.forEach(el => revealObs.observe(el));


  /* ──────────────────────────────────────────────
     LANGUAGE METER BARS
  ────────────────────────────────────────────── */
  const bars = document.querySelectorAll('.meter-bar span[data-width]');
  const barObs = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const bar = e.target;
        const idx = Array.from(bars).indexOf(bar);
        setTimeout(() => { bar.style.width = bar.dataset.width + '%'; }, idx * 150);
        obs.unobserve(bar);
      }
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -30px 0px' });

  bars.forEach(b => barObs.observe(b));


  /* ──────────────────────────────────────────────
     PROJECTS — FILTER (All / Web / Desktop)
  ────────────────────────────────────────────── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('#projects-list .pub-card');
  let currentFilter = 'all';

  function applyFilter() {
    projectCards.forEach(card => {
      const category = card.dataset.year || '';
      const show = currentFilter === 'all' || category === currentFilter;

      if (show) {
        card.style.display = 'grid';
        setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }, 50);
      } else {
        card.style.opacity = '0';
        card.style.transform = 'translateY(15px)';
        setTimeout(() => { if (card.style.opacity === '0') card.style.display = 'none'; }, 300);
      }
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter || 'all';
      applyFilter();
    });
  });


  /* ──────────────────────────────────────────────
     CONTACT FORM — AJAX via FormSubmit
  ────────────────────────────────────────────── */
  const form     = document.getElementById('contact-form');
  const feedback = document.getElementById('form-feedback');
  const toast    = document.getElementById('success-toast');

  function showToast() {
    if (!toast) return;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 5000);
  }

  if (form) {
    const endpoint = form.dataset.ajaxEndpoint || form.action;

    form.addEventListener('submit', e => {
      e.preventDefault();
      const submitBtn = form.querySelector('.form-submit');
      const origHTML  = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending…';
      if (feedback) { feedback.className = 'form-feedback'; feedback.textContent = ''; }

      const replytoHidden = document.getElementById('replyto-hidden');
      if (replytoHidden) {
        replytoHidden.value = document.getElementById('email').value;
      }

      const submittedOn = document.getElementById('submitted-on');
      if (submittedOn) {
        const now    = new Date();
        const months = [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ];
        const hh = String(now.getHours()).padStart(2, '0');
        const mm = String(now.getMinutes()).padStart(2, '0');
        submittedOn.value = `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()} - ${hh}:${mm}`;
      }

      fetch(endpoint, {
        method:  'POST',
        body:    new FormData(form),
        headers: { Accept: 'application/json' }
      })
        .then(res => { if (!res.ok) throw new Error('Network error'); return res.json(); })
        .then(() => {
          submitBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Sent!';
          showToast();
          form.reset();
        })
        .catch(() => {
          submitBtn.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> Failed';
          if (feedback) {
            feedback.className = 'form-feedback form-feedback--error';
            feedback.textContent = 'Something went wrong. Please email directly: bouchamarofaida1@gmail.com';
          }
        })
        .finally(() => {
          setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = origHTML;
          }, 3500);
        });
    });
  }


  /* ──────────────────────────────────────────────
     PARTICLE / NODE CANVAS BACKGROUND
  ────────────────────────────────────────────── */
  const canvas = document.getElementById('molecule-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const CONFIG = {
    particleCount:      70,
    connectionDistance: 140,
    mouseRadius:        160,
    speed:              0.4
  };

  const mouse = { x: null, y: null };
  let particles = [];

  function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function initParticles() {
    resizeCanvas();
    particles = [];
    const count = Math.min(CONFIG.particleCount, (canvas.width * canvas.height) / 18000);
    for (let i = 0; i < count; i++) {
      particles.push({
        x:  Math.random() * canvas.width,
        y:  Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * CONFIG.speed,
        vy: (Math.random() - 0.5) * CONFIG.speed,
        r:  Math.random() * 4 + 2
      });
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const isDark   = document.body.classList.contains('dark-theme');
    const fill     = isDark ? 'rgba(212,175,55,.40)' : 'rgba(169,132,76,.25)';
    const lineBase = isDark ? 'rgba(212,175,55,' : 'rgba(169,132,76,';

    particles.forEach((p, i) => {
      if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      p.x += p.vx;
      p.y += p.vy;

      if (mouse.x !== null) {
        const dx   = p.x - mouse.x;
        const dy   = p.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < CONFIG.mouseRadius) {
          const force = (CONFIG.mouseRadius - dist) / CONFIG.mouseRadius;
          p.x += (dx / dist) * force * 1.5;
          p.y += (dy / dist) * force * 1.5;
        }
      }

      ctx.fillStyle = fill;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const dx   = p.x - particles[j].x;
        const dy   = p.y - particles[j].y;
        const dist = Math.hypot(dx, dy);
        if (dist < CONFIG.connectionDistance) {
          const alpha = (1 - dist / CONFIG.connectionDistance) * 0.15;
          ctx.strokeStyle = lineBase + alpha + ')';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    });

    requestAnimationFrame(animate);
  }

  initParticles();
  animate();
  window.addEventListener('resize', initParticles);
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });
});
