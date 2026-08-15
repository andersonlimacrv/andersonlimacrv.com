// morph-measure.ts — Mede o box real do retrato no hero e publica valores em
// px para os wireframes blueprint ([data-bp-wireframe]). Os valores vão para
// CSS vars (--bp-w/--bp-h) e spans [data-bp="w|h|d|a|s"].
//
// Performance-first: sem listeners pesados; recalcula em load/resize/fonts.
// Reaproveita a neutralização de transform do scroll-morph.ts (em estado
// reduced-motion a imagem já nasce com transform aplicado).

interface Wireframe {
  root: HTMLElement;
  img: HTMLElement | null;
}

const FINAL_SIZE = 160;
let wireframes: Wireframe[] = [];
let bound = false;

function fmt(value: number, digits = 0): string {
  return Number.isFinite(value) ? value.toFixed(digits) : '—';
}

function neutralRect(el: HTMLElement): DOMRect {
  const affected: Array<{
    el: HTMLElement;
    transform: string;
    clip: string;
  }> = [];
  let node: HTMLElement | null = el;
  while (node && node !== document.documentElement) {
    const cs = getComputedStyle(node);
    if (cs.transform !== 'none' || node.style.transform) {
      affected.push({ el: node, transform: node.style.transform, clip: node.style.clipPath });
      node.style.transform = 'none';
      node.style.clipPath = 'none';
    }
    node = node.parentElement;
  }
  const r = el.getBoundingClientRect();
  for (const a of affected) {
    a.el.style.transform = a.transform;
    a.el.style.clipPath = a.clip;
  }
  return r;
}

function fill(wf: Wireframe): void {
  if (!wf.img) return;
  const r = neutralRect(wf.img);
  const w = r.width;
  const h = r.height;
  const d = Math.hypot(w, h);
  const s = FINAL_SIZE / Math.max(1, Math.min(w, h));
  const radius = FINAL_SIZE / 2;

  wf.root.style.setProperty('--bp-w', `${w}px`);
  wf.root.style.setProperty('--bp-h', `${h}px`);

  const values: Record<string, string> = {
    w: `${fmt(w)}px`,
    h: `${fmt(h)}px`,
    d: `${fmt(d)}px`,
    a: `${fmt(w * h)}px²`,
    s: fmt(s, 3),
    r: `${radius}px`,
    df: `${FINAL_SIZE}px`,
    af: `${fmt(Math.PI * radius * radius)}px²`,
    c: `${fmt(2 * Math.PI * radius)}px`,
  };
  for (const span of wf.root.querySelectorAll<HTMLElement>('[data-bp]')) {
    const key = span.dataset.bp;
    if (key && values[key]) span.textContent = values[key];
  }
}

function refresh(): void {
  for (const wf of wireframes) fill(wf);
}

function collect(): void {
  wireframes = Array.from(
    document.querySelectorAll<HTMLElement>('[data-bp-wireframe]'),
  ).map((root) => ({
    root,
    img:
      root.parentElement?.querySelector<HTMLElement>('[data-scroll-morph] img') ??
      null,
  }));
}

function init(): void {
  collect();
  refresh();
  if (!bound) {
    bound = true;
    window.addEventListener('resize', refresh, { passive: true });
    window.addEventListener('load', refresh, { passive: true });
    document.fonts?.ready?.then(refresh).catch(() => undefined);
  }
}

document.addEventListener('astro:page-load', init);
init();

export {};