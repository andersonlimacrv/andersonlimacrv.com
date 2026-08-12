## Context

O site já tem infraestrutura de tema claro/escuro: script inline anti-FOUC no `BaseLayout.astro` que resolve `data-theme` de `localStorage['theme']` ou `prefers-color-scheme` antes do primeiro paint. Os tokens `--primary`/`--secondary` em `src/styles/global.css:16-17` ainda são coloridos (azul/laranja) e aparecem em hover, seleção, focus, gradientes e textos; não há botão visível de toggle no header.

Metas de acesso: o toggle precisa respeitar o sistema existente (`data-theme` + `localStorage`), esconder/mostrar o ícone correto (sol/lua), e manter contraste AA com a paleta B&W.

## Goals / Non-Goals

**Goals:**
- Palestra 100% monocromática em todos os estados visuais (hover, focus, selection, gradientes, links).
- `--primary` = foreground (preto claro / branco escuro); `--secondary` = cinza médio (muted).
- Componente `ThemeToggle` no header com ícones line (Lucide), acessível, que persiste em `localStorage` e não causa FOUC.
- Zero CSS/JS extra de biblioteca: Tailwind + script inline já existente.

**Non-Goals:**
- Não criar seletor de idiomas (change `i18n-multilingual` separado).
- Não mexer em tipografia, layout, conteúdo ou contrastes fora da cor.
- Não adicionar modo "auto" (segue sistema) como opção persistida — apenas light/dark.

## Decisions

**1. Tokens neutros reutilizando foreground/background em vez de valores novos.**
- Claro: `--primary = 0 0% 8%` (foreground), `--secondary = 0 0% 45%` (muted).
- Escuro: `--primary = 0 0% 96%` (foreground), `--secondary = 0 0% 65%` (muted).
- Alternativa considerada: criar cinzas dedicados (`--accent`, `--accent-strong`). Rejeitada por adicionar tokens redundantes — a paleta é B&W e os estados hover/focus já usam `--primary`/`--secondary`; mapear para foreground/muted resolve com menos tokens e garante AA.
- Precisão: `[data-theme='dark']` e o bloco `@media (prefers-color-scheme: dark)` precisam receber os novos valores de `--primary`/`--secondary` (hoje só definem background/foreground/muted/border).

**2. Gradientes de fundo monocromáticos.**
- `.grid-bg::before` (global.css:179-189) usa radial-gradients com `--primary`(azul) e `--secondary`(laranja). Trocam para `hsl(var(--foreground) / 0.06)` (leve e neutro), mantendo a profundidade editorial sem cor.

**3. Toggle = botão no header, componente Astro com `<script>` local.**
- Novo `src/components/ThemeToggle.astro`: `<button type="button">` com dois SVGs line (sol/lua, stroke `currentColor`), `aria-label` dinâmico ("Ativar tema escuro"/"Ativar tema claro"), `:focus-visible` herdado do global.
- O script lê `document.documentElement` (`data-theme` já resolvido pelo anti-FOUC), alterna o atributo e grava `localStorage['theme']`. Escuta `keydown`/`click`. Usa `data-astro-transition-persist` para manter o estado entre navegações (padrão do Header).
- Alternativa considerada: controlar tema via script global com toggle no `BaseLayout`. Rejeitada — componente coeso no header mantém portal único e o script anti-FOUC já resolve o tema no load.
- Sem astro prefetch de view transitions: basta o padrão persist do header; o estado vive no DOM (`data-theme`).

**4. Manter o script anti-FOUC intacto.**
- Ele já resolve o tema antes do primeiro paint e grava `data-theme` no `<html>`. O toggle só inverte esse atributo e persiste. Nada a mudar lá, exceto garantir que o botão herde `color: currentColor`.

## Risks / Trade-offs

- [Links do post content (global.css:255) usavam `--primary` azul; após a mudança, links e texto de ênfase ficam em preto/cinza — contraste alto, mas possível perda de "destaque por cor"] → Mitigação: distinção por peso/underline mantida (texto preto + underline), coerente com a estética B&W.
- [Esteira de degrades: variantes `hover:border-primary/50` etc. funcionam com o novo `--primary` neutro sem ajuste] → apenas os gradientes `.grid-bg` precisam de edição manual.
- [Toggle com `localStorage` em ambientes bloqueados] → try/catch no script, fallback para `prefers-color-scheme` já no anti-FOUC; se gravação falhar, o toggle só não persiste.

- **Migration**: mudança de CSS local + novo componente; rollback = reverter tokens e remover o botão. Sem migração de dados.

## Open Questions

Nenhuma.