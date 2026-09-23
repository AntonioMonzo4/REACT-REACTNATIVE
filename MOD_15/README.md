# Módulo 15 — Next.js y React Moderno

Material del **Módulo 15** del roadmap (React 19, App Router, SSR/SSG/ISR, Route Handlers, React Compiler).

Este módulo es la puerta de entrada a **Next.js** con la mirada de quien ya sabe React (módulos M4–M14) pero nunca ha tocado un servidor, un router de carpetas ni las siglas SSR/SSG/ISR. Todo el material está en español, con la prosa pensada para quien empieza **de cero en Next.js** manteniendo intactos los ejemplos, tablas y comandos del curso.

## Para quién es este módulo

- **Para ti si** terminaste M4–M14 con React (componentes, hooks, props, estado) y quieres pasar a aplicaciones full-stack modernas.
- **Para ti si** vienes de `create-react-app`/SPA y las palabras *Server Components*, *App Router*, *ISR* o *Route Handlers* te suenan a chino.
- **Para ti si** necesitas entender **cuándo** renderiza Next el HTML (CSR vs SSR vs SSG vs ISR) antes de memorar configuraciones.
- **No hace falta** haber usado Next antes, ni saber Express/base de datos: el módulo arranca explicando las APIs de React 19 (Unidad 01) y avanza por capas hasta los endpoints y el React Compiler.
- Si vienes de **Pages Router** (versiones antiguas), este módulo te reubica: todo se explica con **App Router**, que es la generación actual.

## Contenido

### Teoría (`docs/`)

| Unidad | Tema |
|--------|------|
| [01 — React 19](docs/Unidad_01_React_19.md) | `use()`, Server Actions, `ref` prop, hooks nuevos |
| [02 — Server vs Client](docs/Unidad_02_Server_vs_Client.md) | Fronteras `'use client'`, serialización |
| [03 — File routing y layouts](docs/Unidad_03_File_routing_layouts.md) | `app/`, page/layout/loading/error, params |
| [04 — SSR, SSG, ISR, Streaming](docs/Unidad_04_SSR_SSG_ISR_Stream.md) | Cuándo y `revalidate` / Suspense |
| [05 — Data fetching servidor](docs/Unidad_05_Data_fetching_servidor.md) | `await` en page, parallel, loading/error |
| [06 — Route Handlers y Compiler](docs/Unidad_06_Route_Handlers_Compiler.md) | API routes + memoización automática |

Cada unidad de `docs/` incluye: objetivos, requisitos, prosa para novatos (analogías y “qué significa / por qué importa”), código, tablas, **Errores comunes** con solución, **Conceptos clave** y **Autoevaluación** con respuestas plegadas.

## Cómo estudiar

| Fase | Qué haces | Producto |
|------|-----------|----------|
| **1. Lectura** | Lee las Unidades 01–06 en orden; no te saltes la 02 (server vs client) ni la 04 (SSR/SSG/ISR): son la base conceptual. | Notas propias de cada una. |
| **2. Demo sin servidor** | Recorre `EJEMPLO_MODERNO/` (Vite + React 19): `use()`, `ref` prop, `useActionState`, `useOptimistic`. | Demo corriendo con `pnpm dev`. |
| **3. Manos con Next** | Genera `next-app` (comandos abajo) y reproduce los snippets: SSG en `/`, `await` + `loading` en `app/posts`, `route.js` en `app/api/posts`. | App levantada y `pnpm build` en verde. |
| **4. Proyecto** | Construye la **App full-stack con Next.js** del checklist (pendiente): páginas con distintas estrategias + API + mutaciones con revalidación. | Proyecto del módulo completado. |

## Práctica

El ejemplo completo de Next (`create-next-app`) **no se commitea** aquí para no duplicar `node_modules` pesados en este repo de teoría: usa la guía:

```bash
pnpm dlx create-next-app@latest next-app --ts --app --eslint
cd next-app
# Reproduce: app/page (SSG), app/posts/page (await + loading), app/api/posts/route.js
pnpm dev
pnpm build
```

Qué toca reproducir dentro de `next-app/` (coincide con las unidades):

- `app/page.jsx` → SSG (página estática del build).
- `app/posts/page.jsx` → `await` en el Server Component + `app/posts/loading.jsx`.
- `app/api/posts/route.js` → Route Handler con `GET`/`POST` (Unidad 06).

En `EJEMPLO_MODERNO/` hay una demo **Vite** con React 19 (`use`, `ref` prop, `useActionState` simulado) para practicar sin servidor:

```bash
cd EJEMPLO_MODERNO
pnpm install
pnpm lint
pnpm build
```

## Práctica mínima

Si solo tienes una sesión, haz esto (≈45 min) y considera el módulo “entendido a nivel básico”:

1. Lee las Unidades 01, 02 y 04 — son las tres ideas que sostienen todo lo demás.
2. Corre la demo `EJEMPLO_MODERNO/` (`pnpm install && pnpm dev`) y abre cada archivo de la tabla de su README.
3. Genera `next-app` y crea `app/posts/page.jsx` + `app/posts/loading.jsx` + `app/api/posts/route.js`; comprueba con `pnpm build` y `pnpm dev`.
4. Responde la **Autoevaluación** de las seis unidades sin mirar (usa las respuestas plegadas al corregir).
5. Marca el checklist de abajo y deja el pendiente del proyecto para la sesión siguiente.

## Mapa con el README

- [x] `use()` para leer promesas
- [x] Server Actions (teoría + action simulada)
- [x] `ref` como prop (sin forwardRef)
- [x] Cambios de hooks y layout
- [x] Server Components vs Client Components
- [x] File-based routing y layouts
- [x] SSR, SSG, ISR y Streaming
- [x] Data fetching en el servidor
- [x] Route Handlers (API)
- [x] React Compiler — memoización automática
- [x] Reglas y limitaciones actuales
- [ ] Proyecto: App full-stack con Next.js — *pendiente* (pasos en esta guía)
