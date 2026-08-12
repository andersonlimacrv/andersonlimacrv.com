## Purpose

Camada de SEO técnico (meta tags, Open Graph, JSON-LD, sitemap, robots.txt) e GEO (`/llms.txt`, resposta direta primeiro) para maximizar indexação e citação do site por buscadores e agentes de IA.

## ADDED Requirements

### Requirement: Meta tags completas por página
Toda página SHALL emitir title, description, canonical, Open Graph (`og:title`, `og:description`, `og:image`, `og:type`) e Twitter Card (`summary_large_image`), com valores distintos por rota.

#### Scenario: Home com OG
- **WHEN** a home é renderizada
- **THEN** seu `<head>` contém title, meta description, canonical absoluta, OG tags e Twitter Card

#### Scenario: Post com OG próprio
- **WHEN** uma página de post é renderizada
- **THEN** OG tags refletem o título/descrição do post e `og:type` é `article`

### Requirement: Dados estruturados JSON-LD
O site SHALL emitir JSON-LD: `Person` na home; `WebSite` global; `BlogPosting` (author, datePublished, dateModified, image) em cada post; `BreadcrumbList` no índice e posts do blog.

#### Scenario: Person na home
- **WHEN** o HTML da home é inspecionado
- **THEN** contém JSON-LD `Person` com nome, url, imagem e `sameAs` de redes sociais

#### Scenario: BlogPosting em posts
- **WHEN** o HTML de um post é inspecionado
- **THEN** contém JSON-LD `BlogPosting` com author, datePublished, dateModified e image quando houver cover

### Requirement: Sitemap automático
O site SHALL gerar `sitemap-index.xml` a partir de `@astrojs/sitemap`, cobrindo todas as rotas públicas estáticas, excluindo drafts e rotas não publicáveis.

#### Scenario: Sitemap gerado no build
- **WHEN** `npm run build` é executado
- **THEN** `dist/sitemap-index.xml` é gerado listando as URLs públicas com base no `site` configurado

### Requirement: robots.txt com crawlers de IA
`/robots.txt` SHALL permitir crawlers padrão e de IA (GPTBot, ClaudeBot, PerplexityBot, Google-Extended) e apontar o sitemap.

#### Scenario: IA liberada
- **WHEN** `/robots.txt` é acessado
- **THEN** contém User-agent permitindo GPTBot, ClaudeBot, PerplexityBot e Google-Extended, além de referência ao sitemap-index.xml

### Requirement: llms.txt para GEO
O site SHALL servir `/llms.txt` com índice curado em Markdown: quem é a pessoa, do que trata o blog, e links para os posts mais relevantes.

#### Scenario: llms.txt disponível
- **WHEN** `/llms.txt` é acessado
- **THEN** retorna Markdown com resumo da pessoa, descrição do blog e links para posts relevantes

### Requirement: Conteúdo "resposta direta primeiro"
Posts e seções SHALL abrir com 1–2 frases que respondam diretamente ao tema antes de contexto, para otimização de citação por IA (GEO).

#### Scenario: Abertura direta de post
- **WHEN** um post do blog é renderizado
- **THEN** seu primeiro parágrafo responde diretamente ao tema do título antes de qualquer contextualização
