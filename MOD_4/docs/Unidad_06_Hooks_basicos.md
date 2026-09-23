# Unidad 06 — useEffect, useMemo y custom hooks

En la U05 aprendiste a guardar datos que cambian con `useState`: el estado vive dentro del componente y, cuando cambia, React vuelve a pintarlo. Pero hay cosas que el **dibujo** de la interfaz no puede hacer por sí solo: imprimir en consola, arrancar un temporizador, pedir datos a un servidor, suscribirse a un evento o calcular algo pesado solo cuando hace falta.

A esos trabajos "al lado" del render los llamamos **efectos secundarios** (*side effects*), y el hook para declararlos es `useEffect`. Además veremos `useMemo`, para **memorizar valores costosos**, y los **custom hooks**, para **extraer lógica reutilizable** (estado + efectos) en funciones propias con nombre `use...`.

## Objetivos

- Entender qué es un efecto secundario y por qué `useEffect` es el lugar correcto para logs, timers, fetch y suscripciones.
- Dominar la matriz de dependencias: `[x]` (cuando cambia x), `[]` (al montar, con `cleanup` en el `return`) y sin array (cada render), usando la tabla de referencia.
- Saber leer y aplicar los ejemplos del componente con `count`, `auth` y `items`.
- Aplicar `useMemo` para memorizar un valor calculado caro y reconocer **cuándo NO hace falta** (cálculos baratos).
- Crear y usar un custom hook (`useCounter`) respetando la regla del prefijo `use*`, con desestructuración en el uso.
- Situar en el mapa del curso `useCallback` (Módulo 5) y `useContext` (Módulo 6).

## Requisitos

- **U05 — Estado con `useState`**: los custom hooks de esta unidad construyen sobre `useState`, y los ejemplos de `useEffect` reaccionan a cambios de estado (`count`, `auth`, `items`). Si no dominas el setter y el updater `(prev) => prev + 1`, repasa U05 antes de continuar.

## ¿Qué es useEffect?

Durante el render, tu componente solo **describe** qué debe aparecer en pantalla. Si dentro intentas hacer cosas "externas" — `console.log`, `setTimeout`, `fetch`, `addEventListener` — esas son **acciones con efectos fuera de React**: efectos secundarios. `useEffect` te deja programar esas acciones para que se ejecuten **después** de que React pinte (o repinte) el componente.

```jsx
import { useEffect } from "react"

useEffect(() => {
  // este código corre después del render
  console.log("cada vez que count cambia")
}, [count])
```

Qué significa cada parte:

- El **primer parámetro** es una función (el "efecto") con todo el trabajo secundario.
- El **segundo parámetro** es la **matriz de dependencias** (*deps*): la lista de valores que el efecto "observa". Cuando alguno cambie, React vuelve a ejecutar el efecto.
- Los casos típicos: **logs** de depuración, **timers** (`setTimeout`/`setInterval`), **peticiones** `fetch` a una API y **suscripciones** (eventos, WebSockets) — estas dos últimas suelen necesitar *cleanup* (limpieza), que veremos con `[]`.

Por qué importa: sin reglas claras, el mismo `fetch` se dispararía en cada tecla escrita y los temporizadores se apilarían sin control. La matriz de dependencias es el contrato que le dice a React **cuándo** debe volver a actuar.

## La matriz de dependencias

Esta es la tabla que debes tener en la cabeza (o pegada en el monitor) mientras trabajas con `useEffect`:

| Deps | Cuándo corre |
|------|----------------|
| `[x]` | Cuando `x` cambia |
| `[]` | Al montar (y desmontar si hay `return`) |
| Sin array | En cada render |

Leída en palabras:

- **`[x]`** — El efecto corre **al montar** (porque React siempre ejecuta el efecto inicial) y **otra vez cada vez que `x` cambia**. Puedes listar varias dependencias: `[auth, items]` corre cuando cambia `auth` **o** `items`.
- **`[]` (array vacío)** — Solo corre **una vez, al montar** el componente. Si devuelves una función con `return`, esa función se ejecuta **al desmontar** (y antes de re-ejecutar el efecto si hubiera deps): es el **cleanup** para limpiar lo que dejaste montado (limpiar intervalos, cancelar peticiones, quitar listeners).
- **Sin array (segundo argumento omitido)** — Corre en **cada render**, incluidos los re-renders por cualquier cambio de estado. Funciona, pero casi siempre es un síntoma de que olvidaste las dependencias.

Ejemplos del componente:

```jsx
useEffect(() => {
  console.log("cada vez que count cambia")
}, [count])

useEffect(() => {
  console.log("solo al montar")
}, [])

useEffect(() => {
  console.log("cuando auth o items cambian")
}, [auth, items])
```

Y así se ve un efecto con **cleanup**, el patrón clásico del temporizador:

```jsx
useEffect(() => {
  const id = setInterval(() => {
    console.log("tick")
  }, 1000)
  return () => clearInterval(id)
}, [])
```

Al montar se crea el intervalo; la función que devuelves (`return () => clearInterval(id)`) es la **limpieza**: React la ejecuta cuando el componente se desmonta, evitando que el timer siga vivo en segundo plano.

Resumen práctico: piensa en las deps como "de qué depende este efecto". Si escribes `count` dentro del efecto, `count` **tiene que** estar en `[count]`. Si no pones ninguna dependencia y usas estado dentro, estás pidiendo un bug: el efecto leerá valores viejos.

## useMemo

`useMemo` no es un efecto: es un **memorizador de valores**. Sirve para calcular algo **costoso** (filtros largos, algoritmos pesados, objetos que se pasan como prop) una sola vez y **reutilizar el resultado** mientras sus dependencias no cambien:

```jsx
const expensiveValue = useMemo(() => {
  console.log("Calculando valor costoso...")
  return count * 2
}, [count])
```

- La función corre y devuelve un **valor** (no un efecto).
- React **recuerda** ese valor entre renders.
- Solo se **recalcula cuando `count` cambia**; en los demás re-renders devuelve el valor memorizado.

### ¿Cuándo NO hace falta `useMemo`?

La memoria tiene un coste: React debe guardar el valor y comparar las deps en cada render. Si el cálculo es **barato** (`count * 2`, un `+`, un string corto), memorizarlo es **más lento** que simplemente recalcularlo. No envuelvas cada expresión en `useMemo` "por si acaso": úsalo cuando midas o sospeches un cálculo **genuinamente caro** (listas grandes, datos externos, trabajos en bucles anidados).

| Situación | ¿`useMemo`? |
|-----------|-------------|
| `total = precio * cantidad` | No: cálculo trivial |
| Filtrar/ordenar un array de miles de elementos | Sí, probablemente |
| Crear un objeto/array nuevo para pasarlo como prop y evitar re-renders | A veces: depende del caso |

Nota: `useCallback` memoriza **funciones** en vez de valores; se estudia en el **Módulo 5**. La idea es la misma —guardar algo entre renders—, pero el tipo de dato es distinto.

## Custom hooks

Un **custom hook** es una **función normal** que extrae lógica de estado y/o efectos reutilizable y **empieza por `use`** (`useCounter`, `useForm`, `useFetch`). Puede llamar a otros hooks (`useState`, `useEffect`, ...) siempre que respete las reglas de hooks (nivel superior del componente).

¿Qué problema resuelve? La **duplicación**. Si tres componentes necesitan un contador con incremento, decremento y reset, no copies y peges tres veces el mismo `useState` + handlers: crea un hook y cada componente lo usa. Si mañana cambias la lógica (por ejemplo, añadir `reset`), lo cambias **en un solo sitio**.

### Ejemplo completo: `useCounter`

```javascript
import { useState } from "react"

const useCounter = () => {
  const [count, setCount] = useState(0)
  const increment = () => setCount(count + 1)
  const decrement = () => setCount(count - 1)
  return { count, increment, decrement }
}
export default useCounter
```

Anatomía del hook:

1. Es una **función** (flecha) normal, no un componente: no recibe JSX ni hace `return` de UI.
2. Internamente usa **`useState`** como cualquier componente — eso es legal porque el nombre empieza por `use`, y React trata su llamada como un hook.
3. Define handlers con nombre (`increment`, `decrement`) para que el consumidor no piense en la mecánica del setter.
4. **Devuelve un objeto** con el estado y las acciones: `{ count, increment, decrement }`. Podrías devolver un array (`[count, increment, decrement]`, estilo `useState`), pero el objeto deja claro qué es qué.

### Uso desestructurado

En el componente que consume el hook, solo llámalo y desestructura lo que necesites:

```jsx
const { count, increment, decrement } = useCounter()
<button onClick={decrement}>−</button>
<span>{count}</span>
<button onClick={increment}>+</button>
```

Cada componente que llame a `useCounter()` obtiene su **propio** contador (cada llamada a `useState` crea un estado aislado). Sin desestructurar también funcionaría (`const counter = useCounter(); counter.count`), pero la forma con llaves es la habitual.

### Por qué es útil

- **No duplicar lógica**: la regla de negocio del contador vive en un solo archivo.
- **Interfaz mínima**: el consumidor solo ve `count`, `increment`, `decrement`; no sabe ni necesita saber que hay un `useState` detrás.
- **Composición**: puedes combinar hooks (`useForm` = varios `useState` + validación; `useFetch` = `useState` + `useEffect` con fetch).
- **Testeable**: la lógica queda aislada del JSX.

Reglas que no debes saltarte: el nombre **debe empezar por `use`** (React y sus linters lo usan para detectar hooks y validar reglas), y los hooks solo se llaman **en el nivel superior** de un componente o de otro custom hook.

## useContext y hacia dónde sigue el mapa

`useContext` (leer datos de un **Context** sin prop-drilling) se ve en el **Módulo 6 (React Avanzado)**; aquí solo lo mencionamos para que sepas que existe y encaja en el mismo "catálogo" de hooks oficiales. Igual que `useCallback` queda para el Módulo 5.

Mapa rápido:

| Hook | Módulo | Para qué |
|------|--------|----------|
| `useState` | U05 | Estado que cambia y re-renderiza |
| `useEffect` | U06 | Efectos secundarios + deps |
| `useMemo` | U06 | Memorizar valores costosos |
| Custom hooks (`use*`) | U06 | Reutilizar lógica de estado/efectos |
| `useCallback` | Módulo 5 | Memorizar funciones |
| `useContext` | Módulo 6 | Consumir contexto sin prop-drilling |

## En el ejemplo

Archivos del repositorio con todo esto aplicado:

- [`ComponenteHooks.jsx`](../EJEMPLO_REACT/src/components/ComponenteHooks.jsx) — `useEffect` con distintas dependencias y estado de U05 en acción.
- [`ComponenteUseMemo.jsx`](../EJEMPLO_REACT/src/components/ComponenteUseMemo.jsx) — memorización de valores con `useMemo`.
- [`hooks/CustomHooks.js`](../EJEMPLO_REACT/src/hooks/CustomHooks.js) — custom hooks reutilizables (incluido el patrón de `useCounter`).

## Errores comunes

**1. Olvidar las dependencias (o omitir la matriz)**

Error: el efecto usa `count` pero no lo lista; o se omite el array y el efecto corre en cada render.

```jsx
// MAL: count no está en deps → efecto con valores viejos / no se re-ejecuta
useEffect(() => {
  console.log(count)
}, [])

// MAL: sin array → corre en CADA render
useEffect(() => {
  console.log(count)
})

// BIEN
useEffect(() => {
  console.log(count)
}, [count])
```

Solución: lista **todo lo que lees dentro del efecto** y que puede cambiar. Si no pones deps, React re-renderiza en bucle o repite trabajo sin control.

**2. Mutar estado directamente dentro de un efecto sin necesidad**

Error: dentro de `useEffect` hacer `count++` o `items.push(...)` en lugar de usar el setter; o llamar al setter en cada render sin deps y crear un bucle infinito de renders.

```jsx
// MAL: mutación
items.push("nuevo")

// MAL: setState en cada render sin deps → bucle
useEffect(() => {
  setCount(count + 1)
}) // ¡sin array!

// BIEN: updater / setter correcto con deps controladas
useEffect(() => {
  setCount((prev) => prev + 1)
}, [count]) // solo cuando count cambia, y con cuidado
```

Solución: el estado solo cambia con `set...` (y con array nuevo para listas: `[...items, nuevo]`), y todo `useEffect` que toca estado lleva su matriz de dependencias.

**3. Efectos con limpieza: olvidar el `return`**

Error: un `setInterval` o un listener creado con `[]` que sigue vivo tras desmontar el componente (fugas de memoria, avisos en consola).

```jsx
// MAL: nunca se limpia
useEffect(() => {
  setInterval(() => console.log("tick"), 1000)
}, [])

// BIEN: cleanup en el return
useEffect(() => {
  const id = setInterval(() => console.log("tick"), 1000)
  return () => clearInterval(id)
}, [])
```

Solución: si el efecto **crea** algo (timer, suscripción, evento), el efecto debe **devolver** una función que lo destruya.

**4. Memorizar cálculos baratos con `useMemo`**

Error: `useMemo(() => a + b, [a, b])`. Guardar y comparar deps cuesta más que el propio cálculo.

Solución: `useMemo` solo para cálculos **costosos** o para referencias estables que de verdad afecten al rendimiento. Si el cálculo tarda microsegundos, escríbelo directo.

**5. Custom hook sin prefijo `use*` o con lógica de UI**

Error: llamarlo `useCounter` pero devolver JSX, o llamarlo `contadorLogica` (React/linters no lo tratarán como hook y perderás las reglas de hooks).

Solución: nombre `useAlgo`, devuelve **datos y funciones**, el JSX vive en el componente que consume el hook.

## Conceptos clave

- **Efecto secundario** = todo lo que el componente hace **fuera** de devolver JSX: logs, timers, fetch, suscripciones. `useEffect` los ejecuta **después** del render.
- **Matriz de deps**: `[x]` corre al montar y cuando cambia `x`; `[]` corre **solo al montar** y ejecuta el `return` (cleanup) **al desmontar**; **sin array** corre en **cada render**.
- El **cleanup** es la función que devuelves desde `useEffect` para limpiar timers, listeners o peticiones.
- **`useMemo` memoriza un valor calculado** y solo lo recalcula cuando cambian sus deps; **no hace falta** para cálculos baratos.
- **`useCallback`** (Módulo 5) memoriza **funciones**; **`useContext`** (Módulo 6) consume contexto.
- **Custom hook**: función reutilizable con **nombre `use*`** que encapsula estado/efectos, evita duplicar lógica y se usa desestructurando (`const { count, increment } = useCounter()`).
- Reglas de hooks: siempre en el **nivel superior**, nunca dentro de `if`, bucles o callbacks anidados.

## Autoevaluación

**1. ¿Cuándo corre un `useEffect` con deps `[]` y qué pasa con su función `return`?**

<details>
<summary>Respuesta</summary>

Corre **una vez, al montar** el componente. La función que se devuelve con `return` es el **cleanup**: React la ejecuta **al desmontar** el componente (y antes de volver a lanzar el efecto si tuviera deps), sirviendo para limpiar intervalos, listeners o peticiones en curso.

</details>

**2. Tengo `console.log(count)` dentro de un efecto y quiero que se ejecute solo cuando `count` cambie. ¿Qué escribo?**

<details>
<summary>Respuesta</summary>

```jsx
useEffect(() => {
  console.log(count)
}, [count])
```

La matriz `[count]` le dice a React: ejecuta este efecto al montar y **cada vez que `count` cambie**. Si omites el array, correría en **cada** render; si pones `[]`, solo al montar (y leería un `count` que ya no refleja cambios posteriores).

</details>

**3. ¿Cuándo tiene sentido usar `useMemo` y cuándo no?**

<details>
<summary>Respuesta</summary>

Tiene sentido cuando el cálculo es **costoso** (listas grandes, filtros, algoritmos pesados) y no quieres repetirlo en cada render: `useMemo(() => calc(list), [list])` lo recalcula solo cuando `list` cambia. **No hace falta** (e incluso perjudica) con cálculos **baratos** como `count * 2`, porque memorizar y comparar deps cuesta más que recalcular.

</details>

**4. Explica qué hace este custom hook y cómo se usa.**

<details>
<summary>Respuesta</summary>

```javascript
const useCounter = () => {
  const [count, setCount] = useState(0)
  const increment = () => setCount(count + 1)
  const decrement = () => setCount(count - 1)
  return { count, increment, decrement }
}
```

`useCounter` **extrae y reutiliza** la lógica de un contador (estado `count` + incremento + decremento) trasladando el `useState` a un archivo propio; empieza por `use` para cumplir la convención de hooks. Se usa desestructurando en el componente:

```jsx
const { count, increment, decrement } = useCounter()
```

Así cada consumidor tiene su contador aislado **sin duplicar** el mismo `useState` y handlers en varios componentes.

</details>
