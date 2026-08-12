## Why

O prompt exige um mini-blog funcional com Content Collections tipadas, índice, página de post e feed RSS — conteúdo é o pilar do site (SEO/GEO). Este change entrega o sistema de blog completo com 2–3 posts de exemplo.

## What Changes

- Define `src/content/config.ts` com schema tipado: `title`, `description`, `pubDate`, `updatedDate?`, `tags[]`, `cover?`, `draft`.
- Cria 3 posts de exemplo em `src/content/blog/` (Markdown) com conteúdo placeholder coerente e front-matter válido.
- `src/pages/blog/index.astro`: índice com grade de `PostCard` (data em mono, título, resumo, tags chips), ordenado por `pubDate` desc, excluindo drafts.
- `src/pages/blog/[slug].astro`: post individual com `PostLayout.astro` — tipografia de leitura (~65–75ch), tempo de leitura estimado, citações em Fraunces itálico com rail lateral, posts relacionados (2–3 por tag), botões de compartilhar (sem SDKs), `updatedDate` quando presente.
- `src/pages/rss.xml.ts`: feed RSS via `@astrojs/rss` a partir da collection.
- `src/layouts/PostLayout.astro`: layout específico de post (meta tags de artigo, JSON-LD BlogPosting básico — refinado no change technical-seo).
- 404 handling para slugs inexistentes (`getStaticPaths` com fallback).
- Tabela de conteúdos simples (títulos h2/h3) se viável via rehype.

## Capabilities

### New Capabilities
- `blog`: Sistema de mini-blog com Content Collections tipadas, índice, páginas de post individuais, posts relacionados, tempo de leitura e feed RSS.

### Modified Capabilities
<!-- nenhuma -->

## Impact

- `src/content/`, `src/pages/blog/`, `src/pages/rss.xml.ts`, `src/layouts/PostLayout.astro`.
- Depende de `site-foundation`, `design-tokens`, `home-page` (PostCard compartilhado).
