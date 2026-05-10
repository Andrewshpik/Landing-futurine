// Theme toggle
const themeToggle = document.querySelector('.theme-toggle');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
}

// Language toggle
function applyLang(lang) {
  const dict = (window.TRANSLATIONS && window.TRANSLATIONS[lang]) || {};
  document.documentElement.setAttribute('lang', lang);
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key] != null) el.innerHTML = dict[key];
  });
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const key = el.getAttribute('data-i18n-ph');
    if (dict[key] != null) el.setAttribute('placeholder', dict[key]);
  });
  document.querySelectorAll('[data-i18n-aria]').forEach(el => {
    const key = el.getAttribute('data-i18n-aria');
    if (dict[key] != null) el.setAttribute('aria-label', dict[key]);
  });
}

const savedLang = localStorage.getItem('lang') || 'ru';
applyLang(savedLang);

const langToggle = document.querySelector('.lang-toggle');
if (langToggle) {
  langToggle.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('lang') === 'ru' ? 'be' : 'ru';
    localStorage.setItem('lang', next);
    applyLang(next);
  });
}

// Catalog filters
const filters = document.querySelectorAll('.filter');
const products = document.querySelectorAll('.product');

filters.forEach(btn => {
  btn.addEventListener('click', () => {
    filters.forEach(b => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    const cat = btn.dataset.filter;
    products.forEach(p => {
      const show = cat === 'all' || p.dataset.cat === cat;
      p.classList.toggle('is-hidden', !show);
    });
  });
});

// Phone mask
const phoneInput = document.querySelector('input[name="phone"]');
if (phoneInput) {
  phoneInput.addEventListener('input', e => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 11);
    if (v.startsWith('8')) v = '7' + v.slice(1);
    if (!v.startsWith('7') && v.length) v = '7' + v;
    let out = '+7';
    if (v.length > 1) out += ' (' + v.slice(1, 4);
    if (v.length >= 4) out += ') ' + v.slice(4, 7);
    if (v.length >= 7) out += '-' + v.slice(7, 9);
    if (v.length >= 9) out += '-' + v.slice(9, 11);
    e.target.value = out;
  });
}

// Form submit
const FORM_ENDPOINT = 'https://dubrava-form.andrewshpik.workers.dev';
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const name = form.name.value.trim();
    const phone = form.phone.value.trim();
    if (!name || phone.replace(/\D/g, '').length < 10) {
      form.querySelector(name ? 'input[name="phone"]' : 'input[name="name"]').focus();
      return;
    }

    const successEl = form.querySelector('.form__success');
    const errorEl = form.querySelector('.form__error');
    const submitBtn = form.querySelector('button[type="submit"]');
    if (errorEl) errorEl.hidden = true;
    submitBtn.disabled = true;

    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          product: form.product?.value || '',
          message: form.message?.value || '',
          website: form.website?.value || '',
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || 'send_failed');
      successEl.hidden = false;
      setTimeout(() => form.reset(), 100);
    } catch (err) {
      submitBtn.disabled = false;
      if (errorEl) errorEl.hidden = false;
    }
  });
}

// Mobile menu
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav');
if (burger && nav) {
  const toggle = (open) => {
    nav.classList.toggle('is-open', open);
    burger.classList.toggle('is-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };
  burger.addEventListener('click', () => toggle(!nav.classList.contains('is-open')));
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggle(false)));
}

// Reveal on scroll
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.advantage, .product, .steps li, .review').forEach((el, i) => {
  el.style.cssText += 'opacity:0;transform:translateY(30px);transition:opacity .7s cubic-bezier(0.2,0.8,0.2,1) ' + (i % 4 * 0.08) + 's, transform .7s cubic-bezier(0.2,0.8,0.2,1) ' + (i % 4 * 0.08) + 's;';
  io.observe(el);
});

// Scroll progress bar
const progressBar = document.querySelector('.scroll-progress');
if (progressBar) {
  const updateProgress = () => {
    const h = document.documentElement;
    const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight);
    progressBar.style.width = (scrolled * 100) + '%';
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
}

// Counter animation for hero stats
const animateCounter = (el) => {
  const text = el.textContent.trim();
  const match = text.match(/^(\d+)(.*)$/);
  if (!match) return;
  const target = parseInt(match[1], 10);
  const suffix = match[2];
  const duration = 1400;
  const start = performance.now();
  const tick = (now) => {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(target * eased) + suffix;
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};
const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('strong').forEach(animateCounter);
      statsObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
const heroStats = document.querySelector('.hero__stats');
if (heroStats) statsObserver.observe(heroStats);

// Mouse parallax on hero images
const heroMedia = document.querySelector('.hero__media');
if (heroMedia && window.matchMedia('(min-width: 980px)').matches) {
  const img1 = heroMedia.querySelector('.hero__image--1');
  const img2 = heroMedia.querySelector('.hero__image--2');
  heroMedia.addEventListener('mousemove', (e) => {
    const rect = heroMedia.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    if (img1) img1.style.transform = `rotate(2deg) translate(${x * -14}px, ${y * -14}px)`;
    if (img2) img2.style.transform = `rotate(-3deg) translate(${x * 18}px, ${y * 18}px)`;
  });
  heroMedia.addEventListener('mouseleave', () => {
    if (img1) img1.style.transform = '';
    if (img2) img2.style.transform = '';
  });
}

// 3D tilt on product cards
if (window.matchMedia('(min-width: 720px)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('.product').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(900px) rotateY(${x * 6}deg) rotateX(${y * -6}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}
