## Purpose

Wireframe blueprint estático que documenta o morph da imagem hero: no início, cantoneiras no exato box da imagem no hero (estado START) + círculo-fantasma Ø160px do destino; uma **camada de fundo atrás da foto** com quadriculado e legenda centralizada da evolução do processo (valores reais medidos via JS); e o círculo final preenchido em `#sobre-content` com uma base de trás (estado END).

## ADDED Requirements

### Requirement: Imagem inicial ancorada à direita (10% menor)
A imagem do hero SHALL ter largura `min(648px, 67.5%)` (10% menor que a versão anterior) e estar ancorada à extrema direita do container, sem que o container do hero ultrapasse a largura das demais seções.

#### Scenario: Container do hero não ultrapassa as demais seções
- **WHEN** a página carrega no desktop
- **THEN** a largura máxima do container do hero é igual à das demais seções (sem overflow horizontal)

### Requirement: Frame de enquadramento apenas nos 4 cantos
O estado inicial SHALL exibir **cantoneiras** (marcadores de canto) no exato box do `img`, com traço de 2px e contraste ≥3:1 sobre o fundo (WCAG 1.4.11).

#### Scenario: Cantoneiras no box da imagem
- **WHEN** a página carrega
- **THEN** existem 4 cantoneiras cujo box coincide com o `img` do morph (altura = `--bp-h` medida)

#### Scenario: Contraste adequado
- **WHEN** as cantoneiras são renderizadas no light e no dark
- **THEN** a razão de contraste entre o traço e o fundo é ≥3:1

### Requirement: Camada de fundo atrás da foto (revelada no scroll)
Uma camada de baixo (atrás da foto) SHALL conter um **quadriculado de célula fixa ~20px** preenchendo toda a área delimitada pelas cantoneiras — bem mais transparente, aspecto de área hachurada — e a **legenda centralizada** no meio da imagem, com fundo sólido. A camada fica coberta pela foto no primeiro carregamento e é revelada quando o morph leva a imagem para `#sobre-content`.

#### Scenario: Camada abaixo da foto
- **WHEN** a página carrega
- **THEN** o `z-index` da camada de fundo é menor que o da foto (legenda e quadriculado cobertos pela imagem)

#### Scenario: Quadriculado na escala da figura
- **WHEN** a página carrega
- **THEN** o quadriculado cobre a altura medida do box da imagem (`--bp-h`) com célula fixa de ~20px (o número de quadrados acompanha o tamanho da figura)

#### Scenario: Legenda centralizada
- **WHEN** a página carrega
- **THEN** o centro da legenda coincide (com tolerância) com o centro do box da imagem

### Requirement: Padrão único de hachuras
As hachuras do blueprint SHALL ser definidas em um único arquivo (`src/styles/hatches.css`) com classes utilitárias reutilizáveis, variáveis de configuração (`--hatch-color`, `--hatch-thickness`, `--hatch-gap`, `--hatch-cell`) e uma **cor/transparência única** para todas (`--bp-hatch` = foreground 8%), usadas tanto no círculo (diagonal 45°/−45°) quanto no retângulo (quadrada).

#### Scenario: Hachuras compartilhadas
- **WHEN** os wireframes são renderizados
- **THEN** círculo e retângulo usam as mesmas classes de `hatches.css` (configurando apenas as variáveis)

#### Scenario: Cor e transparência únicas
- **WHEN** qualquer hachura (quadriculado do hero ou do círculo final) é renderizada
- **THEN** todas usam a mesma cor e transparência (`--bp-hatch` = foreground 8%)

### Requirement: Legenda de evolução com identidade do projeto
A legenda SHALL documentar a **evolução** do morph (retângulo → círculo) usando a identidade visual do site (mono, uppercase, tracking, bordas `border`), sem sombra, com o **nome real da figura**, e o corpo em 2 colunas: o **diagrama na mesma orientação do morph** (retângulo em pé → seta vertical ↓ → círculo embaixo) e os **dados ao lado, um abaixo do outro** (INICIAL / FINAL / POSIÇÃO) com valores medidos via JS.

#### Scenario: Nome real e diagrama gráfico
- **WHEN** a página carrega
- **THEN** a legenda exibe o nome real da figura (`AndersonLimaCRV`) + `MORPH — EVOLUÇÃO`, o diagrama na **orientação vertical** (retângulo em pé, seta ↓, círculo embaixo) com os **dados ao lado**, e os valores `W`, `H`, `d`, `A`, `D`, `r`, `A=πr²`, `C`, `x·y`

#### Scenario: Sem sombra
- **WHEN** a legenda é renderizada
- **THEN** não possui `box-shadow`

#### Scenario: Bordas conforme o padrão do projeto
- **WHEN** a legenda é renderizada
- **THEN** o raio das bordas do painel e do chip usa a variável do projeto (`--radius`)

### Requirement: Raio atual anotado sobre a imagem
O raio do círculo final (`r` = metade de `finalSize`) SHALL ser anotado sobre a imagem no estado inicial, ao lado do círculo-fantasma, com linha de cota e rótulo em `font-mono`.

#### Scenario: Rótulo do raio
- **WHEN** a página carrega
- **THEN** existe um rótulo `r 80px` próximo ao círculo-fantasma, **sem fundo sólido e sem text-shadow** (cor `var(--foreground)` pura sobre a foto)

### Requirement: Círculo final com base de trás
O círculo final SHALL ser desenhado em `#sobre-content` com a mesma clamp do morph (`finalX=0.15`, `finalY=0.5`, raio 80px), com o retrato **mais transparente** (opacidade 0.2), hachura (na cor/transparência padrão das hachuras), crosshair e **anel na mesma cor/opacidade das hachuras**, e **cruzes nos pontos cardeais (mira)** — acima, abaixo e dos lados (sem cantos de quadrado, evitando sobras abaixo do círculo) — desenhadas **uma camada acima da imagem**. O anel SHALL ficar sempre alinhado e coberto pela imagem final: para isso, `#sobre-content` (alvo do morph + overlay) não fica dentro do `transform` do Reveal.

#### Scenario: Mesma clamp do morph
- **WHEN** a página carrega
- **THEN** a posição do círculo final (left/top) obedece a `min(max(final% - r, 0), 100% - 2r)` idêntica ao `transformFor` do scroll-morph

#### Scenario: Base de trás com cruzes nos pontos cardeais (mira)
- **WHEN** o círculo final é renderizado
- **THEN** existem 4 **cruzes completas (símbolo de "+")** posicionadas nos pontos cardeais (acima, abaixo, esquerda e direita), como uma mira — não nos cantos de um quadrado
- **AND** as cruzes são traçadas com foreground 48% (mais transparentes que `--bp-line-strong`)
- **AND** **somente** as cruzes ficam acima da imagem final (z-index do board > z-10 da figura do morph), enquanto a hachura, o crosshair e a borda do círculo ficam abaixo dela (z-index do círculo < z-10 da figura)

#### Scenario: Retrato mais transparente
- **WHEN** o círculo final é renderizado
- **THEN** a opacidade da imagem do retrato é 0.2

#### Scenario: Anel na cor das hachuras e sempre coberto pela imagem
- **WHEN** o círculo final é renderizado
- **THEN** a cor/opacidade do anel é a mesma das hachuras (`--bp-hatch`, foreground 8%)
- **AND** o alvo do morph (`#sobre-content`) não está dentro de um `[data-reveal]` com transform — o anel não desalinha (sem "borda sobrando" abaixo da imagem)

### Requirement: Camada decorativa independente
Os wireframes SHALL ser decorativos: `aria-hidden="true"`, `pointer-events: none`, sem interferir na interação nem no layout.

#### Scenario: Sem impacto de interação/layout
- **WHEN** um usuário interage com a página
- **THEN** os wireframes não capturam eventos e não alteram o box dos elementos de conteúdo

### Requirement: Responsividade
Em telas menores (`<768px`) os wireframes SHALL reduzir tipografia, empilhar grupos e ocultar elementos dispensáveis (leader) para evitar overflow horizontal.

#### Scenario: Sem overflow no mobile
- **WHEN** a viewport é de 390px de largura
- **THEN** a página não possui overflow horizontal no topo nem no fim

### Requirement: prefers-reduced-motion
Os wireframes SHALL permanecer visíveis (estáticos) mesmo com `prefers-reduced-motion: reduce`, sem animações.

#### Scenario: Reduced motion
- **WHEN** o usuário tem `prefers-reduced-motion: reduce`
- **THEN** os wireframes continuam visíveis e sem animação