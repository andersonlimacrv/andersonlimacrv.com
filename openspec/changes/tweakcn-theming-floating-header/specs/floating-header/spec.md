## Purpose

Define o comportamento do header do site: um único componente flutuante (toolbox) centralizado no topo, horizontal, que se aproxima gradualmente conforme a rolagem, mantendo sempre a mesma estrutura e os mesmos itens.

## ADDED Requirements

### Requirement: Toolbox flutuante única e horizontal

O header SHALL ser um único componente horizontal contendo logo, navegação (Sobre, Blog, Projetos, Contato), alternador de idioma e alternador de tema — todos os itens na mesma linha e na mesma ordem. No topo da página, o header SHALL ocupar 100% da largura da viewport e exibir apenas a borda inferior (sem fundo, raio ou sombra). Ao rolar, o header SHALL assumir a forma de toolbox flutuante centralizada (raio `var(--radius)` do site, fundo translúcido com blur, borda `border-border` completa e sombra).

O link "Blog" do header SHALL ancorar na seção da landing page que exibe os últimos 3 posts (`/#blog`); a página `/blog` (todos os posts) SHALL ser acessível apenas pelo link "Ver todos os posts" dessa seção. O componente SHALL aproximar-se gradualmente com a rolagem (redução proporcional de altura/padding/gap e intensificação de fundo/borda/sombra, progressiva ao longo de ~200px de scroll) e revertendo ao voltar ao topo, sem saltos de layout e sem alterar o layout do componente (não há swap por um segundo elemento).

Em viewports pequenas (< sm) a navegação fica oculta (menu dedicado a ser adicionado em fase futura); idioma e tema permanecem visíveis.

#### Scenario: Rolagem aproxima a toolbox

- **WHEN** o usuário rola a página além do limiar definido
- **THEN** a toolbox reduz gradualmente altura/padding/gap e intensifica fundo, borda e sombra, proporcionalmente à rolagem, sem mudar a estrutura do componente

#### Scenario: Retorno ao topo

- **WHEN** o usuário rola de volta para o topo da página
- **THEN** a toolbox retorna gradualmente ao tamanho e transparência iniciais

### Requirement: Validação com o movimento reduzido

Com `prefers-reduced-motion: reduce`, a aproximação SHALL ser instantânea (sem animação gradual).

#### Scenario: Redução de movimento

- **WHEN** o sistema indica `prefers-reduced-motion: reduce` e a página rola
- **THEN** a toolbox alterna entre estado expandido e compacto sem animação

### Requirement: Alternador de idioma como select nativo

O alternador de idioma SHALL ser um `<select>` nativo estilizado no design system (font-mono uppercase, borda `border-border`, raio `var(--radius)`, fundo translúcido e chevron próprio), exibindo as abreviações (PT, ES, EN) com o nome completo do idioma disponível via `title`. A navegação para a versão traduzida da mesma página/post (via mapeamento de slugs) SHALL ocorrer no evento `change` do seletor.

#### Scenario: Troca de idioma abreviada

- **WHEN** o usuário seleciona um idioma no seletor
- **THEN** o site navega para a versão correspondente da página atual (com slug traduzido em posts do blog) e o nome completo do idioma fica disponível via `title`/`aria-label`

### Requirement: Âncoras compensam o header fixo

Âncoras de navegação interna (`/#sobre`, `/#projetos`, `/#blog`, `/#contato`) SHALL posicionar a seção alvo abaixo do header fixo, sem sobreposição.

#### Scenario: Navegação por âncora

- **WHEN** o usuário acessa um link de âncora para uma seção da home
- **THEN** a seção alvo é posicionada no topo da viewport abaixo do header, sem conteúdo oculto
