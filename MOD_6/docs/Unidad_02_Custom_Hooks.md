# Unidad 02 — Custom Hooks avanzados

## Objetivos

- **Repasar los custom hooks del M4** (`useCounter`) y diferenciar un hook trivial de un hook de patrón reutilizable.
- Entender **qué aportan los patrones avanzados**: composición de `useState` + `useEffect`, manejo de efectos secundarios y reutilización real de lógica.
- Implementar **`useLocalStorage`** con *lazy initialization* en `useState`, `try/catch` de lectura/escritura y por qué se usa `JSON`.
- Implementar **`useFetch`** con `AbortController`: qué son las *race conditions*, por qué hay que limpiar el efecto y cómo se gestionan `loading` / `error` / `data`.
- Implementar **`useDebounce`**: qué es el patrón *debounce*, aplicarlo a un campo de búsqueda y limpiar con `clearTimeout`.
- Aplicar las **4 reglas de custom hooks** (nombre `use*`, sin condicionales, extraer lógica reutilizable/compleja, una responsabilidad).

## Requisitos

Esta unidad se apoya en los cimientos del módulo anterior:

- **M5 U06 — Comunicación entre componentes y prop drilling**: entiendes que un custom hook es, en el fondo, otra forma de "compartir lógica" entre componentes sin acoplarlos (complementa a Context, no lo sustituye).
- **`useState`**: debes dominar el **initializer con función** (lazy init) `useState(() => ...)`, porque `useLocalStorage` lo usa para leer en el primer render.
- **`useEffect`**: dependencias, *cleanup* y ciclo de vida. Los tres hooks de esta unidad son, en esencia, `useEffect` bien gestionado (`try/catch`, `AbortController`, `clearTimeout`).

Si necesitas repasar, vuelve a M4/M5 U06 antes de continuar: aquí no verás hooks nuevos de React, sino **patrones sobre los que ya los dominas**.

## Repaso: custom hooks en M4 (`useCounter`)

En M4 aprendiste a extraer lógica de estado en una función que empieza por `use`:

```jsx
import { useState } from 'react'

export function useCounter(initial = 0) {
  const [count, setCount] = useState(initial)
  return {
    count,
    increment: () => setCount((c) => c + 1),
    decrement: () => setCount((c) => c - 1),
    reset: () => setCount(initial),
  }
}
```

`useCounter` es perfectamente válido, pero es **trivial**: envuelve un único `useState`. Su valor es la abstracción del *concepto* contador, no la complejidad técnica.

## Qué aportan los patrones avanzados

Los custom hooks de esta unidad van un paso más allá. ¿Qué los distingue?

- **Componen varios hooks**: `useLocalStorage` combina `useState` + `useEffect`; `useFetch` combina `useState` + `useEffect` + la API `fetch`; `useDebounce` combina `useState` + `useEffect` + timers.
- **Encapsulan efectos secundarios peligrosos**: acceso a `localStorage` (puede fallar), peticiones de red (pueden fallar o llegar fuera de orden), temporizadores (pueden quedar huérfanos).
- **Son reutilizables de verdad**: la misma función de búsqueda con debounce puede servir en 5 pantales distintas sin copiar y pegar el `useEffect`.

¿Por qué importa? Porque un `useEffect` con `fetch` bien escrito es difícil: hay que limpiar, manejar errores, evitar carreras... Si lo repites en cada componente, lo harás mal al menos una vez. **Extraerlo al hook garantiza que el patrón correcto se use siempre.**

> Regla práctica: extrae un custom hook cuando la lógica sea **reutilizable** o **compleja** (efectos con cleanup, timers, red). No extraigas un hook para envolver un `useState` trivial salvo por claridad semántica.

## useLocalStorage: estado que sobrevive a un refresh

`useLocalStorage` sincroniza un `useState` con el almacenamiento persistente del navegador. Su API imita a la de `useState`: recibe una clave y un valor inicial, y devuelve `[value, setValue]`.

```js
import { useState, useEffect } from 'react'

export function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw !== null ? JSON.parse(raw) : initial
    } catch {
      return initial
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* quota / private mode */
    }
  }, [key, value])

  return [value, setValue]
}
```

### Lazy init: por qué `useState` recibe una función

Fíjate en `useState(() => {...})`. Eso es una **lazy initialization** (inicialización perezosa): React **solo ejecuta esa función en el primer render**, no en cada render posterior.

¿Por qué importa? Si lo escribieras así:

```jsx
// ❌ Lectura en cada render (ineficiente)
const raw = localStorage.getItem(key)
const [value, setValue] = useState(raw ? JSON.parse(raw) : initial)
```

estarías llamando a `localStorage.getItem` y `JSON.parse` **en todos los renders**, aunque React solo usara el resultado del primero. Con la función, la lectura (operación de I/O) ocurre exactamente una vez. Es el mismo patrón que usarías con un cálculo costoso de inicialización.

### `try/catch` en lectura: qué puede fallar

Dentro del initializer puede pasar de todo:

- **`JSON.parse` falla** si el valor guardado está corrupto o alguien guardó a mano texto no válido.
- **`localStorage` no existe o está bloqueado** en algunos navegadores en *modo privado*.
- La clave puede contener un JSON de otra versión de tu app con forma inesperada.

Sin el `try/catch`, una de esas situaciones rompería el render completo de tu componente. Con él, **degradas de forma elegante**: vuelves al `initial`.

### `try/catch` en escritura: cuota y modo privado

El `catch` del `useEffect` está vacío a propósito (`/* quota / private mode */`) porque la escritura puede fallar sin que tu app deba romperse:

- **Cuota excedida** (`QuotaExceededError`): `localStorage` es limitado (~5 MB); si el usuario llena la caché del navegador, `setItem` lanza.
- **Modo privado / políticas de almacenamiento**: en algunos entornos `setItem` lanza aunque `getItem` funcione.

Tu UI no debe caerse porque no se pueda persistir una preferencia: el estado en memoria sigue siendo válido, simplemente no se guardó. Por eso capturamos y seguimos.

### ¿Por qué `JSON`?

`localStorage` solo almacena **cadenas de texto**. React trabaja con objetos, arrays, números y booleanos. `JSON.stringify` convierte el valor a string al guardar, y `JSON.parse` lo reconstruye al leer. Es el "serializador" estándar del navegador. Sin él, guardarías `"[object Object]"` y al leerlo recibirías un string inútil.

## useFetch con AbortController

`useFetch` encapsula una petición HTTP y expone tres estados que casi toda vista remota necesita: **`data`**, **`loading`** y **`error`**.

```js
import { useEffect, useState } from 'react'

export function useFetch(url) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError(null)

    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(setData)
      .catch((err) => {
        if (err.name !== 'AbortError') setError(err)
      })
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [url])

  return { data, loading, error }
}
```

### Los tres estados: `loading`, `error`, `data`

Pensado como una máquina de estados de una vista de red:

| Estado | Cuándo | Qué muestra la UI |
|---|---|---|
| `loading` | petición en vuelo | spinner / skeleton |
| `error` | `fetch` falló o `res.ok` es falso | mensaje de reintento |
| `data` | respuesta OK y parseada | contenido |

Al inicio de cada efecto **reseteas** `loading = true` y `error = null`: si `url` cambia (otra búsqueda), la UI vuelve al estado "cargando" y no muestra datos viejos como si fueran frescos.

### Comprobar `res.ok`: por qué no basta con `.json()`

`fetch` **solo rechaza la promesa si falla la red**. Un 404 o un 500 llegan como una respuesta "exitosa". Sin el `if (!res.ok) throw ...`, tu hook devolvería `data` con un cuerpo de error y `error` seguiría siendo `null`: la UI mostraría basura en verde.

Lanzar el error dentro del `.then` lo canaliza al `.catch` de abajo, manteniendo un único flujo de manejo de errores.

### El cleanup con `AbortController`: race conditions y setState tras desmontar

Este es el corazón avanzado del hook. `AbortController` es una API estándar del navegador: creas un controlador, pasas su `controller.signal` al `fetch`, y cuando llamas a `controller.abort()` la petición **se cancela**. El `fetch` rechaza con un error de nombre `AbortError`.

¿Por qué limpiar? Dos razones críticas:

1. **Race conditions (condiciones de carrera)**: imagina que el usuario escribe "re", luego "rea", luego "react". Se disparan 3 peticiones. Si la de "react" (la última) responde primero y la de "rea" responde al final, sin abortar **la respuesta vieja sobreescribe la buena**: verías resultados de "rea" cuando deberías ver los de "react". Al abortar la petición anterior cuando `url` cambia, solo sobrevive la última.
2. **setState tras desmontar**: si el usuario navega fuera de la pantalla mientras la petición sigue viva, la promesa responde y intenta hacer `setData(...)` sobre un componente ya desmontado. React lo marca como error/aviso y en apps grandes esconde bugs.

Por eso el cleanup `return () => controller.abort()` está en el `useEffect`: se ejecuta cada vez que `url` cambia **y** cuando el componente se desmonta.

### Ignorar `AbortError`

Cuando abortas, el `fetch` rechaza naturalmente. Pero **una cancelación no es un error para el usuario**: no queremos pintar "HTTP falló" porque el usuario escribió una letra más. Por eso el `catch` filtra:

```js
.catch((err) => {
  if (err.name !== 'AbortError') setError(err)
})
```

Solo errores reales de red o de HTTP llegan al estado `error`. La cancelación se descarta en silencio.

## useDebounce: no golpear la API en cada tecla

### Qué es debounce

**Debounce** (rebote/demora) es un patrón: cuando un evento se dispara muchas veces seguidas, **solo actúas cuando deja de llegar durante un tiempo determinado**. Tras cada evento nuevo, reinicias el temporizador; el "trabajo real" solo se ejecuta si el usuario se queda quieto `delay` milisegundos.

Se usa en buscadores, autocompletados, validaciones en vivo... cualquier cosa donde el evento de entrada (cada tecla) es barato, pero la respuesta (llamar a la API) es cara.

### El hook

```js
import { useEffect, useState } from 'react'

export function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])

  return debounced
}
```

¿Cómo funciona? `debounced` **solo se actualiza** cuando `value` deja de cambiar durante `delay` ms. El componente recibe `value` (lo que el usuario teclea, actualizándose en cada pulsación) y `debounced` (lo que se estabilizó).

### Ejemplo: búsqueda que solo llama a la API cuando el usuario deja de escribir

```jsx
function Buscador() {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 300)

  const { data, loading } = useFetch(
    debouncedQuery
      ? `https://api.example.com/search?q=${encodeURIComponent(debouncedQuery)}`
      : null
  )

  return (
    <>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      {loading && <p>Buscando...</p>}
      <Resultados items={data ?? []} />
    </>
  )
}
```

Sin debounce: **una petición por tecla**. Escribir "react" dispara 5 llamadas (r, re, rea, reac, react), con el consiguiente despilfarro de red y el riesgo de race conditions que ya conoces. Con debounce de 300 ms: el usuario escribe todo lo que quiera y **solo se emite una llamada** cuando hace una pausa.

### `clearTimeout` en el cleanup: por qué es obligatorio

```js
return () => clearTimeout(id)
```

El `useEffect` se re-ejecuta con cada cambio de `value`. Si no limpiaras el temporizador anterior, quedarían **varios timeouts vivos**: cada tecla añadiría otro, y todos dispararían `setDebounced` a destiempo (el "efecto fantasma" de la última letra llegando tarde). El cleanup cancela el temporizador pendiente antes de crear el siguiente: solo hay **una** cuenta atrás en marcha, la de la última tecla.

Es exactamente el mismo contrato `setTimeout`/`clearTimeout` que ya viste con `useEffect` en M5, aplicado a un patrón de producto real.

## Reglas de custom hooks

Las 4 reglas, cada una con su porqué:

1. **El nombre debe empezar por `use...`** (`useLocalStorage`, `useFetch`, `useDebounce`).  
   *Por qué*: React (y su lint plugin *Rules of Hooks*) solo reconoce como hook a una función cuyo nombre empieza por `use`. Si no, el linter no validará dependencias ni el orden de hooks, y el compilador pierde la pista de que ahí hay hooks dentro.

2. **Nunca llamarlos de forma condicional** (ni dentro de `if`, bucles, callbacks anidados).  
   *Por qué*: React identifica los hooks **por su orden de llamada** en cada render. Un `if (cond) useFetch(...)` cambia ese orden entre renders y React deja de saber qué estado corresponde a qué. Esto ya lo viste en M5; los custom hooks heredan la regla porque no son más que "otros hooks llamados dentro".

3. **Extrae lógica reutilizable o compleja**, no un `useState` trivial.  
   *Por qué*: el valor de un custom hook es evitar duplicación y errores. Envolver `const [x, setX] = useState(0)` en un hook no aporta nada; encapsular el ciclo completo de `fetch` + abort + loading sí, porque es lógica que se repite y que es fácil de escribir mal.

4. **Una responsabilidad clara** (o un grupo cohesionado).  
   *Por qué*: un hook que "hace la petición, guarda en localStorage, gestiona el tema y debouncea" es imposible de testear y de componer. Prefieres `useFetch` + `useDebounce` **componibles** en el componente a un `useTodoMagico` monolítico. Misma filosofía que la regla 3 de Context (separar contextos): granularidad.

## En el ejemplo del curso

Los hooks de esta unidad están implementados en `../EJEMPLO_REACT_AVANZADO/`:

- `src/hooks/useLocalStorage.js` — lazy init + `try/catch` de lectura y escritura.
- `src/hooks/useDebounce.js` — `setTimeout`/`clearTimeout` en el efecto.
- (relacionado con U01) `src/hooks/useTheme.js` — ejemplo de hook envoltorio sobre Context.

Ábrelos y compáralos con tus implementaciones: verás exactamente los patrones de esta unidad (cleanup, dependencias, manejo de errores). `useFetch` puedes practicarlo tú mismo en cualquier componente siguiendo el bloque de código de esta unidad.

## Errores comunes

### Error 1 — `useState(localStorage.getItem(...))` sin función initializer

**Síntoma**: la app funciona, pero cada render vuelve a leer `localStorage` (y a veces pisas el estado con la lectura vieja si la escribiste mal).

```jsx
// ❌ Mal: se ejecuta en todos los renders
const raw = localStorage.getItem(key)
const [value, setValue] = useState(raw ? JSON.parse(raw) : initial)
```

**Solución**: pasa una **función** a `useState`; React la invoca solo una vez.

```jsx
// ✅ Bien: lazy init
const [value, setValue] = useState(() => {
  try {
    const raw = localStorage.getItem(key)
    return raw !== null ? JSON.parse(raw) : initial
  } catch {
    return initial
  }
})
```

### Error 2 — Olvidar `res.ok` en `useFetch`

**Síntoma**: un 404 o 500 se muestra como si fuera contenido válido; `error` queda `null`.

```jsx
// ❌ Mal: el 404 llega "ok" a .json()
fetch(url)
  .then((res) => res.json())
  .then(setData)
```

**Solución**: comprueba el estado HTTP y lanza para entrar en el `catch`.

```jsx
// ✅ Bien
fetch(url, { signal: controller.signal })
  .then((res) => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json()
  })
```

### Error 3 — No abortar la petición en el cleanup

**Síntoma**: resultados de una búsqueda vieja pisan los nuevos (race condition), o avisos de "setState on unmounted component".

```jsx
// ❌ Mal: sin cleanup
useEffect(() => {
  fetch(url).then((r) => r.json()).then(setData)
}, [url])
```

**Solución**: aborta con `AbortController` y filtra el `AbortError`.

```jsx
// ✅ Bien
useEffect(() => {
  const controller = new AbortController()
  fetch(url, { signal: controller.signal })
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return res.json()
    })
    .then(setData)
    .catch((err) => {
      if (err.name !== 'AbortError') setError(err)
    })
  return () => controller.abort()
}, [url])
```

### Error 4 — `useDebounce` sin `clearTimeout`

**Síntoma**: varios temporizadores vivos; `setDebounced` se dispara varias veces o con la letra rezagada.

```jsx
// ❌ Mal: el timer anterior sigue vivo
useEffect(() => {
  setTimeout(() => setDebounced(value), delay)
}, [value])
```

**Solución**: devuelve el cleanup que cancela el temporizador pendiente.

```jsx
// ✅ Bien
useEffect(() => {
  const id = setTimeout(() => setDebounced(value), delay)
  return () => clearTimeout(id)
}, [value, delay])
```

### Error 5 — Llamar un custom hook dentro de un `if`

**Síntoma**: error de React sobre el orden de hooks o comportamiento errático entre renders.

```jsx
// ❌ Mal: orden de hooks variable
if (mostrarBuscador) {
  const { data } = useFetch(url)
}
```

**Solución**: llama siempre a todos los hooks en el mismo orden; controla la condición *dentro* del hook (p. ej. pasando `url = null` y saltando el fetch) o *fuera* renderizando otro componente.

```jsx
// ✅ Bien
const { data } = useFetch(mostrarBuscador ? url : null)
```

## Conceptos clave

- **Custom hooks**: funciones `use*` que encapsulan lógica con hooks de React; en M4 eran básicos (`useCounter`), aquí son patrones con efectos secundarios.
- **Lazy init**: `useState(() => {...})` ejecuta la lectura de `localStorage` solo en el primer render.
- **`useLocalStorage`**: `useState` + `useEffect` con `try/catch` (corrupción, cuota excedida, modo privado) y `JSON.stringify`/`JSON.parse` para serializar.
- **`useFetch`**: expone `{ data, loading, error }`; exige `res.ok` porque `fetch` solo rechaza en fallos de red.
- **Race conditions**: respuestas desordenadas que pisan datos buenos; se evitan abortando la petición anterior con `AbortController`.
- **`AbortError`**: error de cancelación que **no** debe pintarse como error real.
- **`useDebounce`**: emite el valor solo tras `delay` ms de calma; `clearTimeout` garantiza un único temporizador vivo.
- **4 reglas de custom hooks**: nombre `use*` · nunca condicionales · extraer lógica reutilizable/compleja · una responsabilidad.
- **Ejemplo**: `useLocalStorage.js` y `useDebounce.js` en `../EJEMPLO_REACT_AVANZADO/`.

## Autoevaluación

**1. ¿Por qué `useLocalStorage` pasa una función a `useState` en lugar de calcular el valor directamente?**

<details>
<summary>Respuesta</summary>

Porque es una **lazy initialization**: React ejecuta esa función **solo en el primer render**. Si calcularas el valor en línea (`useState(leerStorage())`), la lectura de `localStorage` y el `JSON.parse` se harían en **todos los renders** sin necesidad. La función garantiza una sola lectura y evita el coste extra.

</details>

**2. ¿Qué dos problemas concretos evita el `AbortController` en `useFetch`?**

<details>
<summary>Respuesta</summary>

1) **Race conditions**: si `url` cambia antes de que responda la petición anterior, sin abortar la respuesta vieja podría sobreescribir la nueva; el aborte garantiza que solo compite la última. 2) **setState tras desmontar**: al salir de la pantalla se cancela la petición y no se intenta actualizar el estado de un componente ya desmontado. Además, el `AbortError` se filtra en el `catch` para no mostrar un error falso al usuario.

</details>

**3. Escribe el debounce de 300 ms en un buscador: ¿qué se dispara en cada tecla y qué se dispara cuando el usuario deja de escribir?**

<details>
<summary>Respuesta</summary>

En **cada tecla** solo se actualiza el estado `query` (barato, local). Ese valor pasa por `useDebounce(query, 300)`, que **reinicia un `setTimeout`** en cada cambio y limpia el anterior con `clearTimeout`. Solo cuando lleva **300 ms sin escribir**, se actualiza `debouncedQuery`; ese es el valor que alimenta a `useFetch` y **dispara la llamada a la API**. Resultado: una sola petición en lugar de una por letra.

</details>

**4. Tu compañero escribe `if (user) { const s = useLocalStorage('cart', []) }`. ¿Por qué React se queja?**

<details>
<summary>Respuesta</summary>

Rompe la regla de **no llamar hooks de forma condicional**. React identifica cada hook por su **posición en el orden de llamada** de cada render. Si `user` cambia, el número u orden de hooks varía y React ya no sabe qué estado corresponde a qué hook (puede mezclar valores o lanzar el error "Rendered fewer hooks than expected"). La solución es llamar al hook siempre y controlar la condición dentro del hook (p. ej. pasando `null` para saltarse la acción) o extrayendo la lógica a otro componente que solo se monte cuando `user` exista.

</details>
