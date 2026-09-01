# Tasks: standardize-typography-scale

## 1. Tokens e componente

- [ ] 1.1 `global.css` `@theme`: `--text-eyebrow`, `--text-micro`, `--tracking-caps`, `--tracking-caps-wide`.
- [ ] 1.2 `ui/Text.astro`: `as` + `size: eyebrow | micro | lead` + `class`; composição mono/uppercase/tracking por variante.

## 2. Refactors e substituições

- [ ] 2.1 `Subtitle.astro`: consumir Text (xs→micro, sm→eyebrow; tracking 0.18/0.2→caps); API mantida.
- [ ] 2.2 `Eyebrow.astro`: badge consome Text eyebrow (text-xs + 0.18em → token); API mantida.
- [ ] 2.3 `About.astro`: rótulos text-[8px]/[9px]/[10px] → Text (micro/eyebrow).
- [ ] 2.4 `TrajectoryClean.astro`: período text-[10px] sm:text-xs → Text eyebrow.
- [ ] 2.5 `Contact.astro` + hint da mira: text-[0.6875rem] → Text eyebrow.
- [ ] 2.6 Blog: `PostLayout.astro` (data/tempo de leitura) + `PostCard.astro` (data) → Text eyebrow.

## 3. Gate visual (USUÁRIO)

- [ ] 3.1 Build + preview — validação visual: dark/light × mobile/desktop × home/about/blog/post.

## 4. Testes e métricas (após o gate)

- [ ] 4.1 e2e: bounds de clamp (390/1280) em elementos representativos + paridade pt/es/en.
- [ ] 4.2 Suíte completa (112 ✓ / 5 pré-existentes) + audit/css-audit.
- [ ] 4.3 Commit (mediante pedido do usuário).