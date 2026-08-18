## Context

A scrollbar nativa do browser destoa visualmente do projeto: track cinza-azulado e thumb grosso (12–17px) quebram o ritmo monocromático e editorial da UI. O site já tem tokens `--muted-foreground`/`--foreground`/`--border` em `:root` (claro) e `.dark` (escuro) — a solução é derivar a scrollbar desses tokens, herdando o tema automaticamente. CSS puro, zero JS, zero dependências.

## Goals / Non-Goals

**Goals:**
- Scrollbar global fina (8px) no `html`, com thumb discreto (`--muted-foreground`) que vira `--foreground` no hover.
- Track transparente (não compete com o conteúdo).
- Funciona em claro e escuro automaticamente via tokens.
- Coberto em Firefox/IE/Edge legacy (padrão W3C `scrollbar-width`/`scrollbar-color`) e Chromium/Safari (`::-webkit-scrollbar*`).
- `prefers-reduced-motion: reduce` desativa a transição do hover.

**Non-Goals:**
- Não criar `.no-scrollbar`.
- Não estilizar scrollbars internas (`<pre>`, dropdowns).
- Não adicionar JS ou dependências.
- Não variar largura por seção.
- Não usar `scrollbar-gutter`.

## Decisions

### 1. CSS puro, não Tailwind
A scrollbar estilizada não tem equivalente limpo em utilitários Tailwind v4 — o `@theme inline`ungeriria classes auxiliares sem benefício real. CSS puro com seletores padrão (`::-webkit-scrollbar*`, `scrollbar-*`) é mais curto (~15 linhas), mais performático (uma única declaração no `global.css` já minificado com o build), sem camada de abstração. **Decisão: CSS puro em `global.css`.**

### 2. Largura 8px
A largura nativa do browser é 12–17px (Chromium 16, Firefox 14, Safari 15). 8px é o ponto onde o thumb ainda é agarrável em desktop mas não compete com o conteúdo. Menor que isso (4–6px) perde affordance. **Decisão: 8px em `width` e `height`**.

### 3. Paleta derivada dos tokens
- Thumb repouso: `var(--muted-foreground)` — cinza neutro do projeto, já calibrado para claro/escuro.
- Thumb hover/active: `var(--foreground)` — máximo contraste com a intenção do gesto.
- Track: `transparent` — a barra some visualmente quando não há thumb em cima; o fundo do site (claro ou escuro) mostra direto.
- Corner: `transparent` (impede o canto entre barras vertical/horizontal de usar cor default do browser).

**Decisão:** thumb com `--muted-foreground`/`--foreground`, track transparente. Hover disponível apenas em Chromium/Safari (Firefox/IE não suportam hover em `scrollbar-color` — o thumb fica estável no `--muted-foreground`, comportamento aceitável para a abordagem discreta escolhida).

### 4. Sem raio no thumb
O visual blueprint do projeto é técnico/engenharia com divisores retos, cantoneiras 2px, marcadores quadrados. Thumb arredondado (`border-radius: var(--radius)`) brigaria com esse sistema. **Decisão: `border-radius: 0`**.

### 5. Transição de hover (`transition-micro` reutilizado)
O projeto tem `transition-micro` (0.18s ease-out) usado em links e cards. Reutilizar a mesma duração/easing no hover do thumb mantém a coerência de motion. **Decisão: `transition: background-color 0.18s ease-out` no thumb**.

### 6. `prefers-reduced-motion: reduce` desativa a transição
Bloco `@media (prefers-reduced-motion: reduce) { ::-webkit-scrollbar-thumb { transition: none } }`. Já existe um bloco `prefers-reduced-motion: reduce` global em `global.css` (linhas ~676) com `* { transition: none }` — o efeito é automático, mas um seletor explícito na seção "Scrollbar" documenta a intenção e resiste a refactors.

### 7. Posição no `global.css`
Seção "Scrollbar" entre os tokens (`:root`/`.dark` terminam ~linha 225) e as "Utilities — editorial" (~linha 553). Comentário de seção no mesmo padrão (`/* ----- Scrollbar ... ----- */`).

### 8. Cobertura global no `html`
Aplicar no `html` em vez de `body`/`*`: garante a scrollbar da viewport (que vive no `html`), evita herdar/aplicar a elementos roláveis internos (`<pre>`, dropdowns podem usar overflow nativa). Elementos `<body>` herdam naturalmente.

## Cross-browser support

| Engine | Propriedade | Suporte | Comportamento esperado |
|---|---|---|---|
| Firefox/IE/Edge legacy | `scrollbar-width: thin`, `scrollbar-color` | Total | Thin (≈8px nativos do agente),thumb `--muted-foreground`, track transparent. Sem hover. |
| Chromium ≥80 (Chrome, Edge, Opera, Brave) | `::-webkit-scrollbar*` | Total | 8px, thumb `--muted-foreground`, hover `--foreground` com transição. |
| Safari ≥13.1 (macOS) | `::-webkit-scrollbar*` | Total | Igual ao Chromium. |
| iOS Safari (mobile) | não estilizado | — | Overlay nativa do SO (pretendido; não regressão). |
| Chrome Android (mobile) | não estilizado | — | Overlay nativa do SO. |

## Risks / Trade-offs

- [Thumb não vira `--foreground` no hover no Firefox] → aceite: `scrollbar-color` é estático no W3C. O contraste `--muted-foreground` vs. fundo já é suficiente para легibilidade.
- [8px pode ser apertado em trackpads pequenos] → público do site é desenvolvedores/designers em desktops; affordance agarrável (16px Fitts) ainda válido pela altura do thumb (≥30px).
- [`-webkit-scrollbar` herda para elementos filhos com overflow] → não regressão: todos os navegadores tratam elementos roláveis filhos com a mesma scrollbar estilizada, o que é benção visual (consistência). Se futuro exige variar, criar `.no-scrollbar`.
- [Build aumenta ~0.3 KB] → delta mínimo; auditoria confirma.

## Verificação

- `astro check` 0 erros.
- `npx openspec validate custom-scrollbar --type change` ✓.
- e2e/scrollbar.spec.ts: 5 testes (largura, thumb claro, thumb hover, thumb dark, reduced-motion).
- `node scripts/audit.mjs` confirma delta ~+0.3 KB CSS raw / ~+0.1 KB gzip.
