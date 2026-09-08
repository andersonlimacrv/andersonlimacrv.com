import { test, expect, type Page } from '@playwright/test';

async function gotoHome(page: Page, path = '/') {
  await page.goto(path, { waitUntil: 'networkidle' });
  await page
    .waitForFunction(() => document.fonts.status !== 'loading', undefined, {
      timeout: 15_000,
    })
    .catch(() => undefined);
}

test.describe('fonte única de dados', () => {
  test('e-mail canônico consistente no DOM; sem e-mail gmail', async ({
    page,
  }) => {
    await gotoHome(page);
    const mailto = page.locator('a[href^="mailto:"]');
    const count = await mailto.count();
    expect(count).toBeGreaterThanOrEqual(1);
    const body = await page.locator('body').innerText();
    expect(body.toLowerCase()).toContain('contato@andersonlimacrv.com');
    expect(body.toLowerCase()).not.toContain('andersonlimacrv@gmail.com');
    for (let i = 0; i < count; i++) {
      await expect(mailto.nth(i)).toHaveAttribute(
        'href',
        'mailto:contato@andersonlimacrv.com',
      );
    }
  });

  test('nome do autor consistente entre hero, footer e JSON-LD', async ({
    page,
  }) => {
    await gotoHome(page);
    await expect(page.locator('h1.hero-name')).toHaveText('Anderson Carvalho');
    await expect(page.getByRole('contentinfo')).toContainText('Anderson Carvalho');

    const jsonLd = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents();
    const schemas = jsonLd.map((s) => JSON.parse(s));
    const person = schemas.find((s) => s['@type'] === 'Person');
    const website = schemas.find((s) => s['@type'] === 'WebSite');
    expect(person?.name).toBe('Anderson Carvalho');
    expect(website?.name).toBe('Anderson Carvalho');
  });

  test('hero eyebrow composto: label traduzido + ano da fonte', async ({
    page,
  }) => {
    await gotoHome(page, '/es/');
    const eyebrow = page.locator('section#hero p').first();
    await expect(eyebrow).toContainText('Perfil');
    await expect(eyebrow).toContainText('2026');
    // composição via label2 + Sep (ponto médio unificado)
    await expect(eyebrow.locator('span[aria-hidden="true"]')).toHaveCount(1);
  });
});

test.describe('navegação por âncora', () => {
  test('trocar idioma preserva o fragmento #contato', async ({ page }) => {
    await gotoHome(page, '/es/#contato');
    await expect(page).toHaveURL(/#contato$/);

    await page.locator('.site-locale-toggle').click();
    await page.locator('.site-locale-menu a', { hasText: 'PT' }).click();
    await page.waitForURL('**/#contato');
    expect(new URL(page.url()).hash).toBe('#contato');
  });

  test('clique em âncora na mesma página rola sem navegação', async ({
    page,
  }) => {
    await gotoHome(page, '/');
    const contato = page.locator('#contato');
    await contato.scrollIntoViewIfNeeded();

    // Volta ao topo e clica na âncora do nav.
    await page.evaluate(() => window.scrollTo(0, 0));
    const navContact = page.locator('.site-nav a[href*="#contato"]').first();
    await navContact.click();

    await expect(page).toHaveURL(/#contato$/);
    await expect(contato).toBeInViewport();
  });
});