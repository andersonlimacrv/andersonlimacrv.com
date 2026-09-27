import { test, expect, type Page } from '@playwright/test';

const VIEWPORTS = [
  { name: 'desktop', width: 1280, height: 800 },
  { name: 'mobile', width: 390, height: 844 },
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

test.describe('seção Contato enriquecida', () => {
  for (const vp of VIEWPORTS) {
    test.describe(vp.name, () => {
      test.use({ viewport: { width: vp.width, height: vp.height } });

      test('layout: duas colunas no desktop, empilhadas no mobile', async ({
        page,
      }) => {
        await gotoHome(page);
        const data = await page.evaluate(() => {
          const grid = document.querySelector('#contato-content') as HTMLElement | null;
          if (!grid) return null;
          const cs = getComputedStyle(grid);
          const kids = Array.from(grid.children);
          return { display: cs.display, flexDirection: cs.flexDirection, kids: kids.length };
        });
        expect(data).not.toBeNull();
        expect(data!.display).toBe('flex');
        expect(data!.kids).toBe(2);
        if (vp.name === 'desktop') expect(data!.flexDirection).toBe('row');
        else expect(data!.flexDirection).toBe('column');
      });

      test('estrutura clean: sem divide vertical no desktop', async ({
        page,
      }) => {
        await gotoHome(page);
        const second = page.locator('#contato-content > div').nth(1);
        await second.scrollIntoViewIfNeeded();
        const left = await second.evaluate(
          (el: HTMLElement) => window.getComputedStyle(el).borderLeftWidth,
        );
        if (vp.name === 'desktop') expect(left).toBe('0px');
        else {
          // mobile: sem divisor entre colunas empilhadas (design clean)
          const first = page.locator('#contato-content > div').first();
          const bottom = await first.evaluate(
            (el: HTMLElement) =>
              window.getComputedStyle(el).borderBottomWidth,
          );
          expect(bottom).toBe('0px');
        }
      });

      test('coluna esquerda: título, descrição e 3 canais com COPIAR', async ({
        page,
      }) => {
        await gotoHome(page);
        const info = page.locator('#contato-content > div').first();
        await expect(info.getByRole('heading', { level: 3 })).toContainText(
          /precisa de um/i,
        );
        await expect(info).toContainText('Resposta em');
        const items = info.locator('ul > li');
        await expect(items).toHaveCount(3);
        await expect(info.getByText('in/andersonlimacrv')).toBeVisible();
        await expect(info.getByText('+55 53 98100-4874')).toBeVisible();
        await expect(info.getByText('contato@andersonlimacrv.com')).toBeVisible();
        await expect(info.getByRole('button', { name: 'COPIAR' })).toHaveCount(3);
      });

      test('formulário: campos, 8 assuntos (CONTATO default) e contador 0/1000', async ({
        page,
      }) => {
        await gotoHome(page);
        const form = page.locator('#contact-form');
        await expect(form.locator('#contact-name')).toBeVisible();
        await expect(form.locator('#contact-email')).toBeVisible();
        await expect(form.locator('input[name="subject"]')).toHaveCount(8);
        await expect(form.locator('input[name="subject"]:checked')).toHaveValue(
          'Contato',
        );
        await expect(form.locator('#contact-message')).toHaveAttribute(
          'maxlength',
          '1000',
        );
        await expect(form.locator('#contact-counter')).toHaveText('0/1000');
        await expect(
          form.getByRole('button', { name: /enviar por e-mail/i }),
        ).toBeVisible();
        // sem JS o href é o wa.me base; com JS ele já nasce com ?text= (campos vazios)
        await expect(form.getByRole('link', { name: /mensagem direta/i })).toHaveAttribute(
          'href',
          /^https:\/\/wa\.me\/5553981004874/,
        );
      });

      test('contador atualiza em tempo real ao digitar', async ({ page }) => {
        await gotoHome(page);
        const message = page.locator('#contact-message');
        await message.fill('hello');
        await expect(page.locator('#contact-counter')).toHaveText('5/1000');
      });

      test('validação: submit vazio mostra erros inline sem navegar', async ({
        page,
      }) => {
        await gotoHome(page);
        await page.locator('#contact-form button[type="submit"]').click();
        await expect(page.locator('#contact-name-error')).toHaveText(
          'Campo obrigatório.',
        );
        await expect(page.locator('#contact-email-error')).toHaveText(
          'Campo obrigatório.',
        );
        await expect(page.locator('#contact-message-error')).toHaveText(
          'Campo obrigatório.',
        );
        expect(page.url()).toContain('/');
        // sem alert(): nenhum dialog nativo
        let dialoged = false;
        page.on('dialog', () => {
          dialoged = true;
        });
        await page.waitForTimeout(200);
        expect(dialoged).toBe(false);
      });

      test('validação: e-mail inválido mostra erro específico', async ({
        page,
      }) => {
        await gotoHome(page);
        await page.locator('#contact-name').fill('Ada');
        await page.locator('#contact-email').fill('nao-e-email');
        await page.locator('#contact-message').fill('Oi');
        await page.locator('#contact-form button[type="submit"]').click();
        await expect(page.locator('#contact-email-error')).toHaveText(
          'Informe um e-mail válido.',
        );
      });

      test('mensagem direta: href wa.me atualizado com dados digitados', async ({
        page,
      }) => {
        await gotoHome(page);
        await page.locator('#contact-name').fill('Ada');
        await page.locator('#contact-email').fill('ada@empresa.com');
        await page.locator('#contact-message').fill('Oi');
        const href = await page
          .locator('#contact-direct')
          .getAttribute('href');
        expect(href).toContain('https://wa.me/5553981004874?text=');
        expect(decodeURIComponent(href ?? '')).toContain('Ada');
      });

      test('copiar: botão muda para COPIADO e clipboard recebe o valor', async ({
        page,
        context,
      }) => {
        await context.grantPermissions(['clipboard-read', 'clipboard-write']);
        await gotoHome(page);
        const copyBtn = page
          .locator('#contato-content li', { hasText: 'E-mail' })
          .getByRole('button');
        await copyBtn.click();
        await expect(copyBtn).toHaveText(/copiado/i);
        expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
          'contato@andersonlimacrv.com',
        );
      });

      test('sem overflow horizontal', async ({ page }) => {
        await gotoHome(page);
        const overflow = await page.evaluate(() => {
          return document.documentElement.scrollWidth - document.documentElement.clientWidth;
        });
        expect(overflow).toBeLessThanOrEqual(0);
      });

      test('nome e e-mail empilhados no mobile', async ({ page }) => {
        await gotoHome(page);
        const data = await page.evaluate(() => {
          const name = document.querySelector('#contact-name')?.getBoundingClientRect();
          const email = document.querySelector('#contact-email')?.getBoundingClientRect();
          if (!name || !email) return null;
          return { nameBottom: name.bottom, emailTop: email.top, nameLeft: name.left, emailLeft: email.left };
        });
        expect(data).not.toBeNull();
        if (vp.name === 'mobile') {
          expect(data!.emailTop).toBeGreaterThanOrEqual(data!.nameBottom - 2);
        } else {
          // desktop: lado a lado (mesma linha)
          expect(Math.abs(data!.emailTop - data!.nameBottom)).toBeGreaterThan(0);
          expect(data!.emailLeft).toBeGreaterThan(data!.nameLeft);
        }
      });

      test('canais: corners abraçam só o link (desktop)', async ({
        page,
      }) => {
        if (vp.name !== 'desktop') return;
        await gotoHome(page);
        const row = page.locator('#contato-content ul > li').first();
        await row.scrollIntoViewIfNeeded();
        // reveal (translateY 0.6s) precisa terminar antes de comparar caixas
        await page.waitForTimeout(800);
        const link = row.locator('a.cursor-target');
        const linkBox = (await link.boundingBox())!;
        const rowBox = (await row.boundingBox())!;
        // link encolhido ao conteúdo, bem mais estreito que a linha
        expect(linkBox.width).toBeLessThan(rowBox.width - 100);
        await link.hover();
        await expect(link).toHaveClass(/is-target-hovering/, {
          timeout: 5_000,
        });
        await page.waitForTimeout(400);
        for (const corner of await link
          .locator('.target-hover-corner')
          .all()) {
          const cb = (await corner.boundingBox())!;
          // offset padrão 8px: canto dentro do link ± 9px
          expect(cb.x).toBeGreaterThanOrEqual(linkBox.x - 9);
          expect(cb.x + cb.width).toBeLessThanOrEqual(
            linkBox.x + linkBox.width + 9,
          );
        }
      });

      test('assuntos preenchem a linha sem tocar as bordas', async ({
        page,
      }) => {
        for (const path of ['/', '/es/', '/en/']) {
          await gotoHome(page, path);
          const container = page.locator('#contact-form fieldset div.flex');
          await container.scrollIntoViewIfNeeded();
          // reveal (translateY 0.6s) precisa terminar: boundingBox no meio
          // da transição quebra o agrupamento por linha
          await page.waitForTimeout(800);
          const cbox = (await container.boundingBox())!;
          // PASSADA ÚNICA de medidas — nada de re-query entre asserções
          const items: Array<{
            x: number;
            y: number;
            width: number;
            single: boolean;
            fits: boolean;
          }> = [];
          for (const label of await container
            .locator('label.cursor-target')
            .all()) {
            const b = (await label.boundingBox())!;
            const span = label.locator('span').first();
            const m = await span.evaluate(
              (el: HTMLElement, w: number) => {
                const cs = window.getComputedStyle(el);
                const pad =
                  parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
                const range = document.createRange();
                range.selectNodeContents(el.firstChild!);
                const tw = range.getBoundingClientRect().width;
                return {
                  single: el.scrollHeight <= el.clientHeight + 2,
                  fits: tw + pad <= w + 1,
                };
              },
              b.width,
            );
            items.push({ x: b.x, y: b.y, width: b.width, ...m });
          }
          expect(items.length).toBeGreaterThanOrEqual(2);
          const rows = new Map<number, typeof items>();
          for (const it of items) {
            const key = Math.round(it.y);
            if (!rows.has(key)) rows.set(key, []);
            rows.get(key)!.push(it);
            // texto em linha única e sem encostar/transbordar as bordas
            expect(it.single).toBe(true);
            expect(it.fits).toBe(true);
          }
          for (const row of rows.values()) {
            // fileira cheia (larguras variam por conteúdo — sem exigência
            // de igualdade): primeira borda ≈ container, última ≈ container
            const lefts = row.map((it) => it.x);
            const rights = row.map((it) => it.x + it.width);
            expect(Math.min(...lefts)).toBeLessThanOrEqual(cbox.x + 3);
            expect(Math.max(...rights)).toBeGreaterThanOrEqual(
              cbox.x + cbox.width - 3,
            );
          }
          // padding mínimo da página nos pills
          const pill = container.locator('label.cursor-target > span').first();
          await expect(pill).toHaveCSS('padding-left', '16px');
        }
      });
    });
  }

  test('submit tem TargetHover visível no desktop (alvo preenchido)', async ({
    page,
  }) => {
    await gotoHome(page);
    const submit = page.locator('#contact-form button[type="submit"]');
    await expect(submit).toHaveClass(/cursor-target-filled/);
    await expect(submit.locator('.target-hover-corner')).toHaveCount(4);
    await submit.scrollIntoViewIfNeeded();
    await submit.hover();
    await expect(submit).toHaveClass(/is-target-hovering/, { timeout: 2000 });
    // cantos contrastam com o fundo da página (não herdam o texto claro)
    const colors = await submit
      .locator('.target-hover-corner--tl')
      .evaluate((el) => getComputedStyle(el).borderTopColor);
    const bg = await page.evaluate(
      () => getComputedStyle(document.body).backgroundColor,
    );
    expect(colors).not.toBe(bg);
  });

  test('copiar: mesma largura antes e depois, nos 3 idiomas', async ({
    page,
  }) => {
    for (const path of ['/', '/es/', '/en/']) {
      await gotoHome(page, path);
      const btns = page.locator('#contato-content button[data-copy]');
      expect(await btns.count()).toBe(3);
      const widths = async () => {
        const ws: number[] = [];
        for (const b of await btns.all()) {
          ws.push((await b.boundingBox())!.width);
        }
        return ws;
      };
      const before = await widths();
      expect(Math.max(...before) - Math.min(...before)).toBeLessThanOrEqual(
        1,
      );
      await btns.first().click();
      await page.waitForTimeout(400); // troca para COPIADO
      const after = await widths();
      expect(Math.max(...after) - Math.min(...after)).toBeLessThanOrEqual(1);
      // sem overflow do TEXTO (corners absolutos extrapolam 8px de
      // propósito e incham o scrollWidth — mede só o nó de texto)
      for (const b of await btns.all()) {
        const fits = await b.evaluate((el: HTMLElement) => {
          const cs = window.getComputedStyle(el);
          const pad =
            parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
          const range = document.createRange();
          range.selectNodeContents(el.firstChild!);
          return (
            range.getBoundingClientRect().width + pad <= el.clientWidth + 1
          );
        });
        expect(fits).toBe(true);
        const pad = await b.evaluate(
          (el: HTMLElement) => window.getComputedStyle(el).paddingLeft,
        );
        expect(pad).toBe('16px');
      }
    }
  });

  test('mensagem direta com contraste foreground nos dois temas', async ({
    page,
  }) => {
    for (const theme of ['light', 'dark'] as const) {
      await page.emulateMedia({ colorScheme: theme });
      await gotoHome(page);
      const direct = page.locator('#contact-direct');
      await direct.scrollIntoViewIfNeeded();
      const ref = page.locator('#contato-content h3').first();
      const color = (loc: typeof direct) =>
        loc.evaluate((el: HTMLElement) => window.getComputedStyle(el).color);
      expect(await color(direct)).toBe(await color(ref));
    }
  });

  test('localização: título e ações em inglês em /en/', async ({ page }) => {
    await gotoHome(page, '/en/');
    await expect(
      page.locator('#contato-content h3').first(),
    ).toContainText('Need an engineer');
    await expect(
      page.locator('#contact-form button[type="submit"]'),
    ).toHaveText('Send via email');
    await expect(page.locator('#contact-direct')).toHaveText('Direct message');
  });

  test('localização: título e ações em espanhol em /es/', async ({ page }) => {
    await gotoHome(page, '/es/');
    await expect(
      page.locator('#contato-content h3').first(),
    ).toContainText('¿Necesitas un ingeniero');
    await expect(
      page.locator('#contact-form button[type="submit"]'),
    ).toHaveText('Enviar por correo');
    await expect(page.locator('#contact-direct')).toHaveText('Mensaje directo');
  });
});
