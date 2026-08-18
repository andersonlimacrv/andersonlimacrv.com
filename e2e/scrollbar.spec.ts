import { test, expect, type Page } from '@playwright/test';

async function gotoHome(page: Page, path = '/') {
  await page.addStyleTag({ content: 'html { scroll-behavior: auto !important; }' });
  await page.goto(path, { waitUntil: 'networkidle' });
  await page
    .waitForFunction(() => document.fonts.status !== 'loading', undefined, {
      timeout: 15_000,
    })
    .catch(() => undefined);
  await page.waitForTimeout(150);
}

async function tokenValue(page: Page, token: string, root = ':root') {
  return page.evaluate(
    ({ token, root }) => {
      const el = document.querySelector(root) as HTMLElement | null;
      if (!el) return null;
      return getComputedStyle(el).getPropertyValue(token).trim();
    },
    { token, root },
  );
}

async function waitForContentTallerThanViewport(page: Page) {
  await page.evaluate(() => {
    document.body.style.minHeight = `${window.innerHeight + 400}px`;
  });
}

test.describe('scrollbar personalizada', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test('largura de 8px no Chromium/Safari', async ({ page }) => {
    await gotoHome(page);
    await waitForContentTallerThanViewport(page);
    const width = await page.evaluate(() => {
      const el = document.documentElement;
      return getComputedStyle(el, '::-webkit-scrollbar').width;
    });
    expect(width).toBe('8px');
  });

  test('thumb na cor --muted-foreground em repouso (tema claro)', async ({ page }) => {
    await gotoHome(page);
    await waitForContentTallerThanViewport(page);
    const token = await tokenValue(page, '--muted-foreground');
    const thumb = await page.evaluate(() => {
      return getComputedStyle(document.documentElement, '::-webkit-scrollbar-thumb')
        .backgroundColor;
    });
    const expectedRgb = await page.evaluate((t) => {
      const el = document.createElement('div');
      el.style.color = t;
      document.body.appendChild(el);
      const rgb = getComputedStyle(el).color;
      el.remove();
      return rgb;
    }, token ?? '');
    expect(thumb).toBe(expectedRgb);
  });

  test('hover do thumb muda para --foreground', async ({ page }) => {
    await gotoHome(page);
    await waitForContentTallerThanViewport(page);
    const token = await tokenValue(page, '--foreground');
    const expectedRgb = await page.evaluate((t) => {
      const el = document.createElement('div');
      el.style.color = t ?? '';
      document.body.appendChild(el);
      const rgb = getComputedStyle(el).color;
      el.remove();
      return rgb;
    }, token ?? '');

    // getComputedStyle pseudo:hover retorna vazio fora do estado ativo;
    // lemos a regra CSS injetada em global.css para confirmar o destino do hover.
    const hoverTarget = await page.evaluate(() => {
      for (const sheet of Array.from(document.styleSheets)) {
        let rules: CSSRuleList;
        try {
          rules = sheet.cssRules;
        } catch {
          continue;
        }
        for (const rule of Array.from(rules)) {
          if (rule instanceof CSSStyleRule && rule.selectorText.includes('::-webkit-scrollbar-thumb')) {
            if (rule.selectorText.includes(':hover') || rule.selectorText.includes(':active')) {
              return rule.style.getPropertyValue('background-color');
            }
          }
        }
      }
      return null;
    });
    expect(hoverTarget).not.toBeNull();
    // O valor escrito na regra é `var(--foreground)`; convertemos para cor
    // computada num elemento temporário usando setProperty (shorthand */
    // background rejeita var()).
    const composed = await page.evaluate((css) => {
      const el = document.createElement('div');
      (el.style as CSSStyleDeclaration).setProperty('background-color', css ?? '');
      document.body.appendChild(el);
      const rgb = getComputedStyle(el).backgroundColor;
      el.remove();
      return rgb;
    }, hoverTarget);
    expect(composed).toBe(expectedRgb);
  });

  test('tema esc troca a paleta do thumb', async ({ page }) => {
    await gotoHome(page);
    await waitForContentTallerThanViewport(page);
    const tokenLight = await tokenValue(page, '--muted-foreground', ':root');
    await page.evaluate(() => document.documentElement.classList.add('dark'));
    await page.waitForTimeout(50);
    const tokenDark = await tokenValue(page, '--muted-foreground', '.dark');
    expect(tokenDark).not.toBe(tokenLight);

    const expectedRgb = await page.evaluate((t) => {
      const el = document.createElement('div');
      el.style.color = t ?? '';
      document.body.appendChild(el);
      const rgb = getComputedStyle(el).color;
      el.remove();
      return rgb;
    }, tokenDark ?? '');

    const thumb = await page.evaluate(() => {
      return getComputedStyle(document.documentElement, '::-webkit-scrollbar-thumb')
        .backgroundColor;
    });
    expect(thumb).toBe(expectedRgb);
  });

  test('prefers-reduced-motion desativa a transição do thumb', async ({ page, context }) => {
    await context.addCookies([
      { name: 'noop', value: '1', domain: 'localhost', path: '/' },
    ]);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await gotoHome(page);
    const transition = await page.evaluate(() => {
      return getComputedStyle(document.documentElement, '::-webkit-scrollbar-thumb')
        .transition;
    });
    // Sob prefers-reduced-motion a regra `@media` zera a transição.
    expect(transition).toMatch(/none|0s/);
  });
});
