// LanguageSwitcher — disclosure de idiomas com o mesmo comportamento do
// menu hambúrguer mobile (cf. site-header.ts): botão com aria-expanded,
// reveal max-height/opacity via --menu-h, stagger nos links (WAAPI),
// fecha em Esc / clique-fora / clique num link / navegação (astro:page-load).
//
// Enhancement progressivo: sem JS o popup permanece fechado — mesmo
// compromisso do hambúrguer mobile.

const wrap = document.querySelector<HTMLElement>('[data-locale-switcher]');

// Inatividade do site-header esconde o header após 3s — com o popup aberto,
// o header não deve sumir junto (o hambúrguer aberto já tem esse guard).
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

// O header persiste entre navegações (transition:persist) — os hrefs do
// popup ficariam presos na primeira página da sessão (ex.: no POST, clicar
// ES ia para /es/ em vez do post traduzido). O <head>, por sua vez, É
// trocado a cada navegação: os <link rel="alternate" hreflang> trazem as
// URLs localizadas exatas da página corrente (incl. posts traduzidos).
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
      /* URL inválida: ignora */
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

  // Botão: código do locale corrente + nome do idioma (title do link atual —
  // nomes de idioma são autônimos: "Español" vale em qualquer UI).
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

// O wrap vive dentro do header persistido (view transition) — listeners são
// amarrados uma única vez; astro:page-load fecha o popup a cada navegação.
if (wrap && wrap.dataset.bound !== 'true') {
  wrap.dataset.bound = 'true';
  toggle?.addEventListener('click', () => setOpen(!isOpen()));
  links.forEach((link) =>
    link.addEventListener('click', (event) => {
      // Navegação plena (como o antigo select com location.assign): o header
      // persistido manteria os rótulos/hrefs do idioma antigo numa navegação
      // soft do ClientRouter. O hash corrente é preservado (#contato etc.).
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