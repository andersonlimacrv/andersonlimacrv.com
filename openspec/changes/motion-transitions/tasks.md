## 1. Fundação CSS de animação

- [ ] 1.1 Adicionar em `global.css`: classes `.reveal` (opacity 0 + translateY 12px) e `.reveal.is-visible` (visível com `transition: opacity 400ms, transform 400ms; cubic-bezier(0.16,1,0.3,1)`), suporte a `--reveal-delay`
- [ ] 1.2 Embrulhar todas as regras de animação em `@media (prefers-reduced-motion: no-preference)`; fora dela, elementos visíveis por padrão
- [ ] 1.3 Adicionar micro-interações (hover/focus) nos componentes existentes apenas com transform/opacity, 150–250ms

## 2. Scroll-reveal via IntersectionObserver

- [ ] 2.1 Criar `src/components/Reveal.astro` (wraps conteúdo, aplica `data-reveal`, com `client:visible` no uso)
- [ ] 2.2 Implementar script inline: adiciona class `js-enabled` no `<html>`; checa `prefers-reduced-motion` (matchMedia) e adiciona `is-visible` imediatamente se reduzido; senão IntersectionObserver adiciona `is-visible` com `requestAnimationFrame`
- [ ] 2.3 Aplicar `Reveal` em seções da home e cards do blog (sem esconder conteúdo se JS falhar)

## 3. View Transitions

- [ ] 3.1 Adicionar `<ViewTransitions />` no `BaseLayout` (head) com `transition:persist` no header/nav
- [ ] 3.2 Definir animações de transição custom (fade suave) no `global.css` ou `data-astro-transition` scope
- [ ] 3.3 Validar navegação home ↔ blog ↔ post com transição ativa no `npm run dev`

## 4. Hero e sequência editorial

- [ ] 4.1 Adicionar fade-in do hero (keyframes: fade + translateY, delays escalonados para eyebrow → nome → parágrafo → retrato), dentro de `prefers-reduced-motion: no-preference`
- [ ] 4.2 Validar: com reduced-motion ativo, todas as transições são instantâneas (sem elementos invisíveis)

## 5. Validação

- [ ] 5.1 `npm run build` sem erros; conferir JS total da página pequeno (apenas island reveal + transitions)
- [ ] 5.2 Testar com DevTools emulando `prefers-reduced-motion: reduce` e JS desabilitado — conteúdo sempre visível
