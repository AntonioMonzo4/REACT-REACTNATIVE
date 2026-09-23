# Unidad 04 — Custom Hooks Avanzados

## De básico a avanzado

| Nivel | Ejemplos |
|-------|----------|
| Básico (M4–M6) | `useCounter`, `useLocalStorage`, `useFetch` |
| Medio | `useDebounce`, `useOnClickOutside`, `useMediaQuery` |
| Avanzado | genéricos TS, deps controladas, cleanup robusto, `useSyncExternalStore` |

## Genéricos (con TS)

```ts
function useSet<T>(initial: T[] = []) {
  const [set, setSet] = useState<Set<T>>(() => new Set(initial))
  const add = useCallback((v: T) => setSet((s) => new Set(s).add(v)), [])
  return { set, add }
}
```

## External store (React 18+)

```js
import { useSyncExternalStore } from 'react'

function useStoreExterno(store) {
  return useSyncExternalStore(store.subscribe, store.getSnapshot)
}
```

Útil para stores de terceros (Zustand lo usa por debajo).

## Reglas de oro

1. **Prefijo `use`** y llamadas **solo en top level** (no dentro de ifs/loops).
2. Un hook = **una responsabilidad** documentada.
3. Devuelve **tupla estable** `[valor, set]` o **objeto con nombre**, sin mezclar a medias sin motivo.
4. Limpia lo que suscribes (listeners, timers, abort).

## Anti-patrones

- Hook que renderiza JSX (mezcla responsabilidades).
- Objeto de retorno **nuevo cada render** pasado a hijo memorizado (rompe `memo`) → `useMemo` en el objeto.
- “God hook” con 10 efectos.

## En el ejemplo

`useMediaQuery`, `useDebounce` y `useSet` en `src/hooks/`.
