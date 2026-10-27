# firednt

Plataforma web personal para gestionar proyectos de software desarrollados con IA.

- Visión y alcance del MVP: [docs/vision.md](docs/vision.md)
- Arquitectura y stack: [docs/architecture.md](docs/architecture.md)
- Decisiones técnicas: [docs/decisions/](docs/decisions/)

## Requisitos

- Node.js 20.9 o superior (desarrollado con Node 24)
- npm

## Puesta en marcha

```bash
npm install
npm run dev
```

Abre <http://localhost:3000>.

## Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo con recarga automática |
| `npm test` | Ejecuta los tests una vez |
| `npm run test:watch` | Ejecuta los tests y los repite al guardar |
| `npm run lint` | Revisa el código con ESLint |
| `npm run typecheck` | Comprueba los tipos de TypeScript |
| `npm run build` | Genera el build de producción |
| `npm start` | Sirve el build de producción |

## Variables de entorno

Copia `.env.example` a `.env.local` si en algún momento hace falta configurar algo. Ahora mismo no se necesita ninguna variable.
