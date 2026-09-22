# Unidad 03 — useCallback y useMemo (profundización)

`useMemo` ya viste un ejemplo en el Módulo 4. Aquí el foco es **`useCallback`**, que memoriza **funciones** en lugar de valores.

## useCallback

```jsx
import { useCallback, useState } from 'react'

function Padre() {
  const [count, setCount] = useState(0)

  // Misma referencia entre renders mientras deps no cambien
  const increment = useCallback(() => {
    setCount((c) => c + 1)
  }, [])

  return <Hijo onIncrement={increment} />
}
```

- `useCallback(fn, deps)` → devuelve `fn` memorizada; al cambiar `deps`, se crea una nueva.
- Equivale a `useMemo(() => fn, deps)` para funciones.

## Por qué importa

En React, **toda función creada en el cuerpo del componente es una referencia nueva** en cada render. Si la pasas a un hijo con `React.memo`, el `memo` **no sirve de nada** porque el prop cambia siempre.

```jsx
// Mal: nueva función cada render → hijo re-renderiza siempre
const handle = () => setCount(count + 1)

// Bien con memo:
const handle = useCallback(() => setCount((c) => c + 1), [])
```

## Cuándo usar useCallback

✅ Sí:

- Pasar callbacks a componentes envueltos en `React.memo`.
- Callbacks en dependencias de `useEffect` / `useMemo` (o evitarlo y usar refs).
- Funciones que crean un nuevo objeto/estado caro de configurar.

❌ No hace falta:

- Funciones locales que solo usas tú y no dependes de identidad.
- “Por si acaso” en todo el código (complica lectura y deps).

## useMemo vs useCallback

| Hook | Memoriza | Devuelve |
|------|----------|----------|
| `useMemo(() => valor, deps)` | el **valor** | valor |
| `useCallback(fn, deps)` | la **función** | función |

```js
const total = useMemo(() => items.reduce((a, b) => a + b.price, 0), [items])
const onSelect = useCallback((id) => setSelected(id), [])
```

## Trampas

1. **Deps incorrectas**: el memo “miente” y usas un closure viejo.
2. **useCallback sin React.memo** en el hijo → normalmente no se nota.
3. Arrays/objetos **como deps**: se comparan por referencia; pásalos con cuidado o desestructura valores primitivos.

## En el ejemplo del proyecto

Ver `src/components/DemoUseCallback.jsx`: callback estable vs inline + `React.memo`, con “forzar render del padre” para comparar.
