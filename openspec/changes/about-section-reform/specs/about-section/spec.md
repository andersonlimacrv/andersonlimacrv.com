## Purpose

Seção Sobre da home em **duas colunas** (Perfil à esquerda, Trajetória à direita). Em telas pequenas (mobile/tablet) as colunas **empilham** (Perfil acima, Trajetória abaixo); em `lg` (≥1024px) ficam lado a lado via `flex`. À esquerda, o **retrato P&B com marcações blueprint** e as **informações ao lado da foto (nunca abaixo)**: Role, stack principal e localização. À direita, uma **timeline vertical contínua agrupada por ano**, com os anos como pontos fixos na linha, a data primeiro ao lado do ano e o marcador preenchido (concluído) ou vazio (em andamento). Estética Engineering Blueprint (divisores finos, tipografia técnica, marcadores `T` no topo/fim da linha), imagem do hero intocada (apenas o ponto de aterrissagem do morph muda para o retrato) e hover de mira (`TargetHover` global, classe `.cursor-target`) nos links sociais.

## ADDED Requirements

### Requirement: Layout em duas colunas (flex; empilha no mobile, lado a lado no desktop)
`#sobre-content` SHALL ser um container `relative flex flex-col divide-y divide-border border-t border-border lg:flex-row lg:divide-x lg:divide-y-0`. Cada coluna SHALL ser um `<section data-col="perfil"|"trajetoria">` com `min-w-0` e `basis-full lg:basis-[46%]`/`lg:basis-[54%]`. No mobile (<1024px) as colunas **empilham** (Perfil acima, Trajetória abaixo, na ordem do DOM); em `lg` ficam lado a lado. O conteúdo não SHALL causar overflow horizontal.

#### Scenario: Colunas lado a lado no desktop
- **WHEN** a página carrega no desktop (1280px)
- **THEN** `#sobre-content > div` é `display: flex` com `flex-direction: row` e contém 2 `<section>` (Perfil, Trajetória)

#### Scenario: Colunas empilhadas no mobile
- **WHEN** a página carrega no mobile (390px)
- **THEN** `#sobre-content > div` é `display: flex` com `flex-direction: column` e a página não tem overflow horizontal

### Requirement: Colunas etiquetadas semânticamente
As duas colunas SHALL ser `<section data-col="perfil">` e `<section data-col="trajetoria">` (não anônimas), para evitar landmarks ambíguos.

#### Scenario: Colunas marcadas com data-col
- **WHEN** a página carrega
- **THEN** `#sobre-content` contém `<section data-col="perfil">` e `<section data-col="trajetoria">`

### Requirement: Retrato à esquerda com informações ao lado (nunca abaixo)
Na coluna 01 (Perfil), o box do retrato (`#sobre-portrait`, `aspect-square`, `shrink-0 basis-[47.5%]`, contém o `BlueprintMorphEnd`) SHALL ficar ao lado de um bloco de informações (`dl`, `flex-1`) com **3 itens**: **Role** (`hero.title` quebrado em 3 `span class="block"` — "Engenheiro de Software", "Enterpreneur", "Arquiteto de Soluções"), **Stack principal** (`hero.mainStack`) e **Localização** (`hero.location`). O bloco SHALL estar **à direita da foto**, **nunca abaixo**.

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

### Requirement: Timeline vertical contínua agrupada por ano na coluna 02
A coluna 02 SHALL ter o header com o rótulo "Trajetória" e o número `02` (simétrico ao header da coluna 01). O intervalo real dos dados (`yearRange` = min–max dos anos dos períodos; "presente" conta como o ano corrente) SHALL aparecer como rótulo mono `absolute right-0 top-2` **dentro do wrapper da timeline**, não no header. A timeline SHALL ser uma **linha vertical contínua** (`w-px`) percorrendo a coluna, com **marcadores `T`** (`CrossMark variant="t-top"` e `variant="t-bottom"`) no topo e no fim da linha. Os itens de `careerJourney` SHALL ser **agrupados pelo ano de início** (`careerGroups` em `About.astro`, derivado de `profile.careerJourney`); cada grupo é um `<li>` com:
- Coluna do ano: `w-[3.2rem] sm:w-[4.1rem] shrink-0`, `<p>` mono `text-right` com o ano (ponto fixo) e **marcador** na linha (quadrado `border-foreground`), **preenchido** (`bg-foreground`) se todos os itens do grupo estiverem concluídos; **vazio** (`bg-background`) se algum item contiver "presente" (`ongoing = entries.some(e => e.period.includes('presente'))`).
- Coluna das experiências (`flex-1`): para cada `entry` do grupo, um `div border-b last:border-b-0` contendo, **nesta ordem**: período (data primeiro, `p font-mono uppercase`), `h3` cargo, `p` empresa, `p` **summary** de 1 linha.

#### Scenario: Header simétrico com número 02
- **WHEN** a página carrega
- **THEN** o header da coluna 02 mostra o rótulo de trajetória localizado e o número `02` (sem `yearRange` no header)

#### Scenario: Intervalo real dentro do wrapper da timeline
- **WHEN** a página carrega
- **THEN** o wrapper da timeline contém um rótulo mono com o intervalo `2007—2027` (calculado dos dados)

#### Scenario: Agrupamento por ano com marcador
- **WHEN** a página carrega
- **THEN** cada grupo da timeline exibe um único ano (mono, alinhado à direita) e um marcador quadrado sobre a linha vertical; itens de mesmo ano (ex.: 2022) compartilham um único ponto fixo

#### Scenario: Marcadores T no topo e no fim da linha
- **WHEN** a página carrega
- **THEN** existem `CrossMark` `t-top` no topo e `t-bottom` no fim da linha vertical da timeline

#### Scenario: Data primeiro, depois cargo/empresa/resumo
- **WHEN** a página carrega
- **THEN** cada `entry` dentro de um grupo exibe, nesta ordem: período (mono uppercase), `h3` cargo, `p` empresa, `p` summary de 1 linha não vazio

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
