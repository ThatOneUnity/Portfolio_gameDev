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
      const offset = (position - 0.5) * 16;
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
