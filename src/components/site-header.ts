const header = document.querySelector<HTMLElement>(
  '[data-astro-transition-persist="header"]',
);

// Rolagem (px) necessária para compactar o header 100%.
const MAX_SCROLL = 200;
const reduced =
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;

function sync() {
  if (!header) return;
  const progress = reduced
    ? window.scrollY > 8
      ? 1
      : 0
    : Math.min(1, Math.max(0, window.scrollY / MAX_SCROLL));
  header.style.setProperty('--header-progress', progress.toFixed(4));
}

if (header) {
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      sync();
      ticking = false;
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  // View Transitions: o header persiste entre páginas — reavalia a posição.
  document.addEventListener('astro:page-load', sync);
  sync();
}