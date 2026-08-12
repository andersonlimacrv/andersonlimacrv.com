## Context

Foundation (`site-foundation`) e tokens (`design-tokens`) prontos. Ver proposal.md - Why. O prompt §4.4 define padrões estruturais (header sticky, hero, seções numeradas, listas com seta, footer). A imagem `me.png` está na raiz do repo (1122x1402px, já B&W).

## Goals / Non-Goals

**Goals:**
- Home one-page completa conforme prompt §12.2, consumindo tokens/layout base.
- Retrato B&W otimizado via `astro:assets` como LCP.
- Componentes reutilizáveis (Header, Footer, Eyebrow, SectionHeading, ProjectLink, PostCard).

**Non-Goals:**
- Conteúdo real definitivo (textos/links podem ser placeholder coerente).
- Blog (change `mini-blog`); SEO completo (change `technical-seo`); motion (change `motion-transitions`).

## Decisions

**Imagem `me.png` → `src/assets/me.png` com `astro:assets`** — Razão: prompt §8 exige AVIF/WebP + srcset; `Image` do astro gera isso em build. `widths={[480, 800, 1122]}`, `sizes` responsivo, `loading="eager"`, `fetchpriority="high"` (LCP). Alternativa: `public/me.png` (rejeitado — sem otimização). `alt` descritivo: "Retrato em preto e branco de Anderson Carvalho".

**Header sticky compacto** — Nome + links âncora (`#sobre`, `#projetos`, `#blog`, `#contato`) com `backdrop-filter` e borda inferior 1px; scroll suave via CSS `scroll-behavior` + `scroll-margin-top` nas seções. Alternativa: menu hambúrguer (rejeitado no desktop; change `responsive-layout` trata mobile).

**Seções numeradas com id âncora** — `SectionHeading` componentiza `01 / Sobre`. Promoção: IDs em pt-BR (`sobre`, `projetos`, `blog`, `contato`) para URLs limpas.

**Projetos como dados em array no frontmatter** — Razão: itens mudam com frequência; array `{ title, description, url, tags }` no frontmatter do `index.astro` evita JS. Alternativa: Content Collections de projetos (over-engineering para 3–5 itens).

**Blog em destaque consumindo collection `blog`** — Se existirem posts, renderiza os 3 mais recentes; senão, array estático de fallback no frontmatter. Isso desacopla ordem de implementação (funciona antes do change `mini-blog`).

**Ícones Lucide line** — Pacote `lucide-astro` ou inline SVG custom (`stroke="currentColor"`). Decisão: componentes inline `ArrowIcon`/`ArrowUpIcon` SVG próprios (zero dep extra; prompt §4.3 só exige estilo line).

**Estrutura de componentes**: `Header.astro`, `Footer.astro`, `Eyebrow.astro`, `SectionHeading.astro`, `ProjectLink.astro`, `PostCard.astro` em `src/components/` — nomes conforme prompt §11.

## Risks / Trade-offs

- [Texto placeholder ser confundido com conteúdo final] → Posts de exemplo com aviso sutil? Não — manter placeholder coerente, sem aviso (prompt §12.3).
- [LCP prejudicado por fonte display] → Fontes self-host com `display: swap` + preload da fonte crítica (prompt §8); imagem hero priorizada.
- [Links externos placeholder (github.com/...)] → Usar `https://github.com/andersonlimacrv` etc. — nomes reais disponíveis.
