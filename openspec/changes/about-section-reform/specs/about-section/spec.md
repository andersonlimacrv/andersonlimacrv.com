## Purpose

Seção Sobre da home em **coluna única** (Perfil acima, Trajetória abaixo, sempre empilhadas). O **retrato P&B com marcações blueprint** e as **informações ao lado da foto (nunca abaixo)** permanecem: Role, stack principal e localização em `dl` ao lado do retrato (`basis-[20%] md:basis-[30%] h-40`). Abaixo, **Trajetória clean** com 7 rows (`Trabalho` 4 + `Formação` 3) em duas listas `Role / Company` com `period` curto e `Subtitle` headings, sem linha vertical, sem `summary`, sem `yearRange`. Estética Engineering Blueprint mantida nos divisores finos e tipografia, com `max-w-6xl` e `Subtitle` reutilizável, imagem do hero com morph para `#sobre-portrait` e hover `TargetHover` nos links sociais.

## ADDED Requirements

### Requirement: Layout em coluna única (sempre empilhado, Trajetória abaixo do Perfil)
`#sobre-content` SHALL ser um container `relative flex flex-col divide-y divide-border border-t border-border` (sem `lg:flex-row`). Cada seção SHALL ser `<section data-col="perfil"|"trajetoria">` com `min-w-0 basis-full` (sem `lg:basis`). A ordem SHALL ser sempre Perfil acima, Trajetória abaixo, em qualquer viewport. O conteúdo não SHALL causar overflow horizontal.

#### Scenario: Coluna única em desktop e mobile
- **WHEN** a página carrega em desktop (1280px) ou mobile (390px)
- **THEN** `#sobre-content > div` é `display: flex` com `flex-direction: column`, contém 2 `<section>` na ordem `['perfil','trajetoria']` e `scrollWidth <= clientWidth`

### Requirement: Colunas etiquetadas semânticamente
As duas colunas SHALL ser `<section data-col="perfil">` e `<section data-col="trajetoria">` (não anônimas), para evitar landmarks ambíguos.

#### Scenario: Colunas marcadas com data-col
- **WHEN** a página carrega
- **THEN** `#sobre-content` contém `<section data-col="perfil">` e `<section data-col="trajetoria">`

### Requirement: Retrato à esquerda com informações ao lado (nunca abaixo)
Na coluna 01 (Perfil), o box do retrato (`#sobre-portrait`, `aspect-square`, `shrink-0 basis-[20%] md:basis-[30%] h-40 ml-14 md:ml-6 mt-6`, contém o `BlueprintMorphEnd`) SHALL ficar ao lado de um bloco de informações (`dl`, `flex-1`) com **3 itens**: **Role** (`hero.title` quebrado em 3 `span class="block"` — "Engenheiro de Software", "Enterpreneur", "Arquiteto de Soluções"), **Stack principal** (`hero.mainStack`) e **Localização** (`hero.location`). O bloco SHALL estar **à direita da foto**, **nunca abaixo**.

#### Scenario: Informações à direita da foto
- **WHEN** a página carrega no desktop e no mobile
- **THEN** o bloco `dl` tem topo dentro da área vertical da foto e sua borda direita fica à direita da borda direita da foto (lado a lado, não abaixo)

#### Scenario: Três itens de informação
- **WHEN** a página carrega
- **THEN** o `dl` renderiza 3 itens: Role (3 spans), Stack principal (Python · TypeScript · C/C++ · ESP32 · React) e Localização (Pelotas, Rio Grande do Sul, Brasil)

### Requirement: Frase, bio e redes sociais na coluna 01
Abaixo de foto+informações, a coluna 01 SHALL exibir, em ordem e separadas por `border-t`: a **frase** (`<blockquote>` serif itálico em caixa `border border-dashed` com cantoneiras blueprint, **sem `<cite>`** — o autor é implícito), a seção **"Sobre mim"** (rótulo localizado + `aboutBio` em parágrafos) e **"Redes sociais"** no fim da coluna (`<nav>` com 5 links — GitHub, LinkedIn, Instagram, WhatsApp, Email — cada `<a class="cursor-target border-b border-border py-2.5 hover:border-foreground hover:text-foreground">`). **Sem telefone e sem localização** nesse bloco (são redundantes com a `dl`).

#### Scenario: Frase sem citação
- **WHEN** a página carrega
- **THEN** existe um `<blockquote>` com o texto `aboutQuote` do locale ativo e nenhum `<cite>` abaixo do bloco foto+informações

#### Scenario: Cinco links sociais, sem telefone
- **WHEN** a página carrega
- **THEN** na coluna 01 existem 5 links sociais (GitHub, LinkedIn, Instagram, WhatsApp, Email) com a classe `cursor-target` e **nenhum** texto `+55 53 98100-4874`

### Requirement: Trajetória clean com duas listas e Subtitle

A coluna 02 SHALL ter header com rótulo "Trajetória" e número `02` e, abaixo, duas listas `Trabalho` (4) e `Formação` (3) via `TrajectoryClean.astro` a partir de `src/data/timeline.ts:41` com `isEducationRole` filtro. Cada row SHALL ser `Role / Company` (`Role` `lg:text-[16px] text-sm font-semibold text-foreground` primeiro, `Company` `text-muted-foreground` depois) com `period` curto `trajectory-period` `font-mono text-[10px] sm:text-xs uppercase` à direita e `Subtitle` headings `Trabalho`/`Formação` (`text-[9px] sm:text-[11px]`). Sem `summary`, sem `yearRange`, sem linha vertical `w-px`, sem `CrossMark`, com `max-w-6xl` e `Subtitle` reutilizável.

#### Scenario: Header simétrico com número 02
- **WHEN** a página carrega
- **THEN** o header da coluna 02 mostra `Trajetória` e `02`, e abaixo existem `h3#trajectory-work-title` `Trabalho` e `h3#trajectory-edu-title` `Formação` (ou `Work`/`Education` em `en`)

#### Scenario: Duas listas com 7 rows Role / Company
- **WHEN** a página carrega em `pt`
- **THEN** `ul[aria-label="Trabalho"]` tem 4 `<li>` e `ul[aria-label="Formação"]` tem 3 `<li>`, cada `li` com `Role / Company` (`Role` primeiro) e `period` curto `trajectory-period` com `title` do period completo

#### Scenario: Sem elementos antigos
- **WHEN** a página carrega
- **THEN** não existe `yearRange` `2007—2027`, `span.w-px.bg-border` ou `.cross-mark` em `section[data-col="trajetoria"]` e nenhum `summary` é exibido

### Requirement: Dados factuais em fonte única, rótulos localizados
Os dados factuais (hero, careerJourney, etc.) SHALL vir de `src/data/profile.ts` (fonte única, em pt, sem campos `OUTDATED_*`), incluindo `hero.mainStack` e `TimelineEntry.summary`. Os rótulos (colunas, Role/Stack/Localização, Sobre mim, Redes sociais) e a citação SHALL ser localizados em pt/es/en conforme o locale ativo; os fatos (cargo/período/empresa/stack) permanecem em pt.

#### Scenario: Fonte única sem campos obsoletos
- **WHEN** a seção é renderizada
- **THEN** todos os dados vêm de `profile.ts` e nenhum campo `OUTDATED_*` é exibido

#### Scenario: Locale controla os rótulos
- **WHEN** a página é carregada em `en`
- **THEN** os rótulos aparecem em inglês (Role, Main stack, About, Timeline, Social media) e os fatos (cargo/período/empresa) permanecem em pt

### Requirement: Morph alinhado ao retrato com tamanho final responsivo
O morph do retrato SHALL ter `#sobre-portrait` como alvo (`Hero.astro`: `target="#sobre-portrait"`, `finalX=0`, `finalY=0`). O diâmetro final SHALL ser responsivo via `--morph-final-size` definido no `:root` (**128px** base/`sm`/`md`, **160px** ≥1024), lido pelo JS do morph (`scroll-morph.ts`) e pelos wireframes blueprint (`morph-measure.ts`, `BlueprintMorphEnd/Start/Board`) com a prop como fallback. `#sobre-portrait` SHALL continuar fora de `[data-reveal]`.

#### Scenario: Alvo do morph é o retrato
- **WHEN** a página carrega
- **THEN** o `[data-scroll-morph]` aponta para `#sobre-portrait` com `finalX=0`/`finalY=0`, e o círculo `bp-end` segue a mesma clamp

#### Scenario: Tamanho final responsivo
- **WHEN** a página carrega no desktop
- **THEN** o círculo final tem 160px (var `--morph-final-size`)
- **WHEN** a página carrega no mobile (390px)
- **THEN** o círculo final tem 128px
