interface SpinState {
  wrapper: HTMLElement;
  svg: SVGSVGElement;
  spinning: boolean;
}

const states: SpinState[] = [];
let io: IntersectionObserver | null = null;
const bound = new WeakSet<HTMLElement>();

const SPIN_DURATION = 1600;
const SPIN_TURNS = 10;
const SPIN_EASING = 'cubic-bezier(0.16, 1, 0.3, 1)';

function reducedMotion(): boolean {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

function spin(state: SpinState) {
  if (state.spinning || reducedMotion()) return;
  state.spinning = true;

  const anim = state.svg.animate(
    [
      { transform: 'rotate(0deg)' },
      { transform: `rotate(${360 * SPIN_TURNS}deg)` },
    ],
    { duration: SPIN_DURATION, easing: SPIN_EASING },
  );
  anim.onfinish = () => {
    state.spinning = false;
  };
  anim.oncancel = () => {
    state.spinning = false;
  };

  const count = Number.parseInt(state.wrapper.dataset.spins ?? '0', 10);
  state.wrapper.dataset.spins = String(Number.isNaN(count) ? 1 : count + 1);
}

function bind(wrapper: HTMLElement) {
  const svg = wrapper.querySelector<SVGSVGElement>('svg');
  if (!svg) return;
  const state: SpinState = { wrapper, svg, spinning: false };

  wrapper.addEventListener('pointerenter', () => spin(state));
  wrapper.addEventListener('pointerdown', () => spin(state));

  const host =
    wrapper.closest<HTMLElement>('.group') ??
    wrapper.closest<HTMLElement>('a');
  if (host && host !== wrapper) {
    host.addEventListener('pointerenter', () => spin(state));
    host.addEventListener('pointerdown', () => spin(state));
  }

  if (io) io.observe(wrapper);
  states.push(state);
}

function init() {
  if (reducedMotion()) return;
  if (!io) {
    io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const state = states.find((s) => s.wrapper === entry.target);
            if (state) spin(state);
          }
        }
      },
      { threshold: 0.5 },
    );
  }
  document
    .querySelectorAll<HTMLElement>('[data-target-simbol]')
    .forEach((el) => {
      if (bound.has(el)) return;
      bound.add(el);
      bind(el);
    });
}

document.addEventListener('astro:page-load', init);
document.addEventListener('astro:after-swap', init);
init();

export {};