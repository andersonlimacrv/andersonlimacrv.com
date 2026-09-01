# Design: blog-section-heading

## Context
`Blog.astro` é a única seção sem `SectionHeading` — o header editorial grande (h2 "Escritos" + link topo-direita) veio de `restyle-blog-editorial-list`, que removeu o heading numerado para copiar referência visual externa. O usuário pediu reversão: heading numerado 03 com KineticGrid, como Sobre/Projetos/Contato. Há também gaps irregulares: `SectionHeading` slot sem `mt` (conteúdo encosta no grid), About primeiro bloco `py-4` vs demais `py-6 sm:py-8`. Stakeholders: autor do site, leitores do mini-blog; sem dependências externas.

## Goals / Non-Goals

**Goals:**
- Restaurar consistência visual: 4 seções numeradas (01 Sobre, 02 Projetos, 03 Blog, 04 Contato) com mesmo heading.
- Mover "ver todos os posts" para canto inferior esquerdo (pós-lista, à esquerda), mantendo acessibilidade e estilo mono.
- Padronizar ritmo vertical (heading↔conteúdo `mt-8`; conteúdo↔divisória horizontal; blocos About `py-6 sm:py-8`).
- Reutilizar `SectionHeading.astro` e `KineticGrid.astro` existentes, sem novas dependências.

**Non-Goals:**
- Alterar Hero, `ElasticLine h-16` do `HomePage`, `PostCard`, rotas, RSS/sitemap, tokens.
- Introduzir JS runtime novo ou mudar Content Collections.

## Decisions

**D1. SectionHeading no Blog com `site.sections.blog = '03'`**
- Por quê: números vêm de `src/data/site.ts` (fonte única), já define `blog: '03'`. Reuso garante ordem correta.
- Alternativa considerada: hardcode "03" — rejeitada (quebra fonte única).

**D2. Slot `SectionHeading` com `mt-8`**
- Por quê: antes do redesign era `mt-8`; escolha proposta e aprovada pelo usuário (`mt-8` 32px). Centraliza decisão em `SectionHeading.astro:26` (`<div class="mt-8"><slot/></div>`), então Blog remove seu `mt-8` interno para não duplicar.
- Alternativa: `mt-6`/`mt-10` — user optou por `mt-8`.

**D3. Link "ver todos" após a lista, `mt-8`, `text-muted-foreground → hover:text-foreground`**
- Por quê: bottom-left solicitado; `mt-8` iguala heading↔conteúdo; mantém `cursor-target`/`min-h-11`/`→` para a11y/alvo de toque.
- Estrutura: `Blog.astro` wrapped em `SectionHeading`; `Reveal` em lista + link; link em `<div class="mt-8">`.

**D4. About: `py-4` → `py-6 sm:py-8` no primeiro bloco**
- Por quê: usuário pediu padronização; demais blocos já usam `py-6 sm:py-8`. Alinha divisórias `divide-y`/`border-t`.
- Trade-off: aumenta altura do bloco perfil (~8-16px); ganho de uniformidade visual compensa.

**D5. E2E `e2e/blog-section.spec.ts` dedicado**
- Por quê: isola os 3 novos cenários (heading numerado, eyebrow posicionamento, link bottom-left) sem poluir `locale-layout.spec.ts` (já testa o antigo header editorial). 86 → 89 testes.
- Justificativa de rota/dados: sem mudanças — blog continua com `getPublishedPosts(locale)`, `postMap.ts` para switch de idioma, `PostCard` inalterado.

## Risks / Trade-offs

- **[Risco] Regressão do spec `blog` modificado** → Mitigação: delta spec com `MODIFIED` explícito + cenário `Scenario: Heading numerado` antes/depois; `openspec validate --strict`.
- **[Risco] Overdraw de `mt-8` no About (border-t)** → Mitigação: inspeção visual desktop/mobile; teste de overflow já cobre horizontal overflow.
- **[Risco] Link bottom-left perde discoverability vs top-right** → Mitigação: mantém contraste AA, seta animada `group-hover:translate-x-1`; e2e mede `min-h-11`.
- **[Trade-off] Número `03` + KineticGrid aumenta altura da seção blog em ~8rem** → Aceito; uniformiza página, peso CSS ~0 (classes existentes).

## Migration Plan
- Deploy: build estático (`npm run build`); sem migração de dados.
- Rollback: `git revert` dos 3 arquivos + e2e; header editorial anterior restaurável em um commit.
- Ordem: 1) `SectionHeading.astro` slot, 2) `Blog.astro`, 3) `About.astro`, 4) e2e, 5) `npm run check && npm run test:e2e && node scripts/audit.mjs`.

## Open Questions
- Nenhuma — `mt-8` e padronização About aprovadas em 2026-09-01.
