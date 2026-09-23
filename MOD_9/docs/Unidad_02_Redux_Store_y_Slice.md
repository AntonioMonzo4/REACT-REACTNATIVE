# Unidad 02 — Redux Toolkit: Store y Slice

## Objetivos

- Entender el modelo de Redux en una frase: **un único store + acciones + reducers puros**.
- Instalar y configurar Redux Toolkit (`@reduxjs/toolkit`) y `react-redux` en un proyecto Vite.
- Crear un **slice** con `createSlice`: `name`, `initialState`, `reducers` y la exportación de actions y reducer.
- Conectar React al store con `<Provider>`, `useSelector` y `useDispatch`.
- Comprender qué aporta **Immer** (poder "mutar" el estado en el reducer sin romper la inmutabilidad).
- Conocer las reglas de oro de Redux para no pelearte con el depurador más adelante.

## Requisitos

- **M6 — Unidad 01 (Context)**: saber por qué se usa un Provider en la raíz; el `<Provider store={store}>` de react-redux es el mismo concepto con otra librería.
- **M4–M5 — Hooks**: `useState` (sabes lo que es un estado y sus actualizaciones), `useMemo`/`useCallback` (para entender cuándo un selector recalcula).
- **Unidad 01 de este módulo**: haber entendido *cuándo* Context deja de bastar. Esta unidad es la respuesta a ese límite.
- **Secuencia**: termina esta unidad antes de la **03 (Actions y AsyncThunk)**: la 03 asume que ya sabes crear slices y despachar actions síncronas.

## Redux en una frase

**Un único store** + **acciones** inmutables + **reducers** puros que devuelven el siguiente estado. RTK reduce el boilerplate clásico.

### Qué significa cada palabra

- **Store único**: toda la aplicación tiene **una sola caja fuerte** con el estado dentro. No hay tres "stores" peleándose; sí hay *rebanadas* (slices) organizando el interior. ¿Por qué importa? Un único punto de verdad = una sola fuente para depurar: con los devtools puedes inspeccionar **todo** el estado de la app en un panel.
- **Acciones**: son **eventos describidos en un objeto**, siempre con un campo `type` (texto único tipo `'counter/increment'`) y un `payload` opcional con los datos. Ejemplo: `{ type: 'cart/add', payload: { id: 1 } }`. Tú no cambias el estado **directamente**: despachas una acción que *dice qué pasó*.
- **Reducers**: funciones **puras** que reciben `(state, action)` y devuelven el **siguiente** estado. Nunca modifican el estado anterior. "Pura" = misma entrada, misma salida, sin efectos secundarios (nada de `fetch`, `Date.now()`, `localStorage`...).
- **RTK (Redux Toolkit)**: la forma **oficial y moderna** de usar Redux. Redux "clásico" obligaba a escribir a mano actions types, reducers, stores... RTK lo reduce a `createSlice` + `configureStore`.

> Analogía: un restaurante. El cliente (componente) no entra a la cocina (store); **pide** enviando un ticket (acción). El chef (reducer) lee el ticket, prepara el plato y devuelve **un plato nuevo** (siguiente estado). El camarero (react-redux) lleva el plato a la mesa (componente). Si el chef pringa el plato anterior, hay lío: por eso el estado es **inmutable**.

### El ciclo de vida de un cambio

```text
componente → dispatch(increment()) → el store ejecuta el reducer
→ estado nuevo → useSelector notifica a los componentes afectados → re-render
```

Este bucle es **exactamente** lo que hace Context a mano, pero con reglas fijas, un solo store y herramientas de depuración.

## Instalación

```bash
pnpm add @reduxjs/toolkit react-redux
```

- `@reduxjs/toolkit`: la librería de lógica (slices, store, thunks, Immer incluido).
- `react-redux`: los puentes para React (`Provider`, `useSelector`, `useDispatch`).

## Crear un slice

Un **slice** ("rebanada") es la unidad de organización: agrupa estado inicial + acciones de un dominio (contador, carrito, usuarios...).

```js
// features/counter/counterSlice.js
import { createSlice, nanoid } from '@reduxjs/toolkit'

const initialState = { value: 0, items: [] }

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment(state) {
      state.value += 1          // “mutación” segura: Internamente usa Immer
    },
    decrement(state) {
      state.value -= 1
    },
    addBy(state, action) {
      state.value += action.payload
    },
    addItem: {
      reducer(state, action) {
        state.items.push(action.payload)
      },
      prepare(text) {
        return { payload: { id: nanoid(), text } }
      },
    },
  },
})

export const { increment, decrement, addBy, addItem } = counterSlice.actions
export default counterSlice.reducer
```

Vamos pieza por pieza, que es donde se entiende todo:

| Pieza | Qué significa | Por qué importa |
|-------|---------------|------------------|
| `name` | prefijo de las actions (`counter/increment`) | identifica cada acción en los devtools y en `switch`/`addCase` |
| `initialState` | primer estado del slice | solo se usa en el arranque del store |
| `reducers` | acciones **síncronas**; cada clave es una acción | el nombre de la clave **es** el tipo de acción |
| `state` dentro del reducer | proxy de Immer | puedes hacer `state.value += 1` sin mutar de verdad el estado real |
| `action.payload` | datos que acompañan a la acción | describe *qué* cambió |
| `prepare` | hook para "empaquetar" el payload antes de despachar | aquí generas el `id` con `nanoid()`; el reducer no debe hacerlo |
| export de `...actions` | creadores de acciones (`increment()`) | forma segura y tipable de despachar |
| export `default reducer` | la función reducer del slice | es lo que registras en el store |

**Immer** (incluido en RTK) es la clave de la línea `state.value += 1`: por dentro crea una copia inmutable del estado y te deja editarla como si fuera normal. Si en el M5 te costó entender por qué en `useState` no puedes hacer `obj.valor = 5` y necesitabas copias `{...obj}`, aquí RTK te lo ahorra… pero **solo dentro de los reducers**.

## Store

```js
// store.js
import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './features/counter/counterSlice'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    // cart: cartReducer,
  },
})
```

`configureStore` crea la caja fuerte y **registra** cada reducer bajo una clave. La clave define la forma del estado: `state.counter.value`, `state.counter.items`, etc. La clave define la forma del estado: `state.counter.value`, `state.counter.items`, etc. ¿Por qué importa esa forma? Porque la usarás en todos los `useSelector` de la app; si renombras la clave, se rompen todos.

También incluye, por defecto, el middleware de thunk (lo usamos en la Unidad 03) y los devtools de Redux. No tienes que instalar nada más.

## Conectar React

Dos pasos: envolver la app y leer/escribir desde los componentes.

```jsx
// main.jsx
import { Provider } from 'react-redux'
import { store } from './store'

createRoot(...).render(
  <Provider store={store}>
    <App />
  </Provider>,
)
```

```jsx
import { useSelector, useDispatch } from 'react-redux'
import { increment } from './features/counter/counterSlice'

function Contador() {
  const value = useSelector((s) => s.counter.value)
  const dispatch = useDispatch()
  return <button onClick={() => dispatch(increment())}>{value}</button>
}
```

- `useSelector(fn)`: **lee** un trozo del estado. La función recibe el estado **completo** del store y devuelves solo lo que necesitas. Esto es un "selector": cuanto más fino, menos re-renders.
- `useDispatch()`: devuelve la función `dispatch` para **escribir**: solo despachas actions, nunca asignas estado a mano.
- El `<Provider>` es el mismo patrón que el de Context en el M6: un componente en la raíz que pone algo "a alcance" de todos los descendientes.

## Reglas

1. **Un solo store** por app (módulos = slices).
2. Reducers **puros**: sin `fetch`, sin `Date.now()`, sin mutar fuera de Immer.
3. `payload` describe *qué* cambió; el *cómo* vive en el reducer.
4. Side effects (API) → middleware thunk (por defecto en RTK) o listener middleware.

Por qué cada regla:

1. Si creas dos stores "para separar carrito de sesión", pierdes los devtools globales y la trazabilidad. Separa con **slices**, no con stores. (Jotai/Zustand tienen filosofías distintas: verás en las unidades 04–05.)
2. Un reducer impuro rompe la reproducibilidad: los devtools no podrán "rebobinar" el tiempo y los tests se vuelven frágiles. Date.now() dentro del reducer hace que la misma acción produzca estados distintos.
3. Separa **datos** (payload) de **lógica** (reducer). Así el mismo reducer puede servir para varias acciones y las actions quedan como un "diccionario" legible del dominio.
4. Los efectos (API, timers, storage) no son "cambiar estado": son **side effects** y viven fuera del reducer. RTK ya trae thunk middleware para eso → Unidad 03.

## Errores comunes

**1. Intentar mutar el estado desde fuera del reducer.**

```text
TypeError: Cannot assign to read only property (estás haciendo store.getState().counter.value = 5)
```

Solución: solo se cambia el estado despachando una action; la mutación "a mano" desde un componente está prohibida.

```jsx
// Mal
const state = store.getState()
state.counter.value = 10

// Bien
dispatch(addBy(10))
```

**2. Olvidar registrar el reducer en `configureStore`.**

```text
Error: A state named "cart" was found, but the corresponding reducer is undefined
```

Solución: añade la clave y el import en `store.js`.

```js
import cartReducer from './features/cart/cartSlice'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    cart: cartReducer,
  },
})
```

**3. Usar lógica impura dentro de un reducer (`fetch`, `Date.now()`, `Math.random()`).**

```text
Síntoma: en development aparecen avisos de "non-serializable values in state" o
acciones que a veces no hacen lo mismo
```

Solución: el reducer solo transforma; lo impuro va al componente o al thunk (Unidad 03).

```js
// Mal: dentro del reducer
addProducto(state) {
  state.items.push({ id: Math.random(), fecha: Date.now() })
}

// Bien: el id y la fecha viajan en el payload (p. ej. con prepare)
addProducto: {
  reducer(state, action) { state.items.push(action.payload) },
  prepare(datos) { return { payload: { ...datos, id: nanoid() } } },
}
```

**4. Selector "gigante" que devuelve todo el estado.**

```text
Síntoma: cualquier cambio del store re-renderiza mi componente aunque solo leo el tema
```

Solución: selecciona lo mínimo.

```jsx
// Mal
const todo = useSelector((s) => s)

// Bien
const items = useSelector((s) => s.cart.items)
```

## En el ejemplo

`src/features/cart/cartSlice.js` — items del carrito con add/remove/clear.

Ábrelo junto con `src/store.js`: es el patrón completo de esta unidad (slice registrado en el store, actions exportadas, componente despachando con `useDispatch`).

## Conceptos clave

- **Store único** con forma por claves (`state.counter`, `state.cart`).
- **Action**: objeto `{ type, payload? }`; se crea con el action creator del slice.
- **Reducer**: función pura `(state, action) => nextState`; el único sitio legal de cambio.
- **Slice**: `createSlice({ name, initialState, reducers })` → agrupa actions + reducer de un dominio.
- **Immer**: permite `state.value += 1` "como si mutaras" sin perder inmutabilidad.
- **`prepare`**: lugar correcto para calcular ids, fechas... antes de despachar.
- **`configureStore`**: store + thunk middleware + devtools de serie.
- **`<Provider store>`**, **`useSelector`**, **`useDispatch`**: el trío de react-redux.
- **Regla de oro**: los side effects (API) no entran en reducers → Unidad 03.

## Autoevaluación

**1. En tu slice escribes `state.items.push(action.payload)` dentro de un reducer. ¿Estás mutando el estado real de la app? ¿Por qué?**

<details><summary>Respuesta</summary>

No (en los términos que importan): `state` dentro del reducer de `createSlice` es un proxy de **Immer**. Sobre él puedes escribir con estilo "mutante" y Immer genera por debajo una copia inmutable del estado real. Eso sí: fuera de los reducers (en componentes o handlers) esa licencia no existe; allí solo `dispatch`.

</details>

**2. ¿Por qué el `payload` de una action debe describir "qué" y no "cómo"? Dame un ejemplo correcto e incorrecto.**

<details><summary>Respuesta</summary>

Incorrecto: `{ type: 'cart/add', payload: 'el reducer debe buscar el producto y calcular total' }` (la action manda lógica). Correcto: `{ type: 'cart/add', payload: { id: 1, nombre: 'Café', precio: 3 } }`. El payload lleva **datos**; cómo afectan al estado (push al array, recalcular totales...) decide el reducer. Así la lógica queda centralizada y testeable.

</details>

**3. ¿Qué pasa si haces `useSelector((s) => s)` en muchos componentes?**

<details><summary>Respuesta</summary>

Estás seleccionando **todo** el store: cualquier acción que cambie cualquier rebanada hará que esos componentes se re-rendericen (React compara la referencia del objeto devuelto). Se soluciona con selectores finos: `useSelector((s) => s.cart.items)`.

</details>

**4. He creado `cartSlice.js` pero el estado del carrito no aparece en los devtools. ¿Qué revisas primero?**

<details><summary>Respuesta</summary>

Compruebo que el reducer esté **registrado** en `configureStore` (`cart: cartReducer`) con su import; si no está en el objeto `reducer`, ese dominio no forma parte del store. También reviso que despache actions creadas por el slice (`addItem(...)`) y no strings sueltos mal tipeados.

</details>
