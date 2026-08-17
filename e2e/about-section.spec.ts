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

      test('duas colunas fixas em qualquer largura (nunca empilha)', async ({ page }) => {
        await gotoHome(page);
        const data = await page.evaluate(() => {
          const grid = document.querySelector(
            '#sobre-content > div.grid',
          ) as HTMLElement | null;
          if (!grid) return null;
          const cs = getComputedStyle(grid);
          return {
            display: cs.display,
            cols: cs.gridTemplateColumns.split(' ').filter((c) => c !== '').length,
            children: grid.children.length,
          };
        });
        expect(data).not.toBeNull();
        expect(data!.display).toBe('grid');
        expect(data!.cols).toBe(2);
        expect(data!.children).toBe(2);
      });

      test('retrato à esquerda com informações ao lado (nunca abaixo)', async ({
        page,
      }) => {
        await gotoHome(page);
        const data = await page.evaluate(() => {
          const portrait = document.querySelector('#sobre-portrait');
          const info = document.querySelector('#sobre-portrait + div');
          if (!portrait || !info) return null;
          const pr = portrait.getBoundingClientRect();
          const ir = info.getBoundingClientRect();
          const dl = info.querySelector('dl');
          return {
            infoRight: ir.right,
            portraitRight: pr.right,
            infoTopOverlap: ir.top < pr.bottom,
            dlCount: dl ? dl.querySelectorAll(':scope > div').length : 0,
          };
        });
        expect(data).not.toBeNull();
        // Informações ao lado (à direita) e com topo dentro da área da foto.
        expect(data!.infoRight).toBeGreaterThan(data!.portraitRight - TOLERANCE_PX);
        expect(data!.infoTopOverlap).toBe(true);
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

      test('conteúdo: role/stack/location na coluna 01, frase, bio, social; timeline na coluna 02', async ({
        page,
      }) => {
        await gotoHome(page);

        const info = page.locator('#sobre-portrait + div dl');
        await expect(info.locator(':scope > div')).toHaveCount(3);
        await expect(info.getByText('Full Stack Developer')).toBeVisible();
        await expect(info.getByText('Python · TypeScript · C · ESP32 · React')).toBeVisible();
        await expect(info.getByText('Pelotas, Rio Grande do Sul, Brasil')).toBeVisible();

        const quote = page.locator('#sobre-content blockquote p');
        await expect(quote).not.toHaveText('');
        await expect(page.locator('#sobre-content blockquote cite')).toContainText(
          'Anderson Carvalho',
        );

        await expect(page.locator('#sobre-content footer').getByText('GitHub')).toBeVisible();
        await expect(page.locator('#sobre-content footer').getByText('+55 53 98100-4874')).toBeVisible();

        const entries = page.locator('#sobre-content ol[aria-label] > li');
        await expect(entries).toHaveCount(7);
        await expect(entries.first().locator('h3')).toContainText('Pós-graduação');
        await expect(entries.first()).toContainText('Universidade Católica');
        await expect(entries.first()).toContainText('Especialização em IA e ML');
      });

      test('timeline: anos, período, empresa e resumo de 1 linha por item', async ({
        page,
      }) => {
        await gotoHome(page);
        const data = await page.evaluate(() => {
          const ol = document.querySelector('#sobre-content ol[aria-label]');
          if (!ol) return null;
          const items = Array.from(ol.querySelectorAll(':scope > li'));
          return items.map((li) => {
            const year = li.querySelector('p.font-mono')?.textContent?.trim() ?? '';
            const role = li.querySelector('h3')?.textContent?.trim() ?? '';
            const period = li.querySelector('p.uppercase')?.textContent?.trim() ?? '';
            const summary = li.querySelector(':scope > div:nth-child(2) > p:last-of-type')?.textContent?.trim() ?? '';
            return { year, role, period, summary };
          });
        });
        expect(data).not.toBeNull();
        expect(data!.length).toBe(7);
        expect(data![0].year).toBe('2026');
        expect(data![0].period).toBe('maio de 2026 — maio de 2027');
        expect(data![0].summary).toContain('Especialização em IA e ML');
        expect(data![5].year).toBe('2012');
        for (const item of data!) {
          expect(item.summary).not.toHaveLength(0);
        }
      });

      test('header da coluna 02 usa o intervalo real dos dados (2007—2027)', async ({
        page,
      }) => {
        await gotoHome(page);
        await expect(page.locator('#sobre-content section:nth-child(2)')).toContainText(
          '2007—2027',
        );
        await expect(page.locator('#sobre-content section:nth-child(2)')).toContainText(
          'Trajetória',
        );
      });

      test('localização: rótulos em inglês em /en/ (fatos permanecem em pt)', async ({
        page,
      }) => {
        await gotoHome(page, '/en/');
        await expect(page.locator('#sobre-portrait + div dl').getByText('Role')).toBeVisible();
        await expect(
          page.locator('#sobre-portrait + div dl').getByText('Main stack'),
        ).toBeVisible();
        await expect(page.locator('#sobre-content blockquote p')).toContainText(
          'I build for the web',
        );
        await expect(page.locator('#sobre-content ol[aria-label]')).toHaveAttribute(
          'aria-label',
          'Timeline',
        );
        await expect(page.locator('#sobre-content ol[aria-label] > li').first()).toContainText(
          'Pós-graduação',
        );
      });
    });
  }
});