# Tasks: target-aux-editorial

## 1. Nav na ordem das seções

- [x] 1.1 Reordenar `navLinks` em `src/components/layout/Header.astro:18-23` — `#sobre, #projetos, #blog, #contato` (ordem 01→04 das seções da home).

## 2. TargetSimbol auxiliar (mobile)

- [x] 2.1 `src/components/layout/Footer.astro` — link "Voltar ao topo": `<TargetSimbol size={16} class="md:hidden ml-1" />` após o label.
- [x] 2.2 `src/layouts/PostLayout.astro` — "Voltar ao blog", share X e share Email: mesmo padrão aux (`size=16`, `md:hidden`).

## 3. Separador unificado (Sep)

- [x] 3.1 Criar `src/components/ui/Sep.astro` — `<span aria-hidden="true" class="select-none font-mono text-[0.8em] leading-none text-muted-foreground/60">·</span>` com prop `class` (mx ajustável).
- [x] 3.2 `Eyebrow.astro` — prop opcional `label2`; chip renderiza `{label} <Sep class="mx-1"/> {label2}`.
- [x] 3.3 `Hero.astro` — `<Eyebrow label={t.heroEyebrow} label2={site.heroEyebrowYear} />` (remove template string com `·`).
- [x] 3.4 `TrajectoryClean.astro` — separadores trabalho (mx-1) e formação (mx-2) inline → `<Sep />` (·).
- [x] 3.5 `PostLayout.astro:83,87` — os 2 `·` da meta → `<Sep />`.
- [x] 3.6 About `mainStack` — renderizar `profile.hero.mainStack.split(' · ')` intercalado com `Sep` (data inalterada).
- [x] 3.7 `src/i18n/ui.ts` — `shareX`: `"X / Twitter"` → `"X · Twitter"`; `contactGridHint` mantém `·` (padronizado via Sep).

## 4. Leia também editorial

- [x] 4.1 Refatorar aside em `src/components/pages/BlogPostPage.astro` — substituir grid de `PostCard` por `ol` editorial numerado (`divide-y divide-border`, índice mono `01–03`, título semibold hover `text-primary`, data mono `hidden sm:block`, `→` com `group-hover:translate-x-1`, simbol aux `md:hidden`), mantendo `mt-14 border-t pt-10`, h2 eyebrow e 3 posts.

## 5. Verificação

- [x] 5.1 `npm run check` — 0 erros.
- [x] 5.2 Criar `e2e/editorial-feedback.spec.ts` — (a) nav com 4 links na ordem Sobre/Projetos/Blog/Contato em pt/es/en; (b) simbol aux visível em 390px e oculto em 1280px nos links elencados; (c) tap incrementa `data-spins` sem bloquear navegação; (d) "Leia também" com `ol` numerado dinâmico (1..3 por tags), data à direita ≥640px, seta e simbol aux; (e) separadores: meta/trajetória/mainStack com `·` via `Sep`, shareX `"X · Twitter"` nos 3 idiomas. Testes legados atualizados: `data-source.spec.ts` (eyebrow composto) e `about-section.spec.ts` (mainStack via Sep ×4).
- [x] 5.3 `npm run test:e2e` — 132 testes: 125 pass, 7 falhas (as mesmas pré-existentes no main). Correção de flake: âncora `#blog` com `expect.poll` (scroll-behavior smooth).
- [x] 5.4 Acessibilidade: simbol `aria-hidden`, `Sep` `aria-hidden`/`select-none`, `min-h-11` mantido, `:focus-visible` global, reduced-motion sem spin.

## 6. Métricas e documentação

- [x] 6.1 `npm run build` + `node scripts/audit.mjs` — regenerar `docs/audit.md`/`audit-history.md`: 919.0 KB raw / 436.9 KB gzip (Δ vs auditoria anterior 348976d: +58.1 KB raw / +7.2 KB gzip — SVG inline da mira instanciado ~30×; trade-off registrado no checklist).
- [x] 6.2 Atualizar `docs/perf-seo-checklist.md` — Δ (raw/gzip), contagem e2e 86 → 132 e item das frentes (nav order, aux simbol, leia também editorial, separador `·`).
