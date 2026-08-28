# Tasks: kinetic-grid-contact

## 1. Componentes

- [x] 1.1 Criar `src/components/ui/kinetic-grid.ts`: port vanilla da física (constantes CELL_SIZE 55, INFLUENCE_RADIUS 260, MAX_WARP 24, DOT_SPACING 28, LERP 0.08, ripples 400px/s · decay 1.2 · wave 55 · push 18, edge pin 1.5, nós 1.8→3.2, smoothstep, glow t>0.3); init/cleanup via eventos Astro; coords relativas ao box; DPR + ResizeObserver; pausa via IntersectionObserver; cores theme-aware com MutationObserver; reduced-motion estático (`data-static`); `data-ripple-count`.
- [x] 1.2 Criar `src/components/ui/KineticGrid.astro`: wrapper `relative overflow-hidden` com `data-kinetic-grid`, props `globalColor`/`class`, `<canvas aria-hidden>` absoluto + `<slot/>` (z-10) + `<script> import './kinetic-grid'`.

## 2. Integração

- [x] 2.1 Adicionar chave `contactGridHint` (pt/es/en) em `src/i18n/ui.ts`.
- [x] 2.2 `Contact.astro`: substituir `<div>teste o background aqui</div>` por box emoldurado (`border-border`, cantoneiras CrossMark, `h-60`) com KineticGrid + hint mono localizado.

## 3. Verificação

- [x] 3.1 `npm run check` sem erros.
- [x] 3.2 Criar `e2e/kinetic-grid.spec.ts`: canvas com bitmap > 0 e sem overflow; click incrementa `data-ripple-count`; reduced-motion desenha estático (`data-static`); View Transition Home→#contato→Home não duplica ripples por click; hint localizado por locale.
- [x] 3.3 `npm run test:e2e` — 96 passed / 5 failed; as 5 falhas são as mesmas pré-existentes no main (overflow horizontal em about/blueprint-morph/scroll-morph); os 7 testes do novo `kinetic-grid.spec.ts` passam.
- [x] 3.4 Inspeção visual: screenshots light/dark desktop e mobile do box com warp/ripple confirmados (warp, anel de ripple, glow, hint localizado).

## 4. Métricas e documentação

- [x] 4.1 `npm run build` + `node scripts/audit.mjs` → `docs/audit.md`/`audit-history.md`. Delta vs auditoria anterior: +7.4 KB raw / +2.6 KB gzip (JS do módulo + CSS do box).
- [x] 4.2 A11y: canvas `aria-hidden`, sem foco, reduced-motion respeitado, hint contraste AA.
