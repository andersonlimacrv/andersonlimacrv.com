// css-audit — auditoria das classes/tokens CSS customizados do site.
//
// Para cada regra customizada em src/styles/*.css, cruza com o uso real em
// src/ (astro, ts, css) e classifica:
//   usada      — encontrada no código
//   utilitária — definida via @utility (API do Tailwind v4, composável)
//   hook       — não aparece no código, mas é gancho de estado JS/atributo
//                (allowlist com motivo)
//   morta      — sem uso e sem justificativa → precisa remoção
//
// Escreve docs/css-audit.md e imprime o resumo. --fail-on-dead (CI) sai ≠ 0
// se houver classe morta nova.
//
// Uso: node scripts/css-audit.mjs [--fail-on-dead]

import { readFileSync, readdirSync, writeFileSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const ROOT = process.cwd();
const STYLES = join(ROOT, 'src/styles');
const SRC = join(ROOT, 'src');
const DOCS = join(ROOT, 'docs');
const FAIL_ON_DEAD = process.argv.includes('--fail-on-dead');

// Ganchos de estado JS/atributos/estrutura: não aparecem no código-fonte,
// mas são usados por scripts de runtime ou como âncoras de teste.
const HOOK_ALLOWLIST = {
  'is-hidden': 'toggle de visibilidade do header (site-header.ts)',
  'is-open': 'estado aberto do menu/header (site-header.ts)',
  'site-menu-icon': 'âncora dos transforms dos ícones do menu',
  'site-menu-bar': 'âncora das barras do ícone (transforms em CSS)',
  'is-target-hovering': 'estado hover do TargetHover (target-hover.ts)',
  'is-visible': 'estado revelado do Reveal (reveal.ts)',
  'theme-toggle': 'âncora do toggle de tema (theme-toggle.ts)',
  'theme-toggle-halves': 'âncora das metades do ícone do toggle',
  'target-hover-corner--tl': 'nome montado em runtime por target-hover.ts',
  'target-hover-corner--tr': 'nome montado em runtime por target-hover.ts',
  'target-hover-corner--br': 'nome montado em runtime por target-hover.ts',
  'target-hover-corner--bl': 'nome montado em runtime por target-hover.ts',
};

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) out.push(...walk(p));
    else if (extname(p) === '.astro' || extname(p) === '.ts' || extname(p) === '.css') out.push(p);
  }
  return out;
}

const cssFiles = readdirSync(STYLES).filter((f) => f.endsWith('.css'));
let css = '';
for (const f of cssFiles) css += `\n${readFileSync(join(STYLES, f), 'utf8')}`;

// Remove comentários para não extrair classes de texto (ex.: menções em docs).
css = css.replace(/\/\*[\s\S]*?\*\//g, '');

// ── Extração: classes (fora de @theme) e utilitárias (@utility) ──────────────
const classes = new Set();
const utilities = new Set();
const tokens = new Set();
let inTheme = false;
for (const line of css.split('\n')) {
  if (/^\s*@theme/.test(line)) { inTheme = true; continue; }
  if (inTheme) {
    if (line.includes('}')) inTheme = false;
    continue;
  }
  if (/^\s*@utility\s+([\w-]+)/.test(line)) {
    utilities.add(line.match(/^\s*@utility\s+([\w-]+)/)[1]);
  }
  const cls = line.matchAll(/\.([a-zA-Z][\w-]*)/g);
  for (const m of cls) {
    if (m[1] === 'dark') continue;
    classes.add(m[1]);
  }
  const tok = line.matchAll(/--([a-zA-Z][\w-]*)/g);
  for (const m of tok) {
    if (m[1].startsWith('tw-') || m[1].startsWith('color-')) continue;
    tokens.add(m[1]);
  }
}

const srcFiles = walk(SRC).filter((p) => !p.startsWith(join(SRC, 'styles')));

// Uso real = markup/scripts (.astro/.ts). Referência só dentro dos próprios
// styles (self-reference circular) é sinal de classe órfã → status css-only.
const srcText = srcFiles.map((p) => readFileSync(p, 'utf8')).join('\n');
const cssText = cssFiles.map((f) => readFileSync(join(STYLES, f), 'utf8')).join('\n');

const used = (name) => new RegExp(`\\b${name}\\b`).test(srcText);
const cssOnly = (name) => !used(name) && new RegExp(`\\b${name}\\b`).test(cssText);

const rows = [];
let dead = 0;
let cssOnlyCount = 0;
for (const c of [...classes].sort()) {
  let status;
  let note = '';
  if (used(c)) status = 'usada';
  else if (utilities.has(c)) status = 'utilitária';
  else if (HOOK_ALLOWLIST[c]) { status = 'hook'; note = HOOK_ALLOWLIST[c]; }
  else if (cssOnly(c)) { status = 'css-only'; cssOnlyCount++; note = 'referenciada só dentro de styles/*.css'; }
  else { status = 'morta'; dead++; }
  rows.push({ name: `.${c}`, status, note });
}
for (const u of [...utilities].sort()) {
  if (used(u)) rows.push({ name: `@utility ${u}`, status: 'usada' });
  else rows.push({ name: `@utility ${u}`, status: 'utilitária' });
}
// Tokens: consumidos via var() dentro do próprio CSS (tema/@theme/base)
// também contam como uso — "sem uso" = definido e referenciado em lugar nenhum.
// \b não funciona antes de "--" (hífen é não-word), então usa lookahead.
const usedToken = (name) =>
  new RegExp(`--${name}(?![\\w-])`).test(srcText + cssText);
const tokensRows = [...tokens]
  .sort()
  .filter((t) => !usedToken(t))
  .map((t) => ({ name: `--${t}`, status: 'tkn-sem-uso', note: '' }));

const byStatus = (s) => rows.filter((r) => r.status === s);
const md = [
  `# Auditoria CSS — ${new Date().toISOString()}`,
  '',
  'Regras customizadas em `src/styles/` cruzadas com o uso real em `src/`.',
  '',
  `| Classe | Status | Nota |`,
  `| --- | --- | --- |`,
  ...rows.map((r) => `| ${r.name} | ${r.status} | ${r.note} |`),
  ...tokensRows.map((r) => `| ${r.name} | ${r.status} | ${r.note} |`),
  '',
  `**Resumo:** ${rows.length + tokensRows.length} itens — ${byStatus('usada').length} usadas, ${byStatus('utilitária').length} utilitárias, ${byStatus('hook').length} hooks, ${cssOnlyCount} css-only, ${dead} mortas, ${tokensRows.length} tokens sem uso.`,
  '',
].join('\n');

writeFileSync(join(DOCS, 'css-audit.md'), md);
console.log(`CSS audit: ${rows.length + tokensRows.length} itens — ${cssOnlyCount} css-only, ${dead} mortas, ${tokensRows.length} tokens sem uso → docs/css-audit.md`);

if (FAIL_ON_DEAD && (dead > 0 || tokensRows.length > 0)) {
  console.error('FALHA: há classes mortas ou tokens sem uso (remova ou justifique na allowlist).');
  process.exit(1);
}