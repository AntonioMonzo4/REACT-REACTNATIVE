# Unidad 04 — useLayoutEffect

## Diferencia con useEffect

| | `useEffect` | `useLayoutEffect` |
|---|-------------|-------------------|
| Cuándo corre | **Después** del paint (asíncrono) | **Antes** del paint, tras el DOM actualizado (síncrono) |
| Bloquea la UI | No | Sí (hazlo corto) |
| Medir/ajustar layout | Puede parpadear | Ideal |
| Fetch, timers, suscripciones | Ideal | Innecesario |

Orden simplificado:

1. Render
2. DOM actualizado
3. **`useLayoutEffect`** (y sus cleanups)
4. Paint
5. **`useEffect`** (y sus cleanups)

## Cuándo usarlo

- **Medir** tamaño/posición de un elemento y **corregir** antes de pintar (tooltips, dropdowns, popovers).
- Animaciones que dependen de la posición inicial (evitar flash).
- Sincronizar `scroll` o foco de forma síncrona con el layout.

```jsx
import { useLayoutEffect, useRef, useState } from 'react')

function Tooltip({ label, children }) {
  const ref = useRef(null)
  const [pos, setPos] = useState({ top: 0, left: 0 })

  useLayoutEffect(() => {
    const rect = ref.current.getBoundingClientRect()
    setPos({ top: rect.bottom + 8, left: rect.left })
  }, [label])

  return (
    <>
      <span ref={ref}>{children}</span>
      <div style={{ position: 'absolute', ...pos }}>{label}</div>
    </>
  )
}
```

> En la práctica, para tooltips se usan librerías; el ejemplo es para entender **medir antes de pintar**.

## Reglas

1. Mismo orden de hooks que `useEffect` (no condicionales).
2. Cleanup: `return () => { ... }` igual que `useEffect`.
3. Si solo haces fetch/suscripción → **`useEffect`**.
4. En React Native, `useLayoutEffect` es el equivalente habitual de los efectos de layout (no hay paint del navegador igual).

## En el ejemplo del proyecto

Ver `src/components/DemoUseLayoutEffect.jsx`: mide un bloque y muestra el ancho **sin** parpadear respecto al valor de `useEffect` de comparación.
