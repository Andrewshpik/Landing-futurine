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
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = form.name.value.trim();
    const phone = form.phone.value.replace(/\D/g, '');
    if (!name || phone.length < 11) {
      form.querySelector(name ? 'input[name="phone"]' : 'input[name="name"]').focus();
      return;
    }
    form.querySelector('.form__success').hidden = false;
    form.querySelector('button[type="submit"]').disabled = true;
    setTimeout(() => form.reset(), 100);
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

document.querySelectorAll('.advantage, .product, .steps li, .review').forEach(el => {
  el.style.cssText += 'opacity:0;transform:translateY(20px);transition:opacity .6s ease, transform .6s ease;';
  io.observe(el);
});
