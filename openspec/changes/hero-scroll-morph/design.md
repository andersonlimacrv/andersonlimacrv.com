## Context

A HomePage tem o retrato `me.png` num `<figure>` à direita do hero (`<Image widths={[480,800,1122]} sizes="(min-width: 768px) 320px, 90vw" loading="eager" fetchpriority="high">`). O `plan.md` pede animação de scroll: retângulo → círculo menor, com a imagem "viajando" até a seção Sobre. Diretrizes rígidas de performance: só `clip-path` + `transform` (scale/translate), vanilla JS, `polygon()` com mesmo nº de vértices, rAF, `passive`, recálculo no resize, `will-change` + `contain: paint`, `prefers-reduced-motion`.

## Goals / Non-Goals

**Goals:**
- Componente Astro autocontido com CSS escopado e script vanilla, reutilizável.
- Morph fiel: vértices do polígono interpolam entre a forma do retângulo (viewport do hero) e um círculo pequeno na seção Sobre.
- Performance: nenhuma propriedade de layout animada; apenas compositor (`clip-path`/`transform`).
- Respeitar `prefers-reduced-motion` (estado final direto).
- Imagem em WebP/AVIF com `srcset`/`sizes` e `decoding="async"`.

**Non-Goals:**
- Animar `width`/`height`/`top`/`left`/`margin`/`padding` (proibido pelas diretrizes).
- Suporte a touch-drag ou parallax multisseção; apenas o morph hero→sobre.
- Alterar o layout do hero no estado de repouso (visual atual preservado no topo).
- Definir a posição exata de "aterrissagem" do círculo na seção Sobre — **fica em aberto** para decisão visual.

## Decisions

### 1. Componente autocontido `ScrollMorphPortrait.astro`

Estrutura no padrão do projeto (como `Reveal.astro` + `elastic-line.ts`): componente Astro com `<script>` que importa o controller `scroll-morph.ts`. O componente recebe a `src` otimizada (via `getImage`), renderiza `<img>` com `srcset`/`sizes`, `decoding="async"`, e um wrapper que o script controla. CSS escopado no componente (`<style>`).

### 2. Geometria do morph (16 vértices)

`clip-path: polygon(...)` com 16 pontos. Em `p=0` (topo): pontos formam o retângulo da imagem (cantos + pontos intermediários nas bordas para manter 16 vértices). Em `p=1`: os mesmos 16 pontos formam um círculo (raio alvo) na posição de destino. Cada vértice interpola linearmente `p0→p1` pelo progresso do scroll. Mesmo número de vértices garante morph suave (regra do plan.md).

### 3. Progresso do scroll e aplicação

- Escuta `scroll` (`passive: true`) + `resize`; calcula progresso `p ∈ [0,1]` entre o topo (hero) e a seção Sobre usando `getBoundingClientRect` das âncoras.
- `requestAnimationFrame` deduplica a escrita (uma escrita por frame); sem layout thrashing (leituras agrupadas no início do frame, escritas no fim).
- Aplica no elemento: `clip-path: polygon(...)` interpolado e `transform: translate(...) scale(...)` (destino = círculo pequeno; origem = posição original).
- `will-change: clip-path, transform` e `contain: paint` setados no CSS.

### 4. `prefers-reduced-motion`

Se `matchMedia('(prefers-reduced-motion: reduce)')`, pula a animação e aplica o estado final (`p=1`) imediatamente.

### 5. Destino do círculo (em aberto)

A posição/raio exatos do círculo na seção Sobre ficam parametrizáveis no componente (`data-*`), para ajuste fino no visual sem tocar no controller. Decisão final registrada como task aberta.

## Risks / Trade-offs

- [Morph "estourar" em telas muito estreitas] → vértices relativos ao elemento; recálculo no `resize` mantém proporção.
- [`clip-path` + `transform` simultâneos com foco no topo] → `contain: paint` + `will-change` evitam repaint amplo.
- [Overlap visual com o conteúdo da seção Sobre] → destino parametrizável; definir visualmente.
- [Reduced motion] → estado final direto, sem custo.

## Migration Plan

1. `scroll-morph.ts` (controller vanilla) + `ScrollMorphPortrait.astro` (componente).
2. HomePage: trocar `<figure>`/`<Image>` do hero pelo componente (passando a `src` otimizada).
3. Validar: check 0 erros, build, e2e 23/23, auditoria sem regressão de peso; conferir morph em dark/light e `prefers-reduced-motion`.
4. Definir posição do círculo na seção Sobre (task aberta) e ajustar via `data-*`.

---

## Aberto (decisões pós-implementação)

- **Destino do círculo**: posição/raio exatos do círculo na seção Sobre (definir visualmente).