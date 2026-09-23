# Unidad 04 — Zustand

## Objetivos

- Entender la propuesta de Zustand: **menos boilerplate** que Redux y **sin Provider**.
- Crear un store con `create((set, get) => ({ ... }))` y exponer acciones junto al estado.
- Consumir el store desde componentes con **selectores** y entender por qué afinan los re-renders.
- Añadir **persistencia** a `localStorage` con el middleware `persist`.
- Escribir lógica **asíncrona** directamente dentro de las acciones del store.
- Comparar Zustand con Redux Toolkit en una tabla y elegir según proyecto/equipo.

## Requisitos

- **M4–M5 — Hooks**: `useState` (Zustand se parece mucho: estado + setter, solo que compartido) y `useMemo` (misma idea que aplican los selectores por ti).
- **M6 — Unidad 01 (Context)**: saber por qué se usa un Provider… y **disfrutar de que aquí no hace falta**.
- **Unidades 02–03 (Redux)**: haber pasado al menos una vez por el ciclo store → slice → action → thunk. Zustand resuelve **el mismo problema** con mucha menos ceremonia; comparar solo tiene sentido si conoces la alternativa completa.
- **Secuencia**: puedes llegar aquí tras la 03 sin tocar la 05; **Jotai (05)** usa un modelo (átomos) deliberadamente distinto, mejor entender Zustand antes.

## Por qué

Menos boilerplate que Redux: **store fuera de React**, hooks sin `Provider`.

### Qué significa "menos boilerplate"

En Redux escribías: `createSlice` + actions exportadas + `configureStore` + registrar el reducer + `<Provider>` + `useSelector` + `useDispatch`. En Zustand el mismo caso de uso es **un archivo** con `create()` y **cero** cambios en `main.jsx`.

| Tarea | Redux Toolkit | Zustand |
|-------|---------------|---------|
| Declarar estado + acciones | slice (reducers + actions) | un `create()` con setters |
| Poner el store en la app | `<Provider store>` en la raíz | no hay Provider |
| Leer | `useSelector(s => s.x)` | `useStore(s => s.x)` (o el nombre de tu store) |
| Escribir | `dispatch(action())` | `store.add(item)` directo |
| Archivos típicos de un dominio | slice + actions + a veces selectors | 1 |

**"Store fuera de React"**: el store de Zustand es un objeto con closures que vive en un **módulo JS** (se crea al importarlo), no dentro del árbol de componentes. Los hooks que provee solo **leen** ese objeto externo. Por eso no necesitas envolver la app: el módulo es el "Provider" implícito.

> Analogía: Redux es una oficina con procedimientos escritos (formularios, sellos, cadenas de mando). Zustand es una pizarra compartida en la pared: cualquiera con el marcador (el store) cambia lo suyo y todos los que la miran (los hooks) lo ven. Misma comunicación, mucho menos papeleo.

**Cuándo esta libertad es una trampa**: en equipos grandes, sin convención, cada uno organiza su store a su manera. RTK impone estructura por ti. La tabla final de esta unidad resume la disyuntiva.

## Instalación

```bash
pnpm add zustand
```

## Store básico

```js
// store/useCartStore.js
import { create } from 'zustand'

export const useCartStore = create((set, get) => ({
  items: [],
  add: (item) =>
    set((s) => ({ items: [...s.items, item] })),
  remove: (id) =>
    set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
  clear: () => set({ items: [] }),
  totalItems: () => get().items.length,
}))
```

Lectura guiada:

- `create(receive)`: el callback recibe **`set`** (para cambiar el estado parcialmente: `set({ clave: valor })` o `set(estado => ...)`) y **`get`** (para leer el estado actual **dentro** de una acción, p. ej. en `totalItems`).
- Estado y acciones **viven juntos** en el mismo objeto: `items` junto a `add`. Eso significa que los componentes no necesitan importar actions sueltas: todo lo que devuelve el hook es la interfaz completa del dominio.
- Especificación funcional: `set((s) => ({ items: [...s.items, item] }))` devuelve un **objeto parcial** nuevo — misma disciplina de inmutabilidad que en `useState` del M5 (allí era `setState(s => ...)`; aquí es `set(s => ...)`).
- `totalItems` es una acción "de lectura calculada": en Jotai sería un átomo derivado (Unidad 05), en RTK un selector. No hay una forma canónica: elige la que encaje.

## Uso (sin Provider)

```jsx
function Carrito() {
  const items = useCartStore((s) => s.items)
  const add = useCartStore((s) => s.add)
  // o:
  // const { items, add } = useCartStore()
  return <button onClick={() => add({ id: 1 })}>{items.length}</button>
}
```

El selector re-renderiza el componente **solo** si cambia ese trozo de estado.

### Qué significa "selector" aquí

- `useCartStore((s) => s.items)`: le dices **exactamente** qué trozo te interesa. Zustand guarda el resultado y, cuando alguien hace `set(...)`, compara: si tu trozo no cambió de referencia, **no** re-renderiza tu componente.
- La alternativa `useCartStore()` (sin función) devuelve **el store entero**: funciona, pero rompe la ventaja anterior (cualquier `set` de cualquier acción re-renderiza). Úsala solo en componentes baratos o en tests.
- La línea `const add = useCartStore((s) => s.add)` casi nunca cambia de referencia (las acciones se crean una vez), así que es gratis.

Mentalidad si vienes de Redux: aquí **no hay** `dispatch`; llamas a la acción como si fuera un método del store (`add(...)`). El "quién cambia qué" se resuelve leyendo el archivo del store en vez de seguir el `type` de una action.

## Persistencia

```js
import { persist } from 'zustand/middleware'

export const useThemeStore = create(
  persist(
    (set) => ({ theme: 'light', toggle: () => set((s) => ({ theme: s.theme === 'light' ? 'dark' : 'light' })) }),
    { name: 'theme' },
  ),
)
```

**Middleware** = capa que envuelve el `create` y añade comportamiento sin que tu código se entere. `persist` serializa el estado a `localStorage` en cada `set` y lo rehidrata al cargar la página.

- `{ name: 'theme' }` es la **clave** en `localStorage`: sin ese nombre no sabrías dónde mirar ni podrías limpiarlo desde devtools.
- Guarda **solo lo que quieras persistir**: si metes ahí tokens sensibles o datos volátiles, se quedan congelados en el navegador. En el ejemplo, `persist` se usa para **favoritos** (sobreviven a F5 por diseño) mientras el carrito vive solo en memoria.
- Para persistir una **parte** del estado existe `partialize` (no lo usa el ejemplo, pero es el siguiente paso si lo necesitas).

> Regla práctica: *¿espero que el usuario conserve esto tras recargar?* Sí → persist. No → estado normal.

## Asíncrono

```js
fetchProductos: async () => {
  set({ status: 'loading' })
  try {
    const res = await fetch('...')
    set({ items: await res.json(), status: 'ok' })
  } catch (e) {
    set({ status: 'error', error: e.message })
  }
},
```

En Redux esto era un `createAsyncThunk` + `extraReducers` (Unidad 03). Aquí es simplemente... una acción `async` dentro del store: llamas a `fetch` y luego `set`. **No hay reducers que enganchar ni tres casos que registrar** — el mismo patrón `loading → ok | error` que aprendiste con `useState` en el M8, solo que el estado es global.

Por qué importa esta diferencia: para aprendizaje, escribir primero la versión RTK y luego esta hace **evidente** cuánto boilerplate aporta RTK y cuánta estructura te regala a cambio. Ninguna es "la correcta" en abstracto: la Unidad 06 da criterios.

## Zustand vs Redux Toolkit

| | RTK | Zustand |
|---|-----|---------|
| Boilerplate | slices + reducers | un `create()` |
| Devtools/time travel | excelente | middleware opcional |
| Equipos grandes / reglas | más estructura | más libertad |
| Provider | sí | no |

Cómo usarla en una decisión real:

- **RTK**: hay un equipo, varias personas tocarán el store, quieres acciones auditables en los devtools y tests predecibles. La estructura "te obliga" a hacerlo bien.
- **Zustand**: app mediana, poca gente, valoras velocidad y no quieres tocar `main.jsx`. Añade `devtools` de middleware si quieres trazabilidad.
- Ninguna opción te cierra la puerta: migrar de una a otra es trabajo, pero los **conceptos** (acciones, estado inmutable, selectores finos) son los mismos.

## Errores comunes

**1. Selectores gigantes: `useStore(s => s)`.**

```text
Síntoma: escribir en cualquier input re-renderiza la pantalla entera
```

Solución: selecciona el trozo mínimo que usas.

```jsx
// Mal
const store = useCartStore((s) => s)

// Bien
const items = useCartStore((s) => s.items)
```

**2. Devolver referencias nuevas sin querer en el selector.**

```text
Síntoma: bucles de render o "The result of getSnapshot should be cached"
```

Solución: que el selector devuelva el estado guardado, no un objeto/armado nuevo en cada llamada.

```jsx
// Mal: crea un array nuevo en cada render → siempre "diferente"
const visible = useCartStore((s) => s.items.filter((i) => i.visible))

// Bien (o memoriza con useMemo fuera del selector)
const items = useCartStore((s) => s.items)
const visible = useMemo(() => items.filter((i) => i.visible), [items])
```

**3. Olvidar que las acciones también se suscriben... o no hace falta suscribirlas.**

```text
Síntoma confuso: "el setter desaparece" o re-renders inúiles al pasar la acción entera
```

Solución: las acciones casi nunca cambian; puedes extraerlas fuera del componente (vía `useCartStore.getState()` o un selector) y, sobre todo, no envolver componentes enteros en el hook si solo necesitas un botón.

```jsx
// Suficiente: el botón solo lee items
function SoloItems() {
  const items = useCartStore((s) => s.items)
  return <span>{items.length}</span>
}
```

**4. Persistir estado que no debe sobrevivir a un refresh.**

```text
Síntoma: al recargar, el carrito/lo que sea reaparece "de la nada" y el usuario no entiende
```

Solución: aplica `persist` solo a lo que debe durar (favoritos, tema, onboarding) y revisa la clave de `{ name: '...' }`.

## En el ejemplo

`store/useFavoritosStore.js` — favoritos con persist en localStorage.

Compáralo con `src/features/cart/cartSlice.js` (el mismo concepto "añadir/ quitar" en RTK) y con `DemoZustand.jsx` para ver el consumo en componentes.

## Conceptos clave

- **Zustand**: store **fuera de React**, hooks como puente, **sin Provider**.
- **`create((set, get) => ...)`**: estado + acciones en un mismo objeto; `set` cambia, `get` lee.
- **Selector** `(s) => s.x`: define cuándo tu componente se re-renderiza; evita `(s) => s`.
- **`persist`**: middleware de `localStorage`; usa `{ name: 'clave' }` y guarda solo lo durable.
- **Asíncrono a mano**: acción `async` + `set` de `loading/ok/error` (equivalente simple a AsyncThunk).
- **Boilerplate vs estructura**: RTK = más piezas y más reglas; Zustand = menos piezas y más libertad.
- Mismos conceptos de inmutabilidad y "acciones" que en RTK, con sintaxis de hooks.

## Autoevaluación

**1. ¿Por qué no hace falta un `<Provider>` en Zustand si en Context y Redux sí?**

<details><summary>Respuesta</summary>

Porque el store no vive dentro del árbol de React: es un objeto creado al importar el módulo (`create(...)` se ejecuta una vez) y todos los componentes importan ese mismo módulo. Los hooks (`useCartStore`) simplemente se **suscriben** al objeto externo. En Context/Redux, en cambio, el valor se inyecta por jerarquía de componentes, y eso requiere un Provider en la raíz.

</details>

**2. Comparo `useCartStore((s) => s.items)` con `useCartStore()`. ¿Cuál y cuándo?**

<details><summary>Respuesta</summary>

Usa el primero (con selector) en componentes reales: solo se re-renderiza si `items` cambia de referencia. El segundo devuelve el store entero y re-renderiza ante **cualquier** `set` de ese store; está bien para pruebas, inspección rápida o componentes triviales, pero no como práctica habitual.

</details>

**3. Quiero que el tema (claro/oscuro) sobreviva a F5 pero que el carrito no. ¿Cómo lo planteo?**

<details><summary>Respuesta</summary>

Aplico el middleware `persist` solo al store del tema (con `{ name: 'theme' }`) y dejo el carrito como store normal sin persistir. Así solo se serializa a `localStorage` lo que el usuario espera conservar; además conviene revisar con `partialize` si dentro del mismo store hubiera datos que no deben guardarse.

</details>

**4. En Redux la carga de datos era `createAsyncThunk` + tres `addCase`. ¿Qué hago en Zustand y qué pierdo/gano?**

<details><summary>Respuesta</summary>

Escribo una acción `async` en el store: `set({ status: 'loading' })`, `await fetch(...)`, `set({ items, status: 'ok' })` o `set({ status: 'error', error })`. Gano: mucha menos ceremonia y el mismo patrón `loading/ok/error` de `useState`. Pierdo: los tipos de action automáticos, la trazabilidad en devtools de cada transición y la estructura impuesta a un equipo.

</details>
