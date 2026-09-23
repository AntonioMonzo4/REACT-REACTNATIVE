# Unidad 01 — Context como estado global

## Qué encaja en Context

Estado **de app** que muchos componentes leen y pocos cambian con mucha frecuencia:

- sesión de usuario, tema, idioma, feature flags
- datos “de catálogo” cacheados a mano

Context **no** sustituye a un store cuando hay:

- cientos de updates por segundo
- selectores/devtools/time-travel
- estado con reglas complejas (optimistic updates, caches)

## Estructura (repaso M6)

```jsx
// AuthContext.js — solo el createContext
import { createContext } from 'react'
export const AuthContext = createContext(null)

// AuthProvider.jsx — Provider + estado
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  return (
    <AuthContext.Provider value={user ? { user, logout: () => setUser(null) } : { user: null, login: setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

// useAuth.js — hook de consumo
export function useAuth() {
  return useContext(AuthContext)
}
```

## Cuándo es suficiente

| Situación | Herramienta |
|-----------|-------------|
| 1–2 valores globales, updates lentos | Context |
| Mucha lógica + updates frecuentes | Redux Toolkit / Zustand (siguientes unidades) |
| Server cache (API) | React Query / SWR (fuera del roadmap) |

## Errores comunes

1. Meter en Context el estado local de una pantalla (pérdida de re-renders y claridad).
2. Un solo Context gigante → cualquier cambio refresca todo.
3. Crear objetos de `value` nuevos cada render sin `useMemo` → re-renders en cadena.

## En el ejemplo

`ThemeProvider` (tema claro/oscuro) y `CartProvider` (carrito de demo) como Context puros.
