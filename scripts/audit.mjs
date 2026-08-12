import { execSync } from 'node:child_process';
import { readdirSync, statSync, readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, extname, relative } from 'node:path';
import { gzipSync } from 'node:zlib';

const ROOT = process.cwd();
const DIST = join(ROOT, 'dist');
const DOCS = join(ROOT, 'docs');

const EXT_CATEGORY = {
  '.html': 'html',
  '.css': 'css',
  '.js': 'js',
  '.mjs': 'js',
  '.webp': 'image',
  '.png': 'image',
  '.avif': 'image',
  '.jpg': 'image',
  '.jpeg': 'image',
  '.gif': 'image',
  '.svg': 'image',
  '.woff': 'font',
  '.woff2': 'font',
  '.xml': 'other',
  '.txt': 'other',
  '.webmanifest': 'other',
};

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

function formatBytes(n) {
  if (n > 1024 * 1024) return `${(n / (1024 * 1024)).toFixed(2)} MB`;
  if (n > 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${n} B`;
}

function audit() {
  const files = walk(DIST).filter((p) => !p.includes('_astro/client') || true);
  const byCategory = {};
  let total = 0;
  let gzipTotal = 0;
  const fonts = [];
  const js = [];

  for (const f of files) {
    const ext = extname(f).toLowerCase();
    const cat = EXT_CATEGORY[ext] ?? 'other';
    const size = statSync(f).size;
    const gz = gzipSync(readFileSync(f)).length;
    byCategory[cat] = (byCategory[cat] ?? 0) + size;
    total += size;
    gzipTotal += gz;
    if (cat === 'font') fonts.push({ name: relative(DIST, f), size });
    if (cat === 'js') js.push({ name: relative(DIST, f), size, gzip: gz });
  }

  // Validação básica de SEO nos HTMLs gerados.
  const htmlFiles = files.filter((p) => p.endsWith('.html'));
  const seo = { pages: htmlFiles.length, jsonld: 0, jsonldErrors: [], noDescription: [], noCanonical: [] };

  for (const f of htmlFiles) {
    const html = readFileSync(f, 'utf8');
    if (!/<meta name="description"/.test(html)) seo.noDescription.push(relative(DIST, f));
    if (!/rel="canonical"/.test(html)) seo.noCanonical.push(relative(DIST, f));
    const blocks = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
    seo.jsonld += blocks.length;
    for (const [, raw] of blocks) {
      try {
        JSON.parse(raw);
      } catch {
        seo.jsonldErrors.push(relative(DIST, f));
        break;
      }
    }
  }

  const sitemapExists = files.some((p) => p.endsWith('sitemap-index.xml'));
  const robotsExists = files.some((p) => p.endsWith('robots.txt'));
  const llmsExists = files.some((p) => p.endsWith('llms.txt'));

  return {
    date: new Date().toISOString(),
    total: { raw: total, gzip: gzipTotal },
    byCategory,
    files: files.length,
    fonts: fonts.sort((a, b) => b.size - a.size),
    js: js.sort((a, b) => b.size - a.size),
    seo,
    discovery: { sitemapExists, robotsExists, llmsExists },
  };
}

function render(a) {
  const lines = [];
  lines.push(`# Auditoria de performance & SEO — ${a.date.slice(0, 10)}`);
  lines.push('');
  lines.push(`- **Páginas HTML:** ${a.seo.pages}`);
  lines.push(`- **Arquivos no dist/:** ${a.files}`);
  lines.push(`- **Peso total:** ${formatBytes(a.total.raw)} (raw) / ${formatBytes(a.total.gzip)} (gzip)`);
  lines.push('');
  lines.push(`- **Fontes:** ${a.fonts.length}`);
  lines.push('');
  lines.push('## Peso por categoria (raw)');
  lines.push('');
  lines.push('| Categoria | Peso |');
  lines.push('| --- | --- |');
  for (const [cat, size] of Object.entries(a.byCategory).sort((x, y) => y[1] - x[1])) {
    lines.push(`| ${cat} | ${formatBytes(size)} |`);
  }
  lines.push('');
  lines.push('## Fontes');
  lines.push('');
  lines.push('| Arquivo | Peso |');
  lines.push('| --- | --- |');
  for (const f of a.fonts) lines.push(`| ${f.name} | ${formatBytes(f.size)} |`);
  lines.push('');
  lines.push('## JS');
  lines.push('');
  lines.push('| Arquivo | Peso | Gzip |');
  lines.push('| --- | --- | --- |');
  for (const f of a.js) lines.push(`| ${f.name} | ${formatBytes(f.size)} | ${formatBytes(f.gzip)} |`);
  lines.push('');
  lines.push('## SEO');
  lines.push('');
  lines.push(`- Blocos JSON-LD encontrados: ${a.seo.jsonld}`);
  lines.push(`- Erros de parse JSON-LD: ${a.seo.jsonldErrors.length === 0 ? 'nenhum' : a.seo.jsonldErrors.join(', ')}`);
  lines.push(`- Páginas sem meta description: ${a.seo.noDescription.length === 0 ? 'nenhuma' : a.seo.noDescription.join(', ')}`);
  lines.push(`- Páginas sem canonical: ${a.seo.noCanonical.length === 0 ? 'nenhuma' : a.seo.noCanonical.join(', ')}`);
  lines.push('');
  lines.push('## Descoberta');
  lines.push('');
  lines.push(`- sitemap-index.xml: ${a.discovery.sitemapExists ? 'OK' : 'FALTANDO'}`);
  lines.push(`- robots.txt: ${a.discovery.robotsExists ? 'OK' : 'FALTANDO'}`);
  lines.push(`- llms.txt: ${a.discovery.llmsExists ? 'OK' : 'FALTANDO'}`);
  lines.push('');
  return lines.join('\n');
}

function sign(n) {
  return n > 0 ? `+${n}` : `${n}`;
}

function compare(cur, base) {
  const lines = [];
  lines.push('== Comparação vs baseline ==');
  lines.push(`- Arquivos: ${base.files} -> ${cur.files} (${sign(cur.files - base.files)})`);
  lines.push(`- Peso raw: ${formatBytes(base.total.raw)} -> ${formatBytes(cur.total.raw)} (${sign(Math.round(cur.total.raw - base.total.raw))} B)`);
  lines.push(`- Peso gzip: ${formatBytes(base.total.gzip)} -> ${formatBytes(cur.total.gzip)} (${sign(Math.round(cur.total.gzip - base.total.gzip))} B)`);
  lines.push(`- Fontes: ${base.fonts.length} -> ${cur.fonts.length} (${sign(cur.fonts.length - base.fonts.length)})`);
  lines.push('');
  lines.push('| Categoria | Baseline | Atual | Diferença |');
  lines.push('| --- | --- | --- | --- |');
  const cats = new Set([...Object.keys(base.byCategory), ...Object.keys(cur.byCategory)]);
  for (const cat of [...cats].sort((a, b) => (cur.byCategory[b] ?? 0) - (cur.byCategory[a] ?? 0))) {
    const b = base.byCategory[cat] ?? 0;
    const c = cur.byCategory[cat] ?? 0;
    lines.push(`| ${cat} | ${formatBytes(b)} | ${formatBytes(c)} | ${sign(c - b)} B |`);
  }
  return lines.join('\n');
}

execSync('npm run build', { cwd: ROOT, stdio: 'inherit' });

mkdirSync(DOCS, { recursive: true });
const baselinePath = join(DOCS, 'audit-baseline.json');
const reportPath = join(DOCS, 'audit.md');

const auditResult = audit();

let baseline = null;
if (existsSync(baselinePath)) {
  baseline = JSON.parse(readFileSync(baselinePath, 'utf8'));
}

if (baseline) {
  writeFileSync(reportPath, render(auditResult), 'utf8');
  console.log(render(auditResult));
  console.log('');
  console.log(compare(auditResult, baseline));
  console.log(`\nRelatório gravado em docs/audit.md`);
} else {
  writeFileSync(baselinePath, JSON.stringify(auditResult, null, 2), 'utf8');
  writeFileSync(reportPath, render(auditResult), 'utf8');
  console.log(render(auditResult));
  console.log(`\nBaseline gravado em docs/audit-baseline.json`);
}
