---
title: Mi setup de desarrollo en 2026
description: "Un setup enxuto y predecible: editor ligero, buen terminal, integración continua y deploy simple — menos herramientas, menos fricción."
pubDate: 2026-02-10
tags: ["setup", "herramientas", "dev"]
draft: false
lang: es
---

Mi setup de desarrollo en 2026 es enxuto a propósito: un editor rápido, un terminal sólido, integración continua y deploy simple. La regla es tener menos herramientas para tener menos fricción.

## El editor

Uso un editor ligero con pocas extensiones — solo linting, formato y soporte de lenguaje. Menos extensiones significa menos consumo de memoria y menos configuración que mantener.

## El terminal

El terminal es el segundo lugar más importante del día. Vale la pena invertir en un buen prompt, un tema legible y aliases bien elegidos. Nada de frameworks pesados de shell: el estándar ya es suficiente.

## Control de versiones y CI

- **Git** con commits pequeños y mensajes claros.
- **CI** corriendo lint, typecheck y tests en cada push — fallar temprano es más barato.
- **Deploy** automático desde la rama principal.

## La máquina

Hardware suficiente, pero sin exagerar. Una máquina media bien configurada le gana a una potente llena de procesos parados. ¿Aplicaciones monolíticas? No — **aplicaciones ligeras**: menos memoria, más espacio para lo que importa.

## Qué cambió respecto al año pasado

1. Menos dependencias en el `package.json` — cada dependencia nueva es una decisión consciente.
2. Tests más enfocados: menos tests, más asertivos.
3. Documentación en el código: comentarios solo cuando explican el "por qué".

> Buena herramienta es aquella de la que te olvidas que existe.

## Conclusión

Un setup predecible acelera el trabajo real. En lugar de cambiar de herramienta en cada lanzamiento, invierte en pocas elecciones sólidas y en tus habilidades — las herramientas cambian, la base permanece.