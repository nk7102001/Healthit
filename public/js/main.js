// ===== NAVBAR SCROLL =====
const nav = document.querySelector('nav.hlt-nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  });
}

// ===== HAMBURGER TOGGLE =====
function toggleMenu() {
  const menu = document.getElementById('mobileMenu');
  const hamburger = document.querySelector('.hamburger');
  if (menu) {
    const isHidden = menu.style.display === 'none' || menu.style.display === '';
    menu.style.display = isHidden ? 'flex' : 'none';
  }
  if (hamburger) hamburger.classList.toggle('open');
}

// Close mobile menu on resize to desktop
window.addEventListener('resize', () => {
  if (window.innerWidth >= 769) {
    const menu = document.getElementById('mobileMenu');
    const hamburger = document.querySelector('.hamburger');
    if (menu) menu.style.display = 'none';
    if (hamburger) hamburger.classList.remove('open');
  }
});

// ===== IMAGE SLIDER =====
const images = ['/images/slide1.jpg', '/images/slide2.jpg', '/images/slide3.jpg', '/images/slide4.jpg'];
let sliderIndex = 0;
const sliderImg = document.getElementById('slider-image');
const dots = document.querySelectorAll('.dot');

if (sliderImg) {
  setInterval(() => {
    sliderIndex = (sliderIndex + 1) % images.length;
    sliderImg.classList.remove('slide-image');
    void sliderImg.offsetWidth;
    sliderImg.src = images[sliderIndex];
    sliderImg.classList.add('slide-image');
    dots.forEach((d, i) => d.classList.toggle('active', i === sliderIndex));
  }, 4000);
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      sliderIndex = i;
      sliderImg.classList.remove('slide-image');
      void sliderImg.offsetWidth;
      sliderImg.src = images[i];
      sliderImg.classList.add('slide-image');
      dots.forEach((d, j) => d.classList.toggle('active', i === j));
    });
  });
}

// ===== SCROLL REVEAL =====
const revealEls = document.querySelectorAll('.reveal');
if (revealEls.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
  }, { threshold: 0.12 });
  revealEls.forEach(el => observer.observe(el));
}

// ===== SCROLL TOP BUTTON =====
const scrollBtn = document.getElementById('scrollTopBtn');
if (scrollBtn) {
  window.addEventListener('scroll', () => scrollBtn.classList.toggle('visible', window.scrollY > 300));
  scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ===== SPINNER =====
function showSpinner() {
  const ov = document.getElementById('spinnerOverlay');
  if (ov) { ov.style.display = 'flex'; }
}
function hideSpinner() {
  const ov = document.getElementById('spinnerOverlay');
  if (ov) { ov.style.display = 'none'; }
}

// ===== TOAST =====
function showToast(msg, type = '') {
  let toast = document.getElementById('globalToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'globalToast';
    toast.className = 'toast' + (type ? ' ' + type : '');
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.className = 'toast' + (type ? ' ' + type : '');
  setTimeout(() => toast.classList.add('show'), 50);
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// ===== BMI BAR ANIMATION =====
const bmiBar = document.querySelector('.bmi-bar');
if (bmiBar) {
  const targetW = bmiBar.getAttribute('data-width') || '50%';
  bmiBar.style.width = '0%';
  setTimeout(() => { bmiBar.style.width = targetW; }, 300);
}

// ===== AUTO-DISMISS ALERTS =====
document.querySelectorAll('.alert').forEach(alert => {
  setTimeout(() => {
    alert.style.transition = 'opacity 0.5s ease';
    alert.style.opacity = '0';
    setTimeout(() => alert.remove(), 500);
  }, 5000);
});

// ===== COUNTER ANIMATION =====
document.querySelectorAll('[data-count]').forEach(el => {
  const target = parseInt(el.getAttribute('data-count'));
  let count = 0;
  const step = Math.ceil(target / 50);
  const timer = setInterval(() => {
    count = Math.min(count + step, target);
    el.textContent = count + (el.getAttribute('data-suffix') || '');
    if (count >= target) clearInterval(timer);
  }, 30);
});
