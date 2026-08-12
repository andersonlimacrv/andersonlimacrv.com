## Why

O site ainda usa cores de destaque (azul/laranja) herdadas do template inicial, contrariando a estética editorial B&W do master prompt. Além disso, não há controle visível de tema claro/escuro no header (o toggle existe no código do anti-FOUC, mas não há botão).

## What Changes

- Substituir `--primary` (azul) e `--secondary` (laranja) por tokens estritamente neutros: `--primary` = foreground (preto no tema claro, branco no escuro), `--secondary` = cinza médio (muted).
- Revisar todos os usos de cor em componentes/páginas para remoção total de matiz (somente preto, branco e cinzas).
- Adicionar `ThemeToggle` no cabeçalho (ícone sol/lua, estilo line) que alterna `data-theme` `light` ↔ `dark`, persiste a escolha em `localStorage`, respeita `prefers-color-scheme` em primeira visita e previne FOUC de tema.
- Manter imagem `me.png` já em B&W sem filtros.

## Capabilities

### New Capabilities
- `theme-toggle`: Alternância de tema claro/escuro com persistência local, sem flash (FOUC) e acessível (WCAG 2.1 AA).

### Modified Capabilities
- `design-tokens`: Paleta muda para estritamente monocromática (preto/branco/cinzas); `--primary` e `--secondary` tornam-se tokens neutros.

## Impact

- `src/styles/global.css`: tokens de cor e variantes de hover/focus/selection.
- `src/components/Header.astro`, `src/components/*.astro`, `src/layouts/*.astro`, `src/pages/index.astro`: usos de `--primary`/`--secondary` com matiz.
- Novo `src/components/ThemeToggle.astro`.
- `src/layouts/BaseLayout.astro`: script inline anti-FOUC já existente; ampliar para suportar o botão.

## Non-goals

- Não criar seletor de idiomas (change `i18n-multilingual` separado).
- Não alterar tipografia, layout ou conteúdo.
- Não adicionar acentos de cor em modo algum (paleta 100% B&W).