/* =============================================================
   Interlock Alert — The Memorandum
   Choreographed reveals + theme + accordion
   ============================================================= */

(function () {
  'use strict';
  const root = document.documentElement;

  /* ---------- Theme toggle ---------- */
  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const isDark = root.classList.toggle('dark');
      if (isDark) {
        root.classList.remove('light');
        localStorage.setItem('theme-ed', 'dark');
      } else {
        root.classList.add('light');
        localStorage.setItem('theme-ed', 'light');
      }
    });
  }

  /* ---------- Page-load choreography ---------- */
  // Mark the hero display headline lines for mask reveal
  document.querySelectorAll('.display').forEach((el) => {
    // Force an immediate re-flow so transition fires
    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('is-in')));
  });

  // Rule reveals on hero (kick off immediately)
  const heroRules = document.querySelectorAll('.hero .rule--reveal');
  heroRules.forEach((r, i) => {
    setTimeout(() => r.classList.add('is-in'), 200 + i * 150);
  });

  // SVG plate draw-in — trigger shortly after load
  const plate = document.querySelector('.plate');
  if (plate) {
    setTimeout(() => plate.classList.add('is-in'), 400);
  }

  /* ---------- IntersectionObserver reveals ---------- */
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Tag reveal-worthy elements
  const targets = document.querySelectorAll(
    '.chapter__head, .folio, .head, .subhead, .protocol__step, .entry, ' +
    '.audience__card, .pillar, .fitment, .pullquote, .qna__item, .notice__h, ' +
    '.ledger, .console, .colophon__cols'
  );
  targets.forEach((el, i) => {
    el.setAttribute('data-r', String((i % 4) + 1));
  });

  if (prefersReduced || !('IntersectionObserver' in window)) {
    document.querySelectorAll('[data-r]').forEach((el) => el.classList.add('is-in'));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    );
    document.querySelectorAll('[data-r]').forEach((el) => io.observe(el));
  }

  /* ---------- Accordion smooth open/close ---------- */
  const items = document.querySelectorAll('.qna__item');
  items.forEach((item) => {
    const summary = item.querySelector('summary');
    const content = item.querySelector('.qna__a');
    if (!summary || !content || prefersReduced) return;

    summary.addEventListener('click', (e) => {
      e.preventDefault();
      const open = item.hasAttribute('open');

      if (!open) {
        item.setAttribute('open', '');
        const h = content.scrollHeight;
        content.style.overflow = 'hidden';
        content.style.maxHeight = '0px';
        requestAnimationFrame(() => {
          content.style.transition = 'max-height 320ms cubic-bezier(0.2, 0.8, 0.2, 1)';
          content.style.maxHeight = h + 'px';
        });
        content.addEventListener(
          'transitionend',
          function cleanup() {
            content.style.maxHeight = '';
            content.style.overflow = '';
            content.style.transition = '';
            content.removeEventListener('transitionend', cleanup);
          },
          { once: true }
        );
      } else {
        const h = content.scrollHeight;
        content.style.overflow = 'hidden';
        content.style.maxHeight = h + 'px';
        content.style.transition = 'max-height 260ms cubic-bezier(0.4, 0, 0.8, 0.2)';
        requestAnimationFrame(() => {
          content.style.maxHeight = '0px';
        });
        content.addEventListener(
          'transitionend',
          function cleanup() {
            item.removeAttribute('open');
            content.style.maxHeight = '';
            content.style.overflow = '';
            content.style.transition = '';
            content.removeEventListener('transitionend', cleanup);
          },
          { once: true }
        );
      }
    });
  });
})();
