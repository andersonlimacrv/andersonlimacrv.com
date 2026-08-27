## Context

Todas as páginas e componentes existem. Ver proposal.md - Why. Prompt §9 define mobile-first. Tokens já têm clamp() e radius. Este change refina classes/estilos nas páginas existentes — não cria features novas.

## Goals / Non-Goals

**Goals:**

- Verificar/ajustar todo layout para mobile-first (Tailwind ascendente).
- Grade de posts 1→2→2-3 colunas.
- Header compacto no mobile; touch targets ≥44px.
- Zero overflow horizontal.

**Non-Goals:**

- Novas funcionalidades.
- Modo escuro (design-tokens).
- Testes automatizados de e2e (verificação manual em breakpoints).

## Decisions

**Mobile-first como padrão de escrita** — Todas as novas classes e ajustes usam `base (mobile) → sm → md → lg → xl`. Revisão de `index.astro`, blog pages e componentes para remover classes desktop-first (`md:` no lugar errado).

**Grade de posts via utility única** — `grid gap-6 sm:grid-cols-2 lg:grid-cols-3` no índice e `lg:grid-cols-2`/`3` no destaque da home. Razão: consistência visual entre home e blog (spec exige).

**Header mobile** — No mobile: botão hambúrguer (`.site-menu-toggle`, touch target ≥44px) na área de ações; ao abrir, a toolbox cresce (altura animada) e a nav aparece empilhada num bloco separado (`.site-menu`) dentro da mesma toolbox. Fecha por: clique no hambúrguer, `Escape`, clique fora, clique num link ou troca de idioma (`astro:page-load`). Animação via CSS transitions (`max-height`/`opacity`) + Web Animations API (stagger nos links) — sem bibliotecas (GSAP rejeitado: peso). `prefers-reduced-motion` pula as animações. Desktop (≥768px): nav inline. Alternativa anterior: `<details>` nativo (substituída — hambúrguer animado mantém o visual da toolbox e comporta stagger).

**Container fluido** — `mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8` centralizado em utility `.container-site` (global.css) — evitar repetição em cada página. Razão: gutter consistente.

**Touch targets** — Links/CTAs com `min-h-11` e `py-3` em mobile via classe base; `:focus-visible` garantido (accessibility).

**Verificação manual** — Checklist em 320/375/768/1024/1440: overflow horizontal ausente (devtools), toque ≥44px, grade correta. Registrado como tarefa de QA em tasks.md.

**scroll-margin-top nas seções** — Para âncoras não ficarem escondidas sob o header sticky no mobile (header maior em mobile).

## Risks / Trade-offs

- [Breakpoints Tailwind padrão não atendem 320px] → 320px é acima do `min` default; usar `min-w-0` e evitar `min-w-[300px]` fixos.
- [Header `<details>` fecha sozinho ao clicar fora] → Aceitável (sem JS); foco sai da nav ao navegar.
- [Grid 3 colunas em 1024 com texto longo quebra] → `items-start` + truncate controlado de título/resumo via `line-clamp`.
