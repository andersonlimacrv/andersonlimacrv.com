# Delta Spec: blog

## ADDED Requirements

### Requirement: Leia também em lista editorial
A página de post SHALL exibir "Leia também" (`t.relatedPosts`) como lista editorial numerada em coluna única — `ol` com divisórias de 1px (`divide-y divide-border`) apenas entre linhas, cada linha um `a.cursor-target` (`flex items-baseline gap-x-4 py-5`) com: índice mono `01/02/03` (`text-muted-foreground`), título (`font-sans text-lg sm:text-xl font-semibold`, hover `group-hover:text-primary`, `flex-1`), data (mono uppercase `hidden sm:block`) à direita, seta `→` com `transition-micro group-hover:translate-x-1` e TargetSimbol auxiliar (`md:hidden`). SHALL listar os 3 posts relacionados (`getRelatedPosts`) do locale. O aside SHALL manter `mt-14 border-t border-border pt-10` e o h2 eyebrow mono existentes. Sem cards, sem descrição, sem tags nas linhas.

#### Scenario: Lista numerada de 3 relacionadas
- **WHEN** a página de post é renderizada com ≥ 3 posts no locale
- **THEN** o aside contém um `ol` com 3 `li` numeradas `01`–`03`, títulos clicáveis (`a[href*="/blog/"]`), divisórias apenas entre linhas e nenhuma borda acima da primeira ou abaixo da última

#### Scenario: Sem relacionadas
- **WHEN** não há posts relacionados no locale
- **THEN** o aside não é renderizado (nada de "Leia também" vazio)

#### Scenario: Hover e alvo de toque
- **WHEN** qualquer linha é medida em desktop ou mobile
- **THEN** altura ≥ 44px, título muda para `text-primary` no hover e a seta desliza (`translate-x-1`) — sem regressão dos corners do TargetHover
