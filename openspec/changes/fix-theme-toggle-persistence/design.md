## Context

O botão atual (`ThemeToggle.astro` + `theme-toggle.ts`) usa `data-astro-transition-persist="theme-toggle"`
para sobreviver às View Transitions do `ClientRouter`. O script de tema reexecuta a cada navegação e
`document.querySelector('.theme-toggle')` encontra o botão persistido, empilhando um listener novo por
página → cada clique alterna o tema N vezes (parece "não trocar"). O `aria-label` é fixo em pt-BR e o
ícone é um sol/lua genérico com `hidden` alternado por classe. Os tokens de tema (schema OKLCH em
`global.css`) não devem mudar. Ver proposal.md - Why para motivação.

## Goals / Non-Goals

**Goals:**
- Binding de click único entre navegações (guard no próprio elemento persistido) e re-sync de estado
  em `astro:page-load`.
- Controlador vanilla único para o tema (`src/lib/theme.ts`), espelhando a API do `useThemeToggle`
  dos drafts, consumido por qualquer UI.
- Animação de troca de tema via `document.startViewTransition` (variante `circle`/`center` por padrão),
  com CSS injetado removido ao final (sem conflitar com as transições de página do Astro).
- Visual exato do `ThemeToggleButton1` do draft (split sol/lua, viewBox 240, rotação -180º/+180º,
  easeInOut 0.35s), adaptado a tokens (`bg-foreground text-background`, fills `currentColor`/
  `var(--foreground)`).

**Non-Goals:**
- Não adiciona React/framer-motion/next-themes (zero-JS preservado).
- Não porta o painel Options/drag/GIF de demonstração.
- Não altera os tokens OKLCH de tema (mudança apenas aditiva: `--expo-out`/`--expo-in`).

## Decisions

### Port 1:1 do `createAnimation` em `src/lib/theme-transition.ts`
O `createAnimation` + helpers (`generateSVG`, `getPositionCoords`, `getTransformOrigin`) dos drafts são
funções puras (geram strings CSS) sem dependências React. Copiados verbatim, com todas as variantes
(circle, rectangle, polygon, circle-blur, gif); a UI usa `circle`/`center` por padrão.
- Alternativa: reimplementar só o circle. Rejeitada: desperdiça código já pronto e testado.

### Controlador `src/lib/theme.ts` espelha `useThemeToggle`
Mesma API (`toggleTheme`, `setCrazyLightTheme`, `setCrazyDarkTheme`, `setCrazySystemTheme`) e mesmo
fluxo do draft: gera `createAnimation(...)`, injeta `<style id="theme-transition-styles">`, chama
`document.startViewTransition(() => applyTheme(next))`, limpa o `<style>` em `transition.finished`.
Substitui `next-themes` por `localStorage['theme']` + classe `.dark` (consistente com o script anti-FOUC
do `BaseLayout`). `setCrazySystemTheme` remove o storage e segue `prefers-color-scheme`.
- Alternativa: manter `theme-toggle.ts` autossuficiente. Rejeitada: duplicaria a lógica de tema.

### Conflito com o ClientRouter do Astro
Astro e a troca de tema usam `::view-transition-*` de `root`. Mitigações:
- CSS injetado é removido em `finished` (com timeout de segurança) → não rouba transições de página.
- `document.startViewTransition` em `try/catch`: se já houver transição ativa (navegação em curso),
  cai para troca instantânea.
- `prefers-reduced-motion: reduce` → troca instantânea (sem animação).

### Ícone: SVG verbatim + rotação por classe
Os paths do split sol/lua e do anel são copiados exatos do draft; a rotação do `motion.g` vira uma
classe `.is-dark` no botão com CSS `transition: transform 0.35s ease-in-out`. Fills mapeados aos tokens:
hemisfério visível = `currentColor` (text-background), hemisfério "fundo" = `var(--foreground)` (cor do
botão), anel = `currentColor` — preserva o desenho do draft nos dois temas.
- Alternativa: `fill="white"`/`fill="black"` fixos como no draft. Rejeitada: quebra o contraste no tema escuro.

### Persistência: guard `data-bound` + evento `themechange`
O `theme-toggle.ts` verifica `button.dataset.bound`; se ausente, adiciona o listener de click e o de
`themechange`, e seta o guard. Sempre chama `sync()` (ícone, `aria-pressed`, `aria-label`) — em execução
e em `astro:page-load`. O controlador emite `CustomEvent('themechange', { detail: { theme } })`.

## Risks / Trade-offs

- **`startViewTransition` pode ser chamado durante navegação do Astro** → `try/catch` com fallback
  instantâneo; flag `active` evita animações concorrentes.
- **CSS injetado vazando para transições de página** → remoção em `transition.finished` + timeout de
  segurança (idempotente).
- **Browser sem `document.startViewTransition`** → fallback instantâneo já no fluxo (ícone continua
  sincronizando via `themechange`).
- **`--expo-out`/`--expo-in` não existem hoje** → definidos em `:root` do `global.css` (easing, fora do
  schema de tema; nenhum token existente é alterado).
