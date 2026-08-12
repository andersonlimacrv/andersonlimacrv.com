## Context

Todas as páginas (home, blog) e layouts existem. Ver proposal.md - Why. Prompt §6 (SEO técnico) e §7 (GEO). `astro.config.mjs` já tem `@astrojs/sitemap` e `@astrojs/rss` (foundation). `BaseLayout` tem meta tags básicas.

## Goals / Non-Goals

**Goals:**
- Meta tags completas (title, description, canonical, OG, Twitter) por rota.
- JSON-LD: Person, WebSite, BlogPosting, BreadcrumbList.
- robots.txt, llms.txt, sitemap-index.xml.
- Estrutura de conteúdo GEO "resposta direta primeiro".

**Non-Goals:**
- Busca no site (sem `SearchAction` no JSON-LD — ver design).
- Implementação de analytics.
- SEO de tags individuais (`/blog/tag/` não existe).

## Decisions

**Meta tags centralizadas no `BaseLayout` via props** — `BaseLayout` aceita `title`, `description`, `image`, `type`, `canonical` etc. e compõe OG/Twitter/canonical automaticamente. Razão: DRY e consistência; cada página passa dados, não HTML. Alternativa: `@astrojs/seo` (dep extra desnecessária).

**`og:image` aponta para `me.png` otimizado** — Usar o output de `astro:assets` (URL absoluta via `site`) como `og:image` padrão; posts com cover usam a cover. Razão: prompt §6 pede og:image; me.png já é B&W adequado.

**JSON-LD como componente `JsonLd.astro`** — Recebe `schema` como prop e injeta `<script type="application/ld+json" set:html={JSON.stringify(schema)}>`. Razão: composição limpa; home injeta Person+WebSite, posts BlogPosting+BreadcrumbList, blog BreadcrumbList. Alternativa: hardcode por página (duplicação).

**`WebSite` sem `SearchAction`** — Prompt §6 pede SearchAction "se houver busca"; não há busca (não-planejada). Decisão: WebSite simples; adicionar SearchAction quando busca existir (mudança futura sem quebra).

**Site URL única** — `site: 'https://andersonlimacrv.com'` no `astro.config.mjs` é a fonte de canonical/OG; sitemap usa o mesmo. Razão: consistência entre sitemap, canonical e JSON-LD.

**`robots.txt` estático em `public/`** — Permite `User-agent: *`, GPTBot, ClaudeBot, PerplexityBot, Google-Extended, com `Sitemap:`. Razão: prompt §7; sem bloqueios propositais.

**`llms.txt` estático em `public/`** — Markdown curado: "Anderson Carvalho — desenvolvedor...", resumo do blog, links para posts. Razão: prompt §7 (GEO). Manter sincronizado manualmente com posts (aceitável; conteúdo muda pouco).

**GEO "resposta direta primeiro"** — Diretriz para o conteúdo dos posts de exemplo (mini-blog) + estrutura de copy da home: primeiro parágrafo = resposta direta. Implementado no conteúdo em si, não em código.

## Risks / Trade-offs

- [Canonical errada se `site` mudar antes do deploy] → Usar `ASTRO_SITE` env se necessário; documentar.
- [llms.txt desatualizado quando novos posts] → Atualização manual junto com cada post (convenção do repo); aceitável para escala do site.
- [JSON-LD duplicado com Astro View Transitions] → Páginas SSG estáticas não sofrem re-render; OK.
