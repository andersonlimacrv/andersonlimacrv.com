import { test, expect, type Page } from '@playwright/test';

const LOCALES = [
  { path: '/', projects: '/#projetos', contact: '/#contato', ctaProjects: 'Ver projetos', ctaContact: 'Fale comigo' },
  { path: '/es/', projects: '/es/#projetos', contact: '/es/#contato', ctaProjects: 'Ver proyectos', ctaContact: 'Contáctame' },
  { path: '/en/', projects: '/en/#projetos', contact: '/en/#contato', ctaProjects: 'View projects', ctaContact: 'Get in touch' },
] as const;

async function gotoHome(page: Page, path: string) {
  await page.goto(path, { waitUntil: 'networkidle' });
  await page
    .waitForFunction(() => document.fonts.status !== 'loading', undefined, {
      timeout: 15_000,
    })
    .catch(() => undefined);
  await page.waitForTimeout(150);
}

test.describe('hero CTAs', () => {
  test('dois CTAs com hrefs e textos localizados (3 línguas)', async ({
    page,
  }) => {
    for (const { path, projects, contact, ctaProjects, ctaContact } of LOCALES) {
      await gotoHome(page, path);
      const hero = page.locator('#hero');
      const primary = hero.getByRole('link', { name: ctaProjects });
      const secondary = hero.getByRole('link', { name: ctaContact });
      await expect(primary).toBeVisible();
      await expect(secondary).toBeVisible();
      await expect(primary).toHaveAttribute('href', projects);
      await expect(secondary).toHaveAttribute('href', contact);
      for (const cta of [primary, secondary]) {
        await expect(cta).toHaveClass(/cursor-target/);
        const box = await cta.boundingBox();
        expect(box!.height).toBeGreaterThanOrEqual(44);
      }
    }
  });

  test('CTA preenchido tem TargetHover no desktop', async ({ page }) => {
    await gotoHome(page, '/');
    const primary = page.locator('#hero').getByRole('link', { name: 'Ver projetos' });
    await expect(primary).toHaveClass(/cursor-target-filled/);
    await expect(primary.locator('.target-hover-corner')).toHaveCount(4);
    await primary.scrollIntoViewIfNeeded();
    await primary.hover();
    await expect(primary).toHaveClass(/is-target-hovering/, { timeout: 2000 });
  });

  test('CTAs com larguras iguais preenchendo a linha no desktop', async ({
    page,
  }) => {
    await gotoHome(page, '/');
    const hero = page.locator('#hero');
    const primary = hero.getByRole('link', { name: 'Ver projetos' });
    const secondary = hero.getByRole('link', { name: 'Fale comigo' });
    const pw = (await primary.boundingBox())!.width;
    const sw = (await secondary.boundingBox())!.width;
    expect(Math.abs(pw - sw)).toBeLessThanOrEqual(1);
  });

  test('CTA secundário com contraste foreground nos dois temas', async ({
    page,
  }) => {
    for (const theme of ['light', 'dark'] as const) {
      await page.emulateMedia({ colorScheme: theme });
      await gotoHome(page, '/');
      const hero = page.locator('#hero');
      const secondary = hero.getByRole('link', { name: 'Fale comigo' });
      const title = hero.locator('#hero-title');
      const color = (el: typeof secondary) =>
        el.evaluate((e: HTMLElement) => window.getComputedStyle(e).color);
      // mesma cor do título = token foreground (escuro no claro, claro no escuro)
      expect(await color(secondary)).toBe(await color(title));
    }
  });

  test('CTA ancora navega até a seção sem trocar de página', async ({
    page,
  }) => {
    await gotoHome(page, '/');
    await page.locator('#hero').getByRole('link', { name: 'Ver projetos' }).click();
    await expect(page).toHaveURL(/#projetos$/);
    await expect(page.locator('#projetos')).toBeInViewport();
  });
});
