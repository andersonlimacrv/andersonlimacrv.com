## Purpose

Garantir estabilidade visual ao trocar o idioma do site (View Transitions + select nativo): sem animações de entrada que re-executem, sem mudança de medidas do header entre idiomas e com verificação automatizada (Playwright) cobrindo as páginas em pt/es/en.

## ADDED Requirements

### Requirement: Hero sem animação de entrada

O hero da landing (eyebrow, nome, subtítulo e retrato) SHALL ser exibido estaticamente, sem animação de entrada (`hero-entrance`/`hero-in`), em qualquer carregamento ou navegação, inclusive troca de idioma via View Transitions.

#### Scenario: Troca de idioma não re-anima o hero

- **WHEN** o usuário troca o idioma pelo select do header
- **THEN** o hero aparece sem animação (visível no primeiro paint, `animation-name: none` nos elementos)

#### Scenario: Carga inicial estática

- **WHEN** o usuário carrega a landing em qualquer idioma
- **THEN** nome, subtítulo, eyebrow e imagem do hero estão visíveis sem fade/slide de entrada

### Requirement: Header com largura constante entre idiomas

A largura da pílula `.site-toolbar` e de cada link de navegação SHALL ser igual nas 3 línguas (tolerância de 2px), incluindo antes e depois de uma troca de idioma, para não haver salto de layout.

#### Scenario: Larguras idênticas por língua

- **WHEN** o usuário navega entre pt/es/en (por URL ou pelo select)
- **THEN** a largura da pílula e dos links de nav permanece a mesma (diferença ≤ 2px)

### Requirement: Legenda do retrato idêntica nas línguas

A `figCaption` do retrato SHALL ter o mesmo conteúdo em pt/es/en, sem variação de largura.

#### Scenario: Legenda igual em todas as línguas

- **WHEN** o usuário visualiza o retrato na landing em pt, es ou en
- **THEN** a legenda exibe o mesmo texto (mesma largura) nas 3 línguas

### Requirement: Conteúdo do blog estável em todas as línguas

A landing SHALL exibir os últimos 3 posts e `/blog` SHALL listar os posts em pt/es/en, com a mesma estrutura (cards em grid, alturas iguais por linha). A troca de idioma não SHALL alterar a medida do cabeçalho da página.

#### Scenario: Blog em todos os idiomas

- **WHEN** o usuário acessa a landing ou `/blog` em pt, es ou en
- **THEN** os cards de post renderizam (3 na landing; lista completa em `/blog`) sem variação estrutural entre línguas

### Requirement: Verificação automatizada (Playwright)

O repositório SHALL conter testes e2e (Playwright, dependência de dev) verificando: largura constante do header entre idiomas, hero sem animação (inclusive após troca via select), e conteúdo do blog nas 3 línguas.

#### Scenario: Suite e2e passa

- **WHEN** `npm run test:e2e` é executado contra um servidor dev
- **THEN** todos os testes passam (larguras, ausência de animação, conteúdo) e screenshots são gerados por idioma