# Módulo 7 — React Router

Material del **Módulo 7** del roadmap (enrutamiento SPA: rutas, params, anidadas, protegidas y lazy).

## Contenido

### Teoría (`docs/`)

| Unidad | Tema |
|--------|------|
| [01 — BrowserRouter y Routes](docs/Unidad_01_BrowserRouter_y_Rutas.md) | `BrowserRouter`, `Routes`, `Link`/`NavLink`, `Navigate`, 404 |
| [02 — Params](docs/Unidad_02_Params.md) | `useParams`, segmentos `:id`, params vs query |
| [03 — Query Params](docs/Unidad_03_Query_Params.md) | `useSearchParams`, filtros y paginación en la URL |
| [04 — Rutas anidadas](docs/Unidad_04_Rutas_anidadas.md) | `Outlet`, layouts, rutas relativas, `index` |
| [05 — Rutas protegidas](docs/Unidad_05_Rutas_protegidas.md) | `RequireAuth`, login con retorno `state.from` |
| [06 — Rutas lazy](docs/Unidad_06_Rutas_lazy.md) | `React.lazy` + `Suspense`, chunk por ruta |

### Práctica (`EJEMPLO_REACT_ROUTER/`)

Vite + React + `react-router-dom`:

- Layout con `NavLink` activos y `Outlet`
- `/usuarios/:userId` con `useParams`
- `/buscar?q=&page=` con `useSearchParams`
- Dashboard con rutas anidadas (`resumen`, `ajustes`)
- Auth falso en Context + `RequireAuth` en `/informe`
- `/informe` con `React.lazy` (chunk separado)
- 404 con `path="*"`

```bash
cd EJEMPLO_REACT_ROUTER
pnpm install
pnpm dev      # desarrollo
pnpm lint     # ESLint
pnpm build    # producción
```

## Mapa con el README

- [x] BrowserRouter
- [x] Routes
- [x] Params
- [x] Query Params
- [x] Nested Routes
- [x] Protected Routes
- [x] Lazy Routes
- [ ] Proyecto: Sistema de autenticación — *pendiente* (el ejemplo incluye un login de demo)
