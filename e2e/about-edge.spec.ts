import { test, expect, type Page } from '@playwright/test';

async function gotoHome(page: Page, path = '/') {
  await page.goto(path, { waitUntil: 'networkidle' });
  await page
    .waitForFunction(() => document.fonts.status !== 'loading', undefined, {
      timeout: 15_000,
    })
    .catch(() => undefined);
}

async function sobre(page: Page) {
  const section = page.locator('#sobre-content');
  await section.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  return section;
}

test.describe('about edge reveal', () => {
  test('sociais voltaram ao original: sem reveal, com TargetHover', async ({
    page,
  }) => {
    await gotoHome(page);
    const section = await sobre(page);
    const links = section.locator('nav a.cursor-target');
    expect(await links.count()).toBe(5);
    expect(
      await section.locator('nav a[data-edge-reveal]').count(),
    ).toBe(0);
    expect(
      await section.locator('nav [data-reveal-layer]').count(),
    ).toBe(0);
    const link = links.first();
    await expect(link.locator('.target-hover-corner')).toHaveCount(4);
  });

  test('fileiras da trajetória revelam no hover, sem tabindex', async ({
    page,
  }) => {
    await gotoHome(page);
    await sobre(page);
    const rows = page.locator('[data-col="trajetoria"] li[data-edge-reveal]');
    expect(await rows.count()).toBeGreaterThanOrEqual(2);
    for (const row of await rows.all()) {
      expect(await row.getAttribute('tabindex')).toBeNull();
    }
    const row = rows.first();
    await row.hover();
    await expect(row).toHaveClass(/is-open/, { timeout: 2_000 });
    const rowBox = (await row.boundingBox())!;
    const layerBox = (await row
      .locator('[data-reveal-layer]')
      .boundingBox())!;
    expect(Math.abs(layerBox.width - rowBox.width)).toBeLessThanOrEqual(3);
  });

  test('prefers-reduced-motion: fileira abre instantânea, sem slide', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await gotoHome(page);
    await sobre(page);
    const row = page
      .locator('[data-col="trajetoria"] li[data-edge-reveal]')
      .first();
    await row.hover();
    await expect(row).toHaveClass(/is-open/, { timeout: 2_000 });
  });

  test('fileiras do perfil com divisória revelam no hover', async ({
    page,
  }) => {
    await gotoHome(page);
    await sobre(page);
    const rows = page.locator('[data-col="dados"] div[data-profile-row]');
    expect(await rows.count()).toBeGreaterThanOrEqual(5);
    for (const row of await rows.all()) {
      expect(await row.getAttribute('tabindex')).toBeNull();
    }
    const row = rows.first();
    await row.hover();
    await expect(row).toHaveClass(/is-open/, { timeout: 2_000 });
    const borders = await rows.evaluateAll((els) =>
      els.map((el) => window.getComputedStyle(el).borderBottomWidth),
    );
    for (const b of borders.slice(0, -1)) expect(b).not.toBe('0px');
    expect(borders[borders.length - 1]).toBe('0px');
  });

  test('estrutura clean: sem divisórias estruturais no Sobre', async ({
    page,
  }) => {
    await gotoHome(page);
    await sobre(page);
    const header = page.locator('#sobre-content > header').first();
    await expect(header).toHaveCSS('border-bottom-width', '0px');
    const dados = page.locator('#sobre-content section[data-col="dados"]');
    await expect(dados).toHaveCSS('border-left-width', '0px');
    const trajetoria = page.locator(
      '#sobre-content section[data-col="trajetoria"]',
    );
    await expect(trajetoria).toHaveCSS('border-top-width', '0px');
  });

  test('mobile mantém divisor entre colunas empilhadas', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoHome(page);
    await sobre(page);
    const perfil = page.locator('#sobre-content section[data-col="perfil"]');
    const bottom = await perfil.evaluate(
      (el: HTMLElement) => window.getComputedStyle(el).borderBottomWidth,
    );
    expect(bottom).not.toBe('0px');
  });

  test('perfil padronizado: valores na cor da trajetória', async ({
    page,
  }) => {
    for (const path of ['/', '/es/', '/en/']) {
      await gotoHome(page, path);
      await sobre(page);
      const value = page
        .locator('[data-col="dados"] div[data-profile-row] p')
        .first();
      const role = page
        .locator('[data-col="trajetoria"] li span.text-foreground')
        .first();
      const color = (loc: typeof value) =>
        loc.evaluate((el: HTMLElement) => window.getComputedStyle(el).color);
      expect(await color(value)).toBe(await color(role));
    }
  });

  test('labels do perfil na mesma cor dos subtítulos (light+dark)', async ({
    page,
  }) => {
    for (const theme of ['light', 'dark'] as const) {
      await page.emulateMedia({ colorScheme: theme });
      await gotoHome(page);
      await sobre(page);
      const color = (sel: string) =>
        page
          .locator(sel)
          .first()
          .evaluate(
            (el: HTMLElement) => window.getComputedStyle(el).color,
          );
      expect(
        await color('[data-col="dados"] div[data-profile-row] > span'),
      ).toBe(await color('#sobre-content footer > span'));
    }
  });

  test('fileiras com respiro lateral de 16px (desktop+mobile)', async ({
    page,
  }) => {
    for (const width of [1280, 390]) {
      await page.setViewportSize({ width, height: 844 });
      await gotoHome(page);
      await sobre(page);
      for (const sel of [
        '[data-col="dados"] div[data-profile-row]',
        '[data-col="trajetoria"] li[data-edge-reveal]',
      ]) {
        const row = page.locator(sel).first();
        await expect(row).toHaveCSS('padding-left', '16px');
        await expect(row).toHaveCSS('padding-right', '16px');
      }
    }
  });

  test('3 locales: sociais sem reveal e fileiras com reveal', async ({
    page,
  }) => {
    for (const path of ['/', '/es/', '/en/']) {
      await gotoHome(page, path);
      await sobre(page);
      expect(
        await page.locator('#sobre-content nav a.cursor-target').count(),
      ).toBe(5);
      expect(
        await page.locator('#sobre-content nav a[data-edge-reveal]').count(),
      ).toBe(0);
      expect(
        await page
          .locator('[data-col="trajetoria"] li[data-edge-reveal]')
          .count(),
      ).toBeGreaterThanOrEqual(2);
      expect(
        await page
          .locator('[data-col="dados"] div[data-profile-row]')
          .count(),
      ).toBeGreaterThanOrEqual(5);
    }
  });
});
