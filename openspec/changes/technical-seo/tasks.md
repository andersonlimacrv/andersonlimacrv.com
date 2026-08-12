## 1. Meta tags e base compartilhada

- [x] 1.1 Estender `BaseLayout.astro` com props `title`, `description`, `image?`, `type?`, `canonical?` e `lang` compondo title/description, canonical absoluta (`site` + path), Open Graph (`og:title`, `og:description`, `og:image`, `og:type`) e Twitter Card (`summary_large_image`)
- [x] 1.2 Definir `site: 'https://andersonlimacrv.com'` como fonte única de URL absoluta (canonical/OG) — confirmar no `astro.config.mjs`
- [x] 1.3 Padronizar `og:image` default = imagem otimizada do `me.png` (URL absoluta); posts com cover usam a cover

## 2. JSON-LD

- [x] 2.1 Criar `src/components/JsonLd.astro` que serializa e injeta qualquer schema (`<script type="application/ld+json" set:html>`)
- [x] 2.2 Home: injetar `Person` (name, url, image, sameAs com redes) + `WebSite` (sem SearchAction — não há busca)
- [x] 2.3 Índice do blog: injetar `BreadcrumbList` (Home → Blog)
- [x] 2.4 Posts: injetar `BlogPosting` (author, datePublished, dateModified, image quando cover) + `BreadcrumbList` (Home → Blog → Post)

## 3. Arquivos de descoberta

- [x] 3.1 Criar `public/robots.txt` permitindo `User-agent: *`, GPTBot, ClaudeBot, PerplexityBot, Google-Extended, com `Sitemap: https://andersonlimacrv.com/sitemap-index.xml`
- [x] 3.2 Criar `public/llms.txt` (Markdown curado: quem é Anderson Carvalho, do que trata o blog, links para posts mais relevantes)
- [x] 3.3 Confirmar `@astrojs/sitemap` gera `sitemap-index.xml` no build listando todas as rotas públicas (sem drafts)

## 4. GEO e validação

- [x] 4.1 Auditar os 3 posts de exemplo e a copy da home: primeiro parágrafo responde diretamente ao tema (1–2 frases) antes de contexto
- [x] 4.2 Auditar `alt` de todas as imagens (descritivo ou `alt=""` decorativo) e hierarquia de headings (um único h1 por página)
- [x] 4.3 `npm run build` e conferir: meta/OG/canonical corretas por rota, JSON-LD válido (validar com `npx --yes jsonld-cli` ou parse), robots.txt/llms.txt/sitemap no `dist/`
