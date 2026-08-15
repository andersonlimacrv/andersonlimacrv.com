## Why

Redesign do site em **camadas**, trabalhando **uma parte por vez**. A primeira tentativa (camada blueprint via SVG/CSS + anotações manuscritas com fonte Caveat) ficou visualmente ruim e foi descartada. Esta change consolida a fundação (estrutura de pastas, dados, pasta `handwrite/`) e entrega a **primeira atribuição da camada blueprint**: o wireframe do morph da imagem hero (retângulo → círculo), estático, com medidas reais via JS.

## What Changes

- **Reorganização de componentes** (mantida): `components/layout/` (Header, Footer), `components/sections/` (Hero, About, Projects, Blog, Contact), `components/ui/` (10 componentes + 5 scripts), `components/blueprint/` (wireframes do morph) e `components/pages/` (HomePage como composition root).
- **Dados**: `src/data/projects.ts` como fonte única dos 3 projetos (urls/tags/títulos), descrições vindas do dicionário i18n.
- **Pasta `src/components/handwrite/`**: criada para receber os itens desenhados à mão (SVGs/assets) que o usuário fornecerá nas próximas etapas.
- **Imagem inicial 10% menor e ancorada à direita**: wrapper do hero `md:w-[min(648px,67.5%)]` + `md:justify-between`; `ScrollMorphPortrait` `relative z-10 w-full` com `sizes` atualizado; `--text-hero` mantido maior.
- **Wireframe blueprint do morph** (novo):
  - `BlueprintMorphStart.astro` — cantoneiras 2px nos 4 cantos do box do `img` (contraste ≥3:1), ghost circle Ø160 + crosshair + leader e **raio anotado** (`r 80px`).
  - `BlueprintMorphBoard.astro` — **camada de fundo atrás da foto**: quadriculado **na escala da figura (célula fixa ~20px)** em toda a área do frame + **legenda centralizada** no meio da imagem, coberta pela foto e revelada no scroll. Legenda com **identidade visual do projeto** (mono/uppercase/tracking, bordas `var(--radius)`, sem sombra), **nome real da figura** (`AndersonLimaCRV`), glifos proporcionais ao retrato e dados **agrupados** (INICIAL / FINAL / POSIÇÃO) com valores medidos via JS.
  - `src/styles/hatches.css` (novo) — **padrão único de hachuras** reutilizável: `.hatch-diagonal` (45°/−45°, círculo) e `.hatch-square` (quadrada, retângulo) com variáveis de configuração, importado no `BaseLayout`.
  - `BlueprintMorphEnd.astro` — círculo final em `#sobre-content` com a **mesma clamp** do scroll-morph, retrato **mais transparente** (opacidade 0.2), **hachura `hatch-diagonal`** + crosshair e **base de trás com cruzes nos pontos cardeais (mira)** no mesmo box do círculo.
- **Medição real em `morph-measure.ts`** (load/resize/fonts → `--bp-w/--bp-h` nos roots `[data-bp-wireframe]` + spans `[data-bp]`).
- **Reversão da tentativa anterior**: removidos os 6 componentes `Blueprint*` antigos, `data/blueprint.ts`, `e2e/blueprint.spec.ts`, `@font-face`/pacote Caveat, estilos `.blueprint-*`/`.annotation`/`.bp-*`, tokens `--space-*`/`--content-max`/`--page-gutter`/`--font-hand` e a mudança do `.container-site`.

## Capabilities

### New Capabilities

- `blueprint-morph-wireframe` — wireframes START (hero: cantoneiras + camada de fundo com quadriculado/legenda + raio anotado) e END (`#sobre-content`: círculo final + base de trás com cruzes nos pontos cardeais) documentando o morph da imagem com medidas reais.

### Modified Capabilities

_(nenhuma)_

## Impact

- **Estrutura**: `src/components/{layout,sections,ui,blueprint,pages}` + `src/components/handwrite/` + `src/data/projects.ts`.
- **Novos arquivos**: `src/styles/hatches.css`; `src/components/blueprint/BlueprintMorphStart.astro`, `BlueprintMorphBoard.astro`, `BlueprintMorphEnd.astro`, `morph-measure.ts`; `e2e/blueprint-morph.spec.ts`; delta spec.
- **Removidos**: `src/components/blueprint/BlueprintMorphLegend.astro` (absorvido no board).
- **Alterados**: `Hero.astro` (wrapper 648px + board + wireframe start), `About.astro` (`relative` em `#sobre-content` + wireframe end), `ScrollMorphPortrait.astro` (`relative z-10 w-full`, `sizes` 648px), `global.css` (`--text-hero` maior).
- **Fora do escopo (Non-goals)**: anotações manuscritas do `handwrite/` (próximas partes); animações de scroll; conteúdo novo; fotografia intocada.
- **Verificação**: `astro check` 0 erros, build OK, e2e (suites + blueprint-morph, 52 testes), audit com payload mínimo (~400 KB gzip).