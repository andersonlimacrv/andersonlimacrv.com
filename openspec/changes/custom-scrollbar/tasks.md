## Fase A — Atualizar artifacts da change

- [x] A.1 `proposal.md`, `design.md`, `specs/custom-scrollbar/spec.md` escritos
- [x] A.2 `npx openspec validate custom-scrollbar --type change` sem erros

## Fase B — Implementar a scrollbar em `global.css`

- [x] B.1 Seção "Scrollbar" em `src/styles/global.css`: `html { scrollbar-width: thin; scrollbar-color: var(--muted-foreground) transparent }` + `::-webkit-scrollbar`/`-track`/`-thumb`/`-corner` (8px, `var(--muted-foreground)` → hover `var(--foreground)`, track transparente, sem raio, transição 0.18s)
- [x] B.2 Bloco `@media (prefers-reduced-motion: reduce)` desativando a transição do thumb
- [x] B.3 `npm run check` sem erros

## Fase C — e2e

- [x] C.1 `e2e/scrollbar.spec.ts`: largura 8px, cor do thumb = `--muted-foreground` em tema claro, hover muda para `--foreground`, tema escuro troca paleta, `prefers-reduced-motion: reduce` desativa transição
- [x] C.2 Revisão visual desktop/mobile (claro/escuro) com o usuário

## Fase D — Verificação final

- [x] D.1 Build limpo + `node scripts/audit.mjs` + atualizar `docs/perf-seo-checklist.md`
- [x] D.2 `npx openspec validate` + suíte e2e completa + `npm run check`
- [x] D.3 Commit sob pedido do usuário
