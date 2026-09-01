# Design: target-aux-editorial

## Context
O `TargetHover` (`src/lib/target-hover.ts`) anexa 4 corners em `.cursor-target` apenas em desktop sem toque (`getIsMobile()` = ≤768px OU touch → não anexa). Em mobile, links mono uppercase (Footer "Voltar ao topo", PostLayout "Voltar ao blog" e share X/Email, linhas de posts) ficam sem qualquer feedback. O `TargetSimbol` (`target-simbol.ts`) já gira em `pointerenter`/`pointerdown`/entrada na viewport — o tap mobile já dispara spin sem mudança de código. "Leia também" (`BlogPostPage.astro`) renderiza 3 `PostCard` em grid 2/3 colunas: cards apertados, destoando das linhas editoriais do índice. O nav (`Header.astro:18-23`) lista `Sobre, Blog, Projetos, Contato` enquanto a home ordena `01 Sobre, 02 Projetos, 03 Blog, 04 Contato`.

## Goals / Non-Goals

**Goals:**
- Feedback de toque no mobile via TargetSimbol auxiliar (`md:hidden`) nos links mono uppercase elencados.
- "Leia também" em lista editorial numerada coerente com o índice/vitrine.
- Nav do header espelhando a ordem das seções 01–04.
- Zero JS novo, zero CSS custom novo, zero i18n novo.

**Non-Goals:**
- Alterar `TargetHover`, física do spin, índice `/blog`, vitrine `#blog`, tokens.
- Adicionar simbol a todos os links do site (apenas os elencados).

## Decisions

**D1. Aux = `TargetSimbol size={16}` com `md:hidden`, dentro do `<a>`, após o label**
- Por quê: `md:hidden` alinha com o corte de 768px do `TargetHover` (desktop = corners, mobile = simbol); `pointerdown` do `target-simbol.ts` já dá feedback no tap; `aria-hidden` já embutido no componente (decorativo).
- Alternativas: detectar touch via JS e alternar classe — rejeitado (JS novo, custo/complexidade sem ganho); simbol visível também no desktop — rejeitado (redundante com corners).

**D2. Conjunto de links auxiliares: Footer backToTop, PostLayout backToBlog, share X/Email e linhas de "Leia também"**
- Por quê: são os únicos mono uppercase fora de contexts que já têm simbol (Contact email já tem permanente — mantido como referência do padrão híbrido).
- Trade-off: RelatedPostRow não existe como componente — linhas são inline em `BlogPostPage.astro` (só há um uso; abstração desnecessária).

**D3. "Leia também": `ol` em coluna única, `divide-y divide-border`, índice mono `01–03`, título `text-lg sm:text-xl` semibold hover `text-primary`, data mono à direita (`hidden sm:block`), seta `→` com `group-hover:translate-x-1`**
- Por quê: replica a gramática do índice editorial (linhas + divisórias) sem descrição — mais denso e profissional que cards; `pt-10` do aside e h2 eyebrow mono existentes são mantidos.
- Alternativa: reutilizar `PostCard` em coluna única — rejeitado (PostCard traz descrição+tags; poluição visual num aside).

**D4. Nav: reordenar `navLinks` para `#sobre, #projetos, #blog, #contato`**
- Por quê: nav deve espelhar a leitura vertical da home (01→04); o stagger de animação (`LINK_STAGGER × i`) e o teste de largura de pílula/links do `locale-layout.spec.ts` permanecem válidos (mesmos 4 links, ordem uniforme nos 3 idiomas).

**D5. E2E único novo `e2e/editorial-feedback.spec.ts`**
- Por quê: um spec coeso cobre os 4 domínios (nav order, aux simbol, separador, related editorial) sem espalhar por 3 arquivos existentes; ~6 testes.

**D6. Separador unificado: `·` (ponto médio) via `Sep.astro` — escolha final do usuário (2026-09-01)**
- Por quê: o usuário trocou `/`→`·` manualmente (Hero eyebrow, Trajetória) e confirmou que o glifo desejado é o `·` (a sugestão de trocar o caractere foi recusada — o `–` proposto foi revertido antes do commit). A melhoria é na **renderização**: `Sep.astro` padroniza o ponto médio a ~0.8em, cor `text-muted-foreground/60` (hierarquia — separa sem competir com o texto), `select-none`, `mx` ajustável por contexto via prop `class`. Hoje o `·` inline herda cores/tamanhos diferentes por contexto; com `Sep` todos ficam idênticos.
- Alternativas registradas e recusadas: `|` pipe (identidade de linhas), `–` en dash (aprovada por engano no questionário e revertida), `+` cross (chamativo demais).
- Contextos: Trajetória (role·company), meta do post (2 spots), chip eyebrow do Hero via nova prop `label2` no `Eyebrow` (chip renderiza `{label} <Sep/> {label2}` — evita template string com char embutido), mainStack do About (`split(' · ')` renderizado com `Sep` — data inalterada), i18n `shareX` → `"X · Twitter"` e `contactGridHint` mantém `·` (padronizado).

## Risks / Trade-offs
- **[Risco] Spin no tap atrasa navegação?** → Mitigação: `element.animate` não bloqueia o evento; navegação segue no click normal (spin é decorativo, 1s, compositor).
- **[Risco] Simbol ocupar largura e quebrar layout do link no mobile** → Mitigação: `size=16` + `ml-1` inline; links são `inline-flex/flex` — largura cresce ~20px; e2e valida `min-h-11` e ausência de overflow.
- **[Trade-off] Data `hidden sm:block` some no mobile nas linhas relacionadas** → aceito: índice numérico + título dominam; data reaparece ≥640px.
- **[Risco] Reordenar nav muda âncora ativa?** → nav não tem estado ativo por rota (verificado); zero impacto.

## Migration Plan
- Deploy: build estático; rollback = `git revert` de 4 arquivos + spec novo.
- Ordem: 1) Header navLinks, 2) Footer + PostLayout aux, 3) BlogPostPage editorial, 4) e2e, 5) check/test/audit.

## Open Questions
- Nenhuma — conjunto de links e formato da lista derivados do pedido do usuário (2026-09-01).
