## Context

Hoje os dados factuais estão dispersos: `src/lib/site.ts` (siteUrl/siteName/authorName/socialLinks), `src/data/profile.ts` (contém `hero.contact` com e-mail **conflitante** — `andersonlimacrv@gmail.com` vs `contato@andersonlimacrv.com` em `site.ts`), `src/data/projects.ts` (repete título/url/tags por idioma) e `src/i18n/ui.ts` (contém dados factuais: `sections[].number`, `heroEyebrow`, títulos de projeto). "Anderson Carvalho" está hardcoded em 8+ lugares (Hero, Footer, About, PostLayout, HomePage JSON-LD, rss.ts, ui.ts).

O site é Astro 7 + Tailwind v4, i18n com `prefixDefaultLocale: false` (pt na raiz, es/en em subpastas), View Transitions ativas via `ClientRouter`. Ver proposal.md para motivação.

## Goals / Non-Goals

**Goals:**
- Uma única fonte de dados factuais em `src/data/site.ts`, tipada e sem duplicação.
- `profile.ts` sem contato; `projects.ts` sem repetição por idioma; `ui.ts` apenas tradução.
- Correção de navegação: hash preservado na troca de idioma e scroll suave para âncora na página atual.

**Non-Goals:**
- Não migrar `src/content/blog/**` (continua em content collections).
- Não alterar URLs públicas nem `astro.config.mjs`.
- Não mudar comportamento visual/estético.
- Não adicionar dependências.

## Decisions

### 1. Novo `src/data/site.ts` como fonte única
Consolida `siteUrl`, `siteName`, `authorName`, `socialLinks` do antigo `src/lib/site.ts` **mais** os dados factuais hoje em `ui.ts`:
- `sections: { about: '01', projects: '02', blog: '03', contact: '04' }`
- `heroEyebrowYear: '2026'`
- `phone: '53981004874'` e `whatsapp` derivado: `https://wa.me/55${phone}`.

Estrutura tipada via `export const site = { ... } as const` + `export type Site = typeof site`. Emite um único objeto (fácil de auditar), em vez de vários exports soltos.
_Alternativa considerada_: manter `lib/site.ts` e criar `data/site.ts` — descartada por duplicar identidade; a decisão do usuário foi mover tudo para `/data`.

### 2. Deleção de `src/lib/site.ts`
Todos os imports (`socialLinks`, `siteUrl`, `siteName`, `authorName`) passam a vir de `src/data/site`. `grep` localiza todos os usos; atualização em lote via edição direta.

### 3. `profile.ts` remove `hero.contact`
Telefone/e-mail/LinkedIn passam a vir de `site.socialLinks`. `hero.name` passa a `site.name` (importado), mantendo a interface `ProfileHero.name` para compatibilidade de consumo (Hero.astro, JSON-LD), mas o valor deriva de `site`.
_Alternativa_: remover `name` do profile e usar `site.name` direto — descartada para não espalhar mudanças nos componentes; o profile referencia `site.name`.

### 4. `projects.ts` fonte não-localizada
Nova estrutura:
```ts
const projectFacts = [
  { title: 'andersonlimacrv.com', url: site.url, tags: ['Astro', 'Tailwind'] },
  { title: 'GitHub', url: site.socialLinks.github, tags: ['Open Source'] },
  { title: 'LinkedIn', url: site.socialLinks.linkedin, tags: ['Perfil'] },
];
export function getProjects(locale: Locale): Project[] // compõe com ui[locale].projects[].description
```
`ui.ts` mantém apenas `projects: [{ description }, ...]` por idioma.

### 5. `ui.ts` apenas tradução
- Remove `sections[].number` e `heroEyebrow` com ano.
- `heroEyebrow` vira rótulo puro (`Perfil`/`Perfil`/`Profile`); Hero.astro compõe `` `${t.heroEyebrow} / ${site.heroEyebrowYear}` ``.
- Novo `relatedPosts` ("Leia também"/"También lee"/"Also read").
- Meta titles: manter template por idioma mas **sem nome hardcoded** — componente/helper compõe `` `${site.name} — ${suffix}` ``. Onde o title já era "Anderson Carvalho — X", vira uma função `pageTitle(locale, suffix)` ou composição inline.
  _Alternativa_: manter string completa no `ui.ts` (contém nome) — descartada pois recria a duplicação do nome.

### 6. Correção de âncoras
- **`language-switcher.ts`**: ao montar o href destino, anexar `location.hash` (`/es/#contato` → `/pt/#contato`). A comparação atual (`pathname + search`) ignora hash — manter.
- **`site-header.ts`**: interceptar clique em link de âncora (`href` começa com `#` ou contém `#` e o pathname bate com o atual): `scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })` + `history.replaceState(null, '', '#x')`, sem deixar o `ClientRouter` navegar (preventDefault quando já na mesma página).
  _Alternativa_: deixar o Astro ClientRouter navegar sempre — descartada por causar transição de página desnecessária em âncora na própria página.

## Risks / Trade-offs

- **Quebra de imports ao deletar `lib/site.ts`** → `grep -r "lib/site"` cobre todos os usos; `astro check` valida antes do commit.
- **Composição de meta title pode divergir do esperado em SEO** → manter exatamente o mesmo texto final (ex.: "Anderson Carvalho — Desenvolvedor"); e2e/SEO já cobre `title` e `description`.
- **Mudança no switch de idioma pode afetar o e2e existente** (`fix-locale-switch-effects`) → rodar suíte completa; novos testes cobrem o hash.
- **`site.phone` e `whatsapp` podem divergir** → derivar `whatsapp` de `phone` (fonte única), nunca hardcode dos dois.
