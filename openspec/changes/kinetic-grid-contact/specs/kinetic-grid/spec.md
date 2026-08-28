# Delta Spec: kinetic-grid

## ADDED Requirements

### Requirement: Canvas interativo contido no container
O componente KineticGrid SHALL renderizar um `<canvas>` absolutamente posicionado dentro do próprio wrapper (`position: relative; overflow: hidden`), dimensionado pelo `ResizeObserver` com `devicePixelRatio`, SEM ocupar a viewport (`nada de fixed inset-0`). O fundo do canvas SHALL ser transparente — o fundo visível é o do site. O conteúdo passado no slot SHALL renderizar acima do canvas (`relative z-10`).

#### Scenario: Canvas dimensionado pelo container
- **WHEN** o box do contato renderiza em viewport 1280px
- **THEN** o canvas tem `width`/`height` de bitmap iguais ao tamanho CSS do container multiplicado por `devicePixelRatio` e não causa overflow horizontal

#### Scenario: Fundo transparente
- **WHEN** o tema claro ou escuro está ativo
- **THEN** nenhum retângulo de fundo é pintado no canvas (o fundo do site aparece através)

### Requirement: Física fiel do efeito
O módulo SHALL reproduzir a física do original: warp dos pontos do grid em direção ao ponteiro com bell falloff (`INFLUENCE_RADIUS` 260, `MAX_WARP` 24, easing `(1-t)²` com clamp `dist/60`), edge pin quadrático (`edgeMargin` 1.5) travando as bordas, ripples no click (raio `400px/s`, opacidade `1 - 1.2·age`, largura de onda 55, deslocamento máx 18·opacidade), lerp do mouse (0.08), smoothstep na cor/raio dos nós (`NODE_BASE_RADIUS` 1.8 → `NODE_ACTIVE_RADIUS` 3.2) e glow radial nos nós com `t > 0.3`. O grid de linhas usa `CELL_SIZE` 55 e a textura de fundo `DOT_SPACING` 28.

#### Scenario: Warp em direção ao cursor
- **WHEN** o ponteiro se move sobre o box
- **THEN** os pontos do grid dentro do raio de influência se deslocam em direção ao cursor (lerp suave) e as bordas do grid permanecem fixas (edge pin)

#### Scenario: Ripple no click
- **WHEN** o usuário clica dentro do box
- **THEN** uma onda circular se expande do ponto do click deslocando os pontos do grid, e o contador de debug `data-ripple-count` no wrapper é incrementado

### Requirement: Cores theme-aware dos tokens do site
As cores SHALL ser lidas dos tokens do site via `getComputedStyle` do wrapper: linha/textura base = `foreground` com alpha reduzido (0.13 linhas, 0.05 textura, 0.2 nós); estado ativo (perto do cursor/ondas) = `--primary`. Na troca de tema (`MutationObserver` na classe do `<html>`) as cores SHALL ser revalidadas no próximo frame, sem recarregar a página.

#### Scenario: Troca de tema revalida cores
- **WHEN** o usuário alterna claro/escuro com o box visível
- **THEN** os próximos frames usam as cores do novo tema sem erro de cor residual (valores lidos novamente via `getComputedStyle`)

### Requirement: Ciclo de vida com View Transitions e performance
O módulo SHALL inicializar via `astro:page-load`/`astro:after-swap` e limpar destrutivamente (listeners, rAF, observers, estado) em `astro:before-swap`, seguindo o padrão `elastic-line.ts`. O loop `requestAnimationFrame` SHALL pausar quando o box estiver fora da viewport (`IntersectionObserver`) e retomar ao voltar. Nenhuma dependência npm SHALL ser adicionada.

#### Scenario: Sobrevive a navegação com ClientRouter
- **WHEN** o usuário navega Home → `/#contato` → Home repetidamente
- **THEN** não há duplicação de listeners (um único ripple por click) nem rAF órfão após sair da página

#### Scenario: Pausa fora da viewport
- **WHEN** o box sai completamente da viewport
- **THEN** o loop de animação para (nenhum frame desenhado) e retoma ao reentrar

### Requirement: Acessibilidade e reduced-motion
O canvas SHALL ser decorativo (`aria-hidden="true"`, `pointer-events` tratados no wrapper sem capturar foco). Com `prefers-reduced-motion: reduce` o módulo SHALL desenhar um único frame estático do grid (sem warp, sem ripples, sem loop). O hint do box SHALL ter contraste AA e o box não SHALL conter conteúdo interativo que dependa do efeito.

#### Scenario: Reduced-motion estático
- **WHEN** o usuário navega com `prefers-reduced-motion: reduce`
- **THEN** o canvas desenha um frame único do grid e o wrapper recebe `data-static="true"`, sem listeners de movimento

### Requirement: Integração na seção de contato
O `Contact.astro` SHALL substituir o placeholder por um box emoldurado (`border-border`, cantoneiras `CrossMark`, altura ~15rem) contendo o KineticGrid e um hint mono uppercase localizado (pt/es/en) instruindo "mova o cursor · clique". O box SHALL manter a hierarquia visual da seção (entre parágrafo e email) e o `id="contato"`/`SectionHeading` numerado inalterados.

#### Scenario: Box no lugar do placeholder
- **WHEN** a home renderiza em qualquer locale
- **THEN** `#contato` contém um box `[data-kinetic-grid]` com canvas e o hint localizado do locale ativo, sem o texto "teste o background aqui"
