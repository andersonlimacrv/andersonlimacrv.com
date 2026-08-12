const header = document.querySelector<HTMLElement>(
  '[data-astro-transition-persist="header"]',
);

// Inatividade (s) de mouse/scroll/teclado antes do header esconder.
const IDLE_MS = 3000;
// Só esconde após o usuário rolar além deste ponto — no topo, sempre visível.
const HIDE_AFTER = 80;
const reduced =
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;

const toggle = header?.querySelector<HTMLButtonElement>('.site-menu-toggle');
const menu = header?.querySelector<HTMLElement>('.site-menu');
const menuLinks = menu ? Array.from(menu.querySelectorAll<HTMLAnchorElement>('a')) : [];

const isOpen = () => header?.classList.contains('is-open') === true;

let idleTimer: ReturnType<typeof setTimeout> | undefined;

function showHeader() {
  header?.classList.remove('is-hidden');
}

function hideHeader() {
  if (!header || reduced || isOpen()) return;
  if (window.scrollY <= HIDE_AFTER) return;
  header.classList.add('is-hidden');
}

function scheduleHide() {
  if (idleTimer) clearTimeout(idleTimer);
  idleTimer = setTimeout(hideHeader, IDLE_MS);
}

function cancelHide() {
  if (idleTimer) clearTimeout(idleTimer);
  idleTimer = undefined;
}

// Qualquer atividade do usuário traz o header de volta e reinicia o timer.
function onActivity() {
  showHeader();
  scheduleHide();
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
  // Menu aberto: mantém o header visível.
  showHeader();
  cancelHide();
}

function closeMenu() {
  if (!header || !isOpen()) return;
  header.classList.remove('is-open');
  menu?.style.removeProperty('--menu-h');
  setToggleState(false);
  animateLinks(false);
  scheduleHide();
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
  window.addEventListener('scroll', onActivity, { passive: true });
  document.addEventListener('pointermove', onActivity, { passive: true });
  document.addEventListener('pointerdown', onActivity, { passive: true });
  document.addEventListener('keydown', onActivity);
  toggle?.addEventListener('click', () => (isOpen() ? closeMenu() : openMenu()));
  menuLinks.forEach((link) => link.addEventListener('click', () => closeMenu()));
  document.addEventListener('pointerdown', handlePointerDown);
  document.addEventListener('keydown', handleKeyDown);
  onActivity();
}

// View Transitions: o header persiste entre páginas — fecha o menu e reavalia
// o estado de visibilidade ao navegar (inclusive troca de idioma).
document.addEventListener('astro:page-load', () => {
  closeMenu();
  onActivity();
});

// Redimensionamento: ao cruzar para desktop, garante que o menu feche.
window.addEventListener('resize', () => {
  if (window.matchMedia('(min-width: 768px)').matches) closeMenu();
  else setMenuHeight();
});

bind();