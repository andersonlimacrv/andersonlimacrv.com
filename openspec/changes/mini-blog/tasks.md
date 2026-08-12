## 1. Collection tipada e helpers

- [x] 1.1 Implementar `src/content/config.ts` com `defineCollection` para `blog`: schema zod com `title`, `description`, `pubDate` (date), `updatedDate?`, `tags` (array string), `cover?` (image), `draft` (boolean default false)
- [x] 1.2 Criar `src/lib/posts.ts` com `getPublishedPosts()` (filtra draft, ordena `pubDate` desc), `getReadingTime(post)` (~200 wpm) e `getRelatedPosts(post, all, limit=3)` (por tag compartilhada, fallback recentes)
- [x] 1.3 Escrever 3 posts de exemplo em `src/content/blog/` (pt-BR, 300–500 palavras, front-matter válido, primeiro parágrafo = resposta direta ao tema): ex. "Por que ter um site próprio em 2026", "Setup de desenvolvimento em 2026", "Design editorial para a web"

## 2. Índice do blog

- [x] 2.1 Implementar `src/pages/blog/index.astro`: título + grade de `PostCard` (1 col mobile, 2 tablet, 2–3 desktop), ordenado por `pubDate`, excluindo drafts
- [x] 2.2 Adicionar Breadcrumb simples (crumb pode ser refinado no change seo) e `<h1>` único
- [x] 2.3 Validar `/blog` em `npm run dev` e no build

## 3. Página de post

- [x] 3.1 Implementar `src/pages/blog/[slug].astro` com `getStaticPaths` dos posts publicados (drafts não geram página → 404)
- [x] 3.2 Criar `src/layouts/PostLayout.astro` estendendo BaseLayout: `<article>` com data/tags em mono, título display, tempo de leitura, conteúdo ~65–75ch
- [x] 3.3 Estilizar `.post-content` em `global.css`: `blockquote` com rail lateral (borda 1px) + Fraunces itálico, headings, listas, links
- [x] 3.4 Renderizar posts relacionados (2–3) no fim do post e botões de compartilhar (navigator.share + links mailto/X sem SDKs)
- [x] 3.5 Exibir `updatedDate` quando presente (visível + `dateModified`)

## 4. Feed RSS

- [x] 4.1 Implementar `src/pages/rss.xml.ts` com `@astrojs/rss` a partir de `getPublishedPosts()` (title, description, pubDate, link, site)
- [x] 4.2 Validar `/rss.xml` no build: XML RSS 2.0 válido sem drafts

## 5. Validação

- [x] 5.1 `npm run build` sem erros (incluindo validação do schema pelos posts)
- [x] 5.2 Testar rota de 404 para slug inexistente em `npm run dev`
- [x] 5.3 Verificar `astro check` sem erros de tipo
