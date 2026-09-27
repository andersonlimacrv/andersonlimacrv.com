import { test, expect, type Page } from '@playwright/test';

async function gotoHome(page: Page, path = '/') {
  await page.goto(path, { waitUntil: 'networkidle' });
  await page
    .waitForFunction(() => document.fonts.status !== 'loading', undefined, {
      timeout: 15_000,
    })
    .catch(() => undefined);
}

const SECTIONS = ['sobre', 'projetos', 'blog', 'contato'];

test.describe('section spacing', () => {
  test('padding vertical padrão: 80 mobile, 96 desktop', async ({
    page,
  }) => {
    for (const width of [390, 1280]) {
      await page.setViewportSize({ width, height: 844 });
      const expected = width === 390 ? '80px' : '96px';
      for (const path of ['/', '/es/']) {
        await gotoHome(page, path);
        for (const id of SECTIONS) {
          const section = page.locator(`section#${id}`);
          await expect(section).toHaveCSS('padding-top', expected);
          await expect(section).toHaveCSS('padding-bottom', expected);
        }
      }
    }
  });

  test('gap título→conteúdo de 48px nas sections', async ({ page }) => {
    for (const path of ['/', '/es/']) {
      await gotoHome(page, path);
      for (const id of SECTIONS) {
        const section = page.locator(`section#${id}`);
        await section.scrollIntoViewIfNeeded();
        // reveal (translateY 0.6s) precisa terminar antes de medir caixas
        await page.waitForTimeout(800);
        const grid = section.locator('[data-kinetic-grid]');
        const content = section.locator(':scope > div > div.mt-12');
        const gb = (await grid.boundingBox())!;
        const cb = (await content.boundingBox())!;
        expect(cb.y - (gb.y + gb.height)).toBeLessThanOrEqual(50);
        expect(cb.y - (gb.y + gb.height)).toBeGreaterThanOrEqual(46);
      }
    }
  });

  test('gap óptico título-texto→corpo-texto uniforme entre sections', async ({
    page,
  }) => {
    // Padrão VISUAL (não de divs): do fim da tinta do título ao início da
    // tinta do primeiro texto, via Range. Todas as sections convergem.
    const FIRST_TEXT: Record<string, string> = {
      sobre: '#sobre-content header span',
      projetos: '#projetos div.mt-12 > p',
      blog: '#blog article a span',
      contato: '#contato-content h3',
    };
    for (const width of [390, 1280]) {
      await page.setViewportSize({ width, height: 900 });
      for (const path of ['/', '/es/']) {
        await gotoHome(page, path);
        const gaps: number[] = [];
        for (const id of SECTIONS) {
          const section = page.locator(`section#${id}`);
          await section.scrollIntoViewIfNeeded();
          await page.waitForTimeout(800);
          const gap = await section.evaluate(
            (sec: HTMLElement, sel: string) => {
              const firstText = (el: Element | null): Text | null => {
                if (!el) return null;
                const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
                let n: Node | null = null;
                while ((n = w.nextNode())) {
                  if (n.textContent?.trim()) return n as Text;
                }
                return null;
              };
              const title =
                sec.querySelector('h2 [data-text-scramble]') ??
                sec.querySelector('h2');
              const first = sec.querySelector(sel);
              const t1 = firstText(title);
              const t2 = firstText(first);
              if (!t1 || !t2) return -1;
              const r1 = document.createRange();
              r1.selectNodeContents(t1);
              const r2 = document.createRange();
              r2.selectNodeContents(t2);
              return (
                r2.getBoundingClientRect().top -
                r1.getBoundingClientRect().bottom
              );
            },
            FIRST_TEXT[id],
          );
          expect(gap).toBeGreaterThan(0);
          gaps.push(gap);
        }
        // uniformidade óptica: spread máximo entre as 4 sections
        expect(Math.max(...gaps) - Math.min(...gaps)).toBeLessThanOrEqual(
          25,
        );
      }
    }
  });

  test('projetos: subtítulo localizado entre título e menu', async ({
    page,
  }) => {
    const expected: Record<string, string> = {
      '/': 'Trabalhos em destaque / Projetos paralelos',
      '/es/': 'Trabajos destacados / Proyectos paralelos',
      '/en/': 'Highlighted work / Side projects',
    };
    for (const [path, text] of Object.entries(expected)) {
      await gotoHome(page, path);
      const sub = page.locator('#projetos div.mt-12 > p').first();
      await expect(sub).toContainText(text);
    }
  });

  test('hero: CTAs 40px abaixo do subtítulo', async ({ page }) => {
    await gotoHome(page);
    const hero = page.locator('#hero');
    const sub = hero.locator('p').nth(1);
    const ctas = hero.locator('div.mt-10');
    const sb = (await sub.boundingBox())!;
    const cb = (await ctas.boundingBox())!;
    const gap = cb.y - (sb.y + sb.height);
    expect(gap).toBeLessThanOrEqual(42);
    expect(gap).toBeGreaterThanOrEqual(38);
  });
});
