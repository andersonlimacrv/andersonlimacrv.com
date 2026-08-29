# Proposal: target-simbol-spin

## Why

O site não tem um indicador visual de "link/coisa interativa" no mobile — o TargetHover (corners) é exclusivo de hover (desktop). A referência `references/target-simbol.svg` (mira: círculo + 4 traços cardeais + ponto central) vira um componente decorativo com spin estilo roleta de revólver (começa rápido, desacelera e para), dando feedback de interação também no toque.

## What Changes

- Novo componente `TargetSimbol.astro` (SVG inline otimizado da mira, ~48px, sempre visível) + módulo vanilla `target-simbol.ts`.
- Spin ~1s, 3 voltas, `--ease-expo-out`, via **Web Animations API** (transform no compositor; zero rAF/zero reflow). Re-triggers ignorados durante o spin.
- Triggers: entrada na viewport (`IntersectionObserver`, threshold 0.5 — re-entrada gira de novo), `pointerenter` (hover) e `pointerdown` (click/tap — feedback de link no mobile).
- `prefers-reduced-motion`: estático, sem animação nem observers.
- Cores do tema: anel/traços em `foreground` 55% (color-mix), ponto em `--primary` (replace dos fills fixos #fff/#CCC).
- Integração: canto inferior direito do box do KineticGrid na seção contato (bottom-right, oposta ao hint), complementar ao TargetHover.
- Debug hook `data-spins` para e2e.

## Capabilities

### New Capabilities

- `target-simbol`: mira decorativa com spin roleta (viewport/hover/click), tema-aware, reduced-motion estático, custo de animação no compositor.

### Modified Capabilities

Nenhuma.

## Impact

- **Código novo**: `src/components/ui/TargetSimbol.astro`, `src/components/ui/target-simbol.ts`.
- **Código alterado**: `src/components/sections/Contact.astro` (mira no box do KineticGrid).
- **Testes**: novo `e2e/target-simbol.spec.ts` (7 testes); specs existentes sem alteração de seletores.
- **Métricas**: +~3–4 KB raw no HTML (SVG inline da home) + módulo JS ~1–2 KB gzip.

## Non-goals

- Não usar a mira como marcador por link (escopo aprovado: standalone decorativo).
- Não substituir o TargetHover (corners continuam; mira é complemento).
- Não adicionar dependências; nenhum rAF manual; sem polimento de path do VTracer além do necessário.