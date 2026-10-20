# Ejemplo React Router — Módulo 7

Proyecto de práctica del **Módulo 7 (React Router)**. Vite + React + `react-router-dom`.

## Qué practica este ejemplo

Rutas con `BrowserRouter`, navegación con `NavLink`, params en la URL (`useParams`), filtros con `useSearchParams`, layouts anidados con `Outlet`, ruta protegida con `RequireAuth` y carga diferida de `/informe` con `React.lazy`.

## Cómo recorrerlo

Orden sugerido:

1. `src/App.jsx` y `src/components/Layout.jsx` — estructura de rutas y navegación.
2. `src/pages/Users.jsx` + `src/pages/UserDetail.jsx` — params (`/usuarios/:userId`).
3. `src/pages/Search.jsx` — query params (`?q=&page=`).
4. `src/pages/Dashboard.jsx` — rutas anidadas.
5. `src/auth/` (`AuthContext.js`, `AuthProvider.jsx`, `useAuth.js`) + `src/components/RequireAuth.jsx` y `src/pages/Login.jsx` — sesión y rutas protegidas.
6. `src/pages/Reporte.jsx` — lazy loading (chunk separado en el build).

## Comandos

```bash
pnpm install
pnpm dev
pnpm lint
pnpm build
```

## Qué demuestra cada archivo

| Archivo | Concepto |
|---------|----------|
| `src/App.jsx` | `BrowserRouter`, `Routes`, rutas lazy, 404 |
| `src/components/Layout.jsx` | `NavLink` activos + `Outlet` |
| `src/pages/Users.jsx` + `UserDetail.jsx` | `useParams` (`/usuarios/:userId`) |
| `src/pages/Search.jsx` | `useSearchParams` (`?q=&page=`) |
| `src/pages/Dashboard.jsx` | Rutas anidadas + layout |
| `src/auth/AuthContext.js` + `AuthProvider.jsx` + `useAuth.js` | Estado de sesión falso (Context) |
| `src/components/RequireAuth.jsx` | Ruta protegida + `Navigate` con `state.from` |
| `src/pages/Login.jsx` | Login y retorno a la ruta original |
| `src/pages/Reporte.jsx` | `React.lazy` (chunk separado en el build) |

## Temario Módulo 7 — estado

- [x] BrowserRouter
- [x] Routes
- [x] Params
- [x] Query Params
- [x] Nested Routes
- [x] Protected Routes
- [x] Lazy Routes
- [ ] Proyecto Sistema de autenticación
