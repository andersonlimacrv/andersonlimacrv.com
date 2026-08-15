## Context

Existe um protótipo React (`ElasticLine.tsx` + hooks) de uma linha que reage ao ponteiro com física elástica. O site é Astro SSG com zero JS por padrão e uma decisão clara de não usar React. Este change portou o comportamento para um controller vanilla (`elastic-line.ts`) e um componente `.astro` (`ElasticLine.astro`), integrado à landing como divisor entre seções.

## Goals / Non-Goals

**Goals:**
- Mesmo comportamento do protótipo: a linha deforma ao ser puxada pelo ponteiro e as **extremidades permanecem fixas** (em `midX`/`midY`), voltando ao estado reto com spring.
- Responsivo: a linha ocupa 100% da largura da seção e se redimensiona corretamente (incluindo `viewBox`) quando a viewport muda.
- Leve: sem bibliotecas, sem islands; um único script inline por página (deduplicado entre as 4 instâncias).
- Remoção trivial: apagar o uso no layout é suficiente.

**Non-Goals:**
- Animar em loop contínuo ou com `prefers-reduced-motion` (comportamento original não anima sozinho; nada a reduzir).
- Suporte a drag de conteúdo ou eventos de toque multi-ponto (apenas o primeiro ponteiro ativo).
- Ajuste fino da estética (traço/cor/personalidade) em telas maiores — fica **em aberto** até validação no monitor grande e definição da identidade visual (`visual-identity-lines`).

## Decisions

### 1. Controller vanilla em `src/components/elastic-line.ts`

Padrão de `theme-toggle.ts`: módulo standalone + `<script>` no componente. O controller recebe um elemento `<svg>`, detecta ponteiro por `pointerdown` (captura `setPointerCapture`), puxa os pontos de controle para a posição do cursor (resistência ~2.2x além do limite), e aplica o spring nos pontos da curva. Extremidades sempre fixas em `midX`/`midY` — a deformação só ocorre na região central, as pontas permanecem ancoradas. Thresholds de `grab`/`release` evitam toggling visual.

### 2. Responsividade via `applySize()`

Problema inicial: o `ResizeObserver` atualizava `width`/`height` mas o `viewBox` ficava defasado, quebrando a geometria após resize. Solução: função `applySize()` que sincroniza `width`, `height` e `viewBox` do `<svg>`, recentra a posição do controle e reseta a curva. Executada no init e em cada callback do observer.

### 3. Componente `ElasticLine.astro` com props via classe/data

O componente aceita `class` (Tailwind) para altura/linha (`h-16`, `text-muted-foreground`, `strokeWidth`) e `data-*` para config (`releaseThreshold`). Zero lógica no Astro; apenas o `<svg>` + `<script>` que instancia o controller. Se `matchMedia('(pointer: coarse)')` (touch) confirmar mão primária, a linha fica inerte (evita travar scroll).

### 4. No JS global — script inline deduplicado

As 4 instâncias importam o mesmo módulo; o bundler Astro deduplica num único `<script>` inline por página (~2.3 KB, JS total ~16 KB).

## Risks / Trade-offs

- [Deformação excessiva em telas muito largas] → validação aberta em monitor >1440px; limites de pull aplicam-se ao comprimento da linha, revisar se necessário.
- [`ResizeObserver` disparar em loop] → `applySize()` apenas re-sincroniza sem criar dependência circular; guard de idempotência no controller.
- [Pointer events em telas de toque] → gate por `pointer: coarse` mantém a linha inerte e preserva o scroll.
- [Protótipo React remanescente em git history] → sem arquivos React novos; o código antigo não é referenciado.

## Migration Plan

1. `elastic-line.ts` (controller) + `ElasticLine.astro` — port completo.
2. HomePage: 4 instâncias full-width entre as seções.
3. Remoção dos arquivos React (`elastic-line.tsx`, `hooks`).
4. Fix responsivo `applySize()` validado ao vivo (1280 → 390 → 768).
5. Validar: check 0 erros, build 15 páginas, e2e 23/23, auditoria JS total 16 KB. Rollback: git revert (mudanças localizadas).

---

## Aberto (validação pós-implementação)

- **Telas grandes**: conferir traço/altura (h-16) e deformação em viewports >1440px/1920px (a ser testado em monitor maior).
- **Identidade visual**: adequar a linha ao léxico de linhas 1px definido em `visual-identity-lines` (cor `border`, tracking, etc.).