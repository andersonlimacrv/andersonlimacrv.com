## 1. Tokens monocromáticos

- [x] 1.1 Substituir `--primary` e `--secondary` em `src/styles/global.css:16-17` por valores neutros (claro: `0 0% 8%` / `0 0% 45%`)
- [x] 1.2 Adicionar `--primary`/`--secondary` neutros aos blocos `[data-theme='dark']` e `@media (prefers-color-scheme: dark)` (escuro: `0 0% 96%` / `0 0% 65%`)
- [x] 1.3 Trocar os radial-gradients de `.grid-bg::before` por `hsl(var(--foreground) / 0.06)` neutro
- [x] 1.4 Confirmar que não restam himes de cor nos usos de `--primary`/`--secondary` (SectionHeading, ProjectLink, PostCard, Header, links do post-content)

## 2. ThemeToggle no header

- [x] 2.1 Criar `src/components/ThemeToggle.astro` (botão com ícones line sol/lua, aria-label dinâmico, focus-visible herdado)
- [x] 2.2 Script local: ler `data-theme` do `<html>`, alternar e persistir em `localStorage['theme']` com try/catch
- [x] 2.3 Inserir `ThemeToggle` no `Header.astro` com `data-astro-transition-persist` para manter estado entre navegações
- [x] 2.4 Checar acessibilidade e estados visuais (hover/focus/selection) em light e dark

## 3. Validação

- [x] 3.1 Executar `npm run build` sem erros
- [x] 3.2 Executar `npx astro check` sem erros de tipo (0 errors, 0 warnings)
- [x] 3.3 Confirmar manualmente o toggle na home: alternância sem FOUC, persistência após reload e fallback para `prefers-color-scheme`