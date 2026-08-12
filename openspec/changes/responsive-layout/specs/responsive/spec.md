## Purpose

Comportamento responsivo mobile-first de todas as páginas e componentes do site, com tipografia fluida via clamp(), grades adaptativas e verificação nos breakpoints principais.

## ADDED Requirements

### Requirement: Mobile-first em todas as páginas
Todas as páginas e componentes SHALL ser projetados mobile-first usando breakpoints Tailwind (`sm/md/lg/xl`) ascendentes, sem overflow horizontal em nenhuma viewport.

#### Scenario: Sem overflow no mobile
- **WHEN** a home ou o blog são renderizados em 320px e 375px de largura
- **THEN** nenhum elemento causa rolagem horizontal e o conteúdo cabe na viewport

### Requirement: Grade de posts adaptativa
O índice do blog e o destaque na home SHALL usar grade de 1 coluna no mobile, 2 no tablet e 2–3 no desktop.

#### Scenario: Grade em cada breakpoint
- **WHEN** a viewport é 375px, 768px e 1440px
- **THEN** a grade de posts exibe respectivamente 1, 2 e 2–3 colunas

### Requirement: Header/menu responsivo
O header SHALL manter navegação compacta no mobile (sem overlay pesado) e expandida no desktop, com touch targets de pelo menos 44px.

#### Scenario: Touch targets no mobile
- **WHEN** o site é usado em tela mobile
- **THEN** todos os links/CTAs têm área de toque ≥ 44px

#### Scenario: Menu hambúrguer no mobile
- **WHEN** a viewport é < 768px
- **THEN** o header exibe um botão hambúrguer na área de ações; ao ativá-lo, a toolbox cresce em altura e a navegação aparece empilhada dentro dela, com `aria-expanded` refletindo o estado

#### Scenario: Fechamento do menu mobile
- **WHEN** o menu mobile está aberto
- **THEN** ele fecha ao clicar no hambúrguer, pressionar `Escape`, clicar fora do header, clicar num link da nav ou trocar de idioma

#### Scenario: Redução de movimento no menu
- **WHEN** o sistema indica `prefers-reduced-motion: reduce` e o usuário abre o menu mobile
- **THEN** o menu abre sem animação, aplicando o estado diretamente

### Requirement: Tipografia fluida sem saltos
O site SHALL usar `clamp()` para todos os tamanhos de display/headline, evitando múltiplos breakpoints de font-size.

#### Scenario: Cabeçalho sem saltos
- **WHEN** a viewport muda gradualmente de 320px a 1920px
- **THEN** os tamanhos display variam continuamente via clamp(), sem mudanças abruptas de tamanho

### Requirement: Hero empilhável
O hero SHALL empilhar retrato abaixo do texto no mobile e exibir lado a lado no desktop.

#### Scenario: Layout do hero no mobile
- **WHEN** a viewport é < 768px
- **THEN** o retrato aparece abaixo do texto do hero, centralizado

#### Scenario: Layout do hero no desktop
- **WHEN** a viewport é ≥ 1024px
- **THEN** texto e retrato aparecem lado a lado
