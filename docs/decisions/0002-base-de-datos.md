# ADR 0002 — Base de datos: SQLite local con Drizzle

- **Estado:** aceptada
- **Fecha:** 2026-10-28
- **Issue:** #6

## Contexto

El MVP v0.1 necesita guardar proyectos y tareas de forma persistente (ver `docs/vision.md`). Faltaba decidir dónde se ejecuta firednt, solo en local o publicado en internet, porque eso condiciona la base de datos, la autenticación y el hosting.

firednt tiene un único usuario y el objetivo del MVP es tener la herramienta funcionando y aprender con ella, no operar infraestructura.

## Decisión

- **Ejecución solo en local** durante el MVP v0.1. Sin login: el acceso queda protegido por el propio ordenador.
- **SQLite** como base de datos: un único archivo local, sin servidor ni cuentas externas.
- **Drizzle ORM** (versión estable 0.45) con **drizzle-kit** para las migraciones.
- **`@libsql/client`** como driver. Funciona con un archivo SQLite local y con Turso (SQLite en la nube) sin cambiar el código de acceso a datos.

## Alternativas descartadas

- **Publicar ya** (hosting más base de datos en la nube, como Turso o Postgres, más login): exige varios servicios externos y una Issue de autenticación. Es demasiada complejidad para el MVP.
- **Prisma:** buen ORM y muy maduro, pero define el esquema en un lenguaje propio, necesita un paso de generación de código y oculta el SQL. Además, ahora mismo está en transición a la v8 y npm instala por defecto una versión candidata (*release candidate*), no la estable.
- **SQL a mano sin ORM:** sin tipos ni autocompletado. Los errores en nombres de tablas y columnas solo aparecerían al ejecutar.

## Consecuencias

- firednt solo es accesible desde el ordenador donde se ejecuta.
- El archivo de la base de datos no se versiona (`.gitignore`). Los datos de ejemplo se cargan con un script de *seed*.
- Los cambios de estructura se hacen siempre con migraciones de drizzle-kit, que sí se versionan.
- **Camino para publicar en el futuro:** usar Turso con el mismo driver (`@libsql/client`), añadir autenticación y elegir hosting. Requerirá un ADR propio.
- Drizzle 1.0 está en fase candidata. Cuando salga estable, se valorará actualizar.
