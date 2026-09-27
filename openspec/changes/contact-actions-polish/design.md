# Design

## Context

Ver `proposal.md`. Canais em `Contact.astro` (grid `auto/minmax(0,1fr)/auto`, link `inline-flex` que estica na track); copiar (`button[data-copy]`, texto via JS); assuntos (`flex flex-wrap`, labels auto).

## Goals / Non-Goals

**Goals:** só classes Tailwind existentes; sem JS/CSS novo.

**Non-Goals:** conteúdo, estilo de estados, lógica de copy/submit.

## Decisions

1. **`justify-self-start max-w-full` nos links** — grid-item deixa de esticar; `minmax(0,1fr)` + `break-words` continuam contendo e-mails longos no mobile. Alternativa (wrapper inline) rejeitada: nó extra por linha sem ganho.
2. **`w-24 text-center` no copiar** — 96px cobre "COPIADO" e todos os idiomas com folga; `data-copy`/`data-copied-label` intactos. Alternativa (`min-w`) rejeitada: não garante igualdade entre estados.
3. **Flex-grow nos assuntos** (container `flex flex-wrap`, labels `grow`, spans `w-full justify-center text-center` + `whitespace-nowrap` + `px-4`) — cada item parte do tamanho do conteúdo e cresce até preencher a fileira (larguras desiguais por desenho); `min-width: auto` impede esmagar o texto. Grid fixo e `flex: 1 1 0%` foram descartados (transbordo e desigualdade forçada, medidos em e2e). `cursor-target`/`peer-checked` intactos.

## Risks / Trade-offs

- [Risco] `justify-self-start` + texto longo no mobile estreito → Mitigação: `max-w-full` + `break-words` (e2e cobre 390px).
- Trade-off: nenhum custo; rollback por classe.

## Migration Plan

1. `Contact.astro` (3 blocos de classes) → validação visual do usuário em `dev`.
2. Só então: check, build, audits e suíte full.
