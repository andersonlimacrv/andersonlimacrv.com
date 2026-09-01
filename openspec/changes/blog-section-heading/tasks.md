# Tasks: blog-section-heading

## 1. Fundação — SectionHeading e ritmo vertical

- [x] 1.1 Atualizar `src/components/ui/SectionHeading.astro:26` — slot wrapper `<div class="">` → `<div class="mt-8">` para padronizar distância heading↔conteúdo em todas as seções numeradas.
- [x] 1.2 Padronizar blocos internos de `src/components/sections/About.astro` — bloco Perfil `py-4` → `py-6 sm:py-8` (linha ~76/105), alinhando com demais blocos.

## 2. Blog — SectionHeading numerado e link no canto inferior esquerdo

- [x] 2.1 Refatorar `src/components/sections/Blog.astro`: importar `SectionHeading` e `site`; envolver conteúdo em `<SectionHeading number={site.sections.blog} title={t.sections.blog.title} id="blog" eyebrow={t.sections.blog.eyebrow}>`; remover header editorial antigo (h2 "Escritos"/"Writings" + link topo-direita) e seu `mt-8` interno; manter `Reveal`, `PostCard` (`divide-y divide-border`), empty state `t.blogComingSoon`.
- [x] 2.2 Adicionar link "ver todos os posts" no canto inferior esquerdo após a lista: `<div class="mt-8"><a href={`${baseUrl}/blog`} class="cursor-target transition-micro group inline-flex min-h-11 items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground hover:text-foreground">` com `→` (`group-hover:translate-x-1`), localizado (`t.viewAllPosts`), `aria-label` implícito via texto.

## 3. Verificação — testes e acessibilidade

- [x] 3.1 `npm run check` — 0 erros Astro.
- [x] 3.2 Criar `e2e/blog-section.spec.ts` — cenários: (a) heading numerado `[Blog]` com `03`, KineticGrid e eyebrow acima do número (`w-full text-center`, mesma largura da palavra) visível em pt/es/en; (b) vitrine com 3 posts `a[href*="/blog/"]` por locale; (c) link "ver todos" `href$="/blog"` com `cursor-target`, `min-h-11` ≥ 44px, posicionado após a lista, alinhado à esquerda, com `→`; (d) estado vazio; (e) âncora `#blog` acessível.
- [x] 3.3 `npm run test:e2e` — 89 testes (86 + 3 novos) sem regressão; validar que `locale-layout.spec.ts` continua verde (o teste de vitrine com 3 posts em `#blog` deve permanecer compatível).
- [x] 3.4 Acessibilidade: `aria-labelledby="blog-title"` no heading, foco `:focus-visible` nos links, `prefers-reduced-motion` respeitado (KineticGrid estático quando configurado), `min-h-11` mantido.

## 4. Métricas e documentação

- [x] 4.1 `npm run build` + `node scripts/audit.mjs` — regenerar `docs/audit.md`, `docs/audit-history.md`; delta real vs auditoria anterior (1752c42): +4.4 KB raw (html 490.6→494.8, css 49.2→49.4) / +0.2 KB gzip.
- [x] 4.2 Atualizar `docs/perf-seo-checklist.md` — tabela Δ (arquivos/peso), contagem `test:e2e` 123 testes (116 pass / 7 falhas pré-existentes no main) e item de seções numeradas.
