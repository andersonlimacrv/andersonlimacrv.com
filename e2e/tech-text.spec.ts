import { test, expect, type Page } from '@playwright/test';

async function gotoHome(page: Page, path = '/') {
  await page.goto(path, { waitUntil: 'networkidle' });
  await page
    .waitForFunction(() => document.fonts.status !== 'loading', undefined, {
      timeout: 15_000,
    })
    .catch(() => undefined);
}

test.describe('tech-text — nome do hero em canvas', () => {
  test('canvas renderiza com tamanho real nas 3 línguas (nome em 2 linhas, 1 instância)', async ({ page }) => {
    for (const path of ['/', '/es/', '/en/']) {
      await gotoHome(page, path);
      const boxes = page.locator('#hero-title [data-tech-text]');
      await expect(boxes).toHaveCount(1);
      const box = boxes.first();
      await expect(box).toBeVisible();
      await expect
        .poll(
          async () =>
            box.evaluate((el) => {
              const c = el.querySelector('canvas');
              return c ? c.width > 10 && c.height > 10 : false;
            }),
          { timeout: 10_000 },
        )
        .toBe(true);
    }
  });

  test('h1 mantém semântica: sr-only + canvas oculto de AT', async ({
    page,
  }) => {
    await gotoHome(page, '/');
    const h1 = page.locator('h1#hero-title');
    await expect(h1.locator('span.sr-only')).toContainText(
      'Anderson Carvalho',
    );
    await expect(h1.locator('[data-tech-text]').first()).toHaveAttribute(
      'aria-hidden',
      'true',
    );
    await expect(h1.locator('[data-tech-text] canvas').first()).toHaveAttribute(
      'aria-hidden',
      'true',
    );
  });

  test('hover no nome ativa a mira (cursor grab sobre glifo)', async ({
    page,
  }) => {
    await gotoHome(page, '/');
    const box = page.locator('#hero-title [data-tech-text]').first();
    const bb = (await box.boundingBox())!;
    await page.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2);
    await expect
      .poll(
        async () =>
          box.evaluate((el: HTMLElement) => el.style.cursor),
        { timeout: 10_000 },
      )
      .toBe('grab');
  });

  test('drag: overlay segue o cursor com tracking rígido e some ao soltar', async ({
    page,
  }) => {
    await gotoHome(page, '/');
    const box = page.locator('#hero-title [data-tech-text]').first();
    const bb = (await box.boundingBox())!;
    const sx = bb.x + bb.width * 0.4;
    const sy = bb.y + bb.height * 0.3;
    const centroid = () =>
      page.evaluate(() => {
        const ov = document.querySelector('canvas.tech-text-overlay');
        if (!ov) return null;
        const g = ov.getContext('2d');
        const d = g.getImageData(0, 0, ov.width, ov.height).data;
        let px = 0,
          py = 0,
          n = 0;
        for (let y = 0; y < ov.height; y += 4) {
          for (let x = 0; x < ov.width; x += 4) {
            const i = (y * ov.width + x) * 4;
            if (d[i + 3] > 10 && d[i] < 150 && d[i + 1] < 150 && d[i + 2] < 150) {
              px += x;
              py += y;
              n++;
            }
          }
        }
        return n ? { x: px / n, y: py / n } : null;
      });
    await page.mouse.move(sx, sy);
    await page.mouse.down();
    await expect
      .poll(
        async () =>
          box.evaluate((el: HTMLElement) => el.style.cursor),
        { timeout: 10_000 },
      )
      .toBe('grabbing');
    const c0 = await centroid();
    await page.mouse.move(sx + 80, sy + 50, { steps: 6 });
    await page.waitForTimeout(400);
    const c1 = await centroid();
    expect(c0 && c1).toBeTruthy();
    const drift = Math.hypot(c1!.x - c0!.x - 80, c1!.y - c0!.y - 50);
    expect(drift).toBeLessThan(30);
    await page.mouse.up();
    await expect
      .poll(
        async () =>
          page.evaluate(
            () => document.querySelectorAll('canvas.tech-text-overlay').length,
          ),
        { timeout: 10_000 },
      )
      .toBe(1);
    const cleared = await page.evaluate(() => {
      const ov = document.querySelector('canvas.tech-text-overlay');
      if (!ov) return true;
      const g = ov.getContext('2d');
      const d = g.getImageData(0, 0, ov.width, ov.height).data;
      for (let i = 3; i < d.length; i += 4) if (d[i] > 10) return false;
      return true;
    });
    expect(cleared).toBe(true);
  });

  test('reduced-motion: canvas estático sem erro', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await gotoHome(page, '/');
    const box = page.locator('#hero-title [data-tech-text]').first();
    await expect(box).toBeVisible();
    await expect
      .poll(
        async () =>
          box.evaluate((el) => {
            const c = el.querySelector('canvas');
            return c ? c.width > 10 : false;
          }),
        { timeout: 10_000 },
      )
      .toBe(true);
  });
});
