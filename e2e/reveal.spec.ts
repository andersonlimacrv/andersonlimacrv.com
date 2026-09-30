import { test, expect, type Page } from '@playwright/test';

async function gotoHome(page: Page, path = '/') {
  await page.goto(path, { waitUntil: 'networkidle' });
  await page
    .waitForFunction(() => document.fonts.status !== 'loading', undefined, {
      timeout: 15_000,
    })
    .catch(() => undefined);
}

async function revealState(page: Page) {
  return page.evaluate(() => {
    const els = Array.from(document.querySelectorAll('[data-reveal]'));
    return {
      present: document.documentElement.classList.contains('reveal-present'),
      els: els.map((el) => ({
        opacity: Number(getComputedStyle(el).opacity),
        visible: el.classList.contains('is-visible'),
      })),
    };
  });
}

test.describe('reveal — transições de entrada das seções', () => {
  test('home: abaixo da dobra começa oculto e aparece ao scroll (acima revela no load)', async ({
    page,
  }) => {
    await gotoHome(page);
    await page.waitForTimeout(500);

    const state = await revealState(page);
    expect(state.present).toBe(true);
    expect(state.els.length).toBeGreaterThanOrEqual(10);
    const belowFoldHidden = await page.evaluate(() => {
      const vh = window.innerHeight;
      return Array.from(document.querySelectorAll('[data-reveal]'))
        .filter(
          (el) =>
            el.getBoundingClientRect().top > vh &&
            !el.closest('section#hero'),
        )
        .every((el) => Number(getComputedStyle(el).opacity) === 0);
    });
    expect(belowFoldHidden).toBe(true);

    const height = await page.evaluate(() => document.body.scrollHeight);
    const steps = Math.max(4, Math.ceil(height / 500));
    for (let i = 1; i <= steps; i++) {
      await page.evaluate((y) => window.scrollTo(0, y), (height * i) / steps);
      await page.waitForTimeout(250);
    }
    await page.evaluate((h) => window.scrollTo(0, h), height);
    // stagger (até 480ms) + 0,7s: fim é por poll, nunca por wait fixo
    await expect
      .poll(
        async () =>
          revealState(page).then(
            (s) => s.els.every((e) => e.opacity === 1) && s.els.every((e) => e.visible),
          ),
        { timeout: 15000 },
      )
      .toBe(true);
  });

  test('stagger: itens do grupo entram em ordem com delays 0–240ms', async ({
    page,
  }) => {
    await gotoHome(page);
    const delays = await page.evaluate(() => {
      const links = Array.from(
        document.querySelectorAll(
          '#sobre-content nav[data-reveal-group] a[data-reveal]',
        ),
      );
      return links.map((el) => getComputedStyle(el).transitionDelay);
    });
    expect(delays).toEqual(['0s', '0.06s', '0.12s', '0.18s', '0.24s']);
  });

  test('ClientRouter: round-trip home → /blog → home re-arma o reveal (present reaplicado e nenhuma seção presa oculta)', async ({
    page,
  }) => {
    await gotoHome(page);
    await page.waitForTimeout(400);

    await page.click('a[href="/blog"]');
    await page.waitForURL('**/blog');
    await expect
      .poll(() => revealState(page).then((s) => s.present), { timeout: 10000 })
      .toBe(true);
    const onBlog = await revealState(page);
    expect(onBlog.els.length).toBeGreaterThanOrEqual(1);

    await page.click('header a[href="/"]');
    await page.waitForURL(page.url().replace(/\/blog.*/, '/'));
    await expect
      .poll(() => revealState(page).then((s) => s.present), { timeout: 10000 })
      .toBe(true);
    const back = await revealState(page);
    expect(back.els.length).toBeGreaterThanOrEqual(5);

    const height = await page.evaluate(() => document.body.scrollHeight);
    const steps = Math.max(4, Math.ceil(height / 500));
    for (let i = 1; i <= steps; i++) {
      await page.evaluate((y) => window.scrollTo(0, y), (height * i) / steps);
      await page.waitForTimeout(150);
    }
    await expect
      .poll(
        () =>
          revealState(page).then((s) => s.els.every((e) => e.opacity === 1)),
        { timeout: 10000 },
      )
      .toBe(true);
  });

  test('/blog: posts revelam ao scroll', async ({ page }) => {
    await gotoHome(page, '/blog');
    await page.waitForTimeout(500);

    const before = await revealState(page);
    expect(before.present).toBe(true);
    expect(before.els.length).toBeGreaterThanOrEqual(1);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect
      .poll(
        async () =>
          revealState(page).then((s) => s.els.every((e) => e.opacity === 1)),
        { timeout: 15000 },
      )
      .toBe(true);
  });

  test('reduced-motion: tudo visível imediatamente, sem depender de scroll', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await gotoHome(page);
    await page.waitForTimeout(400);

    const state = await revealState(page);
    expect(state.present).toBe(true);
    expect(state.els.every((e) => e.opacity === 1)).toBe(true);
    expect(state.els.every((e) => e.visible)).toBe(true);
  });

  test('cascata: utilitário Tailwind vence regra customizada (layers)', async ({
    page,
  }) => {
    await gotoHome(page);
    await page.waitForTimeout(400);

    const opacity = await page.evaluate(() => {
      const probe = document.createElement('div');
      probe.setAttribute('data-reveal', '');
      probe.className = 'is-visible opacity-0';
      document.body.appendChild(probe);
      const value = getComputedStyle(probe).opacity;
      probe.remove();
      return value;
    });
    expect(opacity).toBe('0');
  });
});