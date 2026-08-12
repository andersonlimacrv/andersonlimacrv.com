## 1. Scaffold do projeto

- [x] 1.1 Executar `npm create astro@latest . -- --template minimal --no-install --no-git --yes` (ou equivalente não-interativo) no diretório raiz, sem sobrescrever `prompt.md`/`me.png`/`openspec/`
- [x] 1.2 Instalar dependências com `npm install` e adicionar TypeScript strict no `tsconfig.json`
- [x] 1.3 Adicionar `@tailwindcss/vite` + `tailwindcss` como devDependencies e registrar o plugin Vite no `astro.config.mjs`
- [x] 1.4 Configurar `site: 'https://andersonlimacrv.com'`, output estático e integrações `@astrojs/sitemap` e `@astrojs/rss` no `astro.config.mjs`
- [x] 1.5 Verificar `.gitignore` (node_modules, dist, .astro) e scripts `dev`/`build`/`preview`/`astro check` no `package.json`

## 2. Estrutura e estilos base

- [x] 2.1 Criar diretórios `src/components`, `src/content`, `src/layouts`, `src/pages`, `src/styles` e `public` com arquivos placeholder (README.md ou vazio)
- [x] 2.2 Criar `src/styles/global.css` importando Tailwind (`@import "tailwindcss"`) e camadas base mínimas
- [x] 2.3 Instalar `@fontsource-variable/manrope`, `@fontsource-variable/jetbrains-mono`, `@fontsource-variable/fraunces` e importar no `global.css` com `font-display: swap`

## 3. Layout base

- [x] 3.1 Criar `src/layouts/BaseLayout.astro` com props tipadas (`title`, `description`, `lang`) e `<head>` com viewport, charset e slots para head extras
- [x] 3.2 Adicionar skip-link, `<header>`/`<main>`/`<footer>` semânticos vazios (slots) ao `BaseLayout`
- [x] 3.3 Criar `src/content/config.ts` vazio (esqueleto `defineCollection` comentado para habilitar Content Collections) ou o mínimo exigido pelo Astro 5
- [x] 3.4 Criar `src/pages/index.astro` mínimo (usa BaseLayout, h1 único) para validar o pipeline

## 4. Validação

- [x] 4.1 Executar `npm run build` sem erros e conferir `dist/` gerado
- [x] 4.2 Executar `npx astro check` sem erros de tipo
- [x] 4.3 Confirmar que nenhum HTML de produção referencia CDN externo de fontes
