# Proposal: about-edge-reveal

## Why

O EdgeReveal ("Rover"), validado na `/lab`, é a assinatura de hover ideal para as linhas interativas do Sobre: links sociais e fileiras da trajetória ganham o sweep direcional mantendo 100% da informação estática, sem JS novo e sem quebrar os specs existentes (TargetHover e contagens de corners intactos).

## What Changes

- Novo `src/styles/edge-reveal.css` (base global: `[data-edge-reveal]`, `[data-reveal-layer]`, `.edge-ink` com troca de cor por token, sem blend) importado no `BaseLayout`.
- `edge-reveal.ts` movido para `src/lib/` (padrão `target-hover.ts`) com guarda anti-toggle para `<a>` (toque em link navega de verdade).
- Sociais do Sobre: EdgeReveal **revertido** após validação visual (voltaram ao original com TargetHover); o modificador `.cursor-target-inset` foi removido junto por ficar órfão.
- Fileiras da trajetória: `data-edge-reveal` decorativo (só pointer, sem `tabindex`), `.edge-ink` nos textos + layer. **Mantido — aprovado visualmente.**
- Novo e2e `about-edge.spec.ts` (hover, teclado, reduced-motion, toque-navega, 3 locales).

## Capabilities

### New Capabilities

- `about-edge-reveal`: hover direcional nas fileiras da trajetória do Sobre, com regras de decorativo vs link, temas e reduced-motion.

### Modified Capabilities

Nenhuma (aditivo; nenhum seletor ou comportamento existente removido — sociais restaurados byte a byte).

## Impact

- **Novo**: `src/styles/edge-reveal.css`, `e2e/about-edge.spec.ts`, specs da change.
- **Alterado**: `src/lib/edge-reveal.ts` (move + guarda `<a>`), `EdgeReveal.astro` (novo path), `BaseLayout.astro` (css + import), `target-hover.css` (modificador `.cursor-target-inset`), `About.astro`, `TrajectoryClean.astro`.
- **Performance**: zero JS novo (módulo já carregado); CSS global +~1 KB; rAF/WAAPI só no hover; pausa e `destroy` herdados do motor.
- **Referência**: `openspec/changes/lab-flowing-edge-reveal/` (motor e assinatura).

## Non-goals

- Não mudar a assinatura da lab (ela mantém o `difference` como demo).
- Não remover `cursor-target` dos sociais (specs `sobreCorners`/`about-section` intactos).
- Não tornar fileiras focáveis (sem ação, sem `tabindex` — a11y correto).
- Não aplicar em Projetos/Blog/Contato nesta change.
