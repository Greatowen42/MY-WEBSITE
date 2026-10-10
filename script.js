// ================= MOBILE HAMBURGER MENU =================
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');

hamburger.addEventListener('click', () => {
  const isOpen = mobileNav.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', isOpen);
});

// Close mobile menu after a link is tapped
document.querySelectorAll('#mobile-nav a').forEach(link => {
  link.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
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
