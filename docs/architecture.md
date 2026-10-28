# Arquitectura — firednt

> Estado: esqueleto, layout, base de datos y MVP v0.1 completo: proyectos, tareas, tablero Kanban, progreso y dashboard (Issues #1 y #5–#11). Este documento crecerá a medida que se añadan funcionalidades.

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
    page.tsx        # Inicio: dashboard con el resumen de todo
    globals.css     # Tailwind y design tokens
    projects/       # Páginas de proyectos y tareas; Server Actions en actions.ts y task-actions.ts
  components/       # UI: componentes reutilizables
    ui.ts           # Clases compartidas de botones y campos
    page.tsx        # Estructura de cada pantalla: barra con icono, migas y acciones
    icons.tsx       # Iconos SVG propios, al estilo Tabler (sin dependencia)
    tag.tsx         # Etiqueta de color (fondo pastel + texto saturado)
    avatar.tsx      # Inicial de un nombre sobre su color estable
    form-panel.tsx  # Panel de formulario y zona de borrado
    field.tsx       # Etiqueta + campo + error de formulario
    confirm-delete-button.tsx  # Botón de eliminar con confirmación
    dashboard/      # Vista del dashboard (recibe las estadísticas ya calculadas)
    projects/       # Formulario, etiqueta de estado, progreso y pestañas Lista/Tablero
    tasks/          # Lista, alta rápida, selector y etiqueta de estado, formulario y tablero
  lib/
    site.ts         # Constantes de la app (nombre visible)
    colors.ts       # Paleta de etiquetas y color estable por nombre
    format.ts       # Formato de fechas ("28 oct 2026")
    ids.ts          # parseId(): ids de la URL a número
    projects/       # Lógica de proyectos: validación (Zod), etiquetas, límites y carga por id
    tasks/          # Lo mismo para tareas, más el tablero (board.ts) y el progreso (progress.ts)
    dashboard/      # getDashboardStats(): cifras del dashboard en tres consultas
    db/             # Acceso a datos: lo único que habla con la base de datos
      index.ts      # getDb(): conexión de la app (lee DATABASE_URL)
      enums.ts      # Estados válidos, sin dependencias (usable en el navegador)
      schema.ts     # Tablas, tipos y restricciones
      client.ts     # createDb(url): conexión
      projects.ts   # Repositorio de proyectos (CRUD)
      tasks.ts      # Repositorio de tareas (CRUD)
      seed-data.ts  # seedDatabase(): datos de ejemplo, reutilizable en tests
      seed.ts       # Script de npm run db:seed (llama a seedDatabase)
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

- Las páginas de `/projects` (en `app/projects/layout.tsx`) y la de inicio (`app/page.tsx`) exportan `instant = false`: se renderizan en cada petición y pueden bloquear mientras leen la BD local, sin necesidad de `<Suspense>`.
- Las rutas con parámetro (`/projects/[id]`, `/projects/[id]/board`, `/projects/[id]/tasks/[taskId]/edit`) envían primero un esqueleto prerenderizado. Por eso un id inexistente muestra la página 404 con `noindex`, pero con código HTTP 200 (*soft 404*). Un 404 "real" requeriría comprobarlo en un Proxy.

### Tareas

- Se gestionan desde el detalle del proyecto: alta rápida (solo título, estado "Pendiente"), cambio de estado con un desplegable que guarda al cambiar y una página de edición para título, descripción, estado y borrado.
- La edición carga la tarea con `loadTaskOrNotFound(projectId, taskId)`: si la tarea es de otro proyecto, responde 404. Así una URL no puede mezclar proyectos.
- Al borrar un proyecto, la base de datos borra sus tareas (`ON DELETE CASCADE`).
- **Orden:** `position` es correlativo dentro de cada proyecto. Cada columna muestra sus tareas ordenadas por `position`. Todo cambio de estado (desplegable, edición o tablero) pasa por `moveTask`, que coloca la tarea al final de su nueva columna con un único `UPDATE` atómico.

### Tablero Kanban

- `/projects/[id]/board`: una columna por estado. En pantallas anchas van en paralelo y en móvil se apilan.
- Cada tarjeta se mueve a la columna anterior o siguiente con botones de un formulario normal: el botón pulsado envía `status`. Funciona con teclado y sin JavaScript, sin Client Components.
- Arrastrar y soltar queda fuera de alcance; necesitaría una librería como `dnd-kit`.

### Progreso

- `calculateProgress(tasks)` en `lib/tasks/progress.ts`: tareas `DONE` entre el total. Devuelve `null` si no hay tareas, y la UI muestra "Sin tareas" en lugar de 0 %.
- Redondeo: al entero más cercano, pero solo se muestra 100 % con todas hechas y al menos 1 % con alguna hecha.
- La lista de proyectos no carga las tareas: `countTasksByProject` cuenta hechas y totales de todos los proyectos en una sola consulta agregada, y `progressFromCounts` calcula el porcentaje.
- Las acciones de tareas revalidan también `/projects` para que la lista muestre el progreso actualizado.

### Dashboard

- La página de inicio muestra los totales de proyectos y tareas por estado y los proyectos `En desarrollo` con su progreso. Si aún no hay proyectos, muestra un mensaje de bienvenida.
- `getDashboardStats(db)` (`lib/dashboard/stats.ts`) reúne las cifras. Su test carga los datos del seed (`seedDatabase`) en una BD en memoria y comprueba las cifras exactas.
- Cualquier acción de proyectos o tareas revalida también `/`.

## Diseño

Inspirado en Twenty CRM (Issues #5 y #21). Capturas en [screenshots/](screenshots/).

- **Estructura:** barra lateral gris con la navegación y el contenido en un panel blanco con borde. En móvil, la barra lateral pasa a ser una barra superior.
- **Pantallas:** cada pantalla usa `<Page>`, con una barra superior (icono, migas, título y acciones; la principal en azul) y el contenido debajo.
- **Etiquetas de estado:** cada estado tiene un color fijo (`PROJECT_STATUS_COLORS`, `TASK_STATUS_COLORS`) que se usa en etiquetas, selectores, columnas del tablero y barras del dashboard. La paleta (`--tag-*`) tiene versión clara y oscura en `globals.css`.
- **Avatares:** inicial del nombre sobre un color derivado del propio nombre, siempre el mismo.
- **Listas:** los proyectos se muestran en tabla, con cabeceras con icono. En pantallas estrechas, la tabla se desplaza dentro de su caja, nunca la página.
- **Iconos:** SVG propios con trazos al estilo Tabler (el set de Twenty), para no añadir una dependencia.

## Convenciones

- Los tests viven junto al archivo que prueban (`*.test.tsx`).
- Imports internos con el alias `@/` (apunta a `src/`).
- Los componentes son Server Components por defecto. Solo se añade `"use client"` cuando hace falta interactividad en el navegador.
- Colores, tipografía y radios se usan a través de design tokens (`text-fg-secondary`, `border-line`…), definidos en `globals.css`.
- Los estados se guardan como códigos en inglés (`IN_PROGRESS`); el texto visible para el usuario se traduce en la UI.
- Los tests de base de datos usan el entorno `node` (`// @vitest-environment node`).
- Los tests de componentes que renderizan más de una vez llaman a `afterEach(cleanup)`: con los globals de Vitest desactivados, Testing Library no desmonta solo.

## Pendiente (fuera de esta fase)

- Autenticación y hosting, solo si la app se publica en internet (ver ADR 0002).
- Formateo automático (Prettier).
