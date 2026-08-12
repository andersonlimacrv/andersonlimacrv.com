## Context

Foundation, tokens e home prontos. Ver proposal.md - Why. Prompt §5 define o mini-blog (Content Collections, índice, post, RSS). `BaseLayout` e `PostCard` já existem. `src/content/config.ts` foi criado vazio no foundation.

## Goals / Non-Goals

**Goals:**
- Collection `blog` tipada (zod) conforme prompt §5.
- `/blog` com grade de PostCard + `/blog/[slug]` com PostLayout.
- 3 posts de exemplo em pt-BR com conteúdo placeholder coerente e "resposta direta primeiro" (GEO).
- Feed RSS automático.

**Non-Goals:**
- Tags/páginas por tag (`/blog/tag/[tag]` — opcional no prompt, fica fora).
- Busca no blog, comentários, CMS.
- MDX (Markdown suficiente; MDX pode ser adicionado depois sem quebrar schema).

## Decisions

**Content Collections glob com `src/content/config.ts` (zod v4)** — `defineCollection({ type: 'content', schema: z.object({...}) })`. Razão: prompt §5 exige schema tipado; zod valida front-matter no build. Alternativa: arquivos soltos sem schema (rejeitado — sem type-safety).

**`getCollection('blog', ({ data }) => !data.draft)` + ordenação por `pubDate` desc** — Filtro de drafts centralizado em `src/lib/posts.ts` (helper `getPublishedPosts`, `getReadingTime`, `getRelatedPosts`). Razão: lógica compartilhada entre home, índice, post e RSS evita duplicação.

**Slug do arquivo como rota** — `src/pages/blog/[slug].astro` com `getStaticPaths` de todos os posts publicados. 404: `getStaticPaths` não lista drafts → Astro gera 404 nativamente.

**Tempo de leitura** — cálculo por contagem de palavras (~200 wpm), exportado como helper e exibido no header do post (`3 min de leitura`).

**Posts relacionados** — helper que pontua por tag compartilhada, top 3, excluindo o atual. Sem tags → fallback para posts mais recentes.

**Citações Fraunces** — Estilização via `global.css` (`.post-content blockquote` com rail lateral + Fraunces itálico), sem rehype custom. Alternativa: rehype plugin (desnecessário — CSS cobre `blockquote` e `figure`).

**RSS via `@astrojs/rss`** — `src/pages/rss.xml.ts` consumindo `getPublishedPosts`, com `site`, título, descrição e itens com `pubDate` e `link`. Alternativa: `feed` package (extra dep, desnecessário).

**PostLayout** — `src/layouts/PostLayout.astro` estendendo BaseLayout, adicionando artigo semântico, meta de post e compartilhamento (nativo `navigator.share` quando disponível + links `mailto`/`X` com parâmetros — sem SDKs).

**Posts de exemplo** — 3 posts pt-BR: ex. "Por que um desenvolvedor deveria ter um site próprio", "Meu setup de desenvolvimento em 2026", "Design editorial para a web: menos é mais". Front-matter completo (tags, datas, draft: false).

## Risks / Trade-offs

- [zod v4 em vez de v3 (expectType etc.)] → Content Collections do Astro 5 usam zod v4 por padrão; escrever schema com API v4.
- [Conteúdo placeholder raso demais] → Escrever posts com ~300-500 palavras cada, úteis e coerentes (não lorem ipsum).
- [Tabela de conteúdos] → Opcional; sem rehype extra por ora — adicionar depois sem impacto no schema.
