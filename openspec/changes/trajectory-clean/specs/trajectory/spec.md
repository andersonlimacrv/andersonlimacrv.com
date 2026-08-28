# Capability: trajectory

## Purpose

Coluna Trajetória clean lista única com badges, sem linha vertical, sem summary, sem dot, sem yearRange.

## ADDED Requirements

### Requirement: Lista clean única com badges

A coluna 02 SHALL renderizar duas `<ul>` (`Trabalho` 4 + `Formação` 3) vindas de `src/data/timeline.ts:41` via `getTimeline(locale)` e `isEducationRole` filtro, cada `ul` com `aria-label` do badge. Cada row SHALL ser `<li class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4 border-b border-border py-3.5 last:border-b-0">` com `min-w-0 flex-1 truncate` à esquerda (`Role / Company` com `Role` `font-medium text-foreground` primeiro) e `trajectory-period` `font-mono text-[10px] sm:text-xs uppercase tracking-[0.16em] whitespace-nowrap` à direita. Sem `summary`, sem dot, sem `yearRange`, sem `w-px` linha.

#### Scenario: 7 rows em duas listas com headings localizados

- **WHEN** a página carrega em `pt`
- **THEN** a coluna 02 contém 2 seções `aria-labelledby="trajectory-work-title"` e `trajectory-edu-title` com `Subtitle` `Trabalho` e `Formação`, com `ul[aria-label="Trabalho"]` 4 `<li>` e `ul[aria-label="Formação"]` 3 `<li>` cada com `Role / Company` (`Role` primeiro) e `period` curto.
- **WHEN** em `en`
- **THEN** headings são `Work` / `Education` (4/3); em `es` `Trabajo` / `Formación`.

#### Scenario: Period à direita mono curto

- **WHEN** a página carrega
- **THEN** cada row exibe `period` curto `formatPeriodShort` (ex. `2022 — presente`, `2026 — 2027`, `2012 — 2014`) com `trajectory-period font-mono text-[10px] sm:text-xs uppercase tracking-[0.16em] text-muted-foreground whitespace-nowrap` à direita do badge, `title` com period completo para a11y.

#### Scenario: Sem summary, dot e yearRange

- **WHEN** a página carrega
- **THEN** nenhum row contém `summary`, nenhum `span` dot `rounded-full`, e nenhum `yearRange` `2007—2027` dentro do wrapper.

### Requirement: Sem linha vertical ou CrossMark

A coluna 02 SHALL NOT conter `w-px bg-border` linha vertical nem `CrossMark` `t-top`/`t-bottom`.

#### Scenario: Ausência de elementos antigos

- **WHEN** a página carrega
- **THEN** não existe `span.w-px.bg-border` nem `.cross-mark` dentro de `section[data-col="trajetoria"]`.

### Requirement: Responsividade e a11y

A lista SHALL usar `gap-4 sm:gap-6`, `text-[12px] sm:text-[13px]` e `truncate` para evitar overflow horizontal em `390px`. A `<ul>` SHALL ter `aria-label={t.aboutTimelineLabel}`.

#### Scenario: Mobile sem overflow

- **WHEN** viewport 390px
- **THEN** `document.documentElement.scrollWidth <= clientWidth`.
