import { test, expect, type Page } from '@playwright/test';

const LABELS: Record<string, { toDark: string; toLight: string }> = {
  pt: { toDark: 'Ativar tema escuro', toLight: 'Ativar tema claro' },
  es: { toDark: 'Activar tema oscuro', toLight: 'Activar tema claro' },
  en: { toDark: 'Switch to dark theme', toLight: 'Switch to light theme' },
};

async function gotoHome(page: Page, path = '/') {
  await page.goto(path, { waitUntil: 'networkidle' });
  await page
    .waitForFunction(() => document.fonts.status !== 'loading', undefined, {
      timeout: 15_000,
    })
    .catch(() => undefined);
}

test.describe('theme toggle', () => {
  test('navegar por view transition preserva tema e mantém o toggle no header', async ({
    page,
  }) => {
    await gotoHome(page, '/');
    await page.evaluate(() => localStorage.setItem('theme', 'dark'));
    await page.reload({ waitUntil: 'networkidle' });
    await expect(page.locator('html')).toHaveClass(/dark/);

    const toggle = page.locator('.theme-toggle');
    await expect(toggle).toBeVisible();
    const boxBefore = (await toggle.boundingBox())!;
    expect(boxBefore.x).toBeGreaterThan(0);

    await page.locator('a[href*="/blog/"]').first().click();
    await page.waitForURL('**/blog/**');
    await page.waitForTimeout(600);

    await expect(page.locator('html')).toHaveClass(/dark/);
    const boxAfter = (await toggle.boundingBox())!;
    expect(boxAfter.x).toBeGreaterThan(0);
    expect(Math.abs(boxAfter.y - boxBefore.y)).toBeLessThan(2);
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  });

  test('navegar para /blog e alternar tema não duplica listeners', async ({
    page,
  }) => {
    await gotoHome(page, '/');
    await page.goto('/blog', { waitUntil: 'networkidle' });
    await page.waitForFunction(() => document.fonts.status !== 'loading', undefined, {
      timeout: 15_000,
    }).catch(() => undefined);

    await page.evaluate(() => localStorage.setItem('theme', 'light'));
    await page.reload({ waitUntil: 'networkidle' });

    const toggle = page.locator('.theme-toggle');
    await toggle.click();
    await expect(page.locator('html')).toHaveClass(/dark/);
    await toggle.click();
    await expect(page.locator('html')).not.toHaveClass(/dark/);
    await toggle.click();
    await expect(page.locator('html')).toHaveClass(/dark/);
    expect(
      await page.evaluate(() => localStorage.getItem('theme')),
    ).toBe('dark');
  });

  test('toggle aplica .dark no <html> e persiste em localStorage', async ({
    page,
  }) => {
    await gotoHome(page);
    const toggle = page.locator('.theme-toggle');
    await expect(toggle).toBeVisible();

    await expect(page.locator('html')).not.toHaveClass(/dark/);
    await toggle.click();
    await expect(page.locator('html')).toHaveClass(/dark/);
    expect(
      await page.evaluate(() => localStorage.getItem('theme')),
    ).toBe('dark');
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');

    await toggle.click();
    await expect(page.locator('html')).not.toHaveClass(/dark/);
    expect(
      await page.evaluate(() => localStorage.getItem('theme')),
    ).toBe('light');
    await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  });

  test('tema persiste após recarregar a página', async ({ page }) => {
    await gotoHome(page);
    await page.locator('.theme-toggle').click();
    await expect(page.locator('html')).toHaveClass(/dark/);

    await page.reload({ waitUntil: 'networkidle' });
    await expect(page.locator('html')).toHaveClass(/dark/);
  });

  test('aria-label é localizado e acompanha o estado', async ({ page }) => {
    for (const { path, lang } of [
      { path: '/', lang: 'pt' },
      { path: '/es/', lang: 'es' },
      { path: '/en/', lang: 'en' },
    ]) {
      await page.addInitScript(() => {
        localStorage.setItem('theme', 'light');
        document.documentElement.classList.remove('dark');
      });
      await gotoHome(page, path);
      const toggle = page.locator('.theme-toggle');
      const { toDark, toLight } = LABELS[lang];

      await expect(toggle).toHaveAttribute('aria-label', toDark);
      await toggle.click();
      await expect(toggle).toHaveAttribute('aria-label', toLight);
    }
  });

  test('funciona com prefers-reduced-motion (sem view transition)', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await gotoHome(page);
    await page.locator('.theme-toggle').click();
    await expect(page.locator('html')).toHaveClass(/dark/);
    expect(
      await page.evaluate(() => localStorage.getItem('theme')),
    ).toBe('dark');
  });

  test('trocar idioma mantém o estado do tema', async ({ page }) => {
    await gotoHome(page, '/');
    await page.locator('.theme-toggle').click();
    await expect(page.locator('html')).toHaveClass(/dark/);

    await page.locator('.site-locale-select').selectOption({ label: 'EN' });
    await page.waitForURL('**/en/**');
    await expect(page.locator('html')).toHaveClass(/dark/);
    await expect(page.locator('.theme-toggle')).toHaveAttribute(
      'aria-label',
      LABELS.en.toLight,
    );
  });
});
