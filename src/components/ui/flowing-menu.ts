import { TYPE } from './typography';

type Edge = 'top' | 'bottom';

const REVEAL_MS = 600;
const REVEAL_EASING = 'cubic-bezier(0.16, 1, 0.3, 1)';
const MIN_REPETITIONS = 4;

function findClosestEdge(
  mouseX: number,
  mouseY: number,
  width: number,
  height: number,
): Edge {
  const topEdgeDist =
    Math.pow(mouseX - width / 2, 2) + Math.pow(mouseY, 2);
  const bottomEdgeDist =
    Math.pow(mouseX - width / 2, 2) + Math.pow(mouseY - height, 2);
  return topEdgeDist < bottomEdgeDist ? 'top' : 'bottom';
}

function edgeFromEvent(ev: Event, itemEl: HTMLElement): Edge {
  const rect = itemEl.getBoundingClientRect();
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

function prefersReducedMotion(): boolean {
  return (
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
  );
}

const enhanced = new WeakSet<Element>();
const disposers = new WeakMap<Element, () => void>();

interface MarqueeImage {
  src: string;
  w: number;
  h: number;
}

function buildPart(label: string, images: MarqueeImage[]): HTMLDivElement {
  const part = document.createElement('div');
  part.className = 'marquee-part';
  const span = document.createElement('span');
  span.className = TYPE.flowingTitle;
  span.textContent = label;
  part.append(span);
  for (const imgDef of images) {
    const media = document.createElement('img');
    media.className = 'marquee-media';
    if (imgDef.src) media.src = imgDef.src;
    media.width = imgDef.w * 2;
    media.height = imgDef.h * 2;
    media.style.width = `${imgDef.w}px`;
    media.style.height = `${imgDef.h}px`;
    media.loading = 'lazy';
    media.decoding = 'async';
    media.alt = '';
    part.append(media);
  }
  return part;
}

function enhanceRoot(root: HTMLElement): () => void {
  const speed = Number(root.dataset.speed) || 15;
  const items = Array.from(
    root.querySelectorAll<HTMLElement>('[data-flowing-item]'),
  );
  let rootVisible = true;
  let destroyed = false;

  const handles = items.map((itemEl) =>
    enhanceItem(itemEl, speed, () => rootVisible && !destroyed),
  );
  const cleanups = handles.map((h) => h.destroy);
  const wakes = handles.map((h) => h.wake);

  const io =
    'IntersectionObserver' in window
      ? new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              if (entry.target !== root) continue;
              const vis = entry.isIntersecting;
              if (vis && !rootVisible) {
                for (const wake of wakes) wake();
              }
              rootVisible = vis;
            }
          },
          { threshold: 0 },
        )
      : null;
  io?.observe(root);

  return () => {
    destroyed = true;
    io?.disconnect();
    for (const fn of cleanups) {
      try {
        fn();
      } catch {
      }
    }
  };
}

function enhanceItem(
  itemEl: HTMLElement,
  speed: number,
  isActive: () => boolean,
): { destroy: () => void; wake: () => void } {
  const link = itemEl.querySelector<HTMLElement>('.menu-link');
  const marquee = itemEl.querySelector<HTMLElement>('.marquee');
  const inner = itemEl.querySelector<HTMLElement>('.marquee-inner');
  if (!link || !marquee || !inner) {
    return { destroy: () => undefined, wake: () => undefined };
  }

  const label = itemEl.dataset.label ?? link.textContent ?? '';
  const srcs = (itemEl.dataset.images ?? '').split(',').filter(Boolean);
  const sizes = (itemEl.dataset.sizes ?? '').split(',');
  const images: MarqueeImage[] = srcs.map((src, i) => {
    const [w = 160, h = 56] = (sizes[i] ?? '').split('x').map(Number);
    return {
      src,
      w: Number.isFinite(w) && w > 0 ? w : 160,
      h: Number.isFinite(h) && h > 0 ? h : 56,
    };
  });
  if (images.length === 0) images.push({ src: '', w: 160, h: 56 });

  for (const { src } of images) {
    if (src && typeof Image !== 'undefined') {
      try {
        const preload = new Image();
        preload.decoding = 'async';
        preload.src = src;
        preload.decode?.().catch(() => undefined);
      } catch {
      }
    }
  }

  marquee.style.transform = 'translateY(0)';
  marquee.style.translate = '0 101%';
  inner.style.translate = '0 0';

  let revealAnims: Animation[] = [];
  let finishTimer = 0;
  let rafId = 0;
  let running = false;
  let offsetX = 0;
  let lastT = 0;
  let partWidth = 0;
  let repetitions = MIN_REPETITIONS;
  let isOpen = false;
  let destroyed = false;

  const cancelReveal = () => {
    for (const a of revealAnims) {
      try {
        a.cancel();
      } catch {
      }
    }
    revealAnims = [];
  };
  const clearFinishTimer = () => {
    if (finishTimer) window.clearTimeout(finishTimer);
    finishTimer = 0;
  };
  const commit = (el: HTMLElement, anim: Animation, resting: string) => {
    try {
      anim.commitStyles?.();
    } catch {
    }
    try {
      anim.cancel();
    } catch {
    }
    el.style.translate = resting;
  };

  const ensureParts = (count: number) => {
    while (inner.children.length > count && inner.lastChild) {
      inner.lastChild.remove();
    }
    while (inner.children.length < count) {
      inner.appendChild(buildPart(label, images));
    }
    const first = inner.querySelector<HTMLElement>('.marquee-part');
    partWidth = first ? first.offsetWidth : 0;
    if (partWidth > 0) offsetX = offsetX % partWidth;
  };

  const calculateRepetitions = () => {
    if (destroyed || !inner.isConnected || document.hidden) return;
    ensureParts(Math.max(repetitions, 1));
    if (!partWidth) return;
    const needed = Math.max(
      MIN_REPETITIONS,
      Math.ceil(window.innerWidth / partWidth) + 2,
    );
    if (needed !== repetitions) {
      repetitions = needed;
      ensureParts(repetitions);
    }
  };

  const tick = (t: number) => {
    if (destroyed) return;
    rafId = 0;
    if (!isActive()) {
      running = false;
      return;
    }
    running = true;
    if (!lastT) lastT = t;
    const dt = Math.min(0.05, (t - lastT) / 1000);
    lastT = t;
    if (isActive() && !document.hidden && partWidth > 0 && !prefersReducedMotion()) {
      const velocity = partWidth / speed;
      offsetX -= velocity * dt;
      if (offsetX <= -partWidth) offsetX += partWidth;
      inner.style.transform = `translateX(${offsetX}px)`;
    }
    rafId = requestAnimationFrame(tick);
  };
  const startLoop = () => {
    if (destroyed || running || prefersReducedMotion()) return;
    lastT = 0;
    rafId = requestAnimationFrame(tick);
  };
  const stopLoop = () => {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = 0;
  };

  const show = (edge: Edge) => {
    isOpen = true;
    itemEl.classList.add('is-open');
    cancelReveal();
    clearFinishTimer();
    if (prefersReducedMotion()) {
      marquee.style.translate = '0 0';
      inner.style.translate = '0 0';
      return;
    }
    const fromOuter = edge === 'top' ? '-101%' : '101%';
    const fromInner = edge === 'top' ? '101%' : '-101%';
    const aOuter = marquee.animate(
      [{ translate: `0 ${fromOuter}` }, { translate: '0 0' }],
      { duration: REVEAL_MS, easing: REVEAL_EASING, fill: 'forwards' },
    );
    const aInner = inner.animate(
      [{ translate: `0 ${fromInner}` }, { translate: '0 0' }],
      { duration: REVEAL_MS, easing: REVEAL_EASING, fill: 'forwards' },
    );
    revealAnims = [aOuter, aInner];
    let settled = false;
    const settle = () => {
      if (settled || destroyed || !isOpen) return;
      settled = true;
      clearFinishTimer();
      commit(marquee, aOuter, '0 0');
      commit(inner, aInner, '0 0');
      revealAnims = [];
    };
    aInner.onfinish = settle;
    finishTimer = window.setTimeout(settle, REVEAL_MS + 120);
  };

  const hide = (edge: Edge) => {
    isOpen = false;
    itemEl.classList.remove('is-open');
    cancelReveal();
    clearFinishTimer();
    if (prefersReducedMotion()) {
      marquee.style.translate = edge === 'top' ? '0 -101%' : '0 101%';
      return;
    }
    const toOuter = edge === 'top' ? '-101%' : '101%';
    const toInner = edge === 'top' ? '101%' : '-101%';
    const startOuter = marquee.style.translate || '0 0';
    const startInner = inner.style.translate || '0 0';
    const aOuter = marquee.animate(
      [{ translate: startOuter }, { translate: `0 ${toOuter}` }],
      { duration: REVEAL_MS, easing: REVEAL_EASING, fill: 'forwards' },
    );
    const aInner = inner.animate(
      [{ translate: startInner }, { translate: `0 ${toInner}` }],
      { duration: REVEAL_MS, easing: REVEAL_EASING, fill: 'forwards' },
    );
    revealAnims = [aOuter, aInner];
    let settled = false;
    const restingOuter = `0 ${toOuter}`;
    const restingInner = `0 ${toInner}`;
    const settle = () => {
      if (settled || destroyed || isOpen) return;
      settled = true;
      clearFinishTimer();
      commit(marquee, aOuter, restingOuter);
      commit(inner, aInner, restingInner);
      revealAnims = [];
    };
    aOuter.onfinish = settle;
    finishTimer = window.setTimeout(settle, REVEAL_MS + 120);
  };

  const onEnter = (ev: Event) => show(edgeFromEvent(ev, itemEl));
  const onLeave = (ev: Event) => hide(edgeFromEvent(ev, itemEl));
  const onFocus = () => show('top');
  const onBlur = () => hide('bottom');
  const onClick = (ev: Event) => {
    if (window.matchMedia('(hover: hover)').matches) return;
    ev.preventDefault();
    if (isOpen) hide(edgeFromEvent(ev, itemEl));
    else show(edgeFromEvent(ev, itemEl));
  };

  link.addEventListener('mouseenter', onEnter);
  link.addEventListener('mouseleave', onLeave);
  link.addEventListener('focus', onFocus);
  link.addEventListener('blur', onBlur);
  link.addEventListener('click', onClick);

  let resizeTimer = 0;
  const onResize = () => {
    if (resizeTimer) window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      resizeTimer = 0;
      calculateRepetitions();
    }, 150);
  };
  window.addEventListener('resize', onResize);

  const retry1 = window.setTimeout(calculateRepetitions, 50);
  const retry2 = window.setTimeout(calculateRepetitions, 500);
  const onLoad = () => calculateRepetitions();
  window.addEventListener('load', onLoad);
  document.fonts?.ready.then(() => {
    if (!destroyed) calculateRepetitions();
  }).catch(() => undefined);
  calculateRepetitions();
  startLoop();

  return {
    wake: () => startLoop(),
    destroy: () => {
      destroyed = true;
      window.clearTimeout(retry1);
      window.clearTimeout(retry2);
      if (resizeTimer) window.clearTimeout(resizeTimer);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('load', onLoad);
      link.removeEventListener('mouseenter', onEnter);
      link.removeEventListener('mouseleave', onLeave);
      link.removeEventListener('focus', onFocus);
      link.removeEventListener('blur', onBlur);
      link.removeEventListener('click', onClick);
      stopLoop();
      cancelReveal();
      clearFinishTimer();
    },
  };
}

function init() {
  document
    .querySelectorAll<HTMLElement>('[data-flowing-menu]')
    .forEach((root) => {
      if (enhanced.has(root)) return;
      if (!root.isConnected) return;
      enhanced.add(root);
      disposers.set(root, enhanceRoot(root));
    });
}

document.addEventListener('astro:page-load', init);
document.addEventListener('astro:after-swap', init);
init();

export {};
