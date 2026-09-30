# Proposal: reveal-v2

## Why

A entrada atual (fade + 14px, 0,6s, por bloco) é sutil demais para uma home enxuta, não cobre todos os componentes e o stagger (`--reveal-delay`) nunca funcionou — a variável é escrita mas jamais lida no CSS. Esta change redefine a assinatura e leva o reveal a cada elemento, sem custo extra de performance.

## What Changes

- Assinatura: `translateY(14px→24px)`, `0,6s→0,7s`, expo-out; `transition-delay: var(--reveal-delay)` passa a valer; stagger automático por grupo (`data-reveal-group` + `nth-child`, 60ms/posição, teto 480ms).
- Cobertura por elemento: hero (4 itens), headings, fileiras perfil/trajetória, sociais, fileiras FlowingMenu, PostCards, canais/campos do contato, footer. Blocos viram grupos; motor (`reveal.ts`) intacto.
- Specs atualizados abertamente: `reveal.spec` (só abaixo-da-dobra nasce oculto), `locale-layout` (hero com entrada), novo teste de stagger.

## Capabilities

### New Capabilities

- `reveal-stagger`: entrada escalonada por elemento com grupos CSS, mesma performance do reveal atual.

### Modified Capabilities

- `motion`: assinatura do reveal (14px/0,6s → 24px/0,7s) e cobertura por elemento em vez de por bloco.

## Impact

- **Alterado**: `global.css` (assinatura + stagger), 10 componentes/páginas (só atributos + troca Reveal→div), `reveal.spec`, `locale-layout.spec`, `section-spacing.spec` (settles).
- **Performance**: 1 observer compartilhado, só `opacity`/`transform`, delays em CSS, zero JS novo; `prefers-reduced-motion` e no-JS intactos.
- **Risco**: FlowingMenu mede `offsetWidth` com itens ocultos (opacity preserva layout — seguro); EdgeReveal usa `translate` (não conflita com `transform` do reveal).

## Non-goals

- Não animar `width/height/blur`, scroll-jacking ou parallax.
- Não mudar View Transitions, temas ou reduced-motion.
