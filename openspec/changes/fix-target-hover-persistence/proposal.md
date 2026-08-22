## Why

Navegar `Home (/) → /blog → Home` via `ClientRouter` (`src/layouts/BaseLayout.astro:108`) quebra o `TargetHover`: a mira/corners só permanece no header persistido (`data-astro-transition-persist="header"` em `src/components/layout/Header.astro:26`), o restante da página (`#sobre`, `#blog`, `#projetos`, `#contato`) perde o efeito hover. A causa é o lifecycle em `src/lib/target-hover.ts:278-279` escutando `window` + `astro:after-swap`/`astro:before-swap` em vez de `document` + `astro:page-load`, sem re-injeção após View Transition, com `isMobile` capturado no closure e `cleanup` sem remover nodes/listeners (risco de duplicação no header). Os consumidores `.cursor-target` em `PostCard`, `ProjectLink`, `About` (5 links sociais), `Blog`/`Contact` e `Header`/`Footer` ficam órfãos no DOM trocado.

## What Changes

- Corrige `src/lib/target-hover.ts` para re-hidratar após toda View Transition: avalia `isMobile`/`prefers-reduced-motion` a cada `init`, usa `document.addEventListener('astro:page-load'|'astro:after-swap'|'astro:before-swap')`, singleton guard e `WeakMap` por target para remover/criar corners e listeners sem duplicar no header persistido.
- Mantém `src/components/ui/TargetHover.astro` como fachada e `src/styles/target-hover.css` (apenas `position:relative`/`z-index`/`display:none` mobile) sem mudar tokens.
- Adiciona `e2e/target-hover-persistence.spec.ts` para `Home↔Blog↔Home` e `Home↔Blog post↔Home` + check `i18n` (`/en`, `/es`) e `prefers-reduced-motion`.

## Capabilities

### New Capabilities
- `target-hover`: sistema de mira com corners animados e parallax — persistência entre View Transitions.

### Modified Capabilities
- `motion-transitions`: hover `TargetHover` deve sobreviver a navegações `ClientRouter`.

## Non-goals

- Não redesign visual dos corners (tamanho/offsets/parallax mantidos).
- Não remover `ClientRouter` nem `data-astro-transition-persist="header"`.
- Não migrar para React island ou GSAP.
- Não alterar tokens Tailwind/OKLCH ou `global.css:transition-micro`.

## Impact

- `src/lib/target-hover.ts` (reescrito, lifecycle + WeakMap)
- `src/layouts/BaseLayout.astro` (sem mudança funcional, apenas garante `target-hover.css` import)
- `src/styles/target-hover.css` (sem mudança, auditado)
- `e2e/target-hover-persistence.spec.ts` (novo)
- `openspec/changes/fix-target-hover-persistence/specs/target-hover/spec.md` (nova capability)
