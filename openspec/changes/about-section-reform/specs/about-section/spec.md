## Purpose

Seção Sobre da home em duas colunas: esquerda (~40% da tela) com citação de apresentação em cima e descrição embaixo; direita com timeline minimalista de empregos/títulos/estudos. Visual extremamente geométrico (linhas finas formando retângulos), imagem do hero como selo no canto superior-esquerdo e hover de mira (TargetHover) nos links.

## ADDED Requirements

### Requirement: Layout em duas colunas com divisores geométricos
A seção Sobre SHALL usar **flexbox** (não grid) para dispor **duas colunas**: a esquerda com ~40% da tela (`lg:w-[min(40vw,55%)]`) contendo citação e descrição, e a direita com a timeline ocupando o restante (`flex-1`). Abaixo das colunas SHALL existir uma **faixa de largura total** com os chips de stack (`lg:basis-full`, em `flex-wrap`). O conteúdo SHALL ser dividido por **linhas finas** (`border`), formando retângulos: `border-l` vertical entre as colunas no desktop e `border-t` horizontal entre os blocos, entre os itens da timeline e no rodapé. No mobile SHALL empilhar em coluna sem overflow horizontal.

#### Scenario: Duas colunas no desktop
- **WHEN** a página carrega no desktop (1280px)
- **THEN** `#sobre-content` tem `display: flex`, direção `row`, uma coluna de texto com largura ~40% à esquerda e a timeline à direita, separadas por uma borda vertical, com a faixa de stack ocupando uma linha inteira abaixo

#### Scenario: Empilhamento no mobile
- **WHEN** a página carrega no mobile (390px)
- **THEN** `#sobre-content` tem direção `column`, os blocos se empilham com divisores horizontais (`border-t`) e não há overflow horizontal

### Requirement: Imagem como selo no canto superior-esquerdo
O círculo final do morph (Ø160px) SHALL pousar como um "selo" colado no canto superior-esquerdo de `#sobre-content` (`finalX=0.06`, `finalY=0` → `top=0` pela clamp, ocupando `x:0–160px`), com a mesma clamp do morph. O conteúdo SHALL evitar sobreposição com o selo: no desktop a coluna esquerda é deslocada à direita (`lg:pl-44`, 176px); no mobile o texto começa abaixo dele (`pt-44`).

#### Scenario: Selo no topo-esquerdo
- **WHEN** a página carrega no desktop
- **THEN** o círculo `bp-end` está no canto superior-esquerdo do container (posição da clamp com `finalX=0.06`/`finalY=0`) e a coluna esquerda de texto não se sobrepõe a ele

#### Scenario: Sem sobreposição no mobile
- **WHEN** a página carrega no mobile
- **THEN** o texto da seção começa abaixo da zona do selo e a página não tem overflow horizontal

### Requirement: Citação de apresentação e descrição
A coluna esquerda SHALL exibir, em cima, a **citação em primeira pessoa** (`<blockquote>` serif itálico + `<cite>` "Anderson Carvalho") e, embaixo, a **descrição** (`aboutBio`, dois parágrafos).

#### Scenario: Citação renderizada
- **WHEN** a página carrega
- **THEN** existe um `<blockquote>` na seção com o texto `aboutQuote` do locale ativo e um `<cite>` com "Anderson Carvalho"

#### Scenario: Descrição em dois parágrafos
- **WHEN** a página carrega
- **THEN** a descrição `aboutBio` (2 parágrafos) é renderizada na coluna esquerda, abaixo da citação

### Requirement: Timeline minimalista de empregos/títulos/estudos
A coluna direita SHALL exibir uma **timeline** com os itens de `careerJourney` (empregos + estudos mesclados) ordenados do mais recente ao mais antigo, cada item com **cargo/empresa/período**, separados por linhas horizontais. Itens com detalhes de `experienceDetails` SHALL ser **expansíveis** (highlights), via elemento sem JS (`<details>`).

#### Scenario: Itens ordenados
- **WHEN** a página carrega
- **THEN** a timeline renderiza todos os itens de `careerJourney` em ordem do mais recente para o mais antigo, cada um com cargo, empresa e período

#### Scenario: Detalhes expansíveis
- **WHEN** o usuário expande um item que possui `experienceDetails`
- **THEN** os highlights do cargo/empresa são exibidos (agrupados por frontend/backend/IoT quando houver), sem JavaScript obrigatório

### Requirement: Chips de stack e bloco de detalhes
A seção SHALL exibir os **grupos de `techStack`** como chips em uma **faixa de largura total abaixo das duas colunas** (grupos em `flex-wrap`, ~1/3 da largura cada no desktop) e um **bloco de detalhes** na coluna esquerda com os itens de `about` (Role, Focus, Experience, Superpower, Location), ambos divididos por linhas.

#### Scenario: Chips por grupo
- **WHEN** a página carrega
- **THEN** os grupos de `techStack` são renderizados como chips (rótulo mono + pills) em uma faixa abaixo das duas colunas

#### Scenario: Bloco de detalhes
- **WHEN** a página carrega
- **THEN** os itens de `about` (exceto campos `OUTDATED_*`) são renderizados como linhas de definição (`dt`/`dd`) separadas por `border-t`

### Requirement: Rodapé com localização, contato e links com mira
A seção SHALL exibir um **rodapé** (dividido por `border-t`) com a localização (`hero.location`), contato e os links sociais (GitHub, LinkedIn, Email). Cada link SHALL ativar o hover de mira (`TargetHover`): possui a classe `cursor-target` e, no desktop, ganha 4 corners no hover; no mobile o efeito permanece desativado.

#### Scenario: Links com cursor-target
- **WHEN** a página carrega
- **THEN** os três links (GitHub, LinkedIn e Email) possuem a classe `cursor-target`

#### Scenario: Corners no desktop
- **WHEN** a página carrega no desktop e o TargetHover inicializa
- **THEN** cada link com `cursor-target` possui 4 elementos `.target-hover-corner`

#### Scenario: Sem corners no mobile
- **WHEN** a página carrega no mobile
- **THEN** nenhum `.target-hover-corner` é adicionado aos links

### Requirement: Dados factuais em fonte única, rótulos localizados
Os dados factuais (hero, about, techStack, careerJourney, experienceDetails, education) SHALL vir de `src/data/profile.ts` (fonte única, em pt, sem campos `OUTDATED_*`). Os rótulos e a citação SHALL ser localizados nos três idiomas (`pt`, `es`, `en`) e renderizar conforme o locale ativo.

#### Scenario: Fonte única sem campos obsoletos
- **WHEN** a seção é renderizada
- **THEN** todos os dados vêm de `profile.ts` e nenhum campo `OUTDATED_*` do `add-data.json` é exibido

#### Scenario: Locale controla os rótulos
- **WHEN** a página é carregada em `pt`, `es` e `en`
- **THEN** cada idioma renderiza sua versão da citação e dos rótulos (timeline, stack, detalhes, contato)

### Requirement: Sem interferência com o morph
A reformulação SHALL preservar o comportamento do morph: `#sobre-content` continua sendo o alvo do `[data-scroll-morph]`, fora de qualquer `[data-reveal]` com transform, e o círculo final continua desenhado com a mesma clamp (agora com `finalX=0.06`/`finalY=0`).

#### Scenario: Alvo do morph inalterado
- **WHEN** a página carrega
- **THEN** `#sobre-content` é o alvo do `[data-scroll-morph]`, não está dentro de um `[data-reveal]`, e o círculo `bp-end` segue a clamp do morph com os novos parâmetros