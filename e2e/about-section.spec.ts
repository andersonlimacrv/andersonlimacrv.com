import { test, expect, type Page } from '@playwright/test';

const VIEWPORTS = [
  { name: 'desktop', width: 1280, height: 800 },
  { name: 'mobile', width: 390, height: 844 },
] as const;

const TOLERANCE_PX = 3;
const LINK_COUNT = 5;

const LINK_SELECTORS = [
  '#sobre-content a[href="https://github.com/andersonlimacrv"]',
  '#sobre-content a[href="https://www.linkedin.com/in/andersonlimacrv"]',
  '#sobre-content a[href="https://instagram.com/andersonlimacrv"]',
  '#sobre-content a[href="https://wa.me/5553981004874"]',
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

      test('layout: perfil acima da trajetória no mobile, lado a lado no desktop', async ({
        page,
      }) => {
        await gotoHome(page);
        const data = await page.evaluate(() => {
          const grid = document.querySelector(
            '#sobre-content > div.flex',
          ) as HTMLElement | null;
          if (!grid) return null;
          const cs = getComputedStyle(grid);
          return {
            display: cs.display,
            flexDirection: cs.flexDirection,
            sections: grid.querySelectorAll(':scope > section').length,
          };
        });
        expect(data).not.toBeNull();
        expect(data!.display).toBe('flex');
        expect(data!.sections).toBe(2);
        expect(data!.flexDirection).toBe(vp.name === 'desktop' ? 'row' : 'column');
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

      test('conteúdo: role/stack/location na coluna 01, frase, bio, social; trajectory na coluna 02', async ({
        page,
      }) => {
        await gotoHome(page);

        const info = page.locator('#sobre-portrait + div dl');
        await expect(info.locator(':scope > div')).toHaveCount(3);
        await expect(info.getByText('Engenheiro de Software')).toBeVisible();
        await expect(info.getByText('Enterpreneur')).toBeVisible();
        await expect(info.getByText('Arquiteto de Soluções')).toBeVisible();
        await expect(info.getByText('Python · TypeScript · C/C++ · ESP32 · React')).toBeVisible();
        await expect(info.getByText('Pelotas, Rio Grande do Sul, Brasil')).toBeVisible();

        const quote = page.locator('#sobre-content blockquote p');
        await expect(quote).not.toHaveText('');
        await expect(page.locator('#sobre-content blockquote')).toContainText(
          'Faço web pensando em quem lê',
        );

        await expect(page.locator('#sobre-content footer').getByText('GitHub')).toBeVisible();
        await expect(page.locator('#sobre-content footer').getByText('Instagram')).toBeVisible();
        await expect(page.locator('#sobre-content footer').getByText('WhatsApp')).toBeVisible();
        await expect(page.locator('#sobre-content footer').getByText('+55 53 98100-4874')).toHaveCount(0);

        // Trajetória clean: 7 rows (4 work + 3 education) cada com Company / Role, badge e period
        const entries = page.locator('#sobre-content ul[aria-label] > li');
        await expect(entries).toHaveCount(7);
        await expect(entries.first()).toContainText('Universidade Católica');
        // Sem summary longo, sem linha vertical
        await expect(entries.first()).not.toContainText('Especialização em IA e ML aplicada');
        await expect(page.locator('#sobre-content section[data-col="trajetoria"] .cross-mark')).toHaveCount(0);
      });

      test('trajetória clean: lista única com Company / Role, badge e period, sem linha vertical ou yearRange', async ({
        page,
      }) => {
        await gotoHome(page);
        const data = await page.evaluate(() => {
          const ul = document.querySelector('#sobre-content ul[aria-label]') as HTMLElement | null;
          if (!ul) return null;
          const items = Array.from(ul.querySelectorAll(':scope > li'));
          return items.map((li) => {
            const text = li.textContent ?? '';
            const badge = li.querySelector('span.rounded-lg')?.textContent?.trim() ?? '';
            const period = li.querySelector('span.trajectory-period')?.textContent?.trim() ?? '';
            const companyRole = li.querySelector('span.min-w-0')?.textContent?.trim() ?? text.slice(0, 60);
            return { text, badge, period, companyRole };
          });
        });
        expect(data).not.toBeNull();
        expect(data!.length).toBe(7);
        // Badges localizados pt: 4 Trabalho + 3 Formação
        const trabalho = data!.filter((d) => d.badge === 'Trabalho').length;
        const formacao = data!.filter((d) => d.badge === 'Formação').length;
        expect(trabalho).toBe(4);
        expect(formacao).toBe(3);
        // Primeiro deve ser 2026 (Pós)
        expect(data![0].period).toContain('2026');
        expect(data![0].companyRole).toContain('Universidade Católica');
        // Sem yearRange e sem linha vertical / CrossMark
        const hasYearRange = await page.evaluate(() =>
          document.body.textContent?.includes('2007—2027') ?? false,
        );
        // yearRange foi removido da trajetória; pode ainda existir em outro lugar? Verifica especificamente na coluna
        const trajetoriaText = await page.locator('section[data-col="trajetoria"]').textContent();
        expect(trajetoriaText).not.toContain('2007—2027');
        expect(hasYearRange).toBe(false);
        const hasVerticalLine = await page.evaluate(() =>
          !!document.querySelector('section[data-col="trajetoria"] span.w-px.bg-border'),
        );
        expect(hasVerticalLine).toBe(false);
        const hasCrossMark = await page.evaluate(() =>
          document.querySelectorAll('section[data-col="trajetoria"] .cross-mark').length,
        );
        expect(hasCrossMark).toBe(0);
        for (const item of data!) {
          expect(item.badge).not.toHaveLength(0);
          expect(item.period).not.toHaveLength(0);
          expect(item.companyRole).not.toHaveLength(0);
        }
      });

      test('header da coluna 02 mantém Trajetória sem intervalo', async ({
        page,
      }) => {
        await gotoHome(page);
        const trajetoria = page.locator('#sobre-content section[data-col="trajetoria"]');
        await expect(trajetoria).not.toContainText('2007—2027');
        await expect(trajetoria).toContainText('Trajetória');
        await expect(trajetoria.getByText('02', { exact: true })).toBeVisible();
      });

      test('localização: rótulos e trajetória em inglês em /en/', async ({
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
        await expect(page.locator('#sobre-content ul[aria-label]')).toHaveAttribute(
          'aria-label',
          'Timeline',
        );
        await expect(page.locator('#sobre-content ul[aria-label] > li').first()).toContainText(
          'Universidade Católica',
        );
        // badges em inglês
        const badgesEn = await page.evaluate(() =>
          Array.from(document.querySelectorAll('#sobre-content ul[aria-label] > li span.rounded-lg')).map(
            (el) => el.textContent?.trim() ?? '',
          ),
        );
        expect(badgesEn.filter((b) => b === 'Work').length).toBe(4);
        expect(badgesEn.filter((b) => b === 'Education').length).toBe(3);
      });
    });
  }
});