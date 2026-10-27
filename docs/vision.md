# Visión y alcance del MVP — firednt

> Estado del documento: **borrador pendiente de aprobación**.
> Las líneas marcadas con _(propuesta)_ son sugerencias de Claude que el usuario aún no ha confirmado.

## 1. Problema

Desarrollo varios proyectos de software a la vez con ayuda de IA (Claude Code) y no tengo un único sitio donde ver qué proyectos tengo y en qué estado está cada uno.

## 2. Usuario

Un único usuario: yo, como desarrollador que dirige sus propios proyectos.

## 3. Objetivo del MVP

Tener **un sitio sencillo donde estén todos mis proyectos y el estado en el que se encuentra cada uno**. Nada más.

## 4. Funcionalidades incluidas

- Ver la **lista de proyectos**.
- **Crear** un proyecto.
- **Editar** un proyecto (incluido cambiar su estado).
- **Eliminar** un proyecto.

Datos de cada proyecto _(propuesta)_:

| Campo | Obligatorio | Ejemplo |
|-------|-------------|---------|
| Nombre | Sí | `firednt` |
| Descripción breve | No | "Gestor de mis proyectos con IA" |
| Estado | Sí | `En desarrollo` |

Estados posibles _(propuesta)_: `Idea` · `En desarrollo` · `Pausado` · `Terminado`.

## 5. Fuera del alcance del MVP

Ideas que el usuario ha mencionado o que forman parte de la visión general, pero que **no** entran en la primera versión:

- Histórico de versiones y ramas de cada proyecto.
- Conexión automática con GitHub.
- Objetivos y seguimiento de aprendizaje.
- Tareas y tablero Kanban.
- Varios usuarios, equipos o permisos.

## 6. Criterios de éxito

El MVP está terminado cuando _(propuesta)_:

1. Puedo crear, ver, editar y eliminar proyectos desde la web.
2. Cada proyecto muestra claramente su estado.
3. Los datos se conservan al cerrar y volver a abrir la aplicación.
4. Uso firednt para registrar mis proyectos reales, empezando por el propio firednt.

## 7. Decisiones pendientes

- Stack tecnológico (se documentará en `docs/architecture.md` y en un ADR).
- Dónde se ejecuta: solo en mi ordenador o publicado en internet. Si se publica, hará falta proteger el acceso con login.
