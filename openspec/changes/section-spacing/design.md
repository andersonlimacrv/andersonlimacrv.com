# Design

## Context

Ver `proposal.md`. `SectionHeading.astro` centraliza as 5 sections (`py-16 sm:py-20`, slot em `mt-8`); hero com CTAs em `mt-8`; blog index usa `mb-10` (40px, referência).

## Goals / Non-Goals

**Goals:** um ponto de controle (SectionHeading) + hero; resto intacto.

**Non-Goals:** divisores, tipos, cores, conteúdo, blog, footer, lab.

## Decisions

1. **`py-20 sm:py-24` + `mt-12`** — +8 sobre os 40px validados em dev; desktop entre sections: 96 + 64 (divisor) + 96, gap 48 ≈ metade do padding.
2. **Primeira fileira do FlowingMenu sem `padding-top`** — medição óptica mostrou Projetos ~25px acima do pack; sem o padding converge.
3. **Subtítulo localizado em Projetos** (`sections.projects.subtitle`, `TYPE.body muted`, `pt-6` óptico + `mt-8` até o menu) — a caixa do menu não é texto: o subtítulo dá a linha de corpo que iguala o padrão óptico. O `pt-6` é padding de propósito (margin colapsaria com o `mt-12` do wrapper e sumiria); medido: sem ele Projetos ficava ~25px abaixo do pack (142–152px).
2. **Hero CTAs `mt-10`** — consistência título→ação; subtítulo `mt-6` preservado (ritmo interno do hero).

## Risks / Trade-offs

- [Risco] Página mais longa empurra dobra para baixo → Mitigação: +16px/seção (~80px na home); LCP (hero) inalterado.
- Trade-off: nenhum custo.

## Migration Plan

1. `SectionHeading` + `Hero` → validação visual.
2. E2E + suíte full. Rollback por classe.
