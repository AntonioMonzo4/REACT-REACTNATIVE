# Unidad 03 — Redux: Actions y AsyncThunk

## Acciones síncronas

Ya vistas: `dispatch(increment())` → `{ type: 'counter/increment', payload? }`.

## El problema asíncrono

No puedes hacer `fetch` dentro del reducer. Patrón: **thunk** (función que recibe `dispatch` y `getState`).

RTK lo empaqueta:

```js
import { createAsyncThunk } from '@reduxjs/toolkit'

export const fetchUsuarios = createAsyncThunk('usuarios/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const res = await fetch('/api/usuarios')
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
  } catch (e) {
    return rejectWithValue(e.message)
  }
})
```

## Estados del ciclo async

```js
const usuariosSlice = createSlice({
  name: 'usuarios',
  initialState: { data: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsuarios.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchUsuarios.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.data = action.payload
      })
      .addCase(fetchUsuarios.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload ?? action.error.message
      })
  },
})
```

| Estado | Cuándo |
|--------|--------|
| `idle` | aún no se pidió |
| `loading` | thunk en vuelo |
| `succeeded` | `fulfilled` |
| `failed` | `rejected` (con `rejectWithValue` llega el mensaje propio) |

## Despachar y condicionar

```jsx
useEffect(() => {
  if (status === 'idle') dispatch(fetchUsuarios())
}, [status, dispatch])
```

Evita re-disparar en cada render: guarda `status` o un flag.

## Alternativas a mano

```js
const thunk = ({ dispatch, getState }) => (next) => (action) => {
  if (typeof action === 'function') return action(dispatch, getState)
  return next(action)
}
```

RTK ya incluye `thunk` middleware: no hace falta instalarlo.

## En el ejemplo

`fetchProductos` — pending/fulfilled/rejected con botón “Recargar” y estado de error.
