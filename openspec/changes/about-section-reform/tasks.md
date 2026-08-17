## Fase A — Atualizar artifacts da change

- [x] A.1 `proposal.md`, `design.md` (diagrama + decisões), `specs/about-section/spec.md` (duas colunas fixas: perfil + trajetória, info ao lado da foto, timeline com anos fixos e resumo de 1 linha) reescritos
- [x] A.2 `tasks.md` atualizado para as fases A–D
- [x] A.3 `npx openspec validate about-section-reform --type change` sem erros

## Fase B — Implementar as duas colunas fixas em `About.astro`

- [x] B.1 `#sobre-content` → grid `grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] divide-x divide-border border-t border-border` (nunca empilha; `min-w-0` nas colunas)
- [x] B.2 Coluna 01 Perfil: label "Perfil"/01; `#sobre-portrait` (`aspect-square`, `BlueprintMorphEnd finalX=0/finalY=0`) + `dl` Nome/Role/Stack principal/Localização ao lado (nunca abaixo); frase, "Sobre mim", social/contato (`+55 53 98100-4874`)
- [x] B.3 Coluna 02 Trajetória: label + `yearRange` (2007—2027); timeline vertical contínua com ano como ponto fixo, marcador, cargo, empresa, período e `summary` de 1 linha; marcação temporal + `AC / ABOUT / 01`
- [x] B.4 Dados: `hero.mainStack` + `TimelineEntry.summary` em `profile.ts`; rótulos novos em `ui.ts` (pt/es/en); telefone formatado
- [x] B.5 Morph alinhado ao retrato: `Hero.astro` target `#sobre-portrait` + `finalX=0/finalY=0`; `--morph-final-size` responsivo no `:root`; `scroll-morph.ts`/`morph-measure.ts`/`BlueprintMorphEnd`/`Board`/`Start` leem a var; `--bp-scale` para rótulos do ghost
- [x] B.6 `npm run check` sem erros

## Fase C — e2e

- [x] C.1 Reescrever `e2e/about-section.spec.ts`: duas colunas fixas (grid, nunca empilha), info ao lado do retrato, conteúdo das colunas, timeline (7 itens, ano/período/summary), header `2007—2027`, /en/ localizado, sem overflow
- [x] C.2 Atualizar `blueprint-morph.spec.ts`/`scroll-morph.spec.ts`: alvo `#sobre-portrait`, `finalX=0`/`finalY=0`, tamanho final responsivo (160/64), escala dos rótulos; rodar suíte completa
- [x] C.3 Revisão visual desktop/mobile (claro/escuro) com o usuário — usuário pediu remoção da barra de duração (feito)
- [ ] C.4 Revisão visual final após remoção da barra de duração

## Fase D — Verificação final

- [ ] D.1 Build limpo + `node scripts/audit.mjs` + atualizar `docs/perf-seo-checklist.md` (76 testes, métricas atuais)
- [ ] D.2 `npx openspec validate` + suíte e2e completa + `npm run check`
- [ ] D.3 Commit sob pedido do usuário
