## Purpose

Léxico normativo de linhas do site: toda linha/divisor/hover usa traço 1px, cores dos tokens existentes, tracking mono espaçado e movimento dentro de `motion-transitions`, garantindo formatos uniformes e consistência entre componentes. Inclui o redesign do marcador de seção com linha reta conectando número ao título.

## ADDED Requirements

### Requirement: Léxico de linhas
Toda linha, divisor, borda decorativa e traço de marcador SHALL usar espessura de 1px e cores exclusivamente dos tokens existentes: `--border` (estrutura passiva), `--muted-foreground` (elementos acessórios) e `--primary` (destaque único).

#### Scenario: Espessura uniforme
- **WHEN** se inspeciona qualquer linha ou divisor do site
- **THEN** a espessura é de 1px (border ou stroke), sem espessuras alternativas

#### Scenario: Cores dentro dos tokens
- **WHEN** uma linha/divisor usa cor
- **THEN** a cor é uma das do léxico (`--border`, `--muted-foreground`, `--primary`), nunca um valor arbitrário novo

### Requirement: Tipografia associada às linhas
Rótulos acompanhando linhas (números de seção, eyebrows, labels) SHALL usar JetBrains Mono uppercase com tracking entre 0.16em e 0.3em.

#### Scenario: Rótulo de seção
- **WHEN** um marcador de seção exibe número/label
- **THEN** usa mono uppercase com tracking no intervalo 0.16–0.3em, mantendo o tamanho atual

### Requirement: Formato uniforme entre seções
Os cabeçalhos de seção SHALL usar a mesma marcação e estrutura visual (número + linha reta conectora + título), diferenciando-se apenas por número, título e eyebrow, nas 4 seções da landing.

#### Scenario: Seções idênticas em estrutura
- **WHEN** as seções sobre/projetos/blog/contato são renderizadas
- **THEN** todas seguem o mesmo layout de marcador `número ──── título`, com número mono `text-primary` e `h2` na escala atual

#### Scenario: Conector de 1px
- **WHEN** o marcador de seção é exibido
- **THEN** uma linha reta horizontal de 1px (`--border`) conecta o número ao título, flexível na largura restante

### Requirement: Movimento dentro do léxico
Qualquer transição de linha em hover SHALL seguir `motion-transitions`: apenas `transform`/`opacity`/`color`/`border-color`, ~180ms via `transition-micro`, respeitando `prefers-reduced-motion`.

#### Scenario: Hover de linha/elemento
- **WHEN** um elemento com linha recebe hover
- **THEN** apenas `transform`/`opacity`/`color`/`border-color` mudam (~180ms via `transition-micro`), com cores dentro dos tokens

#### Scenario: Reduced motion
- **WHEN** o usuário tem `prefers-reduced-motion: reduce`
- **THEN** hovers trocam de estado instantaneamente, sem animação

### Requirement: Sem JS novo
O marcador de seção redesenhado SHALL ser CSS puro, sem novos scripts ou listeners.

#### Scenario: Marcador sem JavaScript
- **WHEN** o cabeçalho de seção é renderizado
- **THEN** a linha conectora e o layout funcionam apenas com CSS (flex/grid), sem JS