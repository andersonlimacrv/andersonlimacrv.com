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

  test('sem resquício do placeholder e grid presente no SectionHeading', async ({
    page,
  }) => {
    for (const path of ['/', '/es/', '/en/']) {
      await gotoHome(page, path);
      const body = await page.locator('body').innerHTML();
      expect(body).not.toContain('teste o background aqui');
      // o KineticGrid agora vive no SectionHeading (cada seção numerada)
      const grids = page.locator('[data-kinetic-grid]');
      expect(await grids.count()).toBeGreaterThanOrEqual(1);
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

  test('tema: grid repintado com as novas cores ao alternar claro/escuro (mesmo idle)', async ({
    page,
  }) => {
    await gotoHome(page);
    const grid = await gridBox(page);

    // idle (mouse fora do box): o loop pula o draw — o repaint no toggle
    // precisa vir do MutationObserver de tema.
    await page.waitForTimeout(500);

    const sample = () =>
      grid.evaluate((el: HTMLElement) => {
        const canvas = el.querySelector('canvas') as HTMLCanvasElement;
        const ctx = canvas.getContext('2d')!;
        const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let visible = 0;
        let sum = 0;
        for (let i = 3; i < data.length; i += 4) {
          if (data[i] > 10) {
            visible++;
            sum += data[i - 3] + data[i - 2] + data[i - 1];
          }
        }
        return { visible, sum };
      });

    const before = await sample();
    expect(before.visible).toBeGreaterThan(500); // grid presente

    await page.locator('button.theme-toggle').first().click();
    await page.waitForTimeout(300);

    const after = await sample();
    expect(after.visible).toBeGreaterThan(500); // grid continua visível
    expect(after.sum).not.toBe(before.sum); // ...e repintado com novas cores
  });
});
