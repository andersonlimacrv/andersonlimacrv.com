import { test, expect, type Page } from '@playwright/test';

const MOBILE = { width: 390, height: 844 };

async function gotoHome(page: Page) {
  await page.goto('/', { waitUntil: 'networkidle' });
  await page
    .waitForFunction(() => document.fonts.status !== 'loading', undefined, {
      timeout: 15_000,
    })
    .catch(() => undefined);
}

test.describe('menu mobile (hambúrguer)', () => {
  test.use({ viewport: MOBILE });

  test('hambúrguer visível no mobile; nav e bloco ocultos por padrão', async ({
    page,
  }) => {
    await gotoHome(page);
    const toggle = page.locator('.site-menu-toggle');
    await expect(toggle).toBeVisible();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(toggle).toHaveAttribute('aria-label', 'Abrir menu');
    await expect(page.locator('.site-nav')).toBeHidden();
    await expect(page.locator('.site-menu')).toBeHidden();
  });

  test('abrir mostra os 4 links dentro da toolbox e atualiza aria', async ({
    page,
  }) => {
    await gotoHome(page);
    const toggle = page.locator('.site-menu-toggle');
    await toggle.click();

    await expect(page.locator('.site-header')).toHaveClass(/is-open/);
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(toggle).toHaveAttribute('aria-label', 'Fechar menu');

    const links = page.locator('.site-menu a');
    await expect(links).toHaveCount(4);
    for (let i = 0; i < 4; i++) {
      await expect(links.nth(i)).toBeVisible();
    }
    const headerBox = (await page.locator('.site-header').boundingBox())!;
    const firstLinkBox = (await links.first().boundingBox())!;
    const lastLinkBox = (await links.last().boundingBox())!;
    expect(firstLinkBox.y).toBeGreaterThan(headerBox.y);
    expect(lastLinkBox.y).toBeGreaterThan(firstLinkBox.y);
  });

  test('fechar pelo hambúrguer recolhe a toolbox', async ({ page }) => {
    await gotoHome(page);
    const toggle = page.locator('.site-menu-toggle');
    await toggle.click();
    await expect(page.locator('.site-header')).toHaveClass(/is-open/);

    await toggle.click();
    await expect(page.locator('.site-header')).not.toHaveClass(/is-open/);
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(toggle).toHaveAttribute('aria-label', 'Abrir menu');
    await expect(page.locator('.site-menu')).toBeHidden();
  });

  test('fechar por Escape, clique fora e seleção de link', async ({ page }) => {
    await gotoHome(page);
    const toggle = page.locator('.site-menu-toggle');

    await toggle.click();
    await page.keyboard.press('Escape');
    await expect(page.locator('.site-header')).not.toHaveClass(/is-open/);

    await toggle.click();
    await page.mouse.click(10, 500);
    await expect(page.locator('.site-header')).not.toHaveClass(/is-open/);

    await toggle.click();
    await page.locator('.site-menu a[href*="#sobre"]').click();
    await expect(page.locator('.site-header')).not.toHaveClass(/is-open/);
    expect(new URL(page.url()).hash).toBe('#sobre');
  });

  test('trocar idioma fecha o menu', async ({ page }) => {
    await gotoHome(page);
    const toggle = page.locator('.site-menu-toggle');
    await toggle.click();
    await expect(page.locator('.site-header')).toHaveClass(/is-open/);

    await page.locator('.site-locale-toggle').click();
    await page.locator('.site-locale-menu a', { hasText: 'ES' }).click();
    await page.waitForURL('**/es/**');
    await expect(page.locator('.site-header')).not.toHaveClass(/is-open/);
    await expect(page.locator('.site-menu-toggle')).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  });

  test('reduced-motion abre sem animação (estado direto)', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await gotoHome(page);
    const toggle = page.locator('.site-menu-toggle');
    await toggle.click();
    await expect(page.locator('.site-header')).toHaveClass(/is-open/);
    for (let i = 0; i < 4; i++) {
      await expect(page.locator('.site-menu a').nth(i)).toBeVisible();
    }
    await expect(page.locator('.site-menu a').first()).toHaveCSS('opacity', '1');
  });
});

test.describe('menu desktop', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test('hambúrguer oculto; nav inline visível', async ({ page }) => {
    await gotoHome(page);
    await expect(page.locator('.site-menu-toggle')).toBeHidden();
    await expect(page.locator('.site-nav')).toBeVisible();
    await expect(page.locator('.site-nav a')).toHaveCount(4);
  });
});