# Proposal: standardize-typography-scale

## Why

A tipografia do site está fragmentada: 6 tamanhos de micro-texto diferentes (8/9/10/11/12px + 11px em rem) para o mesmo papel (rótulos mono), 6 valores de tracking (0.15/0.16/0.18/0.2/0.3em) e apenas 13 de ~65 ocorrências de tamanho têm variante responsiva — a maioria é fixa e não flui entre breakpoints. A escala de tokens existente (hero/h1/h2/h3/lead) cobre só os títulos.

## What Changes

- **Tokens novos** (`@theme`): `--text-eyebrow` (clamp 10→12px), `--text-micro` (clamp 9→11px), `--tracking-caps` (0.16em), `--tracking-caps-wide` (0.3em) — utilitários `text-eyebrow`, `text-micro`, `tracking-caps`, `tracking-caps-wide`.
- **Componente de UI `Text.astro`**: variantes `size="eyebrow" | "micro" | "lead"` encapsulando cada caso (mono caps + token). Fonte única de padronização.
- **Refactors que consomem `Text`**: `Subtitle.astro` e `Eyebrow.astro` (APIs mantidas — nenhum call-site muda), rótulos do `About`, período da `TrajectoryClean`, hint do contato, **meta do blog** (`PostLayout`: data/tempo de leitura; `PostCard`: data).
- **Exclusões intencionais**: `SectionHeading` (número 90/120px proposital), Header (disclosure de idiomas), blueprint (`--bp-scale`), `Sep` (0.8em relativo ao pai), hero `[-0.03em]`.
- Ordem com gate do usuário: implementação → **validação visual** → testes e2e → métricas → commit.

## Capabilities

### New Capabilities

- `typography-scale`: escala tipográfica semântica (tokens fluidos + componente Text) com paridade entre idiomas e bounds de clamp verificados por e2e.

### Modified Capabilities

Nenhuma (post-content já usa tokens; hero/h1/h2 inalterados).

## Impact

- **Código**: `global.css` (tokens), `ui/Text.astro` (novo), `ui/Subtitle.astro`, `ui/Eyebrow.astro`, `sections/About.astro`, `sections/TrajectoryClean.astro`, `sections/Contact.astro`, `layouts/PostLayout.astro`, `ui/PostCard.astro`.
- **Testes**: e2e novo (bounds de clamp nos breakpoints 390/1280 + paridade pt/es/en) — **após o gate visual do usuário**.
- **Métricas**: CSS ±0.5 KB (tokens substituem utilitários); visual mobile muda levemente (micro-texto 8→9px — intencional, legibilidade).

## Non-goals

- Não tocar em `SectionHeading`, Header/disclosure de idiomas, blueprint (`--bp-scale`), `Sep` (0.8em), hero `[-0.03em]`.
- Não fluidizar `h3`/`lead` do post-content (v1; follow-up se necessário).
- Não criar dropdown/select custom (escopo é tipografia).