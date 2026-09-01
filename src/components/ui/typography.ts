/**
 * typography.ts — REGISTRO ÚNICO de tipografia do site.
 *
 * Todo controle de fonte (família, peso, tamanho, leading, tracking, caixa)
 * vive AQUI. O componente Text.astro e todos os elementos do site referenciam
 * estas variantes. Fora deste arquivo + espelho .post-content (global.css)
 * não pode haver tipografia — verificado por scripts/typography-audit.mjs.
 *
 * (O registro fica em .ts em vez do frontmatter do Text.astro porque exportar
 * um valor do frontmatter quebra a inferência de props do componente Astro.)
 */
export const TYPE = {
  // TÍTULOS
  hero: 'font-sans font-extrabold text-hero leading-[1.05] tracking-[-0.03em]',
  titleH1: 'font-sans font-bold text-h1 leading-[1.1] tracking-tight',
  titleH2: 'font-sans font-bold text-h2 leading-[1.2] tracking-tight',
  titleH3: 'font-sans font-semibold text-h3 leading-[1.3] tracking-tight',
  sectionTitle: 'font-sans font-bold text-h1 leading-[1.1] tracking-tight uppercase',
  sectionNumber: 'font-mono font-semibold text-[90px] md:text-[120px] leading-none tracking-[0.01em]',
  sectionEyebrow: 'font-mono text-xs uppercase tracking-[0.3em]',
  // TEXTOS
  body: 'font-sans font-normal text-xs md:text-sm leading-relaxed',
  quote: 'font-serif italic text-sm leading-relaxed tracking-tight',
  postBody: 'font-sans font-normal text-lead leading-[1.6]',
  postH2: 'font-sans font-bold text-h2 leading-[1.2] tracking-tight',
  postH3: 'font-sans font-semibold text-h3 leading-[1.3] tracking-tight',
  postQuote: 'font-serif italic text-[clamp(1.25rem,3vw,1.625rem)] leading-none',
  // RÓTULOS
  label: 'font-mono font-normal uppercase tracking-caps text-eyebrow',
  labelWide: 'font-mono font-normal uppercase tracking-caps-wide text-eyebrow',
  navLink: 'font-mono text-xs uppercase tracking-[0.16em]',
  logo: 'font-mono text-2xl font-bold uppercase tracking-[0.20em]',
  localeToggle: 'font-mono text-xs uppercase tracking-[0.16em]',
  // BLUEPRINT (escala do morph: --bp-scale herdado da raiz)
  bpLegendName: 'font-mono font-semibold text-[calc(0.6875rem*var(--bp-scale))] uppercase tracking-[0.18em]',
  bpLegendTag: 'font-mono text-[calc(0.5625rem*var(--bp-scale))] uppercase tracking-[0.3em]',
  bpGroupTitle: 'font-mono font-semibold text-[calc(0.5625rem*var(--bp-scale))] uppercase tracking-[0.2em]',
  bpRow: 'font-mono text-[calc(0.625rem*var(--bp-scale))] leading-[1.6] tracking-[0.04em]',
  bpRowLabel: 'font-mono text-[calc(0.625rem*var(--bp-scale))] leading-[1.6] tracking-[0.04em] uppercase',
  bpRowValue: 'font-mono font-semibold text-[calc(0.625rem*var(--bp-scale))] leading-[1.6] tracking-[0.04em]',
  ghostLabel: 'font-mono text-[calc(0.625rem*var(--bp-scale))] tracking-[0.04em]',
  ghostMicro: 'font-mono text-[calc(0.5625rem*var(--bp-scale))]',
  // MISC
  sep: 'font-mono text-[1em] leading-none',
} as const;

export type Variant = keyof typeof TYPE;