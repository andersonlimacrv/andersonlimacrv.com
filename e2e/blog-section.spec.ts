import { test, expect, type Page } from '@playwright/test';

const LOCALES = [
  { path: '/', lang: 'pt' },
  { path: '/es/', lang: 'es' },
  { path: '/en/', lang: 'en' },
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

test.describe('seção Blog com SectionHeading numerado', () => {
  test('heading numerado 03 com KineticGrid, eyebrow acima do número e título [Blog] (3 línguas)', async ({
    page,
  }) => {
    for (const { path } of LOCALES) {
      await gotoHome(page, path);
      const section = page.locator('#blog');
      await expect(section).toBeVisible();
      await expect(section).toHaveAttribute(
        'aria-labelledby',
        'blog-title',
      );
      const grid = section.locator('[data-kinetic-grid]').first();
      await expect(grid).toBeVisible();

      const number = section.locator('span.font-mono', { hasText: /^0?3$/ }).first();
      await expect(number).toBeVisible();

      const h2 = section.locator('#blog-title');
      await expect(h2).toHaveText(/^\[.+\]$/);

      const eyebrow = section.locator('p.w-full.text-center');
      await expect(eyebrow).toBeVisible();

      // eyebrow empilhado acima do número: top do eyebrow < top do número
      const stacked = await page.evaluate(() => {
        const p = document.querySelector('#blog p.w-full');
        const num = document.querySelector('#blog span.font-mono');
        if (!p || !num) return null;
        const pTop = p.getBoundingClientRect().top;
        const numTop = num.getBoundingClientRect().top;
        // mesma largura da palavra: largura do p ≈ largura do box do número
        const pW = p.getBoundingClientRect().width;
        const numW = num.getBoundingClientRect().width;
        return { pTop, numTop, pW, numW };
      });
      expect(stacked).not.toBeNull();
      expect(stacked!.pTop).toBeLessThan(stacked!.numTop);
      expect(Math.abs(stacked!.pW - stacked!.numW)).toBeLessThanOrEqual(3);
    }
  });

  test('vitrine com 3 posts e link "ver todos" no canto inferior esquerdo (3 línguas)', async ({
    page,
  }) => {
    for (const { path } of LOCALES) {
      await gotoHome(page, path);
      const section = page.locator('#blog');

      const postLinks = section.locator('a[href*="/blog/"]:not([href$="/blog"])');
      expect(await postLinks.count()).toBe(3);

      const viewAll = section.locator('a.cursor-target[href$="/blog"]');
      expect(await viewAll.count()).toBe(1);
      const box = (await viewAll.boundingBox())!;
      expect(box.height).toBeGreaterThanOrEqual(44);

      // posicionamento: abaixo da última linha de post, alinhado à esquerda
      const position = await page.evaluate(() => {
        const section = document.getElementById('blog')!;
        const link = section.querySelector<HTMLAnchorElement>(
          'a.cursor-target[href$="/blog"]',
        )!;
        const posts = Array.from(
          section.querySelectorAll('a[href*="/blog/"]:not([href$="/blog"])'),
        );
        const last = posts[posts.length - 1]!;
        const linkBox = link.getBoundingClientRect();
        const lastBox = last.getBoundingClientRect();
        const sectionBox = section.getBoundingClientRect();
        return {
          afterLast: linkBox.top > lastBox.bottom,
          leftAligned: Math.abs(linkBox.left - sectionBox.left) < 80,
          arrow: (link.querySelector('span[aria-hidden="true"]')?.textContent ?? '')
            .includes('→'),
        };
      });
      expect(position.afterLast, path).toBe(true);
      expect(position.leftAligned, path).toBe(true);
      expect(position.arrow, path).toBe(true);
    }
  });

  test('âncora #blog navega até a seção e conteúdo preservado', async ({ page }) => {
    await gotoHome(page, '/#blog');
    const section = page.locator('#blog');
    await expect(section).toBeVisible();
    const top = await section.evaluate(
      (el) => el.getBoundingClientRect().top,
    );
    expect(top).toBeLessThan(200);
  });
});
