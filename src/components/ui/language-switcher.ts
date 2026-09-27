const wrap = document.querySelector<HTMLElement>('[data-locale-switcher]');

const header = document.querySelector<HTMLElement>(
  '[data-astro-transition-persist="header"]',
);

const reduced =
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;

const toggle = wrap?.querySelector<HTMLButtonElement>('.site-locale-toggle');
const menu = wrap?.querySelector<HTMLElement>('.site-locale-menu');
const links = menu ? Array.from(menu.querySelectorAll<HTMLAnchorElement>('a')) : [];

const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';
const LINK_STAGGER = 45;

const isOpen = () => wrap?.classList.contains('is-open') === true;

function setMenuHeight() {
  if (!menu || !isOpen()) return;
  menu.style.setProperty('--menu-h', `${menu.scrollHeight}px`);
}

function setOpen(open: boolean) {
  if (!wrap) return;
  wrap.classList.toggle('is-open', open);
  toggle?.setAttribute('aria-expanded', String(open));
  if (open) {
    setMenuHeight();
    header?.classList.remove('is-hidden');
    if (!reduced) {
      links.forEach((link, i) => {
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
    }
  } else {
    links.forEach((link) => {
      link.getAnimations().forEach((a) => a.cancel());
      link.style.removeProperty('opacity');
      link.style.removeProperty('transform');
    });
  }
}

function close() {
  if (isOpen()) setOpen(false);
}

function syncWithPage() {
  if (!wrap || !toggle) return;

  const alternates = new Map<string, string>();
  for (const link of document.querySelectorAll<HTMLLinkElement>(
    'head link[rel="alternate"][hreflang]',
  )) {
    const lang = link.getAttribute('hreflang')?.split('-')[0];
    const url = link.getAttribute('href');
    if (!lang || !url) continue;
    try {
      const u = new URL(url, location.origin);
      alternates.set(lang, u.pathname + u.hash);
    } catch {
    }
  }
  if (alternates.size === 0) return;

  const current = (document.documentElement.lang || '').split('-')[0].toLowerCase();

  for (const link of links) {
    const lang = link.getAttribute('hreflang')?.split('-')[0] ?? '';
    const url = alternates.get(lang);
    if (url) link.setAttribute('href', url);
    if (lang !== '' && lang === current) link.setAttribute('aria-current', 'true');
    else link.removeAttribute('aria-current');
  }

  const currentLink = links.find((l) => l.getAttribute('aria-current') === 'true');
  const name = currentLink?.getAttribute('title');
  if (name) toggle.setAttribute('aria-label', name);
  const textNode = Array.from(toggle.childNodes).find(
    (n) => n.nodeType === Node.TEXT_NODE && (n.textContent?.trim().length ?? 0) > 0,
  );
  if (textNode && current) textNode.textContent = current.toUpperCase();
}

function handlePointerDown(event: PointerEvent) {
  if (!isOpen()) return;
  if (!wrap?.contains(event.target as Node)) close();
}

function handleKeyDown(event: KeyboardEvent) {
  if (event.key === 'Escape' && isOpen()) {
    close();
    toggle?.focus();
  }
}

if (wrap && wrap.dataset.bound !== 'true') {
  wrap.dataset.bound = 'true';
  toggle?.addEventListener('click', () => setOpen(!isOpen()));
  links.forEach((link) =>
    link.addEventListener('click', (event) => {
      event.preventDefault();
      close();
      location.assign(link.href + location.hash);
    }),
  );
  document.addEventListener('pointerdown', handlePointerDown);
  document.addEventListener('keydown', handleKeyDown);
}

document.addEventListener('astro:page-load', () => {
  close();
  syncWithPage();
});