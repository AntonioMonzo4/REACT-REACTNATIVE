# Unidad 01 — Context API

## Problema que resuelve

**Prop drilling**: pasar props a través de muchos niveles que no las usan.

Context permite un valor **global** (tema, usuario, idioma…) accesible desde cualquier descendiente sin pasarlo por props en cada nivel.

## Crear y consumir

```jsx
import { createContext, useContext, useState } from 'react'

const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
})

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light')
  const toggleTheme = () =>
    setTheme((t) => (t === 'light' ? 'dark' : 'light'))

  const value = { theme, toggleTheme }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  return useContext(ThemeContext)
}
```

Uso:

```jsx
function Boton() {
  const { theme, toggleTheme } = useTheme()
  return <button onClick={toggleTheme}>{theme}</button>
}
```

## Reglas

1. **Provider arriba** (junto a la raíz o en un slice de la app).
2. El **`value` debe ser un objeto/valor nuevo con cuidado**: si creas `{...}` con funciones nuevas cada render, todos los consumidores re-renderizan. Memórizalo con `useMemo` si el provider es grande.
3. **Separar contextos** (tema vs sesión vs datos remotos): un solo contexto enorme hace re-renderizar a todos por cualquier cambio.
4. Context **no es un store mágico**: no evita re-renders por sí solo.
5. Valor por defecto: inicializa el `createContext` con algo seguro para evitar errores fuera del provider.

## Cuándo usarlo vs estado global

| | Context | Redux/Zustand (M9) |
|---|---------|---------------------|
| Tema, idioma, auth session | ✅ ideal | posible |
| Muchos updates frecuentes | cuidado | mejor store |
| Devtools / time travel | no | sí |

## En el ejemplo

`src/context/ThemeContext.jsx` + `ThemeProvider` en `App.jsx`.
