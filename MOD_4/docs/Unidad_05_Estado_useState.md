# Unidad 05 — Estado con useState

`useState` es un hook que agrega **estado** a un componente funcional.
Pueden haber varios `useState` en el mismo componente, cada uno con su
propio estado. Cada vez que se actualiza, el componente se vuelve a
renderizar.

## Firma

```jsx
import { useState } from "react"

const [valor, setValor] = useState(valorInicial)

setValor(nuevoValor)          // actualiza y re-renderiza
setValor((prev) => prev + 1)  // updater basado en el anterior
```

## Ejemplos del componente

```jsx
const [count, setCount] = useState(0)
const [name, setName] = useState("")
const [isVisible, setIsVisible] = useState(true)
const [items, setItems] = useState([])
const [auth, setAuth] = useState(false)

<button onClick={() => setCount(count + 1)}>Incrementar</button>

<input value={name} onChange={(e) => setName(e.target.value)} />

{isVisible && <p>¡Puedo mostrar y ocultarme!</p>}

const addItem = () => {
  setItems([...items, `Item ${items.length + 1}`])
}
```

Patrones:

- **Controlado**: `value={name}` + `onChange` → React es la fuente de verdad.
- **Renderizado condicional**: `cond && <jsx />` o ternario.
- **Listas inmutables**: `[...items, nuevo]`, nunca `items.push(...)`.

## En el ejemplo

[`ComponenteHooks.jsx`](../EJEMPLO_REACT/src/components/ComponenteHooks.jsx).
