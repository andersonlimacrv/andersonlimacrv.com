## 1. Imagem e componentes base

- [ ] 1.1 Mover `me.png` da raiz para `src/assets/me.png` (git add/rm)
- [ ] 1.2 Criar `src/components/Eyebrow.astro` (mono uppercase espaçado, chip discreto, props `label` e `className` opcional)
- [ ] 1.3 Criar `src/components/SectionHeading.astro` (número mono `01 /` + título display, props `number`, `title`, `id`)
- [ ] 1.4 Criar `src/components/Header.astro` (nome + links âncora `#sobre #projetos #blog #contato`, sticky com backdrop blur, borda inferior)
- [ ] 1.5 Criar `src/components/Footer.astro` (copyright + link "voltar ao topo")
- [ ] 1.6 Criar SVG inline line icons (seta `→` para listas, seta para cima) com `stroke="currentColor"`, sem fill

## 2. Home — hero e sobre

- [ ] 2.1 Implementar hero no `index.astro`: eyebrow (`Perfil / 2026`), nome em display `clamp()`, parágrafo de posicionamento, retrato via `Image` do astro:assets (widths 480/800/1122, sizes responsivo, `loading="eager"`, `fetchpriority="high"`, `alt` descritivo, legenda mono `AndersonLima0001 / B&W`)
- [ ] 2.2 Implementar seção `01 / Sobre` com parágrafo curto + lista de links com seta `→` (GitHub, LinkedIn, Email)
- [ ] 2.3 Adicionar `scroll-margin-top` nas seções para âncoras não ficarem sob o header sticky

## 3. Home — projetos, blog em destaque e contato

- [ ] 3.1 Criar `src/components/ProjectLink.astro` (título, descrição, tags, seta `→`, hover sutil transform/opacity 150–250ms, abre em nova aba quando externo)
- [ ] 3.2 Implementar seção `02 / Projetos` com 3–5 projetos (array no frontmatter do index)
- [ ] 3.3 Criar `src/components/PostCard.astro` (data em mono, título display, resumo, tags como chips, link para `/blog/[slug]`)
- [ ] 3.4 Implementar seção `03 / Blog` renderizando os 3 posts mais recentes da collection `blog` com fallback estático quando a collection estiver vazia
- [ ] 3.5 Implementar seção `04 / Contato` (email/links diretos, sem formulário) e footer no layout

## 4. Validação

- [ ] 4.1 `npm run build` sem erros; confirmar imagem otimizada (AVIF/WebP) e atributos LCP no HTML
- [ ] 4.2 Verificar: um único `<h1>`, landmarks semânticos, `:focus-visible` visível nos links
- [ ] 4.3 Navegação por âncoras funcionando (scroll suave) em `npm run dev`
