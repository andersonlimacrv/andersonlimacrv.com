# Proposal: projects-flowing-menu

## Why

A seção Projetos mostra só 3 cards compactos (título + descrição + tags) sem nenhum recurso visual — desperdiça a chance de dar peso editorial à seção. O FlowingMenu, já validado na `/lab`, exibe mais informação no mesmo espaço (linha + marquee com imagem) com custo medido (~4,5 KB JS). Esta change o promove a renderer oficial da seção, mantendo paridade sem JS e nos dois temas.

## What Changes

- `FlowingMenu.astro` ganha `variant: 'full' | 'minimal'`, itens com `description`/`tags`/`external`, e `marquee-media` vira `<img loading="lazy">` local (lazy real abaixo da dobra).
- `/lab` exibe as duas variantes (A: linha completa; B: linha mínima) para comparação visual.
- `Projects.astro` troca o grid de `ProjectLink` por `<FlowingMenu variant="full">` alimentado por `getProjects(locale)` (fonte única intacta).
- Novo e2e `projects-flowing.spec.ts`; spec da lab continua verde.

## Capabilities

### New Capabilities

- `projects-flowing`: seção Projetos renderizada como FlowingMenu (linhas com título/descrição/tags + marquee de imagem), links externos, temas e reduced-motion.

### Modified Capabilities

Nenhuma (specs do projeto vivem nas changes; `ProjectLink` e dados seguem intactos).

## Impact

- **Novo**: variante no `FlowingMenu`, blocos A/B na lab, `e2e/projects-flowing.spec.ts`.
- **Alterado**: `Projects.astro` (grid → FlowingMenu), `src/i18n/ui.ts` (2 chaves lab A/B).
- **Performance**: home ganha ~4,5 KB JS + ~5 KB CSS escopado; rAF ×3 com pausa por `IntersectionObserver`; LCP intacto (abaixo da dobra, imagens lazy locais).
- **Referência**: `openspec/changes/lab-flowing-edge-reveal/` (validação prévia).

## Non-goals

- Não adicionar campo de imagem em `src/data/projects.ts` (thumbs locais derivadas no componente).
- Não remover `ProjectLink.astro` (só deixa de ser usado em Projetos; remoção é outra change).
- Não usar imagens remotas (decisão do usuário: thumbs locais).
- Não levar a variante `minimal` para a home (fica restrita à lab como experimento).
