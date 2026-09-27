# Proposal: hero-profile-polish

## Why

Dois refinamentos visuais antes do commit: os CTAs do hero têm larguras diferentes no desktop (cada um do tamanho do próprio texto) e a coluna de dados do perfil não tem separação entre as fileiras, quebrando o ritmo que a trajetória já possui.

## What Changes

- Hero: os dois CTAs passam de `sm:w-auto` para `sm:flex-1` (metades iguais preenchendo a linha); secundário ("Fale comigo") com contraste `foreground` (`text-foreground`, `border-foreground/30`, `hover:border-foreground`).
- Contato: link "Mensagem direta" com o mesmo contraste `foreground`.
- Perfil: valores de `text-muted-foreground` para `text-foreground` (conteúdo primário, igual à trajetória); labels seguem `muted/60`.
- Perfil (`About.astro`, todas as 7 fileiras uniformemente): `py-2` → `py-3` + EdgeReveal decorativo por fileira, **com divisórias entre fileiras** (mantidas).
- Estrutura clean do Sobre e Contato (validação visual por screenshot): removidos o `border-b` do header "01", o `divide-x` vertical do Sobre, todo o `divide` entre colunas do Contato (desktop e mobile) e o `border-t` da trajetória — separação só por espaçamento; `divide-y` mobile do Sobre mantido.
- E2E: `hero-ctas.spec.ts` (larguras iguais) + `about-edge.spec.ts` (reveal/divisórias do perfil).

## Capabilities

### New Capabilities

- `hero-profile-polish`: CTAs iguais no hero e fileiras do perfil com divisórias + EdgeReveal, mantendo tipografia, temas e reduced-motion.

### Modified Capabilities

Nenhuma.

## Impact

- **Alterado**: `Hero.astro` (2 classes), `About.astro` (7 fileiras), 2 specs e2e.
- **Performance**: zero JS/CSS novo (só utilitários existentes + padrão global).
- **Risco**: fileiras do perfil ficam mais altas (`py-3` + bordas) — valida-se visualmente e no e2e de overflow.

## Non-goals

- Não mudar textos, hrefs, cores ou hierarquia tipográfica.
- Não tocar em trajetória, sociais, Projetos ou lab.
