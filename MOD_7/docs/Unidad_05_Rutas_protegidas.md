# Unidad 05 — Rutas protegidas

## Idea

Ciertas rutas solo si hay sesión. Si no, **redirect al login** (guardando a dónde ibas).

## RequireAuth (patrón envoltorio)

```jsx
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'

function RequireAuth({ children }) {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    // state.from recuerda el destino original
    return <Navigate to="/login" replace state={{ from: location }} />
  }
  return children
}
```

Uso:

```jsx
<Route
  path="/informe"
  element={
    <RequireAuth>
      <Informe />
    </RequireAuth>
  }
/>
```

## Login y retorno

```jsx
function Login() {
  const { login } = useAuth()
  const location = useLocation()
  const from = location.state?.from?.pathname ?? '/'

  const onSubmit = (e) => {
    e.preventDefault()
    const email = new FormData(e.currentTarget).get('email')
    login({ email })
    navigate(from, { replace: true })   // vuelve a la ruta original
  }
  ...
}
```

## Detalles de producción

| Tema | Nota |
|------|------|
| Dónde vive el usuario | Context (demo) o store; el **token** a menudo en cookie httpOnly o storage |
| Proteger solo el cliente | Insuficiente: la **API también debe autorizar** |
| Roles | `<RequireAuth roles={['admin']}>` o chequeo dentro del guard |
| Sesion expirada | Limpiar usuario → el guard redirige solo |

## Errores comunes

- Redirect sin `state.from` → tras login caes en Home y "pierdes" la URL.
- Usar `<Navigate>` sin `replace` → Atrás deja bucles con el login.
- Creer que ocultar el link basta: hay que **envolver la ruta**.

## En el ejemplo

`src/components/RequireAuth.jsx` + `src/auth/` (`AuthProvider`, `useAuth`); ruta `/informe` protegida.
