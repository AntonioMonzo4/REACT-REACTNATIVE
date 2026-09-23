# Unidad 03 — Redux: Actions y AsyncThunk

## Objetivos

- Diferenciar una **acción síncrona** de un proceso **asíncrono** y por qué este último no puede vivir en el reducer.
- Entender el patrón **thunk**: una función que recibe `dispatch` y `getState` antes de que Redux la ejecute.
- Crear un thunk con `createAsyncThunk` y conocer sus tres estados automáticos: `pending`, `fulfilled`, `rejected`.
- Conectar esos estados al slice con `extraReducers` y un `status` (`idle`/`loading`/`succeeded`/`failed`).
- Despachar una carga de datos desde `useEffect` **sin** provocar bucles de peticiones.
- Conocer la alternativa "a mano" (middleware thunk) para entender qué hace RTK por ti.

## Requisitos

- **M4–M5 — Hooks**: `useEffect` con su array de dependencias (clave para no re-disparar el fetch en cada render) y `useState` para estados de loading/error (ya lo hacías en las unidades de APIs).
- **M6 — Unidad 01 (Context)**: noción de estado compartido y de efectos que se disparan al montar.
- **Unidad 02 de este módulo (Store y Slice)**: debes saber crear un `createSlice`, despachar con `dispatch` y leer con `useSelector`. **Esta unidad no explica eso de nuevo**: solo añade la capa asíncrona encima.
- **Secuencia**: termina esta unidad antes de las **04 (Zustand)** y **05 (Jotai)**, que plantean el mismo problema (cargar datos) con filosofías distintas.

## Acciones síncronas

Ya vistas: `dispatch(increment())` → `{ type: 'counter/increment', payload? }`.

Una acción síncrona es **instantánea**: el store la recibe, ejecuta el reducer y el estado nuevo está listo antes del siguiente frame. Sirve para todo lo que ocurre "de golpe" en la interfaz: sumar, borrar un ítem, cambiar un flag.

> Pista mental: si tu handler no contiene `await`/promesas, es síncrono.

## El problema asíncrono

No puedes hacer `fetch` dentro del reducer. Patrón: **thunk** (función que recibe `dispatch` y `getState`).

### Por qué no puede haber un fetch en el reducer

Recordáis la regla de la Unidad 02: los reducers son **puras**. Un `fetch` es un efecto secundario (habla con el mundo exterior, tarda, puede fallar...). Si lo metes ahí:

- rompes la reproducibilidad (mismo estado + misma acción → distinto resultado),
- los devtools no pueden describir el cambio en un solo paso,
- Immer/Redux no saben "esperar" a que la promesa resuelva.

**Thunk** = **th**read of e**xecution** en la jerga de Redux: una función que, en lugar de un objeto action, le das al store. El middleware de thunk la intercepta y la ejecuta pasándole `dispatch` y `getState`, para que **tú** decidas cuándo despachar las actions síncronas que sí puede entender el reducer (por ejemplo `usuarios/loading`, `usuarios/success`).

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

Anatomía del thunk:

| Parte | Qué es |
|-------|--------|
| `'usuarios/fetchAll'` | **prefijo** del tipo: de aquí saldrán `usuarios/fetchAll/pending`, `/fulfilled` y `/rejected` |
| `async (_, ...)` | el cuerpo: aquí sí hay `await`, `fetch` y toda la lógica de red |
| return de la promesa | si resuelve bien → acción `fulfilled` con ese valor como `payload` |
| `rejectWithValue(msg)` | si fallas **con control**, → `rejected` con `msg` en `payload` (si no, viaja en `action.error.message`) |

Fíjate en el diseño: el thunk **no muta estado**; solo obtiene datos y los devuelve. El que decide qué hacer con ellos es el slice (siguiente sección).

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

Qué significa `extraReducers`: las actions de este slice **no** nacen aquí (no están en `reducers: {}`), sino **fuera**, en el thunk de otra parte del código. "Extra" = ajenas. El builder te deja enganchar `addCase` a cada fase del thunk.

| Estado | Cuándo |
|--------|--------|
| `idle` | aún no se pidió |
| `loading` | thunk en vuelo |
| `succeeded` | `fulfilled` |
| `failed` | `rejected` (con `rejectWithValue` llega el mensaje propio) |

Por qué importa el trío `status` + `error` + `data`: es el **contrato mínimo** de cualquier petición a una API. Con eso puedes pintar pantalla vacía, esqueleto de carga, datos o error sin inventar flags ad-hoc cada vez. Si vienes del M8 (`fetch` con `useState`), el patrón te resultará familiar: es el mismo, solo que el estado vive en el store en vez del componente.

```text
idle → (dispatch) → loading → fulfilled → succeeded
                     loading → rejected → failed
```

## Despachar y condicionar

```jsx
useEffect(() => {
  if (status === 'idle') dispatch(fetchUsuarios())
}, [status, dispatch])
```

Evita re-disparar en cada render: guarda `status` o un flag.

### Por qué ese `if (status === 'idle')`

Un `useEffect` sin dependencias se ejecuta en **cada render**; con `[dispatch]` (que es estable) pasaría lo mismo. Si despacharas sin condición, cada render lanzaría otra petición: bucles infinitos y peticiones duplicadas al servidor. El guard `idle` garantiza: "solo pido la primera vez que me montan". Cuando el thunk termina, `status` deja de ser `idle` y el efecto, al re-ejecutarse, **no** vuelve a pedir.

El otro motivo para condicionar: si el usuario navega y vuelve, no quieres re-descargar si `status === 'succeeded'` (o sí, según la política de la app: para revalidar, un botón "Recargar" que despache otra vez es más explícito — así lo hace el ejemplo del módulo).

## Alternativas a mano

```js
const thunk = ({ dispatch, getState }) => (next) => (action) => {
  if (typeof action === 'function') return action(dispatch, getState)
  return next(action)
}
```

RTK ya incluye `thunk` middleware: no hace falta instalarlo.

Este código es **formato middleware** (función que recibe el "siguiente" en la cadena): si la action recibida es una **función** en vez de un objeto, la ejecuta pasándole `dispatch` y `getState`; si no, la deja pasar al siguiente middleware. Es exactamente lo que permite hacer `dispatch(miFuncionAsync())`. Conocerlo te dice qué "mágica" hace RTK por ti: **nada que no puedas leer en 5 líneas**. No lo escribas en tu app; úsalo solo para entender.

## Errores comunes

**1. Olvidar manejar `rejected` (o no usar `rejectWithValue`).**

```text
Síntoma: la UI queda en "loading" para siempre cuando la API falla
```

Solución: registra los tres casos y usa `rejectWithValue` para llevar tu mensaje.

```js
extraReducers: (builder) => {
  builder
    .addCase(fetchUsuarios.pending, (state) => { state.status = 'loading' })
    .addCase(fetchUsuarios.fulfilled, (state, a) => {
      state.status = 'succeeded'
      state.data = a.payload
    })
    .addCase(fetchUsuarios.rejected, (state, a) => {
      state.status = 'failed'
      state.error = a.payload ?? a.error.message
    })
}
```

**2. Despachar el thunk en el `useEffect` sin condición.**

```text
Error de red en consola: la petición a /api/usuarios se repite en bucle infinito
```

Solución: guarda el disparo tras un guard.

```jsx
// Mal
useEffect(() => { dispatch(fetchUsuarios()) }, [dispatch])

// Bien
useEffect(() => {
  if (status === 'idle') dispatch(fetchUsuarios())
}, [status, dispatch])
```

**3. Mutar `state.data` o asignar fuera de `fulfilled`.**

```text
Síntoma: los datos no aparecen / avisos de estado no serializable
```

Solución: el único sitio donde cambia `data` es `addCase(fetchUsuarios.fulfilled, ...)`; en `pending` solo tocas `status`/`error`.

```js
// Mal: escribir en pending
.addCase(fetchUsuarios.pending, (state, action) => { state.data = action.payload })

// Bien
.addCase(fetchUsuarios.pending, (state) => {
  state.status = 'loading'
  state.error = null
})
```

**4. Tratar `action.payload` de `rejected` como si siempre existiera.**

```text
TypeError: Cannot read properties of undefined (reading 'map')  → a.payload.map(...)
```

Solución: si no usaste `rejectWithValue`, el mensaje va en `action.error.message`. Cubre ambos caminos:

```js
state.error = action.payload ?? action.error.message
```

## En el ejemplo

`fetchProductos` — pending/fulfilled/rejected con botón "Recargar" y estado de error.

Está en `src/features/products/productsSlice.js` y se usa desde `src/components/DemoRedux.jsx`. Pruébalo: pulsa "Recargar", apaga el red y vuelve a pulsar para ver el estado `failed`.

## Conceptos clave

- **Acción síncrona** vs **thunk**: objeto inmediato vs función con `dispatch`/`getState`.
- **Los reducers nunca hacen `fetch`**: los efectos viven en el thunk; el reducer solo recibe datos ya resueltos.
- **`createAsyncThunk('prefijo/accion', asyncCb)`** genera automáticamente `pending`, `fulfilled`, `rejected`.
- **`extraReducers` + `addCase`**: enganchas actions que no nacen en este slice.
- **Contrato de red**: `status` (`idle`/`loading`/`succeeded`/`failed`) + `error` + `data`.
- **`rejectWithValue(msg)`** para errores controlados → `action.payload` en `rejected`.
- **Guard en `useEffect`** (`if (status === 'idle')`) para no re-disparar en cada render.
- RTK **ya trae** el thunk middleware: no se instala ni se configura nada extra.

## Autoevaluación

**1. ¿Por qué no puedo llamar a `fetch` directamente dentro de un reducer de Redux?**

<details><summary>Respuesta</summary>

Porque los reducers deben ser funciones **puras y síncronas**: misma entrada, mismo salida, sin efectos secundarios ni esperas. Un `fetch` es un efecto (tarda, puede fallar, depende de la red) y dejaría el estado "a medias" mientras espera. La lógica de red va en un **thunk** (`createAsyncThunk`), que al resolver despacha actions síncronas (`fulfilled`/`rejected`) que el reducer sí entiende.

</details>

**2. Tu thunk falla y en `rejected` haces `state.error = action.payload`. El error sale `undefined`. ¿Por qué y cómo lo arreglas?**

<details><summary>Respuesta</summary>

`action.payload` solo existe si usaste `rejectWithValue(...)` al rechazar. Si simplemente dejaste que la promesa lanzara la excepción, el mensaje viaja en `action.error.message`. Arreglo: usar `rejectWithValue(e.message)` en el callback **y/o** leer `action.payload ?? action.error.message` en el reducer.

</details>

**3. Explica con tus palabras por qué se escribe `if (status === 'idle')` antes de `dispatch(fetchUsuarios())`.**

<details><summary>Respuesta</summary>

Para que el `useEffect` solo lance la petición la **primera vez** que hace falta (estado inicial). Sin ese guard, el efecto se re-ejecuta en cada render y volvería a despachar el thunk, generando bucles de peticiones. Cuando el thunk termina, `status` deja de ser `idle`, así que aunque el efecto corra de nuevo, no pide nada más (hasta que actives un "Recargar" o el estado vuelva a `idle`).

</details>

**4. ¿Qué tres acciones genera RTK automáticamente al despachar `createAsyncThunk('usuarios/fetchAll', ...)`?**

<details><summary>Respuesta</summary>

`usuarios/fetchAll/pending` (al empezar), `usuarios/fetchAll/fulfilled` (si la promesa resuelve; el valor de return es el payload) y `usuarios/fetchAll/rejected` (si falla). Con `extraReducers` enganchas las tres para pintar `loading` / `succeeded` / `failed`.

</details>
