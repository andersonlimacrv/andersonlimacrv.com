---
title: Meu setup de desenvolvimento em 2026
description: "Um setup enxuto e previsível: editor leve, terminal bom, integração contínua e deploy simples — menos ferramentas, menos fricção."
pubDate: 2026-02-10
tags: ["setup", "ferramentas", "dev"]
draft: false
lang: pt
---

Meu setup de desenvolvimento em 2026 é enxuto de propósito: um editor rápido, um terminal sólido, integração contínua e deploy simples. A regra é ter menos ferramentas para ter menos fricção.

## O editor

Uso um editor leve com poucas extensões — apenas linting, formatação e suporte de linguagem. Menos extensões significa menos consumo de memória e menos configuração para manter.

## O terminal

O terminal é o segundo lugar mais importante do dia. Vale investir em um bom prompt, um tema legível e aliases bem escolhidos. Nada de frameworks pesados de shell: o padrão já é suficiente.

## Controle de versão e CI

- **Git** com commits pequenos e mensagens claras.
- **CI** rodando lint, typecheck e testes a cada push — falhar cedo é mais barato.
- **Deploy** automático a partir da branch principal.

## A máquina

Hardware suficiente, mas sem exagero. Uma máquina média bem configurada ganha de uma potente cheia de processos parados. Aplicações monolíticas? Não — **aplicações leves**: menos memória, mais espaço para o que importa.

## O que mudou em relação ao ano passado

1. Menos dependências no `package.json` — cada dependência nova é uma decisão consciente.
2. Testes mais focados: menos testes, mais assertivos.
3. Documentação no código: comentários só quando explicam o "porquê".

> Ferramenta boa é aquela que você esquece que existe.

## Conclusão

Um setup previsível acelera o trabalho real. Em vez de trocar de ferramenta a cada lançamento, invista em poucas escolhas sólidas e nas suas habilidades — as ferramentas mudam, a base permanece.
