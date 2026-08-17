import { test, expect, type Page } from '@playwright/test';

const LOCALES = [
  { path: '/', lang: 'pt' },
  { path: '/es/', lang: 'es' },
  { path: '/en/', lang: 'en' },
] as const;

const TOLERANCE_PX = 2;

async function gotoHome(page: Page, path: string) {
  await page.goto(path, { waitUntil: 'networkidle' });
  await page
    .waitForFunction(() => document.fonts.status !== 'loading', undefined, {
      timeout: 15_000,
    })
    .catch(() => undefined);
}

test.describe('estabilidade entre idiomas', () => {
  test('largura da pílula e dos links de nav é idêntica nas 3 línguas', async ({
    page,
  }) => {
    const widths: Record<string, { toolbar: number; links: number[] }> = {};

    for (const { path, lang } of LOCALES) {
      await gotoHome(page, path);
      const toolbar = page.locator('.site-toolbar');
      await expect(toolbar).toBeVisible();
      const toolbarBox = await toolbar.boundingBox();
      const linkBoxes = await page
        .locator('.site-toolbar nav a')
        .evaluateAll((els) =>
          els.map((el) => {
            const b = el.getBoundingClientRect();
            return b.width;
          }),
        );
      expect(toolbarBox).not.toBeNull();
      expect(linkBoxes).toHaveLength(4);
      widths[lang] = { toolbar: toolbarBox!.width, links: linkBoxes };
    }

    const ref = widths[LOCALES[0].lang];
    for (const { lang } of LOCALES) {
      expect(Math.abs(widths[lang].toolbar - ref.toolbar)).toBeLessThanOrEqual(
        TOLERANCE_PX,
      );
      for (let i = 0; i < 4; i++) {
        expect(Math.abs(widths[lang].links[i] - ref.links[i])).toBeLessThanOrEqual(
          TOLERANCE_PX,
        );
      }
    }
  });

  test('trocar idioma pelo select mantém a largura da pílula', async ({
    page,
  }) => {
    await gotoHome(page, '/');
    const toolbar = page.locator('.site-toolbar');
    const before = (await toolbar.boundingBox())!.width;

    await page.locator('.site-locale-select').selectOption({ label: 'EN' });
    await page.waitForURL('**/en/**');
    await page.evaluate(() => document.fonts.ready);
    const after = (await toolbar.boundingBox())!.width;

    expect(Math.abs(after - before)).toBeLessThanOrEqual(TOLERANCE_PX);
  });

  test('hero é exibido sem animação de entrada (inclusive após troca de idioma)', async ({
    page,
  }) => {
    for (const { path } of LOCALES) {
      await gotoHome(page, path);
      const hero = page.locator('section#hero').first();
      await expect(hero).toBeVisible();

      for (const selector of ['h1.hero-name', 'p.mt-6', 'figure']) {
        const animation = await page
          .locator(`${selector}`)
          .first()
          .evaluate((el) => getComputedStyle(el).animationName);
        expect(animation, `sem animação em ${selector} (${path})`).toBe('none');
      }
      const opacity = await hero
        .locator('h1.hero-name')
        .evaluate((el) => getComputedStyle(el).opacity);
      expect(opacity).toBe('1');
    }

    await page.locator('.site-locale-select').selectOption({ label: 'ES' });
    await page.waitForURL('**/es/**');
    const animAfter = await page
      .locator('h1.hero-name')
      .evaluate((el) => getComputedStyle(el).animationName);
    expect(animAfter).toBe('none');
  });

  test('não existe resquício do sistema hero-entrance', async ({ page }) => {
    await gotoHome(page, '/');
    const count = await page.evaluate(() =>
      document.querySelectorAll('.hero-entrance').length,
    );
    expect(count).toBe(0);
  });
});

test.describe('conteúdo do blog', () => {
  test('landing mostra os últimos 3 posts e /blog lista posts nas 3 línguas', async ({
    page,
  }) => {
    const blogByLocale = {
      pt: '/blog',
      es: '/es/blog',
      en: '/en/blog',
    } as const;

    for (const { path, lang } of LOCALES) {
      await gotoHome(page, path);
      const section = page.locator('#blog');
      await expect(section).toBeVisible();
      const cards = section.locator('a[href*="/blog/"]');
      expect(await cards.count()).toBe(3);

      await gotoHome(page, blogByLocale[lang]);
      await expect(page.locator('h1')).toBeVisible();
      const listCards = page.locator('a[href*="/blog/"]');
      expect(await listCards.count()).toBeGreaterThanOrEqual(3);
    }
  });

  test('página de post carrega em pt e en', async ({ page }) => {
    await gotoHome(page, '/blog/design-editorial-para-web');
    await expect(page.locator('h1').first()).toBeVisible();

    await page.goto('/en/blog/editorial-design-for-the-web', {
      waitUntil: 'networkidle',
    });
    await expect(page.locator('h1').first()).toBeVisible();
  });
});

test.describe('screenshots por idioma', () => {
  for (const { path, lang } of LOCALES) {
    test(`screenshot da home (${lang})`, async ({ page }) => {
      await gotoHome(page, path);
      await page.screenshot({
        path: `e2e/screenshots/home-${lang}.png`,
        fullPage: true,
      });
    });
  }
});