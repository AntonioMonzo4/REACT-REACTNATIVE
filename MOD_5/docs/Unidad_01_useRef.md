# Unidad 01 — useRef

## Qué es

`useRef` devuelve un objeto mutable (`{ current: ... }`) que **persiste entre renders** y **no provoca re-render** cuando cambia.

```jsx
import { useRef, useState } from 'react'

function Demo() {
  const inputRef = useRef(null)   // referencia al DOM
  const countRef = useRef(0)      // valor mutable que no re-renderiza
  const [, forceRender] = useState(0)

  const handleClick = () => {
    inputRef.current.focus()      // acceder al input del DOM
    countRef.current += 1         // mutar sin re-render
    console.log(countRef.current)
    forceRender((n) => n)          // solo si quieres pintar el cambio
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>Foco + contar</button>
    </>
  )
}
```

## Casos de uso

1. **Focus / scroll / medir elementos** del DOM.
2. **Guardar el valor anterior** (`prev = ref.current` en un efecto).
3. **Timers** (`setTimeout` / `setInterval`): limpiar en el cleanup sin cerrar sobre un valor obsoleto.
4. **Valores que el efecto necesita** sin entrar en el array de dependencias (p. ej. última función/callback).
5. **Inicializar una vez** (`useRef(init)` se ignora en renders posteriores; el init solo se evalúa en el primero en la práctica del motor… en React 19 el argumento se evalúa en cada render: usa lazy init si es costoso).

## useRef vs useState

| | `useState` | `useRef` |
|---|------------|----------|
| Cambio dispara re-render | Sí | No |
| Persiste entre renders | Sí | Sí |
| Acceso | vía variable del estado | `.current` |
| Ideal para | datos que se pintan | punteros, IDs, timers, últimos valores |

## Errores comunes

- Esperar que la UI se actualice al hacer `ref.current = x` → **no se pinta**; necesitas estado.
- Usar `ref` como “estado oculto” para datos que dependen del render.
- Poner un objeto en `ref` y mutarlo sin crear un nuevo objeto si algún efecto lo compara por identidad.

## En el ejemplo del proyecto

Ver `src/components/DemoUseRef.jsx`: foco de input, contador mutable y medición de un `<div>`.
