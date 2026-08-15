## Purpose

Divisor interativo entre seções da landing: uma linha elástica em TS vanilla que reage ao ponteiro com extremidades fixas, responsiva, leve e sem dependências.

## ADDED Requirements

### Requirement: Divisor elástico interativo full-width
A landing SHALL exibir um divisor elástico entre as seções que deforma quando o ponteiro o puxa, ocupando a largura total da seção e retornando ao estado reto com física de spring quando liberado.

#### Scenario: Deformação ao puxar
- **WHEN** o usuário pressiona o botão do ponteiro sobre o divisor e arrasta
- **THEN** a linha se deforma na região do ponteiro, permanecendo ancorada nas extremidades
- **AND** ao soltar, a linha retorna ao estado reto suavemente (spring)

#### Scenario: Puxar além do limite
- **WHEN** o ponteiro é arrastado para longe da linha
- **THEN** a deformação é limitada (resistência ~2.2x) e as extremidades continuam fixas

### Requirement: Extremidades fixas
As extremidades do divisor SHALL permanecer fixas nos pontos médios (`midX`/`midY`) durante toda a interação, de modo que apenas o interior da linha se deforme.

#### Scenario: Pontas não seguem o ponteiro
- **WHEN** o ponteiro arrasta a linha em qualquer direção
- **THEN** as pontas da linha não se deslocam da âncora central da extremidade

### Requirement: Responsivo
O divisor SHALL redimensionar corretamente quando a viewport muda, sincronizando largura, altura e `viewBox` e recentrando o controle, sem deformação residual.

#### Scenario: Resize da viewport
- **WHEN** a janela é redimensionada (ex.: 1280 → 390 → 768)
- **THEN** o divisor ocupa a nova largura e a linha retorna ao estado reto com geometria correta

#### Scenario: Interação após resize
- **WHEN** o usuário interage com o divisor depois de um resize
- **THEN** a deformação parte da nova posição central e funciona normalmente

### Requirement: Leve e sem dependências
O divisor SHALL ser implementado em TypeScript vanilla, sem React, bibliotecas de animação ou islands, com um único script inline por página deduplicado entre as instâncias.

#### Scenario: Sem dependências novas
- **WHEN** se inspecionam as dependências do projeto
- **THEN** nenhuma biblioteca de animação/React é adicionada por este divisor

#### Scenario: JS mínimo
- **WHEN** se mede o JS entregue na landing
- **THEN** o total é ~16 KB, com o script do divisor deduplicado em uma única instância inline (~2.3 KB)

### Requirement: Touch preserva scroll
Em dispositivos com `pointer: coarse` (mão primária via toque), o divisor SHALL permanecer inerte para não travar a rolagem.

#### Scenario: Mão primária coarse
- **WHEN** `matchMedia('(pointer: coarse)')` confirma ponteiro coarse
- **THEN** o divisor não captura ponteiros e a rolagem não é interrompida

### Requirement: Remoção trivial
A remoção dos divisores SHALL ser possível apagando apenas as instâncias de uso no layout, sem alterar controller, spec ou CSS.

#### Scenario: Sem divisores na landing
- **WHEN** as linhas `<ElasticLine>` são removidas da HomePage
- **THEN** a landing segue íntegra, sem JS órfão ou erros