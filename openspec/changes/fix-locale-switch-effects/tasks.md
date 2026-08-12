## Tarefas

- [x] 1.1 `HomePage.astro`: remover `hero-entrance` + `--hero-delay` dos 4 elementos do hero (eyebrow, h1, subtítulo, figure)
- [x] 1.2 `global.css`: remover o bloco `@media` do `.hero-entrance` e o `@keyframes hero-in` (manter `.hero-name`)
- [x] 2.1 `Header.astro`: links de nav com `w-24` + `justify-center` + `whitespace-nowrap` (sem `px-2.5`), mantendo `aria-current`/underline
- [x] 3.1 `ui.ts`: `figCaption` es → `"AndersonLimaCRV"` (igual pt/en)
- [x] 4.1 Instalar `@playwright/test` (dev) e Chromium; criar `playwright.config.ts` com `webServer` (`astro preview` do build, porta 4321) e viewport 1280×800
- [x] 4.2 `e2e/locale-layout.spec.ts`: largura da pílula e dos links iguais nas 3 línguas (±2px, antes/depois do select); hero sem animação; 3 cards na landing e posts em `/blog` por língua; screenshots por idioma
- [x] 4.3 `package.json`: script `test:e2e` (`npm run build && playwright test`); `.gitignore`: `test-results/`, `playwright-report/`, `blob-report/`, `playwright/.cache/`
- [x] 5.1 Validar: `openspec validate --strict`, `astro check` (0 erros), build 15 páginas, assertions no dist (sem `hero-entrance`/`hero-in`; `w-24` nas 3 locales)
- [x] 5.2 `npm run test:e2e` verde + revisão de screenshots
- [x] 5.3 Checklist visual por página × idioma (home, blog, post, footer): header constante, hero estático, cards estáveis