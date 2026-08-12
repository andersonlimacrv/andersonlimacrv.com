## Purpose

Página inicial one-page editorial da andersonlimacrv.com com hero (retrato B&W otimizado), seções numeradas, projetos, blog em destaque e contato.

## ADDED Requirements

### Requirement: Retrato B&W otimizado no hero
O site SHALL servir a imagem `me.png` via `astro:assets` otimizada (formatos modernos, srcset responsivo), carregada com `loading="eager"` e `fetchpriority="high"` como LCP, com `alt` descritivo e legenda em fonte mono no estilo `NomeFoto0001 / B&W`.

#### Scenario: Imagem do hero otimizada
- **WHEN** o HTML da home é gerado em produção
- **THEN** a imagem do hero usa formatos modernos via astro:assets, tem `alt` descritivo, `fetchpriority="high"` e srcset responsivo

### Requirement: Seções numeradas da home
A home SHALL exibir as seções `01 / Sobre`, `02 / Projetos`, `03 / Blog` e `04 / Contato` com número em fonte mono e título em display, além de hero com eyebrow, nome em `clamp()` e parágrafo de posicionamento.

#### Scenario: Estrutura das seções
- **WHEN** se inspeciona o HTML da home
- **THEN** existem as quatro seções numeradas na ordem Sobre, Projetos, Blog, Contato com markup semântico `<section>`

### Requirement: Header sticky e navegação âncora
O site SHALL ter header fixo/sticky com nome + links de navegação âncora para as seções, com backdrop blur e `:focus-visible` visível.

#### Scenario: Navegação por âncoras
- **WHEN** o usuário clica em um link do header
- **THEN** a página rola suavemente até a seção correspondente sem recarregar

### Requirement: Listas de projetos com seta
A seção Projetos SHALL listar projetos como links com seta `→` e hover sutil (transform/opacity, 150–250ms) em cards com borda 1px e raio de 4px.

#### Scenario: Hover em projeto
- **WHEN** o usuário passa o mouse sobre um link de projeto
- **THEN** o link desloca alguns pixels e muda de cor suavemente em ≤250ms

### Requirement: Blog em destaque na home
A home SHALL exibir posts em destaque usando o componente `PostCard` (data em mono, título em display, resumo, tags como chips), mantendo consistência com o índice do blog.

#### Scenario: Posts em destaque
- **WHEN** a home é renderizada
- **THEN** os `PostCard` exibidos usam o mesmo visual do índice `/blog`

### Requirement: Contato e rodapé minimalistas
A seção Contato SHALL listar canais diretos (email/links) sem formulário; o rodapé SHALL ter copyright e link "voltar ao topo".

#### Scenario: Link voltar ao topo
- **WHEN** o usuário clica em "voltar ao topo" no rodapé
- **THEN** a página rola até o topo
