# Unidad 04 — useLayoutEffect

Ya conoces `useEffect` del Módulo 4: corre **después** de que React pinta en pantalla. Pero hay tareas que no pueden esperar al paint: medir un tooltip y colocarlo, evitar el flash de una animación, mover el scroll antes de que el usuario vea nada raro. Para eso existe **`useLayoutEffect`**, que corre **antes** de pintar, justo cuando el DOM ya está actualizado. Misma API, momento distinto… y eso lo cambia todo.

## Objetivos

- Distinguir cuándo corren `useEffect` y `useLayoutEffect` respecto al paint (tabla comparativa).
- Describir el orden simplificado: Render → DOM → `useLayoutEffect` → Paint → `useEffect`.
- Saber cuándo usar `useLayoutEffect` (medir y corregir layout antes de pintar) y cuándo NO (fetch, timers, suscripciones).
- Escribir un Tooltip que mide con `getBoundingClientRect` y se posiciona sin parpadear.
- Conocer las reglas: mismo orden de hooks, cleanup, fetch → `useEffect`, React Native.

## Requisitos

- Módulo 4: **`useEffect`** (ciclo de vida, deps, cleanup). Sin ese base, este timing no tiene sentido.
- M4: `useState` y `useRef` básicos (el ejemplo del Tooltip usa `useRef` para acceder al nodo DOM; si quieres repasar a fondo, la Unidad 01 de esta unidad es un buen complemento).
- Saber qué es el **paint** (el navegador dibuja los píxeles en pantalla) y que medir el layout (`offsetWidth`, `getBoundingClientRect`) fuerza reflow.

## Diferencia con useEffect

La API es casi idéntica: recibe un callback y un array de deps. Lo que cambia es **cuándo** lo ejecuta React dentro del ciclo de render.

| | `useEffect` | `useLayoutEffect` |
|---|-------------|-------------------|
| Cuándo corre | **Después** del paint (asíncrono, deja pintar primero) | **Antes** del paint, tras el DOM actualizado (síncrono) |
| Bloquea la UI | No | Sí (hazlo corto) |
| Medir/ajustar layout | Puede parpadear | Ideal |
| Fetch, timers, suscripciones | Ideal | Innecesario |

**Qué significa cada fila:**

- *Cuándo corre*: el navegador puede pintar antes de que tu effect de `useEffect` corra; el de `useLayoutEffect` siempre termina antes de que el usuario vea nada.
- *Bloquea la UI*: como `useLayoutEffect` corre sincrónicamente en el mismo pase, un callback largo congela la interacción. Es para trabajo **corto** de medición, no para llamadas de red.
- *Medir layout*: si mides en `useEffect` y luego haces `setState` para corregir, React pinta primero la versión "mala" y después la corregida → parpadeo (flash). Con `useLayoutEffect` la corrección entra en el **mismo** paint.
- *Fetch/timers*: no dependen de la posición en pantalla; el orden del paint es indiferente, así que `useEffect` es más ligero y el estándar.

## Orden simplificado

Cada vez que un componente (re)renderiza con efectos, el pipeline se puede resumir así:

```text
Render (función del componente corre)
        ↓
DOM actualizado (React aplica los cambios al árbol)
        ↓
useLayoutEffect  (y sus cleanups)  ← síncrono, antes del paint
        ↓
Paint  (el navegador dibuja en pantalla)
        ↓
useEffect  (y sus cleanups)  ← asíncrono, después del paint
```

Dos detalles que importan:

1. Los **cleanups** de `useLayoutEffect` corren justo antes de su nuevo effect (y antes del paint); los de `useEffect`, después del paint, antes del nuevo effect. Mismo contrato que ya conoces de M4.
2. Si `useLayoutEffect` hace un `setState`, React re-renderiza **antes** de pintar: el usuario nunca ve el estado intermedio. Si lo hace `useEffect`, el usuario **sí** llega a ver el estado intermedio (pinta → effect → setState → repinta).

## Cuándo usarlo

- **Medir** tamaño/posición de un elemento y **corregir** antes de pintar: tooltips, dropdowns, popovers, menús flotantes que deben saber dónde anclarse.
- Animaciones que dependen de la posición inicial (evitar flash: la "posición 0" nunca llega a pintarse).
- Sincronizar `scroll` o foco de forma síncrona con el layout (por ejemplo, scrollear a un elemento recién montado sin ver el salto).

**Por qué importa:** la regla mental es "si la corrección afecta a cómo se ve la pantalla en este mismo commit, va en `useLayoutEffect`". Si la tarea no mira el layout (fetch, suscripciones, timers), va en `useEffect` y dejas al navegador pintar en paz.

## Ejemplo: Tooltip que mide antes de pintar

```jsx
import { useLayoutEffect, useRef, useState } from 'react'

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

**Lectura paso a paso:**

1. Render: el tooltip se pinta con `pos = { top: 0, left: 0 }` (esquina arriba-izquierda, "mal").
2. El DOM ya está actualizado → corre `useLayoutEffect`, mide con `getBoundingClientRect()` la posición real del ancla y hace `setState` con la posición correcta.
3. React re-renderiza **antes del paint**: el usuario solo ve el tooltip ya colocado debajo del ancla.
4. Cuando `label` cambia (deps), se vuelve a medir: si el texto creció o la ancla se movió, se recoloca sin parpadeo.

Si en vez de `useLayoutEffect` usaras `useEffect`, verías un frame (o más) con el tooltip en `{0, 0}` antes de saltar a su sitio: el clásico flash.

> En la práctica, para tooltips se usan librerías; el ejemplo es para entender **medir antes de pintar**.

## En el ejemplo del proyecto

Ver `../EJEMPLO_REACT_INTERMEDIO/src/components/DemoUseLayoutEffect.jsx`: mide un bloque (`offsetWidth`) y muestra el ancho **sin** parpadear respecto al valor de `useEffect` de comparación. Hay dos badges: uno actualizado en `useLayoutEffect` (siempre coherente con el paint actual) y otro en `useEffect` (corre después; en esta demo el flash no se aprecia mucho, pero el orden es el correcto para correcciones de layout). El botón "Cambiar ancho" cambia el texto del bloque medido para que midas de nuevo en ambos hooks.

## Reglas

1. **Mismo orden de hooks que `useEffect`**: nunca condicionales (`if`, bucles, early returns antes del hook). React identifica los hooks por su posición en cada render; romper el orden lanza error de hooks.
2. **Cleanup**: `return () => { ... }` igual que `useEffect`. Útil para cancelar observadores de ResizeObserver/IntersectionObserver que abras dentro del effect.
3. **Si solo haces fetch/suscripción → `useEffect`**: no hay nada que medir ni corregir antes del paint; `useLayoutEffect` solo añadiría bloqueo innecesario (y en SSR, warnings).
4. **En React Native**, `useLayoutEffect` es el equivalente habitual de los efectos de layout (no hay paint del navegador igual): las medidas de vistas nativas también conviene hacerlas antes de que la native UI actualice.

## Errores comunes

**1. Usar `useLayoutEffect` para fetch (o cualquier cosa que no sea layout)**

```jsx
// ERROR: bloquea el paint sin motivo; el fetch no depende de la posición
useLayoutEffect(() => {
  fetch('/api/user').then((r) => r.json()).then(setUser)
}, [])

// SOLUCIÓN: side effects asíncronos → useEffect
useEffect(() => {
  fetch('/api/user').then((r) => r.json()).then(setUser)
}, [])
```

**2. Medir en `useEffect` y corregir: parpadeo (flash)**

```jsx
// ERROR: el usuario pinta primero en la posición mala y luego "salta"
useEffect(() => {
  const rect = ref.current.getBoundingClientRect()
  setPos({ top: rect.bottom + 8, left: rect.left })
}, [label])

// SOLUCIÓN: medir y corregir ANTES del paint
useLayoutEffect(() => {
  const rect = ref.current.getBoundingClientRect()
  setPos({ top: rect.bottom + 8, left: rect.left })
}, [label])
```

**3. Trabajo pesado dentro de `useLayoutEffect` (congelación)**

```jsx
// ERROR: un cálculo enorme aquí bloquea el hilo principal antes del paint
useLayoutEffect(() => {
  const resultado = procesarMillonesDePuntos(datos) // ¡largo!
  setResumen(resultado)
}, [datos])

// SOLUCIÓN: si no es medición de layout, usa useEffect; si SÍ es de layout,
// deja la parte pesada fuera (memoiza el dato o trabaja en web worker) y
// conserva aquí solo la medición corta.
useEffect(() => {
  const resultado = procesarMillonesDePuntos(datos)
  setResumen(resultado)
}, [datos])
```

**4. Hooks condicionales con early return**

```jsx
// ERROR: si el return anticipado salta, el hook desaparece del orden
if (!visible) return null
useLayoutEffect(() => { /* medir */ }, [visible]) // ¡rompe las reglas de hooks!

// SOLUCIÓN: declara el hook SIEMPRE y protege su interior
useLayoutEffect(() => {
  if (!visible || !ref.current) return
  const rect = ref.current.getBoundingClientRect()
  // ...
}, [visible])
if (!visible) return null
```

## Conceptos clave

- `useLayoutEffect` corre **antes del paint** (síncrono, tras actualizar el DOM); `useEffect`, **después** del paint (asíncrono).
- Orden simplificado: Render → DOM actualizado → `useLayoutEffect` → Paint → `useEffect`.
- Úsalo para **medir y corregir layout** en el mismo commit: tooltips, dropdowns, popovers, animaciones sin flash, scroll/foco síncrono.
- **No** lo uses para fetch, timers ni suscripciones → `useEffect`.
- Bloquea la UI: mantenlo **corto**; un effect largo en `useLayoutEffect` congela la interfaz.
- Misma API y mismas reglas que `useEffect`: orden fijo de hooks, cleanup con `return`, deps con las mismas trampas.
- En la práctica, tooltips/menús suelen resolverse con librerías; el ejemplo con `getBoundingClientRect` es para entender el patrón **medir antes de pintar**.
- En React Native es el efecto de layout habitual (no hay el mismo paint del navegador).

## Autoevaluación

**1. Describe el orden de un render con ambos effects. ¿En qué punto corre cada uno respecto al paint?**

<details>
<summary>Respuesta</summary>

```text
Render → DOM actualizado → useLayoutEffect → Paint → useEffect
```

`useLayoutEffect` (y sus cleanups) corre síncronamente cuando el DOM ya refleja el nuevo render, **antes** de que el navegador dibuje. `useEffect` (y sus cleanups) corre **después** de pintar, de forma asíncrona. Si `useLayoutEffect` dispara un `setState`, React re-renderiza otra vez antes del paint; si lo hace `useEffect`, el usuario sí llega a ver el estado intermedio (flash).

</details>

**2. ¿Por qué un tooltip posicionado con `useEffect` parpadea y con `useLayoutEffect` no?**

<details>
<summary>Respuesta</summary>

Porque con `useEffect`: render con posición por defecto → **paint** (el usuario ve el tooltip mal ubicado) → effect mide con `getBoundingClientRect` → `setState` → repinta en su sitio. El frame intermedio se ve. Con `useLayoutEffect`: render con posición por defecto → mide y corrige **antes del paint** → el navegador pinta solo la versión correcta. Nunca se pinta la posición mala.

</details>

**3. Necesitas suscribirte a un evento de red al montar y limpiarlo al desmontar. ¿`useEffect` o `useLayoutEffect`? ¿Y si necesitas medir el ancho de un modal justo al abrirlo para centrarlo?**

<details>
<summary>Respuesta</summary>

- Suscripción/cleanup: **`useEffect`**. No depende del layout ni del paint; `useLayoutEffect` solo añadiría bloqueo (y en SSR, warnings).
- Medir y centrar el modal al abrirlo: **`useLayoutEffect`**. Es medición de layout que debe corregirse antes de pintar para que el modal no aparezca descentrado un frame.

</details>

**4. Menciona 3 reglas que aplican igual a `useLayoutEffect` que a `useEffect`.**

<details>
<summary>Respuesta</summary>

1. **Mismo orden de hooks** en cada render: sin condicionales ni early returns antes del hook (React los identifica por posición).
2. **Cleanup** con `return () => { ... }`, se ejecuta antes del nuevo effect (y antes del paint en el caso de `useLayoutEffect`) y al desmontar.
3. **Deps**: mismo contrato de `Object.is`; mismas trampas de closures viejos y deps que cambian siempre por referencia.
4. Además (diferencia de criterio, no de API): side effects que no miden layout → `useEffect`; en React Native, `useLayoutEffect` es el equivalente habitual de los efectos de layout.

</details>
