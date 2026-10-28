# Arquitectura — firednt

> Estado: esqueleto, layout y base de datos (Issues #1, #5 y #6). Este documento crecerá a medida que se añadan funcionalidades.

## Stack

| Pieza | Elección |
|---|---|
| Framework | Next.js 16 (App Router) |
| Lenguaje | TypeScript en modo `strict` |
| Estilos | Tailwind CSS v4 |
| Lint | ESLint con `eslint-config-next` |
| Tests | Vitest + Testing Library (entorno `jsdom`) |
| Base de datos | SQLite local con Drizzle ORM y `@libsql/client` |
| Gestor de paquetes | npm |

Motivos y alternativas: [ADR 0001](decisions/0001-stack-inicial.md) (stack) y [ADR 0002](decisions/0002-base-de-datos.md) (base de datos).

## Estructura

```
src/
  app/              # UI: rutas (App Router), cada carpeta es una URL
    layout.tsx      # Layout raíz: <html>, fuentes, metadatos y cabecera
    globals.css     # Tailwind y design tokens
  components/       # UI: componentes reutilizables (cabecera, navegación)
  lib/
    site.ts         # Constantes de la app (nombre visible)
    db/             # Acceso a datos: lo único que habla con la base de datos
      schema.ts     # Tablas, tipos y restricciones
      client.ts     # createDb(url): conexión
      projects.ts   # Repositorio de proyectos (CRUD)
      tasks.ts      # Repositorio de tareas (CRUD)
      seed.ts       # Datos de ejemplo (npm run db:seed)
      test-db.ts    # BD en memoria con migraciones, para tests
drizzle/            # Migraciones SQL generadas por drizzle-kit
docs/               # Visión, arquitectura y ADRs
```

## Capas

UI (`app/`, `components/`) → lógica y validación (Server Actions, a partir de #7) → acceso a datos (`lib/db/`) → SQLite.

Las funciones de acceso a datos reciben la conexión (`db`) como primer parámetro: la app usa la base de datos real y los tests una en memoria.

## Convenciones

- Los tests viven junto al archivo que prueban (`*.test.tsx`).
- Imports internos con el alias `@/` (apunta a `src/`).
- Los componentes son Server Components por defecto. Solo se añade `"use client"` cuando hace falta interactividad en el navegador.
- Colores, tipografía y radios se usan a través de design tokens (`text-fg-secondary`, `border-line`…), definidos en `globals.css`.
- Los estados se guardan como códigos en inglés (`IN_PROGRESS`); el texto visible para el usuario se traduce en la UI.
- Los tests de base de datos usan el entorno `node` (`// @vitest-environment node`).

## Pendiente (fuera de esta fase)

- Autenticación y hosting, solo si la app se publica en internet (ver ADR 0002).
- Formateo automático (Prettier).
