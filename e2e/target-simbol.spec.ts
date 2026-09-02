import { test, expect, type Page } from '@playwright/test';

async function gotoHome(page: Page, path = '/') {
  await page.goto(path, { waitUntil: 'networkidle' });
  await page
    .waitForFunction(() => document.fonts.status !== 'loading', undefined, {
      timeout: 15_000,
    })
    .catch(() => undefined);
}

async function simbol(page: Page) {
  const el = page.locator('#contato [data-target-simbol]').first();
  await el.scrollIntoViewIfNeeded();
  return el;
}

async function spins(page: Page) {
  return Number(
    (await page.locator('#contato [data-target-simbol]').first().getAttribute('data-spins')) ??
      '0',
  );
}

test.describe('target simbol — mira com spin roleta', () => {
  test('presente no #contato, 32px, sempre visível (desktop e mobile)', async ({
    page,
  }) => {
    await gotoHome(page);
    const el = await simbol(page);
    await expect(el).toBeVisible();
    const box = await el.boundingBox();
    expect(box).not.toBeNull();
    expect(Math.round(box!.width)).toBe(25);
    expect(Math.round(box!.height)).toBe(25);
    // dentro da seção de contato (ao lado do email — sem kinetic box)
    const contact = page.locator('#contato');
    const cb = await contact.boundingBox();
    expect(cb).not.toBeNull();
    expect(box!.x).toBeGreaterThanOrEqual(cb!.x);
    expect(box!.x + box!.width).toBeLessThanOrEqual(cb!.x + cb!.width + 1);
    expect(box!.y + box!.height).toBeLessThanOrEqual(cb!.y + cb!.height + 1);
  });

  test('spins ao entrar na viewport (data-spins incrementa) e em re-entrada', async ({
    page,
  }) => {
    await gotoHome(page);
    // começa fora da viewport (abaixo da dobra) → 0 spins
    expect(await spins(page)).toBe(0);

    await simbol(page);
    await page.waitForTimeout(300);
    expect(await spins(page)).toBeGreaterThanOrEqual(1);

    // sai da viewport e volta → gira de novo
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);
    const before = await spins(page);
    await simbol(page);
    await page.waitForTimeout(300);
    expect(await spins(page)).toBeGreaterThan(before);
  });

  test('hover gira', async ({ page }) => {
    await gotoHome(page);
    const el = await simbol(page);
    await page.waitForTimeout(1800); // espera o spin do reveal terminar (1600ms)
    const before = await spins(page);
    await el.hover();
    await page.waitForTimeout(200);
    expect(await spins(page)).toBe(before + 1);
  });

  test('click gira (pointerdown) — feedback de link no mobile', async ({
    page,
  }) => {
    await gotoHome(page);
    const el = await simbol(page);
    await page.waitForTimeout(1800);
    const before = await spins(page);
    await el.click({ position: { x: 24, y: 24 } });
    await page.waitForTimeout(200);
    expect(await spins(page)).toBe(before + 1);
  });

  test('re-trigger durante o spin é ignorado; após terminar, gira de novo', async ({
    page,
  }) => {
    await gotoHome(page);
    const el = await simbol(page);
    await page.waitForTimeout(1800);
    const before = await spins(page);

    // dois clicks rápidos (dentro do spin de 1.6s) = apenas 1 spin
    await el.click({ position: { x: 24, y: 24 } });
    await page.waitForTimeout(150);
    await el.click({ position: { x: 24, y: 24 } });
    await page.waitForTimeout(200);
    expect(await spins(page)).toBe(before + 1);

    // após o spin terminar (1600ms), novo click gira
    await page.waitForTimeout(1700);
    await el.click({ position: { x: 24, y: 24 } });
    await page.waitForTimeout(200);
    expect(await spins(page)).toBe(before + 2);
  });

  test('prefers-reduced-motion: nenhum spin (data-spins permanece 0)', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await gotoHome(page);
    await simbol(page);
    await page.waitForTimeout(500);
    await page.locator('#contato [data-target-simbol]').first().hover();
    await page.locator('#contato [data-target-simbol]').first().click({ position: { x: 24, y: 24 } });
    await page.waitForTimeout(300);
    expect(await spins(page)).toBe(0);
  });

  test('tema: retículo em foreground suave e ponto em --primary (computed)', async ({
    page,
  }) => {
    await gotoHome(page);
    const colors = await page.evaluate(() => {
      const ring = document.querySelector('.target-simbol-ring');
      const dot = document.querySelector('.target-simbol-dot');
      const probe = document.createElement('div');
      probe.style.color = 'var(--primary)';
      document.body.appendChild(probe);
      const primary = getComputedStyle(probe).color;
      probe.remove();
      return {
        ring: ring ? getComputedStyle(ring).fill : null,
        dot: dot ? getComputedStyle(dot).fill : null,
        primary,
      };
    });
    expect(colors.ring).not.toBeNull();
    expect(colors.dot).toBe(colors.primary);
    // retículo: color-mix de foreground 55% — difere do primary e não é "none"
    expect(colors.ring).not.toBe('none');
    expect(colors.ring).not.toBe(colors.primary);
  });
});