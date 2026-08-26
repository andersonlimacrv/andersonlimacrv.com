## 1. Spec e Design

- [ ] 1.1 Criar `specs/trajectory/spec.md` com requisitos lista clean com badges (ul, li flex, badge localizado, sem summary/dot/yearRange).
- [ ] 1.2 Validar `proposal.md`/`design.md` contra `src/data/timeline.ts:41` e `src/styles/global.css:93` tokens.

## 2. i18n

- [ ] 2.1 Adicionar `aboutBadgeWork`/`aboutBadgeEducation` em `src/i18n/ui.ts:26` para `pt/es/en`.

## 3. Componente

- [ ] 3.1 Criar `src/components/sections/TrajectoryClean.astro` — merge `careerJourney` (kind work) + `education` (kind education), 10 rows, `Company / Role` + `badge` + `period` mono, `border-b border-border`, `font-mono` period, `transition-micro` hover.

## 4. Integração About

- [ ] 4.1 Substituir em `src/components/sections/About.astro:557-772` o bloco `TIMELINE — linha contínua` por `<TrajectoryClean locale={locale} timeline={timeline} />`; remover `CrossMark` import, `yearRange`, `careerGroups`, linha `w-px`.
- [ ] 4.2 Garantir `data-col="trajetoria"` e header `Trajetória 02` permanecem, sem `yearRange`.

## 5. Testes

- [ ] 5.1 Atualizar `e2e/about-section.spec.ts` — de 6 groups para 10 rows, validar badges `Trabalho`/`Formação` (pt) e `Work`/`Education` (en), sem `CrossMark`/`yearRange`, sem `summary`, sem overflow.
- [ ] 5.2 Regressão `e2e/target-hover-persistence.spec.ts` e `e2e/locale-layout.spec.ts` ainda verdes.

## 6. Validação Perf/SEO

- [ ] 6.1 `npm run check` 0 erros.
- [ ] 6.2 `npm run build` + `node scripts/audit.mjs` — comparar `total.raw/gzip`, `files`, `fonts` vs baseline `docs/audit-baseline.json`; atualizar `docs/perf-seo-checklist.md` se melhora.
- [ ] 6.3 Verificar acessibilidade: `ul aria-label`, `li` com `Company / Role`, `period` como `time` opcional, `SectionHeading aria-labelledby` intacto.
