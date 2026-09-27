# Proposal: contact-actions-polish

## Why

Validação visual do Contato apontou 3 defeitos de alinhamento: corners do TargetHover abraçando a coluna inteira em vez do link, botões COPIAR/COPIADO mudando de largura (pior entre idiomas) e pills de assunto com larguras desiguais sem preencher a linha.

## What Changes

- Links dos canais: `justify-self-start max-w-full` (encolhem ao conteúdo; corners só no texto).
- Botões copiar: `w-24 text-center` (largura fixa em todos os idiomas/estados).
- Pills de assunto: `flex-grow` por label (fileiras sempre cheias, larguras por conteúdo, texto sem tocar as bordas).
- E2E novo nos 3 pontos (desktop/mobile, 3 locales onde há texto).

## Capabilities

### New Capabilities

- `contact-actions-polish`: alinhamento dos elementos interativos do Contato (corners no link, copiar fixo, assuntos preenchidos).

### Modified Capabilities

Nenhuma.

## Impact

- **Alterado**: `Contact.astro` (classes), `contact-section.spec.ts` (3 testes).
- **Performance**: zero (só classes utilitárias).
- **Risco**: rótulos longos (ex.: "Contratação") forçam quebra de linha mais cedo no mobile — comportamento desejado e coberto em e2e.

## Non-goals

- Não mudar textos, cores, comportamento do form/copy ou hierarquia.
- Não tocar em About, Projetos ou lab.
