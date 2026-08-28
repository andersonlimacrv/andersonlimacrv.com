// KineticGrid — port vanilla (sem React) do componente SatoriUI KineticGrid
// (references/background-interactive/background-interactive.tsx, MIT) para o
// padrão do projeto (cf. elastic-line.ts).
//
// Física original preservada:
//  - grid de linhas (CELL_SIZE 55) + textura de pontos (DOT_SPACING 28);
//  - warp em direção ao ponteiro com bell falloff (INFLUENCE_RADIUS 260,
//    MAX_WARP 24, easing (1-t)² com clamp dist/60);
//  - edge pin quadrático (margin 1.5) travando bordas do grid;
//  - ripples no click: raio 400px/s, opacidade 1 - 1.2·age, onda de 55px,
//    deslocamento máx 18·opacidade;
//  - lerp do mouse (0.08); smoothstep na cor/raio dos nós (1.8→3.2);
//  - glow radial nos nós com t > 0.3.
//
// Adaptações obrigatórias do port (ver openspec/changes/kinetic-grid-contact):
//  - canvas contido no wrapper (nada de fixed full-screen), fundo transparente;
//  - listeners de ponteiro no wrapper (coords relativas ao canvas);
//  - cores lidas dos tokens do site (foreground/primary) e revalidadas na
//    troca de tema (MutationObserver em html.class);
//  - DPR correto + ResizeObserver;
//  - rAF pausado quando o box sai da viewport (IntersectionObserver);
//  - prefers-reduced-motion: frame único estático (data-static="true");
//  - init/cleanup via eventos Astro (astro:page-load / before-swap);
//  - hooks de debug p/ e2e: data-ripple-count e data-static no wrapper.

interface Point {
  x: number;
  y: number;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  born: number;
}

interface RGB {
  r: number;
  g: number;
  b: number;
}

interface ThemeColors {
  /** textura/linhas/nós em repouso — foreground do tema */
  base: RGB;
  /** estado ativo (perto do cursor/ondas) — primary (ou foreground em mono) */
  active: RGB;
}

interface KineticGridState {
  wrapper: HTMLElement;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  w: number;
  h: number;
  dpr: number;
  mouse: Point;
  targetMouse: Point;
  ripples: Ripple[];
  colors: ThemeColors | null;
  colorMode: 'default' | 'monochrome';
  visible: boolean;
  isStatic: boolean;
}

// ─── Constantes (idênticas ao original) ──────────────────────────────────────

const CELL_SIZE = 55;
const INFLUENCE_RADIUS = 260;
const MAX_WARP = 24;
const DOT_SPACING = 28;
const LERP_SPEED = 0.08;

const LINE_BASE_ALPHA = 0.13;
const TEXTURE_ALPHA = 0.05;
const NODE_BASE_ALPHA = 0.2;
const NODE_BASE_RADIUS = 1.8;
const NODE_ACTIVE_RADIUS = 3.2;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function lerpN(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function rgba(c: RGB, a: number): string {
  return `rgba(${c.r},${c.g},${c.b},${a})`;
}

/**
 * Normaliza QUALQUER cor CSS computada (oklch, color-mix, hex…) para sRGB via
 * snapshot de 1px — o Canvas2D só aceita cores que o parser entenda, e nós
 * precisamos compor alpha manualmente por cima do token.
 */
const probeCanvas =
  typeof document !== 'undefined'
    ? document.createElement('canvas')
    : null;
if (probeCanvas) {
  probeCanvas.width = 1;
  probeCanvas.height = 1;
}
function resolveToRgb(cssColor: string): RGB | null {
  if (!probeCanvas) return null;
  const ctx = probeCanvas.getContext('2d');
  if (!ctx) return null;
  ctx.clearRect(0, 0, 1, 1);
  ctx.fillStyle = cssColor;
  ctx.fillRect(0, 0, 1, 1);
  const data = ctx.getImageData(0, 0, 1, 1).data;
  if (data[3] === 0) return null;
  return { r: data[0], g: data[1], b: data[2] };
}

function readColors(
  wrapper: HTMLElement,
  colorMode: 'default' | 'monochrome',
): ThemeColors {
  const computed = getComputedStyle(wrapper).color;
  const base = resolveToRgb(computed) ?? { r: 128, g: 128, b: 128 };

  let active = base;
  if (colorMode === 'default') {
    const probe = document.createElement('span');
    probe.style.color = 'var(--primary)';
    probe.style.display = 'none';
    wrapper.appendChild(probe);
    const primary = resolveToRgb(getComputedStyle(probe).color);
    probe.remove();
    if (primary) active = primary;
  }
  return { base, active };
}

// ─── Estado / registros de módulo ────────────────────────────────────────────

const states: KineticGridState[] = [];
let rafId: number | null = null;
let ro: ResizeObserver | null = null;
let io: IntersectionObserver | null = null;
let themeMo: MutationObserver | null = null;
const OFFSCREEN: Point = { x: -9999, y: -9999 };

// ─── Física (port fiel de getWarpedPoint) ────────────────────────────────────

function getWarpedPoint(
  gx: number,
  gy: number,
  col: number,
  row: number,
  mouse: Point,
  ripples: Ripple[],
  cols: number,
  rows: number,
): { pt: Point; proximity: number } {
  // Edge pin — trava suavemente as linhas/colunas de borda
  const edgeMargin = 1.5;
  const colPin = Math.min(col / edgeMargin, (cols - 1 - col) / edgeMargin, 1);
  const rowPin = Math.min(row / edgeMargin, (rows - 1 - row) / edgeMargin, 1);
  const pinFactor = colPin * colPin * rowPin * rowPin;

  const dx = gx - mouse.x;
  const dy = gy - mouse.y;
  const dist = Math.sqrt(dx * dx + dy * dy);

  const proximity = Math.max(0, 1 - dist / INFLUENCE_RADIUS) * pinFactor;

  // Deslocamento das ondas (ripples)
  let rx = 0;
  let ry = 0;
  for (const r of ripples) {
    const rdx = gx - r.x;
    const rdy = gy - r.y;
    const rdist = Math.sqrt(rdx * rdx + rdy * rdy);
    const waveWidth = 55;
    const diff = rdist - r.radius;
    if (Math.abs(diff) < waveWidth) {
      const strength =
        (1 - Math.abs(diff) / waveWidth) * r.opacity * 18 * pinFactor;
      const angle = Math.atan2(rdy, rdx);
      const sign = diff < 0 ? -1 : 1;
      rx += Math.cos(angle) * strength * sign * -1;
      ry += Math.sin(angle) * strength * sign * -1;
    }
  }

  // Warp em direção ao cursor com bell falloff
  if (dist < INFLUENCE_RADIUS && dist > 0 && pinFactor > 0) {
    const t = dist / INFLUENCE_RADIUS;
    const eased = t < 0.01 ? 0 : (1 - t) * (1 - t) * Math.min(1, dist / 60);
    const warpAmt = eased * MAX_WARP * pinFactor;
    const angle = Math.atan2(dy, dx);
    return {
      pt: {
        x: gx - Math.cos(angle) * warpAmt + rx,
        y: gy - Math.sin(angle) * warpAmt + ry,
      },
      proximity,
    };
  }

  return { pt: { x: gx + rx, y: gy + ry }, proximity };
}

// ─── Render ──────────────────────────────────────────────────────────────────

function draw(state: KineticGridState, now: number) {
  const { ctx, w: W, h: H, mouse, ripples, colors } = state;
  if (!colors) return;

  const base = colors.base;
  const active = colors.active;

  ctx.clearRect(0, 0, W, H);

  // Textura estática de pontos de fundo (original: branco 0.05)
  ctx.fillStyle = rgba(base, TEXTURE_ALPHA);
  for (let x = DOT_SPACING / 2; x < W; x += DOT_SPACING) {
    for (let y = DOT_SPACING / 2; y < H; y += DOT_SPACING) {
      ctx.beginPath();
      ctx.arc(x, y, 0.7, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Atualiza ripples
  for (let i = ripples.length - 1; i >= 0; i--) {
    const r = ripples[i];
    const age = (now - r.born) / 1000;
    r.radius = Math.max(0, age * 400);
    r.opacity = Math.max(0, 1 - age * 1.2);
    if (r.opacity <= 0) ripples.splice(i, 1);
  }

  // ── Grid deformado ────────────────────────────────────────────────────────
  const cols = Math.max(2, Math.ceil(W / CELL_SIZE)) + 1;
  const rows = Math.max(2, Math.ceil(H / CELL_SIZE)) + 1;
  const cellW = W / (cols - 1);
  const cellH = H / (rows - 1);

  const pts: Point[][] = [];
  const prox: number[][] = [];

  for (let row = 0; row < rows; row++) {
    pts[row] = [];
    prox[row] = [];
    for (let col = 0; col < cols; col++) {
      const { pt, proximity } = getWarpedPoint(
        col * cellW,
        row * cellH,
        col,
        row,
        mouse,
        ripples,
        cols,
        rows,
      );
      pts[row][col] = pt;
      prox[row][col] = proximity;
    }
  }

  // ── Linhas do grid ────────────────────────────────────────────────────────
  const lineBase: RGB = base;
  const lineActive: RGB = active;
  const drawSeg = (p1: Point, p2: Point, pr1: number, pr2: number) => {
    const avg = (pr1 + pr2) / 2;
    const t = avg * avg * (3 - 2 * avg); // smoothstep
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.strokeStyle = `rgba(${Math.round(lerpN(lineBase.r, lineActive.r, t))},${Math.round(lerpN(lineBase.g, lineActive.g, t))},${Math.round(lerpN(lineBase.b, lineActive.b, t))},${lerpN(LINE_BASE_ALPHA, 0.9, t).toFixed(3)})`;
    ctx.lineWidth = lerpN(0.8, 1.5, t);
    ctx.stroke();
  };

  ctx.lineCap = 'butt';

  for (let row = 0; row < rows; row++)
    for (let col = 0; col < cols - 1; col++)
      drawSeg(pts[row][col], pts[row][col + 1], prox[row][col], prox[row][col + 1]);

  for (let col = 0; col < cols; col++)
    for (let row = 0; row < rows - 1; row++)
      drawSeg(pts[row][col], pts[row + 1][col], prox[row][col], prox[row + 1][col]);

  // ── Nós das interseções ───────────────────────────────────────────────────
  const activeGlow = `${active.r},${active.g},${active.b}`;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const p = pts[row][col];
      const pr = prox[row][col];
      const t = pr * pr * (3 - 2 * pr); // smoothstep
      const r = lerpN(NODE_BASE_RADIUS, NODE_ACTIVE_RADIUS, t);

      // Anel de glow nos nós ativos
      if (t > 0.3) {
        const glowR = r + lerpN(0, 6, (t - 0.3) / 0.7);
        const grd = ctx.createRadialGradient(p.x, p.y, r * 0.5, p.x, p.y, glowR);
        grd.addColorStop(0, `rgba(${activeGlow},${(t * 0.3).toFixed(3)})`);
        grd.addColorStop(1, `rgba(${activeGlow},0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, glowR, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
      }

      // Preenchimento do nó
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${Math.round(lerpN(base.r, active.r, t))},${Math.round(lerpN(base.g, active.g, t))},${Math.round(lerpN(base.b, active.b, t))},${lerpN(NODE_BASE_ALPHA, 1, t).toFixed(3)})`;
      ctx.fill();
    }
  }

  // ── Anéis dos ripples ─────────────────────────────────────────────────────
  for (const r of ripples) {
    const safeRadius = Math.max(0, r.radius);
    ctx.beginPath();
    ctx.arc(r.x, r.y, safeRadius, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(${activeGlow},${(r.opacity * 0.28).toFixed(3)})`;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }
}

// ─── Loop / dimensionamento / eventos ────────────────────────────────────────

function applySize(state: KineticGridState) {
  const rect = state.wrapper.getBoundingClientRect();
  const w = rect.width;
  const h = rect.height;
  if (w === 0 || h === 0) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  state.dpr = dpr;
  state.w = w;
  state.h = h;
  state.canvas.width = Math.round(w * dpr);
  state.canvas.height = Math.round(h * dpr);
  state.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  if (state.isStatic) draw(state, performance.now());
}

function frame(now: number) {
  for (const state of states) {
    if (!state.visible || state.isStatic) continue;
    state.mouse.x = lerpN(state.mouse.x, state.targetMouse.x, LERP_SPEED);
    state.mouse.y = lerpN(state.mouse.y, state.targetMouse.y, LERP_SPEED);
    draw(state, now);
  }
  rafId = requestAnimationFrame(frame);
}

function startLoop() {
  if (rafId === null) rafId = requestAnimationFrame(frame);
}

function relativePoint(state: KineticGridState, e: PointerEvent): Point {
  const rect = state.canvas.getBoundingClientRect();
  return { x: e.clientX - rect.left, y: e.clientY - rect.top };
}

function bindWrapper(wrapper: HTMLElement) {
  const canvas = wrapper.querySelector<HTMLCanvasElement>('canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const colorMode =
    wrapper.dataset.kineticColor === 'monochrome' ? 'monochrome' : 'default';
  const reduced =
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

  const state: KineticGridState = {
    wrapper,
    canvas,
    ctx,
    w: 0,
    h: 0,
    dpr: 1,
    mouse: { ...OFFSCREEN },
    targetMouse: { ...OFFSCREEN },
    ripples: [],
    colors: null,
    colorMode,
    visible: false,
    isStatic: reduced,
  };
  states.push(state);

  state.colors = readColors(wrapper, colorMode);
  applySize(state);

  if (state.isStatic) {
    wrapper.dataset.static = 'true';
    draw(state, performance.now());
  } else {
    wrapper.addEventListener(
      'pointermove',
      (e: PointerEvent) => {
        state.targetMouse = relativePoint(state, e);
      },
      { passive: true },
    );
    wrapper.addEventListener('pointerleave', () => {
      state.targetMouse = { ...OFFSCREEN };
    });
    wrapper.addEventListener('pointerdown', (e: PointerEvent) => {
      const p = relativePoint(state, e);
      state.ripples.push({
        x: p.x,
        y: p.y,
        radius: 0,
        opacity: 1,
        born: performance.now(),
      });
      const count = Number.parseInt(wrapper.dataset.rippleCount ?? '0', 10);
      wrapper.dataset.rippleCount = String(Number.isNaN(count) ? 1 : count + 1);
    });
  }

  if (ro) ro.observe(wrapper);
  if (io) io.observe(wrapper);
}

function revalidateColors() {
  for (const state of states) {
    if (!state.wrapper.isConnected) continue;
    state.colors = readColors(state.wrapper, state.colorMode);
    if (state.isStatic) draw(state, performance.now());
  }
}

function prune() {
  for (let i = states.length - 1; i >= 0; i--) {
    if (!states[i].wrapper.isConnected) {
      if (ro) ro.unobserve(states[i].wrapper);
      if (io) io.unobserve(states[i].wrapper);
      states.splice(i, 1);
    }
  }
  if (states.length === 0 && rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
}

function init() {
  prune();
  if (!ro) {
    ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const state = states.find((s) => s.wrapper === entry.target);
        if (state) applySize(state);
      }
    });
  }
  if (!io) {
    io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const state = states.find((s) => s.wrapper === entry.target);
        if (state) state.visible = entry.isIntersecting;
      }
      if (states.some((s) => s.visible && !s.isStatic)) startLoop();
    });
  }
  if (!themeMo) {
    themeMo = new MutationObserver(revalidateColors);
    themeMo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
  }
  document.querySelectorAll<HTMLElement>('[data-kinetic-grid]').forEach((el) => {
    if (el.dataset.bound === 'true') return;
    el.dataset.bound = 'true';
    bindWrapper(el);
  });
  if (states.some((s) => s.visible && !s.isStatic)) startLoop();
}

document.addEventListener('astro:page-load', init);
document.addEventListener('astro:after-swap', init);
init();

// Marca o arquivo como módulo ES (evita colisão de nomes no escopo global
// do tsc com outros scripts sem import/export, ex.: elastic-line.ts).
export {};
