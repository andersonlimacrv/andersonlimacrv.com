let io: IntersectionObserver | null = null;
const observed = new WeakSet<Element>();

function init() {
  const root = document.documentElement;
  if (!root.classList.contains('reveal-present')) {
    root.classList.add('reveal-present');
  }

  const reduced =
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  const els = document.querySelectorAll('[data-reveal]');

  if (reduced) {
    els.forEach((el) => {
      el.classList.add('is-visible');
      observed.add(el);
    });
    return;
  }

  if (!io) {
    io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            requestAnimationFrame(() => el.classList.add('is-visible'));
            io?.unobserve(el);
          }
        }
      },
      { threshold: 0.1, rootMargin: '0px' },
    );
  }

  els.forEach((el) => {
    if (observed.has(el)) return;
    observed.add(el);
    io!.observe(el);
  });

  document.querySelectorAll('section#hero [data-reveal]').forEach((el) => {
    observed.add(el);
    io?.unobserve(el);
    el.classList.add('is-visible');
  });

  const sweep = () => {
    document.querySelectorAll('[data-reveal]').forEach((el) => {
      if (el.classList.contains('is-visible')) return;
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        observed.add(el);
        io?.unobserve(el);
        el.classList.add('is-visible');
      }
    });
  };
  window.addEventListener('load', () => window.setTimeout(sweep, 1200));
}

document.addEventListener('astro:page-load', init);
document.addEventListener('astro:after-swap', init);
init();

export {};