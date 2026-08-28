# Proposal: restyle-blog-editorial-list

## Why

A listagem de posts (seção "Escritos" da home e índice `/blog`) usa grade de cards em caixas, que destoa da estética editorial do site e da referência visual aprovada (título grande à esquerda, link "ver todos" à direita, linhas de post com divisórias finas, metadados à direita). A mudança alinha o blog ao language design "editorial/blueprint" e melhora a escaneabilidade dos posts.

## What Changes

- `PostCard.astro`: de card em caixa (grid 3 colunas) para **linha editorial horizontal** com `border-b` — título + descrição à esquerda, data + tags (chips de cantos retos) alinhados à direita.
- Seção `#blog` da home: substitui `SectionHeading` numerado por **header editorial** (título grande "Escritos" à esquerda + link "VER TODOS OS POSTS →" mono à direita) e lista em coluna única com divisórias.
- Índice `/blog` (pt/es/en): troca a grade de cards pela mesma lista de linhas editoriais.
- Preserva contratos de e2e: `article a.cursor-target` nos posts, `a.cursor-target[href$="/blog"]` no link, `id="blog"` na seção, 3 posts na home, paridade entre locales.

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `blog`: o índice e a vitrine da home passam de "grade de cards" para lista editorial de linhas com divisórias; header da seção da home vira header editorial com link "ver todos" à direita (remove número/eyebrow blueprint dessa seção).

## Impact

- **Código**: `src/components/ui/PostCard.astro`, `src/components/sections/Blog.astro`, `src/components/pages/BlogIndexPage.astro`. Sem mudanças em dados (`src/data/`), i18n (`src/i18n/ui.ts`), rotas ou coleções.
- **Testes**: specs e2e existentes (`locale-layout`, `target-hover-persistence`, `theme-toggle`, `data-source`) devem continuar verdes; novos seletores preservados.
- **Métricas**: build + `npm run audit` (tamanho/SEO de `dist/`) comparado ao baseline em `docs/audit-baseline.md`; mudança é CSS-only, sem impacto esperado de JS.

## Non-goals

- Não alterar a página de post individual (`PostLayout`/`BlogPostPage`).
- Não alterar `SectionHeading.astro` (outras seções continuam numeradas).
- Não mudar dados, schema de posts, rotas, RSS ou i18n.
- Não adicionar JS runtime novo (hover continua via TargetHover existente).
- Não implementar paginação no índice ( mantida a lista completa; paginação já prevista em spec a partir de ~10 posts).
