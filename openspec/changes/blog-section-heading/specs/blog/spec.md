# Delta Spec: blog

## MODIFIED Requirements

### Requirement: Vitrine da home — seção Escritos com SectionHeading numerado
A seção `#blog` da home SHALL usar `SectionHeading` numerado com `number=03` (`site.sections.blog`), `title=Blog` (`t.sections.blog.title`), `eyebrow=Escritos`/`Writings` (`t.sections.blog.eyebrow`), `id="blog"` e `aria-labelledby="blog-title"`. O heading SHALL conter `KineticGrid` `h-50` com conteúdo centralizado (`flex h-full items-center justify-center`), coluna `flex flex-col items-center` com eyebrow acima do número (`w-full text-center font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground`) tendo a mesma largura da palavra do número (`font-mono text-[120px] font-semibold leading-none`), régua flexível e título `[Blog]` (`text-h1 font-bold uppercase`). O slot SHALL listar os 3 posts mais recentes do locale usando as linhas editoriais do índice (`PostCard`, `divide-y divide-border`). O link localizado "ver todos os posts" SHALL estar após a lista, no canto inferior esquerdo (`mt-8`), como `a.cursor-target` mono uppercase (`text-xs tracking-[0.16em] text-muted-foreground hover:text-foreground`, `min-h-11`, sufixo `→` com `group-hover:translate-x-1`), apontando para `/blog` (ou `/{locale}/blog`).

#### Scenario: Heading numerado com eyebrow acima do número
- **WHEN** a home é renderizada em qualquer locale
- **THEN** `#blog` contém um heading com número `03`, régua, título `[Blog]` e `data-kinetic-grid`; o eyebrow (`Escritos`/`Writings`) está em `<p class="w-full text-center">` acima do `<span>` do número dentro de `div.flex.flex-col`, com largura visual igual à da palavra do número

#### Scenario: Vitrine com 3 posts
- **WHEN** a home é renderizada
- **THEN** `#blog` contém exatamente 3 links `a[href*="/blog/"]` como linhas editoriais, no idioma do locale

#### Scenario: Link "ver todos" no canto inferior esquerdo
- **WHEN** a home é renderizada em qualquer locale
- **THEN** `#blog` contém um `a[href$="/blog"]` com `cursor-target` e texto "Ver todos os posts"/"View all posts" localizado, posicionado após a lista com margem superior e alinhado à esquerda

#### Scenario: Estado vazio
- **WHEN** não há posts publicados no locale
- **THEN** a seção exibe a mensagem "em breve" localizada (`blogComingSoon`) e mantém o link para o índice

### Requirement: Contratos de interação preservados
As linhas editoriais e o link "ver todos" SHALL preservar os contratos de interação do site: classe `cursor-target` (TargetHover anexa 4 corners em desktop), `min-h-11` para alvo de toque, `transition-micro` nos hovers, foco visível via `:focus-visible` e `prefers-reduced-motion` respeitado. O heading SHALL respeitar `prefers-reduced-motion` via `KineticGrid` estático quando configurado. Nenhum JS runtime novo SHALL ser adicionado.

#### Scenario: Corners do TargetHover
- **WHEN** a home carrega em desktop (≥ 768px)
- **THEN** cada `article a.cursor-target` de post e o link "ver todos" recebem 4 `.target-hover-corner`

#### Scenario: Alvo de toque acessível
- **WHEN** qualquer link de post ou o link "ver todos" é medido
- **THEN** sua altura renderizada é ≥ 44px (`min-h-11`)

## ADDED Requirements

### Requirement: Índice do blog preservado
O índice `/blog` SHALL manter o comportamento existente: lista editorial em coluna única com N linhas e N-1 divisórias, ordenada por `pubDate` decrescente, filtrada por locale, com metadados à direita. Sem alteração.

#### Scenario: Índice filtrado por idioma
- **WHEN** `/en/blog` é renderizado
- **THEN** apenas posts `lang: en` aparecem
