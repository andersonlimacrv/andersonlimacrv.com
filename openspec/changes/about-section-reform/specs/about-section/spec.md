## Purpose

Seção Sobre da home em **duas colunas fixas** (desktop e mobile — as larguras reduzem proporcionalmente no mobile, nunca empilham). À esquerda, o **retrato P&B com marcações blueprint** e as **informações pessoais ao lado da foto (nunca abaixo)**: Nome, cargo, stack principal e localização. À direita, uma **timeline vertical contínua** com os anos como pontos fixos na linha e a **duração destacada visualmente**. Estética Engineering Blueprint (grid rigorosa, divisores finos, tipografia técnica, espaçamento uniforme), imagem do hero intocada (apenas o ponto de aterrissagem do morph muda para o retrato) e hover de mira (TargetHover) nos links sociais.

## ADDED Requirements

### Requirement: Duas colunas fixas em qualquer largura
A seção Sobre SHALL ser um **grid de duas colunas** (`grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]`) em `#sobre-content`, com divisores `divide-x`/`border-t` (`divide-border`). As colunas SHALL **permanecer lado a lado também no mobile** (sem empilhar): as larguras relativas se mantêm e os paddings reduzem (`pr-3`/`pl-3`, `sm:pr-6`/`sm:pl-6`, `lg:pr-10`/`lg:pl-10`). Cada coluna SHALL ter `min-w-0` e o conteúdo não SHALL causar overflow horizontal.

#### Scenario: Grid de duas colunas no desktop
- **WHEN** a página carrega no desktop (1280px)
- **THEN** `#sobre-content` contém um grid com 2 colunas (`gridTemplateColumns` com 2 valores) e 2 filhos (`section`)

#### Scenario: Duas colunas mantidas no mobile
- **WHEN** a página carrega no mobile (390px)
- **THEN** `#sobre-content` continua `display: grid` com 2 colunas e 2 filhos, e a página não tem overflow horizontal

### Requirement: Retrato à esquerda com informações ao lado (nunca abaixo)
Na coluna 01, o box do retrato (`#sobre-portrait`, `aspect-square`, contém o `BlueprintMorphEnd`) SHALL ficar ao lado de um bloco de informações (`dl`) com **4 itens**: **Nome** (`hero.name`), **Role** (`hero.title`), **Stack principal** (`hero.mainStack`) e **Localização** (`hero.location`). O bloco SHALL estar **à direita da foto** (topo dentro da área da foto), **nunca abaixo**.

#### Scenario: Informações à direita da foto
- **WHEN** a página carrega no desktop e no mobile
- **THEN** o bloco de informações tem topo dentro da área vertical da foto e sua borda direita fica à direita da borda direita da foto (lado a lado, não abaixo)

#### Scenario: Quatro itens de informação
- **WHEN** a página carrega
- **THEN** o `dl` renderiza 4 itens: Nome (Anderson Carvalho), Role (Full Stack Developer…), Stack principal (Python · TypeScript · C · ESP32 · React) e Localização (Pelotas, Rio Grande do Sul, Brasil)

### Requirement: Frase, bio e social na coluna 01
Abaixo de foto+informações, a coluna 01 SHALL exibir, em ordem e separadas por `border-t`: a **frase** (`<blockquote>` serif itálico com o texto `aboutQuote` do locale + `<cite>` "Anderson Carvalho"), a seção **"Sobre mim"** (rótulo localizado + `aboutBio` em 2 parágrafos) e o **social/contato** no fim da coluna (links GitHub, LinkedIn, Email com `cursor-target` + telefone formatado `+55 53 98100-4874` derivado de `hero.contact.phone` + `hero.location`).

#### Scenario: Frase com citação
- **WHEN** a página carrega
- **THEN** existe um `<blockquote>` com `aboutQuote` do locale ativo e um `<cite>` com o autor, abaixo do bloco foto+informações

#### Scenario: Links sociais e contato
- **WHEN** a página carrega
- **THEN** na coluna 01 existem os 3 links sociais (GitHub, LinkedIn, Email) com a classe `cursor-target` e o contato `+55 53 98100-4874`

### Requirement: Timeline vertical contínua na coluna 02
A coluna 02 SHALL ter o header com o rótulo "Trajetória" e o **intervalo real dos dados** (`yearRange` = min–max dos anos dos períodos; "presente" conta como o ano corrente). A timeline SHALL ser uma **linha vertical contínua** (`w-px`) percorrendo a coluna, com os itens de `careerJourney` (7, ordenados recente→antigo). Cada item SHALL ter: o **ano como ponto fixo** na linha (com marcador), o cargo/formação (`h3`), a empresa, o período em mono e a **descrição de 1 linha** (`summary`).

#### Scenario: Header com intervalo real
- **WHEN** a página carrega
- **THEN** o header da coluna 02 mostra o rótulo de trajetória localizado e o intervalo `2007—2027` (calculado dos dados)

#### Scenario: Anos como pontos fixos com marcador
- **WHEN** a página carrega
- **THEN** cada item da timeline exibe seu ano (mono, alinhado à direita) e um marcador quadrado sobre a linha vertical

#### Scenario: Descrição de 1 linha por item
- **WHEN** a página carrega
- **THEN** cada item da timeline exibe uma descrição `summary` não vazia, abaixo de empresa e período

### Requirement: Dados factuais em fonte única, rótulos localizados
Os dados factuais (hero, careerJourney, etc.) SHALL vir de `src/data/profile.ts` (fonte única, em pt, sem campos `OUTDATED_*`), incluindo os novos `hero.mainStack` e `TimelineEntry.summary`. Os rótulos (colunas, Nome/Role/Stack/Localização, Sobre mim) e a citação SHALL ser localizados em pt/es/en conforme o locale ativo; os fatos permanecem em pt.

#### Scenario: Fonte única sem campos obsoletos
- **WHEN** a seção é renderizada
- **THEN** todos os dados vêm de `profile.ts` e nenhum campo `OUTDATED_*` é exibido

#### Scenario: Locale controla os rótulos
- **WHEN** a página é carregada em `en`
- **THEN** os rótulos aparecem em inglês (Name, Main stack, Sobre mim→About, Timeline) e os fatos (cargo/período/empresa) permanecem em pt

### Requirement: Morph alinhado ao retrato com tamanho final responsivo
O morph do retrato SHALL ter `#sobre-portrait` como alvo (`Hero.astro`: `target="#sobre-portrait"`, `finalX=0`, `finalY=0`). O diâmetro final SHALL ser responsivo via `--morph-final-size` definido no `:root` (64px base, 104px ≥640, 128px ≥768, 160px ≥1024), lido pelo JS do morph (`scroll-morph.ts`) e pelos wireframes blueprint (`morph-measure.ts`, `BlueprintMorphEnd/Start/Board`) com a prop como fallback. `#sobre-portrait` SHALL continuar fora de `[data-reveal]`.

#### Scenario: Alvo do morph é o retrato
- **WHEN** a página carrega
- **THEN** o `[data-scroll-morph]` aponta para `#sobre-portrait` com `finalX=0`/`finalY=0`, e o círculo `bp-end` segue a mesma clamp

#### Scenario: Tamanho final responsivo
- **WHEN** a página carrega no desktop
- **THEN** o círculo final tem 160px (var `--morph-final-size`)
- **WHEN** a página carrega no mobile (390px)
- **THEN** o círculo final tem 64px
