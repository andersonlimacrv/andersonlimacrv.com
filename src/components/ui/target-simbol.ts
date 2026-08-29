// TargetSimbol — mira decorativa com spin estilo roleta de revólver.
//
// Triggers do spin (único ~1s, 3 voltas, ease-expo-out — começa rápido e
// desacelera até parar):
//   - entrada na viewport (IntersectionObserver; re-entrada gira de novo)
//   - pointerenter (hover)
//   - pointerdown (click/tap — feedback de link no mobile, onde o TargetHover
//     não existe)
// Re-triggers são ignorados enquanto o spin está em andamento.
//
// Performance: Web Animations API (element.animate) com transform rotate —
// animação no compositor (GPU), zero rAF manual, zero reflow. Uma única
// instância por página = custo desprezível.
//
// prefers-reduced-motion: nenhuma animação (estático).
//
// Debug hook p/ e2e: data-spins no wrapper incrementa a cada spin iniciado.

interface SpinState {
  wrapper: HTMLElement;
  svg: SVGSVGElement;
  spinning: boolean;
}

const states: SpinState[] = [];
let io: IntersectionObserver | null = null;
const bound = new WeakSet<HTMLElement>();

const SPIN_DURATION = 1000;
const SPIN_TURNS = 6;
const SPIN_EASING = 'cubic-bezier(0.16, 1, 0.3, 1)'; // --ease-expo-out

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
  // Fallback: se a animação for cancelada externamente, libera o flag.
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

  if (io) io.observe(wrapper);
  states.push(state);
}

function init() {
  // Reduz o custo em reduced-motion: sem observer/eventos (nunca anima).
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

// Marca o arquivo como módulo ES (evita colisão no escopo global do tsc).
export {};