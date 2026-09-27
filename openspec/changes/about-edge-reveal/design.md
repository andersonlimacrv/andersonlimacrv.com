# Design

## Context

Ver `proposal.md`. Motor em `src/components/lab/edge-reveal.ts` (WAAPI `translate`, 600 ms expo, `data-edge-reveal` + `[data-reveal-layer]`, dedupe `WeakSet`, ciclo View Transitions). Alvos: sociais em `About.astro` (`<a>` com `cursor-target`, `TYPE.label`) e fileiras em `TrajectoryClean.astro` (`<li>` com `TYPE.body`/`TYPE.label`, `Sep`, `hover:border-foreground/50`).

## Goals / Non-Goals

**Goals:** padrão global reutilizável sem duplicar o motor; links navegáveis no toque; zero churn nos specs existentes.

**Non-Goals:** nova assinatura visual (é a da lab); foco em fileiras não-acionáveis.

## Decisions

1. **`src/styles/edge-reveal.css` global + `src/lib/edge-reveal.ts`** — espelha `target-hover.css` + `lib/target-hover.ts` (importados no `BaseLayout`); lab mantém seu CSS demo e só atualiza o path do import. Sem blend na base global: `.edge-ink` NÃO define `color` (arquivo unlayered venceria os `text-*` layered e apagaria o muted no repouso — bug real encontrado em validação); a cor vem do markup e só o `.is-open` força `primary-foreground`. Alternativa (reusar `difference` da lab) rejeitada: apagaria role/company/period no tema claro.
2. **Guarda `<a>` no click-toggle** — `if (el instanceof HTMLAnchorElement) return` antes do `preventDefault`; mantida como defesa mesmo sem âncoras em produção no momento.
3. **Sociais revertidos; sem `.cursor-target-inset`** — após validação visual, os sociais voltaram ao original (só TargetHover) e o modificador de cantos inset foi deletado por ficar órfão. Alternativa (manter duplo affordance) rejeitada pelo usuário.
4. **Fileiras sem `tabindex`** — hover pointer-only decorativo; `focus`/`blur` do motor simplesmente nunca disparam. Camada `aria-hidden`, sem `role`.
5. **Overlay `--primary`** — mesma assinatura da lab; `border-radius: inherit` (alvos quadrados, raio 0). Sem novos tokens (css-audit limpo) e sem utilitários de fonte no CSS (typography-audit limpo).

## Risks / Trade-offs

- [Risco] Regressão visual nos sociais ao reverter → Mitigação: markup restaurado byte a byte + specs `about-section`/`target-hover-persistence` verdes provam o estado original.
- Trade-off: CSS global +~1 KB em todas as páginas (necessário — o padrão agora é produtivo, não só da lab).

## Migration Plan

1. CSS + move do módulo + guarda `<a>` + wiring `BaseLayout` (lab revalidada pelo spec antigo).
2. Sociais + `cursor-target-inset` + trajetória.
3. E2E novo + suíte full + audits. Rollback por arquivo; `About`/`TrajectoryClean` voltam removendo 3 atributos.
