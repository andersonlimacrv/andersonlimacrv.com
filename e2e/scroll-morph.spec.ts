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

type MorphState = {
  scrollY: number;
  img: {
    left: number;
    top: number;
    right: number;
    bottom: number;
    width: number;
    height: number;
  };
  target: { left: number; top: number; right: number; bottom: number };
  transform: string;
  hasH: boolean;
  docW: number;
  vw: number;
};

async function gotoHome(page: Page) {
  await page.addStyleTag({ content: 'html { scroll-behavior: auto !important; }' });
  await page.goto('/', { waitUntil: 'networkidle' });
  await page
    .waitForFunction(() => document.fonts.status !== 'loading', undefined, {
      timeout: 15_000,
    })
    .catch(() => undefined);
  await page.waitForTimeout(100);
}

async function morphState(page: Page): Promise<MorphState> {
  return page.evaluate(() => {
    const img = document.querySelector<HTMLElement>('[data-scroll-morph] img');
    const target = document.querySelector<HTMLElement>('#sobre-portrait');
    if (!img || !target) throw new Error('morph elements not found');
    const r = img.getBoundingClientRect();
    const tr = target.getBoundingClientRect();
    return {
      scrollY: Math.round(window.scrollY),
      img: {
        left: r.left,
        top: r.top,
        right: r.right,
        bottom: r.bottom,
        width: r.width,
        height: r.height,
      },
      target: {
        left: tr.left,
        top: tr.top,
        right: tr.right,
        bottom: tr.bottom,
      },
      transform: img.style.transform,
      hasH: document.documentElement.scrollWidth > window.innerWidth,
      docW: document.documentElement.scrollWidth,
      vw: window.innerWidth,
    };
  });
}

async function scrollTo(page: Page, y: number) {
  await page.evaluate((yy) => window.scrollTo(0, yy), y);
  await page.waitForTimeout(60);
}

async function morphScrollRange(page: Page): Promise<{ start: number; end: number }> {
  return page.evaluate(() => {
    const img = document.querySelector('[data-scroll-morph] img') as HTMLElement;
    const target = document.querySelector('#sobre-portrait') as HTMLElement;
    const innerH = window.innerHeight;
    const imgTop = img.getBoundingClientRect().top + window.scrollY;
    const targetTop = target.getBoundingClientRect().top + window.scrollY;
    const start = Math.max(0, imgTop - innerH * 0.3);
    const end = Math.max(start + 1, targetTop - innerH * 0.3);
    return { start, end };
  });
}

test.describe('morph do retrato hero', () => {
  for (const vp of VIEWPORTS) {
    test.describe(vp.name, () => {
      test.use({ viewport: { width: vp.width, height: vp.height } });

      test('sem overflow horizontal no topo e no fim da página', async ({
        page,
      }) => {
        await gotoHome(page);
        let s = await morphState(page);
        expect(s.hasH).toBe(false);
        expect(s.docW).toBeLessThanOrEqual(s.vw);

        await scrollTo(page, Number.MAX_SAFE_INTEGER);
        s = await morphState(page);
        expect(s.hasH).toBe(false);
        expect(s.docW).toBeLessThanOrEqual(s.vw);
      });

      test('estado inicial: imagem full-size', async ({ page }) => {
        await gotoHome(page);
        const s = await morphState(page);
        expect(s.img.width).toBeGreaterThan(200);
        expect(s.transform).toContain('scale(1');
      });

      test('meio do scroll: valores interpolados (nem full-size, nem final)', async ({
        page,
      }) => {
        await gotoHome(page);
        const finalSize = FINAL_SIZE_BY_VIEWPORT[vp.name];
        const initial = await morphState(page);
        const { start, end } = await morphScrollRange(page);
        const mid = start + (end - start) * 0.5;
        await scrollTo(page, mid);
        const s = await morphState(page);
        expect(s.img.width).toBeGreaterThan(finalSize);
        expect(s.img.width).toBeLessThan(initial.img.width - TOLERANCE_PX);
        expect(s.transform).not.toContain('scale(1');
      });

      test('resize no meio do morph não corrompe: termina no círculo e volta full-size', async ({
        page,
      }) => {
        await gotoHome(page);
        const finalSize = FINAL_SIZE_BY_VIEWPORT[vp.name];
        const initial = await morphState(page);
        const { start, end } = await morphScrollRange(page);
        const mid = start + (end - start) * 0.5;
        await scrollTo(page, mid);

        // Simula a barra de endereço do mobile / redimensionamento de janela.
        await page.setViewportSize({
          width: vp.width,
          height: vp.height - 104,
        });
        await page.waitForTimeout(120);

        await scrollTo(page, Number.MAX_SAFE_INTEGER);
        const done = await morphState(page);
        expect(Math.abs(done.img.width - finalSize)).toBeLessThanOrEqual(
          TOLERANCE_PX,
        );
        expect(done.img.left).toBeGreaterThanOrEqual(
          done.target.left - TOLERANCE_PX,
        );
        expect(done.img.right).toBeLessThanOrEqual(
          done.target.right + TOLERANCE_PX,
        );

        await scrollTo(page, 0);
        const top = await morphState(page);
        expect(top.transform).toContain('scale(1');
        expect(Math.abs(top.img.width - initial.img.width)).toBeLessThanOrEqual(
          TOLERANCE_PX,
        );
      });

      test('círculo final (160px) dentro do retrato (horizontalmente contido, centro vertical alinhado)', async ({
        page,
      }) => {
        await gotoHome(page);
        const finalSize = FINAL_SIZE_BY_VIEWPORT[vp.name];
        const { end } = await morphScrollRange(page);
        await scrollTo(page, end);
        const s = await morphState(page);
        expect(Math.abs(s.img.width - finalSize)).toBeLessThanOrEqual(
          TOLERANCE_PX,
        );
        expect(s.img.left).toBeGreaterThanOrEqual(s.target.left - TOLERANCE_PX);
        expect(s.img.right).toBeLessThanOrEqual(s.target.right + TOLERANCE_PX);
        const cx = s.img.left + s.img.width / 2;
        const cy = s.img.top + s.img.height / 2;
        expect(cx).toBeGreaterThanOrEqual(s.target.left - TOLERANCE_PX);
        expect(cx).toBeLessThanOrEqual(s.target.right + TOLERANCE_PX);
        expect(cy).toBeGreaterThanOrEqual(s.target.top - TOLERANCE_PX);
        expect(cy).toBeLessThanOrEqual(s.target.bottom + TOLERANCE_PX);
      });

      test('easing data-* está presente no elemento', async ({ page }) => {
        await gotoHome(page);
        const easing = await page
          .locator('[data-scroll-morph]')
          .getAttribute('data-easing');
        expect(easing).toBeTruthy();
      });
    });
  }
});

test.describe('prefers-reduced-motion', () => {
  test('estado final aplicado direto no load', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.addStyleTag({
      content: 'html { scroll-behavior: auto !important; }',
    });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(100);
    const s = await morphState(page);
    // Viewport default do describe: 1280×720 → final 160px.
    expect(Math.abs(s.img.width - FINAL_SIZE_BY_VIEWPORT.desktop)).toBeLessThanOrEqual(
      TOLERANCE_PX,
    );
  });
});
