# Design: restyle-blog-editorial-list

## Context

A listagem de posts hoje usa `PostCard.astro` (card em caixa com borda completa) dentro de grids 2/3 colunas, tanto na seção `#blog` da home (`Blog.astro`, via `SectionHeading` numerado) quanto no índice `/blog` (`BlogIndexPage.astro`). A referência visual aprovada pede lista editorial: linhas separadas por divisórias finas, título/descrição à esquerda, data/tags à direita, header com título grande + link "ver todos" à direita.

Restrições: zero JS runtime novo (hover via `TargetHover` existente, que anexa corners a `.cursor-target`); e2e dependem de seletores estáveis (`article a.cursor-target`, `a.cursor-target[href$="/blog"]`, `#blog` com 3 links, paridade pt/es/en com tolerância de 2px); tokens de cor/fonte existentes (`border-border`, `text-muted-foreground`, `font-mono`, `text-h1`).

## Goals / Non-Goals

**Goals**
- Lista editorial de linhas compartilhada entre home e índice (um único componente).
- Header editorial fiel à referência, mantendo acessibilidade (`aria-labelledby`, alvo de toque ≥ 44px).
- Preservar 100% dos testes e2e existentes.

**Non-Goals**
- Alterar `SectionHeading`, `PostLayout`, dados, rotas, RSS, i18n.
- Paginação, animações novas, imagens de capa na listagem.

## Decisions

1. **Um único `PostCard.astro` reestilizado como linha** (não criar `PostRow` separado): PostCard é consumido só por `Blog.astro` e `BlogIndexPage.astro`; ambos migraram para lista. Alternativa (manter card na home e criar componente novo) rejeitada por duplicar markup e divergir do pedido "as duas".
2. **Layout via utilitários Tailwind existentes** (grid `sm:grid-cols-[1fr_auto]`, `border-b`, `line-clamp-2`): nenhuma lib nova; `line-clamp`, `grid-cols-[...]` e `divide` já disponíveis no Tailwind v4. Sem CSS custom em `global.css`.
3. **Header da seção fora do `SectionHeading`**: a referência dispensa número/régua/eyebrow. `Blog.astro` passa a renderizar `<section id="blog" aria-labelledby="blog-title">` com container padrão do site (`mx-auto w-full max-w-6xl px-4 sm:px-6 md:px-8`) e header `flex items-end justify-between`. Outras seções mantêm o padrão numerado.
4. **Título grande = valor do eyebrow** (`t.sections.blog.eyebrow`: "Escritos"/"Writings"): idêntico à referência sem criar nova chave de i18n. O texto `t.sections.blog.title` ("Blog") sai da home; índice continua usando `t.blogTitle` ("Escritos").
5. **Link "ver todos" com seta `→`** como texto (não ícone SVG): alinha com a referência, mantém `cursor-target` e evita dependência de ícones; hover desliza a seta via `transition-micro` e `group`/`group-hover:translate-x`.
6. **Tags com cantos retos** (`rounded-none` implícito, sem `rounded-lg`): fiel à referência; chips mantêm `border-border`, mono uppercase.
7. **Divisórias via `divide-y divide-border` no wrapper da lista** (não `border-b` no item): `divide-y` aplica borda apenas entre irmãos — exatamente "linhas entre itens, nada acima da primeira nem abaixo da última" — sem variantes arbitrárias.
8. **Estado vazio preservado** (`blogComingSoon`) e `Reveal` mantido como wrapper de animação de entrada.

## Risks / Trade-offs

- [Paridade de layout entre locales (tolerância 2px)] → títulos/descrições têm alturas estáveis (`line-clamp-2`); coluna direita é `auto` e não depende de tradução.
- [Linhas mais altas empurram seções abaixo na home] → ganho aceito (referência aprova); seções seguintes já usam `py-16/20` e scroll.
- [e2e `locale-layout` conta links em `#blog`] → continuam 3 links `a[href*="/blog/"]`; nenhum seletor removido.
- [Data "MAR 08, 2026" varia por locale] → `Intl` + `uppercase` já produz formato localizado; diferença é esperada e coberta pelos testes atuais.

## Migration Plan

Mudança puramente visual em 3 arquivos; sem dados/rotas. Deploy = build estático normal. Rollback = reverter os 3 arquivos. Verificação: `npm run check`, `npm run test:e2e`, `npm run build` + auditoria de métricas (`docs/audit.md` vs baseline).

## Open Questions

Nenhuma — decisões de header e escopo (home + índice) aprovadas pelo usuário.
