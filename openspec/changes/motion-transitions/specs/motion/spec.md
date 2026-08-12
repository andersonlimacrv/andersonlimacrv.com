## Purpose

Camada de movimento e transições do site: scroll-reveal leve via IntersectionObserver, View Transitions API e micro-interações CSS, sempre respeitando `prefers-reduced-motion`.

## ADDED Requirements

### Requirement: Scroll-reveal via IntersectionObserver
Elementos de conteúdo SHALL revelar com fade + translateY (8–12px, ~400ms, easing `cubic-bezier(0.16, 1, 0.3, 1)`) via IntersectionObserver, sem bibliotecas de animação pesadas (GSAP/AOS proibidos).

#### Scenario: Revelação ao entrar na viewport
- **WHEN** um elemento com reveal entra na viewport
- **THEN** ele transiciona de opacidade 0/transladado para visível em ~400ms com o easing definido

#### Scenario: Conteúdo visível sem JS
- **WHEN** JavaScript está desabilitado
- **THEN** todos os elementos reveláveis são visíveis por padrão (sem conteúdo oculto)

### Requirement: View Transitions API
Navegações entre home, índice do blog e posts SHALL usar a View Transitions API nativa (`astro:transitions`), sem custo extra de biblioteca JS.

#### Scenario: Transição entre páginas
- **WHEN** o usuário navega da home para `/blog` ou entre posts
- **THEN** a transição de página usa a View Transitions API com animação suave de continuidade

### Requirement: Micro-interações CSS-only
Hover/focus em links, cards e botões SHALL usar apenas `transform`/`opacity` com duração de 150–250ms.

#### Scenario: Hover econômico
- **WHEN** um elemento interativo recebe hover
- **THEN** apenas propriedades `transform`/`opacity` mudam, em 150–250ms

### Requirement: prefers-reduced-motion respeitado
Todas as animações e transições SHALL estar embrulhadas em `@media (prefers-reduced-motion: no-preference)`; usuários com a preferência SHALL receber troca instantânea de estado, sem scroll-jacking nem parallax.

#### Scenario: Sem animação com reduced-motion
- **WHEN** o usuário tem `prefers-reduced-motion: reduce`
- **THEN** nenhum elemento anima: reveal ocorre instantaneamente e hovers trocam de estado imediatamente
