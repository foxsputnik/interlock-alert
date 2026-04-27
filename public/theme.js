/* =============================================================
   Interlock Alert — interactions
   - Scroll-reveal entrance choreography
   - Smooth accordion animation (progressive enhancement)
   ============================================================= */

(function () {
  'use strict';

  /* ---------- SCROLL REVEAL ---------- */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveals = document.querySelectorAll('.reveal');

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    reveals.forEach((el) => el.classList.add('is-visible'));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.08 }
    );
    reveals.forEach((el) => io.observe(el));
  }

  /* ---------- FAQ ACCORDION — smooth open/close ---------- */
  const faqs = document.querySelectorAll('.faq-item');
  faqs.forEach((item) => {
    const summary = item.querySelector('summary');
    const content = item.querySelector('.faq-item__a');
    if (!summary || !content) return;

    summary.addEventListener('click', (e) => {
      if (prefersReducedMotion) return;
      e.preventDefault();

      const isOpen = item.hasAttribute('open');

      if (!isOpen) {
        item.setAttribute('open', '');
        const h = content.scrollHeight;
        content.style.overflow = 'hidden';
        content.style.maxHeight = '0px';
        requestAnimationFrame(() => {
          content.style.transition = 'max-height 260ms cubic-bezier(0.2,0,0,1)';
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
        content.style.transition = 'max-height 220ms cubic-bezier(0.3,0,0.8,0.15)';
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
