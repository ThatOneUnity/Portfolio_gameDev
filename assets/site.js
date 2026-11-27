(() => {
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const progress = document.querySelector('.scroll-progress');
  const hero = document.querySelector('.hero');
  const art = document.querySelector('.hero__art');
  let frame = 0;

  if (hero && art) {
    if (!motion.matches && !window.location.hash && window.scrollY === 0) {
      hero.classList.add('hero--intro');
    }

    const desktopPointer = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 43rem)');

    hero.addEventListener('pointermove', (event) => {
      if (motion.matches || !desktopPointer.matches || event.pointerType !== 'mouse') return;

      const position = Math.max(0, Math.min(event.clientX / window.innerWidth, 1));
      const range = Math.min(18, window.innerWidth * 0.018);
      const offset = (2 * position - 1) * range;
      art.style.setProperty('--hero-pan-x', `${offset}px`);
    });

    hero.addEventListener('pointerleave', () => art.style.removeProperty('--hero-pan-x'));
  }

  function draw() {
    frame = 0;
    const offset = Math.max(window.scrollY, 0);
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;

    if (progress) {
      const fraction = scrollable > 0 ? Math.min(offset / scrollable, 1) : 0;
      progress.style.transform = `scaleX(${fraction})`;
    }

    if (art && hero) {
      const travel = motion.matches ? 0 : Math.min(offset * 0.085, hero.clientHeight * 0.022);
      art.style.setProperty('--hero-offset', `${travel}px`);
    }
  }

  function scheduleDraw() {
    if (!frame) frame = window.requestAnimationFrame(draw);
  }

  window.addEventListener('scroll', scheduleDraw, { passive: true });
  window.addEventListener('resize', scheduleDraw);
  window.addEventListener('load', scheduleDraw);
  motion.addEventListener('change', scheduleDraw);
  scheduleDraw();

  const preview = document.querySelector('.image-preview');

  if (preview && typeof preview.showModal === 'function') {
    const picture = preview.querySelector('img');
    let opener;

    for (const link of document.querySelectorAll('[data-image-preview]')) {
      link.setAttribute('aria-haspopup', 'dialog');
      link.addEventListener('click', (event) => {
        if (event.defaultPrevented || event.button !== 0 ||
            event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

        event.preventDefault();
        const thumbnail = link.closest('.vrchat-card').querySelector('.vrchat-card__media img');
        picture.alt = thumbnail.alt;
        picture.src = link.href;
        opener = link;
        preview.showModal();
      });
    }

    preview.querySelector('button').addEventListener('click', () => preview.close());
    preview.addEventListener('click', (event) => {
      if (event.target === preview) preview.close();
    });
    preview.addEventListener('close', () => {
      opener?.focus({ preventScroll: true });
      opener = undefined;
    });
  }

  if (!motion.matches && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          if (entry.boundingClientRect.top > 72) entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      }
    }, { threshold: 0.1 });

    for (const section of document.querySelectorAll('[data-reveal]')) {
      observer.observe(section);
    }
  }
})();
