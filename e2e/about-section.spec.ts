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

      test('layout: duas colunas (perfil/dados) + trajetória abaixo (grid responsivo)', async ({
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
          const trajetoria = document.querySelector(
            '#sobre-content > section[data-col="trajetoria"]',
          );
          const gridRect = grid.getBoundingClientRect();
          const trajRect = trajetoria?.getBoundingClientRect();
          return {
            display: cs.display,
            flexDirection: cs.flexDirection,
            order,
            trajBelow: trajRect !== undefined && trajRect.top >= gridRect.bottom - 1,
          };
        });
        expect(data).not.toBeNull();
        expect(data!.display).toBe('flex');
        expect(data!.order).toEqual(['perfil', 'dados']);
        expect(data!.trajBelow).toBe(true);
        // desktop: row; mobile: column
        if (vp.name === 'desktop') expect(data!.flexDirection).toBe('row');
        else expect(data!.flexDirection).toBe('column');
      });

      test('colunas lado a lado no desktop, empilhadas no mobile', async ({
        page,
      }) => {
        await gotoHome(page);
        const data = await page.evaluate(() => {
          const perfil = document
            .querySelector('#sobre-content section[data-col="perfil"]')
            ?.getBoundingClientRect();
          const dados = document
            .querySelector('#sobre-content section[data-col="dados"]')
            ?.getBoundingClientRect();
          if (!perfil || !dados) return null;
          return {
            dadosLeft: dados.left,
            perfilRight: perfil.right,
            dadosTop: dados.top,
            perfilBottom: perfil.bottom,
          };
        });
        expect(data).not.toBeNull();
        if (vp.name === 'desktop') {
          // lado a lado: dados à direita do perfil, com sobreposição vertical
          expect(data!.dadosLeft).toBeGreaterThan(data!.perfilRight - TOLERANCE_PX);
          expect(data!.dadosTop).toBeLessThan(data!.perfilBottom - TOLERANCE_PX);
        } else {
          // empilhado: dados abaixo do perfil
          expect(data!.dadosTop).toBeGreaterThanOrEqual(data!.perfilBottom - TOLERANCE_PX);
        }
      });

      test('conteúdo: role/stack/location/bio na coluna dados (sem dl); frase e sociais na coluna perfil', async ({
        page,
      }) => {
        await gotoHome(page);

        // sem dl/dt/dd — blocos "título + conteúdo" diretos
        const dlCount = await page.evaluate(
          () => document.querySelectorAll('#sobre-content dl').length,
        );
        expect(dlCount).toBe(0);

        const dados = page.locator('#sobre-content section[data-col="dados"]');
        await expect(dados.getByText('Engenheiro de Software')).toBeVisible();
        await expect(dados.getByText('Empreendedor')).toBeVisible();
        await expect(dados.getByText('Arquiteto de Soluções')).toBeVisible();
        await expect(dados.getByText('TypeScript').first()).toBeVisible();
        await expect(dados.getByText('CI/CD').first()).toBeVisible();
        await expect(dados.getByText('Pelotas, Rio Grande do Sul, Brasil').first()).toBeVisible();
        // stack principal separado por Sep (8 itens → 7 separadores)
        const stackRow = dados.locator('div.py-2', { hasText: 'Stack principal' }).locator('p');
        await expect(stackRow.locator('span[aria-hidden="true"]')).toHaveCount(7);

        const perfil = page.locator('#sobre-content section[data-col="perfil"]');
        const quote = perfil.locator('blockquote p');
        await expect(quote).not.toHaveText('');
        await expect(perfil.locator('blockquote')).toContainText('Faço web pensando em quem lê');

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

      test('tipografia do perfil: label (10-12px), conteúdo (14px), quote serif itálico', async ({
        page,
      }) => {
        await gotoHome(page);
        const data = await page.evaluate(() => {
          const dados = document.querySelector(
            '#sobre-content section[data-col="dados"]',
          );
          const title = dados?.querySelector('span');
          const content = dados?.querySelector('p');
          const quote = document.querySelector('#sobre-content blockquote p');
          const csTitle = title ? getComputedStyle(title) : null;
          const csContent = content ? getComputedStyle(content) : null;
          const csQuote = quote ? getComputedStyle(quote) : null;
          return {
            titleSize: csTitle ? parseFloat(csTitle.fontSize) : -1,
            contentSize: csContent ? parseFloat(csContent.fontSize) : -1,
            quoteFamily: csQuote?.fontFamily ?? '',
            quoteStyle: csQuote?.fontStyle ?? '',
          };
        });
        // label eyebrow 10→12px
        expect(data.titleSize).toBeGreaterThanOrEqual(10);
        expect(data.titleSize).toBeLessThanOrEqual(12);
        // conteúdo body: responsivo 12px (mobile) → 14px (desktop)
        const expectedContent = vp.name === 'mobile' ? 12 : 14;
        expect(data.contentSize).toBe(expectedContent);
        // frase: serif itálico (estilo à parte)
        expect(data.quoteFamily).toContain('Fraunces');
        expect(data.quoteStyle).toBe('italic');
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
        const dados = page.locator('#sobre-content section[data-col="dados"]');
        await expect(dados.getByText('Role')).toBeVisible();
        await expect(dados.getByText('Main stack')).toBeVisible();
        await expect(dados.getByText('Software Engineer')).toBeVisible();
        await expect(dados.getByText('Entrepreneur')).toBeVisible();
        await expect(dados.getByText('Solutions Architect')).toBeVisible();
        await expect(dados.getByText('Pelotas, Rio Grande do Sul, Brazil').first()).toBeVisible();
        await expect(dados.getByText('TypeScript').first()).toBeVisible();
        await expect(dados.getByText('CI/CD').first()).toBeVisible();
        const stackRowEn = dados.locator('div.py-2', { hasText: 'Main stack' }).locator('p');
        await expect(stackRowEn.locator('span[aria-hidden="true"]')).toHaveCount(7);
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

      test('localização: rótulos e trajetória em espanhol em /es/', async ({
        page,
      }) => {
        await gotoHome(page, '/es/');
        const dados = page.locator('#sobre-content section[data-col="dados"]');
        await expect(dados.getByText('Rol', { exact: true })).toBeVisible();
        await expect(dados.getByText('Stack principal')).toBeVisible();
        await expect(dados.getByText('Ingeniero de Software')).toBeVisible();
        await expect(dados.getByText('Emprendedor')).toBeVisible();
        await expect(dados.getByText('Arquitecto de Soluciones')).toBeVisible();
        await expect(dados.getByText('Pelotas, Rio Grande do Sul, Brasil').first()).toBeVisible();
        await expect(dados.getByText('TypeScript').first()).toBeVisible();
        await expect(dados.getByText('CI/CD').first()).toBeVisible();
        const stackRowEs = dados.locator('div.py-2', { hasText: 'Stack principal' }).locator('p');
        await expect(stackRowEs.locator('span[aria-hidden="true"]')).toHaveCount(7);
        await expect(page.locator('#sobre-content blockquote p')).toContainText(
          'Hago web pensando',
        );
        await expect(page.locator('#trajectory-work-title')).toHaveText('Trabajo');
        await expect(page.locator('#trajectory-edu-title')).toHaveText('Formación');
        await expect(page.locator('ul[aria-label="Trabajo"] > li').first()).toContainText('CESS');
        await expect(page.locator('ul[aria-label="Formación"] > li').first()).toContainText(
          'Universidade Católica',
        );
        await expect(page.locator('ul[aria-label="Trabajo"] > li')).toHaveCount(4);
        await expect(page.locator('ul[aria-label="Formación"] > li')).toHaveCount(3);
      });
    });
  }
});