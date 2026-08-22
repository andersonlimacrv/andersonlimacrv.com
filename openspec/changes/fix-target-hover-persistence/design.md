## Context

`TargetHover` injeta 4 `.target-hover-corner` `position:absolute` dentro de cada `.cursor-target` (`src/styles/target-hover.css:59-63`, `src/lib/target-hover.ts:69-78`) e anima com `transform`+`opacity` + parallax `requestAnimationFrame`. `BaseLayout.astro:157` inicializa 1x via `<script type="module"> initTargetHover({targetSelector:'.cursor-target'})`. O header persiste via `data-astro-transition-persist="header"` (`src/components/layout/Header.astro:26`), o `<main>` é trocado pelo `ClientRouter` (`src/layouts/BaseLayout.astro:108`). Bug: após `Home→Blog→Home`, só header mantém corners porque `src/lib/target-hover.ts:34-278` avalia `isMobile` no closure, escuta `window` em vez de `document` e só `astro:after-swap`, e `cleanup` (`src/lib/target-hover.ts:258-267`) deleta `dataset` sem remover nodes/listeners. Todo projeto usa `document.addEventListener('astro:page-load')` (`theme-toggle.ts:43`, `site-header.ts:156`, `scroll-morph.ts:290`) — `target-hover` destoava.

## Goals / Non-Gals

**Goals:** re-hidratação idempotente após toda View Transition, sem duplicar corners no header persistido, respeitando `prefers-reduced-motion` e `max-width:768px`.

**Non-Goals:** ver proposal.md.

## Decisions

### Eventos em `document` + `astro:page-load` (principal)
Trocar `window.addEventListener("astro:before-swap"/"astro:after-swap")` (`src/lib/target-hover.ts:278-279`) por `document.addEventListener('astro:before-swap', cleanup)` + `document.addEventListener('astro:after-swap', init)` + `document.addEventListener('astro:page-load', init)`. `astro:page-load` é o canônico pós-swap (dispara na carga inicial e em toda navegação); `after-swap` mantido como fallback. `window` mantido como listener secundário por compatibilidade mas não primário. Razão: todo `site-header.ts`, `theme-toggle.ts`, `scroll-morph.ts` usam `document`.

### Singleton + reavaliação por `init()`
`isMobile` (`window.matchMedia('(max-width:768px)') || ontouchstart`) e `prefers-reduced-motion` são reavaliados dentro de `init()` a cada navegação, não capturados no closure do primeiro `initTargetHover`. Guard `window.__targetHoverInitialized` evita registrar listeners duplicados se `BaseLayout` reexecutar. Se `isMobile` for true, `cleanup()` remove corners existentes e retorna sem observar.

### `WeakMap` por target + `cleanup` destrutivo
`src/lib/target-hover.ts:52-53` `setupTarget` atual verifica `dataset.targetHoverReady` mas nunca remove listeners/corners. Novo: `WeakMap<HTMLElement, {cleanup:()=>void}>` guarda `mouseenter/mousemove/mouseleave` handlers e referências dos 4 corners. `cleanup()` itera `document.querySelectorAll(selector)` e para cada com entrada no map, `removeEventListener` + `corner.remove()` + `cancelAnimationFrame` + `delete dataset`. Evita duplicação no header persistido (remove antes de recriar) e leak em navegações.

### `MutationObserver` permanece em `document.body` subtree
`src/lib/target-hover.ts:248-255` já observa `document.body` `childList:true, subtree:true`; callback `targets().forEach(setupTarget)` é idempotente (early-return via `WeakMap`/`dataset`). Após `cleanup`+`init`, observer reconectado. Alternativa `document.documentElement` rejeitada (desnecessário; `body` é trocado mas node persiste).

### `BaseLayout.astro` sem `is:inline`
Manter `<script type="module">` bundlado (Vite) — reexecução não necessária porque listeners em `document` sobrevivem. `data-astro-rerun`/`is:inline` rejeitado (perde bundling/HMR). `src/styles/target-hover.css:4` permanece importado no layout.

## Risks / Trade-offs

- `astro:page-load` + `astro:after-swap` podem disparar em sequência → `init` idempotente resolve.
- `MutationObserver` vê `appendChild(corner)` como mutação → `setupTarget` early-return evita loop.
- Header persistido remove+recria corners a cada navegação (micro-flicker) — aceitável; alternativa manter sem tocar adiciona branch `persisted` mais complexo.
- `Resize` mobile↔desktop sem navegação: `matchMedia('(max-width:768px)').addEventListener('change', init)` adicionado para re-hidratar sem navegação.
- `prefers-reduced-motion` troca dinâmica: reavaliado em `init`, parallax `easing=1` já respeita.

## Alternatives Considered

- Remover `data-astro-transition-persist="header"` para forçar re-render: rejeitado (perde UX de header flutuante).
- `is:inline` + `data-astro-rerun` no script do layout: rejeitado (quebra bundling, duplica código).
- Manter `window` listeners: rejeitado (não recebe eventos do `ClientRouter`).
