## MODIFIED Requirements

### Requirement: Meta tags completas por página
Toda página SHALL emitir title, description, canonical, Open Graph (`og:title`, `og:description`, `og:image`, `og:type`, `og:locale`) e Twitter Card (`summary_large_image`), com valores distintos por rota e por idioma, mais tags `hreflang` apontando para as alternativas em pt/es/en.

#### Scenario: Home com OG
- **WHEN** a home é renderizada
- **THEN** seu `<head>` contém title, meta description, canonical absoluta, OG tags, Twitter Card e `hreflang` para `/`, `/es/` e `/en/`

#### Scenario: Post com OG próprio
- **WHEN** uma página de post é renderizada
- **THEN** OG tags refletem o título/descrição do post, `og:type` é `article`, e `hreflang` aponta para as versões do post em pt/es/en

#### Scenario: og:locale por idioma
- **WHEN** `/es/` é renderizada
- **THEN** `og:locale` é `es_ES` e canonical aponta para a URL `/es/`

### Requirement: Sitemap automático
O site SHALL gerar `sitemap-index.xml` a partir de `@astrojs/sitemap`, cobrindo todas as rotas públicas de todos os idiomas, excluindo drafts, com links `alternate` (hreflang) entre as versões de cada página.

#### Scenario: Sitemap gerado no build
- **WHEN** `npm run build` é executado
- **THEN** `dist/sitemap-index.xml` é gerado listando as URLs públicas de pt/es/en com base no `site` configurado

#### Scenario: Alternates por idioma
- **WHEN** o sitemap é inspecionado
- **THEN** `<xhtml:link rel="alternate" hreflang>` lista pt/es/en para cada URL traduzível

### Requirement: llms.txt para GEO
O site SHALL servir `/llms.txt` com índice curado em Markdown na língua principal (pt): quem é a pessoa, do que trata o blog, e links para os posts mais relevantes.

#### Scenario: llms.txt disponível
- **WHEN** `/llms.txt` é acessado
- **THEN** retorna Markdown com resumo da pessoa, descrição do blog e links para posts relevantes em pt