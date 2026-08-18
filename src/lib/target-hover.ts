/**
 * TargetHover — Sistema de hover com corners animados
 *
 * Script separado para garantir reinicialização após View Transitions
 * sem depender de bundling ou refetch do componente.
 *
 * Exporta função init() que deve ser chamada ao carregar página e
 * após cada transição do Astro (astro:after-swap).
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

export function initTargetHover(options: TargetHoverOptions = {}) {
  if (typeof window === "undefined") return;

  const {
    targetSelector = ".cursor-target",
    hoverDuration = 0.2,
    parallaxOn = true,
    cornerSize = 12,
    borderWidth = 2,
    parallaxStrength = 8,
    offset = 8,
  } = options;

  const isMobile =
    window.matchMedia("(max-width: 768px)").matches ||
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0;

  if (isMobile) return;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const selector = targetSelector;
  let observer: MutationObserver | null = null;

  const targets = () => {
    return Array.from(document.querySelectorAll(selector)) as HTMLElement[];
  };

  function setupTarget(target: HTMLElement) {
    if (!(target instanceof HTMLElement)) return;

    if (target.dataset.targetHoverReady === "true") {
      return;
    }

    target.dataset.targetHoverReady = "true";

    target.style.setProperty("--target-corner-size", `${cornerSize}px`);

    target.style.setProperty("--target-border-width", `${borderWidth}px`);

    target.style.setProperty("--target-hover-duration", `${hoverDuration}s`);

    target.style.setProperty("--target-offset", `${offset}px`);

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

    function createCorner(position: string) {
      const element = document.createElement("span");

      element.className = `target-hover-corner target-hover-corner--${position}`;

      element.setAttribute("aria-hidden", "true");

      return element;
    }

    function updateMouse(event: MouseEvent) {
      if (!state.active) return;

      const rect = target.getBoundingClientRect();

      /*
       * Mouse relativo ao elemento.
       *
       * -1 = extremo esquerdo/topo
       *  0 = centro
       * +1 = extremo direito/baixo
       */
      const normalizedX = ((event.clientX - rect.left) / rect.width) * 2 - 1;

      const normalizedY = ((event.clientY - rect.top) / rect.height) * 2 - 1;

      state.mouseX = Math.max(-1, Math.min(1, normalizedX));

      state.mouseY = Math.max(-1, Math.min(1, normalizedY));

      /*
       * O parallax não move o card.
       *
       * Apenas os corners se deslocam.
       */
      if (parallaxOn && !reducedMotion) {
        state.targetX = state.mouseX * parallaxStrength;
        state.targetY = state.mouseY * parallaxStrength;
      }
    }

    function animate() {
      if (!state.active) {
        state.frame = null;
        return;
      }

      /*
       * Interpolação suave.
       *
       * É o equivalente vanilla do comportamento
       * de interpolação utilizado pelo GSAP no
       * componente original.
       */
      const easing = reducedMotion ? 1 : 0.14;

      state.currentX += (state.targetX - state.currentX) * easing;

      state.currentY += (state.targetY - state.currentY) * easing;

      /*
       * Cada corner recebe uma pequena variação
       * baseada na posição do mouse.
       *
       * Isso cria a sensação de que a mira
       * acompanha o cursor.
       */
      const transforms = [
        {
          x: state.currentX,
          y: state.currentY,
        },
        {
          x: state.currentX * -1,
          y: state.currentY,
        },
        {
          x: state.currentX * -1,
          y: state.currentY * -1,
        },
        {
          x: state.currentX,
          y: state.currentY * -1,
        },
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

      /*
       * Começa a animação apenas quando
       * realmente existe hover.
       */
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

      /*
       * Faz os corners retornarem suavemente
       * para a posição original.
       */
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
  }

  function init() {
    console.log("[TargetHover] init: encontrados", targets().length, "targets");
    targets().forEach(setupTarget);

    /*
     * Caso o Astro injete conteúdo dinamicamente,
     * observa novos .cursor-target.
     */
    if (observer) {
      observer.disconnect();
    }

    observer = new MutationObserver(() => {
      targets().forEach(setupTarget);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  function cleanup() {
    console.log("[TargetHover] cleanup: limpando", targets().length, "targets");
    targets().forEach((target) => {
      delete target.dataset.targetHoverReady;
    });

    if (observer) {
      observer.disconnect();
      observer = null;
    }
  }

  // Inicialização na primeira carga
  init();

  /*
   * Limpa e reinicializa em cada View Transition do Astro.
   * astro:before-swap → remove flags para forçar recriação
   * astro:after-swap → reinicializa observers
   */
  window.addEventListener("astro:before-swap", cleanup);
  window.addEventListener("astro:after-swap", init);
}
