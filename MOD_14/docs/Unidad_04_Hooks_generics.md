# Unidad 04 — Hooks con generics

## useState

```tsx
const [map, setMap] = useState<Record<string, number>>({})

// lazy init con tipo
const [items, setItems] = useState<string[]>(() => leerLocal())
```

## useRef

```tsx
const cache = useRef<Map<string, Producto>>(new Map())
const nodo = useRef<HTMLDivElement | null>(null)
```

## useReducer

```tsx
type State = { count: number }
type Action = { type: 'inc' } | { type: 'add'; payload: number }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'inc': return { count: state.count + 1 }
    case 'add': return { count: state.count + action.payload }
  }
}

const [state, dispatch] = useReducer(reducer, { count: 0 })
// dispatch({ type: 'add', payload: 2 })
// dispatch({ type: 'add' }) // ❌ TS error
```

## useCallback / useMemo

```tsx
const onSelect = useCallback((id: string) => setSel(id), [])
const total = useMemo(() => items.reduce((a, i) => a + i.p, 0), [items])
```

## useSyncExternalStore

```tsx
const snapshot = useSyncExternalStore(
  store.subscribe,
  () => store.getSnapshot(),
  () => store.getSnapshot(), // server snapshot
)
```

## Errores comunes

- `useState()` sin inferir → `undefined` problemático; da el tipo o el initial.
- Discriminated unions mal cerradas en el reducer → `action.payload` en cualquier rama.

## En el ejemplo

`src/hooks/useContador.ts` y reducer tipado en `src/state/contador.ts`.
