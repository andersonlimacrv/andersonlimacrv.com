## Context

Projeto vazio (sem código de aplicação). Ver proposal.md - Why. O prompt define stack Astro + Tailwind, fontes self-hosted, zero JS por padrão. Nenhuma escolha anterior de ferramenta existe no repo.

## Goals / Non-Goals

**Goals:**
- Scaffold mínimo e funcional que builda em SSG puro.
- Tailwind v4 via plugin Vite (config em CSS — alinhado ao prompt §2).
- Fontes variáveis self-hosted prontas para consumo.
- Layout base com semantic HTML e skip-link.

**Non-Goals:**
- Conteúdo de páginas (home, blog) — changes subsequentes.
- Design tokens/estilo final — change `design-tokens`.
- SEO completo — change `technical-seo`.

## Decisions

**Astro 5 via `npm create astro@latest` (template minimal/empty)** — Razão: gera `astro.config.mjs`, `tsconfig`, `.gitignore` e scripts prontos; manual seria propenso a erro de versão. Alternativa considerada: template `blog` (rejeitado — traz estrutura que não usaremos).

**Tailwind v4 via `@tailwindcss/vite`** — Razão: prompt §2 pede o novo plugin Vite do Tailwind 4; sem `tailwind.config.js` (config via CSS `@theme`). Alternativa: `@astrojs/tailwind` (descontinuado para Tailwind 4).

**Fontes via `@fontsource` variáveis** — `@fontsource-variable/manrope`, `@fontsource-variable/jetbrains-mono`, `@fontsource-variable/fraunces`. Razão: self-host automático com subsetting, sem CDN externo (prompt §4.1). Import no `global.css`/layout com `font-display: swap`.

**`BaseLayout.astro` com props tipadas (`title`, `description`, `lang`)** — Razão: reuso em todas as páginas; meta tags completas chegam no change `technical-seo`, aqui fica o esqueleto `<head>` + skip-link + `<header>`/`<main>`/`<footer>` slots.

**Rotas/estrutura**: roteamento por arquivo do Astro (`src/pages`). Decisão de rota: `/`, `/blog`, `/blog/[slug]` — fixadas no prompt §3.

**TypeScript strict** — `astro check` no CI/scripts para validação de tipos.

## Risks / Trade-offs

- [Versões novas de Astro/Tailwind com breaking changes] → Pinagem via `npm create astro` + lockfile; `astro check` e `build` no final de cada change.
- [Import de todas as variantes de fonte aumenta payload] → Usar apenas pesos usados (Manrope 400–800, JetBrains Mono 600, Fraunces 400–500) via imports específicos do @fontsource-variable.
- [Tailwind v4 ainda muda de API em releases menores] → Ficar na versão travada pelo lockfile; config simples (via CSS) reduz superfície de quebra.
