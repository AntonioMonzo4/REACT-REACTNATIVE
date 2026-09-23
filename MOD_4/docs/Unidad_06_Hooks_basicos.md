# Unidad 06 — useEffect, useMemo y custom hooks

## useEffect

Efectos secundarios con **deps** (matriz de dependencias):

```jsx
useEffect(() => {
  console.log("cada vez que count cambia")
}, [count])

useEffect(() => {
  console.log("solo al montar")
}, [])

useEffect(() => {
  console.log("cuando auth o items cambian")
}, [auth, items])
```

| Deps | Cuándo corre |
|------|----------------|
| `[x]` | Cuando `x` cambia |
| `[]` | Al montar (y desmontar si hay `return`) |
| Sin array | En cada render |

## useMemo

Memoriza un **valor calculado** para no recalcular en cada render:

```jsx
const expensiveValue = useMemo(() => {
  console.log("Calculando valor costoso...")
  return count * 2
}, [count])
```

Solo se recalcula cuando `count` cambia. (`useCallback` memoriza funciones; ver Módulo 5.)

## Custom hook

Función reutilizable de lógica de estado/efectos. Debe empezar por `use`
y puede usar otros hooks:

```js
import { useState } from "react"

const useCounter = () => {
  const [count, setCount] = useState(0)
  const increment = () => setCount(count + 1)
  const decrement = () => setCount(count - 1)
  return { count, increment, decrement }
}
export default useCounter
```

Uso:

```jsx
const { count, increment, decrement } = useCounter()
<button onClick={decrement}>−</button>
<span>{count}</span>
<button onClick={increment}>+</button>
```

`useContext` se ve en el Módulo 6 (React Avanzado).

## En el ejemplo

- [`ComponenteHooks.jsx`](../EJEMPLO_REACT/src/components/ComponenteHooks.jsx)
- [`ComponenteUseMemo.jsx`](../EJEMPLO_REACT/src/components/ComponenteUseMemo.jsx)
- [`hooks/CustomHooks.js`](../EJEMPLO_REACT/src/hooks/CustomHooks.js)
