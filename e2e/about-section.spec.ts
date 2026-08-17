import { test, expect, type Page } from '@playwright/test';

const VIEWPORTS = [
  { name: 'desktop', width: 1280, height: 800 },
  { name: 'mobile', width: 390, height: 844 },
] as const;

const TOLERANCE_PX = 3;
const LINK_COUNT = 3;

const LINK_SELECTORS = [
  '#sobre-content a[href="https://github.com/andersonlimacrv"]',
  '#sobre-content a[href="https://www.linkedin.com/in/andersonlimacrv"]',
  '#sobre-content a[href="mailto:contato@andersonlimacrv.com"]',
] as const;

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

test.describe('seção Sobre reformulada', () => {
  for (const vp of VIEWPORTS) {
    test.describe(vp.name, () => {
      test.use({ viewport: { width: vp.width, height: vp.height } });

      test('duas colunas: quote ao lado do selo (desktop) / empilhado (mobile)', async ({
        page,
      }) => {
        await gotoHome(page);
        const data = await page.evaluate(() => {
          const root = document.querySelector('#sobre-content');
          const circle = document.querySelector('[data-bp-end] .bp-end-circle');
          const quote = document.querySelector('#sobre-content blockquote');
          if (!root || !circle || !quote) return null;
          const cs = getComputedStyle(root);
          const cr = circle.getBoundingClientRect();
          const qr = quote.getBoundingClientRect();
          return {
            display: cs.display,
            direction: cs.flexDirection,
            quoteLeft: qr.left,
            circleRight: cr.right,
          };
        });
        expect(data).not.toBeNull();
        expect(data!.display).toBe('flex');
        if (vp.name === 'desktop') {
          expect(data!.direction).toBe('row');
          expect(data!.quoteLeft).toBeGreaterThanOrEqual(data!.circleRight - TOLERANCE_PX);
        } else {
          expect(data!.direction).toBe('column');
        }
      });

      test('sem overflow horizontal', async ({ page }) => {
        await gotoHome(page);
        const overflow = await page.evaluate(() => {
          return document.documentElement.scrollWidth - document.documentElement.clientWidth;
        });
        expect(overflow).toBeLessThanOrEqual(0);
      });

      test('links sociais com cursor-target e corners do TargetHover', async ({ page }) => {
        await gotoHome(page);
        for (const sel of LINK_SELECTORS) {
          await expect(page.locator(sel)).toHaveClass(/cursor-target/);
        }
        if (vp.name === 'desktop') {
          await page.waitForFunction(
            (count) => {
              return (
                document.querySelectorAll('.cursor-target .target-hover-corner').length >= count
              );
            },
            LINK_COUNT * 4,
          );
          for (const sel of LINK_SELECTORS) {
            await expect(page.locator(`${sel} .target-hover-corner`)).toHaveCount(4);
          }
        } else {
          await expect(page.locator('.target-hover-corner')).toHaveCount(0);
        }
      });

      test('conteúdo: quote, cite, bio (2 parágrafos), timeline, stack, detalhes e contato', async ({
        page,
      }) => {
        await gotoHome(page);
        const quote = page.locator('#sobre-content blockquote p');
        await expect(quote).not.toHaveText('');
        await expect(page.locator('#sobre-content blockquote cite')).toContainText(
          'Anderson Carvalho',
        );

        await expect(page.locator('#sobre-content div.space-y-4 p')).toHaveCount(2);

        const entries = page.locator('#sobre-content ol[aria-label] > li');
        await expect(entries).toHaveCount(7);
        await expect(entries.first().locator('p').first()).toContainText('Pós-graduação');
        await expect(entries.nth(1).locator('p').first()).toContainText('Software Developer');

        await expect(page.locator('#sobre-content details')).toHaveCount(4);
        await expect(page.locator('#sobre-content details summary').first()).toContainText(
          'Detalhes',
        );
        await expect(page.locator('#sobre-content details').first()).toContainText('Frontend');
        await expect(page.locator('#sobre-content details').first()).toContainText(
          'Embedded & IoT',
        );

        await expect(page.locator('#sobre-content li.border')).toHaveCount(61);

        await expect(page.locator('#sobre-content dl > div')).toHaveCount(6);

        await expect(page.locator('#sobre-content footer').getByText('Pelotas')).toBeVisible();
        await expect(page.locator('#sobre-content footer').getByText('+55')).toBeVisible();
      });

      test('localização: rótulos em inglês em /en/ (fatos permanecem em pt)', async ({
        page,
      }) => {
        await gotoHome(page, '/en/');
        await expect(page.locator('#sobre-content blockquote p')).toContainText(
          'I build for the web',
        );
        await expect(page.locator('#sobre-content ol[aria-label]')).toHaveAttribute(
          'aria-label',
          'Timeline',
        );
        await expect(page.locator('#sobre-content details summary').first()).toContainText(
          'Details',
        );
        await expect(page.locator('#sobre-content ol[aria-label] > li').first()).toContainText(
          'Pós-graduação',
        );
      });
    });
  }
});
