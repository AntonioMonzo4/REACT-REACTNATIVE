# Módulo 7 — React Router

Material del **Módulo 7** del roadmap (enrutamiento SPA: rutas, params, anidadas, protegidas y lazy).

## Para quién es este módulo

Para quien ya sabe crear componentes y quiere pasar a navegar entre vistas sin recargar la página: rutas con parámetros, filtros en la URL, layouts anidados, rutas protegidas y carga diferida con `React.lazy`.

## Cómo estudiar (orden recomendado)

| Fase | Unidad | Qué trabajas |
|------|--------|--------------|
| 1 | U01 — U02 | Rutas y params (`BrowserRouter`, `Routes`, `Link`/`NavLink`, `useParams`) |
| 2 | U03 — U04 | Query params y rutas anidadas (`useSearchParams`, `Outlet`, layouts) |
| 3 | U05 — U06 | Rutas protegidas y lazy (`RequireAuth`, `state.from`, `React.lazy` + `Suspense`) |
| 4 | Práctica | Recorrer `EJEMPLO_REACT_ROUTER/` y ejecutar los comandos |

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

## Práctica mínima

1. Leer la teoría siguiendo el orden de la tabla de arriba.
2. Arrancar el ejemplo (`pnpm install` + `pnpm dev`) y recorrer las rutas.
3. Ejecutar `pnpm lint` y `pnpm build` antes de dar el módulo por terminado.

## Mapa con el README

- [x] BrowserRouter
- [x] Routes
- [x] Params
- [x] Query Params
- [x] Nested Routes
- [x] Protected Routes
- [x] Lazy Routes
- [ ] Proyecto: Sistema de autenticación — *pendiente* (el ejemplo incluye un login de demo)
