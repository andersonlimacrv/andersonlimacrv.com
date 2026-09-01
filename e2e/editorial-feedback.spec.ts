import { test, expect, type Page } from '@playwright/test';

const LOCALES = [
  { path: '/', lang: 'pt' },
  { path: '/es/', lang: 'es' },
  { path: '/en/', lang: 'en' },
] as const;

const POST = {
  pt: '/blog/design-editorial-para-web',
  es: '/es/blog/diseno-editorial-para-la-web',
  en: '/en/blog/editorial-design-for-the-web',
} as const;

async function gotoHome(page: Page, path: string) {
  await page.goto(path, { waitUntil: 'networkidle' });
  await page
    .waitForFunction(() => document.fonts.status !== 'loading', undefined, {
      timeout: 15_000,
    })
    .catch(() => undefined);
  await page.waitForTimeout(150);
}

test.describe('nav na ordem das seções numeradas', () => {
  test('links do nav: Sobre, Projetos, Blog, Contato (pt/es/en)', async ({
    page,
  }) => {
    for (const { path } of LOCALES) {
      await gotoHome(page, path);
      const hrefs = await page.evaluate(() =>
        Array.from(document.querySelectorAll('.site-nav a')).map((a) =>
          a.getAttribute('href'),
        ),
      );
      expect(hrefs, path).toEqual([
        expect.stringContaining('#sobre'),
        expect.stringContaining('#projetos'),
        expect.stringContaining('#blog'),
        expect.stringContaining('#contato'),
      ]);
    }
  });
});

test.describe('TargetSimbol auxiliar (feedback de toque)', () => {
  test('simbol aux visível em 390px e oculto em 1280px', async ({ page }) => {
    // mobile
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoHome(page, '/');
    const footer = page.locator('footer').last();
    const simbol = footer.locator('[data-target-simbol]');
    await expect(simbol).toBeVisible();
    await expect(simbol).toHaveCSS('width', '16px');
    // desktop
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.reload({ waitUntil: 'networkidle' });
    await expect(footer.locator('[data-target-simbol]')).toBeHidden();
  });

  test('tap no "voltar ao topo" gira a mira (data-spins) e navega', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoHome(page, '/');
    const link = page.locator('footer').last().locator('a[href="#top"]');
    const simbol = link.locator('[data-target-simbol]');
    await link.scrollIntoViewIfNeeded();
    // spin de entrada (IO) termina antes do tap (~1.6s)
    await page.waitForTimeout(1800);
    const before = await simbol.evaluate((el) =>
      Number(el.getAttribute('data-spins') ?? '0'),
    );
    // pointerdown bubbling: mesmo caminho do tap mobile (target-simbol.ts)
    await simbol.dispatchEvent('pointerdown');
    await page.waitForTimeout(250);
    const after = await simbol.evaluate((el) =>
      Number(el.getAttribute('data-spins') ?? '0'),
    );
    expect(after).toBeGreaterThan(before);
    // navegação não é bloqueada pelo spin (scroll-behavior: smooth → poll)
    await link.click();
    await expect
      .poll(() => page.evaluate(() => window.scrollY), { timeout: 4000 })
      .toBeLessThanOrEqual(10);
  });

  test('share do post tem simbol aux (mobile) e aria-hidden', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoHome(page, POST.pt);
    const share = page.locator('article footer');
    const simbols = share.locator('[data-target-simbol]');
    expect(await simbols.count()).toBe(2);
    for (const s of await simbols.all()) {
      await expect(s).toBeVisible();
      await expect(s).toHaveAttribute('aria-hidden', 'true');
    }
    // desktop: ocultos
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.reload({ waitUntil: 'networkidle' });
    await expect(share.locator('[data-target-simbol]').first()).toBeHidden();
  });
});

test.describe('Leia também editorial', () => {
  test('lista numerada 01–03 com data à direita, seta e hover (pt/es/en)', async ({
    page,
  }) => {
    for (const [locale, path] of Object.entries(POST)) {
      await gotoHome(page, path);
      const aside = page.locator('aside');
      await expect(aside).toBeVisible();
      const ol = aside.locator('ol');
      const rows = ol.locator('li');
      const count = await rows.count();
      // getRelatedPosts: por tags (sem preenchimento) — 1..3 dinâmico
      expect(count).toBeGreaterThanOrEqual(1);
      expect(count).toBeLessThanOrEqual(3);

      const structure = await page.evaluate(() => {
        const aside = document.querySelector('aside')!;
        const links = Array.from(
          aside.querySelectorAll<HTMLAnchorElement>('ol a'),
        );
        return links.map((a) => {
          const idx = a.querySelector('span[aria-hidden="true"]')?.textContent?.trim();
          const title = a.querySelector('span.flex-1')?.textContent;
          return {
            href: a.getAttribute('href'),
            idx,
            hasTitle: (title?.length ?? 0) > 0,
            hasTime: !!a.querySelector('time'),
            hasArrow: (a.textContent ?? '').includes('→'),
          };
        });
      });
      expect(
        structure.map((r) => r.idx),
        'índices sequenciais 01..N',
      ).toEqual(structure.map((_, i) => String(i + 1).padStart(2, '0')));
      expect(structure.every((r) => r.hasTitle)).toBe(true);
      expect(structure.every((r) => r.href?.includes('/blog/'))).toBe(true);
      expect(structure.every((r) => r.hasTime)).toBe(true);
      expect(structure.every((r) => r.hasArrow)).toBe(true);

      // data à direita ≥640px e oculta <640px
      const time = ol.locator('time').first();
      await page.setViewportSize({ width: 390, height: 844 });
      await page.reload({ waitUntil: 'networkidle' });
      await expect(time).toBeHidden();
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.reload({ waitUntil: 'networkidle' });
      await expect(time).toBeVisible();
      void locale;
    }
  });

  test('linha relacionada tem simbol aux no mobile e cursor-target', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoHome(page, POST.pt);
    const row = page.locator('aside ol a').first();
    await expect(row).toHaveClass(/cursor-target/);
    await expect(row.locator('[data-target-simbol]')).toBeVisible();
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.reload({ waitUntil: 'networkidle' });
    await expect(row.locator('[data-target-simbol]')).toBeHidden();
  });
});

test.describe('separador unificado ·', () => {
  test('meta do post usa Sep (·) consistente', async ({ page }) => {
    await gotoHome(page, POST.pt);
    const meta = page.locator('article .flex.flex-wrap.items-center').first();
    const text = (await meta.textContent()) ?? '';
    expect(text).toContain('·');
    expect(text).not.toContain('–');
    const sep = meta.locator('span[aria-hidden="true"]');
    expect(await sep.count()).toBeGreaterThanOrEqual(1);
    await expect(sep.first()).toHaveAttribute('aria-hidden', 'true');
    await expect(sep.first()).toHaveCSS('user-select', 'none');
  });

  test('shareX exibe "X · Twitter" nos 3 idiomas', async ({ page }) => {
    for (const path of Object.values(POST)) {
      await gotoHome(page, path);
      const share = page
        .locator('a[href*="twitter.com/intent"]')
        .first();
      const label = ((await share.textContent()) ?? '').trim();
      expect(label, path).toMatch(/^X\s+·\s+Twitter$/i);
    }
  });

  test('trajetória usa Sep (·) — nenhum · inline legado e sem en dash', async ({
    page,
  }) => {
    await gotoHome(page, '/');
    const trajectory = page.locator('section[data-col="trajetoria"] ul').first();
    const trajSep = trajectory.locator('span[aria-hidden="true"]');
    expect(await trajSep.count()).toBeGreaterThanOrEqual(1);
    const trajText = (await trajectory.textContent()) ?? '';
    expect(trajText).toContain('·');
    expect(trajText).not.toContain('–');
    // mainStack do About intercalado com Sep
    const stackSep = page
      .locator('section[data-col="dados"] p', { hasText: 'TypeScript' })
      .locator('span[aria-hidden="true"]');
    expect(await stackSep.count()).toBeGreaterThanOrEqual(1);
  });
});
