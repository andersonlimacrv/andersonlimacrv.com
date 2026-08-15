## Context

Tokens e movimento já existem: `design-tokens` (OKLCH monocromático, `--border` oklch(0.92), `--muted-foreground` oklch(0.552), `--primary` foreground), `motion-transitions` (hovers transform/opacity 150–250ms com `prefers-reduced-motion`) e `elastic-line-divider` (divisor elástico TS vanilla). O que falta é um **léxico de linhas** que una marcadores, divisores e hovers numa mesma gramática visual — hoje decididos caso a caso. O marcador atual (`SectionHeading`): `eyebrow` em mono + linha com `número` mono `text-primary` + `h2`, sem linha conectora.

## Goals / Non-Goals

**Goals:**
- Definir regras normativas de "linhas" reutilizáveis (1px, cores dos tokens, tracking mono) e registrá-las em spec.
- Redesign do `SectionHeading` com linha reta conectando número → título, formato **idêntico** nas 4 seções (sobre/projetos/blog/contato) × 3 idiomas.
- Manter os hovers dentro do léxico existente (sem novas animações ou cores).
- Zero JS novo; CSS puro nos tokens já existentes.

**Non-Goals:**
- Redesenhar layout das páginas, rodapé, header ou conteúdo (só o cabeçalho de seção).
- Alterar tokens de cor/tipografia (reusar `--border`, `--muted-foreground`, `--primary`).
- Criar novos componentes de dividers (o elástico continua na sua change).
- Mudar a numeração/i18n das seções.

## Decisions

### 1. Léxico de linhas (a gramática)

Definição normativa, em ordem de prioridade:
1. **Espessura**: toda linha (border, divider, traço do marcador) usa **1px**.
2. **Cor**: prioriza `--border` para linhas estruturais passivas, `--muted-foreground` para elementos acessórios (eyebrows, labels) e `--primary` para destaque único (número da seção, link ativo). Nada fora desses tokens.
3. **Tipografia associada**: rótulos de linha em JetBrains Mono uppercase com tracking **0.16–0.3em** (padrão já usado em eyebrows).
4. **Movimento**: qualquer transição de linha em hover segue `motion-transitions` — apenas `transform`/`opacity`, 150–250ms, embrulhado em `prefers-reduced-motion`.
5. **Formato uniforme**: componentes que repetem uma estrutura (ex.: cabeçalhos de seção) usam a **mesma marcação HTML/classes**, variando só número e texto.

### 2. Redesign do `SectionHeading`: `número ──── título`

Substitui o par `número mono` + `h2` (sem conexão) por um layout com linha reta conectando número ao título:

- Linha horizontal de 1px com `--border` (ou `--muted-foreground`) partindo do número até o título.
- Número em mono `text-primary`, mesmo tamanho atual (`text-sm`, `tracking-[0.16em]`).
- Título `h2` mantém a escala atual (`text-h1`, Manrope bold, tracking apertado).
- **Formato idêntico nas 4 seções**: apenas `number`/`title`/`eyebrow` mudam (via i18n, já estruturado em `ui.ts`).
- Linha usa flex/grid com `flex-1` entre número e título (ou `::after`), 100% responsivo, sem JS.

Alternativas consideradas e rejeitadas: número acima do título separado por borda inferior full-width (perde a conexão direta número→título); linha antes do título sem número (perde a âncora numérica editorial).

### 3. Hover alinhado ao léxico

Revisar as regras existentes: hovers de links/cards **continuam** `transform`/`opacity` 150–250ms (`transition-micro`), cores dentro dos tokens. Nenhuma exceção nova; se alguma interação precisar de linha, usa 1px `--border` + `--primary` no hover.

### 4. Spec como contrato

A capability `visual-identity-lines` registra os requirements normativos (1px, tokens, tracking, movimento, formato uniforme) para que componentes futuros (hovers, linhas, divisores) sigam a mesma gramática — incluindo a adequação do `elastic-line-divider` (task aberta lá).

## Risks / Trade-offs

- [Redesign visual impactar leitura do título] → manter escala/contato visual atuais; linha discreta em `--border`, não competindo com o `h2`.
- [Linha conectora quebrar em telas estreitas] → `flex-1` com `min-width` no título; em `sm` a linha pode encolher, mas nunca desaparece.
- [3 idiomas × 4 seções = 12 combinações] → o componente é único; i18n já centraliza número/título, risco baixo.
- [Regras normativas virarem burocracia] → spec curta, apenas o essencial (espessura/cor/tracking/movimento/formato), sem excesso.

## Migration Plan

1. Escrever spec `visual-identity-lines` (requirements normativos do léxico).
2. Refatorar `SectionHeading.astro` para o layout `número ──── título` (mesma marcação p/ 4 seções).
3. Conferir as 4 seções × 3 idiomas na landing (build + inspeção visual dark/light).
4. Revisar hovers existentes contra o léxico (sem mudanças salvo desvios encontrados).
5. Validar: `npm run check` 0 erros, `npm run build`, e2e 23/23, auditoria sem regressão de peso. Rollback: git revert (mudança localizada em `SectionHeading.astro` + spec).