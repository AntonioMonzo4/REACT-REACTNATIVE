# Unidad 02 — Redux Toolkit: Store y Slice

## Redux en una frase

**Un único store** + **acciones** inmutables + **reducers** puros que devuelven el siguiente estado. RTK reduce el boilerplate clásico.

```bash
pnpm add @reduxjs/toolkit react-redux
```

## Crear un slice

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

## Conectar React

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

## Reglas

1. **Un solo store** por app (módulos = slices).
2. Reducers **puros**: sin `fetch`, sin `Date.now()`, sin mutar fuera de Immer.
3. `payload` describe *qué* cambió; el *cómo* vive en el reducer.
4. Side effects (API) → middleware thunk (por defecto en RTK) o listener middleware.

## En el ejemplo

`src/features/cart/cartSlice.js` — items del carrito con add/remove/clear.
