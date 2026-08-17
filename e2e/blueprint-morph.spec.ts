import { test, expect, type Page } from '@playwright/test';

const VIEWPORTS = [
  { name: 'desktop', width: 1280, height: 800 },
  { name: 'mobile', width: 390, height: 844 },
] as const;

// Diâmetro final responsivo do morph (--morph-final-size no :root).
const FINAL_SIZE_BY_VIEWPORT: Record<(typeof VIEWPORTS)[number]['name'], number> = {
  desktop: 160,
  mobile: 128,
};

const TOLERANCE_PX = 3;

async function gotoHome(page: Page) {
  await page.addStyleTag({ content: 'html { scroll-behavior: auto !important; }' });
  await page.goto('/', { waitUntil: 'networkidle' });
  await page
    .waitForFunction(() => document.fonts.status !== 'loading', undefined, {
      timeout: 15_000,
    })
    .catch(() => undefined);
  await page.waitForTimeout(150);
}

test.describe('wireframe blueprint do morph da imagem', () => {
  for (const vp of VIEWPORTS) {
    test.describe(vp.name, () => {
      test.use({ viewport: { width: vp.width, height: vp.height } });

      test('start wireframe: cantoneiras no exato box do img + medidas reais', async ({
        page,
      }) => {
        await gotoHome(page);
        const data = await page.evaluate(() => {
          const frame = document.querySelector('[data-bp-wireframe].bp-start');
          const legend = document.querySelector('[data-bp-board] .bp-legend');
          const img = document.querySelector('[data-scroll-morph] img');
          if (!frame || !legend || !img) return null;
          const cs = getComputedStyle(frame);
          const w = parseFloat(cs.getPropertyValue('--bp-w'));
          const h = parseFloat(cs.getPropertyValue('--bp-h'));
          const rect = img.getBoundingClientRect();
          const cornerCount = frame.querySelectorAll('.bp-corner').length;
          const wSpan = legend.querySelector('[data-bp="w"]')?.textContent ?? '';
          const sSpan = legend.querySelector('[data-bp="s"]')?.textContent ?? '';
          return { w, h, imgW: rect.width, imgH: rect.height, cornerCount, wSpan, sSpan };
        });
        expect(data).not.toBeNull();
        const d = data!;
        expect(Math.abs(d.w - d.imgW)).toBeLessThanOrEqual(TOLERANCE_PX);
        expect(Math.abs(d.h - d.imgH)).toBeLessThanOrEqual(TOLERANCE_PX);
        expect(d.cornerCount).toBe(4);
        expect(d.wSpan).toMatch(/px/);
        expect(d.sSpan).toMatch(/^\d+(\.\d+)?$/);
      });

      test('camada de baixo: quadriculado e legenda centralizada atrás da foto', async ({
        page,
      }) => {
        await gotoHome(page);
        const data = await page.evaluate(() => {
          const board = document.querySelector('[data-bp-board]');
          const figure = document.querySelector('[data-scroll-morph]');
          const img = document.querySelector('[data-scroll-morph] img');
          const grid = board?.querySelector('.bp-grid');
          const legend = board?.querySelector('.bp-legend');
          if (!board || !figure || !img || !grid || !legend) return null;
          const boardZ = parseInt(getComputedStyle(board).zIndex, 10);
          const figureZ = parseInt(getComputedStyle(figure).zIndex, 10);
          const gr = grid.getBoundingClientRect();
          const ir = img.getBoundingClientRect();
          const lr = legend.getBoundingClientRect();
          return {
            boardZ,
            figureZ,
            gridH: gr.height,
            imgH: ir.height,
            legendCenterY: lr.top + lr.height / 2,
            imgCenterY: ir.top + ir.height / 2,
            legendCenterX: lr.left + lr.width / 2,
            imgCenterX: ir.left + ir.width / 2,
          };
        });
        expect(data).not.toBeNull();
        const d = data!;
        expect(d.boardZ).toBeLessThan(d.figureZ);
        expect(Math.abs(d.gridH - d.imgH)).toBeLessThanOrEqual(TOLERANCE_PX);
        expect(Math.abs(d.legendCenterY - d.imgCenterY)).toBeLessThanOrEqual(TOLERANCE_PX + 4);
        expect(Math.abs(d.legendCenterX - d.imgCenterX)).toBeLessThanOrEqual(TOLERANCE_PX + 4);
      });

      test('raio atual anotado sobre a imagem (r 80px)', async ({ page }) => {
        await gotoHome(page);
        const radius = FINAL_SIZE_BY_VIEWPORT[vp.name] / 2;
        const label = await page
          .locator('[data-bp-wireframe].bp-start .bp-ghost-r-label')
          .first()
          .textContent();
        expect(label?.trim()).toMatch(new RegExp(`^r\\s*${radius}px$`));
      });

      test('start: círculo-fantasma centralizado + 4 traços cardeais + rótulo no quadrante', async ({
        page,
      }) => {
        await gotoHome(page);
        const sc = FINAL_SIZE_BY_VIEWPORT[vp.name] / 160;
        const data = await page.evaluate(() => {
          const sel = '[data-bp-wireframe].bp-start';
          const ghost = document.querySelector(`${sel} .bp-ghost`);
          const rect = document.querySelector(`${sel} .bp-rect`);
          const rLine = document.querySelector(`${sel} .bp-ghost-r-line`);
          const top = document.querySelector(`${sel} .bp-ghost-tick-top`);
          const bottom = document.querySelector(`${sel} .bp-ghost-tick-bottom`);
          const right = document.querySelector(`${sel} .bp-ghost-tick-right`);
          const label = document.querySelector(`${sel} .bp-ghost-r-label`);
          const leader = document.querySelector(`${sel} .bp-leader`);
          if (!ghost || !rect || !rLine || !top || !bottom || !right || !label) {
            return null;
          }
          const box = (el: Element) => {
            const r = el.getBoundingClientRect();
            return { x: r.x, y: r.y, w: r.width, h: r.height };
          };
          const g = box(ghost);
          const rr = box(rect);
          const l = box(label);
          const cx = document.querySelector(`${sel} .bp-ghost-cross-x`);
          const cy = document.querySelector(`${sel} .bp-ghost-cross-y`);
          const intersects = (
            a: { x: number; y: number; w: number; h: number },
            b: { x: number; y: number; w: number; h: number },
          ) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
          return {
            ghostCenterX: g.x + g.w / 2,
            rectCenterX: rr.x + rr.w / 2,
            ghostBottomDist: rr.y + rr.h - (g.y + g.h),
            tickTop: box(top),
            tickBottom: box(bottom),
            tickRight: box(right),
            rLineW: rLine.getBoundingClientRect().width,
            rLineCenterY: rLine.getBoundingClientRect().y + rLine.getBoundingClientRect().height / 2,
            ghostCenterY: g.y + g.h / 2,
            labelInsideGhost:
              l.x >= g.x && l.x + l.w <= g.x + g.w && l.y >= g.y && l.y + l.h <= g.y + g.h,
            labelBottomLeft:
              l.x + l.w / 2 < g.x + g.w / 2 && l.y + l.h / 2 > g.y + g.h / 2,
            labelNotCrossed:
              !cx || !cy || !(intersects(l, box(cx)) || intersects(l, box(cy))),
            noLeader: leader === null,
          };
        });
        expect(data).not.toBeNull();
        const d = data!;
        expect(Math.abs(d.ghostCenterX - d.rectCenterX)).toBeLessThanOrEqual(TOLERANCE_PX);
        expect(d.ghostBottomDist).toBeLessThanOrEqual(16);
        expect(d.tickTop.w).toBeLessThanOrEqual(2);
        expect(d.tickTop.h).toBeGreaterThan(10 * sc);
        expect(d.tickBottom.w).toBeLessThanOrEqual(2);
        expect(d.tickBottom.h).toBeGreaterThan(10 * sc);
        expect(d.tickRight.w).toBeGreaterThan(10 * sc);
        expect(d.tickRight.h).toBeLessThanOrEqual(2);
        expect(d.rLineW).toBeGreaterThan(10 * sc);
        expect(Math.abs(d.rLineCenterY - d.ghostCenterY)).toBeLessThanOrEqual(2);
        expect(d.labelInsideGhost).toBe(true);
        expect(d.labelBottomLeft).toBe(true);
        expect(d.labelNotCrossed).toBe(true);
        expect(d.noLeader).toBe(true);
      });

      test('start: rótulos nos 4 quadrantes, fora do cruzamento do crosshair', async ({
        page,
      }) => {
        await gotoHome(page);
        const sc = FINAL_SIZE_BY_VIEWPORT[vp.name] / 160;
        const data = await page.evaluate(() => {
          const sel = '[data-bp-wireframe].bp-start';
          const ghost = document.querySelector(`${sel} .bp-ghost`);
          const rl = document.querySelector(`${sel} .bp-ghost-r-label`);
          const a = document.querySelector(`${sel} .bp-ghost-q-a`);
          const s = document.querySelector(`${sel} .bp-ghost-q-s`);
          const xy = document.querySelector(`${sel} .bp-ghost-q-xy`);
          const cx = document.querySelector(`${sel} .bp-ghost-cross-x`);
          const cy = document.querySelector(`${sel} .bp-ghost-cross-y`);
          if (!ghost || !rl || !a || !s || !xy) return null;
          const box = (el: Element) => {
            const r = el.getBoundingClientRect();
            return { x: r.x, y: r.y, w: r.width, h: r.height };
          };
          const g = box(ghost);
          const intersects = (
            p: { x: number; y: number; w: number; h: number },
            q: { x: number; y: number; w: number; h: number },
          ) => p.x < q.x + q.w && p.x + p.w > q.x && p.y < q.y + q.h && p.y + p.h > q.y;
          const quadrant = (b: { x: number; y: number; w: number; h: number }) => ({
            left: b.x + b.w / 2 < g.x + g.w / 2,
            top: b.y + b.h / 2 < g.y + g.h / 2,
          });
          const noCross = (b: { x: number; y: number; w: number; h: number }) =>
            (!cx || !intersects(b, box(cx))) && (!cy || !intersects(b, box(cy)));
          const inside = (b: { x: number; y: number; w: number; h: number }) =>
            b.x >= g.x && b.y >= g.y && b.x + b.w <= g.x + g.w && b.y + b.h <= g.y + g.h;
          const cxAbs = g.x + g.w / 2;
          const inner = (b: { x: number; y: number; w: number; h: number }) =>
            Math.abs(b.x < cxAbs ? cxAbs - (b.x + b.w) : b.x - cxAbs);
          const meta = (b: { x: number; y: number; w: number; h: number }) => ({
            q: quadrant(b),
            cross: noCross(b),
            inside: inside(b),
            inner: Math.round(inner(b)),
          });
          const ta = (sel2: string) => {
            const el = document.querySelector(`${sel} ${sel2}`);
            return el ? getComputedStyle(el).textAlign : '';
          };
          return {
            r: { ...meta(box(rl)), ta: ta('.bp-ghost-r-label') },
            a: { ...meta(box(a)), ta: ta('.bp-ghost-q-a') },
            s: { ...meta(box(s)), ta: ta('.bp-ghost-q-s') },
            xy: { ...meta(box(xy)), ta: ta('.bp-ghost-q-xy') },
          };
        });
        expect(data).not.toBeNull();
        const d = data!;
        expect(d.r.q).toEqual({ left: true, top: false });
        expect(d.a.q).toEqual({ left: true, top: true });
        expect(d.s.q).toEqual({ left: false, top: true });
        expect(d.xy.q).toEqual({ left: false, top: false });
        expect(d.r.cross).toBe(true);
        expect(d.a.cross).toBe(true);
        expect(d.s.cross).toBe(true);
        expect(d.xy.cross).toBe(true);
        expect(d.r.inside && d.a.inside && d.s.inside && d.xy.inside).toBe(true);
        expect(d.r.ta).toBe('right');
        expect(d.a.ta).toBe('right');
        expect(d.s.ta).toBe('left');
        expect(d.xy.ta).toBe('left');
        const inners = [d.r.inner, d.s.inner, d.xy.inner];
        expect(Math.max(...inners) - Math.min(...inners)).toBeLessThanOrEqual(2);
        expect(d.a.inner).toBeLessThan(d.r.inner);
        expect(d.a.inner).toBeGreaterThanOrEqual(4 * sc);
      });

      test('start: valores ao vivo atualizam durante o morph', async ({ page }) => {
        await gotoHome(page);
        const read = () =>
          page.evaluate(() => {
            const sel = '[data-bp-wireframe].bp-start';
            const qs = (c: string) =>
              document.querySelector(`${sel} ${c}`)?.textContent ?? '';
            return {
              s: qs('.bp-ghost-q-s'),
              a: qs('.bp-ghost-q-a'),
              xy: qs('.bp-ghost-q-xy'),
              sNum: parseFloat(qs('.bp-ghost-q-s').replace(/^s\s*/, '')) || 0,
              aNum: parseInt((qs('.bp-ghost-q-a').match(/[\d.]+/) ?? ['0'])[0], 10) || 0,
              x: (qs('.bp-ghost-q-xy').match(/x\s*(-?\d+)/) ?? [])[1] ?? '0',
            };
          });
        const top = await read();
        expect(top.sNum).toBe(1);
        expect(top.x).toBe('0');
        await page.evaluate(() => window.scrollTo(0, Number.MAX_SAFE_INTEGER));
        await page
          .waitForFunction(
            () =>
              /0\.[0-9]/.test(
                document.querySelector(
                  '[data-bp-wireframe].bp-start .bp-ghost-q-s',
                )?.textContent ?? '',
              ),
            undefined,
            { timeout: 5000 },
          )
          .catch(() => undefined);
        const morphed = await read();
        expect(morphed.sNum).toBeLessThan(1);
        expect(morphed.aNum).toBeLessThan(top.aNum);
        expect(parseFloat(morphed.x ?? '0')).not.toBe(0);
      });

      test('start: cantoneiras e círculo usam tinta clara enquanto a imagem cobre', async ({
        page,
      }) => {
        await gotoHome(page);
        const read = () =>
          page.evaluate(() => {
            const f = document.querySelector('[data-bp-wireframe].bp-start');
            const lab = document.querySelector(
              '[data-bp-wireframe].bp-start .bp-ghost-r-label',
            );
            return {
              covered: f?.classList.contains('bp-covered') ?? false,
              label: lab ? getComputedStyle(lab).color : '',
            };
          });
        const top = await read();
        expect(top.covered).toBe(true);
        expect(top.label).toMatch(/9[0-9]%|0\.9/);
        await page.evaluate(() => window.scrollTo(0, Number.MAX_SAFE_INTEGER));
        await page
          .waitForFunction(
            () =>
              !(
                document.querySelector(
                  '[data-bp-wireframe].bp-start',
                ) as HTMLElement | null
              )?.classList.contains('bp-covered'),
            undefined,
            { timeout: 5000 },
          )
          .catch(() => undefined);
        const end = await read();
        expect(end.covered).toBe(false);
        expect(end.label).not.toMatch(/9[0-9]%|0\.9/);
      });

      test('legenda: figura IMG01 + grupos de dados do morph', async ({
        page,
      }) => {
        await gotoHome(page);
        const finalSize = FINAL_SIZE_BY_VIEWPORT[vp.name];
        const data = await page.evaluate((finalSize) => {
          const legend = document.querySelector('[data-bp-board] .bp-legend');
          if (!legend) return null;
          const text = legend.textContent ?? '';
          return {
            hasFigName: /IMG\.?-?01/i.test(text),
            hasEvolucao: /EVOLU/.test(text),
            hasFinal: new RegExp(`${finalSize}px`).test(text),
            hasD: legend.querySelector('[data-bp="d"]') !== null,
            hasXy: /x.*y/.test(text),
          };
        }, finalSize);
        expect(data).not.toBeNull();
        const d = data!;
        expect(d.hasFigName).toBe(true);
        expect(d.hasEvolucao).toBe(true);
        expect(d.hasFinal).toBe(true);
        expect(d.hasD).toBe(true);
        expect(d.hasXy).toBe(true);
      });

      test('círculo final posicionado com a mesma clamp do morph', async ({
        page,
      }) => {
        await gotoHome(page);
        const finalSize = FINAL_SIZE_BY_VIEWPORT[vp.name];
        const data = await page.evaluate((finalSize) => {
          const circle = document.querySelector('[data-bp-end] .bp-end-circle');
          const target = document.querySelector('#sobre-portrait');
          if (!circle || !target) return null;
          const cr = circle.getBoundingClientRect();
          const tr = target.getBoundingClientRect();
          const r = finalSize / 2;
          const expectedLeft = Math.min(
            Math.max(0, -r),
            tr.width - finalSize,
          );
          const expectedTop = Math.min(Math.max(0, -r), tr.height - finalSize);
          return {
            left: cr.left - tr.left,
            top: cr.top - tr.top,
            width: cr.width,
            expectedLeft,
            expectedTop,
          };
        }, finalSize);
        expect(data).not.toBeNull();
        const d = data!;
        expect(Math.abs(d.width - finalSize)).toBeLessThanOrEqual(TOLERANCE_PX);
        expect(Math.abs(d.left - d.expectedLeft)).toBeLessThanOrEqual(TOLERANCE_PX);
        expect(Math.abs(d.top - d.expectedTop)).toBeLessThanOrEqual(TOLERANCE_PX);
      });

      test('círculo final: cruzes nos pontos cardeais (mira) + retrato mais transparente', async ({
        page,
      }) => {
        await gotoHome(page);
        const data = await page.evaluate((tol) => {
          const end = document.querySelector('[data-bp-end]');
          const board = document.querySelector('[data-bp-end] .bp-end-board');
          const img = document.querySelector('[data-bp-end] .bp-end-img');
          if (!end || !board || !img) return null;
          const circle = document.querySelector('[data-bp-end] .bp-end-circle');
          const figure = document.querySelector('[data-scroll-morph]');
          const cr = circle?.getBoundingClientRect();
          const br = board.getBoundingClientRect();
          const ds = Array.from(board.querySelectorAll('.bp-end-cross')).map((p) =>
            p.getAttribute('d'),
          );
          const onCardinal = (d: string | null): boolean => {
            if (!d) return false;
            const top = /M\s*42\s+0\s+H\s*58/.test(d) && /M\s*50\s+-7\s+V\s*7/.test(d);
            const right = /M\s*100\s+42\s+V\s*58/.test(d) && /M\s*93\s+50\s+H\s*107/.test(d);
            const bottom = /M\s*42\s+100\s+H\s*58/.test(d) && /M\s*50\s+93\s+V\s*107/.test(d);
            const left = /M\s*0\s+42\s+V\s*58/.test(d) && /M\s*-7\s+50\s+H\s*7/.test(d);
            return top || right || bottom || left;
          };
          return {
            crossCount: ds.length,
            crossPathsCardinal: ds.every(onCardinal),
            crossesAboveImage:
              circle !== null &&
              (circle.compareDocumentPosition(board) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0,
            crossesAboveFinalImage:
              figure !== null &&
              circle !== null &&
              parseInt(getComputedStyle(board).zIndex, 10) >
                parseInt(getComputedStyle(figure).zIndex, 10),
            circleBelowFinalImage:
              figure !== null &&
              circle !== null &&
              parseInt(getComputedStyle(circle).zIndex, 10) <
                parseInt(getComputedStyle(figure).zIndex, 10),
            contentNotRevealed:
              !document.querySelector('#sobre-content')?.closest('[data-reveal]'),
            opacity: parseFloat(getComputedStyle(img).opacity),
            boardMatchesCircle:
              cr !== undefined &&
              Math.abs(br.left - cr.left) <= tol &&
              Math.abs(br.top - cr.top) <= tol &&
              Math.abs(br.width - cr.width) <= tol,
          };
        }, TOLERANCE_PX);
        expect(data).not.toBeNull();
        const d = data!;
        expect(d.crossCount).toBe(4);
        expect(d.crossPathsCardinal).toBe(true);
        expect(d.crossesAboveImage).toBe(true);
        expect(d.crossesAboveFinalImage).toBe(true);
        expect(d.circleBelowFinalImage).toBe(true);
        expect(d.contentNotRevealed).toBe(true);
        expect(Math.abs(d.opacity - 0.2)).toBeLessThanOrEqual(0.01);
        expect(d.boardMatchesCircle).toBe(true);
      });

      test('sem overflow horizontal no topo e no fim da página', async ({ page }) => {
        await gotoHome(page);
        const check = () =>
          page.evaluate(() => ({
            hasH: document.documentElement.scrollWidth > window.innerWidth,
            docW: document.documentElement.scrollWidth,
            vw: window.innerWidth,
          }));
        const top = await check();
        expect(top.hasH).toBe(false);
        await page.evaluate(() => window.scrollTo(0, Number.MAX_SAFE_INTEGER));
        await page.waitForTimeout(120);
        const bottom = await check();
        expect(bottom.hasH).toBe(false);
      });

      test('wireframes visíveis mesmo com prefers-reduced-motion', async ({ page }) => {
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await gotoHome(page);
        const startVisible = await page
          .locator('[data-bp-wireframe].bp-start')
          .first()
          .isVisible();
        expect(startVisible).toBe(true);
        const legendVisible = await page
          .locator('[data-bp-board] .bp-legend')
          .first()
          .isVisible();
        expect(legendVisible).toBe(true);
        await page.evaluate(() => window.scrollTo(0, Number.MAX_SAFE_INTEGER));
        await page.waitForTimeout(120);
        const endVisible = await page.locator('[data-bp-end]').first().isVisible();
        expect(endVisible).toBe(true);
      });
    });
  }
});