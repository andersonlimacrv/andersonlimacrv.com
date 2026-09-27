# Proposal: spacing-polish

## Why

Validação visual (dark) mostrou texto colado nas bordas do hover nas fileiras do Sobre e botões do Contato com padding abaixo do padrão da página (`px-4`).

## What Changes

- Fileiras do perfil e da trajetória: `px-4` (overlay do EdgeReveal ganha 16px de respiro; tamanhos intactos).
- Botões copiar e pills de assunto: `px-3` → `px-4` (mínimo da página; `w-24` fixo e grid mantidos).
- E2E de padding computado + travamento do padrão.

## Capabilities

### New Capabilities

- `spacing-polish`: respiro mínimo horizontal em fileiras com hover e em todos os botões.

### Modified Capabilities

Nenhuma.

## Impact

- **Alterado**: `About.astro`, `TrajectoryClean.astro`, `Contact.astro` (classes), 2 specs e2e.
- **Performance**: zero. **Risco**: nenhum (só padding).

## Non-goals

- Não mudar tipografia, cores, raios, layout ou comportamento.
