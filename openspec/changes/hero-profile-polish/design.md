# Design

## Context

Ver `proposal.md`. Hero em `Hero.astro` (CTAs `sm:w-auto`); perfil em `About.astro` (fileiras `<div class="py-2">` com `{TYPE.label}` + `{TYPE.body}`); padrão EdgeReveal global em `src/styles/edge-reveal.css` + `src/lib/edge-reveal.ts`.

## Goals / Non-Goals

**Goals:** classes utilitárias existentes; mesmo motor sem JS novo.

**Non-Goals:** qualquer mudança de conteúdo, cor, tipo ou comportamento.

## Decisions

Auditoria tipográfica (inventário + `git log`): tamanho já é padrão (todo corpo é `body`); a divergência do perfil era **cor** — único conteúdo primário em muted (deriva do commit `8dc89dc`, pré-registro total). Trajetória/canais/títulos usam `foreground` no primário.

1. **`sm:flex-1` nos dois CTAs** — metades iguais por flexbox (sem largura fixa, sem breakpoint novo); `w-full` mobile e `min-h-11` intactos. Alternativa (min-width fixo) rejeitada: quebra com textos localizados longos.
2. **Fileiras com divisórias + `py-3`** — `border-b` estilo trajetória (mantidas após revisão: as setas miravam as linhas estruturais, não as das fileiras); `py-3` como meio-termo; `last:` resolve fileiras condicionais automaticamente.
3. **Estrutura clean** — fora o `border-b` do header "01", o `lg:divide-x` do Sobre, todo o `divide` entre colunas do Contato (desktop e mobile) e o `border-t` da trajetória; `divide-y` mobile do Sobre preservado.
3. **EdgeReveal decorativo por fileira** — `data-edge-reveal` na div, `.edge-ink` no label e no `<p>`, layer ao final; sem `tabindex` (idêntico à decisão da trajetória). Linhas com `{TYPE.` mantêm o audit isento.

## Risks / Trade-offs

- [Risco] Coluna do perfil mais alta empurra a trajetória para baixo → Mitigação: e2e de overflow + validação visual; conteúdo inalterado.
- Trade-off: nenhum custo novo (CSS/JS já carregados globalmente).

## Migration Plan

1. `Hero.astro` (2 classes) → e2e de larguras.
2. `About.astro` (7 fileiras) → e2e de reveal/divisórias.
3. Full suite. Rollback por arquivo.
