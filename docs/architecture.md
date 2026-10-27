# Arquitectura — firednt

> Estado: esqueleto inicial (Issue #1). Este documento crecerá a medida que se añadan funcionalidades.

## Stack

| Pieza | Elección |
|---|---|
| Framework | Next.js 16 (App Router) |
| Lenguaje | TypeScript en modo `strict` |
| Estilos | Tailwind CSS v4 |
| Lint | ESLint con `eslint-config-next` |
| Tests | Vitest + Testing Library (entorno `jsdom`) |
| Gestor de paquetes | npm |

Motivos y alternativas: [ADR 0001](decisions/0001-stack-inicial.md).

## Estructura

```
src/
  app/              # Rutas (App Router): cada carpeta es una URL
    layout.tsx      # Layout raíz: <html>, fuentes y metadatos
    page.tsx        # Página de inicio (/)
    page.test.tsx   # Tests junto al código que prueban
    globals.css     # Tailwind y variables de tema
docs/               # Visión, arquitectura y ADRs
```

## Convenciones

- Los tests viven junto al archivo que prueban (`*.test.tsx`).
- Imports internos con el alias `@/` (apunta a `src/`).
- Los componentes son Server Components por defecto. Solo se añade `"use client"` cuando hace falta interactividad en el navegador.

## Pendiente (fuera de esta fase)

- Persistencia de datos (previsto: SQLite con un ORM, a decidir en su propio ADR).
- Autenticación, solo si la app se publica en internet.
- CI (GitHub Actions) y formateo automático.
