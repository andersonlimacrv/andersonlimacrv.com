# Delta Spec: typography-scale

## ADDED Requirements

### Requirement: Escala semântica fluida de micro-tipografia
O design system SHALL expor os tokens/utilitários `text-eyebrow` (clamp 0.625rem→0.75rem) e `text-micro` (clamp 0.5625rem→0.6875rem) e os utilitários `tracking-caps` (0.16em) e `tracking-caps-wide` (0.3em). Nenhum tamanho de fonte arbitrário em px (`text-[8px]`…`text-[12px]`, `text-[0.6875rem]`) SHALL permanecer nos rótulos/labels do site, exceto na allowlist documentada (SectionHeading 90/120px, blueprint `--bp-scale`, `Sep` 0.8em).

#### Scenario: Bounds do clamp nos breakpoints
- **WHEN** um elemento com `text-eyebrow` é medido em 390px e em 1280px
- **THEN** o `font-size` computado está dentro dos bounds do clamp (≥10px e ≤12px; micro: ≥9px e ≤11px)

#### Scenario: Sem px arbitrário em rótulos
- **WHEN** o código-fonte é varrido por `text-[Npx]` em rótulos
- **THEN** apenas a allowlist documentada permanece (SectionHeading, blueprint, Sep)

### Requirement: Componente Text como fonte de padronização
O componente `Text.astro` SHALL expor `as` + `size: eyebrow | micro | lead` e encapsular a composição (mono + uppercase + tracking + token de tamanho). `Subtitle.astro` e `Eyebrow.astro` SHALL consumir `Text` internamente mantendo suas APIs públicas. A meta do blog (`PostLayout`/`PostCard`) SHALL usar o padrão.

#### Scenario: Rótulos idênticos entre seções
- **WHEN** um rótulo eyebrow do About, um período da TrajectoryClean, o hint do contato e a data de um post do blog são medidos no mesmo breakpoint
- **THEN** todos têm o mesmo `font-size` computado (token eyebrow)

### Requirement: Paridade tipográfica entre idiomas
A troca de idioma SHALL NOT alterar a geometria tipográfica dos rótulos e títulos (font-size/tracking independem dos textos) — paridade pt/es/en verificada por e2e nos elementos representativos.

#### Scenario: Paridade pt/es/en
- **WHEN** as páginas home, blog e post são carregadas nos 3 idiomas em 1280px
- **THEN** os `font-size` computados dos elementos representativos (eyebrow de seção, meta de post, título h1) são idênticos entre idiomas