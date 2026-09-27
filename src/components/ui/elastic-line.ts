interface ElasticLineState {
  svg: SVGSVGElement;
  path: SVGPathElement;
  vertical: boolean;
  grabThreshold: number;
  releaseThreshold: number;
  stiffness: number;
  damping: number;
  width: number;
  height: number;
  controlX: number;
  controlY: number;
  vx: number;
  vy: number;
  grabbed: boolean;
  pointerX: number;
  pointerY: number;
}

let rafId: number | null = null;
let lastFrame = 0;
let boundList = false;
let ro: ResizeObserver | null = null;
const states: ElasticLineState[] = [];
const PULL = 2.2;

function num(container: HTMLElement, key: string, fallback: number): number {
  const raw = container.dataset[key];
  if (raw === undefined) return fallback;
  const value = Number.parseFloat(raw);
  return Number.isFinite(value) ? value : fallback;
}

function midX(state: ElasticLineState) {
  return state.width / 2;
}

function midY(state: ElasticLineState) {
  return state.height / 2;
}

function applySize(state: ElasticLineState, width: number, height: number) {
  state.width = width;
  state.height = height;
  if (width > 0 && height > 0) {
    state.svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  }
  state.controlX = midX(state);
  state.controlY = midY(state);
  state.vx = 0;
  state.vy = 0;
  state.path.setAttribute('d', dFor(state));
}

function measure(state: ElasticLineState) {
  const rect = state.svg.getBoundingClientRect();
  applySize(state, rect.width, rect.height);
}

function dFor(state: ElasticLineState): string {
  const w = state.width;
  const h = state.height;
  if (w <= 0 || h <= 0) return '';
  const { controlX, controlY } = state;
  return state.vertical
    ? `M${midX(state)} 0 Q${controlX} ${controlY} ${midX(state)} ${h}`
    : `M0 ${midY(state)} Q${controlX} ${controlY} ${w} ${midY(state)}`;
}

function lifted(state: ElasticLineState, x: number, y: number) {
  return state.vertical
    ? { x: midX(state) + PULL * (x - midX(state)), y }
    : { x, y: midY(state) + PULL * (y - midY(state)) };
}

function handlePointer(state: ElasticLineState, ev: PointerEvent) {
  const rect = state.svg.getBoundingClientRect();
  const x = ev.clientX - rect.left;
  const y = ev.clientY - rect.top;
  state.pointerX = x;
  state.pointerY = y;

  const out = x < 0 || x > state.width || y < 0 || y > state.height;
  if (out) {
    if (state.grabbed) state.grabbed = false;
    return;
  }

  const dist = state.vertical ? Math.abs(x - midX(state)) : Math.abs(y - midY(state));
  const limit = Math.min(state.releaseThreshold, state.vertical ? state.width / 2 : state.height / 2);

  if (!state.grabbed && dist < state.grabThreshold) {
    state.grabbed = true;
    const p = lifted(state, state.pointerX, state.pointerY);
    state.controlX = p.x;
    state.controlY = p.y;
    state.path.setAttribute('d', dFor(state));
  } else if (state.grabbed) {
    const p = lifted(state, state.pointerX, state.pointerY);
    state.controlX = p.x;
    state.controlY = p.y;
    state.path.setAttribute('d', dFor(state));

    if (dist > limit) {
      state.grabbed = false;
      state.vx = 0;
      state.vy = 0;
    }
  }
}

function step(state: ElasticLineState, now: number) {
  if (state.width <= 0 || state.height <= 0) return;
  const dt = Math.min(Math.max((now - lastFrame) / 1000, 0), 0.05);

  if (state.grabbed) {
    const p = lifted(state, state.pointerX, state.pointerY);
    state.controlX = p.x;
    state.controlY = p.y;
  } else {
    const fx = state.stiffness * (midX(state) - state.controlX) - state.damping * state.vx;
    state.vx += fx * dt;
    state.controlX += state.vx * dt;

    const fy = state.stiffness * (midY(state) - state.controlY) - state.damping * state.vy;
    state.vy += fy * dt;
    state.controlY += state.vy * dt;
  }
  state.path.setAttribute('d', dFor(state));
}

function frame(now: number) {
  for (const state of states) step(state, now);
  lastFrame = now;
  rafId = requestAnimationFrame(frame);
}

function startLoop() {
  if (rafId === null) {
    lastFrame = performance.now();
    rafId = requestAnimationFrame(frame);
  }
}

function bindElastic(el: HTMLDivElement) {
  const svg = el.querySelector<SVGSVGElement>('svg');
  const path = el.querySelector<SVGPathElement>('path');
  if (!svg || !path) return;

  const state: ElasticLineState = {
    svg,
    path,
    vertical: el.dataset.isVertical === 'true',
    grabThreshold: num(el, 'grabThreshold', 5),
    releaseThreshold: num(el, 'releaseThreshold', 100),
    stiffness: num(el, 'stiffness', 300),
    damping: num(el, 'damping', 5),
    width: 0,
    height: 0,
    controlX: 0,
    controlY: 0,
    vx: 0,
    vy: 0,
    grabbed: false,
    pointerX: 0,
    pointerY: 0,
  };

  measure(state);

  svg.style.opacity = '0';
  window.requestAnimationFrame(() => {
    svg.style.transition = 'opacity 0.3s ease-in-out';
    svg.style.opacity = '1';
  });

  states.push(state);
  startLoop();
}

function onPointerMove(ev: PointerEvent) {
  for (const state of states) handlePointer(state, ev);
}

function init() {
  if (!boundList) {
    boundList = true;
    window.addEventListener('pointermove', onPointerMove, { passive: true });
  }
  if (!ro) {
    ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const state = states.find((s) => s.svg === entry.target);
        if (state) {
          applySize(state, entry.contentRect.width, entry.contentRect.height);
        }
      }
    });
  }
  document.querySelectorAll<HTMLDivElement>('[data-elastic-line]').forEach((el) => {
    if (el.dataset.bound === 'true') return;
    el.dataset.bound = 'true';
    const svg = el.querySelector<SVGSVGElement>('svg');
    if (svg && ro) ro.observe(svg);
    bindElastic(el);
  });
}

document.addEventListener('astro:page-load', init);
init();