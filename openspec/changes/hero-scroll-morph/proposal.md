## Why

A imagem hero (`me.png`, retrato B&W) hoje fica parada no canto direito do hero. O prompt (plan.md) pede uma animação de scroll com foco máximo em performance: a imagem começa retangular no hero e, conforme o scroll avança, morph para um círculo bem menor que "viaja" até a seção "Sobre". Isso adiciona uma assinatura editorial ao portfólio, consistente com o léxico de movimento do site (`motion-transitions`).

## What Changes

- Componente Astro autocontido `ScrollMorphPortrait.astro` (HTML + CSS escopado + script vanilla), consumido na HomePage no lugar do `<figure>` atual.
- Controller `scroll-morph.ts` no padrão de `elastic-line.ts` (módulo vanilla + `<script>` no componente), sem bibliotecas.
- Morph de forma via `clip-path: polygon()` com **16 vértices** (retângulo → círculo) interpolados pelo progresso do scroll.
- Posicionamento/size via **apenas** `transform` (scale + translate); nunca `width`/`height`/`top`/`left`/`margin`/`padding`.
- `requestAnimationFrame` sincronizado com `scroll` (`passive: true`); recálculo dos vértices no `resize`.
- `will-change: clip-path, transform` + `contain: paint` no elemento animado.
- `prefers-reduced-motion: reduce` → estado final exibido imediatamente, sem animação.
- Imagem WebP com `srcset`/`sizes` e `decoding="async"` (via `getImage`, já em WebP no projeto).

## Capabilities

### New Capabilities
- `hero-scroll-morph`: Animação de scroll da imagem hero (retângulo → círculo via `clip-path` polygon + `transform`), performance-first em JS vanilla, respeitando `prefers-reduced-motion`.

## Impact

- HomePage: substitui o `<figure>`/`<Image>` do hero pelo novo componente (layout visual mantido).
- Zero dependências novas; JS vanilla único inline; sem impacto em build/SEO/RSS.
- Estado de repouso (topo) idêntico ao atual; o morph só aparece conforme o scroll.