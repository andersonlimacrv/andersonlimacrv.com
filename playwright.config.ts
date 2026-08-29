import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    // 4322 (não 4321) para não colidir com o `astro dev` do desenvolvedor;
    // 127.0.0.1 (não localhost) para evitar resolução IPv4/IPv6 flaky do
    // Chromium contra o bind IPv6-only do astro — ver scripts/e2e.mjs.
    baseURL: 'http://127.0.0.1:4322',
    viewport: { width: 1280, height: 800 },
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },
  // Sem webServer aqui: o Astro 7 roda o dev/preview em daemon (o processo do
  // CLI sobe o servidor em background e sai), o que faz o Playwright reportar
  // "Process from config.webServer exited early". O servidor é garantido pelo
  // script scripts/e2e.mjs (npm run test:e2e), que reusa um existente, sobe o
  // daemon se preciso e o derruba no fim.
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  outputDir: 'test-results',
});