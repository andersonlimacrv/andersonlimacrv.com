/**
 * TargetHover — Sistema de hover com corners animados
 *
 * Script separado para garantir reinicialização após View Transitions
 * sem depender de bundling ou refetch do componente.
 *
 * Exporta função initTargetHover() que deve ser chamada ao carregar página e
 * após cada transição do Astro (astro:page-load / astro:after-swap).
 * Mudanças vs versão anterior:
 *  - escuta em `document` (não `window`) e também `astro:page-load`
 *  - reavalia `isMobile`/`prefers-reduced-motion` a cada `init()`
 *  - `WeakMap` + `cleanup` destrutivo evita duplicação no header persistido
 *  - singleton guard impede dupla inscrição
 */

interface TargetHoverOptions {
  targetSelector?: string;
  hoverDuration?: number;
  parallaxOn?: boolean;
  cornerSize?: number;
  borderWidth?: number;
  parallaxStrength?: number;
  offset?: number;
}

type RequiredOptions = Required<TargetHoverOptions>;

let initialized = false;
let observer: MutationObserver | null = null;
const targetRegistry = new WeakMap<
  HTMLElement,
  { cleanup: () => void }
>();
let currentOptions: RequiredOptions = {
  targetSelector: ".cursor-target",
  hoverDuration: 0.2,
  parallaxOn: true,
  cornerSize: 12,
  borderWidth: 2,
  parallaxStrength: 8,
  offset: 8,
};

function getIsMobile(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(max-width: 768px)").matches ||
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0
  );
}

function isReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function targets(): HTMLElement[] {
  const sel = currentOptions.targetSelector;
  return Array.from(document.querySelectorAll(sel)) as HTMLElement[];
}

function setupTarget(target: HTMLElement) {
  if (!(target instanceof HTMLElement)) return;
  if (target.dataset.targetHoverReady === "true" || targetRegistry.has(target)) {
    return;
  }

  const { cornerSize, borderWidth, hoverDuration, offset, parallaxOn, parallaxStrength } =
    currentOptions;

  target.dataset.targetHoverReady = "true";

  target.style.setProperty("--target-corner-size", `${cornerSize}px`);
  target.style.setProperty("--target-border-width", `${borderWidth}px`);
  target.style.setProperty("--target-hover-duration", `${hoverDuration}s`);
  target.style.setProperty("--target-offset", `${offset}px`);

  function createCorner(position: string) {
    const element = document.createElement("span");
    element.className = `target-hover-corner target-hover-corner--${position}`;
    element.setAttribute("aria-hidden", "true");
    return element;
  }

  const corners = [
    createCorner("tl"),
    createCorner("tr"),
    createCorner("br"),
    createCorner("bl"),
  ];

  corners.forEach((corner) => {
    target.appendChild(corner);
  });

  const state = {
    active: false,
    mouseX: 0,
    mouseY: 0,
    targetX: 0,
    targetY: 0,
    currentX: 0,
    currentY: 0,
    frame: null as number | null,
  };

  function updateMouse(event: MouseEvent) {
    if (!state.active) return;
    const rect = target.getBoundingClientRect();
    const normalizedX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const normalizedY = ((event.clientY - rect.top) / rect.height) * 2 - 1;
    state.mouseX = Math.max(-1, Math.min(1, normalizedX));
    state.mouseY = Math.max(-1, Math.min(1, normalizedY));
    if (parallaxOn && !isReducedMotion()) {
      state.targetX = state.mouseX * parallaxStrength;
      state.targetY = state.mouseY * parallaxStrength;
    } else {
      state.targetX = 0;
      state.targetY = 0;
    }
  }

  function animate() {
    if (!state.active) {
      state.frame = null;
      return;
    }
    const easing = isReducedMotion() ? 1 : 0.14;
    state.currentX += (state.targetX - state.currentX) * easing;
    state.currentY += (state.targetY - state.currentY) * easing;

    const transforms = [
      { x: state.currentX, y: state.currentY },
      { x: state.currentX * -1, y: state.currentY },
      { x: state.currentX * -1, y: state.currentY * -1 },
      { x: state.currentX, y: state.currentY * -1 },
    ];

    corners.forEach((corner, index) => {
      const movement = transforms[index];
      corner.style.transform = `translate3d(${movement.x}px, ${movement.y}px, 0)`;
    });

    state.frame = requestAnimationFrame(animate);
  }

  function enter(event: MouseEvent) {
    state.active = true;
    target.classList.add("is-target-hovering");
    updateMouse(event);
    if (!state.frame) {
      state.frame = requestAnimationFrame(animate);
    }
  }

  function move(event: MouseEvent) {
    updateMouse(event);
  }

  function leave() {
    state.active = false;
    state.targetX = 0;
    state.targetY = 0;
    state.currentX = 0;
    state.currentY = 0;
    target.classList.remove("is-target-hovering");
    corners.forEach((corner) => {
      corner.style.transform = "translate3d(0, 0, 0)";
    });
    if (state.frame) {
      cancelAnimationFrame(state.frame);
      state.frame = null;
    }
  }

  target.addEventListener("mouseenter", enter);
  target.addEventListener("mousemove", move);
  target.addEventListener("mouseleave", leave);

  const cleanup = () => {
    target.removeEventListener("mouseenter", enter);
    target.removeEventListener("mousemove", move);
    target.removeEventListener("mouseleave", leave);
    if (state.frame) {
      cancelAnimationFrame(state.frame);
      state.frame = null;
    }
    corners.forEach((c) => {
      try {
        c.remove();
      } catch {}
    });
    target.classList.remove("is-target-hovering");
    delete target.dataset.targetHoverReady;
    // zera transform residual se houver
    state.currentX = 0;
    state.currentY = 0;
  };

  targetRegistry.set(target, { cleanup });
}

function init() {
  if (typeof document === "undefined") return;

  if (getIsMobile()) {
    // Mobile: garante que não sobrem corners de desktop anterior
    cleanup();
    return;
  }

  console.log("[TargetHover] init: encontrados", targets().length, "targets");
  targets().forEach(setupTarget);

  if (observer) {
    observer.disconnect();
  }

  observer = new MutationObserver(() => {
    if (getIsMobile()) {
      cleanup();
      return;
    }
    targets().forEach(setupTarget);
  });

  // Observa body; se body ainda não existir (SSR edge), observa documentElement
  const root = document.body ?? document.documentElement;
  observer.observe(root, {
    childList: true,
    subtree: true,
  });
}

function cleanup() {
  console.log("[TargetHover] cleanup: limpando", targets().length, "targets");
  // Limpa apenas os que estão no DOM atual; WeakMap guarda os handlers para remover
  const current = targets();
  current.forEach((target) => {
    const entry = targetRegistry.get(target);
    if (entry) {
      try {
        entry.cleanup();
      } catch {}
      targetRegistry.delete(target);
    } else if (target.dataset.targetHoverReady === "true") {
      // Fallback para nodes que foram marcados por versão antiga sem WeakMap
      target.querySelectorAll(".target-hover-corner").forEach((n) => n.remove());
      target.classList.remove("is-target-hovering");
      delete target.dataset.targetHoverReady;
    }
  });

  if (observer) {
    observer.disconnect();
    observer = null;
  }
}

export function initTargetHover(options: TargetHoverOptions = {}) {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  currentOptions = {
    targetSelector: ".cursor-target",
    hoverDuration: 0.2,
    parallaxOn: true,
    cornerSize: 12,
    borderWidth: 2,
    parallaxStrength: 8,
    offset: 8,
    ...options,
  };

  // Compat: expõe no window para inspeção/debug e para compartilhar estado entre
  // múltiplas chamadas (caso o script do BaseLayout reexecute após View Transition)
  (window as unknown as Record<string, unknown>).__targetHoverOptions = currentOptions;

  if (!initialized) {
    initialized = true;
    (window as unknown as Record<string, unknown>).__targetHoverInitialized = true;

    document.addEventListener("astro:before-swap", cleanup);
    document.addEventListener("astro:after-swap", init);
    document.addEventListener("astro:page-load", init);

    // Fallback para compat com código que ainda despacha em window
    window.addEventListener("astro:before-swap", cleanup as EventListener);
    window.addEventListener("astro:after-swap", init as EventListener);

    // Reavalia ao cruzar breakpoint mobile/desktop sem navegação
    try {
      const mql = window.matchMedia("(max-width: 768px)");
      const handler = () => init();
      if (typeof mql.addEventListener === "function") {
        mql.addEventListener("change", handler);
      } else if (typeof (mql as unknown as { addListener: (fn: () => void) => void }).addListener === "function") {
        (mql as unknown as { addListener: (fn: () => void) => void }).addListener(handler);
      }
    } catch {}

    init();
  } else {
    // Já inicializado (ex.: segunda chamada do BaseLayout após View Transition):
    // apenas re-executa init com novas opções se houver
    init();
  }
}
