document.addEventListener('DOMContentLoaded', () => {
  var revealEls = document.querySelectorAll('[data-reveal]');
  var revealObserver;
  var journeyEntries = document.querySelectorAll('.journey__entry');
  var dayLinks = document.querySelectorAll('.journey__day-link');
  var daySelect = document.getElementById('journey-day-select');
  var intersecting = new Set();
  var sidebarObserver;
  var header = document.querySelector('.site-header');
  var navToggle = document.querySelector('.nav-toggle');
  var siteNav = document.getElementById('site-nav');
  var firstNavLink;

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
    var minDay = Infinity;
    var activeEl = null;
    var targetHref;
    var sidebar;

    if (!intersecting.size) return;

    intersecting.forEach((el) => {
      var day = parseInt(el.dataset.day, 10);
      if (day < minDay) {
        minDay = day;
        activeEl = el;
      }
    });

    if (!activeEl) return;
    targetHref = `#day-${activeEl.dataset.day}`;

    dayLinks.forEach((link) => {
      var isActive = link.getAttribute('href') === targetHref;
      link.classList.toggle('is-active', isActive);
      if (isActive) {
        sidebar = link.closest('.journey__sidebar');
        if (sidebar && sidebar.scrollHeight > sidebar.clientHeight) {
          link.scrollIntoView({ block: 'nearest' });
        }
      }
    });

    if (daySelect) daySelect.value = activeEl.id;
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

  if (daySelect) {
    daySelect.addEventListener('change', () => {
      var target = document.getElementById(daySelect.value);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
    firstNavLink = siteNav.querySelector('a');

    function openNav() {
      navToggle.setAttribute('aria-expanded', 'true');
      navToggle.setAttribute('aria-label', 'Close navigation menu');
      siteNav.classList.add('is-open');
      if (firstNavLink) firstNavLink.focus();
    }

    function closeNav() {
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Open navigation menu');
      siteNav.classList.remove('is-open');
      navToggle.focus();
    }

    navToggle.addEventListener('click', () => {
      if (navToggle.getAttribute('aria-expanded') === 'true') {
        closeNav();
      } else {
        openNav();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && siteNav.classList.contains('is-open')) {
        closeNav();
      }
    });
  }
});
