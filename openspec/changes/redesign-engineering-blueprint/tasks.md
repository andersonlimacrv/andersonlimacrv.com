## 1. Fundação (concluída)

- [x] 1.1 Criar `src/data/projects.ts` (3 projetos tipados, fonte única) — mantido
- [x] 1.2 Reorganizar componentes: `layout/`, `sections/`, `ui/`, `blueprint/`, `pages/` — mantido
- [x] 1.3 Extrair seções da HomePage para `components/sections/` preservando conteúdo/ordem/links — mantido
- [x] 1.4 Criar `src/components/handwrite/` (reservada) para itens desenhados à mão — mantido

## 2. Reversão da tentativa anterior (concluída)

- [x] 2.1 Remover os 6 componentes `Blueprint*` antigos e `src/data/blueprint.ts`
- [x] 2.2 Remover `e2e/blueprint.spec.ts`
- [x] 2.3 Reverter `global.css` a HEAD (sem estilos `.blueprint-*`/`.annotation`/`.bp-*`, sem tokens extras, `.container-site` original)
- [x] 2.4 Desinstalar `@fontsource-variable/caveat`

## 3. Wireframe blueprint do morph (revisado nesta atribuição)

- [x] 3.1 Imagem inicial 10% menor e ancorada à direita: wrapper `md:w-[min(648px,67.5%)]` + `md:justify-between`; `ScrollMorphPortrait` `relative z-10 w-full` com `sizes` atualizado
- [x] 3.2 `BlueprintMorphStart.astro`: cantoneiras 2px nos 4 cantos do box do `img` (contraste ≥3:1), ghost circle Ø160 centralizado (`left:50%; bottom:0.5rem`) + crosshair, **4 traços de cota cardeais** (superior/inferior verticais, direita horizontal), **raio anotado** (`r 80px` no quadrante inferior esquerdo do círculo) e **leader removido**
- [x] 3.3 `BlueprintMorphBoard.astro` (novo): camada de fundo atrás da foto (`z-index < figure`) — quadriculado **na escala da figura (célula fixa ~20px)** em toda a área do frame + **legenda centralizada** com fundo sólido, figura identificada (IMG01), dados agrupados (INICIAL/FINAL/POSIÇÃO) e bordas `var(--radius)`, sem sombra
- [x] 3.3a `src/styles/hatches.css` (novo): padrão único de hachuras `.hatch-diagonal` (círculo) e `.hatch-square` (retângulo) com variáveis `--hatch-color/--hatch-thickness/--hatch-gap/--hatch-cell`, documentado e reutilizável
- [x] 3.4 `BlueprintMorphLegend.astro` removido (conteúdo absorvido no board)
- [x] 3.5 `morph-measure.ts`: mede box do `[data-scroll-morph] img`, grava `--bp-w/--bp-h` nos roots `[data-bp-wireframe]` e preenche spans `[data-bp]`; recalcula em load/resize/fonts
- [x] 3.6 `BlueprintMorphEnd.astro`: círculo final com a mesma clamp do morph — retrato com opacidade 0.2, **hachura `hatch-diagonal`** (do `hatches.css`), crosshair e **base de trás com cruzes nos pontos cardeais (mira)** no mesmo box
- [x] 3.7 Camada decorativa: `aria-hidden`, `pointer-events:none`, cores derivadas, sem sombra na legenda; rótulo do raio **sem fundo** (contorno via `text-shadow`)
- [x] 3.8 Responsividade: <768px tipografia reduzida, grupos empilhados; sem overflow
- [x] 3.9 Delta spec `blueprint-morph-wireframe` (sem `skip_specs`) — atualizado para a revisão

## 4. Validação (concluída)

- [x] 4.1 `npm run check` → 0 erros
- [x] 4.2 `npm run test:e2e` → 58 testes (8 novos para board/raio/cantoneiras-cruz/opacidade + círculo-fantasma/traços cardeais/rótulo no quadrante + rótulos nos 4 quadrantes com valores ao vivo e alinhamento simétrico)
- [x] 4.3 `node scripts/audit.mjs` → payload mínimo (gzip ~400 KB)

## 5. Próximas partes (postergadas)

- [ ] 5.1 Anotações manuscritas a partir de `src/components/handwrite/`
- [ ] 5.2 Wireframes das demais seções (Projetos, Blog, Contato)
- [ ] 5.3 Animações de scroll / reveals progressivos