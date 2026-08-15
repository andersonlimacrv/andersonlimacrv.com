## Context

A tentativa de blueprint (grid CSS + SVGs técnicos + anotações em fonte manuscrita) foi implementada e descartada por resultado visual ruim. O usuário definiu a nova abordagem: **iterar uma parte por vez**, mantendo a estrutura nova de pastas, e usar **itens desenhados à mão** (que ele fornecerá em `src/handwrite/`) no lugar de desenhos gerados por código.

## Goals / Non-Goals

**Goals:**
- Deixar o repo em estado limpo: estrutura nova de pastas preservada, camada blueprint totalmente removida.
- Criar `src/handwrite/` como ponto de entrada dos assets manuscritos.
- Manter conteúdo, layout, performance e testes iguais ao estado anterior ao redesign.

**Non-Goals:**
- Qualquer nova camada visual ou anotação nesta change.
- Animações.
- Definição de como `handwrite/` será consumido (decisão junto com os assets, na próxima parte).

## Decisions

### D1. Reversão via HEAD
`global.css`, `SectionHeading.astro` e `Footer.astro` foram restaurados de `HEAD` (as únicas mudanças eram do blueprint). Seções mantêm o conteúdo original, apenas sem overlays.
- **Alternativa:** reverter manualmente — rejeitada (risco de perder detalhes).

### D2. Pasta `handwrite` em `src/components/`
`src/components/handwrite/` para assets importáveis via `astro:assets`/`import`. Reservada por `.gitkeep`; `components/blueprint/` também permanece reservada.
- **Alternativa:** `public/handwrite/` — rejeitada por enquanto (assets importados permitem otimização do Astro).

### D3. Sem spec nesta change
Reorganização e extração de dados são refatoração sem mudança observável → `skip_specs: true`.

## Risks / Trade-offs

- [Estrutura pode voltar a divergir] → Mitigação: pastas reservadas com `.gitkeep`; próximas partes consomem `handwrite/`.
- [Regressão silenciosa após reversão] → Mitigação: `astro check`, build, e2e 36/36 e audit como gate.