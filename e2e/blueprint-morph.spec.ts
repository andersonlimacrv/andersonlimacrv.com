import { test, expect, type Page } from '@playwright/test';

const VIEWPORTS = [
  { name: 'desktop', width: 1280, height: 800 },
  { name: 'mobile', width: 390, height: 844 },
] as const;

const TOLERANCE_PX = 3;
const FINAL_SIZE_PX = 160;

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
        const label = await page
          .locator('[data-bp-wireframe].bp-start .bp-ghost-r-label')
          .first()
          .textContent();
        expect(label?.trim()).toMatch(/^r\s*80px$/);
      });

      test('legenda de evolução: nome real da figura + retângulo → círculo', async ({
        page,
      }) => {
        await gotoHome(page);
        const data = await page.evaluate((finalSize) => {
          const legend = document.querySelector('[data-bp-board] .bp-legend');
          if (!legend) return null;
          const text = legend.textContent ?? '';
          return {
            hasFigName: /AndersonLimaCRV/i.test(text),
            hasEvolucao: /EVOLU/.test(text),
            hasFinal: new RegExp(`Ø${finalSize}`).test(text),
            glyphRect: legend.querySelector('.bp-glyph-rect') !== null,
            glyphCircle: legend.querySelector('.bp-glyph-circle') !== null,
            hasD: legend.querySelector('[data-bp="d"]') !== null,
            hasXy: /x.*y/.test(text),
          };
        }, FINAL_SIZE_PX);
        expect(data).not.toBeNull();
        const d = data!;
        expect(d.hasFigName).toBe(true);
        expect(d.hasEvolucao).toBe(true);
        expect(d.hasFinal).toBe(true);
        expect(d.glyphRect).toBe(true);
        expect(d.glyphCircle).toBe(true);
        expect(d.hasD).toBe(true);
        expect(d.hasXy).toBe(true);
      });

      test('círculo final posicionado com a mesma clamp do morph', async ({
        page,
      }) => {
        await gotoHome(page);
        const data = await page.evaluate(() => {
          const circle = document.querySelector('[data-bp-end] .bp-end-circle');
          const target = document.querySelector('#sobre-content');
          if (!circle || !target) return null;
          const cr = circle.getBoundingClientRect();
          const tr = target.getBoundingClientRect();
          const expectedLeft = Math.min(
            Math.max(0, tr.width * 0.15 - 80),
            tr.width - 160,
          );
          const expectedTop = Math.min(
            Math.max(0, tr.height * 0.5 - 80),
            tr.height - 160,
          );
          return {
            left: cr.left - tr.left,
            top: cr.top - tr.top,
            width: cr.width,
            expectedLeft,
            expectedTop,
          };
        });
        expect(data).not.toBeNull();
        const d = data!;
        expect(Math.abs(d.width - FINAL_SIZE_PX)).toBeLessThanOrEqual(TOLERANCE_PX);
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