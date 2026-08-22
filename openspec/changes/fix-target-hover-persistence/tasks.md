## 1. Auditoria e Reprodução

- [ ] 1.1 Mapear todos `.cursor-target` e ancestrais `position/overflow/z-index` (Header, Footer, PostCard, ProjectLink, About 5 socials, Blog viewAll, Contact email) — validar `src/styles/target-hover.css:59 position:relative` não sobrescrito por Tailwind.
- [ ] 1.2 Criar `e2e/target-hover-persistence.spec.ts` repro falho: `goto("/")` → `expect(corners≥n*4)` desktop, `goto("/blog")` via `ClientRouter` click, `goto("/")` de volta → `expect(corners)` falha antes do fix, mobile (`390`) `expect(0)`.
- [ ] 1.3 Rodar `npm run build` e `npm run test:e2e -- target-hover` para confirmar vermelho antes do fix.

## 2. Fix Core `src/lib/target-hover.ts`

- [ ] 2.1 Mover `isMobile`/`prefers-reduced-motion` para dentro de `init()`, reavaliar a cada `astro:page-load`; adicionar `matchMedia('(max-width:768px)')` listener para `resize` sem navegação.
- [ ] 2.2 Trocar `window.addEventListener("astro:before-swap"/"astro:after-swap")` por `document.addEventListener('astro:before-swap'/'astro:after-swap'/'astro:page-load')` + guard `window.__targetHoverInitialized`; manter `window` como fallback secundário se necessário.
- [ ] 2.3 Introduzir `WeakMap<HTMLElement, {cleanup}>` para guardar `mouseenter/mousemove/mouseleave` handlers + corners + `requestAnimationFrame`; `cleanup()` remove listeners + `corner.remove()` + `cancelAnimationFrame` + `delete dataset` + `observer.disconnect()`.
- [ ] 2.4 Garantir `init()` idempotente: `targets().forEach(setupTarget)` com early-return via `WeakMap`/`dataset`, `MutationObserver` reconectado em `document.body {childList:true,subtree:true}`.

## 3. CSS / Layout Audit

- [ ] 3.1 Confirmar `src/styles/target-hover.css` `position:absolute` offsets `calc(var(--target-offset)*-1)` não clipados por `overflow:hidden` em `Reveal`/`PostCard`/`site-header` (`src/styles/global.css:350`).
- [ ] 3.2 Confirmar `src/layouts/BaseLayout.astro:157` import permanece bundlado sem `is:inline`; `target-hover.css` import mantido.

## 4. Testes

- [ ] 4.1 Novo `e2e/target-hover-persistence.spec.ts` verde: desktop `1280` (corners `n*4`), mobile `390` (0), `prefers-reduced-motion: reduce` ainda `transition: none` (`src/styles/target-hover.css:67`).
- [ ] 4.2 Regressão `e2e/about-section.spec.ts:89` (links sociais 5*4 corners desktop) continua verde.
- [ ] 4.3 Navegação `Home ↔ /blog ↔ Home` e `Home ↔ /blog/[slug] ↔ Home` + `i18n` `/en/` `/es/` sem duplicação de corners no header (`header .target-hover-corner` count estável após 3 ciclos).

## 5. Validação & Acessibilidade

- [ ] 5.1 `npm run check` sem erros TS; `npm run build` sem regressão de tamanho.
- [ ] 5.2 Manual: DevTools `prefers-reduced-motion`, `ontouch` emulate, resize `768` breakpoint, 3 ciclos de navegação via `ClientRouter`.
- [ ] 5.3 Verificar `header` `data-astro-transition-persist` não acumula corners (antes 4, após 3 ciclos ainda 4 por `.cursor-target`).
