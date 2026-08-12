## Context

O site usa Tailwind v4 com tokens em `global.css` (forma atual: tripletos HSL + `hsl(var(--X))` com opacidade inline em componentes via utilitários arbitrários). O `example-tweakcn.css` (já no repo) define o schema alvo: OKLCH, classe `.dark`, `@custom-variant dark` e `@theme inline`. O header hoje não é sticky de fato (`.header-sticky` não existe no CSS) e o dark mode usa `data-theme` + media query. Ver proposal.md — Why para motivação.

## Goals / Non-Goals

**Goals:**
- Compatibilidade total com o CSS exportado pelo tweakcn (paste direto no `global.css`).
- Visual inicial idêntico ao atual (monocromático), dark via `.dark`.
- Header como uma única toolbox flutuante (uma fonte de estado via scroll) e reuso dos componentes existentes (`ThemeToggle`, `LanguageSwitcher`, `PostCard`, etc.).
- Zero JS novo além do script de scroll; sem React; build/SEO/RSS intactos.

**Non-Goals:**
- Instalar shadcn CLI/React (Fase futura opcional).
- Redesenhar layout das páginas, rotas ou conteúdo.
- Menu hambúrguer clicável em telas pequenas (fase futura; hoje a nav fica oculta em `<sm`).

## Decisions

### 1. Tokens: atributo → classe `.dark` + `@custom-variant dark`

O exemplo tweakcn usa `@custom-variant dark (&:is(.dark *))` e blocos `.dark { ... }`. Migra-se o mecanismo (de `data-theme` para classe `.dark`) para que o CSS colado funcione sem adaptação. O script inline anti-FOUC do `BaseLayout` e o `theme-toggle.ts` passam a manipular a classe `.dark` (persistindo `localStorage('theme')`; sem preferência → `matchMedia`). Alternativa considerada: manter `data-theme` e duplicar seletores — rejeitada por duplicar lógica e quebrar o "paste direto".

### 2. Opacidade: de `hsl(var(--X) / a)` para utilitários do tema

Como os tokens viram valores completos (OKLCH), `hsl(var(--x) / 0.6)` deixa de funcionar. Substituição por utilitários mapeados no `@theme inline`: `bg-background/60`, `border-border`, `text-muted`, `hover:bg-primary/5`, `hover:border-primary/50`, `rounded-lg` (alias de `--radius`). Em CSS próprio (`.card-surface`, `.eyebrow`, `.grid-bg`, `.skip-link`, `.post-content a`), usar `@apply`/`color-mix` com os tokens. `--blur` e `--shadow-soft` são mantidos como tokens locais (fora do schema shadcn) e consumidos via `.backdrop-blur-soft`/`.shadow-soft`.

### 3. Header: toolbox flutuante única que aproxima no scroll (sem mudar o layout)

Uma única caixa de ferramentas (toolbox) horizontal — `position: sticky; top: 0` num wrapper full-width com `pointer-events: none`. **No topo** o wrapper ocupa 100% da largura com apenas a borda inferior (`border-bottom: border-border`) e sem fundo; **ao rolar** a toolbox flutua centralizada, ganhando `border-radius: var(--radius)`, fundo translúcido com `backdrop-blur` (alpha 0 → 90%), borda completa (alpha 0 → 100%) e sombra. Links seguem o padrão do site: mono uppercase, `text-muted-foreground` → `hover:text-foreground` (sem bg no hover), página atual com underline (como o `LanguageSwitcher`). O item "Blog" do header SHALL ser âncora para a seção `#blog` da landing (que exibe os últimos 3 posts); a página `/blog` é alcançada apenas pelo link "Ver todos os posts" da seção. Todos os itens (logo, nav, idioma, tema) ficam na mesma linha, na mesma ordem, sempre visíveis (nav oculta em `<sm`; hambúrguer fica para fase futura). O wrapper preserva o espaço no fluxo (sem pulo de layout; âncoras via `scroll-padding-top` no `html`).

O scroll não troca de componente: `site-header.ts` grava `--header-progress` (0..1, máx. ~200px) no `<header>` persistido (`data-astro-transition-persist="header"`), e o CSS interpola apenas a "aproximação": padding do wrapper (6px → 12px), gap entre itens (8px → 4px) e intensidade de fundo (0 → 90%), borda da toolbox (0 → 100%) — a borda inferior full-width do topo some (100% → 0) — e sombra (0 → 40%).

Alternativas consideradas e rejeitadas: barra full-width que colapsa em chip `<details>` de dois estados (o layout do componente mudava ao rolar); `position: fixed` + spacer (exige padding compensatório em todas as páginas).

### 4. Script de scroll no padrão existente

Módulo `site-header.ts` no padrão de `theme-toggle.ts` (módulo vanilla + `<script>` no componente). Lê o scroll com `requestAnimationFrame` (throttle) e grava `--header-progress` (0..1, máximo em ~200px); sem scroll → zera (topo). Re-sincroniza em `astro:page-load` (View Transitions) porque o header é persistido entre navegações. `prefers-reduced-motion: reduce` → progresso 0/1 direto (compacta sem animar).

### 5. LanguageSwitcher como select nativo

Um `<select>` nativo estilizado no design system (mono uppercase, `border-border`, raio `var(--radius)`, fundo translúcido, chevron via SVG próprio, hover → foreground) substitui os três links abreviados — alvo único de 44px, acessível por teclado e legível por leitores de tela sem JS extra além do listener de `change`. Cada `<option>` carrega o href traduzido (`translatePath`/`postMap`, como antes) no `value`; no `change`, navega via `location.assign` se o destino diferir da URL atual.

## Risks / Trade-offs

- [Quebra visual pontual por utilitário mapeado errado] → Aprovar por build + inspeção do CSS gerado; quase todas as substituições são 1:1 (texto muted → `text-muted-foreground`).
- [`astro:page-load` não disparar em navegação inicial] → `site-header.ts` sincroniza no load e no evento; guard para não duplicar listener.
- [`@custom-variant dark` + media query antiga coexisterem] → remover o bloco `@media (prefers-color-scheme)` e o atributo `data-theme` dos seletores; script pré-pintura é a única fonte de verdade.
- [Toolbox ocupar a largura toda em telas pequenas] → wrapper full-width com `padding-inline` + pílula `width: fit-content`; itens de 44px cabem em ~320px.
- [Reduced motion: estados discretos com progresso 0/1] → aplica direto, sem animação (conforme REQ-8).

## Migration Plan

1. `global.css`: novo schema de tokens + `@custom-variant dark` + base layer; remoção do media query antigo.
2. `BaseLayout.astro` (script inline) + `theme-toggle.ts`: classe `.dark`.
3. Refactor `hsl(var(--X))` nos componentes (43 ocorrências).
4. Header (toolbox `.site-toolbar`) + `site-header.ts` + LanguageSwitcher abreviado.
5. Validar: `npm run check` (0 erros), `npm run build`, conferência de RSS/sitemap/hreflang e dark/light. Rollback: git revert (mudanças localizadas em componentes + CSS).