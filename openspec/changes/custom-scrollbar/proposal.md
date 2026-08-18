## Why

A scrollbar nativa do browser destoa do desenho monocromático e editorial do site (track cinza-azulado, thumb grosso). Uma scrollbar personalizada, fina e derivada dos tokens do projeto (`--muted-foreground`/`--foreground`) alinha a rolagem à estética Engineering Blueprint e dá continuidade visual entre os temas claro e escuro. Como os tokens já trocam automaticamente entre `:root` e `.dark`, a scrollbar acompanha o tema ativo **sem JS adicional**.

## What Changes

- **CSS puro em `src/styles/global.css`** (~15 linhas, seção própria "Scrollbar"):
  - `html` com `scrollbar-width: thin` (Firefox/IE/Edge legacy) + `scrollbar-color: var(--muted-foreground) transparent` (duas cores: thumb e track — único par suportado pelo padrão W3C).
  - `::-webkit-scrollbar` (Chromium/Safari): largura 8px; altura 8px (horizontal, se aparecer).
  - `::-webkit-scrollbar-track` transparente.
  - `::-webkit-scrollbar-thumb` com `background: var(--muted-foreground)`; `:hover`/`:active` com `background: var(--foreground)`; transição 0.18s ease-out (mesma duração do `transition-micro` do projeto); sem raio (alinha à est blueprint técnica).
  - `::-webkit-scrollbar-corner` transparente (canto entre barras horizontal/vertical).
- **Respeita `prefers-reduced-motion: reduce`**: desativa a transição de hover do thumb (sem `transition`).
- **Cobertura global no `html`**: toda a página usa a mesma scrollbar. Elementos roláveis internos (overflow em `<pre>`, menus dropdown) não entram no escopo — herdam a scrollbar nativa do elemento; podem ser estilizados em changes futuras.

## Capabilities

### New Capabilities

- `custom-scrollbar` — scrollbar global fina (8px) com cores derivadas dos tokens `--muted-foreground`/`--foreground`, cobrindo Firefox (padrão W3C) e Chromium/Safari (`::-webkit-scrollbar`), com hover suave e suporte a tema claro/escuro automático via tokens.

### Modified Capabilities

_(nenhuma)_

## Non-goals

- Não criar utilitário `.no-scrollbar` (reservado para uso futuro, fora deste escopo).
- Não estilizar scrollbars internas de elementos (`<pre>`, dropdowns, code blocks) — globais apenas.
- Não adicionar JS, dependências, ou aumentar o bundle JS/largura de banda.
- Não adicionar variantes de largura por seção (8px fixo).
- Não usar `scrollbar-gutter: stable` (fora do escopo).
- Não mudar o comportamento de scroll/touch overlay no mobile (a estilização só é visível em desktops com scrollbars clássicas; mobile mantém overlay nativa — comportamento esperado).

## Impact

- `src/styles/global.css`: +seção "Scrollbar" (~15 linhas), após os tokens `:root`/`.dark` e antes das "Utilities — editorial".
- `e2e/scrollbar.spec.ts` (novo, ~5 testes): largura 8px, cor do thumb via `--muted-foreground`, hover muda para `--foreground`, tema escuro troca paleta, `prefers-reduced-motion: reduce` desativa transição.
- `docs/audit.md`/`audit-history.md`/`perf-seo-checklist.md`: métricas atualizadas (delta esperado ~+0.2–0.4 KB raw CSS).
- `openspec/changes/custom-scrollbar/`: proposal, design, tasks, specs.
