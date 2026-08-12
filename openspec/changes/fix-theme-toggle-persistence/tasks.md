## 1. Animação e controlador de tema

> Nota: o change `perf-font-preload` podou posteriormente `theme-transition.ts`
> (removeu `generateSVG`, `getPositionCoords`, `getTransformOrigin` e variantes
> rectangle/gif/polygon/circle-blur) e `theme.ts` (removeu `setCrazy*` e
> `setTheme`), mantendo só `createAnimation('circle','center')` e os exports
> usados. A funcionalidade desta task permanece coberta; apenas código morto
> foi removido em favor de um bundle menor.

- [x] 1.1 Criar `src/lib/theme-transition.ts` portando 1:1 `createAnimation`, `generateSVG`, `getPositionCoords`, `getTransformOrigin` e os tipos `AnimationVariant`/`AnimationStart` (todas as variantes; default `circle`/`center`), com atribuição Skiper/toggles.dev/rudrodip.
- [x] 1.2 Criar `src/lib/theme.ts` espelhando o `useThemeToggle` dos drafts em vanilla: `getTheme`, `setTheme`, `toggleTheme`, `setCrazyLightTheme`, `setCrazyDarkTheme`, `setCrazySystemTheme`; estado em `localStorage['theme']` + classe `.dark`; emite `CustomEvent('themechange')`.
- [x] 1.3 Implementar em `theme.ts` a troca animada: injeta `<style id="theme-transition-styles">` com o CSS do `createAnimation`, chama `document.startViewTransition(() => applyTheme(next))` e remove o `<style>` em `transition.finished` (com timeout de segurança); fallbacks para `prefers-reduced-motion`, sem suporte a VT e transição já ativa (`try/catch`).

## 2. Botão e CSS

- [x] 2.1 Reescrever `src/components/ThemeToggle.astro`: SVG exato do `ThemeToggleButton1` (viewBox 240, hemisférios + anel), rotação via classe `.is-dark` + `transition: transform 0.35s ease-in-out`, cores por tokens (`bg-foreground text-background`), fills `currentColor`/`var(--foreground)`, mantendo `data-astro-transition-persist="theme-toggle"`.
- [x] 2.2 Usar `ui[locale].themeToggle` (toDark/toLight/title) nos atributos `aria-label`/`title`, passando `locale` via props do Header.
- [x] 2.3 Adicionar em `src/styles/global.css` os easing `--expo-out`/`--expo-in` em `:root` e o `transition` do ícone (sem alterar tokens de tema existentes).
- [x] 2.4 Reescrever `src/components/theme-toggle.ts`: importa `theme.ts` e `theme-transition.ts`; binding de click único via guard `data-bound`; `sync()` de ícone/`aria-pressed`/`aria-label` em execução, em `themechange` e `astro:page-load`.

## 3. Testes e validação

- [x] 3.1 Criar `e2e/theme-toggle.spec.ts`: após navegar `/` → `/blog`, clicar no toggle alterna `.dark` exatamente 1x (regressão do bug de listeners duplicados).
- [x] 3.2 Testar `aria-label` do toggle por idioma (pt/es/en).
- [x] 3.3 Testar `prefers-reduced-motion: reduce` → troca de tema instantânea sem `::view-transition`.
- [x] 3.4 Rodar `npm run test:e2e` (suite completa verde), `npm run check` e `openspec validate`.
