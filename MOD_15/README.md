# Módulo 15 — Next.js y React Moderno

Material del **Módulo 15** del roadmap (React 19, App Router, SSR/SSG/ISR, Route Handlers, React Compiler).

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

### Práctica

El ejemplo completo de Next (`create-next-app`) **no se commitea** aquí para no duplicar `node_modules` pesados en este repo de teoría: usa la guía:

```bash
pnpm dlx create-next-app@latest next-app --ts --app --eslint
cd next-app
# Reproduce: app/page (SSG), app/posts/page (await + loading), app/api/posts/route.js
pnpm dev
pnpm build
```

En `EJEMPLO_MODERNO/` hay una demo **Vite** con React 19 (`use`, `ref` prop, `useActionState` simulado) para practicar sin servidor:

```bash
cd EJEMPLO_MODERNO
pnpm install
pnpm lint
pnpm build
```

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
