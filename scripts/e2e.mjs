import { execSync, spawn } from 'node:child_process';

const BASE_URL = 'http://localhost:4321';
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
    ['node_modules/astro/bin/astro.mjs', 'preview', '--port', '4321'],
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
