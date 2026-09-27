# Tasks

## 1. Contact alignment

- [ ] 1.1 Shrink channel links (`justify-self-start max-w-full`) and verify corners hug only the link text
- [ ] 1.2 Fix copy buttons (`w-24 text-center`) and equalize subject pills (`flex-1` labels, full-width centered spans), and verify rows fill the container in pt/es/en

## 2. Tests and verification (após validação visual)

- [ ] 2.1 Extend `contact-section.spec.ts` (tight corners, equal copy buttons, full-width pills) and verify green
- [ ] 2.2 Run `astro check`, build, audits and the full e2e suite, and verify 100% pass
