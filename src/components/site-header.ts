const header = document.querySelector<HTMLElement>(
  '[data-astro-transition-persist="header"]',
);

// Rolagem (px) necessária para compactar o header 100%.
const MAX_SCROLL = 150;
const reduced =
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;

const toggle = header?.querySelector<HTMLButtonElement>('.site-menu-toggle');
const menu = header?.querySelector<HTMLElement>('.site-menu');
const menuLinks = menu ? Array.from(menu.querySelectorAll<HTMLAnchorElement>('a')) : [];

const isOpen = () => header?.classList.contains('is-open') === true;

function sync() {
  if (!header) return;
  // Menu aberto trava a toolbox no estado "flutuando" (progresso 1) para que
  // fundo/borda/sombra fiquem visíveis mesmo no topo da página.
  const progress = isOpen()
    ? 1
    : reduced
      ? window.scrollY > 8
        ? 1
        : 0
      : Math.min(1, Math.max(0, window.scrollY / MAX_SCROLL));
  header.style.setProperty('--header-progress', progress.toFixed(4));
}

const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';
const LINK_STAGGER = 45;

function setMenuHeight() {
  if (!menu || !isOpen()) return;
  menu.style.setProperty('--menu-h', `${menu.scrollHeight}px`);
}

function setToggleState(open: boolean) {
  if (!toggle) return;
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? (toggle.dataset.labelClose ?? '') : (toggle.dataset.labelOpen ?? ''));
}

function animateLinks(open: boolean) {
  if (!menu || reduced) return;
  if (open) {
    menuLinks.forEach((link, i) => {
      link.getAnimations().forEach((a) => a.cancel());
      link.animate(
        [
          { opacity: 0, transform: 'translateY(6px)' },
          { opacity: 1, transform: 'translateY(0)' },
        ],
        {
          duration: 260,
          delay: 40 + i * LINK_STAGGER,
          easing: EASE,
          fill: 'both',
        },
      );
    });
  } else {
    menuLinks.forEach((link) => {
      link.getAnimations().forEach((a) => a.cancel());
      link.style.removeProperty('opacity');
      link.style.removeProperty('transform');
    });
  }
}

function openMenu() {
  if (!header || isOpen()) return;
  header.classList.add('is-open');
  setToggleState(true);
  setMenuHeight();
  animateLinks(true);
  sync();
}

function closeMenu() {
  if (!header || !isOpen()) return;
  header.classList.remove('is-open');
  menu?.style.removeProperty('--menu-h');
  setToggleState(false);
  animateLinks(false);
  sync();
}

function handlePointerDown(event: PointerEvent) {
  if (!header || !isOpen()) return;
  if (!header.contains(event.target as Node)) closeMenu();
}

function handleKeyDown(event: KeyboardEvent) {
  if (event.key === 'Escape' && isOpen()) closeMenu();
}

// Imports do módulo são re-executados a cada page-load (o header persiste via
// view transition) — listeners de DOM são amarrados apenas uma vez por header.
function bind() {
  if (!header || header.dataset.bound === 'true') return;
  header.dataset.bound = 'true';
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
  toggle?.addEventListener('click', () => (isOpen() ? closeMenu() : openMenu()));
  menuLinks.forEach((link) => link.addEventListener('click', () => closeMenu()));
  document.addEventListener('pointerdown', handlePointerDown);
  document.addEventListener('keydown', handleKeyDown);
  sync();
}

// View Transitions: o header persiste entre páginas — fecha o menu e reavalia
// a posição ao navegar (inclusive troca de idioma, que é uma navegação).
document.addEventListener('astro:page-load', () => {
  closeMenu();
  sync();
});

// Redimensionamento: ao cruzar para desktop, garante que o menu feche.
window.addEventListener('resize', () => {
  if (window.matchMedia('(min-width: 768px)').matches) closeMenu();
  else setMenuHeight();
});

bind();