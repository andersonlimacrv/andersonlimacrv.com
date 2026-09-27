# Design

## Context

Ver `proposal.md`. Fileiras sem `px` (overlay `inset: 0` cola no texto); copiar/pills em `px-3` contra `px-4` dos demais controles.

## Goals / Non-Goals

**Goals:** `px-4` em fileiras e botões; nada além de classes.

**Non-Goals:** resto do layout, tipos, cores e comportamentos.

## Decisions

1. **`px-4` nas 7 fileiras do perfil e nas `li` da trajetória** — respiro overlay↔texto; truncate/`truncate` e divisórias intactos.
2. **Copiar e pills para `px-4`** — `w-24` e grid absorvem; `nowrap` e estados intactos.

## Risks / Trade-offs

- [Risco] Fileiras/trajetória 32px mais estreitas no conteúdo → Mitigação: e2e de overflow existente + truncate já tratado.
- Trade-off: nenhum custo.

## Migration Plan

1. Classes → validação visual.
2. E2E + audits + suíte full.
