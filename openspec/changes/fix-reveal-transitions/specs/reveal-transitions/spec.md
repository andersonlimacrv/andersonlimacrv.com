# Delta Spec: reveal-transitions

## ADDED Requirements

### Requirement: Reveal re-arma após navegação com View Transitions
O sistema de reveal SHALL reaplicar o estado inicial (`reveal-present` no `<html>`) e observar os elementos `[data-reveal]` da página corrente em toda carga e em toda navegação ClientRouter (`astro:page-load`/`astro:after-swap`), com dedupe (cada elemento observado uma única vez). Sem JS, o conteúdo SHALL permanecer visível (progressive enhancement).

#### Scenario: Primeira carga da home
- **WHEN** a home carrega com JS
- **THEN** `reveal-present` está no `<html>`, os `[data-reveal]` abaixo da dobra estão `opacity: 0` e, ao rolar até cada um, ficam `opacity: 1` com `is-visible`

#### Scenario: Navegação home → /blog → home (ClientRouter)
- **WHEN** o usuário navega para `/blog` e volta
- **THEN** `reveal-present` é reaplicado (o swap do Astro limpa os atributos do `<html>`), os elementos novos são observados e nenhuma seção permanece `opacity: 0` após o scroll completo

#### Scenario: reduced-motion
- **WHEN** o usuário navega com `prefers-reduced-motion: reduce`
- **THEN** todos os `[data-reveal]` recebem `is-visible` imediatamente, sem IntersectionObserver

### Requirement: Cascata determinística CSS (Tailwind v4)
Todas as regras customizadas do site SHALL viver em camadas (`@layer base` para elementos/`html`, `@layer components` para classes do site) — nunca unlayered — garantindo que utilitários Tailwind (`@layer utilities`) sempre vençam em conflito.

#### Scenario: Utilitário vence regra custom
- **WHEN** um elemento tem regra customizada (ex.: `[data-reveal].is-visible` → `opacity: 1`) e utilitário `opacity-0`
- **THEN** o valor computado é `opacity: 0` (utilities vence components)

### Requirement: Auditoria automatizada de CSS customizado
O fluxo de auditoria (`scripts/audit.mjs`) SHALL rodar `scripts/css-audit.mjs` a cada execução e gerar `docs/css-audit.md` classificando cada classe/utilitária/token dos styles como usada, utilitária, hook (allowlist com motivo) ou morta. Classes mortas ou tokens sem uso SHALL ser zero no estado final.

#### Scenario: Relatório de auditoria
- **WHEN** `node scripts/audit.mjs` roda
- **THEN** `docs/css-audit.md` lista todas as regras customizadas com status e o resumo não acusa mortas/tokens sem uso

## REMOVED Requirements

### Requirement: classe `theme-applied` no `<html>`
**Reason**: classe adicionada por script sem nenhuma regra CSS correspondente (morta).
**Migration**: remover as adições em `BaseLayout.astro` e no antigo script do `Reveal`; o estado de tema continua em `.dark` no `<html>`.