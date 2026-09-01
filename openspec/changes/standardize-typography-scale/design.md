# Design: standardize-typography-scale

## Context

Levantamento medido (grep em `src/`): 6 tamanhos de micro-texto (8/9/10/11/12px + `0.6875rem`), 6 trackings (0.15/0.16/0.18/0.2/0.3em + tight), só 13/65 tamanhos responsivos. Tokens existentes cobrem apenas títulos (hero/h1/h2/h3/lead).

## Goals / Non-Goals

**Goals**: escala semântica fluida para micro-texto; componente `Text` como fonte única de padronização; blog usando o padrão; paridade entre idiomas garantida por e2e.
**Non-Goals**: SectionHeading/Header/blueprint/Sep/hero (intencionais); h3/lead fluidos (follow-up); dropdown custom.

## Decisions

1. **Tokens no `@theme`** (Tailwind v4 gera utilitários automaticamente):
   - `--text-eyebrow: clamp(0.625rem, 0.55rem + 0.3vw, 0.75rem)` — 10px (390px) → 12px (1280px)
   - `--text-micro: clamp(0.5625rem, 0.5rem + 0.2vw, 0.6875rem)` — 9px → 11px
   - `--tracking-caps: 0.16em` — o padrão de facto (21 usos)
   - `--tracking-caps-wide: 0.3em` — eyebrows de destaque
2. **`Text.astro`** (base polimórfica): `as` + `size: eyebrow | micro | lead` + `class` (cor/layout ficam com o chamador). Composição por variante: eyebrow/micro = `font-mono uppercase tracking-caps + text-*`.
3. **Refactors que consomem Text** (APIs mantidas): `Subtitle` (size xs→micro, sm→eyebrow; tracking 0.18/0.2→caps), `Eyebrow` badge (text-xs + 0.18em → eyebrow), rótulos avulsos do About, período da TrajectoryClean, hint do contato, meta do blog (PostLayout/PostCard).
4. **Exclusões** (design intencional): SectionHeading (90/120px + 0.3em), Header/disclosure, blueprint `--bp-scale`, `Sep` 0.8em, hero -0.03em. Documentadas como allowlist no css-audit (regras não existem mais — os px arbitrários saem do código).
5. **Gate do usuário antes dos testes**: implementação → build/preview → validação visual (dark/light × mobile/desktop × home/blog/post) → só então e2e + métricas + commit. Ordem imposta pelo usuário.
6. **Fluidez**: micro-texto mobile sobe levemente (8→9px, 10px flui) — intencional (legibilidade); título/número do SectionHeading inalterado.

## Risks / Trade-offs

- [Visual mobile muda (micro-texto +1px)] → gate visual do usuário antes de qualquer teste/commit.
- [Substituição de `text-xs` pode atingir texto que não é rótulo] → mapeamento por arquivo na implementação; `text-xs` de corpo permanece escala padrão.
- [Paridade de altura entre idiomas (±3px)] → textos curtos e uppercase; tolerância cobre anti-aliasing.

## Migration Plan

Tokens → Text.astro → refactors → substituições → build → **gate visual** → e2e (bounds + paridade) → métricas → commit. Rollback: reverter os arquivos (tokens são aditivos).

## Open Questions

Nenhuma — exclusões e gate visual definidos pelo usuário.