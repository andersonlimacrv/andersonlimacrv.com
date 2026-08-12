## Why

O prompt exige SEO técnico completo e otimização para busca por IA (GEO). Sem isso, o site não é indexável nem citável por agentes. Este change cobre toda a camada de metadados e arquivos de descoberta.

## What Changes

- `BaseLayout.astro` com meta tags completas por página: title, description, canonical, Open Graph (`og:title`, `og:description`, `og:image`, `og:type`), Twitter Card (`summary_large_image`).
- JSON-LD (schema.org):
  - `Person` na home (nome, url, image, sameAs para redes sociais).
  - `WebSite` com `SearchAction` se houver busca (inicialmente sem busca — omitir SearchAction, manter WebSite).
  - `BlogPosting` em cada post (author, datePublished, dateModified, image).
  - `BreadcrumbList` no índice e posts do blog.
- `@astrojs/sitemap` configurado no `astro.config.mjs` (sitemap-index.xml automático).
- `public/robots.txt`: permite crawlers padrão + IA (GPTBot, ClaudeBot, PerplexityBot, Google-Extended).
- `public/llms.txt`: índice curado em Markdown — quem é a pessoa, do que trata o blog, links para posts mais relevantes.
- Estrutura GEO "resposta direta primeiro": posts abrem com 1–2 frases diretas (implementado no conteúdo dos posts e no design de copy).
- Todas as imagens com `alt` descritivo (ou `alt=""` se decorativa).
- HTML semântico e hierarquia de headings (um único `<h1>` por página) — reforçado via layouts.

## Capabilities

### New Capabilities
- `seo`: Camada de SEO técnico (meta tags, Open Graph, JSON-LD, sitemap, robots.txt) e GEO (`/llms.txt`, resposta direta primeiro) para todo o site.

### Modified Capabilities
<!-- nenhuma -->

## Impact

- `public/robots.txt`, `public/llms.txt`, `astro.config.mjs`, `BaseLayout.astro`, layouts de post e home.
- Depende de `site-foundation`, `mini-blog`, `home-page`.
