## 1. Upgrade de dependências

- [x] 1.1 Atualizar `astro`, `tailwindcss`, `@tailwindcss/vite`, `@astrojs/sitemap`, `@astrojs/rss`, `@astrojs/check`, `typescript` para as últimas versões (`npm install -D` / `npm install`)
- [x] 1.2 Aprovar scripts de build do sharp/esbuild se o npm exigir
- [x] 1.3 Ajustar `astro.config.mjs` para qualquer quebra do v7 (ex.: `compressHTML`, opções de sitemap, flags experimentais removidas)

## 2. Validação

- [x] 2.1 Executar `npm run build` sem erros (5 páginas + RSS + sitemap)
- [x] 2.2 Executar `npx astro check` sem erros de tipo
- [x] 2.3 Confirmar rotas principais respondendo (home, blog, post, rss.xml)