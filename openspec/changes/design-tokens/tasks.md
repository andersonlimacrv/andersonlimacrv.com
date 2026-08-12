## 1. Tokens de cor

- [ ] 1.1 Definir em `src/styles/global.css`: `:root` com `--background`, `--foreground`, `--muted`, `--border`, `--primary`, `--secondary`, `--radius: 0.25rem` (formato hsl sem matiz, base quase monocromática)
- [ ] 1.2 Definir `[data-theme="dark"]` com os mesmos tokens escuros (bg ~7%, fg ~96%, muted ~65%, border ~18%)
- [ ] 1.3 Adicionar media query `@media (prefers-color-scheme: dark)` que aplica `data-theme="dark"` ao `:root` + script inline de tema no `<head>` (via BaseLayout) para evitar FOUC
- [ ] 1.4 Mapear tokens para utilities Tailwind v4 com `@theme inline` (`--color-background`, `--color-foreground`, `--color-muted`, `--color-border`, `--color-primary`, `--color-secondary`)

## 2. Tokens de tipografia

- [ ] 2.1 Definir `--font-sans` (Manrope), `--font-mono` (JetBrains Mono), `--font-serif` (Fraunces) e mapear via `@theme inline` (`--font-sans`, `--font-mono`, `--font-serif`)
- [ ] 2.2 Definir escala display com `clamp()` (hero `clamp(2.5rem, 6vw, 5.5rem)`) e variantes h2/h3 menores, com letter-spacing `-0.02em` a `-0.03em`
- [ ] 2.3 Definir line-height de corpo 1.5–1.55 e token de texto de leitura ~65–75ch

## 3. Elevação, utilitários e superfícies

- [ ] 3.1 Definir sombra única suave `--shadow-soft: 0 30px 70px -32px hsl(var(--foreground) / 0.4)` e token de blur para fixos/overlay
- [ ] 3.2 Criar utilitário `.eyebrow` (mono 600, uppercase, letter-spacing 0.16–0.3em, chip com borda 1px)
- [ ] 3.3 Criar utilitário `.heading-display` (Manrope 600–800, clamp, tracking tight)
- [ ] 3.4 Criar utilitário `.card-surface` (borda 1px `--border`, radius `--radius`, `background: hsl(var(--background) / 0.6)`)
- [ ] 3.5 Criar gradiente radial sutil (~16–18% opacidade) ancorado nos cantos com `--primary`/`--secondary` (pseudo-elemento do body ou componente decorativo)

## 4. Validação

- [ ] 4.1 Verificar contraste AA (4.5:1 texto normal) entre `--foreground`/`--background` e `--muted`/`--background` em ambos os temas
- [ ] 4.2 Confirmar `npm run build` sem erros e que as utilities são geradas no CSS final
