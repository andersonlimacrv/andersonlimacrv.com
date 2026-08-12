## Context

Páginas e layouts existem. Ver proposal.md - Why. Prompt §4.5 define movimento performance-first. Tokens já incluem easing/shadow. Zero JS por padrão é premissa (prompt §8).

## Goals / Non-Goals

**Goals:**
- Scroll-reveal leve via IntersectionObserver sem libs pesadas.
- View Transitions API nativa do Astro.
- Micro-interações CSS-only (transform/opacity).
- 100% respeitando `prefers-reduced-motion`.

**Non-Goals:**
- Bibliotecas de animação (GSAP/AOS proibidos).
- Scroll-jacking, parallax, animações de leitura-competitiva.
- Animações dependentes de scroll position contínuo (scrub).

## Decisions

**`Reveal.astro` como island com `client:visible`** — Componente com `data-reveal` no elemento alvo; script (type=module inline, sem hydration pesada) usa IntersectionObserver e adiciona classe `is-visible`. Razão: `client:visible` só hidrata quando o elemento se aproxima da viewport (performático, prompt §8). Alternativa: `client:load` global (rejeitado — hidrata tudo de uma vez).

**Fallback progressivo: conteúdo visível sem JS** — Estado inicial: `opacity: 1` no HTML; apenas quando o JS roda e o elemento ainda não entrou na viewport é que aplica estado oculto (via `js-enabled` class no `<html>`). Razão: sem JS, tudo visível (requisito do spec); evita flash de conteúdo oculto.

**View Transitions via `astro:transitions` + `ViewTransitions` component** — Adicionado no `BaseLayout` (foundation foi configurado para isso). Transições `fade`/`slide` padrão + `transition:persist` no header. Razão: API nativa, zero JS extra.

**Animações CSS em `global.css`** — `.reveal { opacity: 0; transform: translateY(12px); } .reveal.is-visible { opacity: 1; transform: none; transition: opacity 400ms, transform 400ms; transition-timing-function: cubic-bezier(0.16,1,0.3,1); }` com `transition-delay` opcional via `--reveal-delay` custom prop para sequência editorial sutil.

**Hero fade-in** — CSS keyframes (fade + translateY) com delays escalonados, dentro de `@media (prefers-reduced-motion: no-preference)`.

**Micro-interações** — Já aplicadas em components (hover em links/cards): `transition: transform 180ms, color 180ms` etc. Centralizadas nos tokens/utilities do `design-tokens`.

**`prefers-reduced-motion`** — Toda animação CSS e todo o JS de reveal embrulhados em `@media (prefers-reduced-motion: no-preference)`; o JS também checa `matchMedia` e adiciona `is-visible` imediatamente se reduzido. Alternativa: dep `motion-reduce` do Tailwind (usar como reforço, não base).

## Risks / Trade-offs

- [FOUC de elementos ocultos entre hidratação e observer] → Estratégia `js-enabled`: ocultar só após class no `<html>` + primeiro frame; mitigar com `requestAnimationFrame` antes de adicionar classes.
- [View Transitions em navegadores antigos] → API progressivamente melhorada: navegadores sem suporte fazem navegação normal (fallback nativo do Astro).
- [Islands aumentam JS] → Uma única island pequena (~300B) para reveal em toda a página; aceitável e dentro do limite INP.
