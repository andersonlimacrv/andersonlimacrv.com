# Change: blog-section-heading

## Why
A seção **Escritos/Writings** (`#blog`) é a única sem `SectionHeading` (01 Sobre, 02 Projetos e 04 Contato usam heading numerado com KineticGrid). O layout fica inconsistente e o link "ver todos os posts" no topo-direita conflita com a identidade visual numerada. Há também distâncias irregulares entre heading/conteúdo e entre conteúdo/divisórias horizontais.

## What Changes
- **Blog com SectionHeading numerado**: `#blog` passa a usar `SectionHeading` com `number=03`, `title=Blog`, `eyebrow=Escritos/Writings` e KineticGrid centralizado (eyebrow acima do número, mesma largura da palavra).
- **Link "ver todos os posts" no canto inferior esquerdo**: move do header (topo-direita) para após a lista, alinhado à esquerda, com `mt-8`, `cursor-target`, `→`.
- **Padronização de distâncias**: `SectionHeading` slot `mt-8` (heading→conteúdo) uniforme em todas as seções; blocos internos do About `py-6 sm:py-8` (antes `py-4` no primeiro bloco).
- **Reversão de decisão anterior** de `restyle-blog-editorial-list` (header editorial sem número) — **BREAKING** apenas visual, sem mudança de rota/dados.

## Capabilities

### New Capabilities
- `layout-rhythm`: ritmo vertical padronizado (distância heading↔conteúdo e conteúdo↔divisória horizontal).

### Modified Capabilities
- `blog`: vitrine da home agora usa `SectionHeading` numerado; link "ver todos" posicionado no fim à esquerda. Requisitos MODIFIED de `openspec/changes/restyle-blog-editorial-list/specs/blog/spec.md`.

## Impact
- Código: `src/components/ui/SectionHeading.astro`, `src/components/sections/Blog.astro`, `src/components/sections/About.astro`, `e2e/blog-section.spec.ts` (novo).
- APIs/sistema: nenhuma API nova; sem dependências npm; sem alteração de Content Collections/rotas/RSS.
- Docs/métricas: `docs/audit.md`, `docs/audit-history.md`, `docs/perf-seo-checklist.md` (delta esperado ~0; +3 testes e2e).

## Non-goals
- Não alterar Hero (exceção de primeira dobra) ou divisórias `ElasticLine h-16` do `HomePage`.
- Não mudar `PostCard`, rotas `/blog/[slug]`, sitemap, RSS ou tokens de cor/tipografia.
- Não introduzir JS runtime novo além do já existente.
