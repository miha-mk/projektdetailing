/**
 * AutoDetailingKLC — main.js
 *
 * Sav JavaScript je ovdje. HTML nema niti jednog inline event handlera
 * (onclick, onload itd.) — sve je vezano ovdje via addEventListener.
 * To je bitno jer:
 *  1. Omogućuje strožu Content Security Policy bez 'unsafe-inline'
 *  2. Bolja separation of concerns (HTML = struktura, JS = ponašanje)
 *  3. Lakše testiranje i održavanje
 */

'use strict'; // Strict mode hvata česte JS greške u development fazi

/* ========== NAVBAR SCROLL EFEKT ========== */
const navbar = document.getElementById('navbar');

if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true }); // passive: true → bolje scroll performanse (ne blokira scroll)
}

/* ========== HAMBURGER MENU ========== */
const hamburgerBtn = document.getElementById('hamburgerBtn');
const navLinks     = document.getElementById('navLinks');

if (hamburgerBtn && navLinks) {
  hamburgerBtn.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    // Ažuriraj aria-expanded za screen readere (accessibility)
    hamburgerBtn.setAttribute('aria-expanded', String(isOpen));
  });

  // Zatvori menu kad se klikne na link (mobilni UX)
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
    });
  });

  // Zatvori menu klikom izvan navbara
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target)) {
      navLinks.classList.remove('open');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ========== PARTICLES ========== */
const particlesContainer = document.getElementById('particles');

if (particlesContainer) {
  /**
   * SECURITY NAPOMENA:
   * Sve vrijednosti dolaze iz Math.random() i hardcodiranog niza boja —
   * nema user inputa, nema opasnosti od XSS ovdje.
   * Koristimo element.style.property = ... umjesto cssText
   * jer je to eksplicitnije i jasnije što se postavlja.
   */
  const PARTICLE_COLORS = ['#E31E24', '#1A3B8C', '#C8C8D4', '#FFD700'];
  const PARTICLE_COUNT  = 25;

  // Koristimo DocumentFragment za batch DOM insert (bolje performanse)
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');

    const size  = Math.random() * 6 + 2;
    const color = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];

    particle.style.width            = `${size}px`;
    particle.style.height           = `${size}px`;
    particle.style.left             = `${Math.random() * 100}%`;
    particle.style.background       = color;
    particle.style.animationDuration = `${Math.random() * 15 + 10}s`;
    particle.style.animationDelay   = `${Math.random() * 10}s`;

    fragment.appendChild(particle);
  }

  particlesContainer.appendChild(fragment);
}

/* ========== SCROLL REVEAL ========== */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Nakon što je element vidljiv, prestani ga promatrati
        // (optimizacija — nema smisla pratiti element koji je već animiran)
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
  revealObserver.observe(el);
});
