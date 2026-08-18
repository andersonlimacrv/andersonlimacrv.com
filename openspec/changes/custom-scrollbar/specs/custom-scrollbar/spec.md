## Purpose

Scrollbar global fina (8px) com cores derivadas dos tokens `--muted-foreground`/`--foreground` do projeto, cobrindo Firefox/IE/Edge legacy (padrão W3C `scrollbar-width`/`scrollbar-color`) e Chromium/Safari (`::-webkit-scrollbar*`). Funciona em tema claro e escuro automaticamente via tokens, hover suave com transição 0.18s ease-out (desativada sob `prefers-reduced-motion: reduce`). Zero JS, zero dependências.

## ADDED Requirements

### Requirement: Scrollbar global fina no `html`
O elemento `html` SHALL ter uma scrollbar personalizada de largura **8px** (vertical e horizontal). O track SHALL ser transparente. O thumb SHALL ter `background: var(--muted-foreground)` em repouso e `background: var(--foreground)` em hover/active. O thumb SHALL ter `border-radius: 0` (sem arredondamento) e `transition: background-color 0.18s ease-out`.

#### Scenario: Largura 8px em Chromium/Safari
- **WHEN** a página carrega em um navegador Chromium/Safari (desktop)
- **THEN** `::-webkit-scrollbar` tem `width: 8px` e `height: 8px`

#### Scenario: Thumb na cor muted-foreground em repouso
- **WHEN** a página carrega (tema claro)
- **THEN** o thumb da scrollbar tem `background-color` igual ao valor computado de `var(--muted-foreground)` no `:root`

#### Scenario: Thumb muda para foreground no hover
- **WHEN** o ponteiro está sobre o thumb da scrollbar (Chromium/Safari)
- **THEN** o `background-color` do thumb transiciona para o valor computado de `var(--foreground)` no `:root`

#### Scenario: Track transparente
- **WHEN** a página carrega
- **THEN** o track da scrollbar é transparente (não pinta uma cor diferente do fundo da página)

### Requirement: Cobertura Firefox via padrão W3C
No Firefox/IE/Edge legacy, o `html` SHALL ter `scrollbar-width: thin` e `scrollbar-color: var(--muted-foreground) transparent` (duas cores: thumb e track). O hover não é aplicável nesse motor (padrão W3C é estático).

#### Scenario: Propriedades W3C presentes
- **WHEN** a página é renderizada no Firefox
- **THEN** o `html` tem `scrollbar-width: thin` e `scrollbar-color` com valor `<--muted-foreground> transparent`

### Requirement: Tema claro/escuro automático via tokens
As cores do thumb SHALL derivar de `--muted-foreground` e `--foreground`, que já existem em `:root` (claro) e `.dark` (escuro). A scrollbar SHALL trocar de paleta automaticamente quando o tema ativo muda, **sem JS adicional**.

#### Scenario: Scrollbar em tema escuro
- **WHEN** a página carrega com `<html class="dark">`
- **THEN** o thumb da scrollbar tem `background-color` igual ao valor computado de `var(--muted-foreground)` em `.dark` (different do valor em `:root` claro)

#### Scenario: Troca de tema atualiza o thumb
- **WHEN** o usuário alterna o tema (claro → escuro ou vice-versa)
- **THEN** o `background-color` do thumb é atualizado para refletir os tokens do novo tema ativo

### Requirement: Respeita `prefers-reduced-motion: reduce`
Sob `prefers-reduced-motion: reduce`, a transição de hover do thumb SHALL ser desativada (o `transition` deve ser `none` ou ausente). O thumb ainda muda de cor no hover, mas de forma instantânea.

#### Scenario: Transição desativada com reduced-motion
- **WHEN** a página carrega com `prefers-reduced-motion: reduce` ativo
- **THEN** o `::-webkit-scrollbar-thumb` tem `transition` igual a `none` (ou 0s) e o hover ainda aplica `background-color: var(--foreground)`

### Requirement: Sem JS, sem dependências, sem aumento de bundle
A implementação SHALL ser puramente CSS em `src/styles/global.css`. Nenhum arquivo JS, dependência npm, ou arquivo auxiliar SHALL ser criado para esta capacibilidade. O impacto de bundle SHALL limitar-se ao acréscimo de CSS (~0.3 KB raw).

#### Scenario: Nenhum JS novo
- **WHEN** a change é implementada
- **THEN** nenhum arquivo `.ts`/`.js` em `src/` é criado ou modificado para a scrollbar; e a contagem de fontes/JS no `node scripts/audit.mjs` é idêntica à baseline
