# Tasks: target-simbol-spin

## 1. Componente

- [x] 1.1 Verificar bbox do SVG (medido no browser: centro exato 256,256 → `transform-origin: center` sem ajustes).
- [x] 1.2 `TargetSimbol.astro`: SVG inline (paths do reference), ~48px, wrapper `data-target-simbol` + `aria-hidden`, fills via CSS (ring `foreground 55%`, dot `--primary`), `will-change: transform`.
- [x] 1.3 `target-simbol.ts`: WAAPI spin (6 voltas/1s/`--ease-expo-out`), flag `spinning` ignora re-triggers, IO delegado (threshold 0.5) + `pointerenter`/`pointerdown`, reduced-motion skip completo, lifecycle `astro:page-load`/`after-swap` + WeakSet, hook `data-spins`.
- [x] 1.4 `Contact.astro`: mira `absolute bottom-3 right-4` no box do KineticGrid (`opacity-60 hover:opacity-100`).
- [x] 1.5 **Iterações do desenho (validadas pelo usuário)**: (a) reconstrução geométrica por análise de pixels da silhueta (0 difs em 65 linhas a 64×64); (b) VTracer polygonalizava os círculos — arcos circulares restaurados (`A`), anel entre raios 192.666/159.803 + 4 caps externos; (c) bug de caps E/W: arestas internas `L448 272`/`L64 240` faltantes → arcos partiam dos cantos externos (traços distorcidos) — corrigido; (d) traços laterais estendidos para dentro (retângulos aninhados `M97 240 L160 240 L160 272 L97 272 Z` + espelho E, raio ~96, perto do ponto); (e) spin dobrado 3 → 6 voltas (pedido do usuário). Path final ~360 B.

## 2. Testes

- [x] 2.1 `e2e/target-simbol.spec.ts` (7 testes): presença/tamanho 48px/contido no box; spin na entrada + re-entrada; hover; click; re-trigger ignorado e pós-spin; reduced-motion `data-spins` 0; tema (fills computed).
- [x] 2.2 `npm run check` 0 erros; suíte completa: 108 passed / 5 failed (pré-existentes).

## 3. Métricas

- [x] 3.1 Build + `audit.mjs` — delta registrado em `docs/audit-history.md` (~+7 KB raw / +2.8 KB gzip: SVG inline 3 páginas + módulo JS).
- [x] 3.2 Screenshots de validação: `simbol-circle-comparison.png`, `-dark/-light.png`, `-closeup.png`.