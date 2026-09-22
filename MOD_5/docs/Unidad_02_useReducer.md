# Unidad 02 — useReducer

## Qué es

`useReducer` es una alternativa a `useState` para **estado complejo**: un estado que depende de varias acciones, de transiciones, o de varios campos que cambian juntos.

```jsx
import { useReducer } from 'react'

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { ...state, count: state.count + 1 }
    case 'decrement':
      return { ...state, count: state.count - 1 }
    case 'set_step':
      return { ...state, step: action.payload }
    case 'reset':
      return { count: 0, step: 1 }
    default:
      return state
  }
}

function Contador() {
  const [state, dispatch] = useReducer(reducer, { count: 0, step: 1 })

  return (
    <>
      <p>{state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'set_step', payload: 5 })}>
        step = 5
      </button>
      <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
    </>
  )
}
```

## Piezas

- **state**: el objeto/valor inmutable actual.
- **action**: objeto con `type` (y opcional `payload`). También puede ser una función en algunos patrones, pero el objeto es el estándar.
- **reducer**: `(state, action) => newState` — **puro**: sin side effects, sin mutar el state anterior.
- **dispatch**: envía la acción; React vuelve a renderizar si el estado nuevo es distinto.

## useState vs useReducer

| Situación | Preferencia |
|-----------|-------------|
| 1–2 valores primitivos | `useState` |
| Varios campos relacionados | `useReducer` |
| Muchas acciones / lógica de transición | `useReducer` |
| Estado que se pasa a varios hijos | `useReducer` (más predecible) |
| Quieres logs/devtools de acciones | `useReducer` |

## Reglas del reducer

1. **Inmutabilidad**: nunca mutar `state` (spread / map / filter).
2. **Pureza**: misma action → mismo resultado; sin `Date.now()`, `Math.random()`, fetch…
3. **Default**: devolver `state` en `default` (o lanzar error en desarrollo).
4. Los **side effects** (fetch, timers) van en `useEffect` o fuera del reducer, no dentro.

## Acciones tipadas (preparación TS)

En JS:

```js
{ type: 'todo/add', payload: { id, text } }
{ type: 'todo/toggle', payload: id }
```

En el proyecto: lista de tareas con add / toggle / remove / clear.

## En el ejemplo del proyecto

Ver `src/components/DemoUseReducer.jsx` (todo list con reducer).
