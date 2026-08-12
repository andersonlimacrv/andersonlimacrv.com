## 1. Tokens e theming (global.css)

- [x] 1.1 Reformatar `src/styles/global.css`: adicionar `@custom-variant dark (&:is(.dark *));` e reescrever os tokens como o `example-tweakcn.css` — conjunto completo (background, foreground, card, popover, primary, secondary, muted, accent, destructive, border, input, ring, chart-1..5, sidebar, font-sans/serif/mono, radius e escala de shadows) em `:root` e `.dark`, com valores OKLCH reproduzindo o visual atual
- [x] 1.2 Adicionar bloco `@theme inline` completo (`--color-*: var(--*)`, radius-sm/md/lg/xl, shadow-2xs..2xl) e manter tokens locais `--blur`, `--shadow-soft` e `--header-h`
- [x] 1.3 Atualizar base layer (exemplo tweakcn `* { @apply border-border outline-ring/50 }`, `body { @apply bg-background text-foreground }` mantendo fontes/line-height) e remover o bloco `@media (prefers-color-scheme: dark)` e os seletores `[data-theme]`
- [x] 1.4 Converter utilitários CSS próprios (`.card-surface`, `.eyebrow`, `.grid-bg`, `.skip-link`, `.post-content a`, `.backdrop-blur-soft`, `.shadow-soft`) para tokens/utilitários novos

## 2. Dark mode via classe `.dark`

- [x] 2.1 Ajustar script inline anti-FOUC do `BaseLayout.astro` para aplicar/ler a classe `.dark` (persistindo `localStorage('theme')`, fallback `matchMedia`)
- [x] 2.2 Ajustar `src/components/theme-toggle.ts` para alternar a classe `.dark` no elemento raiz

## 3. Refactor de `hsl(var(--X))` nos componentes

- [x] 3.1 Substituir as ocorrências de `hsl(var(--X))` por utilitários do tema em `Header.astro`, `Footer.astro`, `LanguageSwitcher.astro`, `ProjectLink.astro`, `PostCard.astro`, `SectionHeading.astro`, `ThemeToggle.astro`
- [x] 3.2 Substituir em `HomePage.astro`, `BlogIndexPage.astro`, `BlogPostPage.astro` e `PostLayout.astro` (incl. `rounded-[var(--radius)]` → `rounded-lg`)
- [x] 3.3 Rodar `npm run check` (0 erros) e `npm run build` para validar o refactor

## 4. Header flutuante (toolbox)

- [x] 4.1 Reestruturar `Header.astro`: toolbox única — toolbox `.site-toolbar` — no topo: `border-bottom` full-width sem fundo; ao rolar: flutua (raio, blur, `border-border`, sombra) com logo, nav (desktop), `LanguageSwitcher` e `ThemeToggle`; sem segundo elemento/estado; item "Blog" = âncora `/#blog` (últimos 3 posts da landing; `/blog` só via "Ver todos os posts")
- [x] 4.2 Criar `src/components/site-header.ts` (padrão de `theme-toggle.ts`): grava `--header-progress` (0..1) no header conforme scroll (rAF, máximo ~200px); re-sincroniza em `astro:page-load`; reduced motion → progresso 0/1 direto
- [x] 4.3 Adicionar em `global.css`: `.site-header` (wrapper sticky centrado) + `.site-toolbar` (pílula flutuante) com aproximação por `--header-progress` (padding/gap/fundo/borda/sombra); `scroll-padding-top` no `html` para âncoras
- [x] 4.4 `LanguageSwitcher.astro` como `<select>` nativo no design system (mono uppercase, `border-border`, raio, chevron próprio; navega via `value` = href traduzido no `change` — mantém `translatePath`/`postMap`)

## 5. Validação final

- [x] 5.1 Verificar visual light/dark idêntico ao anterior e tema com variáveis OKLCH aplicado nos componentes
- [x] 5.2 Conferir RSS, sitemap, canonical/hreflang e âncoras (`/#sobre` etc.) intactos após o build
- [x] 5.3 Validar acessibilidade do header (foco, `aria-label`, alvos de 44px) e `prefers-reduced-motion`