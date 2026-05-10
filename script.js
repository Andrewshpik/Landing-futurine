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
  burger.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    nav.style.cssText = open
      ? 'display:flex;flex-direction:column;position:absolute;top:100%;left:0;right:0;background:var(--surface);padding:24px;gap:16px;box-shadow:var(--shadow);'
      : '';
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('is-open');
    nav.style.cssText = '';
  }));
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
