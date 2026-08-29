import { execSync, spawn } from 'node:child_process';

// Porta dedicada aos e2e — NÃO usar 4321 (default do `astro dev`): se o
// desenvolvedor tiver o dev server rodando, o Playwright testaria contra o
// dev server (com Dev Toolbar injetando elementos) em vez do preview.
// Host fixado em 127.0.0.1: o `astro` por padrão faz bind IPv6-only ([::1])
// e o localhost do Chromium às vezes resolve IPv4 → ERR_CONNECTION_REFUSED
// intermitente. 127.0.0.1 elimina a ambiguidade de resolução.
const HOST = '127.0.0.1';
const PORT = 4322;
const BASE_URL = `http://${HOST}:${PORT}`;
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
    ['node_modules/astro/bin/astro.mjs', 'preview', '--host', HOST, '--port', String(PORT)],
    { cwd, detached: true, stdio: 'ignore' },
  ).unref();
  const started = Date.now();
  while (Date.now() - started < 90_000) {
    if (await isUp()) {
      // Confirma estabilidade: 2 pings consecutivos separados por 400ms —
      // o daemon do Astro pode estar entre um restart e o 1º worker paralelo
      // do Playwright bater em ERR_CONNECTION_REFUSED.
      await sleep(400);
      if (await isUp()) {
        return true;
      }
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
