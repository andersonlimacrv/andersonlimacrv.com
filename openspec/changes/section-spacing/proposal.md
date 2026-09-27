# Proposal: section-spacing

## Why

Os espaçamentos verticais das sections variam sem sistema (`py-16/20`, `mt-8` vs `mb-10` do blog) e estão no limite justo para o ritmo editorial. Padronizar com folga acima da média atual dá respiro consistente entre sections e entre título e conteúdo.

## What Changes

- `SectionHeading.astro` (ponto único das 5 sections da home): `py-20 sm:py-24`, `mt-12` (48px, +8 sobre os 40px validados em dev).
- Hero: CTAs `mt-8` → `mt-10`.
- Novo e2e `section-spacing.spec.ts` (padding 80/96px, gap 40px).
- Blog index, footer, lab e divisores `h-16`: intactos.

## Capabilities

### New Capabilities

- `section-spacing`: ritmo vertical padronizado das sections (80px mobile / 96px desktop, 40px título→conteúdo).

### Modified Capabilities

Nenhuma.

## Impact

- **Alterado**: `SectionHeading.astro`, `Hero.astro`, 1 spec e2e.
- **Performance**: zero (só classes). **Risco**: specs de geometria (`reveal`, `scroll-morph`, screenshots) — cobertos na suíte full.

## Non-goals

- Não mudar divisores, tipografia, cores ou conteúdo.
- Não tocar em blog, footer ou lab.
