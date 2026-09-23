# Unidad 05 — Jotai

## Modelo atómico

En Redux/Zustand el estado suele ser un **árbol**; en Jotai son **átomos** independientes que se componen.

```bash
pnpm add jotai
```

## Átomos primitivos

```jsx
import { atom, useAtom } from 'jotai'

const contadorAtom = atom(0)
const temaAtom = atom('light')

function Contador() {
  const [valor, setValor] = useAtom(contadorAtom)   // como useState global
  return <button onClick={() => setValor((v) => v + 1)}>{valor}</button>
}
```

## Átomos derivados (read-only)

```js
const dobleAtom = atom((get) => get(contadorAtom) * 2)

function Doble() {
  const [doble] = useAtom(dobleAtom)   // o useAtomValue
  return <span>{doble}</span>
}
```

Se recalcula **solo** cuando cambian los átomos de los que depende.

## Escritura derivada

```js
const incrementarAtom = atom(
  null,
  (get, set) => set(contadorAtom, (c) => c + 1),
)
```

## Scope (reemplaza mucha Context)

```jsx
import { Provider } from 'jotai'

<Provider scope={temaAtom}>   // valores aislados por subtree
  <App />
</Provider>
```

## Cuándo Jotai vs el resto

| Caso | Buena opción |
|------|--------------|
| Muchos estados pequeños e independientes | **Jotai** |
| Un dominio de negocio claro (carrito, auth) | RTK / Zustand |
| Cliente server-state cacheado | React Query (M9+ fuera del temario base) |

## En el ejemplo

`jotaiDemo.js` — átomos `contador` + `doble` derivado en la demo de la home.
