# Capability: target-hover

Sistema de mira com corners animados em hover para links/cards com classe `.cursor-target`.

## ADDED Requirements

### Requirement: Persistência após View Transition

O sistema SHALL re-hidratar corners após toda navegação via `ClientRouter` (`astro:transitions`).

#### Scenario: Home → Blog → Home mantém mira fora do header

- **WHEN** o usuário navega `Home (/) → /blog → Home` via `ClientRouter`
- **THEN** todo `.cursor-target` no DOM novo (About socials, Blog viewAll, Contact email, PostCard/ProjectLink) SHALL conter 4 `.target-hover-corner` no desktop (`viewport 1280`) e responder a `mouseenter` com `is-target-hovering`.
- **AND** o header persistido (`data-astro-transition-persist="header"`) SHALL manter exatamente 4 corners por `.cursor-target` sem duplicação após 3 ciclos.
- **AND** no mobile (`viewport 390` ou `max-width:768px`) SHALL existir 0 `.target-hover-corner` visível (CSS `display:none` ou sem injeção).

#### Scenario: Post detail round-trip

- **WHEN** o usuário navega `Home → /blog/[slug] → Home`
- **THEN** os mesmos critérios acima aplicam — nenhum `.cursor-target` órfão sem corners.

### Requirement: Lifecycle de eventos do Astro

O módulo SHALL escutar `document` `astro:page-load` + `astro:after-swap` para `init` e `astro:before-swap` para `cleanup`.

#### Scenario: Eventos em `document`

- **WHEN** `astro:page-load` ou `astro:after-swap` dispara
- **THEN** `init()` SHALL reavaliar `isMobile`/`prefers-reduced-motion` e injetar corners nos novos `.cursor-target` via `MutationObserver` em `document.body {childList:true, subtree:true}`.
- **WHEN** `astro:before-swap` dispara
- **THEN** `cleanup()` SHALL remover corners/listeners/`dataset.targetHoverReady`/`requestAnimationFrame` dos targets existentes e `observer.disconnect()`.

### Requirement: Idempotência e acessibilidade

O sistema SHALL ser idempotente e respeitar `prefers-reduced-motion` e mobile.

#### Scenario: Idempotência

- **WHEN** `init()` é chamado múltiplas vezes ( `page-load` + `after-swap` sequenciais)
- **THEN** nenhum `.cursor-target` SHALL acumular >4 corners nem duplicar `mouseenter` listeners.

#### Scenario: Reduced motion e mobile

- **WHEN** `prefers-reduced-motion: reduce` ou `max-width:768px`/touch
- **THEN** parallax SHALL ser desativado (`easing=1` ou sem `requestAnimationFrame`) e no mobile corners SHALL estar ausentes ou `display:none` (`src/styles/target-hover.css:67-77`).

