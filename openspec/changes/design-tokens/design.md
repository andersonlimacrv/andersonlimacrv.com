## Context

Change `site-foundation` já entrega `global.css` base com Tailwind v4 (config via CSS). Ver proposal.md - Why. O prompt §4 define tokens, tipografia, elevação e linguagem visual. Nenhum token existe ainda.

## Goals / Non-Goals

**Goals:**
- Todos os tokens do prompt §4.2 como CSS custom properties, com tema escuro.
- Escalas tipográficas fluida (`clamp()`) e utilitários editoriais reutilizáveis.
- Estética quase monocromática; `--primary` só em acentos.

**Non-Goals:**
- Estilização de componentes específicos (header/hero/cards) — changes de página.
- Paleta expansiva ou multicolorida.
- Animações (change `motion-transitions`).

## Decisions

**Tokens como CSS custom properties no `:root` e `[data-theme="dark"]`, base `hsl()`** — Razão: prompt §4.2 usa formato `0 0% 100%` (hsl sem matiz, quase monocromático); permite transparência via `hsl(var(--foreground) / 0.4)`. Alternativa: hex direto (rejeitado — dificulta alfa e consistência).

**Tema escuro via `[data-theme="dark"]` + `@media (prefers-color-scheme: dark)`** — Razão: prompt §10 pede respeitar preferência do sistema; atributo permite override futuro (toggle). Estratégia: CSS media query aplica o atributo via pequeno script inline no `<head>` (zero-FOUC, ~0.5KB) — sem island.

**Tailwind v4 `@theme` mapeando tokens para utilities** — `@theme inline { --color-background: var(--background); ... }` para usar `bg-background`, `text-foreground` etc. Razão: reuso idiomático no JSX/HTML. Alternativa: só CSS puro (rejeitado — perde utilities Tailwind).

**Escala tipográfica com `clamp()`** — Display `clamp(2.5rem, 6vw, 5.5rem)` no hero; headings menores escalam proporcionalmente. Razão: prompt §4.1/§9 (fluidez real, sem breakpoints de font-size).

**Utilitários em `@layer utilities/components`** — `.eyebrow`, `.heading-display`, `.card-surface`, gradiente radial sutil em pseudo-elemento fixo. Razão: componentes astro ficam limpos; consistência visual garantida.

**Radius global 4px** via `--radius`; sombra quente única `--shadow-soft`; blur só em `.header-sticky`/overlays.

## Risks / Trade-offs

- [Muitos tokens criam desordem] → Nomear por função (`--foreground`, não `--gray-900`); manter só o que o prompt pede.
- [`@theme inline` com var CSS não resolve em runtime] → Usar `@theme inline` (resolução em build) — padrão documentado do Tailwind v4.
- [Script de tema no head aumenta ~0.5KB JS] → Aceitável; sem ele há flash de tema incorreto (pior para UX).
