import { test, expect, type Page } from '@playwright/test';

async function gotoHome(page: Page, path = '/') {
  await page.goto(path, { waitUntil: 'networkidle' });
  await page
    .waitForFunction(() => document.fonts.status !== 'loading', undefined, {
      timeout: 15_000,
    })
    .catch(() => undefined);
}

async function projectsMenu(page: Page) {
  const menu = page.locator('#projects-flowing[data-flowing-menu]');
  await menu.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  return menu;
}

test.describe('projetos como flowing menu', () => {
  test('3 linhas com título, descrição e tags localizadas', async ({
    page,
  }) => {
    for (const path of ['/', '/es/', '/en/']) {
      await gotoHome(page, path);
      const menu = await projectsMenu(page);
      const items = menu.locator('[data-flowing-item]');
      expect(await items.count()).toBe(3);
      for (const item of await items.all()) {
        await expect(
          item.locator('.menu-link-label'),
        ).not.toBeEmpty();
        await expect(
          item.locator('.menu-link-desc'),
        ).not.toBeEmpty();
        expect(
          await item.locator('.menu-link-tags > span').count(),
        ).toBeGreaterThanOrEqual(1);
      }
    }
  });

  test('links externos com target blank e noopener', async ({ page }) => {
    await gotoHome(page);
    const menu = await projectsMenu(page);
    const links = menu.locator('.menu-link');
    expect(await links.count()).toBe(3);
    for (const link of await links.all()) {
      await expect(link).toHaveAttribute('target', '_blank');
      const rel = (await link.getAttribute('rel')) ?? '';
      expect(rel).toContain('noopener');
    }
  });

  test('hover abre o marquee com imagem lazy', async ({ page }) => {
    await gotoHome(page);
    const menu = await projectsMenu(page);
    const item = menu.locator('[data-flowing-item]').first();
    await menu.locator('.menu-link').first().hover();
    await expect(item).toHaveClass(/is-open/, { timeout: 2_000 });
    const img = item.locator('.marquee-media');
    expect(await img.count()).toBeGreaterThanOrEqual(4);
    await expect(img.first()).toHaveAttribute('loading', 'lazy');
  });

  test('marquee com 1 imagem 16:9 e raio do DS', async ({ page }) => {
    await gotoHome(page);
    const menu = await projectsMenu(page);
    const img = menu.locator('.marquee-part').first().locator('img.marquee-media');
    expect(await img.count()).toBe(1);
    const box = (await img.first().boundingBox())!;
    // 16:9 com tolerância de 2px
    expect(Math.abs(box.width - (box.height * 16) / 9)).toBeLessThanOrEqual(2);
    const radius = await img.first().evaluate(
      (el: HTMLElement) => window.getComputedStyle(el).borderRadius,
    );
    expect(radius).toBe('4px');
  });

  test('prefers-reduced-motion: info completa, sem marquee', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await gotoHome(page);
    const menu = await projectsMenu(page);
    await expect(menu.locator('.menu-link-desc').first()).toBeVisible();
    await expect(menu.locator('.marquee').first()).toBeHidden();
  });

  test('sem overflow horizontal no mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoHome(page);
    const menu = await projectsMenu(page);
    const box = await menu.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.x).toBeGreaterThanOrEqual(-1);
    expect(box!.x + box!.width).toBeLessThanOrEqual(390 + 1);
  });

  test('tags à direita no desktop', async ({ page }) => {
    await gotoHome(page);
    const menu = await projectsMenu(page);
    const item = menu.locator('[data-flowing-item]').first();
    const itemBox = (await item.boundingBox())!;
    const textBox = (await item.locator('.menu-link-text').boundingBox())!;
    const tagsBox = (await item.locator('.menu-link-tags').boundingBox())!;
    // tags à direita do bloco de texto, centralizadas verticalmente na linha
    expect(tagsBox.x).toBeGreaterThan(textBox.x);
    const itemCY = itemBox.y + itemBox.height / 2;
    const tagsCY = tagsBox.y + tagsBox.height / 2;
    expect(Math.abs(tagsCY - itemCY)).toBeLessThan(itemBox.height * 0.3);
  });

  test('tags centralizadas abaixo do texto no mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoHome(page);
    const menu = await projectsMenu(page);
    const item = menu.locator('[data-flowing-item]').first();
    const itemBox = (await item.boundingBox())!;
    const descBox = (await item.locator('.menu-link-desc').boundingBox())!;
    const tagsBox = (await item.locator('.menu-link-tags').boundingBox())!;
    // tags abaixo da descrição e centralizadas na linha
    expect(tagsBox.y).toBeGreaterThanOrEqual(descBox.y + descBox.height - 1);
    const itemCX = itemBox.x + itemBox.width / 2;
    const tagsCX = tagsBox.x + tagsBox.width / 2;
    expect(Math.abs(tagsCX - itemCX)).toBeLessThanOrEqual(24);
    // sem mira no mobile
    await expect(item.locator('[data-target-simbol]')).toBeHidden();
  });

  test('mira à direita gira no hover (affordance de link)', async ({
    page,
  }) => {
    await gotoHome(page);
    const menu = await projectsMenu(page);
    const item = menu.locator('[data-flowing-item]').first();
    const link = item.locator('.menu-link');
    await link.scrollIntoViewIfNeeded();
    const simbol = item.locator('[data-target-simbol]');
    await expect(simbol).toBeVisible();
    // mira na metade direita da linha
    const itemBox = (await item.boundingBox())!;
    const simBox = (await simbol.boundingBox())!;
    expect(simBox.x + simBox.width).toBeLessThanOrEqual(
      itemBox.x + itemBox.width + 1,
    );
    expect(simBox.x).toBeGreaterThan(itemBox.x + itemBox.width / 2);
    // spin de entrada na viewport aconteceu
    await expect
      .poll(
        async () =>
          Number((await simbol.getAttribute('data-spins')) ?? '0'),
        { timeout: 5_000 },
      )
      .toBeGreaterThanOrEqual(1);
    // aguarda o spin terminar (1.6s) para o hover não ser ignorado
    await page.waitForTimeout(1_800);
    const before = Number((await simbol.getAttribute('data-spins')) ?? '0');
    await link.hover();
    await expect
      .poll(
        async () =>
          Number((await simbol.getAttribute('data-spins')) ?? '0'),
        { timeout: 5_000 },
      )
      .toBeGreaterThan(before);
  });
});
