## Purpose

Sistema de design tokens do site (cor, tipografia, elevação, layout) como CSS custom properties, com tema claro e escuro, consumido por todas as páginas e componentes.

## ADDED Requirements

### Requirement: Tokens de cor claro/escuro
O site SHALL definir os tokens `--background`, `--foreground`, `--muted`, `--border`, `--primary`, `--secondary` e `--radius` em CSS custom properties, com variante escura via `[data-theme="dark"]` e respeitando `prefers-color-scheme`.

#### Scenario: Tema claro padrão
- **WHEN** o site é aberto sem preferência de tema
- **THEN** `--background` é claro, `--foreground` é quase preto e `--radius` é 4px

#### Scenario: Tema escuro por preferência do sistema
- **WHEN** o usuário tem `prefers-color-scheme: dark` e nenhum tema explícito é escolhido
- **THEN** os tokens escuros (`--background` ~7% de luminosidade, `--foreground` ~96%) são aplicados

#### Scenario: Tema explícito via atributo
- **WHEN** o atributo `data-theme="dark"` está presente no elemento raiz
- **THEN** os tokens escuros prevalecem sobre qualquer preferência do sistema

### Requirement: Tipografia fluida por tokens
O site SHALL definir famílias (`--font-sans` Manrope, `--font-mono` JetBrains Mono, `--font-serif` Fraunces) e escalas com `clamp()` para display, corpo e mono, com tracking apertado em headings.

#### Scenario: Tamanho de display fluido
- **WHEN** a viewport varia de mobile a desktop
- **THEN** o texto display cresce continuamente via `clamp()` sem saltos de breakpoint

#### Scenario: Mono restrito a micro-utilitários
- **WHEN** são aplicados estilos de eyebrow/label/data
- **THEN** usam JetBrains Mono uppercase com letter-spacing espaçado (0.16em–0.3em)

### Requirement: Elevação e superfícies
O site SHALL definir sombras suaves quentes (`0 30px 70px -32px hsl(...)`) e backdrop blur para elementos fixos/overlay, sem blur decorativo em cards de conteúdo.

#### Scenario: Blur apenas em elementos fixos
- **WHEN** se inspeciona o CSS de elementos fixos (header sticky, overlay)
- **THEN** apenas esses elementos usam `backdrop-filter`; cards de conteúdo não

### Requirement: Utilitários editoriais
O site SHALL fornecer classes utilitárias para eyebrow chips, headings display e gradientes radiais sutis (16–18% opacidade) ancorados nos cantos.

#### Scenario: Eyebrow consistente
- **WHEN** um componente usa o utilitário de eyebrow
- **THEN** o resultado é mono uppercase, espaçado, com borda 1px e padding pequeno
