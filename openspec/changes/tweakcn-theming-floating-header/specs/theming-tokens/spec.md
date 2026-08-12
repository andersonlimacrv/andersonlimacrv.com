## Purpose

Define o schema de design tokens do site compatível com tweakcn/shadcn, permitindo trocar o tema colando CSS gerado externamente sem tocar nos componentes.

## ADDED Requirements

### Requirement: Schema de tokens compatível com tweakcn/shadcn

O site SHALL expor o conjunto completo de variáveis de tema do schema shadcn/tweakcn (background, foreground, card, card-foreground, popover, popover-foreground, primary, primary-foreground, secondary, secondary-foreground, muted, muted-foreground, accent, accent-foreground, destructive, destructive-foreground, border, input, ring, chart-1..5, sidebar e derivadas, font-sans/serif/mono, radius e escala de sombras) em `:root` e no modo escuro.

O mapeamento do tema para os utilitários Tailwind SHALL ser feito via `@theme inline` (formato `--color-<nome>: var(--<nome>)`), permitindo que um tema exportado pelo tweakcn seja colado no `global.css` sem alterar componentes.

Os componentes SHALL usar apenas utilitários do tema (`text-muted`, `border-border`, `bg-background/60`, etc.) ou `var(--<token>)` — nunca cores fixas em hexadecimal ou utilitários arbitrários `hsl(var(...))`.

#### Scenario: Troca de tema via tweakcn

- **WHEN** um tema gerado no tweakcn (bloco `:root` e `.dark` com variáveis OKLCH) é colado no `global.css` na posição dos tokens
- **THEN** todas as superfícies, textos, bordas e acentos do site passam a usar as novas cores sem alteração em nenhum componente

#### Scenario: Manutenção do visual inicial

- **WHEN** o site é construído com os tokens iniciais da migração
- **THEN** o visual resultante é visualmente idêntico ao tema anterior à migração (monocromático, dark mode incluso)

### Requirement: Dark mode via classe `.dark`

O modo escuro SHALL ser ativado pela classe `.dark` no elemento raiz, seguindo o padrão shadcn/tweakcn.

A seleção do tema SHALL ocorrer antes da primeira pintura (sem flash de tema incorreto) e SHALL persistir a preferência do usuário entre visitas; quando não houver preferência salva, SHALL usar a preferência do sistema operacional.

#### Scenario: Alternância de tema

- **WHEN** o usuário aciona o alternador de tema
- **THEN** a classe `.dark` é adicionada ou removida do elemento raiz, a preferência é persistida em `localStorage` e a alternância é instantânea sem flash de tema incorreto

#### Scenario: Tema por preferência do sistema

- **WHEN** o usuário não definiu preferência e o sistema opera em modo escuro
- **THEN** o site renderiza em modo escuro na primeira visita

### Requirement: Preferências de acessibilidade preservadas

A aplicação de tema e transições de cor SHALL respeitar `prefers-reduced-motion` (troca de tema sem animação quando reduzido) e os contrates SHALL permanecer ≥ AA (4.5:1 texto normal) nos temas light e dark padrão.

#### Scenario: Movimento reduzido

- **WHEN** o sistema indica `prefers-reduced-motion: reduce` e o usuário alterna o tema
- **THEN** a troca acontece sem transições animadas de cor
