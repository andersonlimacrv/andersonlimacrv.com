# Tasks: kinetic-grid-contact

## 1. Componentes

- [x] 1.1 Criar `src/components/ui/kinetic-grid.ts`: port vanilla da física (constantes CELL_SIZE 55, INFLUENCE_RADIUS 260, MAX_WARP 24, DOT_SPACING 28, LERP 0.08, ripples 400px/s · decay 1.2 · wave 55 · push 18, edge pin 1.5, nós 1.8→3.2, smoothstep, glow t>0.3); init/cleanup via eventos Astro; coords relativas ao box; DPR + ResizeObserver; pausa via IntersectionObserver; cores theme-aware com MutationObserver; reduced-motion estático (`data-static`); `data-ripple-count`.
- [x] 1.2 Criar `src/components/ui/KineticGrid.astro`: wrapper `relative overflow-hidden` com `data-kinetic-grid`, props `globalColor`/`class`, `<canvas aria-hidden>` absoluto + `<slot/>` (z-10) + `<script> import './kinetic-grid'`.
- [x] 1.3 Snap-on-enter: `snapIfNeeded()` no `pointermove` — `mouse` interno salta ao ponteiro quando está no sentinela off-screen ou a > 2× `INFLUENCE_RADIUS` (primeira entrada/reentrada), eliminando os ~0,7–1s de efeito morto do lerp vindo de -9999; lerp preservado durante o movimento.
- [x] 1.4 Fade-out no lugar: estado `strength` (0..1) multiplica warp/proximidade; `pointerenter` seta 1 instantâneo, `pointerleave` decai 0.12/frame (~0,5s) sem mais enviar target ao sentinela -9999 (que fazia o efeito morrer em 1–2 frames e deslizar para o canto). Bônus: com `strength` 0 e sem ripples o draw é pulado (idle).
- [x] 1.5 Repaint na troca de tema em idle: `revalidateColors()` agora redesenha estados `idle`/`static` com as novas cores — antes o canvas exibia o último frame do tema antigo (grid invisível ao alternar tema com o mouse fora do box).

## 2. Integração

- [x] 2.1 Adicionar chave `contactGridHint` (pt/es/en) em `src/i18n/ui.ts`.
- [x] 2.2 `Contact.astro`: substituir `<div>teste o background aqui</div>` por box emoldurado (`border-border`, cantoneiras CrossMark, `h-60`) com KineticGrid + hint mono localizado.

## 3. Verificação

- [x] 3.1 `npm run check` sem erros.
- [x] 3.2 Criar `e2e/kinetic-grid.spec.ts`: canvas com bitmap > 0 e sem overflow; click incrementa `data-ripple-count`; reduced-motion desenha estático (`data-static`); View Transition Home→#contato→Home não duplica ripples por click; hint localizado por locale.
- [x] 3.3 `npm run test:e2e` — 96 passed / 5 failed; as 5 falhas são as mesmas pré-existentes no main (overflow horizontal em about/blueprint-morph/scroll-morph); os 7 testes do novo `kinetic-grid.spec.ts` passam.
- [x] 3.4 Inspeção visual: screenshots light/dark desktop e mobile do box com warp/ripple confirmados (warp, anel de ripple, glow, hint localizado).

## 4. Métricas e documentação

- [x] 4.1 `npm run build` + `node scripts/audit.mjs` → `docs/audit.md`/`audit-history.md`. Delta vs auditoria anterior: +7.4 KB raw / +2.6 KB gzip (JS do módulo + CSS do box). Snap-on-enter (1.3): +0.2 KB raw / +0.1 KB gzip.
- [x] 4.2 A11y: canvas `aria-hidden`, sem foco, reduced-motion respeitado, hint contraste AA.
