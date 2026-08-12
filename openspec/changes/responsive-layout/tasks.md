## 1. Fundação responsiva

- [ ] 1.1 Criar utility `.container-site` em `global.css` (`mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8`) e aplicar em todas as páginas/seções
- [ ] 1.2 Auditar `index.astro`, blog pages e componentes: remover classes desktop-first onde quebram mobile-first; garantir `min-w-0` em grids
- [ ] 1.3 Garantir `scroll-margin-top` nas seções âncora (compensar header sticky)

## 2. Header e navegação mobile

- [ ] 2.1 Implementar nav mobile com `<details>` nativo (botão "Menu" com `summary`, sem overlay pesado, sem JS), desktop com nav inline (`sm:` ou `md:`)
- [ ] 2.2 Garantir touch targets ≥ 44px (`min-h-11`, padding adequado) em links/CTAs do header, hero, projetos e footer

## 3. Grades e hero

- [ ] 3.1 Índice do blog: grade `grid gap-6 sm:grid-cols-2 lg:grid-cols-3` (1→2→3 colunas)
- [ ] 3.2 Destaque na home: mesma grade (1→2→3 ou 1→2 no tablet conforme espaço)
- [ ] 3.3 Hero: empilhado (retrato abaixo do texto) no mobile, lado a lado em `md:`/`lg:`
- [ ] 3.4 `line-clamp` controlado em títulos/resumos de PostCard para grades não quebrarem

## 4. Verificação em breakpoints

- [ ] 4.1 Verificar em 320, 375, 768, 1024, 1440: zero overflow horizontal, grades corretas, header/nav utilizáveis
- [ ] 4.2 Verificar touch targets e `:focus-visible` no mobile via DevTools de dispositivo
- [ ] 4.3 Rodar `npm run build` final e conferir que nenhuma regra CSS quebra os breakpoints
