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

      test('coluna esquerda: título, descrição e 4 canais com COPIAR', async ({
        page,
      }) => {
        await gotoHome(page);
        const info = page.locator('#contato-content > div').first();
        await expect(info.getByRole('heading', { level: 3 })).toContainText(
          /precisa de um/i,
        );
        await expect(info).toContainText('Resposta em');
        const items = info.locator('ul > li');
        await expect(items).toHaveCount(4);
        await expect(info.getByText('in/andersonlimacrv')).toBeVisible();
        await expect(info.getByText('+55 53 98100-4874')).toBeVisible();
        await expect(info.getByText('contato@andersonlimacrv.com')).toBeVisible();
        await expect(info.getByText('Pelotas, Rio Grande do Sul, Brasil')).toBeVisible();
        await expect(info.getByRole('button', { name: 'COPIAR' })).toHaveCount(4);
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
    });
  }

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
