// typography-audit — garante que TODA tipografia do site vem do registro
// TYPE em ui/Text.astro. Varre src/ e falha se qualquer utilitário
// tipográfico (font-*, text-{tamanho}, leading-*, tracking-*, uppercase,
// italic, font-weight etc.) aparecer fora de:
//   - ui/Text.astro (o registro)
//   - global.css (apenas o espelho .post-content — marcação de comentário)
//   - arquivos .ts (JS não define tipografia; classes dinâmicas referem TYPE)
//
// Uso: node scripts/typography-audit.mjs [--fail-on-violation]

import { readFileSync, readdirSync, writeFileSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const ROOT = process.cwd();
const SRC = join(ROOT, 'src');
const FAIL = process.argv.includes('--fail-on-violation');

// utilitários tipográficos a vigiar (fonte: família/peso/tamanho/leading/tracking/caixa)
const RE =
  /\b(font-(sans|mono|serif|normal|medium|semibold|bold|extrabold|light|thin))|(text-(hero|h1|h2|h3|lead|eyebrow|xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|\[[^\]]*\]))|(leading-(none|tight|snug|normal|relaxed|loose|\[[^\]]*\]))|(tracking-(tight|normal|wide|wider|widest|\[[^\]]*\]))|\buppercase\b|\bitalic\b/g;

const ALLOWED_FILES = new Set([
  'src/components/ui/Text.astro', // o registro TYPE
  'src/styles/global.css',        // espelho .post-content (verificado abaixo)
]);

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) out.push(...walk(p));
    else if (extname(p) === '.astro' || extname(p) === '.css' || extname(p) === '.ts') out.push(p);
  }
  return out;
}

// global.css: só o bloco .post-content pode conter tipografia (espelho).
// Tokens (@theme) e base (body/html) são a FUNDAÇÃO do sistema — permitidos.
function globalCssOnlyMirror(css) {
  const start = css.indexOf('/* ESPELHO do registro TYPE');
  if (start === -1) return false;
  const lines = css
    .slice(0, start)
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .split('\n');
  for (const line of lines) {
    const t = line.trim();
    // tokens de fonte/tamanho e a aplicação base do corpo — fundação legítima
    if (t.startsWith('--font-')) continue;
    if (t.startsWith('--text-') || t.startsWith('--tracking-')) continue;
    if (t.startsWith('/*') || t.startsWith('*') || t.startsWith('//')) continue;
    if (t.includes('font-family: var(--font-')) continue;
    if (t.includes('@theme') || t.includes('@layer') || t.startsWith(':root') || t.startsWith('.dark')) continue;
    if (new RegExp(RE.source, 'g').test(line)) return false;
  }
  return true;
}

const violations = [];
const files = walk(SRC);
for (const file of files) {
  const rel = file.replace(ROOT + '/', '');
  if (ALLOWED_FILES.has(rel)) continue;
  if (file.endsWith('.ts')) continue; // TS não define tipografia no markup
  const content = readFileSync(file, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  for (const m of content.matchAll(RE)) {
    // permite ocorrências que referenciam o TYPE (ex.: "{TYPE.label}") — o
    // registro é a fonte; o nome da variante NÃO é utilitário.
    const line = content.slice(0, m.index).split('\n').pop();
    if (line.includes('{TYPE.')) continue;
    violations.push({ file: rel, match: m[0] });
  }
}

const css = readFileSync(join(SRC, 'styles/global.css'), 'utf8');
if (!globalCssOnlyMirror(css)) {
  violations.push({ file: 'src/styles/global.css', match: 'tipografia fora do espelho .post-content' });
}

const md = [
  '# Auditoria de Tipografia',
  '',
  'Toda tipografia deve vir do registro `TYPE` em `src/components/ui/Text.astro`.',
  '',
  violations.length
    ? '## Violações\n\n' + violations.map((v) => `- \`${v.file}\`: \`${v.match}\``).join('\n')
    : '## Sem violações — todo o texto do site é controlado por `Text.astro`.',
  '',
].join('\n');

writeFileSync(join(ROOT, 'docs/typography-audit.md'), md);
console.log(`Typography audit: ${violations.length} violação(ões) → docs/typography-audit.md`);

if (FAIL && violations.length > 0) {
  console.error('FALHA: tipografia fora do Text.astro (mova para o registro TYPE).');
  process.exit(1);
}