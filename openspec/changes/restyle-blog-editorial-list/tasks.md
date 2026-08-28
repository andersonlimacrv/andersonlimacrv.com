# Tasks: restyle-blog-editorial-list

## 1. Componentes

- [x] 1.1 Reestilizar `PostCard.astro` como linha editorial: `article` > `a.cursor-target` com grid `sm:grid-cols-[1fr_auto]`, título `text-xl sm:text-2xl` semibold com hover `text-primary`, descrição `line-clamp-2 text-sm text-muted-foreground`, coluna direita com data mono uppercase + chips de tags de cantos retos; manter `min-h-11`, `transition-micro`.
- [x] 1.2 Reestilizar `Blog.astro`: remover `SectionHeading`; header editorial (`h2` grande = `t.sections.blog.eyebrow` + link "ver todos" `a.cursor-target[href$="/blog"]` mono uppercase com seta `→` à direita); lista em coluna única com `divide-y divide-border` nos 3 posts; preservar `Reveal`, empty state e `aria-labelledby`.
- [x] 1.3 Atualizar `BlogIndexPage.astro`: trocar grid de cards por lista de linhas (`flex flex-col divide-y divide-border`); manter header/título da página e SEO/JSON-LD.

## 2. Verificação

- [x] 2.1 `npm run check` sem erros (astro check + TypeScript).
- [x] 2.2 `npm run test:e2e` verde nos specs deste change — `locale-layout.spec.ts` (3 links em `#blog`, paridade pt/es/en), `target-hover-persistence.spec.ts` (4 corners por linha e no link), `theme-toggle.spec.ts`, `data-source.spec.ts`. Nota: 89 passed / 5 failed — as 5 falhas (overflow horizontal em about/blueprint-morph/scroll-morph) são **pré-existentes no main**, verificadas via `git stash` (falham igualmente sem este change).
- [x] 2.3 Inspeção visual manual da home e `/blog` nos 3 locales (build + preview): divisórias, alinhamento de data/tags, hover com corners, foco visível, `prefers-reduced-motion`.

## 3. Métricas e documentação

- [x] 3.1 `npm run build` + `npm run audit` — comparar tamanho (raw/gzip) e SEO de `dist/` contra baseline (`docs/audit-baseline.md`); registrar resultado em `docs/audit.md` (delta esperado: ~0 KB de JS; variação só de HTML/CSS).
- [x] 3.2 Conferir acessibilidade das linhas: link único por linha cobre título+descrição+metadados, `time[datetime]` presente, contraste `text-muted-foreground` sobre fundo ≥ AA.
