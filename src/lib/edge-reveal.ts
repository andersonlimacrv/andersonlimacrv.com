// EdgeReveal ("Rover") — port vanilla do script inline de
// `references/components/ManyHovers.html` para Astro.
//
// Comportamento preservado: overlay entra pela borda mais próxima (4 lados),
// 600 ms expo-out via WAAPI na propriedade `translate` + commit do repouso.
// SÓ o fundo se move — o texto (`.hv-ink`) nunca é animado, contrasta via
// `mix-blend-mode: difference`.
//
// Adaptações ao projeto (cf. `reveal.ts`):
// - dedupe por `WeakSet` + re-init em `astro:page-load` / `astro:after-swap`
//   (módulos não re-executam após o swap do ClientRouter).

const REVEAL_MS = 600;
const REVEAL_EASING = 'cubic-bezier(0.16, 1, 0.3, 1)'; // expo.out

type RevealEdge = 'top' | 'right' | 'bottom' | 'left';

// Distância mínima até cada borda (direction-aware clássico).
function findClosestEdge(
  mouseX: number,
  mouseY: number,
  width: number,
  height: number,
): RevealEdge {
  const dTop = mouseY;
  const dBottom = height - mouseY;
  const dLeft = mouseX;
  const dRight = width - mouseX;
  const m = Math.min(dTop, dBottom, dLeft, dRight);
  if (m === dRight) return 'right';
  if (m === dLeft) return 'left';
  if (m === dBottom) return 'bottom';
  return 'top';
}

// Vetor `translate` fora da tela para cada borda (fundo 100% para fora).
function edgeVector(edge: RevealEdge): string {
  switch (edge) {
    case 'top':
      return '0 -101%';
    case 'bottom':
      return '0 101%';
    case 'left':
      return '-101% 0';
    default:
      return '101% 0'; // right
  }
}

function edgeFromEvent(ev: Event, el: HTMLElement): RevealEdge {
  const rect = el.getBoundingClientRect();
  if (ev instanceof MouseEvent || ev instanceof PointerEvent) {
    return findClosestEdge(
      ev.clientX - rect.left,
      ev.clientY - rect.top,
      rect.width,
      rect.height,
    );
  }
  return 'top';
}

const reduceMotion = () =>
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

const attached = new WeakSet<Element>();

function attachEdgeReveal(el: HTMLElement) {
  const layer = el.querySelector<HTMLElement>('[data-reveal-layer]');
  if (!layer) return;
  let anims: Animation[] = [];
  let timer = 0;
  let open = false;

  layer.style.translate = '0 101%';

  const cancel = () => {
    for (const a of anims) {
      try {
        a.cancel();
      } catch {
        // noop
      }
    }
    anims = [];
  };
  const clearTimer = () => {
    if (timer) window.clearTimeout(timer);
    timer = 0;
  };
  const commit = (anim: Animation, resting: string) => {
    try {
      anim.commitStyles?.();
    } catch {
      // noop
    }
    try {
      anim.cancel();
    } catch {
      // noop
    }
    layer.style.translate = resting;
  };

  const show = (edge: RevealEdge) => {
    open = true;
    el.classList.add('is-open');
    cancel();
    clearTimer();
    if (reduceMotion()) {
      layer.style.translate = '0 0';
      return;
    }
    // Parte da borda de entrada (salto instantâneo invisível), nunca do repouso.
    const start = edgeVector(edge);
    const a = layer.animate(
      [{ translate: start }, { translate: '0 0' }],
      { duration: REVEAL_MS, easing: REVEAL_EASING, fill: 'forwards' },
    );
    anims = [a];
    let settled = false;
    const settle = () => {
      if (settled || !open || !el.isConnected) return;
      settled = true;
      clearTimer();
      commit(a, '0 0');
      anims = [];
    };
    a.onfinish = settle;
    timer = window.setTimeout(settle, REVEAL_MS + 120);
  };

  const hide = (edge: RevealEdge) => {
    open = false;
    el.classList.remove('is-open');
    cancel();
    clearTimer();
    if (reduceMotion()) {
      layer.style.translate = edgeVector(edge);
      return;
    }
    const start = layer.style.translate || '0 0';
    const resting = edgeVector(edge);
    const a = layer.animate(
      [{ translate: start }, { translate: resting }],
      { duration: REVEAL_MS, easing: REVEAL_EASING, fill: 'forwards' },
    );
    anims = [a];
    let settled = false;
    const settle = () => {
      if (settled || open || !el.isConnected) return;
      settled = true;
      clearTimer();
      commit(a, resting);
      anims = [];
    };
    a.onfinish = settle;
    timer = window.setTimeout(settle, REVEAL_MS + 120);
  };

  el.addEventListener('mouseenter', (ev) => show(edgeFromEvent(ev, el)));
  el.addEventListener('mouseleave', (ev) => hide(edgeFromEvent(ev, el)));
  el.addEventListener('focus', () => show('top'));
  el.addEventListener('blur', () => hide('bottom'));
  // Links (<a>) nunca alternam no toque: o tap precisa navegar de verdade.
  // Sem unload (ex.: mailto:) o overlay apenas permanece — a ação principal
  // nunca quebra. Hover/focus continuam valendo para links.
  if (el instanceof HTMLAnchorElement) return;
  el.addEventListener('click', (ev) => {
    // touch (sem hover): alterna; com mouse o hover já cuida.
    if (window.matchMedia('(hover: hover)').matches) return;
    ev.preventDefault();
    if (open) hide(edgeFromEvent(ev, el));
    else show(edgeFromEvent(ev, el));
  });
}

function init() {
  document
    .querySelectorAll<HTMLElement>('[data-edge-reveal]')
    .forEach((el) => {
      if (attached.has(el) || !el.isConnected) return;
      attached.add(el);
      attachEdgeReveal(el);
    });
}

document.addEventListener('astro:page-load', init);
document.addEventListener('astro:after-swap', init);
init();

export {};
