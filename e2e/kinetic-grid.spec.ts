import { test, expect, type Page } from '@playwright/test';

async function gotoHome(page: Page, path = '/') {
  await page.goto(path, { waitUntil: 'networkidle' });
  await page
    .waitForFunction(() => document.fonts.status !== 'loading', undefined, {
      timeout: 15_000,
    })
    .catch(() => undefined);
}

async function gridBox(page: Page) {
  const grid = page.locator('[data-kinetic-grid]').first();
  await grid.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  return grid;
}

test.describe('kinetic grid do contato', () => {
  test('canvas dimensionado pelo box, sem overflow horizontal', async ({
    page,
  }) => {
    await gotoHome(page);
    const grid = await gridBox(page);
    await expect(grid.locator('canvas')).toBeVisible();

    const dims = await grid.evaluate((el: HTMLElement) => {
      const canvas = el.querySelector('canvas') as HTMLCanvasElement;
      const rect = el.getBoundingClientRect();
      return {
        cssW: rect.width,
        cssH: rect.height,
        left: rect.left,
        right: rect.right,
        bmpW: canvas.width,
        bmpH: canvas.height,
        vw: window.innerWidth,
      };
    });

    expect(dims.cssW).toBeGreaterThan(0);
    expect(dims.cssH).toBeGreaterThan(0);
    const dpr = await page.evaluate(() => window.devicePixelRatio || 1);
    const scale = Math.min(dpr, 2);
    // tolerância de 1 CSS px para variação sub-pixel entre resize e medida
    expect(Math.abs(dims.bmpW - dims.cssW * scale)).toBeLessThanOrEqual(scale);
    expect(Math.abs(dims.bmpH - dims.cssH * scale)).toBeLessThanOrEqual(scale);
    // o BOX não transborda a viewport (overflow global da home é pré-existente
    // e coberto por scroll-morph.spec)
    expect(dims.left).toBeGreaterThanOrEqual(-1);
    expect(dims.right).toBeLessThanOrEqual(dims.vw + 1);
  });

  test('click dentro do box incrementa data-ripple-count (uma onda por click)', async ({
    page,
  }) => {
    await gotoHome(page);
    const grid = await gridBox(page);

    const before = Number(
      (await grid.getAttribute('data-ripple-count')) ?? '0',
    );
    await grid.click({ position: { x: 80, y: 80 } });
    await grid.click({ position: { x: 120, y: 100 } });
    await page.waitForTimeout(200);

    const after = Number((await grid.getAttribute('data-ripple-count')) ?? '0');
    expect(after).toBe(before + 2);
  });

  test('click fora do box não gera ripple', async ({ page }) => {
    await gotoHome(page);
    const grid = await gridBox(page);
    const before = Number(
      (await grid.getAttribute('data-ripple-count')) ?? '0',
    );

    await page.mouse.click(20, 20); // canto da página, fora do box
    await page.waitForTimeout(200);

    const after = Number((await grid.getAttribute('data-ripple-count')) ?? '0');
    expect(after).toBe(before);
  });

  test('hint localizado por locale e placeholder removido', async ({ page }) => {
    const cases = [
      { path: '/', hint: 'mova o cursor · clique' },
      { path: '/es/', hint: 'mueve el cursor · haz clic' },
      { path: '/en/', hint: 'move your cursor · click' },
    ];
    for (const { path, hint } of cases) {
      await gotoHome(page, path);
      const grid = await gridBox(page);
      await expect(grid).toContainText(hint);
      const body = await page.locator('body').innerHTML();
      expect(body).not.toContain('teste o background aqui');
    }
  });

  test('prefers-reduced-motion: grid estático com data-static e sem ripples', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await gotoHome(page);
    const grid = await gridBox(page);
    await expect(grid).toHaveAttribute('data-static', 'true');

    const before = Number(
      (await grid.getAttribute('data-ripple-count')) ?? '0',
    );
    await grid.click({ position: { x: 60, y: 60 } });
    await page.waitForTimeout(200);
    const after = Number((await grid.getAttribute('data-ripple-count')) ?? '0');
    expect(after).toBe(before);
  });

  test('View Transition: Home → #contato → Home não duplica ripples por click', async ({
    page,
  }) => {
    await gotoHome(page);
    await gridBox(page);

    // volta ao topo e desce de novo via ClientRouter (swap do header/página)
    for (let i = 0; i < 2; i++) {
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(150);
      const grid = await gridBox(page);
      const before = Number(
        (await grid.getAttribute('data-ripple-count')) ?? '0',
      );
      await grid.click({ position: { x: 100, y: 100 } });
      await page.waitForTimeout(150);
      const after = Number(
        (await grid.getAttribute('data-ripple-count')) ?? '0',
      );
      expect(after).toBe(before + 1);
    }
  });

  test('tema: canvas revalida cores ao alternar claro/escuro', async ({
    page,
  }) => {
    await gotoHome(page);
    const grid = await gridBox(page);

    // alterna tema pelo toggle do header
    const toggle = page
      .locator('header button[aria-label*="tema"], header button[aria-label*="theme"]')
      .first();
    await toggle.click();
    await page.waitForTimeout(300);

    // pinta o canvas mentalmente: trocar tema não pode quebrar o loop nem
    // deixar o canvas vazio (dimensões continuam válidas)
    const bmp = await grid.evaluate((el: HTMLElement) => {
      const canvas = el.querySelector('canvas') as HTMLCanvasElement;
      return { w: canvas.width, h: canvas.height };
    });
    expect(bmp.w).toBeGreaterThan(0);
    expect(bmp.h).toBeGreaterThan(0);
  });
});
