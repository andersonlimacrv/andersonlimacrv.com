# Delta Spec: blog — lista editorial

## MODIFIED Requirements

### Requirement: Índice do blog
`/blog` (pt) e `/es/blog`/`/en/blog` SHALL listar posts publicados do respectivo idioma como **lista editorial de linhas** em coluna única, ordenados por `pubDate` decrescente. Cada linha SHALL ser um `<article>` com link `a.cursor-target` ocupando a linha inteira, com divisórias de 1px (`border-border`) **apenas entre linhas** (nada acima da primeira nem abaixo da última), com **título** (`font-sans`, semibold, `text-xl`/`sm:text-2xl`, hover `text-primary`) e **descrição** (`text-sm text-muted-foreground`, `line-clamp-2`) na coluna esquerda, e **data** (mono uppercase, `Intl` do locale) + **tags** (chips retangulares de cantos retos, mono uppercase) alinhados à direita a partir de `sm`. Paginação ou "carregar mais" a partir de ~10 posts permanece.

#### Scenario: Ordenação por data
- **WHEN** o índice `/blog` é renderizado
- **THEN** os posts aparecem do mais recente para o mais antigo por `pubDate`

#### Scenario: Índice filtrado por idioma
- **WHEN** o índice `/en/blog` é renderizado
- **THEN** apenas posts com `lang: en` aparecem, ordenados por data

#### Scenario: Linhas editoriais com divisórias
- **WHEN** o índice `/blog` é renderizado com N posts
- **THEN** existem N `<article>` em coluna única com N-1 divisórias de 1px entre eles e nenhuma borda acima da primeira ou abaixo da última linha

#### Scenario: Metadados à direita
- **WHEN** a viewport é ≥ 640px
- **THEN** cada linha exibe data (mono uppercase) e chips de tags em coluna própria alinhada à direita, sem enviesar o título/descrição (grid 2 colunas)

## ADDED Requirements

### Requirement: Vitrine da home — seção Escritos com header editorial
A seção `#blog` da home (`aria-labelledby` no `h2` da seção) SHALL exibir um **header editorial** no lugar do `SectionHeading` numerado: título grande ("Escritos"/"Writings", `text-h1 font-bold tracking-tight`) à esquerda e link localizado "ver todos os posts" (`a.cursor-target`, mono uppercase com tracking, sufixo seta `→`) alinhado à direita, apontando para `/blog` (ou `/{locale}/blog`). Abaixo, SHALL listar os 3 posts mais recentes do locale usando as mesmas linhas editoriais do índice (`PostCard`). Sem número de seção, sem eyebrow e sem linha régua nesse header.

#### Scenario: Header editorial
- **WHEN** a home é renderizada em qualquer locale
- **THEN** `#blog` contém um `h2` com o título grande à esquerda e um `a[href$="/blog"]` com classe `cursor-target` alinhado à direita no mesmo bloco de header, sem o par número+régua de `SectionHeading`

#### Scenario: Vitrine com 3 posts
- **WHEN** a home é renderizada
- **THEN** `#blog` contém exatamente 3 links para posts (`a[href*="/blog/"]`) como linhas editoriais, no idioma do locale

#### Scenario: Estado vazio
- **WHEN** não há posts publicados no locale
- **THEN** a seção exibe a mensagem "em breve" localizada (`blogComingSoon`) e mantém o link para o índice

### Requirement: Contratos de interação preservados
As linhas editoriais e o link "ver todos" SHALL preservar os contratos de interação do site: classe `cursor-target` (TargetHover anexa 4 corners em desktop), `min-h-11` para alvo de toque, `transition-micro` nos hovers, foco visível via `:focus-visible` e `prefers-reduced-motion` respeitado. Nenhum JS runtime novo SHALL ser adicionado.

#### Scenario: Corners do TargetHover
- **WHEN** a home ou `/blog` carrega em desktop (≥ 768px)
- **THEN** cada `article a.cursor-target` de post e o link "ver todos" recebem 4 `.target-hover-corner`

#### Scenario: Alvo de toque acessível
- **WHEN** qualquer link de post ou o link "ver todos" é medido
- **THEN** sua altura renderizada é ≥ 44px (`min-h-11`)
