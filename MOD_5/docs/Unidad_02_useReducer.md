# Unidad 02 — useReducer

## Objetivos

- Entender qué es `useReducer` y cuándo es una mejor alternativa a `useState`.
- Identificar las 4 piezas del patrón: `state`, `action`, `reducer` y `dispatch`.
- Aplicar las reglas del reducer: inmutabilidad, pureza, `default` y side effects fuera.
- Escribir acciones con naming estilo Redux (`todo/add` con `payload`) como preparación para TypeScript.
- Construir un Contador completo y leer el todo list real: `../EJEMPLO_REACT_INTERMEDIO/src/components/DemoUseReducer.jsx`.
- Elegir con criterio entre `useState` y `useReducer` en un caso real (tabla comparativa).

## Requisitos

Antes de empezar esta unidad deberías dominar lo visto en M4 (unidades U05–U06):

- **Componentes y props**: crear funciones que devuelven JSX y recibir datos del padre.
- **`useState`**: declarar estado, actualizarlo y saber que cada actualización provoca un re-render.
- **`useEffect`**: ejecutar código tras pintar y entender el array de dependencias.

Conviene haber leído también la Unidad 01 (`useRef`), porque la tabla final de esta unidad compara `useState` con `useReducer`, y el mismo hábito de "¿esto debe re-pintar?" sigue aplicando.

## Qué es useReducer

`useReducer` es una alternativa a `useState` para **estado complejo**: un estado que depende de varias acciones, de transiciones (de un estado a otro), o de varios campos que cambian juntos y de forma coordinada.

Con `useState` tú dices **qué valor nuevo quieres**. Con `useReducer` tú dices **qué pasó** (una acción), y una función aparte —el *reducer*— decide cómo cambia el estado a partir de ahí.

### Analogía 1: la máquina de vending

Piensa en una máquina expendedora:

1. Tú metes una **moneda** y pulsas un **botón** (por ejemplo, "Coca-Cola").
2. La máquina recibe tu **acción** (`{ type: 'comprar', payload: 'cola' }`).
3. Según su programación interna (el **reducer**), calcula el **resultado**: te suelta la lata y descuenta el saldo (**nuevo estado**).

Tú nunca abres la máquina y cambias el saldo a mano (eso sería mutar el estado); solo envías acciones y la máquina decide.

### Analogía 2: el cajero que devuelve una caja nueva

El reducer es como un **cajero**: recibe la caja actual del dinero (**state**) más tu **acción** ("retirar 20 €") y te devuelve **una caja nueva** con el dinero ya ajustado. Nunca modifica la caja que tú llevabas encima (inmutabilidad), y si le pides algo que no entiende, te devuelve **la misma caja** sin cambios (`default`).

### ¿Por qué importa?

Cuando el estado tiene 2 campos, 3 botones y reglas ("si el texto está vacío, no añadas"), actualizarlo con varios `setX` dispersos se vuelve frágil: quién actualiza qué, en qué orden, con qué valores. `useReducer` **concentra toda la lógica de transición en un único sitio**, el reducer, que puedes leer, probar y (más adelante) tipar en TypeScript sin tocar la UI.

## Las piezas, una a una

- **state**: el objeto/valor **inmutable** actual. Es la "caja" que el reducer recibe y de la que deriva la siguiente. Nunca lo modifiques por dentro.
- **action**: un objeto con `type` (qué pasó) y, opcionalmente, `payload` (los datos de esa acción). Es el mensaje que envías con `dispatch`. El objeto con `type` es el estándar (el mismo patrón que usa Redux); también existen patrones con funciones, pero no los verás en este curso.
- **reducer**: la función pura `(state, action) => newState`. Es la "programación de la máquina": dado un estado y una acción, devuelve el estado siguiente. No pinta nada, no toca el DOM, no hace fetch.
- **dispatch**: la función que **envía** la acción al reducer. React vuelve a renderizar si el estado nuevo es distinto al anterior. `dispatch` no "devuelve" el nuevo estado en el momento: lo guarda React y lo verás en el próximo render (igual que `setState`).

Flujo completo:

```javascript
dispatch({ type: 'increment' })
        │
        ▼
reducer(state, action)  →  newState
        │
        ▼
React actualiza el estado y re-renderiza el componente
```

## Ejemplo completo: Contador

El ejemplo base de la unidad, idéntico al del curso. Observa cómo `increment`, `decrement`, `set_step` y `reset` conviven en un único switch:

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

Lectura del ejemplo:

1. **Estado inicial**: `{ count: 0, step: 1 }` — un objeto con dos campos relacionados. Es exactamente el tipo de estado que empieza a doler con varios `useState`.
2. **`dispatch({ type: 'increment' })`**: el botón no calcula nada; solo dice "pasó un incremento". El reducer decide que eso significa `count + 1` y conserva `step` gracias al spread.
3. **`payload`**: `set_step` necesita un dato extra (el número 5). Va en `action.payload`. Es costumbre de Redux: `type` = qué, `payload` = con qué.
4. **`reset`**: devuelve un objeto **nuevo completo** `{ count: 0, step: 1 }` — no hace falta copiar lo anterior si reemplazas todo.
5. **`default`**: si llega una acción desconocida, devuelve `state` tal cual. React, al ver que el estado "es el mismo", **no** re-renderiza de más.

## useState vs useReducer

| Situación | Preferencia |
|-----------|-------------|
| 1–2 valores primitivos (un número, un string) | `useState` |
| Varios campos relacionados que cambian juntos | `useReducer` |
| Muchas acciones / lógica de transición | `useReducer` |
| Estado que se pasa a varios hijos | `useReducer` (más predecible) |
| Quieres logs/devtools de acciones | `useReducer` |

¿Cómo elegir en la práctica? Pregúntate: **¿la lógica de actualización cabe cómoda en una línea de `setState`?** Si sí, `useState`. Si necesitas leer el estado anterior, coordinar varios campos o distinguir entre muchas formas de cambiar, `useReducer`.

## Reglas del reducer

Estas reglas no son estilo: tienen un **porqué** técnico.

### 1. Inmutabilidad: nunca mutar `state`

```javascript
// MAL
case 'increment':
  state.count += 1
  return state

// BIEN
case 'increment':
  return { ...state, count: state.count + 1 }
```

**Por qué:** React compara el estado anterior y el nuevo por referencia (`===`) para decidir si re-renderiza. Si mutas y devuelves el mismo objeto, React cree que "nada cambió" y puede no pintar. Para arrays usa `map`, `filter`, `[...]` — nunca `push` ni `sort` sobre el state.

### 2. Pureza: misma acción → mismo resultado

```javascript
// MAL: el resultado no se puede reproducir
case 'add':
  return { ...state, id: Math.random() }   // Math.random, Date.now...

// BIEN: el id viene en la action (decidido fuera)
case 'add':
  return { ...state, items: [...state.items, action.payload] }
```

**Por qué:** React puede llamar al reducer más de una vez en desarrollo (StrictMode) para detectar bugs. Si el reducer es impuro, cada llamada da un resultado distinto y ves parpadeos o estados imposibles.

### 3. `default`: devolver `state` siempre

```javascript
default:
  return state
```

**Por qué:** un typo en `dispatch({ type: 'incment' })` no debería romper la app: el reducer devuelve el estado intacto. En desarrollo también puedes lanzar un error explícito para cazar typos pronto:

```javascript
default:
  throw new Error(`Acción desconocida: ${action.type}`)
```

### 4. Side effects fuera del reducer

```javascript
// MAL: fetch dentro del reducer
case 'load':
  fetch('/api').then(...)   // ¡no!
  return state

// BIEN: el effecto vive en useEffect, el reducer solo calcula estado
useEffect(() => {
  fetch('/api').then(r => r.json())
    .then(data => dispatch({ type: 'load/ok', payload: data }))
}, [])
```

**Por qué:** el reducer debe ser predecible y testeable sin React. Fetch, timers, `localStorage` y DOM son efectos secundarios: van en `useEffect` (o en handlers de eventos), que luego **envían** una acción cuando terminan.

## Acciones tipadas (naming estilo Redux, preparación TS)

En Redux se acostumbra a nombrar las acciones como `recurso/acción`, y a llevar los datos en `payload`. Así los `type` no colisionan entre sí y, más adelante en TypeScript, se convierten en uniones de strings muy cómodas.

En JS:

```javascript
{ type: 'todo/add', payload: { id, text } }
{ type: 'todo/toggle', payload: id }
{ type: 'todo/remove', payload: id }
{ type: 'todo/clear_done' }
```

Conviene extraer los strings a constantes cuando crezcan:

```javascript
const ADD = 'todo/add'
dispatch({ type: ADD, payload: nuevaTarea })
```

En el proyecto: lista de tareas con **add / toggle / remove / clear** (más `set_filter`), exactamente con este estilo.

## En el ejemplo del proyecto

Ver `../EJEMPLO_REACT_INTERMEDIO/src/components/DemoUseReducer.jsx`: un todo list con reducer. Su estado es un objeto de dos campos —el patrón que motivó `useReducer`—:

```javascript
const initialTodos = { items: [], filter: 'all' }
```

Acciones que implementa:

| `type` | `payload` | Qué hace |
|--------|-----------|----------|
| `add` | `text` (string) | Añade `{ id, text, done: false }` si el texto no está vacío |
| `toggle` | `id` | Cambia `done` de la tarea con ese id (`map`) |
| `remove` | `id` | Elimina la tarea con ese id (`filter`) |
| `clear_done` | — | Quita todas las terminadas (`filter`) |
| `set_filter` | `'all' \| 'active' \| 'done'` | Cambia qué tareas se muestran |

Fíjate en dos detalles del código real:

- El reducer **valida** dentro de su caso: en `add`, `if (!text) return state` — devolver el mismo estado es la forma estándar de decir "esta acción no cambió nada".
- El input del texto vive en un `useState` aparte (`text` / `setText`), porque es un campo controlado clásico de formulario; el **estado complejo** (items + filter) va en el reducer. Los dos enfoques conviven bien.

## Errores comunes

### Error 1: Mutar el `state` dentro del reducer

**Qué pasa:** devuelves el mismo objeto (o mutas un array con `push`) y React no detecta el cambio, o un memo deja de funcionar.

```jsx
function malReducer(state, action) {
  switch (action.type) {
    case 'add':
      state.items.push(action.payload)  // muta el array anterior
      return state                      // misma identidad → React no pinta
    default:
      return state
  }
}
```

**Solución:** crea un estado nuevo sin tocar el anterior:

```jsx
function bienReducer(state, action) {
  switch (action.type) {
    case 'add':
      return { ...state, items: [...state.items, action.payload] }
    default:
      return state
  }
}
```

### Error 2: Meter side effects (fetch, timers, alert) en el reducer

**Qué pasa:** el reducer deja de ser predecible; en StrictMode se ejecuta dos veces y disparas peticiones duplicadas o alertas fantasmas.

```jsx
case 'load':
  fetch('/api/todos').then(r => r.json())   // efecto secundario
  return state
```

**Solución:** el fetch va en `useEffect`; cuando termina, despachas una acción con el resultado:

```jsx
useEffect(() => {
  let cancelado = false
  fetch('/api/todos')
    .then((r) => r.json())
    .then((data) => {
      if (!cancelado) dispatch({ type: 'load/ok', payload: data })
    })
  return () => { cancelado = true }
}, [])
```

### Error 3: Olvidar el `default` (o devolver `undefined`)

**Qué pasa:** una acción desconocida hace que el reducer devuelva `undefined` y la app revienta al leer `state.count` de `undefined`.

```jsx
function malReducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { ...state, count: state.count + 1 }
    // sin default: si llega otra acción → undefined
  }
}
```

**Solución:** cierra siempre el switch con `default: return state` (o lanza un error explicativo en desarrollo).

### Error 4: Escribir mal el `type` al despachar

**Qué pasa:** el typo hace que caigas en `default`; la UI "no responde" pero no ves ningún error si el default devuelve state.

```jsx
<button onClick={() => dispatch({ type: 'incement' })}>+</button>
```

**Solución:** extrae los types a constantes compartidas entre el reducer y los despachantes, o lanza en `default` durante el desarrollo. En TypeScript (más adelante) esto lo elimina el compilador.

## Conceptos clave

- `useReducer` gestiona **estado complejo**: varios campos y muchas formas de cambiar.
- Las 4 piezas: **state**, **action** `{ type, payload }`, **reducer** puro y **dispatch**.
- El flujo: `dispatch(action)` → `reducer(state, action)` → nuevo estado → re-render.
- Reglas del reducer: **inmutabilidad**, **pureza**, **`default` siempre**, **side effects fuera** (en `useEffect` o handlers).
- Naming estilo Redux: `recurso/acción` (`todo/add`) con datos en `payload`.
- Tabla de decisión: primitivos aislados → `useState`; campos coordinados/lógica → `useReducer`.
- El ejemplo del proyecto (`DemoUseReducer.jsx`) combina reducer (items + filter) y `useState` (texto del input).

## Autoevaluación

1. ¿Cuál es la diferencia fundamental entre decir `setCount(1)` con `useState` y hacer `dispatch({ type: 'set', payload: 1 })` con `useReducer`?

<details>
<summary>Respuesta</summary>

Con `useState` tú dices **qué valor nuevo quieres**. Con `useReducer` dices **qué pasó** (una acción); la decisión de cómo cambia el estado vive en una función externa, el reducer, que concentra toda la lógica de transición.
</details>

2. Mi reducer hace `state.items.push(nuevo)` y `return state`. ¿Por qué la lista no se actualiza en pantalla?

<details>
<summary>Respuesta</summary>

Porque estás **mutando** el estado anterior y devolviendo la misma referencia. React compara por identidad y cree que nada cambió. Solución: `return { ...state, items: [...state.items, nuevo] }`.
</details>

3. Necesito hacer un `fetch` al montar y guardar la respuesta en el estado. ¿Dónde va el fetch: dentro del reducer o fuera?

<details>
<summary>Respuesta</summary>

**Fuera**, en un `useEffect`. El reducer debe ser puro (misma acción → mismo resultado, sin side effects). Cuando el fetch termina, haces `dispatch({ type: 'load/ok', payload: data })` y el reducer guarda la respuesta.
</details>

4. ¿Por qué conviene el naming `todo/add` en vez de un simple `add`?

<details>
<summary>Respuesta</summary>

El prefijo `recurso/` evita colisiones cuando varios reducers o features usan el mismo nombre genérico (`add`), sigue el estándar de Redux y prepara el terreno para TypeScript (uniones de strings claras). En `DemoUseReducer.jsx` las acciones cortas (`add`, `toggle`) viven en un único reducer, pero el estilo con prefijo es el recomendado al crecer.
</details>
