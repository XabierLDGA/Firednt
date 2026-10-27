# Visión y alcance del MVP — firednt

> Estado del documento: **aprobado** para el MVP v0.1 (Issue #3).
> El trabajo concreto se sigue en el milestone `MVP v0.1` de GitHub.

## 1. Problema

Desarrollo varios proyectos de software a la vez con ayuda de IA (Claude Code) y no tengo un único sitio donde ver qué proyectos tengo, qué queda por hacer en cada uno y cuánto les falta.

## 2. Usuario

Un único usuario: yo, como desarrollador que dirige sus propios proyectos.

## 3. Objetivo del MVP

Tener **un sitio sencillo donde estén todos mis proyectos, sus tareas y el progreso de cada uno**, con un resumen general de un vistazo.

## 4. Funcionalidades incluidas

### Proyectos

- Ver la **lista de proyectos** y el **detalle** de cada uno.
- **Crear**, **editar** (incluido cambiar su estado) y **eliminar** proyectos.

| Campo | Obligatorio | Ejemplo |
|-------|-------------|---------|
| Nombre | Sí | `firednt` |
| Descripción breve | No | "Gestor de mis proyectos con IA" |
| Estado | Sí | `En desarrollo` |

Estados: `Idea` · `En desarrollo` · `Pausado` · `Terminado`.

### Tareas

- Cada tarea pertenece a **un proyecto**. Al eliminar un proyecto se eliminan sus tareas.
- **Crear**, **editar**, **eliminar** tareas y **cambiar su estado**.

| Campo | Obligatorio | Ejemplo |
|-------|-------------|---------|
| Título | Sí | "Configurar CI" |
| Descripción | No | "Lint, tests y build en cada PR" |
| Estado | Sí | `Por hacer` |

Estados: `Por hacer` · `En curso` · `Hecho`.

### Tablero Kanban

- Vista de las tareas de un proyecto en tres columnas, una por estado.
- Las tareas se mueven entre columnas con botones o un selector (usable con teclado y en móvil).

### Seguimiento de progreso

- Progreso de un proyecto = tareas `Hecho` / total de tareas, en porcentaje.
- Un proyecto sin tareas muestra "Sin tareas" en lugar de 0 %.
- Se ve en la lista y en el detalle de proyectos.

### Dashboard

- Página de inicio con el resumen general: proyectos totales y por estado, tareas por estado y proyectos `En desarrollo` con su progreso.

## 5. Fuera del alcance del MVP

- Arrastrar y soltar en el Kanban.
- Prioridades, fechas límite o etiquetas en las tareas.
- Histórico de versiones y ramas de cada proyecto.
- Conexión automática con GitHub.
- Objetivos y seguimiento de aprendizaje.
- Varios usuarios, equipos o permisos.

## 6. Criterios de éxito

El MVP está terminado cuando:

1. Puedo crear, ver, editar y eliminar proyectos y sus tareas desde la web.
2. Puedo mover tareas entre estados desde el tablero Kanban.
3. Cada proyecto muestra claramente su estado y su progreso.
4. El dashboard resume el estado de todos mis proyectos.
5. Los datos se conservan al cerrar y volver a abrir la aplicación.
6. Uso firednt para registrar mis proyectos reales, empezando por el propio firednt.

## 7. Decisiones

- **Stack:** decidido en [ADR 0001](decisions/0001-stack-inicial.md).
- **Dónde se ejecuta** (solo en local o publicado en internet): pendiente. Se decidirá al empezar la Issue #6 (base de datos), en el ADR 0002. Si se publica, hará falta proteger el acceso con login.
