# Ejemplo React Router — Módulo 7

Proyecto de práctica del **Módulo 7 (React Router)**. Vite + React + `react-router-dom`.

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
