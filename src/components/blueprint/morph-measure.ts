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

const DEFAULT_FINAL_SIZE = 160;
let wireframes: Wireframe[] = [];
let bound = false;

function fmt(value: number, digits = 0): string {
  return Number.isFinite(value) ? value.toFixed(digits) : '—';
}

// Diâmetro final responsivo: lê --morph-final-size (definido no :root) e cai
// para 160px quando ausente — mesma fonte do JS do morph.
function finalSizeOf(root: HTMLElement): number {
  const raw = getComputedStyle(root).getPropertyValue('--morph-final-size').trim();
  if (raw) {
    const value = Number.parseFloat(raw);
    if (Number.isFinite(value) && value > 0) return value;
  }
  return DEFAULT_FINAL_SIZE;
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
  const finalSize = finalSizeOf(wf.root);
  const s = finalSize / Math.max(1, Math.min(w, h));
  const radius = finalSize / 2;

  wf.root.style.setProperty('--bp-w', `${w}px`);
  wf.root.style.setProperty('--bp-h', `${h}px`);
  // Escala adimensional para rótulos de cota do ghost (160px → 1).
  wf.root.style.setProperty('--bp-scale', String(finalSize / DEFAULT_FINAL_SIZE));

  const values: Record<string, string> = {
    w: `${fmt(w)}px`,
    h: `${fmt(h)}px`,
    d: `${fmt(d)}px`,
    a: `${fmt(w * h)}px²`,
    s: fmt(s, 3),
    r: `${radius}px`,
    rlabel: `r ${radius}px`,
    df: `${finalSize}px`,
    af: `${fmt(Math.PI * radius * radius)}px²`,
    c: `${fmt(2 * Math.PI * radius)}px`,
  };
  for (const span of wf.root.querySelectorAll<HTMLElement>('[data-bp]')) {
    if (span.hasAttribute('data-bp-live')) continue;
    const key = span.dataset.bp;
    if (key && values[key]) span.textContent = values[key];
  }
}

// --- Leitura ao vivo durante o morph (desacoplado do scroll-morph.ts) ---
// Lê o transform aplicado no <img> a cada frame agendado (scroll/resize) e
// publica valores atuais nos rótulos [data-bp-live] dos quadrantes do
// círculo-fantasma: escala s, área A = W·H·s² e deslocamento do centro x·y.
let liveRafId: number | null = null;
let boundLive = false;

function fillLive(wf: Wireframe): void {
  if (!wf.img) return;
  let scale = 1;
  let dx = 0;
  let dy = 0;
  const tf = getComputedStyle(wf.img).transform;
  if (tf && tf !== 'none') {
    const m = new DOMMatrixReadOnly(tf);
    scale = m.a;
    dx = m.e;
    dy = m.f;
  }
  const w0 = parseFloat(wf.root.style.getPropertyValue('--bp-w')) || 0;
  const h0 = parseFloat(wf.root.style.getPropertyValue('--bp-h')) || 0;

  const live: Record<string, string> = {
    a: `A ${fmt(w0 * h0 * scale * scale)}px²`,
    s: `s ${fmt(scale, 3)}`,
    xy: `x ${fmt(dx)}\ny ${fmt(dy)}`,
  };
  for (const span of wf.root.querySelectorAll<HTMLElement>('[data-bp-live]')) {
    const key = span.dataset.bp;
    const text = key && live[key] ? live[key] : null;
    if (text !== null && span.textContent !== text) span.textContent = text;
  }

  // Flip de cor no Start quando a imagem está cobrindo o wireframe (light
  // mode: a tinta escura someria sobre a foto preta). Histerese 0.99/0.95.
  // Só a raiz Start (o Board fica atrás da foto; flip não teria efeito).
  if (wf.root.classList.contains('bp-start')) {
    const covered = wf.root.classList.contains('bp-covered');
    if (scale >= 0.99 && !covered) wf.root.classList.add('bp-covered');
    else if (scale < 0.95 && covered) wf.root.classList.remove('bp-covered');
  }
}

function frameLive(): void {
  for (const wf of wireframes) fillLive(wf);
  liveRafId = null;
}

function scheduleLive(): void {
  if (liveRafId !== null) return;
  liveRafId = requestAnimationFrame(frameLive);
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
  if (!boundLive) {
    boundLive = true;
    window.addEventListener('scroll', scheduleLive, { passive: true });
    window.addEventListener('resize', scheduleLive, { passive: true });
  }
  scheduleLive();
}

document.addEventListener('astro:page-load', init);
init();

export {};