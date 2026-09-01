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

      test('layout: trajetória sempre abaixo do perfil (coluna única)', async ({
        page,
      }) => {
        await gotoHome(page);
        const data = await page.evaluate(() => {
          const grid = document.querySelector(
            '#sobre-content > div.flex',
          ) as HTMLElement | null;
          if (!grid) return null;
          const cs = getComputedStyle(grid);
          const sections = Array.from(grid.querySelectorAll(':scope > section'));
          const order = sections.map((s) => s.getAttribute('data-col'));
          return {
            display: cs.display,
            flexDirection: cs.flexDirection,
            sections: sections.length,
            order,
          };
        });
        expect(data).not.toBeNull();
        expect(data!.display).toBe('flex');
        expect(data!.sections).toBe(2);
        expect(data!.flexDirection).toBe('column');
        expect(data!.order).toEqual(['perfil', 'trajetoria']);
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
        // mainStack via split(' · ') + Sep (ponto médio unificado)
        const stackRow = info.locator('dd', { hasText: 'Python' });
        await expect(stackRow).toContainText('TypeScript');
        await expect(stackRow).toContainText('React');
        await expect(
          stackRow.locator('span[aria-hidden="true"]'),
        ).toHaveCount(4);
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

        // Trajetória clean: 7 rows separadas em Trabalho (4) + Formação (3)
        const entries = page.locator('#sobre-content section[data-col="trajetoria"] li');
        await expect(entries).toHaveCount(7);
        await expect(entries.first()).toContainText('CESS');
        // Headings de seção Trabalho / Formação visíveis
        await expect(page.locator('#trajectory-work-title')).toHaveText('Trabalho');
        await expect(page.locator('#trajectory-edu-title')).toHaveText('Formação');
        // Sem summary longo, sem linha vertical
        await expect(entries.first()).not.toContainText('Especialização em IA e ML aplicada');
        await expect(page.locator('#sobre-content section[data-col="trajetoria"] .cross-mark')).toHaveCount(0);
        // Trabalho 4 + Formação 3
        await expect(page.locator('ul[aria-label="Trabalho"] > li')).toHaveCount(4);
        await expect(page.locator('ul[aria-label="Formação"] > li')).toHaveCount(3);
      });

      test('trajetória clean: duas listas Trabalho/Formação com Company / Role e period, sem linha vertical ou yearRange', async ({
        page,
      }) => {
        await gotoHome(page);
        const data = await page.evaluate(() => {
          const workUl = document.querySelector('ul[aria-label="Trabalho"]') as HTMLElement | null;
          const eduUl = document.querySelector('ul[aria-label="Formação"]') as HTMLElement | null;
          if (!workUl || !eduUl) return null;
          const workItems = Array.from(workUl.querySelectorAll(':scope > li')).map((li) => {
            const period = li.querySelector('span.trajectory-period')?.textContent?.trim() ?? '';
            const companyRole = li.querySelector('span.min-w-0')?.textContent?.trim() ?? '';
            return { period, companyRole, kind: 'work' };
          });
          const eduItems = Array.from(eduUl.querySelectorAll(':scope > li')).map((li) => {
            const period = li.querySelector('span.trajectory-period')?.textContent?.trim() ?? '';
            const companyRole = li.querySelector('span.min-w-0')?.textContent?.trim() ?? '';
            return { period, companyRole, kind: 'education' };
          });
          return { workItems, eduItems };
        });
        expect(data).not.toBeNull();
        expect(data!.workItems.length).toBe(4);
        expect(data!.eduItems.length).toBe(3);
        // Primeiro trabalho deve ser CESS 2022 — presente (mais recente work)
        expect(data!.workItems[0].period).toContain('2022');
        expect(data!.workItems[0].companyRole).toContain('CESS');
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
        for (const item of [...data!.workItems, ...data!.eduItems]) {
          expect(item.period).not.toHaveLength(0);
          expect(item.companyRole).not.toHaveLength(0);
        }
        // Headings existem
        await expect(page.locator('#trajectory-work-title')).toHaveText('Trabalho');
        await expect(page.locator('#trajectory-edu-title')).toHaveText('Formação');
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
        await expect(page.locator('#trajectory-work-title')).toHaveText('Work');
        await expect(page.locator('#trajectory-edu-title')).toHaveText('Education');
        await expect(page.locator('ul[aria-label="Work"] > li').first()).toContainText('CESS');
        await expect(page.locator('ul[aria-label="Education"] > li').first()).toContainText(
          'Universidade Católica',
        );
        await expect(page.locator('ul[aria-label="Work"] > li')).toHaveCount(4);
        await expect(page.locator('ul[aria-label="Education"] > li')).toHaveCount(3);
      });
    });
  }
});