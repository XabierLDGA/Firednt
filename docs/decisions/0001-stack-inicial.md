# ADR 0001 — Stack inicial

- **Estado:** aceptada
- **Fecha:** 2026-10-27
- **Issue:** #1

## Contexto

firednt es una aplicación web personal, para un solo usuario, cuyo MVP es un CRUD de proyectos con su estado. Buscamos un stack moderno, sencillo y bien documentado, que la IA conozca bien y que no obligue a mantener frontend y backend por separado.

## Decisión

- **Next.js 16 (App Router)** con **TypeScript `strict`**: interfaz y lógica de servidor en un único proyecto. El CRUD podrá hacerse con Server Actions, sin una API aparte.
- **Tailwind CSS v4** para los estilos.
- **ESLint** con la configuración oficial de Next.
- **Vitest + Testing Library** para tests unitarios y de componentes, siguiendo la guía oficial de Next.
- **npm** como gestor de paquetes.
- `@types/node` alineado con la versión de Node usada (24).

## Alternativas descartadas

- **Vite + React + API separada (Express o Hono):** más piezas que conectar y desplegar para un CRUD sencillo.
- **Astro:** muy bueno para sitios de contenido, pero menos natural para una app con formularios y datos.
- **Jest en lugar de Vitest:** configuración más pesada con TypeScript y ESM.

## Consecuencias

- Next.js 16 es muy reciente. Hay que consultar su documentación incluida en `node_modules/next/dist/docs/`, porque algunas APIs han cambiado (ver `AGENTS.md`).
- Vitest no soporta Server Components `async`. Cuando aparezcan, se probarán con tests E2E o extrayendo su lógica a funciones puras.
- La base de datos y la autenticación se decidirán en ADRs posteriores.
