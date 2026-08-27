## 1. Fundação responsiva

- [x] 1.1 Criar utility `.container-site` em `global.css` (`mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8`) e aplicar em todas as páginas/seções
- [x] 1.2 Auditar `index.astro`, blog pages e componentes: remover classes desktop-first onde quebram mobile-first; garantir `min-w-0` em grids
- [x] 1.3 Garantir `scroll-margin-top` nas seções âncora (compensar header sticky)

## 2. Header e navegação mobile

- [x] 2.1 Implementar nav mobile com botão hambúrguer (`.site-menu-toggle`, touch ≥44px) + bloco `.site-menu` dentro da toolbox; abertura/fechamento com CSS transitions + Web Animations API (stagger); fecha por hambúrguer, `Escape`, clique fora, link e troca de idioma; desktop com nav inline (`≥768px`)
- [x] 2.2 Garantir touch targets ≥ 44px (`min-h-11`, padding adequado) em links/CTAs do header, hero, projetos e footer (hambúrguer `min-h-11 min-w-11`)

## 3. Grades e hero

- [x] 3.1 Índice do blog: grade `grid gap-6 sm:grid-cols-2 lg:grid-cols-3` (1→2→3 colunas)
- [x] 3.2 Destaque na home: mesma grade (1→2→3 ou 1→2 no tablet conforme espaço)
- [x] 3.3 Hero: empilhado (retrato abaixo do texto) no mobile, lado a lado em `md:`/`lg:`
- [x] 3.4 `line-clamp` controlado em títulos/resumos de PostCard para grades não quebrarem

## 4. Verificação em breakpoints

- [x] 4.1 Verificar em 320, 375, 768, 1024, 1440: zero overflow horizontal, grades corretas, header/nav utilizáveis
- [x] 4.2 Verificar touch targets e `:focus-visible` no mobile via DevTools de dispositivo
- [x] 4.3 Rodar `npm run build` final e conferir que nenhuma regra CSS quebra os breakpoints
