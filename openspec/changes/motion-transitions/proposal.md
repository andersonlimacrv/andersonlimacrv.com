## Why

O prompt exige movimento performance-first (CSS puro, IntersectionObserver, View Transitions API) respeitando `prefers-reduced-motion`. Este change adiciona a camada de animação/transição ao site.

## What Changes

- Scroll-reveal leve via `IntersectionObserver` (fade + translateY 8–12px, ~400ms, easing `cubic-bezier(0.16, 1, 0.3, 1)`), sem bibliotecas pesadas (sem GSAP/AOS).
- Implementado como pequena island Astro (`Reveal.astro` com `client:visible`) que aplica classe `is-visible` em elementos alvo.
- View Transitions API nativa (`astro:transitions`) entre home, índice do blog e posts — efeito "página como continuação", sem JS extra.
- Micro-interações em hover (150–250ms, apenas transform/opacity): links de projetos (deslocamento sutil), cards, botões.
- Tudo embrulhado em `@media (prefers-reduced-motion: no-preference)` — usuários com a preferência recebem troca instantânea de estado.
- Nada de scroll-jacking, parallax pesado ou animações que competem com leitura.
- `data-astro-transition` / animação de persistência para header/nav.
- CSS animations para o hero (fade-in do nome, sequência editorial sutil).

## Capabilities

### New Capabilities
- `motion`: Camada de movimento e transições (scroll-reveal via IntersectionObserver, View Transitions API, micro-interações CSS) respeitando `prefers-reduced-motion`.

### Modified Capabilities
<!-- nenhuma -->

## Impact

- `src/components/Reveal.astro` (island), `src/styles/global.css` (animações), layouts e páginas (atributos `transition:*`).
- Depende de `site-foundation`, `design-tokens`, `home-page`, `mini-blog`.
