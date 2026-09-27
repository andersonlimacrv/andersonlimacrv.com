# Design

## Context

Ver `proposal.md` (Why). Estado atual: `Projects.astro` renderiza grid de `ProjectLink` (título + descrição + tags, links externos); `FlowingMenu.astro` na lab usa itens `{href, label}`, thumb local único via `getImage`, `marquee-media` como `div` com `background-image`, motor `flowing-menu.ts` com pausa por `IntersectionObserver` e ciclo View Transitions.

## Goals / Non-Goals

**Goals:**

- Reuso máximo: estender o componente validado em vez de criar um novo; `src/data/projects.ts` e `ProjectLink.astro` intactos.
- Marquee com `<img loading="lazy">` (o `background-image` atual não é lazy nem tem `alt`).

**Non-Goals:**

- Não decidir remoção de `ProjectLink.astro`; não otimizar além do medido.

## Decisions

1. **`variant` prop (`'full' | 'minimal'`, default `'full'`)** — `full`: `.menu-link` contém título + descrição + tags (coluna, alinhada à esquerda, padding lateral); `minimal`: só título centralizado (comportamento atual da lab). Marquee idêntico nas duas (label + imagem). Alternativa (dois componentes) rejeitada: duplicaria motor WAAPI/rAF e CSS.
2. **Itens estendidos `{href, label, description?, tags?, external?}`** — `Projects.astro` mapeia `getProjects(locale)` direto (título→label, url→href, `external: true`); lab passa só `href/label` (campos opcionais, retrocompatível com a spec da lab).
3. **`<img>` no lugar do `div.marquee-media`** — `src` = thumb local (`getImage` 400px WebP), `width/height` fixos (sem CLS), `loading="lazy"`, `decoding="async"`, `alt=""` (marquee tem `aria-hidden`; a info já está na linha). `buildPart()` no `flowing-menu.ts` atualizado para criar `<img>` em vez de `div`.
4. **Thumb único compartilhado** — os 3 projetos usam o mesmo retrato B&W local (decisão do usuário: sem imagens externas); thumbs por projeto ficam para change futura com campo em `projects.ts`.
5. **Lab A/B empilhada** — `LabPage` renderiza `FlowingMenu variant="full"` + `variant="minimal"` com headings `lab.variantA/variantB`; spec e2e da lab existente continua válida (seletores `data-flowing-menu`/`data-lab="flowing"` preservados — o bloco A mantém `data-lab="flowing"`).
6. **Home paga o bundle uma vez** — `FlowingMenu.*.js` (~4,5 KB) passa a carregar na home; CSS escopado soma ~5 KB. Sem mudança no `BaseLayout`/header; LCP fora de risco (seção abaixo da dobra).

## Risks / Trade-offs

- [Risco] Linha `full` alta demais no mobile (título + desc + tags) → Mitigação: descrição em `line-clamp`/tamanho reduzido via CSS escopado; e2e checa sem overflow horizontal.
- [Risco] `<img>` dentro de `ensureParts` recriado no recalc → Mitigação: `ensureParts` mantém política de delta (só adiciona/remove a diferença); `src` idêntico reaproveita cache/decodificação.
- [Risco] `ProjectLink` órfão confunde futuros leitores → Mitigação: comentário no componente + Non-goal explícito; remoção em change própria.
- Trade-off: home +~9 KB (JS+CSS) — aceito pelo ganho informacional; medido na auditoria do build.

## Migration Plan

1. Estender `FlowingMenu.astro` + `flowing-menu.ts` (retrocompatível com a lab atual).
2. Lab A/B + i18n; validar visualmente em `/lab`.
3. Trocar `Projects.astro`; `astro check` + build + css-audit.
4. E2E novo + suíte full; rollback = reverter `Projects.astro` (1 arquivo).

## Open Questions

Nenhuma — variantes e imagens decididas com o usuário antes da implementação.
