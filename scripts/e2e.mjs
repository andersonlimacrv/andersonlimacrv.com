import { execSync, spawn } from 'node:child_process';

// Porta dedicada aos e2e — NÃO usar 4321 (default do `astro dev`): se o
// desenvolvedor tiver o dev server rodando, o Playwright testaria contra o
// dev server (com Dev Toolbar injetando elementos) em vez do preview.
const PORT = 4322;
const BASE_URL = `http://localhost:${PORT}`;
const cwd = process.cwd();

function sh(cmd) {
  execSync(cmd, { cwd, stdio: 'inherit' });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function isUp() {
  try {
    const res = await fetch(BASE_URL, { signal: AbortSignal.timeout(3000) });
    return res.ok;
  } catch {
    return false;
  }
}

async function ensureServer() {
  if (await isUp()) {
    return false;
  }
  spawn(
    process.execPath,
    ['node_modules/astro/bin/astro.mjs', 'preview', '--port', String(PORT)],
    { cwd, detached: true, stdio: 'ignore' },
  ).unref();
  const started = Date.now();
  while (Date.now() - started < 90_000) {
    if (await isUp()) {
      return true;
    }
    await sleep(1000);
  }
  throw new Error('Servidor de preview não subiu em 90s');
}

sh('npm run build');

const started = await ensureServer();
try {
  sh('npx --no-install playwright test --reporter=list');
} finally {
  if (started) {
    try {
      execSync('node node_modules/astro/bin/astro.mjs preview stop', {
        cwd,
        stdio: 'ignore',
      });
    } catch {
      // já estava parado
    }
  }
}
