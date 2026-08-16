## 1. Port do controller para TS vanilla

- [x] 1.1 Criar `src/components/elastic-line.ts` no padrão de `theme-toggle.ts` (módulo standalone + `<script>` no componente), com spring, resistência ~2.2x e thresholds de grab/release
- [x] 1.2 Manter as **extremidades fixas em `midX`/`midY`** — a deformação ocorre apenas na região central
- [x] 1.3 Criar `src/components/ElasticLine.astro` (props via `class` Tailwind + `data-*` de config, `<svg>` + `<script>` sem lógica no Astro)
- [x] 1.4 Gate por `matchMedia('(pointer: coarse)')` — linha inerte em mão primária touch

## 2. Integração na landing

- [x] 2.1 Inserir 4 instâncias full-width na HomePage: hero|sobre, sobre|projetos, projetos|blog, blog|contato (`class="h-16 text-muted-foreground" strokeWidth={1} releaseThreshold={50}`)
- [x] 2.2 Confirmar deduplicação: um único `<script>` inline (~2.3 KB) para as 4 instâncias, JS total ~16 KB
- [x] 2.3 Remover os arquivos React antigos (`elastic-line.tsx`, `elastic-line-hooks/`) e dependências de `framer-motion` não utilizadas

## 3. Responsividade

- [x] 3.1 Implementar `applySize()` sincronizando `width`/`height` + `viewBox` e recentrando o controle
- [x] 3.2 Chamar `applySize()` no init e em cada callback do `ResizeObserver`
- [x] 3.3 Validar ao vivo resize 1280 → 390 → 768 e interação pós-resize

## 4. Validação

- [x] 4.1 `npm run check` sem erros
- [x] 4.2 `npm run build` verde (15 páginas)
- [x] 4.3 `npm run test:e2e` verde (23/23)
- [x] 4.4 Auditoria (`scripts/audit.mjs`): JS total ~16 KB, HTML +~4.9 KB, docs/audit* atualizados
- [x] 4.5 Validar traço/altura e deformação em viewports >1440px/1920px em monitor maior (confirmado pelo usuário)

## 5. Adequação à identidade visual (em aberto)

- [x] 5.1 Revisar a linha conforme o léxico de linhas 1px da change `visual-identity-lines` — já usa `strokeWidth={1}` e `text-muted-foreground` (token do léxico) ✓
- [x] 5.2 Harmonizar o divisor com o novo marcador de seção (linha reta `número ──── título`) — divisor e marcador compartilham a mesma gramática de 1px/`--border` ✓