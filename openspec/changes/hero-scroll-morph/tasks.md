## 1. Controller vanilla

- [x] 1.1 Criar `src/components/scroll-morph.ts` no padrão de `elastic-line.ts`: calcula progresso `p ∈ [0,1]` entre hero e seção Sobre (via `getBoundingClientRect`), sincroniza com `requestAnimationFrame`, listener de `scroll` com `passive: true`, recálculo no `resize`
- [x] 1.2 Interpolar 16 vértices de `polygon()` entre retângulo (topo) e círculo (destino), aplicando `clip-path` e `transform` (scale + translate) apenas nessas propriedades
- [x] 1.3 Respeitar `prefers-reduced-motion: reduce` → estado final (`p=1`) imediato, sem listener ativo
- [x] 1.4 Parâmetros de destino (posição/raio do círculo) via `data-*` para ajuste fino sem tocar no controller

## 2. Componente Astro

- [x] 2.1 Criar `src/components/ScrollMorphPortrait.astro` autocontido: CSS escopado (`will-change: clip-path, transform` + `contain: paint`), `<img>` com `srcset`/`sizes`/`decoding="async"` e `<script>` que importa o controller
- [x] 2.2 Substituir o `<figure>`/`<Image>` do hero na HomePage pelo componente, preservando o layout visual do topo (retrato à direita, `fetchpriority="high"`)

## 3. Definição do destino do círculo (aberto)

- [x] 3.1 Definir visualmente posição/raio exatos do círculo na seção Sobre e ajustar via `data-*` (sem alterar o controller). Definido: `finalSize=160`, `finalX=0.15`, `finalY=0.5`, alvo `#sobre-content` com clamp para manter o círculo dentro da área de conteúdo em todas as telas.

## 4. Validação

- [x] 4.1 `npm run check` sem erros
- [x] 4.2 `npm run build` verde
- [x] 4.3 `npm run test:e2e` verde (23/23)
- [x] 4.4 Auditoria (`scripts/audit.mjs`) sem regressão de peso + inspeção visual do morph em dark/light e `prefers-reduced-motion`
- [x] 4.5 Conferir que nenhuma propriedade de layout é animada no scroll (DevTools / revisão do controller)