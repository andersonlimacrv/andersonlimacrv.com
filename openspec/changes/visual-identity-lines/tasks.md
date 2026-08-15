## 1. Spec do léxico de linhas

- [x] 1.1 Definir em spec as regras normativas: espessura 1px, cores dos tokens (`--border`/`--muted-foreground`/`--primary`), tracking mono 0.16–0.3em, movimento `motion-transitions`, formato uniforme
- [x] 1.2 Registrar a capability `visual-identity-lines` como contrato para componentes futuros (hovers, linhas, divisores)

## 2. Redesign do `SectionHeading`

- [x] 2.1 Refatorar `src/components/SectionHeading.astro` para o layout `número ──── título`: número mono `text-primary` + linha reta 1px (`--border`) conectando ao `h2` (flex com `flex-1`), mantendo eyebrow e escala atuais
- [x] 2.2 Garantir formato idêntico nas 4 seções (sobre/projetos/blog/contato) usando apenas `number`/`title`/`eyebrow` do i18n
- [x] 2.3 Conferir responsividade da linha conectora em telas estreitas (nunca desaparecer; encolher com `flex-1`)

## 3. Hovers alinhados ao léxico

- [x] 3.1 Revisar hovers de links/cards (GitHub/LinkedIn/Email, `viewAllPosts`, `PostCard`, `ProjectLink`) contra o léxico — apenas `transform`/`opacity` 150–250ms, cores dentro dos tokens
- [x] 3.2 Corrigir desvios encontrados (se houver) sem introduzir novas animações ou cores

## 4. Validação

- [x] 4.1 `npm run check` sem erros
- [x] 4.2 `npm run build` verde
- [x] 4.3 `npm run test:e2e` verde (23/23)
- [x] 4.4 Inspeção visual dark/light das 4 seções × 3 idiomas + auditoria (`scripts/audit.mjs`) sem regressão de peso
- [x] 4.5 Atualizar `elastic-line-divider` (task 5.x) para harmonizar o divisor elástico com esta gramática — divisor já usa `strokeWidth=1` + `text-muted-foreground` (léxico 1px) ✓