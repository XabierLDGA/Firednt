# Arquitectura — firednt

> Estado: esqueleto, layout, base de datos y gestión de proyectos y tareas (Issues #1, #5, #6, #7 y #8). Este documento crecerá a medida que se añadan funcionalidades.

## Stack

| Pieza | Elección |
|---|---|
| Framework | Next.js 16 (App Router) |
| Lenguaje | TypeScript en modo `strict` |
| Estilos | Tailwind CSS v4 |
| Lint | ESLint con `eslint-config-next` |
| Tests | Vitest + Testing Library (entorno `jsdom`) |
| Base de datos | SQLite local con Drizzle ORM y `@libsql/client` |
| Validación | Zod (en el servidor, dentro de las Server Actions) |
| Gestor de paquetes | npm |

Motivos y alternativas: [ADR 0001](decisions/0001-stack-inicial.md) (stack) y [ADR 0002](decisions/0002-base-de-datos.md) (base de datos).

## Estructura

```
src/
  app/              # UI: rutas (App Router), cada carpeta es una URL
    layout.tsx      # Layout raíz: <html>, fuentes, metadatos y cabecera
    globals.css     # Tailwind y design tokens
    projects/       # Páginas de proyectos y tareas; Server Actions en actions.ts y task-actions.ts
  components/       # UI: componentes reutilizables
    ui.ts           # Clases compartidas de botones y campos
    field.tsx       # Etiqueta + campo + error de formulario
    confirm-delete-button.tsx  # Botón de eliminar con confirmación
    projects/       # Formulario y badge de estado de proyectos
    tasks/          # Lista, alta rápida, selector de estado y formulario de tareas
  lib/
    site.ts         # Constantes de la app (nombre visible)
    ids.ts          # parseId(): ids de la URL a número
    projects/       # Lógica de proyectos: validación (Zod), etiquetas, límites y carga por id
    tasks/          # Lo mismo para tareas
    db/             # Acceso a datos: lo único que habla con la base de datos
      index.ts      # getDb(): conexión de la app (lee DATABASE_URL)
      enums.ts      # Estados válidos, sin dependencias (usable en el navegador)
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

UI (`app/`, `components/`) → Server Actions (`app/**/*actions.ts`: validan con `lib/*/validation.ts`) → acceso a datos (`lib/db/`) → SQLite.

- Las páginas leen datos directamente desde Server Components llamando a los repositorios con `getDb()`.
- Las escrituras pasan siempre por una Server Action, que valida en el servidor, guarda y redirige (o, en el alta rápida y el cambio de estado de tareas, revalida la página para quedarse en ella).
- Las funciones de acceso a datos reciben la conexión (`db`) como primer parámetro: la app usa la base de datos real y los tests una en memoria.
- Los Client Components no importan `schema.ts` ni `validation.ts` (arrastrarían Drizzle y Zod al navegador). Las constantes compartidas viven en `lib/db/enums.ts` y `lib/*/constants.ts`.

### Next.js 16 y Cache Components

- Las páginas de `/projects` exportan `instant = false` (en `app/projects/layout.tsx`): se renderizan en cada petición y pueden bloquear mientras leen la BD local, sin necesidad de `<Suspense>`.
- Las rutas con parámetro (`/projects/[id]`, `/projects/[id]/tasks/[taskId]/edit`) envían primero un esqueleto prerenderizado. Por eso un id inexistente muestra la página 404 con `noindex`, pero con código HTTP 200 (*soft 404*). Un 404 "real" requeriría comprobarlo en un Proxy.

### Tareas

- Se gestionan desde el detalle del proyecto: alta rápida (solo título, estado "Pendiente"), cambio de estado con un desplegable que guarda al cambiar y una página de edición para título, descripción, estado y borrado.
- La edición carga la tarea con `loadTaskOrNotFound(projectId, taskId)`: si la tarea es de otro proyecto, responde 404. Así una URL no puede mezclar proyectos.
- Al borrar un proyecto, la base de datos borra sus tareas (`ON DELETE CASCADE`).

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
