# Unidad 05 — Custom Hooks tipados

## Firma genérica

```ts
export function useLocalStorage<T>(key: string, inicial: T) {
  const [valor, setValor] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw ? (JSON.parse(raw) as T) : inicial
    } catch {
      return inicial
    }
  })

  const set = (v: T | ((prev: T) => T)) => {
    setValor((prev) => {
      const next = typeof v === 'function' ? (v as (p: T) => T)(prev) : v
      localStorage.setItem(key, JSON.stringify(next))
      return next
    })
  }

  return [valor, set] as const
}

// uso
const [tema, setTema] = useLocalStorage<'light' | 'dark'>('tema', 'light')
```

## Hook de API

```ts
type UseFetchResult<T> =
  | { status: 'loading'; data: null; error: null }
  | { status: 'ok'; data: T; error: null }
  | { status: 'error'; data: null; error: string }

export function useFetch<T>(url: string): UseFetchResult<T> { ... }
```

Discriminated union → al hacer `if (res.status === 'ok')` el `data` está tipado.

## Errores comunes

- Devolver tupla sin `as const` y perder literales.
- `any` en el catch de `JSON.parse`.
- Hook que llama a otro hook condicionalmente (reglas de hooks).

## En el ejemplo

`src/hooks/useLocalStorage.ts`.
