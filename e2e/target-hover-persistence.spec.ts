import { test, expect, type Page } from '@playwright/test';

async function goto(page: Page, path = '/') {
  await page.addStyleTag({ content: 'html { scroll-behavior: auto !important; }' }).catch(() => {});
  await page.goto(path, { waitUntil: 'networkidle' });
  await page
    .waitForFunction(() => document.fonts.status !== 'loading', undefined, { timeout: 15_000 })
    .catch(() => undefined);
  // aguarda hidratação do TargetHover (injeção de corners via JS)
  await page.waitForTimeout(300);
}

async function waitForDesktopCorners(page: Page) {
  await page.waitForFunction(
    () => {
      const targets = document.querySelectorAll('.cursor-target');
      const corners = document.querySelectorAll('.cursor-target .target-hover-corner');
      return targets.length > 0 && corners.length === targets.length * 4;
    },
    undefined,
    { timeout: 5000 },
  );
}

async function waitForMobileNoCorners(page: Page) {
  await page.waitForFunction(
    () => document.querySelectorAll('.target-hover-corner').length === 0,
    undefined,
    { timeout: 5000 },
  );
}

async function getCounts(page: Page) {
  return page.evaluate(() => {
    const targets = document.querySelectorAll('.cursor-target');
    const corners = document.querySelectorAll('.target-hover-corner');
    const headerTargets = document.querySelectorAll('header .cursor-target');
    const headerCorners = document.querySelectorAll('header .cursor-target .target-hover-corner');
    const sobreSocials = document.querySelectorAll('#sobre-content a.cursor-target');
    const sobreCorners = document.querySelectorAll('#sobre-content a.cursor-target .target-hover-corner');
    const blogViewAll = document.querySelector('a[href="/blog"].cursor-target, a[href="/en/blog"].cursor-target, a[href="/es/blog"].cursor-target');
    const contactEmail = document.querySelector('a[href^="mailto:"].cursor-target');
    return {
      targets: targets.length,
      corners: corners.length,
      headerTargets: headerTargets.length,
      headerCorners: headerCorners.length,
      sobreTargets: sobreSocials.length,
      sobreCorners: sobreCorners.length,
      blogViewAll: !!blogViewAll,
      blogViewAllCorners: blogViewAll ? blogViewAll.querySelectorAll('.target-hover-corner').length : 0,
      contactEmail: !!contactEmail,
      contactCorners: contactEmail ? contactEmail.querySelectorAll('.target-hover-corner').length : 0,
    };
  });
}

// Navega via ClientRouter clicando em link (não page.goto direto)
async function clickAndWaitForURL(page: Page, selector: string, urlPattern: string) {
  await page.locator(selector).first().click();
  await page.waitForURL(urlPattern, { timeout: 5000 });
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(400);
}

test.describe('TargetHover — persistência via ClientRouter', () => {
  test.describe('desktop (1280)', () => {
    test.use({ viewport: { width: 1280, height: 800 } });

    test('Home → /blog → Home preserva corners em toda a página (não só header)', async ({ page }) => {
      await goto(page, '/');
      await waitForDesktopCorners(page);
      const before = await getCounts(page);
      expect(before.targets).toBeGreaterThan(10);
      expect(before.corners).toBe(before.targets * 4);
      expect(before.sobreTargets).toBe(5);
      expect(before.sobreCorners).toBe(20);
      expect(before.blogViewAll).toBe(true);
      expect(before.blogViewAllCorners).toBe(4);

      // Navega para /blog via click no "ver todos" (ClientRouter)
      // Seletor do link "ver todos" tem href /blog e classe cursor-target
      await clickAndWaitForURL(page, 'a.cursor-target[href="/blog"]', '**/blog');
      // Em /blog, PostCards devem ter corners
      await waitForDesktopCorners(page);
      const onBlog = await getCounts(page);
      expect(onBlog.targets).toBeGreaterThan(3);
      expect(onBlog.corners).toBe(onBlog.targets * 4);

      // Volta para Home via logo do header (ClientRouter)
      await clickAndWaitForURL(page, 'header a.cursor-target[href="/"]', '**/');
      await waitForDesktopCorners(page);
      const after = await getCounts(page);
      // Após volta, contagem deve voltar ao mesmo patamar e corners em seções
      expect(after.targets).toBe(before.targets);
      expect(after.corners).toBe(after.targets * 4);
      expect(after.sobreTargets).toBe(5);
      expect(after.sobreCorners).toBe(20);
      expect(after.blogViewAllCorners).toBe(4);
      expect(after.contactCorners).toBe(4);
      expect(after.headerCorners).toBe(after.headerTargets * 4);
    });

    test('Home → /blog/[post] → Home preserva corners', async ({ page }) => {
      await goto(page, '/');
      await waitForDesktopCorners(page);

      await goto(page, '/blog');
      await waitForDesktopCorners(page);
      // pega primeiro PostCard em /blog
      const firstPostHref = await page.locator('article a.cursor-target').first().getAttribute('href');
      expect(firstPostHref).toBeTruthy();
      if (!firstPostHref) return;

      await clickAndWaitForURL(page, `article a.cursor-target[href="${firstPostHref}"]`, '**/blog/**');
      await waitForDesktopCorners(page);
      const onPost = await getCounts(page);
      // PostLayout tem links de voltar e shares com cursor-target
      expect(onPost.corners).toBe(onPost.targets * 4);

      // Volta para Home via logo
      await clickAndWaitForURL(page, 'header a.cursor-target[href="/"]', '**/');
      await waitForDesktopCorners(page);
      const after = await getCounts(page);
      expect(after.corners).toBe(after.targets * 4);
      expect(after.sobreCorners).toBe(20);
    });

    test('header não duplica corners após 3 ciclos Home↔Blog', async ({ page }) => {
      await goto(page, '/');
      await waitForDesktopCorners(page);
      const initialHeaderCorners = await page.evaluate(
        () => document.querySelectorAll('header .target-hover-corner').length,
      );

      for (let i = 0; i < 3; i++) {
        await page.goto('/blog', { waitUntil: 'networkidle' });
        await page.waitForTimeout(400);
        await waitForDesktopCorners(page);
        await page.goto('/', { waitUntil: 'networkidle' });
        await page.waitForTimeout(400);
        await waitForDesktopCorners(page);
      }

      const finalHeaderCorners = await page.evaluate(
        () => document.querySelectorAll('header .target-hover-corner').length,
      );
      expect(finalHeaderCorners).toBe(initialHeaderCorners);
      // cada header target ainda deve ter exatamente 4 corners
      const perTarget = await page.evaluate(() => {
        const targets = Array.from(document.querySelectorAll('header .cursor-target')) as HTMLElement[];
        return targets.map((t) => t.querySelectorAll('.target-hover-corner').length);
      });
      for (const n of perTarget) expect(n).toBe(4);
    });

    test('hover ativa is-target-hovering após round-trip', async ({ page }) => {
      await goto(page, '/');
      await waitForDesktopCorners(page);

      await page.goto('/blog', { waitUntil: 'networkidle' });
      await page.waitForTimeout(400);
      await page.goto('/', { waitUntil: 'networkidle' });
      await page.waitForTimeout(400);
      await waitForDesktopCorners(page);

      const social = page.locator('#sobre-content a.cursor-target').first();
      await social.scrollIntoViewIfNeeded();
      await social.hover();
      await expect(social).toHaveClass(/is-target-hovering/, { timeout: 2000 });
      // corners devem ficar com opacity 1 (via CSS) — aguarda transição 0.2s
      await page.waitForFunction(
        () => {
          const corner = document.querySelector('#sobre-content a.cursor-target .target-hover-corner') as HTMLElement;
          return corner && getComputedStyle(corner).opacity === '1';
        },
        undefined,
        { timeout: 2000 },
      );
      const opacity = await page.evaluate(() => {
        const corner = document.querySelector('#sobre-content a.cursor-target .target-hover-corner') as HTMLElement;
        if (!corner) return null;
        return getComputedStyle(corner).opacity;
      });
      expect(opacity).toBe('1');

      // ao sair, remove classe
      await page.mouse.move(0, 0);
      await page.waitForTimeout(150);
      await expect(social).not.toHaveClass(/is-target-hovering/);
    });

    test('MutationObserver: novos .cursor-target injetados dinamicamente ganham corners', async ({ page }) => {
      await goto(page, '/');
      await waitForDesktopCorners(page);
      const before = await page.evaluate(() => document.querySelectorAll('.target-hover-corner').length);

      await page.evaluate(() => {
        const el = document.createElement('a');
        el.href = '#';
        el.className = 'cursor-target';
        el.textContent = 'dynamic';
        el.style.display = 'block';
        el.style.padding = '10px';
        document.body.appendChild(el);
      });
      await page.waitForFunction(
        (prev) => document.querySelectorAll('.target-hover-corner').length > prev,
        before,
        { timeout: 3000 },
      );
      const dynamicCorners = await page.evaluate(() => {
        const dyn = Array.from(document.querySelectorAll('a.cursor-target')).find((a) => a.textContent === 'dynamic');
        return dyn ? dyn.querySelectorAll('.target-hover-corner').length : 0;
      });
      expect(dynamicCorners).toBe(4);
    });
  });

  test.describe('mobile (390)', () => {
    test.use({ viewport: { width: 390, height: 844 } });

    test('mobile não injeta corners antes e após navegação', async ({ page }) => {
      await goto(page, '/');
      await waitForMobileNoCorners(page);
      expect(await page.evaluate(() => document.querySelectorAll('.target-hover-corner').length)).toBe(0);

      await page.goto('/blog', { waitUntil: 'networkidle' });
      await page.waitForTimeout(400);
      await waitForMobileNoCorners(page);

      await page.goto('/', { waitUntil: 'networkidle' });
      await page.waitForTimeout(400);
      await waitForMobileNoCorners(page);
    });
  });

  test.describe('i18n', () => {
    test.use({ viewport: { width: 1280, height: 800 } });

    test('persiste em /en/ e /es/ e ao voltar para /', async ({ page }) => {
      for (const base of ['/en/', '/es/']) {
        await goto(page, base);
        await waitForDesktopCorners(page);
        const homeCounts = await getCounts(page);
        expect(homeCounts.corners).toBe(homeCounts.targets * 4);

        const blogPath = `${base}blog`; // /en/blog, /es/blog
        await page.goto(blogPath, { waitUntil: 'networkidle' });
        await page.waitForTimeout(400);
        await waitForDesktopCorners(page);
        const blogCounts = await getCounts(page);
        expect(blogCounts.corners).toBe(blogCounts.targets * 4);

        await page.goto(base, { waitUntil: 'networkidle' });
        await page.waitForTimeout(400);
        await waitForDesktopCorners(page);
        const back = await getCounts(page);
        expect(back.corners).toBe(back.targets * 4);
        expect(back.sobreCorners).toBe(20);
      }
    });
  });

  test.describe('prefers-reduced-motion', () => {
    test('corners existem mesmo com reduced-motion, mas sem parallax brusco', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await goto(page, '/');
      // com reduced, ainda deve ter corners no desktop (apenas easing diferente)
      await waitForDesktopCorners(page);
      const counts = await getCounts(page);
      expect(counts.corners).toBe(counts.targets * 4);

      // navega e volta
      await page.goto('/blog', { waitUntil: 'networkidle' });
      await page.waitForTimeout(400);
      await waitForDesktopCorners(page);
      await page.goto('/', { waitUntil: 'networkidle' });
      await page.waitForTimeout(400);
      await waitForDesktopCorners(page);
      const after = await getCounts(page);
      expect(after.corners).toBe(after.targets * 4);
    });
  });
});
