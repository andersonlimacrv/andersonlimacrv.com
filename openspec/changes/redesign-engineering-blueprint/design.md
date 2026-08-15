## Context

A tentativa de blueprint (grid CSS + SVGs técnicos + anotações em fonte manuscrita) foi implementada e descartada por resultado visual ruim. A nova abordagem: **iterar uma parte por vez**, mantendo a estrutura nova de pastas, usando **itens desenhados à mão** (em `src/components/handwrite/`) para as camadas futuras e reconstruindo a camada blueprint de forma incremental. A **primeira atribuição** é o wireframe do morph da imagem hero (retângulo → círculo), estático e com medidas reais.

## Goals / Non-Goals

**Goals:**
- Imagem inicial ancorada à direita com **10% a menos** (`min(648px, 67.5%)`); container do hero sem ultrapassar as demais seções.
- Frame de enquadramento no estado inicial apenas nos **4 cantos** (cantoneiras 2px, contraste ≥3:1).
- **Camada de fundo atrás da foto**: quadriculado **na escala da figura (célula fixa ~20px)** em toda a área do frame + **legenda centralizada** no meio da imagem, reveladas quando o morph leva a foto para `#sobre-content`.
- **Padrão único de hachuras** (`hatches.css`) reutilizável para círculo, retângulo e futuras aplicações.
- **Legenda com identidade visual do projeto** (mono/uppercase/tracking, bordas `var(--radius)`, sem sombra), nome real da figura (`AndersonLimaCRV`), glifos proporcionais à imagem e dados agrupados (INICIAL / FINAL / POSIÇÃO).
- **Raio atual anotado** sobre a imagem (`r 80px`) ao lado do círculo-fantasma.
- Círculo final em `#sobre-content` com a mesma clamp do morph, retrato mais transparente (opacidade 0.2) e **base de trás com cruzes nos pontos cardeais (mira)**.
- Nenhuma animação, nenhum conteúdo novo.

**Non-Goals:**
- Anotações manuscritas do `handwrite/` (próximas partes).
- Animações de scroll; reveals; conteúdo novo; alteração da fotografia.

## Decisions

### D1. Reversão via HEAD (etapa anterior)
`global.css`, `SectionHeading.astro` e `Footer.astro` restaurados de `HEAD`. Mantido.

### D2. Pasta `handwrite` em `src/components/`
`src/components/handwrite/` para assets importáveis. `components/blueprint/` passa a conter os wireframes reais.
- **Alternativa:** `public/handwrite/` — rejeitada (assets importados permitem otimização do Astro).

### D3. Imagem 10% menor e ancorada à direita
Wrapper do hero: `md:w-[min(720px,75%)]` → `md:w-[min(648px,67.5%)]` (10% menor após feedback "ficou muito grande"); `md:justify-between` mantém a imagem à extrema direita. `--text-hero` permanece `clamp(2.75rem, 7vw, 6.25rem)`. `ScrollMorphPortrait` é `relative z-10 w-full` (o wrapper controla o tamanho) com `sizes` atualizado para `min(648px, 67.5%)`.

### D4. Frame apenas nos 4 cantos (cantoneiras)
No estado inicial, mantêm-se 4 cantoneiras (SVG `preserveAspectRatio="none"`) no exato box do `img` (`top:0; height: var(--bp-h)`), traço 2px (`vector-effect: non-scaling-stroke`). Overlay `z-index: 20` (acima da foto, `z-10`).
- **Contraste:** `--bp-line` = foreground 48% → 3.59:1 (light) e 3.7:1 (dark), ambos ≥3:1 (WCAG 1.4.11). `--bp-line-strong` = 60% para o ghost circle.

### D5. Camada de fundo atrás da foto (quadriculado + legenda)
Novo `BlueprintMorphBoard.astro` (`z-index: 5`, abaixo da foto `z-10`): quadriculado preenchendo o box (`height: var(--bp-h)`) com **célula fixa de ~20px** (mesma escala da figura — o número de quadrados acompanha o tamanho em qualquer viewport) e cor bem transparente (foreground 8%), e a **legenda centralizada** no meio da imagem (fundo sólido). A foto cobre a camada no primeiro carregamento; o morph a revela.
- **Decisão do usuário:** "no meio da imagem", "na camada embaixo da imagem" (revelada no scroll), "a legenda não precisa aparecer sempre"; densidade "na mesma escala da figura, 20+" → célula fixa ~20px.

### D5a. Padrão único de hachuras (`hatches.css`)
Novo `src/styles/hatches.css` (global, importado no `BaseLayout`) define e documenta a estrutura das hachuras: `.hatch-diagonal` (45°/−45°, círculo) e `.hatch-square` (quadrada, retângulo) com variáveis `--hatch-color`, `--hatch-thickness` (1px), `--hatch-gap` (8px) e `--hatch-cell` (20px). Define o token **`--bp-hatch`** (`:root`) = foreground 8% — **cor/transparência única de todas as hachuras do projeto** (a da hero inicial, considerada perfeita pelo usuário). Componentes usam `--hatch-color: var(--bp-hatch)` para garantir o padrão. Futuras hachuras seguem o mesmo padrão.

### D6. Legenda com identidade do projeto e dados agrupados
Sem `box-shadow`; `border: 1px solid var(--border)` + `border-radius: var(--radius)` (variável do projeto, como Eyebrow/chips — bordas "conforme o padrão de todo o projeto"); cabeçalho com chip do nome (`AndersonLimaCRV`, estilo Eyebrow) + régua `border` + tag `MORPH — EVOLUÇÃO` (estilo SectionHeading). **Corpo em 2 colunas** (`.bp-legend-body`): o **diagrama na mesma orientação do morph** à esquerda — retângulo em pé (32×40 ≈ 1122×1402, largura < altura) → **seta vertical tracejada ↓** (com o rótulo `s=` à direita) → **círculo Ø40 embaixo** — e os **dados ao lado, um abaixo do outro** (`.bp-data` em coluna única) em 3 grupos rotulados **INICIAL** (W/H/d/A), **FINAL** (D/r/A=πr²/C) e **POSIÇÃO** (x·y/s), com `data-bp` preenchidos via JS. Em <768px o corpo vira 1 coluna (diagrama em cima centralizado, dados embaixo).

### D7. Raio atual anotado sobre a imagem
No estado inicial, ao lado do círculo-fantasma, rótulo `r 80px` com linha de cota (`--bp-final-size / 2`), posicionado à esquerda do ghost (que fica a 78%/78% do frame). O rótulo **não tem fundo sólido nem text-shadow** (decisão do usuário: "sem text-shadow, mesma cor") — usa `var(--foreground)` pura sobre a foto.

### D8. Círculo END com base de trás em mira
`BlueprintMorphEnd` posiciona o círculo com `min(max(final% - r, 0), 100% - 2r)` (espelha `transformFor`). Retrato com opacidade 0.2 (feedback: "20% mais transparente" → usuário definiu 0.2). A **base de trás** do mesmo box do círculo tem **cruzes completas (símbolo de "+") nos pontos cardeais**, centradas na borda do círculo: topo `M 42 0 H 58 M 50 -7 V 7` (espelhadas em baixo, esquerda e direita) — uma **mira**, não cantos de quadrado, eliminando as sobras abaixo do círculo (a borda curva do círculo sobe nos cantos do box, deixando as cruzes dos cantos visíveis por baixo). Cada cruz é um "+" completo (2 segmentos, sem meia-cruz tipo reta tangente); o SVG tem `overflow: visible` para exibir os braços que saem do viewBox. As cruzes são traçadas com foreground **48%** (mais transparentes que o `--bp-line-strong`, feedback "um pouco mais de transparência"). **Camadas (feedback: "apenas os 4 sinais de + ficam acima, hachura e crosshair não")**: o `.bp-end` não cria stacking context (`z-index: auto`); o círculo é `z-index: 2` (hachura, crosshair e borda ficam **abaixo** da imagem final — figura do morph é `z-10` no contexto raiz) e as cruzes `z-index: 30` (**acima** dela). O **anel** do círculo usa a cor padrão das hachuras (`--bp-hatch`, foreground 8%) — "mesma cor e opacidade das hachuras". Para o anel nunca "sobrar" abaixo da imagem, `#sobre-content` (alvo do morph + overlay) fica **fora do `transform` do Reveal**: em `About.astro`, o grid `#sobre-content` deixou de ser envolvido pelo `<Reveal>` (só o parágrafo e o aside revelam, via `<Reveal as="p">`/`as="aside"`), eliminando o desalinhamento de 14px durante a animação. Sem caixas de texto (a legenda vive no hero).

### D9. Medição real em `morph-measure.ts`
Script vanilla (~1 KB) que lê o box do `[data-scroll-morph] img` (neutralizando transform, igual ao `scroll-morph`), grava `--bp-w/--bp-h` nos roots `[data-bp-wireframe]` (start overlay e board) e preenche spans `[data-bp]`. Recalcula em `resize`/`load`/`fonts.ready`.

### D10. Camada decorativa e acessível
Wireframes com `aria-hidden="true"`, `pointer-events:none`, cores derivadas de `var(--foreground)` via `color-mix`. Nunca entram no fluxo de leitura.

### D11. Responsividade
`<768px`: tipografia reduzida, grupos empilhados (último grupo em linha cheia), leader oculto; sem overflow horizontal.

### D12. Spec nesta etapa
A atribuição adiciona comportamento observável → delta spec `blueprint-morph-wireframe` (sem `skip_specs`).

## Risks / Trade-offs

- [Legenda coberta pela foto no load] → Comportamento intencional (revelada no scroll); e2e valida `z-index` da camada < foto.
- [Quadriculado visível por baixo da foto translúcida?] → A foto é opaca; o grid só aparece ao morphar.
- [Círculo END sobrepõe texto do Sobre] → Mitigação: `pointer-events:none`, opacidade 0.2, base de trás decorativa, sem caixas de texto.
- [Overflow horizontal no mobile] → Mitigação: e2e verifica topo/fim em 390px; elementos dispensáveis ocultos <768px.
- [Contraste das cantoneiras] → Mitigação: medido 3.59:1 (light) / 3.7:1 (dark), ≥3:1.
- [Rótulo do raio ilegível sobre a foto] → Aceito: usuário preferiu sem fundo/text-shadow, cor `var(--foreground)` pura.
- [Regressão no morph existente] → Mitigação: suites existentes de `scroll-morph` seguem como gate.