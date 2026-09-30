// TechText — ported from React Bits TechText (MIT License, Copyright (c) DavidHDev).
// https://github.com/DavidHDev/react-bits/tree/main/src/content/TextAnimations/TechText
// Vanilla-TS port: identical rendering/interaction logic; settings via data-attributes,
// type scale + colors resolved from the theme, h1 semantics preserved by the caller.
const LABEL_FONT =
  '10px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
const FALLOFF_STEPS = 8;
const SPRING = 320;
const DAMPING = 22;

interface Settings {
  text: string;
  fontFamily: string;
  fontWeight: number;
  fontSize: number;
  letterSpacing: number;
  color: string;
  accentColor: string;
  reach: number;
  softness: number;
  dashLength: number;
  dashGap: number;
  strokeWidth: number;
  lineStyle: string;
  reveal: string;
  specks: number;
  selection: boolean;
  labels: boolean;
  draggable: boolean;
  sweep: boolean;
  speed: number;
}

interface GlyphBox {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

interface Glyph {
  char: string;
  x: number;
  box: GlyphBox;
  offset: { x: number; y: number };
  velocity: { x: number; y: number };
  outline: number;
  index: number;
  fill: { image: HTMLCanvasElement; left: number; top: number };
  dashes: { image: HTMLCanvasElement; left: number; top: number };
}

interface WordView {
  size: number;
  baseline: number;
  left: number;
  right: number;
  top: number;
  bottom: number;
}

interface Out {
  ctx: CanvasRenderingContext2D;
  dx: number;
  dy: number;
}

const approach = (current: number, target: number, dt: number, seconds: number): number =>
  current + (target - current) * (1 - Math.exp(-dt / seconds));

const hexToRgb = (hex: string): [number, number, number] => {
  let h = String(hex || '').replace('#', '');
  if (h.length === 3)
    h = h.replace(/./g, (c) => c + c);
  const n = parseInt(h.slice(0, 6), 16);
  return Number.isNaN(n) ? [255, 255, 255] : [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

const rgbaCache = new Map<string, [number, number, number]>();
let rgbaProbe: CanvasRenderingContext2D | null = null;

const toRgb = (color: string): [number, number, number] => {
  const cached = rgbaCache.get(color);
  if (cached) return cached;
  let rgb: [number, number, number] = [255, 255, 255];
  try {
    if (!rgbaProbe) {
      const image = document.createElement('canvas');
      image.width = 1;
      image.height = 1;
      rgbaProbe = image.getContext('2d', { willReadFrequently: true });
    }
    if (rgbaProbe) {
      rgbaProbe.fillStyle = '#000000';
      rgbaProbe.fillStyle = color;
      rgbaProbe.clearRect(0, 0, 1, 1);
      rgbaProbe.fillRect(0, 0, 1, 1);
      const d = rgbaProbe.getImageData(0, 0, 1, 1).data;
      if (d[3] > 0) rgb = [d[0], d[1], d[2]];
    }
  } catch {
    rgb = hexToRgb(color);
  }
  rgbaCache.set(color, rgb);
  return rgb;
};

const rgba = (color: string, alpha: number): string => {
  const [r, g, b] = toRgb(color);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const noise = (...values: number[]): number => {
  let h = 2166136261;
  for (const value of values) {
    h = Math.imul(h ^ (value | 0), 16777619);
    h ^= h >>> 13;
    h = Math.imul(h, 0x5bd1e995);
    h ^= h >>> 15;
  }
  return (h >>> 0) / 4294967296;
};

const signed = (value: number): string =>
  value > 0 ? `+${value}` : value < 0 ? `−${-value}` : '0';

function readSettings(root: HTMLElement): Settings {
  const d = root.dataset;
  const cs = getComputedStyle(root);
  const computedSize = parseFloat(cs.fontSize) || 150;
  const computedSpacing = parseFloat(cs.letterSpacing);
  return {
    text: d.text ?? '',
    fontFamily: d.fontFamily ?? '',
    fontWeight: Number.parseFloat(d.fontWeight ?? '') || 600,
    fontSize:
      Number.parseFloat(d.fontSize ?? '') > 0
        ? Number.parseFloat(d.fontSize as string)
        : computedSize,
    letterSpacing:
      d.letterSpacing !== undefined && d.letterSpacing !== ''
        ? Number.parseFloat(d.letterSpacing)
        : Number.isFinite(computedSpacing)
          ? computedSpacing / computedSize
          : -0.05,
    color: d.color ?? '',
    accentColor: d.accent ?? '',
    reach: Number.parseFloat(d.reach ?? '') || 200,
    softness: d.softness !== undefined && d.softness !== '' ? Number.parseFloat(d.softness) : 0.7,
    dashLength: Number.parseFloat(d.dashLength ?? '') || 4,
    dashGap: Number.parseFloat(d.dashGap ?? '') || 2,
    strokeWidth: Number.parseFloat(d.strokeWidth ?? '') || 1.5,
    lineStyle: d.lineStyle ?? 'dashed',
    reveal: d.revealMode ?? 'letter',
    specks: d.specks !== undefined && d.specks !== '' ? Number.parseInt(d.specks) : 15,
    selection: d.selection !== 'false',
    labels: d.labels !== 'false',
    draggable: d.draggable !== 'false',
    sweep: d.sweep !== 'false',
    speed: Number.parseFloat(d.speed ?? '') || 1,
  };
}

function resolveThemeColors(s: Settings, container: HTMLElement): void {
  if (!s.color) s.color = getComputedStyle(container).color || '#ffffff';
  if (!s.accentColor) {
    const v = getComputedStyle(document.documentElement)
      .getPropertyValue('--primary')
      .trim();
    s.accentColor = v || '#ffffff';
  }
}

function enhance(root: HTMLElement): () => void {
  const canvas = root.querySelector<HTMLCanvasElement>('canvas');
  const s = readSettings(root);
  const ctx = canvas?.getContext('2d');
  const scratch = document.createElement('canvas');
  const scratchCtx = scratch.getContext('2d');
  if (!root || !canvas || !ctx || !scratchCtx || !s.text) return () => undefined;
  resolveThemeColors(s, root);
  const MO: Out = { ctx, dx: 0, dy: 0 };

  const reducedMotion =
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  let width = 1;
  let height = 1;
  let dpr = 1;
  let raf = 0;
  let last = performance.now();
  let visible = true;
  let alive = true;
  let destroyed = false;
  let layoutKey = '';
  let requestedFont = '';
  let word: WordView | null = null;
  let glyphs: Glyph[] = [];
  let lineBands: { top: number; bottom: number; from: number; to: number }[] = [];
  let presence = 0;
  let clock = 0;
  let pulse = 0;
  let placed = false;
  let dragging = -1;
  const pointer = { x: 0, y: 0, inside: false };
  const grab = { x: 0, y: 0 };
  const lens = { x: 0, y: 0 };
  const frame = { x1: 0, y1: 0, x2: 0, y2: 0, alpha: 0, index: -1 };

  const refreshFonts = (): void => {
    layoutKey = '';
    wake();
  };

  const family = (st: Settings): string =>
    st.fontFamily || getComputedStyle(root).fontFamily || 'sans-serif';
  const fontFor = (st: Settings, size: number): string =>
    `${st.fontWeight} ${size}px ${family(st)}`;

  const setFont = (
    target: CanvasRenderingContext2D,
    st: Settings,
    size: number,
  ): void => {
    target.font = fontFor(st, size);
    if ('letterSpacing' in target)
      (target as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing =
        `${st.letterSpacing * size}px`;
    target.textAlign = 'left';
    target.textBaseline = 'alphabetic';
  };

  const sprite = (
    st: Settings,
    view: { size: number; baseline: number },
    glyph: { char: string; x: number; box: GlyphBox },
    stroke: boolean,
  ): { image: HTMLCanvasElement; left: number; top: number } => {
    const pad = Math.ceil(st.strokeWidth * 2 + 4);
    const left = glyph.box.x1 - pad;
    const top = glyph.box.y1 - pad;
    const w = glyph.box.x2 - glyph.box.x1 + pad * 2;
    const h = glyph.box.y2 - glyph.box.y1 + pad * 2;
    const image = document.createElement('canvas');
    image.width = Math.max(1, Math.ceil(w * dpr));
    image.height = Math.max(1, Math.ceil(h * dpr));
    const c = image.getContext('2d');
    if (!c) return { image, left, top };
    c.setTransform(dpr, 0, 0, dpr, -left * dpr, -top * dpr);
    setFont(c, st, view.size);
    if (stroke) {
      c.lineJoin = 'round';
      c.lineWidth = st.strokeWidth * 2;
      c.lineCap = 'butt';
      c.strokeStyle = st.color;
      if (st.lineStyle !== 'solid')
        c.setLineDash([Math.max(1, st.dashLength), Math.max(1, st.dashGap)]);
      c.strokeText(glyph.char, glyph.x, view.baseline);
      c.setLineDash([]);
      c.globalCompositeOperation = 'destination-out';
      c.fillStyle = '#000000';
      c.fillText(glyph.char, glyph.x, view.baseline);
      c.globalCompositeOperation = 'source-over';
    } else {
      c.fillStyle = st.color;
      c.fillText(glyph.char, glyph.x, view.baseline);
    }
    return { image, left, top };
  };

  const ensureLayout = (st: Settings): WordView => {
    const key = [
      st.text,
      family(st),
      st.fontWeight,
      st.fontSize,
      st.letterSpacing,
      st.color,
      st.dashLength,
      st.dashGap,
      st.strokeWidth,
      st.lineStyle,
      width,
      height,
      dpr,
    ].join('|');
    if (key === layoutKey && word) return word;
    layoutKey = key;
    const wanted = fontFor(st, 64);
    if (document.fonts && wanted !== requestedFont) {
      requestedFont = wanted;
      document.fonts.load(wanted, st.text).then(refreshFonts, refreshFonts);
    }

    const probe = scratchCtx;
    const rawLines = st.text.split('\n').filter((l) => l.length > 0);
    if (rawLines.length === 0) return word ?? {
      size: 0,
      baseline: 0,
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    };
    setFont(probe, st, st.fontSize);
    const raw = rawLines.map((line) => {
      const m = probe.measureText(line);
      return {
        line,
        left: m.actualBoundingBoxLeft,
        right: m.actualBoundingBoxRight,
        ascent: m.actualBoundingBoxAscent,
        descent: m.actualBoundingBoxDescent,
      };
    });
    const fitW = Math.min(
      ...raw.map(
        (r) => width * 0.9 / Math.max(r.left + r.right, 1),
      ),
    );
    const lineH = Math.max(...raw.map((r) => r.ascent + r.descent));
    const fit = Math.min(1, fitW, height * 0.9 / Math.max(raw.length * lineH, 1));
    const size = st.fontSize * fit;
    const pitch = height / raw.length;
    setFont(probe, st, size);
    const laid = raw.map((r, i) => {
      const m = probe.measureText(r.line);
      const inkW = m.actualBoundingBoxLeft + m.actualBoundingBoxRight;
      const x = (width - inkW) / 2 + m.actualBoundingBoxLeft;
      const baseline =
        i * pitch + pitch / 2 + (m.actualBoundingBoxAscent - m.actualBoundingBoxDescent) / 2;
      return {
        line: r.line,
        x,
        baseline,
        left: m.actualBoundingBoxLeft,
        right: m.actualBoundingBoxRight,
        ascent: m.actualBoundingBoxAscent,
        descent: m.actualBoundingBoxDescent,
      };
    });
    const next: WordView = {
      size,
      baseline: 0,
      left: Math.min(...laid.map((l) => l.x - l.left)),
      right: Math.max(...laid.map((l) => l.x + l.right)),
      top: Math.min(...laid.map((l) => l.baseline - l.ascent)),
      bottom: Math.max(...laid.map((l) => l.baseline + l.descent)),
    };
    word = next;

    const previous = glyphs;
    glyphs = [];
    lineBands = [];
    laid.forEach((l) => {
      const from = glyphs.length;
      const view = { size, baseline: l.baseline };
      let prefix = '';
      const chars = Array.from(l.line);
      chars.forEach((char, i) => {
        prefix += char;
        const own = probe.measureText(char);
        const gx = l.x + probe.measureText(prefix).width - own.width;
        if (!char.trim()) return;
        const base = {
          char,
          x: gx,
          box: {
            x1: gx - own.actualBoundingBoxLeft,
            y1: l.baseline - own.actualBoundingBoxAscent,
            x2: gx + own.actualBoundingBoxRight,
            y2: l.baseline + own.actualBoundingBoxDescent,
          },
        };
        const kept = previous[glyphs.length];
        glyphs.push({
          ...base,
          offset: kept?.char === char ? kept.offset : { x: 0, y: 0 },
          velocity: { x: 0, y: 0 },
          outline: 0,
          index: i,
          fill: sprite(st, view, base, false),
          dashes: sprite(st, view, base, true),
        });
      });
      lineBands.push({
        top: l.baseline - l.ascent,
        bottom: l.baseline + l.descent,
        from,
        to: glyphs.length,
      });
    });
    dragging = -1;
    frame.index = -1;
    return next;
  };

  const glyphAt = (x: number, y: number): number => {
    if (!word) return -1;
    const band = lineBands.find((b) => y >= b.top - 24 && y <= b.bottom + 24);
    if (!band) return -1;
    let best = -1;
    let bestDistance = Infinity;
    for (let i = band.from; i < band.to; i++) {
      const glyph = glyphs[i];
      const x1 = glyph.box.x1 + glyph.offset.x;
      const x2 = glyph.box.x2 + glyph.offset.x;
      const d = x < x1 ? x1 - x : x > x2 ? x - x2 : 0;
      if (d < bestDistance) {
        bestDistance = d;
        best = i;
      }
    }
    return bestDistance < 28 ? best : -1;
  };

  const falloff = (
    target: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    radius: number,
    strength: number,
    softness: number,
  ): CanvasGradient => {
    const inner = Math.min(1, Math.max(0, 1 - softness));
    const gradient = target.createRadialGradient(cx, cy, 0, cx, cy, radius);
    gradient.addColorStop(0, `rgba(0, 0, 0, ${strength})`);
    if (inner > 0.995) {
      gradient.addColorStop(0.995, `rgba(0, 0, 0, ${strength})`);
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      return gradient;
    }
    for (let i = 0; i <= FALLOFF_STEPS; i++) {
      const t = i / FALLOFF_STEPS;
      const eased = t * t * (3 - 2 * t);
      gradient.addColorStop(
        inner + (1 - inner) * t,
        `rgba(0, 0, 0, ${strength * (1 - eased)})`,
      );
    }
    return gradient;
  };

  const blit = (
    target: CanvasRenderingContext2D,
    art: { image: HTMLCanvasElement; left: number; top: number },
    dx: number,
    dy: number,
    originX: number,
    originY: number,
  ): void => {
    target.drawImage(
      art.image,
      Math.round((art.left + dx) * dpr - originX),
      Math.round((art.top + dy) * dpr - originY),
    );
  };

  const drawReveal = (st: Settings): void => {
    const radius = st.reach * dpr;
    const cx = lens.x * dpr;
    const cy = lens.y * dpr;
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = falloff(ctx, cx, cy, radius, presence, st.softness);
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
    ctx.globalCompositeOperation = 'source-over';

    const x0 = Math.max(0, Math.floor(cx - radius));
    const y0 = Math.max(0, Math.floor(cy - radius));
    const x1 = Math.min(canvas.width, Math.ceil(cx + radius));
    const y1 = Math.min(canvas.height, Math.ceil(cy + radius));
    if (x1 <= x0 || y1 <= y0) return;
    const w = x1 - x0;
    const h = y1 - y0;
    if (scratch.width < w || scratch.height < h) {
      scratch.width = Math.max(scratch.width, w);
      scratch.height = Math.max(scratch.height, h);
    }
    scratchCtx.setTransform(1, 0, 0, 1, 0, 0);
    scratchCtx.globalCompositeOperation = 'source-over';
    scratchCtx.clearRect(0, 0, w, h);
    for (const glyph of glyphs)
      blit(scratchCtx, glyph.dashes, glyph.offset.x, glyph.offset.y, x0, y0);
    scratchCtx.globalCompositeOperation = 'destination-in';
    scratchCtx.fillStyle = falloff(scratchCtx, cx - x0, cy - y0, radius, 1, st.softness);
    scratchCtx.fillRect(0, 0, w, h);
    scratchCtx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = presence;
    ctx.drawImage(scratch, 0, 0, w, h, x0, y0, w, h);
    ctx.globalAlpha = 1;
  };

  const crisp = (value: number): number => (Math.round(value * dpr) + 0.5) / dpr;

  const perimeterPoint = (
    distance: number,
    w: number,
    h: number,
  ): [number, number, number, number] => {
    let d = ((distance % (2 * (w + h))) + 2 * (w + h)) % (2 * (w + h));
    if (d < w) return [frame.x1 + d, frame.y1, 0, -1];
    d -= w;
    if (d < h) return [frame.x2, frame.y1 + d, 1, 0];
    d -= h;
    if (d < w) return [frame.x2 - d, frame.y2, 0, 1];
    d -= w;
    return [frame.x1, frame.y2 - d, -1, 0];
  };

  const drawSpecks = (st: Settings, a: number, o: Out = MO): void => {
    const w = frame.x2 - frame.x1;
    const h = frame.y2 - frame.y1;
    if (w < 2 || h < 2) return;
    o.ctx.setTransform(dpr, 0, 0, dpr, o.dx * dpr, o.dy * dpr);
    const perimeter = 2 * (w + h);
    const seed = frame.index + 1;
    const grid = 3;

    for (let k = 0; k < st.specks; k++) {
      const period = 0.5 + noise(seed, k, 11) * 1.2;
      const t = pulse / period + noise(seed, k, 17);
      const cycle = Math.floor(t);
      const life = t - cycle;
      if (life > 0.7) continue;
      const [px, py, nx, ny] = perimeterPoint(noise(seed, k, cycle) * perimeter, w, h);
      const pick = noise(seed, k, cycle, 2);
      const size = pick < 0.46 ? 2 : pick < 0.7 ? 3 : pick < 0.84 ? 5 : pick < 0.94 ? 8 : 11;
      const large = size >= 8;
      const out = (large ? 9 : 4) + Math.floor(noise(seed, k, cycle, 1) * 5) * grid;
      const x = frame.x1 + Math.round((px + nx * out - frame.x1) / grid) * grid;
      const y = frame.y1 + Math.round((py + ny * out - frame.y1) / grid) * grid;
      const tone = noise(seed, k, cycle, 3);
      const blink = life < 0.06 || (life > 0.32 && life < 0.36) ? 0.35 : 1;
      const alpha = a * (large ? 0.3 + 0.4 * tone : 0.3 + 0.6 * tone) * blink;
      const left = Math.round(x - size / 2);
      const top = Math.round(y - size / 2);
      if (tone < 0.26 || (large && tone < 0.78)) {
        o.ctx.strokeStyle = rgba(st.accentColor, alpha);
        o.ctx.strokeRect(left + 0.5, top + 0.5, size, size);
        if (large && tone > 0.5) {
          o.ctx.fillStyle = rgba(st.accentColor, alpha);
          o.ctx.fillRect(Math.round(x) - 1, Math.round(y) - 1, 2, 2);
        }
      } else {
        o.ctx.fillStyle = rgba(st.accentColor, alpha);
        o.ctx.fillRect(left, top, size, size);
      }
    }

    for (let j = 0; j < 2; j++) {
      const head = (pulse * 0.42 * st.speed + j * 0.5) * perimeter;
      for (let i = 0; i < 4; i++) {
        const [x, y] = perimeterPoint(head - i * 6, w, h);
        const size = i === 0 ? 3 : 2;
        o.ctx.fillStyle = rgba(st.accentColor, a * [0.95, 0.55, 0.32, 0.16][i]);
        o.ctx.fillRect(Math.round(x - size / 2), Math.round(y - size / 2), size, size);
      }
    }
  };

  const drawFrame = (st: Settings, o: Out = MO): void => {
    const glyph = glyphs[frame.index];
    if (!glyph || frame.alpha < 0.01) return;
    const a = frame.alpha;
    const x1 = crisp(frame.x1);
    const y1 = crisp(frame.y1);
    const x2 = crisp(frame.x2);
    const y2 = crisp(frame.y2);
    o.ctx.setTransform(dpr, 0, 0, dpr, o.dx * dpr, o.dy * dpr);

    const moved = Math.hypot(glyph.offset.x, glyph.offset.y);
    if (moved > 1) {
      const hx = (glyph.box.x1 + glyph.box.x2) / 2;
      const hy = (glyph.box.y1 + glyph.box.y2) / 2;
      o.ctx.beginPath();
      o.ctx.moveTo(hx, hy);
      o.ctx.lineTo(hx + glyph.offset.x, hy + glyph.offset.y);
      o.ctx.setLineDash([3, 4]);
      o.ctx.lineWidth = 1;
      o.ctx.strokeStyle = rgba(st.accentColor, 0.45 * a);
      o.ctx.stroke();
      o.ctx.setLineDash([]);
      o.ctx.beginPath();
      o.ctx.rect(Math.round(hx) - 2, Math.round(hy) - 2, 4, 4);
      o.ctx.fillStyle = rgba(st.accentColor, 0.7 * a);
      o.ctx.fill();
    }

    o.ctx.beginPath();
    o.ctx.rect(x1, y1, x2 - x1, y2 - y1);
    o.ctx.lineWidth = 1;
    o.ctx.strokeStyle = rgba(st.accentColor, 0.5 * a);
    o.ctx.stroke();

    o.ctx.beginPath();
    for (const [cx, cy] of [
      [x1, y1],
      [x2, y1],
      [x2, y2],
      [x1, y2],
    ]) {
      o.ctx.rect(Math.round(cx) - 2, Math.round(cy) - 2, 5, 5);
    }
    o.ctx.fillStyle = rgba(st.accentColor, 0.95 * a);
    o.ctx.fill();

    if (st.specks > 0) {
      o.ctx.lineWidth = 1;
      drawSpecks(st, a, o);
    }

    if (!st.labels) return;
    o.ctx.font = LABEL_FONT;
    o.ctx.textAlign = 'left';
    o.ctx.textBaseline = 'bottom';
    o.ctx.fillStyle = rgba(st.accentColor, 0.62 * a);
    const label =
      moved > 1
        ? `${signed(Math.round(glyph.offset.x))}, ${signed(Math.round(-glyph.offset.y))}`
        : `${glyph.char}  ${Math.round(glyph.box.x2 - glyph.box.x1)} × ${Math.round(glyph.box.y2 - glyph.box.y1)}`;
    o.ctx.fillText(label, Math.round(frame.x1), Math.round(frame.y1) - 7);
  };

  const tick = (now: number): void => {
    raf = 0;
    if (!root.isConnected) {
      destroy();
      return;
    }
    const dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000));
    last = now;
    const view = ensureLayout(s);

    const sweeping = s.sweep && !reducedMotion && !pointer.inside && dragging < 0;
    if (sweeping) clock += dt * s.speed;
    pulse += dt;
    let targetX = pointer.x;
    let targetY = pointer.y;
    if (sweeping) {
      targetX = view.left + (view.right - view.left) * (0.5 - 0.5 * Math.cos(clock * 0.45));
      targetY = view.top + (view.bottom - view.top) * (0.45 + 0.1 * Math.sin(clock * 0.8));
    }
    const active = pointer.inside || sweeping || dragging >= 0;
    if (active && !placed) {
      lens.x = targetX;
      lens.y = targetY;
    }
    if (active) {
      const lag = pointer.inside ? 0.05 : 0.22;
      lens.x = approach(lens.x, targetX, dt, lag);
      lens.y = approach(lens.y, targetY, dt, lag);
    }
    placed = active;
    presence = approach(presence, s.reveal === 'area' && active && dragging < 0 ? 1 : 0, dt, 0.16);

    let moving = false;
    glyphs.forEach((glyph, i) => {
      if (i === dragging) {
        glyph.offset.x = pointer.x - grab.x;
        glyph.offset.y = pointer.y - grab.y;
        glyph.velocity.x = 0;
        glyph.velocity.y = 0;
        moving = true;
        return;
      }
      const { offset, velocity } = glyph;
      if (
        Math.abs(offset.x) < 0.05 &&
        Math.abs(offset.y) < 0.05 &&
        Math.hypot(velocity.x, velocity.y) < 0.5
      ) {
        offset.x = 0;
        offset.y = 0;
        velocity.x = 0;
        velocity.y = 0;
        return;
      }
      velocity.x += (-SPRING * offset.x - DAMPING * velocity.x) * dt;
      velocity.y += (-SPRING * offset.y - DAMPING * velocity.y) * dt;
      offset.x += velocity.x * dt;
      offset.y += velocity.y * dt;
      moving = true;
    });

    const focus = dragging >= 0 ? dragging : active ? glyphAt(lens.x, lens.y) : -1;
    if (focus >= 0 && s.selection) {
      const glyph = glyphs[focus];
      const bx1 = glyph.box.x1 + glyph.offset.x - 6;
      const by1 = glyph.box.y1 + glyph.offset.y - 6;
      const bx2 = glyph.box.x2 + glyph.offset.x + 6;
      const by2 = glyph.box.y2 + glyph.offset.y + 6;
      if (focus === dragging) {
        frame.x1 = bx1;
        frame.y1 = by1;
        frame.x2 = bx2;
        frame.y2 = by2;
      } else {
        if (frame.index < 0 || frame.alpha < 0.02) {
          frame.x1 = bx1;
          frame.y1 = by1;
          frame.x2 = bx2;
          frame.y2 = by2;
        }
        frame.x1 = approach(frame.x1, bx1, dt, 0.08);
        frame.y1 = approach(frame.y1, by1, dt, 0.08);
        frame.x2 = approach(frame.x2, bx2, dt, 0.08);
        frame.y2 = approach(frame.y2, by2, dt, 0.08);
      }
      frame.index = focus;
    }
    frame.alpha = approach(frame.alpha, focus >= 0 && s.selection ? 1 : 0, dt, 0.1);

    glyphs.forEach((glyph, i) => {
      const target = s.reveal === 'letter' && i === focus && i !== dragging ? 1 : 0;
      glyph.outline = approach(glyph.outline, target, dt, 0.09);
      if (Math.abs(glyph.outline - target) > 0.002) moving = true;
      else glyph.outline = target;
    });

    if (s.draggable)
      root.style.cursor = dragging >= 0 ? 'grabbing' : focus >= 0 && pointer.inside ? 'grab' : '';

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const hideDragged = dragging >= 0 && s.selection;
    for (let i = 0; i < glyphs.length; i++) {
      if (i === dragging && hideDragged) continue;
      const glyph = glyphs[i];
      const moved = Math.hypot(glyph.offset.x, glyph.offset.y);
      if (moved > 1) {
        ctx.globalAlpha = Math.min(1, moved / 24) * 0.55;
        blit(ctx, glyph.dashes, 0, 0, 0, 0);
        ctx.globalAlpha = 1;
      }
    }
    for (let i = 0; i < glyphs.length; i++) {
      if (i === dragging && hideDragged) continue;
      const glyph = glyphs[i];
      if (glyph.outline < 0.999) {
        ctx.globalAlpha = 1 - glyph.outline;
        blit(ctx, glyph.fill, glyph.offset.x, glyph.offset.y, 0, 0);
      }
      if (glyph.outline > 0.001) {
        ctx.globalAlpha = glyph.outline;
        blit(ctx, glyph.dashes, glyph.offset.x, glyph.offset.y, 0, 0);
      }
      ctx.globalAlpha = 1;
    }
    if (presence > 0.001) drawReveal(s);
    if (!hideDragged) drawFrame(s);
    drawOverlay(hideDragged);

    const settling =
      moving ||
      Math.abs(presence - (s.reveal === 'area' && active && dragging < 0 ? 1 : 0)) > 0.002 ||
      (frame.alpha > 0.01 && frame.alpha < 0.99);
    if ((active || settling) && visible && alive) raf = requestAnimationFrame(tick);
  };

  const wake = (): void => {
    if (raf || !visible || !alive) return;
    last = performance.now();
    raf = requestAnimationFrame(tick);
  };

  const resize = (): void => {
    width = Math.max(1, root.clientWidth);
    height = Math.max(1, root.clientHeight);
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    layoutKey = '';
    wake();
  };

  let overlay: HTMLCanvasElement | null = null;
  let octx: CanvasRenderingContext2D | null = null;
  let overlayShown = false;

  const ensureOverlay = (): boolean => {
    if (!overlay) {
      overlay = document.createElement('canvas');
      overlay.className = 'tech-text-overlay';
      overlay.setAttribute('aria-hidden', 'true');
      overlay.style.width = `${window.innerWidth}px`;
      overlay.style.height = `${window.innerHeight}px`;
      document.body.appendChild(overlay);
      octx = overlay.getContext('2d');
      if (!octx) return false;
    }
    const w = Math.max(1, Math.round(window.innerWidth * dpr));
    const h = Math.max(1, Math.round(window.innerHeight * dpr));
    if (overlay.width !== w || overlay.height !== h) {
      overlay.width = w;
      overlay.height = h;
    }
    return true;
  };

  const hideOverlay = (): void => {
    if (overlay && octx) {
      octx.setTransform(1, 0, 0, 1, 0, 0);
      octx.clearRect(0, 0, overlay.width, overlay.height);
    }
  };

  const drawOverlay = (show: boolean): void => {
    if (!show || dragging < 0) {
      if (overlayShown) {
        overlayShown = false;
        hideOverlay();
      }
      return;
    }
    const glyph = glyphs[dragging];
    if (!glyph || !ensureOverlay() || !octx) return;
    overlayShown = true;
    const rect = root.getBoundingClientRect();
    octx.setTransform(1, 0, 0, 1, 0, 0);
    octx.globalCompositeOperation = 'source-over';
    octx.globalAlpha = 1;
    octx.clearRect(0, 0, overlay!.width, overlay!.height);
    blit(
      octx,
      glyph.fill,
      glyph.offset.x + rect.left,
      glyph.offset.y + rect.top,
      0,
      0,
    );
    drawFrame(s, { ctx: octx, dx: rect.left, dy: rect.top });
  };

  const cancelDrag = (): void => {
    if (dragging < 0) return;
    dragging = -1;
    overlayShown = false;
    hideOverlay();
    wake();
  };
  const onScroll = (): void => cancelDrag();
  const onKey = (e: KeyboardEvent): void => {
    if (e.key === 'Escape') cancelDrag();
  };

  const locate = (e: PointerEvent): void => {
    const rect = root.getBoundingClientRect();
    pointer.x = e.clientX - rect.left;
    pointer.y = e.clientY - rect.top;
  };
  const onMove = (e: PointerEvent): void => {
    locate(e);
    pointer.inside = true;
    wake();
  };
  const onLeave = (): void => {
    if (dragging >= 0) return;
    pointer.inside = false;
    wake();
  };
  const onDown = (e: PointerEvent): void => {
    locate(e);
    pointer.inside = true;
    if (s.draggable && (e.pointerType !== 'mouse' || e.button === 0)) {
      const index = glyphAt(pointer.x, pointer.y);
      if (index >= 0) {
        dragging = index;
        const g = glyphs[index];
        frame.x1 = g.box.x1 + g.offset.x - 6;
        frame.y1 = g.box.y1 + g.offset.y - 6;
        frame.x2 = g.box.x2 + g.offset.x + 6;
        frame.y2 = g.box.y2 + g.offset.y + 6;
        frame.index = index;
        grab.x = pointer.x - glyphs[index].offset.x;
        grab.y = pointer.y - glyphs[index].offset.y;
        (root as HTMLElement & { setPointerCapture?: (id: number) => void }).setPointerCapture?.(
          e.pointerId,
        );
      }
    }
    wake();
  };
  const onUp = (e: PointerEvent): void => {
    if (dragging >= 0) {
      dragging = -1;
      overlayShown = false;
      hideOverlay();
      (root as HTMLElement & { releasePointerCapture?: (id: number) => void }).releasePointerCapture?.(
        e.pointerId,
      );
      const rect = root.getBoundingClientRect();
      pointer.inside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;
    }
    wake();
  };

  root.addEventListener('pointermove', onMove, { passive: true });
  root.addEventListener('pointerenter', onMove, { passive: true });
  root.addEventListener('pointerdown', onDown, { passive: true });
  root.addEventListener('pointerup', onUp, { passive: true });
  root.addEventListener('pointercancel', onUp, { passive: true });
  root.addEventListener('pointerleave', onLeave, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('keydown', onKey);

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(root);
  const intersectionObserver = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    wake();
  });
  intersectionObserver.observe(root);
  const dprQuery = window.matchMedia?.('(resolution)');
  const onDpr = (): void => {
    layoutKey = '';
    resize();
    if (overlay) {
      overlay.style.width = `${window.innerWidth}px`;
      overlay.style.height = `${window.innerHeight}px`;
    }
    wake();
  };
  dprQuery?.addEventListener('change', onDpr);
  if (document.fonts) document.fonts.ready.then(refreshFonts, refreshFonts);

  const refreshTheme = (): void => {
    s.color = '';
    s.accentColor = '';
    resolveThemeColors(s, root);
    layoutKey = '';
    wake();
  };
  themeRefreshers.set(root, refreshTheme);

  resize();
  root.classList.add('is-live');
  root.parentElement?.classList.add('is-tech-live');

  const destroy = (): void => {
    if (destroyed) return;
    destroyed = true;
    alive = false;
    cancelAnimationFrame(raf);
    themeRefreshers.delete(root);
    resizeObserver.disconnect();
    intersectionObserver.disconnect();
    dprQuery?.removeEventListener('change', onDpr);
    root.removeEventListener('pointermove', onMove);
    root.removeEventListener('pointerenter', onMove);
    root.removeEventListener('pointerdown', onDown);
    root.removeEventListener('pointerup', onUp);
    root.removeEventListener('pointercancel', onUp);
    root.removeEventListener('pointerleave', onLeave);
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('keydown', onKey);
    overlayShown = false;
    overlay?.remove();
    overlay = null;
    octx = null;
  };

  return destroy;
}

const themeRefreshers = new WeakMap<HTMLElement, () => void>();
const enhanced = new WeakSet<HTMLElement>();
const disposers = new Map<HTMLElement, () => void>();
let themeMo: MutationObserver | null = null;

function disposeRoot(root: HTMLElement): void {
  try {
    disposers.get(root)?.();
  } catch {
  }
  disposers.delete(root);
  enhanced.delete(root);
  delete root.dataset.bound;
}

function init(): void {
  if (!themeMo) {
    themeMo = new MutationObserver(() => {
      document.querySelectorAll<HTMLElement>('[data-tech-text]').forEach((el) => {
        themeRefreshers.get(el)?.();
      });
    });
    themeMo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
  }
  for (const [root] of Array.from(disposers)) {
    if (!root.isConnected) disposeRoot(root);
  }
  document.querySelectorAll<HTMLElement>('[data-tech-text]').forEach((root) => {
    if (!root.isConnected) return;
    if (enhanced.has(root) || root.dataset.bound === 'true') return;
    enhanced.add(root);
    root.dataset.bound = 'true';
    disposers.set(root, enhance(root));
  });
}

document.addEventListener('astro:page-load', init);
document.addEventListener('astro:after-swap', init);
init();

export {};
