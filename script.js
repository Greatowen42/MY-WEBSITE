// ================= MOBILE HAMBURGER MENU =================
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');

hamburger?.addEventListener('click', () => {
  const isOpen = mobileNav.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', isOpen);
});

// Close mobile menu after a link is tapped
document.querySelectorAll('#mobile-nav a').forEach(link => {
  link.addEventListener('click', () => {
    mobileNav?.classList.remove('open');
    hamburger?.setAttribute('aria-expanded', 'false');
  });
});

// ================= NAV CLICK: SET ACTIVE + SMOOTH SCROLL =================
const allNavLinks = document.querySelectorAll('.nav-link');

allNavLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    const targetId = link.dataset.section;
    if (!targetId) return; // "Jump to Recipe" has no data-section, let it scroll normally
    const targetEl = document.getElementById(targetId);
    if (!targetEl) return;
    e.preventDefault();
    setActiveLink(targetId);
    targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

function setActiveLink(sectionId) {
  allNavLinks.forEach(l => {
    l.classList.toggle('active', l.dataset.section === sectionId);
  });
}

// ================= SCROLLSPY =================
const spySectionIds = ['high-protein', 'low-calorie', 'prep-30-min', 'macro-snacks'];
const spySections = spySectionIds
  .map(id => document.getElementById(id))
  .filter(Boolean);

const spyObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      setActiveLink(entry.target.id);
    }
  });
}, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

spySections.forEach(sec => spyObserver.observe(sec));

// ================= COOKIE CONSENT BANNER =================
const cookieBanner = document.getElementById('cookie-consent');
const cookieAccept = document.getElementById('cookie-accept');
const cookieDecline = document.getElementById('cookie-decline');

if (cookieBanner) {
  const consent = localStorage.getItem('ltr-cookie-consent');
  if (!consent) {
    cookieBanner.hidden = false;
  }

  cookieAccept?.addEventListener('click', () => {
    localStorage.setItem('ltr-cookie-consent', 'accepted');
    cookieBanner.hidden = true;
  });

  cookieDecline?.addEventListener('click', () => {
    localStorage.setItem('ltr-cookie-consent', 'declined');
    cookieBanner.hidden = true;
  });
}


// ================= HERO SLIDER =================
(function () {
  const root = document.querySelector('.hero-slider');
  if (!root) return;

  const slides = Array.from(root.querySelectorAll('.slide'));
  const dots = Array.from(root.querySelectorAll('.slider-dot'));
  const prevBtn = root.querySelector('.slider-prev');
  const nextBtn = root.querySelector('.slider-next');
  const DELAY = 3000;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let index = 0;
  let busy = false;
  let timer = null;

  function show(target, dir) {
    target = (target + slides.length) % slides.length;
    if (target === index || busy) return;
    busy = true;
    const current = slides[index];
    const incoming = slides[target];

    incoming.style.transition = 'none';
    incoming.style.transform = 'translateX(' + dir * 100 + '%)';
    void incoming.offsetWidth; // force reflow so the start position applies
    incoming.style.transition = '';
    current.style.transform = 'translateX(' + -dir * 100 + '%)';
    incoming.style.transform = 'translateX(0)';

    current.classList.remove('is-current');
    current.setAttribute('aria-hidden', 'true');
    current.tabIndex = -1;
    incoming.classList.add('is-current');
    incoming.removeAttribute('aria-hidden');
    incoming.removeAttribute('tabindex');

    dots[index].classList.remove('is-active');
    dots[target].classList.add('is-active');
    index = target;
    setTimeout(function () { busy = false; }, 550);
  }

  function next() { show(index + 1, 1); }
  function prev() { show(index - 1, -1); }

  function start() {
    if (reduceMotion || timer) return;
    timer = setInterval(next, DELAY);
  }
  function stop() { clearInterval(timer); timer = null; }
  function restart() { stop(); start(); }

  nextBtn.addEventListener('click', function () { next(); restart(); });
  prevBtn.addEventListener('click', function () { prev(); restart(); });
  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () { show(i, i > index ? 1 : -1); restart(); });
  });

  root.addEventListener('mouseenter', stop);
  root.addEventListener('mouseleave', start);
  root.addEventListener('focusin', stop);
  root.addEventListener('focusout', start);
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stop(); else start();
  });

  let startX = 0;
  root.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; stop(); }, { passive: true });
  root.addEventListener('touchend', function (e) {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) { dx < 0 ? next() : prev(); }
    start();
  }, { passive: true });

  start();
})();
