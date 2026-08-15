// Morph de scroll da imagem hero: retângulo (topo) → círculo (seção Sobre).
// Performance-first (plan.md):
//  - apenas clip-path (polygon de 16 vértices) e transform (scale/translate);
//  - requestAnimationFrame deduplica escrita; scroll listener passive;
//  - vértices recalculados no resize; will-change/contain:paint no CSS;
//  - prefers-reduced-motion → estado final direto.
//
// Coordenadas do clip-path são locais ao box do elemento. O transform
// (translate + scale, origin center) move/encolhe o resultado; o translate
// é a distância entre o centro original da imagem e o centro do destino.
//
// Uso (via ScrollMorphPortrait.astro):
//   <figure data-scroll-morph data-target="#sobre" data-final-scale="0.35"
//           data-final-radius="44">
//     <img ... />
//   </figure>

interface MorphTarget {
  root: HTMLElement;
  img: HTMLElement;
  target: HTMLElement;
  vertices: number;
  finalScale: number;
  finalX: number;
  finalY: number;
  reduced: boolean;
  rect: DOMRect;
  targetRect: DOMRect;
}

let rafId: number | null = null;
let boundGlobal = false;
let ro: ResizeObserver | null = null;
const targets: MorphTarget[] = [];

function num(el: HTMLElement, key: string, fallback: number): number {
  const raw = el.dataset[key];
  if (raw === undefined) return fallback;
  const value = Number.parseFloat(raw);
  return Number.isFinite(value) ? value : fallback;
}

// Progresso 0..1 entre o topo (hero) e a seção de destino.
// Usa posições absolutas (documento) armazenadas em measure() — imunes ao
// scroll — e compara com o scrollY atual. p=0 no topo; p=1 quando a seção
// de destino atinge ~30% da altura da viewport.
function computeProgress(t: MorphTarget): number {
  const innerH = window.innerHeight;
  const imgTop = t.rect.top;
  const targetTop = t.targetRect.top;
  const startScroll = Math.max(0, imgTop - innerH * 0.3);
  const endScroll = Math.max(startScroll + 1, targetTop - innerH * 0.3);
  const p = (window.scrollY - startScroll) / (endScroll - startScroll);
  return Math.min(1, Math.max(0, p));
}

// Gera os pontos do polígono interpolados entre o retângulo e o círculo.
// 64 vértices: cantos + pontos por borda no retângulo; no círculo, os mesmos
// 64 pontos sobre a circunferência centrada no box local do elemento. Com 64
// pontos a circunferência final é visualmente um círculo perfeito, e a
// interpolação arredonda os cantos de forma progressiva.
function polygonFor(t: MorphTarget, p: number): string {
  const w = t.rect.width;
  const h = t.rect.height;
  const cx = w / 2;
  const cy = h / 2;
  const r = Math.min(w, h) / 2;

  const perEdge = Math.max(1, Math.floor(t.vertices / 4));
  const used = perEdge * 4;
  const points: string[] = [];

  for (let i = 0; i < used; i++) {
    const edge = Math.floor(i / perEdge);
    const k = (i % perEdge) / perEdge;
    let x0: number, y0: number;
    if (edge === 0) {
      x0 = w * k;
      y0 = 0;
    } else if (edge === 1) {
      x0 = w;
      y0 = h * k;
    } else if (edge === 2) {
      x0 = w * (1 - k);
      y0 = h;
    } else {
      x0 = 0;
      y0 = h * (1 - k);
    }

    const angle = (i / used) * Math.PI * 2;
    const x1 = cx + Math.cos(angle) * r;
    const y1 = cy + Math.sin(angle) * r;

    const x = x0 + (x1 - x0) * p;
    const y = y0 + (y1 - y0) * p;
    points.push(`${x.toFixed(2)}px ${y.toFixed(2)}px`);
  }
  return `polygon(${points.join(', ')})`;
}

// Transform: do tamanho original (scale 1) até o círculo final (finalScale).
// translate desloca o centro da imagem até a posição alvo na seção de
// destino (fração finalX/finalY do retângulo alvo); scale encolhe.
function transformFor(t: MorphTarget, p: number): string {
  const s = 1 + (t.finalScale - 1) * p;
  const srcCx = t.rect.left + t.rect.width / 2;
  const srcCy = t.rect.top + t.rect.height / 2;
  const dstCx = t.targetRect.left + t.targetRect.width * t.finalX;
  const dstCy = t.targetRect.top + t.targetRect.height * t.finalY;
  const dx = (dstCx - srcCx) * p;
  const dy = (dstCy - srcCy) * p;
  return `translate(${dx.toFixed(2)}px, ${dy.toFixed(2)}px) scale(${s.toFixed(4)})`;
}

function apply(t: MorphTarget, p: number) {
  t.img.style.clipPath = polygonFor(t, p);
  t.img.style.transform = transformFor(t, p);
}

function frame() {
  for (const t of targets) {
    const p = t.reduced ? 1 : computeProgress(t);
    apply(t, p);
  }
  rafId = null;
}

function schedule() {
  if (rafId !== null) return;
  rafId = requestAnimationFrame(frame);
}

function measure(t: MorphTarget) {
  const sy = window.scrollY;
  const sx = window.scrollX;
  const r = t.img.getBoundingClientRect();
  t.rect = new DOMRect(r.left + sx, r.top + sy, r.width, r.height);
  const tr = t.target.getBoundingClientRect();
  t.targetRect = new DOMRect(tr.left + sx, tr.top + sy, tr.width, tr.height);
}

function bindTarget(el: HTMLElement) {
  const img = el.querySelector<HTMLImageElement>('img');
  const targetSel = el.dataset.target;
  const target = targetSel
    ? document.querySelector<HTMLElement>(targetSel)
    : el.parentElement;
  if (!img || !target) return;

  const t: MorphTarget = {
    root: el,
    img,
    target,
    vertices: num(el, 'vertices', 64),
    finalScale: num(el, 'finalScale', 0.35),
    finalX: num(el, 'finalX', 0.5),
    finalY: num(el, 'finalY', 0.5),
    reduced: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    rect: new DOMRect(),
    targetRect: new DOMRect(),
  };
  measure(t);
  targets.push(t);

  if (t.reduced) {
    img.style.clipPath = polygonFor(t, 1);
    img.style.transform = transformFor(t, 1);
  }
}

function init() {
  if (!boundGlobal) {
    boundGlobal = true;
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', () => {
      for (const t of targets) measure(t);
      schedule();
    });
  }
  if (!ro) {
    ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const t = targets.find((x) => x.root === entry.target);
        if (t) {
          measure(t);
          schedule();
        }
      }
    });
  }
  document.querySelectorAll<HTMLElement>('[data-scroll-morph]').forEach((el) => {
    if (el.dataset.bound === 'true') return;
    el.dataset.bound = 'true';
    if (ro) ro.observe(el);
    bindTarget(el);
  });
}

document.addEventListener('astro:page-load', init);
init();

export {};