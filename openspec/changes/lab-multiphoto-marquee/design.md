# Design

## Context

Ver `proposal.md`. `FlowingMenu.astro` gera 1 thumb (`getImage` 400px) por parte; `buildPart(label, image)` cria 1 `<img>`; `data-image` alimenta o enhance. Só existe `me.png` em `src/assets`.

## Goals / Non-Goals

**Goals:** N imagens por parte via prop, crops locais variados, zero impacto em A/B/Projetos.

**Non-Goals:** assets finais, campos de dados, mudanças no motor de reveal/rAF.

## Decisions

1. **Prop `images?: FlowingMedia[]` (`{src, w, h}`)** — a proporção é escolhida por imagem, no chamador; omitida, 1 thumb compacta (160×56). A/B/Projetos omitem e mantêm o markup atual byte a byte.
2. **3 crops com ALTURA ÚNICA de 112px e larguras pela proporção** (1:1 → 112, 4:3 → 149, 16:9 → 199; crops `cover` condizentes; raio `var(--radius)` global no componente) + `width/height` proporcionais (×2) para reserva sem CLS. Ritmo só na largura — altura variada quebrava o alinhamento.
3. **`data-images`/`data-sizes` (`WxH`) CSV** — `buildPart` cria as N imagens idênticas ao SSR; o recalc só ajusta a quantidade de partes.
4. **Mobile mantém larguras por índice** (sem override uniforme) — o teste mostra o comportamento real com partes largas; `height` 56px fixo contém o custo.
5. **Bloco C reutiliza `variant="full"`** — só muda a densidade do marquee; heading `lab.variantC`.

## Risks / Trade-offs

- [Risco] 3× imagens por parte pesam o DOM da lab (~36 `<img>`) → Mitigação: mesma URL base (cache único), `loading="lazy"`, rota `noindex` fora da home.
- Trade-off: crops da mesma foto não validam contraste/tema de fotos reais — aceito para teste de layout.

## Migration Plan

1. `FlowingMenu` + `buildPart` → check (tipos CSV) + lab visual.
2. Bloco C + i18n + e2e. Rollback: deletar bloco C e a prop (1 arquivo + prop opcional).
