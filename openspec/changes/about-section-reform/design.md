## Context

A reforma da seção Sobre foi redefinida pelo usuário: em vez de colunas que empilham no mobile, **duas colunas fixas** (desktop e mobile). O usuário editou `About.astro` manualmente e o arquivo quebrou a compilação; o pedido é corrigir o arquivo atual, rodar para visualizar e adequar o código ao spec. `container-site` continua em 1024px; `#sobre-content` continua fora de `[data-reveal]`. O alvo do morph muda de `#sobre-content` para o box do retrato `#sobre-portrait`, com `finalX=0`/`finalY=0`.

## Goals / Non-Goals

**Goals:**
- Duas colunas fixas (grid `0.92fr / 1.08fr`) em desktop E mobile — no mobile reduzem padding/larguras, nunca empilham.
- Coluna 01: retrato (`#sobre-portrait`) + informações (Nome/Role/Stack/Location) **ao lado da foto, nunca abaixo**; frase, bio e social/contato em seguida.
- Coluna 02: timeline vertical contínua com anos como pontos fixos e barra de duração proporcional; header com intervalo real dos dados.
- Morph do retrato com diâmetro final responsivo (`--morph-final-size`), alvo `#sobre-portrait`.
- Dados em `src/data/profile.ts` (fonte única, pt); rótulos localizados.

**Non-Goals:**
- Empilhar colunas no mobile.
- Alterar outras seções, design system, `TargetHover.astro`.

## Decisions

### 1. Diagrama das duas colunas

```
┌─ § Sobre ─────────────────────────────────────────────────────────┐
│  ┌───────────────────────┬─────────────────────────────────────  │
│  │ COL 01 — PERFIL    01 │ COL 02 — TRAJETÓRIA   2007—2027      │
│  │ ──────────────────────│─────────────────────────────────────  │
│  │ ┌────┐ ┌────────────┐ │  2026 ● Pós-graduação IA/ML          │
│  │ │ FOTO│ │ Nome       │ │        Universidade Católica de     │
│  │ │ (BP)│ │ Role       │ │        maio 2026 — maio 2027        │
│  │ │     │ │ Stack princ│ │        Especialização em IA e ML…   │
│  │ │     │ │ Localização│ │  2022 ● Software Developer (CESS)   │
│  │ └────┘ └────────────┘ │  2007 ● Curso Técnico (IFSUL) …      │
│  │ “Frase em serif”      │  início — trajetória — atual         │
│  │ Sobre mim (bio)       │  AC / ABOUT / 01                     │
│  │ [GitHub][LinkedIn][Email] │                                  │
│  │ +55 53 98100-4874     │                                      │
│  └───────────────────────┴─────────────────────────────────────  │
└───────────────────────────────────────────────────────────────────┘
```

### 2. Grid fixo e responsividade
`#sobre-content > div` = `grid grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] divide-x divide-border border-t border-border`. As colunas NUNCA empilham: no mobile a largura relativa é mantida (0.92/1.08) e o `gap` vem do padding das colunas (`pr-3`/`pl-3` → `sm:pr-6/pl-6` → `lg:pr-10/pl-10`). Cada coluna tem `min-w-0` para permitir encolher sem overflow.

### 3. Coluna 01 — Perfil
Label mono "Perfil" + `01` (border-b). Depois `grid grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] items-start gap-3 sm:gap-5`:
- FOTO: `#sobre-portrait` (`relative aspect-square min-w-0`) com `BlueprintMorphEnd src finalSize=160 finalX=0 finalY=0` — é o alvo do morph.
- INFORMAÇÕES (`dl`, 4 itens `space-y-4 sm:space-y-5`): Nome (`hero.name`), Role (`hero.title`), Stack principal (`hero.mainStack`), Localização (`hero.location`); `dt` mono minúsculo + `dd`.
Depois, separados por `border-t`: **frase** (`blockquote` serif itálico + `<cite>` `authorName`), **"Sobre mim"** (`aboutBio` 2 parágrafos + marcação `01/02`), **social/contato** (footer: 3 links `cursor-target` GitHub/LinkedIn/Email + `+55` formatado de `hero.contact.phone` + `hero.location`).

### 4. Coluna 02 — Trajetória
Header (border-b): label "Trajetória" + `yearRange` (`min`/`max` dos anos dos períodos; `presente` → ano corrente). Timeline: `div.relative` com linha `span.w-px` vertical contínua em `left-[2.9rem]` (`sm:left-[3.75rem]`); `ol[aria-label]` com 7 `li` (`grid grid-cols-[3.2rem_minmax(0,1fr)]`): coluna do **ano** (mono, `text-right`, ponto fixo) + **marcador** na linha (quadrado `border-foreground` + centro preenchido), coluna da experiência com `h3` cargo, `p` empresa, `p` período (mono uppercase) e `p` **summary** de 1 linha. Fim: marcação temporal `yearStart — trajetória — atual` e marcação `AC / ABOUT / 01`.

### 5. Morph alinhado ao retrato + tamanho responsivo
- Alvo muda para `#sobre-portrait` (`Hero.astro`: `ScrollMorphPortrait target="#sobre-portrait" finalX=0 finalY=0`; `BlueprintMorphBoard finalX=0 finalY=0`; `About.astro` `BlueprintMorphEnd finalX=0 finalY=0`).
- `--morph-final-size` no `:root` (global.css): 64px base, 104px ≥640, 128px ≥768, 160px ≥1024 (media queries aninhadas no `:root`, padrão já usado em `.container-site`).
- `scroll-morph.ts`: `readFinalSize(el)` lê a var (fallback `data-final-size`); recomputa em `measure()` no resize.
- `BlueprintMorphEnd.astro`: `resolvedSize = var(--morph-final-size, {finalSize}px)`; clamp via `calc` com a var.
- `BlueprintMorphBoard.astro`/`BlueprintMorphStart.astro`: `--bp-final-size: var(--morph-final-size, ...)`; legenda do board usa spans `data-bp` (df/r/af/c) preenchidos por `morph-measure.ts` (que lê `--morph-final-size` via `finalSizeOf`).
- Rótulos de cota do ghost escalam com o diâmetro: `--bp-scale` (adimensional, `finalSize/160`, definido por `morph-measure.ts`) multiplica font-size e offsets.

### 6. Telefone
`phoneRaw = '53981004874'` → display `+55 {slice(0,2)} {slice(2,7)}-{slice(7)}` = `+55 53 98100-4874`.

### 7. Intervalo real da trajetória
`yearRange = min(início) — max(fim)` dos períodos de `careerJourney`; "presente" = ano corrente. Com os dados atuais: **2007—2027** (IFSUL 2007 → Pós-graduação termina maio/2027).

## Risks / Trade-offs

- [Rótulos de cota não cabem no ghost 64px (mobile)] → `--bp-scale` escala tipografia/offsets proporcionalmente; testes usam a mesma escala.
- [Coluna 01 estreita no mobile pode espremer a dl] → `minmax(0,0.95fr)`/`minmax(0,1.05fr)` + fontes reduzidas (`text-[7px]`→`sm:text-[9px]` etc.) garantem legibilidade sem overflow.
- [Peso HTML varia] → auditoria revalida na Fase D; `summary` é campo novo no `profile.ts`.
- [Conteúdo factual em pt para en/es] → dados factuais em pt por decisão do usuário; rótulos localizados.
