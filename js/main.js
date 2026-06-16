document.addEventListener('DOMContentLoaded', () => {
  var revealEls = document.querySelectorAll('[data-reveal]');
  var revealObserver;
  var journeyEntries = document.querySelectorAll('.journey__entry');
  var dayLinks = document.querySelectorAll('.journey__day-link');
  var intersecting = new Set();
  var sidebarObserver;
  var header = document.querySelector('.site-header');
  var navToggle = document.querySelector('.nav-toggle');
  var siteNav = document.getElementById('site-nav');

  // ── Reveal observer ──────────────────────────────────────────────────────────
  if (revealEls.length) {
    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-revealed');
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.15 },
    );

    revealEls.forEach((el) => {
      revealObserver.observe(el);
    });
  }

  // ── Journey sticky sidebar ───────────────────────────────────────────────────
  function updateActiveLink() {
    if (!intersecting.size) return;

    var minDay = Infinity;
    var activeEl = null;

    intersecting.forEach((el) => {
      var day = parseInt(el.dataset.day, 10);
      if (day < minDay) {
        minDay = day;
        activeEl = el;
      }
    });

    if (!activeEl) return;
    var targetHref = `#day-${activeEl.dataset.day}`;

    dayLinks.forEach((link) => {
      var isActive = link.getAttribute('href') === targetHref;
      link.classList.toggle('is-active', isActive);
      if (isActive) link.scrollIntoView({ block: 'nearest' });
    });
  }

  if (journeyEntries.length && dayLinks.length) {
    sidebarObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            intersecting.add(entry.target);
          } else {
            intersecting.delete(entry.target);
          }
        });
        updateActiveLink();
      },
      { threshold: 0.1 },
    );

    journeyEntries.forEach((el) => {
      sidebarObserver.observe(el);
    });
  }

  // ── Header scroll state ──────────────────────────────────────────────────────
  if (header) {
    window.addEventListener(
      'scroll',
      () => {
        header.classList.toggle('is-scrolled', window.scrollY > 0);
      },
      { passive: true },
    );
  }

  // ── Mobile nav toggle ────────────────────────────────────────────────────────
  if (navToggle && siteNav) {
    navToggle.addEventListener('click', () => {
      var expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      siteNav.classList.toggle('is-open', !expanded);
      navToggle.setAttribute(
        'aria-label',
        expanded ? 'Open navigation menu' : 'Close navigation menu',
      );
    });
  }
});
