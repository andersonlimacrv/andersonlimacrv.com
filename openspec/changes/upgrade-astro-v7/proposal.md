## Why

O usuário pediu para sempre usar as últimas versões das dependências. O projeto está em Astro 5.18.2 + Tailwind 4.0.12, mas hoje existem Astro 7.2.1, Tailwind/@tailwindcss/vite 4.3.3 e TypeScript 7.0.2. O Astro 7 (Vite 8) também resolve o conflito de Vite que forçou pinar o Tailwind em 4.0.12.

## What Changes

- Atualiza `astro` → 7.2.1.
- Atualiza `tailwindcss` e `@tailwindcss/vite` → 4.3.3.
- Atualiza `@astrojs/sitemap` e `@astrojs/rss` para as últimas versões.
- Atualiza `@astrojs/check` e `typescript` para as últimas versões.
- Ajusta o que for quebrado pelos breaking changes do v7: `compressHTML` (novo default `'jsx'`), compilador Rust mais rígido (HTML bem formado), flags experimentais removidas (nenhuma em uso).
- Sem mudanças de comportamento ou de UI — apenas tooling/versions.

## Capabilities

### New Capabilities
<!-- nenhuma — mudança de tooling -->

### Modified Capabilities
<!-- nenhuma — sem mudança de requisito a nível de spec -->

## Impact

- `package.json`, `package-lock.json`.
- `astro.config.mjs` se algum ajuste de compatibilidade for necessário.
- Build validado com `astro check` e `npm run build` após o upgrade.