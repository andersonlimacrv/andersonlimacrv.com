---
title: My development setup in 2026
description: "A lean, predictable setup: a light editor, a solid terminal, continuous integration and simple deploys — fewer tools, less friction."
pubDate: 2026-02-10
tags: ["setup", "tools", "dev"]
draft: false
lang: en
---

My development setup in 2026 is deliberately lean: a fast editor, a solid terminal, continuous integration and simple deploys. The rule is to have fewer tools so there is less friction.

## The editor

I use a lightweight editor with few extensions — just linting, formatting and language support. Fewer extensions means less memory usage and less configuration to maintain.

## The terminal

The terminal is the second most important place of the day. It's worth investing in a good prompt, a legible theme and well-chosen aliases. No heavy shell frameworks: the defaults are good enough.

## Version control and CI

- **Git** with small commits and clear messages.
- **CI** running lint, typecheck and tests on every push — failing early is cheaper.
- **Automatic deploy** from the main branch.

## The machine

Enough hardware, but no overkill. A mid-range machine that's well configured beats a powerful one full of idle processes. Monolithic apps? No — **lightweight apps**: less memory, more room for what matters.

## What changed from last year

1. Fewer dependencies in `package.json` — every new dependency is a conscious decision.
2. More focused tests: fewer tests, more assertive.
3. Documentation in code: comments only when they explain the "why".

> A good tool is one you forget exists.

## Conclusion

A predictable setup speeds up the real work. Instead of switching tools at every release, invest in a few solid choices and in your skills — the tools change, the foundation stays.