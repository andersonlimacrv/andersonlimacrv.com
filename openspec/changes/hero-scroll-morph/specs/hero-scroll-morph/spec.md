## Purpose

Animação de scroll da imagem hero: o retrato começa retangular no hero e, conforme o scroll, morph via `clip-path: polygon()` para um círculo menor posicionado na seção Sobre, movido apenas por `transform` (scale/translate), em JS vanilla performance-first e respeitando `prefers-reduced-motion`.

## ADDED Requirements

### Requirement: Morph de forma por scroll
A imagem hero SHALL morph de retângulo (cantos retos, topo) para círculo conforme o progresso do scroll, usando `clip-path: polygon()` com o mesmo número de vértices (16) interpolados linearmente entre as duas formas.

#### Scenario: Topo da página
- **WHEN** o usuário está no topo (progresso 0)
- **THEN** a imagem aparece retangular com cantos retos, idêntica ao layout atual do hero

#### Scenario: Progresso intermediário
- **WHEN** o usuário rola entre o hero e a seção Sobre
- **THEN** os vértices do polígono interpolaram proporcionalmente e a imagem encolhe/arredonda suavemente

#### Scenario: Seção Sobre alcançada
- **WHEN** o progresso chega a 1
- **THEN** a imagem é um círculo pequeno na posição de destino da seção Sobre

### Requirement: Animar apenas clip-path e transform
A animação SHALL tocar exclusivamente `clip-path` e `transform` (scale/translate); propriedades de layout (`width`, `height`, `top`, `left`, `margin`, `padding`) SHALL nunca ser animadas.

#### Scenario: Sem reflow durante o scroll
- **WHEN** a animação roda
- **THEN** nenhuma propriedade de layout é modificada; apenas compositor (`clip-path`/`transform`)

### Requirement: Performance vanilla
O controller SHALL ser JavaScript vanilla (sem frameworks/bibliotecas de animação), sincronizado com `requestAnimationFrame`, com listener de `scroll` `passive: true` e recálculo dos vértices no evento `resize`, sem layout thrashing.

#### Scenario: Listener passive
- **WHEN** o controller escuta scroll
- **THEN** o listener é registrado com `passive: true` e o trabalho de escrita é deduplicado por `requestAnimationFrame`

#### Scenario: Resize recalculado
- **WHEN** a janela é redimensionada
- **THEN** os vértices do polígono são recalculados a partir das novas dimensões

### Requirement: Elemento otimizado para compositor
O elemento animado SHALL ter `will-change: clip-path, transform` e `contain: paint`.

#### Scenario: Hint de compositor
- **WHEN** se inspeciona o elemento animado
- **THEN** `will-change` cobre `clip-path` e `transform`, e `contain: paint` está presente

### Requirement: prefers-reduced-motion
Se `prefers-reduced-motion: reduce` estiver ativo, a animação SHALL ser pulada e o estado final (círculo na seção Sobre) exibido imediatamente.

#### Scenario: Reduced motion
- **WHEN** o usuário tem `prefers-reduced-motion: reduce`
- **THEN** a imagem aparece já no estado final, sem animação de scroll

### Requirement: Imagem otimizada
A imagem SHALL usar formato moderno (WebP/AVIF) com `srcset`, `sizes` e `decoding="async"`.

#### Scenario: Imagem moderna
- **WHEN** o HTML da imagem é gerado
- **THEN** usa `srcset`/`sizes`/`decoding="async"` com formato WebP ou AVIF (via `getImage` do projeto)

### Requirement: Sem dependências novas
O morph SHALL não adicionar bibliotecas ou frameworks.

#### Scenario: Stack intacta
- **WHEN** se inspecionam as dependências
- **THEN** nenhuma biblioteca de animação é adicionada; apenas módulo vanilla + componente Astro