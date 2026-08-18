## Purpose

Define uma origem única e tipada para os dados factuais do site (identidade, contato, seções numeradas, projetos), consumida por componentes, layouts, feeds e JSON-LD, eliminando duplicação e conflitos entre arquivos.

## ADDED Requirements

### Requirement: Fonte única de dados factuais
O site SHALL manter os dados factuais do projeto (nome, e-mail, telefone, URLs de redes sociais, números de seção, ano do eyebrow) em um único módulo sob `src/data/site.ts`, sem duplicação em outros módulos de dados ou componentes.

#### Scenario: Nome do autor vem de fonte única
- **WHEN** um componente, layout, feed RSS ou JSON-LD exibe o nome do autor
- **THEN** o valor SHALL ser lido de `src/data/site.ts` e SHALL ser idêntico em todos os lugares em que aparece

#### Scenario: E-mail canônico sem conflito
- **WHEN** o e-mail do site é apresentado em qualquer superfície (contato, redes sociais, metadados)
- **THEN** o valor SHALL ser `contato@andersonlimacrv.com` e SHALL existir em apenas um local do módulo de dados

### Requirement: Perfil não duplica contato do site
O módulo `src/data/profile.ts` SHALL remover quaisquer campos de contato (telefone, e-mail, LinkedIn) duplicados de `src/data/site.ts`, mantendo apenas a referência à fonte única.

#### Scenario: Contato do perfil deriva do site
- **WHEN** o perfil é consumido e expõe informações de contato
- **THEN** os valores SHALL vir de `src/data/site.ts`, sem valores duplicados no objeto de perfil

### Requirement: Projetos não-localizados
Os dados factuais dos projetos (título, URL, tags) SHALL existir em uma única estrutura em `src/data/projects.ts`, compartilhada entre os idiomas, com as descrições localizadas fornecidas por `src/i18n/ui.ts`.

#### Scenario: Projetos iguais entre idiomas
- **WHEN** a home é renderizada em qualquer idioma (pt, es, en)
- **THEN** título, URL e tags dos projetos SHALL ser os mesmos em todos os idiomas e as descrições SHALL vir da tradução correspondente

### Requirement: Traduções não contêm dados factuais
`src/i18n/ui.ts` SHALL conter apenas strings de tradução; números de seção (`01`–`04`), o ano do eyebrow do hero e títulos factuais de projetos SHALL ser removidos do dicionário de tradução.

#### Scenario: Número de seção vem do site
- **WHEN** uma seção numerada (Sobre, Projetos, Blog, Contato) é renderizada
- **THEN** o número exibido SHALL vir de `src/data/site.ts` e SHALL ser o mesmo em todos os idiomas

#### Scenario: Eyebrow do hero composto por site + tradução
- **WHEN** o eyebrow do hero é renderizado
- **THEN** SHALL ser composto pelo rótulo traduzido (`Perfil`/`Profile`) e pelo ano vindo de `src/data/site.ts`

### Requirement: Títulos de página compostos pelo nome
Os meta titles (ex.: "Anderson Carvalho — Desenvolvedor") SHALL ser compostos pelo nome vindo de `src/data/site.ts` mais o sufixo traduzido, sem hardcode do nome no dicionário de tradução.

#### Scenario: Meta title usa nome da fonte única
- **WHEN** uma página gera seu `<title>` ou meta description
- **THEN** o nome do autor SHALL ser interpolado a partir de `src/data/site.ts`

### Requirement: Navegação por âncora preserva idioma e fragmento
A troca de idioma SHALL preservar o fragmento de âncora (`#contato`), e o clique em âncora cuja página já está ativa SHALL rolar suavemente sem disparar navegação de página.

#### Scenario: Troca de idioma mantém âncora
- **WHEN** o usuário está em `/es/#contato` e alterna para pt
- **THEN** o navegador navega para `/pt/#contato` (fragmento preservado)

#### Scenario: Âncora na mesma página rola sem navegação
- **WHEN** o usuário está na home em `/es/` e clica em "Contato"
- **THEN** a página rola suavemente até a seção `#contato` e a URL SHALL refletir o fragmento sem recarregar ou transicionar a página

#### Scenario: Âncora respeita reduced motion
- **WHEN** o sistema operacional está com `prefers-reduced-motion: reduce`
- **THEN** a rolagem para a âncora SHALL ser instantânea, sem animação
