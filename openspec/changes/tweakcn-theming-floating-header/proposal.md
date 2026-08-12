## Why

O site precisa permitir troca visual rápida e segura via tweakcn.com (gerador de temas shadcn/ui). Hoje `global.css` usa tokens HSL próprios (`hsl(var(--X))` com tripletos) incompatíveis com o schema exportado pelo tweakcn, exigindo edição manual de dezenas de variáveis e utilitários arbitrários espalhados nos componentes. Além disso, o header não tem o comportamento flutuante desejado (barra no topo que colapsa em um quadrado com blur).

## What Changes

- Reformatar `src/styles/global.css` para o schema de tokens do `example-tweakcn.css` (OKLCH, conjunto completo shadcn: background, foreground, card, popover, primary, secondary, muted, accent, destructive, border, input, ring, chart-1..5, sidebar, fontes, radius, escala de shadows) — com valores iniciais reproduzindo o visual atual.
- Adicionar `@custom-variant dark (&:is(.dark *))` e migrar o dark mode de `[data-theme='dark']` para a classe `.dark` (padrão shadcn/tweakcn).
- Substituir as 43 ocorrências de `hsl(var(--X))` nos componentes por utilitários Tailwind do tema (`text-muted`, `border-border`, `hover:bg-primary/5`, etc.).
- Header: barra sticky full-width no topo que, ao rolar, colapsa em um quadrado centralizado com blur que flutua sobre a tela; o quadrado abre um painel com todo o conteúdo do header (logo, nav, idioma, tema).
- LanguageSwitcher passa a exibir abreviações (PT/ES/EN) com nome completo em `aria-label`/`title`.

## Capabilities

### New Capabilities
- `theming-tokens`: schema de design tokens compatível com tweakcn/shadcn (OKLCH, `.dark` class, `@theme inline`), permitindo trocar o tema colando CSS gerado externamente.
- `floating-header`: header com dois estados (barra full-width fixa no topo e quadrado flutuante com blur ao rolar), painel compacto responsivo e alternador de idioma por abreviação.

### Modified Capabilities
<!-- Nenhuma spec principal existe ainda (openspec/specs vazio); nenhum requisito existente é alterado. -->

## Impact

- **Código**: `src/styles/global.css` (reescrita dos tokens), `BaseLayout.astro` e `theme-toggle.ts` (dark mode `.dark`), `Header.astro` (estrutura + script de scroll), `LanguageSwitcher.astro` (abreviações), e refactor de classes nos componentes (Header, Footer, ProjectLink, PostCard, SectionHeading, ThemeToggle, HomePage, BlogIndexPage, BlogPostPage, PostLayout).
- **Dependências**: nenhuma nova (sem React, sem shadcn CLI). Sem impacto em SEO, RSS, performance ou build.
- **Comportamento**: visual inicial idêntico ao atual; dark mode via classe `.dark`; header com estado flutuante.

## Non-goals

- Não instalar React nem o CLI do shadcn (apenas o schema de tokens é necessário para tweakcn).
- Não alterar rotas, SEO, RSS, sitemap, conteúdo do blog nem o layout das páginas.
- Não mudar as fontes (Manrope/JetBrains Mono/Fraunces) nem a identidade monocromática.
- Não trocar o tema atual por um colorido — a migração preserva o visual.
