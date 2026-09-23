# Unidad 01 — BrowserRouter y Routes

## Instalación

```bash
pnpm add react-router-dom
```

## Estructura básica

```jsx
import { BrowserRouter, Routes, Route, Link, NavLink, Navigate } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <nav>
        <NavLink to="/">Inicio</NavLink>
        <NavLink to="/acerca">Acerca</NavLink>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/acerca" element={<Acerca />} />
        <Route path="/antiguo" element={<Navigate to="/acerca" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
```

| Componente | Papel |
|------------|--------|
| `BrowserRouter` | Envuelve la app y lee la URL del historial del navegador |
| `Routes` | Contenedor: elige **una** ruta que coincida |
| `Route` | Asocia `path` → `element` (componente) |
| `Link` | `<a>` que navega sin recargar (SPA) |
| `NavLink` | `Link` + clase activa automática (`isActive`) |
| `Navigate` | Redirección programática (equivale a un redirect) |
| `path="*"` | Comodín: 404 si ninguna ruta coincide |

## NavLink activo

```jsx
<NavLink
  to="/acerca"
  className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
>
  Acerca
</NavLink>
```

## Variantes de router

| Router | Cuándo usarlo |
|--------|---------------|
| `BrowserRouter` | Producción normal (URLs limpias: `/usuarios/1`) |
| `HashRouter` | Hosting estático sin rewrite de rutas (URLs `/#/usuarios/1`) |
| `MemoryRouter` | Tests (no toca el historial real) |

## Reglas

1. **`BrowserRouter` envuelve todo** el que necesita navegar (típicamente en `main.jsx` o `App.jsx`).
2. Dentro de `Routes`, **solo se renderiza la ruta que coincide** (no varias a la vez).
3. El orden de los `<Route>` importa menos que en v6… en React Router v6+ el **ranking** es automático (más específico gana), pero evita solapes confusos.
4. `Link`/`NavLink` **nunca** con `href` a mano: pierdes la navegación SPA.

## En el ejemplo

`src/App.jsx` define `<BrowserRouter>`, `Routes` y el `NavLink` del `Layout`.
