# Unidad 04 — Zustand

## Por qué

Menos boilerplate que Redux: **store fuera de React**, hooks sin `Provider`.

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

## Zustand vs Redux Toolkit

| | RTK | Zustand |
|---|-----|---------|
| Boilerplate | slices + reducers | un `create()` |
| Devtools/time travel | excelente | middleware opcional |
| Equipos grandes / reglas | más estructura | más libertad |
| Provider | sí | no |

## En el ejemplo

`store/useFavoritosStore.js` — favoritos con persist en localStorage.
