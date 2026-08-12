## Purpose

Mini-blog da andersonlimacrv.com: Content Collections tipadas, índice com grade de posts, páginas individuais com leitura confortável e feed RSS gerado da collection.

## ADDED Requirements

### Requirement: Schema tipado da collection de posts
O site SHALL definir Content Collection `blog` com schema zod tipado: `title`, `description`, `pubDate`, `updatedDate?`, `tags[]`, `cover?`, `draft: boolean`.

#### Scenario: Front-matter inválido bloqueado
- **WHEN** um post é adicionado com front-matter que não atende ao schema
- **THEN** o build falha com erro apontando o post e o campo inválido

#### Scenario: Drafts fora do ar
- **WHEN** um post tem `draft: true`
- **THEN** ele não aparece no índice, na home, no RSS nem é gerado como página

### Requirement: Índice do blog
`/blog` SHALL listar posts publicados ordenados por `pubDate` decrescente em grade de cards (data em mono, título em display, resumo, tags como chips), com paginação ou "carregar mais" a partir de ~10 posts.

#### Scenario: Ordenação por data
- **WHEN** o índice `/blog` é renderizado
- **THEN** os posts aparecem do mais recente para o mais antigo por `pubDate`

### Requirement: Página de post individual
`/blog/[slug]` SHALL renderizar o post com tipografia de leitura confortável (~65–75ch), tempo de leitura estimado, citações em Fraunces itálico com rail lateral, data e tags, e link de volta ao índice.

#### Scenario: Post acessível por slug
- **WHEN** o usuário acessa `/blog/<slug>` de um post publicado
- **THEN** a página renderiza o conteúdo completo com tempo de leitura e citações estilizadas

#### Scenario: Slug inexistente
- **WHEN** o usuário acessa `/blog/<slug>` de um post inexistente ou draft
- **THEN** o servidor responde 404

### Requirement: Posts relacionados
Cada página de post SHALL sugerir 2–3 posts relacionados por tag compartilhada, excluindo o post atual.

#### Scenario: Sugestões por tag
- **WHEN** uma página de post é renderizada
- **THEN** ela exibe 2–3 links para outros posts que compartilham pelo menos uma tag

### Requirement: Feed RSS
O site SHALL gerar `/rss.xml` via `@astrojs/rss` a partir da collection `blog`, com title, description, pubDate e link de cada post.

#### Scenario: Feed válido
- **WHEN** `/rss.xml` é acessado após o build
- **THEN** retorna XML RSS 2.0 listando todos os posts publicados, sem drafts
