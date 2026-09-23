# Unidad 02 — Params (parámetros de ruta)

## Qué son

Segmentos **dinámicos** en el path con `:nombre`. El valor se lee con `useParams`.

```jsx
<Route path="/usuarios/:userId" element={<UserDetail />} />
```

```jsx
import { useParams } from 'react-router-dom'

function UserDetail() {
  const { userId } = useParams()   // { userId: "42" } desde /usuarios/42
  return <h1>Usuario {userId}</h1>
}
```

## Varias params y path compuesto

```jsx
<Route path="/orgs/:orgId/proyectos/:projectId" element={<Proyecto />} />

const { orgId, projectId } = useParams()   // /orgs/acme/proyectos/7
```

## Enlaces con params

```jsx
<Link to={`/usuarios/${user.id}`}>{user.name}</Link>

// o con ruta relativa desde un layout (ver Unidad 04):
<Link to="detalle">   // resuelve relativa a la ruta actual
```

## Params vs Query Params

| | Params (`/usuarios/42`) | Query (`/usuarios?rol=admin`) |
|---|-------------------------|-------------------------------|
| Identifican | ** recurso / página ** | filtros, orden, paginación, flags |
| SEO / compartir | sí (parte de la URL canónica) | sí |
| Obligatorios para render | normalmente sí | no (tienen defaults) |

## Errores comunes

- Olvidar `:userId` en el `path` y luego recibir `undefined` en `useParams`.
- Poner en params cosas que son filtros (`?q=`) en vez de identidad.
- Comparar con `===` sin `Number()` si el path es numérico: **params son strings** (`"42" !== 42`).

## En el ejemplo

`src/pages/UserDetail.jsx` — `/usuarios/:userId` con `useParams` y lista de usuarios.
