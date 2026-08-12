## Why

O toggle de tema some ou "não troca" após navegar (ex.: para páginas do blog): o script
`theme-toggle.ts` reexecuta a cada View Transition e **empilha listeners de click** no botão
persistido, alternando o tema 2x+ por clique. Além disso o aria-label é fixo em pt-BR e o botão
usa um ícone genérico que não reflete o tema. Aproveitando o código dos drafts
`docs/drafts/theme-toggle-i-want.ts` e `docs/drafts/example-toggle-usage.tsx` (portados para
vanilla), trocamos o visual pelo split sol/lua com animação de troca de tema via View Transition API.

## What Changes

- Corrige a persistência do toggle: binding de click **único** (guard `data-bound`) + re-sync de
  estado em `astro:page-load`, garantindo que cada clique alterna o tema **exatamente 1x**.
- Novo controlador `src/lib/theme.ts` (espelho vanilla do hook `useThemeToggle`): `getTheme`,
  `setTheme`, `toggleTheme`, `setCrazyLightTheme`, `setCrazyDarkTheme`, `setCrazySystemTheme`,
  reusando `localStorage['theme']` + classe `.dark` (mesma lógica do script anti-FOUC).
- Nova animação de troca de tema via **View Transition API**: port 1:1 do `createAnimation`
  (todas as variantes) em `src/lib/theme-transition.ts`; default `circle`/`center`; CSS injetado é
  **removido após a transição** para não conflitar com a navegação do Astro; fallback para
  `prefers-reduced-motion`, browsers sem suporte e transição já ativa.
- Novo visual do botão: **SVG exato** do `ThemeToggleButton1` (split sol/lua, viewBox 240,
  rotação -180º/+180º, easeInOut 0.35s) adaptado aos design tokens (`bg-foreground text-background`
  + fills `currentColor`/`var(--foreground)`), mantendo os tokens de tema inalterados.
- aria-label/title passam a vir de `ui[locale].themeToggle` (pt/es/en já existem em `src/i18n/ui.ts`).
- **Non-goals**: não adiciona React/framer-motion/next-themes (zero-JS preservado); não inclui o
  painel Options/drag/GIF de demonstração; não altera os tokens OKLCH de tema.

## Capabilities

### New Capabilities
- `theme-toggle`: controle de tema claro/escuro do site — persistência, sincronização do botão
  entre navegações, acessibilidade por idioma e animação de transição de tema via View Transition API.

### Modified Capabilities
<!-- Nenhuma spec principal existe ainda; esta change introduz a capability de forma incremental. -->

## Impact

- `src/lib/theme.ts` (novo), `src/lib/theme-transition.ts` (novo, port do draft)
- `src/components/ThemeToggle.astro`, `src/components/theme-toggle.ts` (reescritos)
- `src/styles/global.css` (só adiciona `--expo-out`/`--expo-in`; tokens de tema intactos)
- `src/i18n/ui.ts` (sem mudanças; labels já existem)
- `e2e/theme-toggle.spec.ts` (novos testes de regressão)
