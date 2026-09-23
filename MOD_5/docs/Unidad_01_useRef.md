# Unidad 01 — useRef

## Objetivos

- Entender qué es `useRef`: un objeto mutable `{ current }` que persiste entre renders.
- Diferenciar cuándo conviene `useRef` y cuándo `useState` (la tabla de comparación te ayudará).
- Saber que mutar un ref **no** dispara re-render, y cuándo eso es una ventaja y cuándo un error.
- Aplicar los 5 casos de uso clásicos: focus/scroll/medir, valor anterior, timers, valores para efectos e inicialización única.
- Reconocer y corregir los errores comunes al usar refs (UI que "no se pinta", ref como estado oculto, mutación por identidad).
- Leer y usar el ejemplo real del proyecto: `../EJEMPLO_REACT_INTERMEDIO/src/components/DemoUseRef.jsx`.

## Requisitos

Antes de empezar esta unidad deberías dominar lo visto en M4 (unidades U05–U06):

- **Componentes y props**: crear funciones que devuelven JSX y recibir datos del padre.
- **`useState`**: declarar estado, actualizarlo y saber que cada actualización provoca un re-render.
- **`useEffect`**: ejecutar código tras pintar, y entender el array de dependencias y la función de cleanup.

Si te suena raro "el componente se vuelve a ejecutar cada vez que cambia el estado", repasa M4 antes de continuar: `useRef` se entiende mucho mejor en contraste con `useState`.

## Qué es useRef

`useRef` es un hook que devuelve **un objeto mutable** con una única propiedad, `current`. Ese objeto **persiste entre renders**: aunque el componente se vuelva a ejecutar 100 veces, `ref.current` conserva lo que le guardaste.

```jsx
import { useRef } from 'react'

const miRef = useRef(valorInicial)
// miRef === { current: valorInicial }
```

Dos propiedades clave:

1. **Persiste entre renders.** React no crea un ref nuevo en cada render; te devuelve siempre el mismo objeto.
2. **No provoca re-render al cambiar.** Si haces `miRef.current = x`, React **no** vuelve a pintar el componente. Nada en la UI se actualiza solo.

### Analogía

Piensa en un ref como en **un post-it pegado en el escritorio de tu componente**. Cada vez que React "re-ejecuta" el componente (re-render), el escritorio se ordena y se rehace, pero el post-it sigue ahí, con lo que escribiste. Puedes leerlo y escribirlo cuanto quieras… pero **la pantalla (la UI) no cambia** solo porque hayas escrito en el post-it: para eso necesitas algo que "pinte" (el estado).

### ¿Qué significa "objeto mutable"?

Que puedes modificar su interior sin crear un objeto nuevo:

```javascript
const ref = useRef(0)
ref.current += 1        // mutación: sigue siendo el mismo objeto
ref.current = 'hola'    // también vale: reasignar .current
```

Comparar con `useState`, que es inmutable por convención: nunca harías `state.count = 5`; llamarías a `setCount(5)`.

### ¿Por qué importa?

Porque te permite **guardar cosas que no necesitas pintar**: un nodo del DOM, un `setTimeout`, el valor de una variable en el render anterior, un contador de clics que solo te interesa en consola… Sin pagar el coste de un re-render cada vez que cambian.

## Ejemplo completo: Demo con inputRef y countRef

Este es el ejemplo base de la unidad. Fíjate en las tres piezas y por qué cada una es de un tipo distinto:

- `inputRef`: referencia a un elemento del DOM.
- `countRef`: contador mutable que **no** re-renderiza.
- `forceRender`: un `useState` que usamos **solo** para forzar un pintado cuando de verdad queremos ver el cambio.

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

Paso a paso:

1. **`<input ref={inputRef} />`**: al montar, React escribe el nodo real del input en `inputRef.current`. Sin eso, `inputRef.current` sería `null`.
2. **`inputRef.current.focus()`**: accedes al input real del navegador y le pones el foco. Es la forma estándar de "controlar" elementos del DOM sin estado.
3. **`countRef.current += 1`**: incrementas el contador. Funciona, pero **la UI no se actualiza**: React ni se entera. Por eso lo ves en `console.log`.
4. **`forceRender((n) => n)`**: aquí está el truco. Al actualizar un `useState` (aunque sea al mismo valor lógico), React re-renderiza y vuelves a ejecutar el componente. Si ahora pintaras `{countRef.current}` en el JSX, se vería el número nuevo. Es un "pulo" manual: úsalo solo cuando **de verdad** quieras que el ref aparezca en pantalla.

Regla práctica: si el dato se muestra al usuario → `useState`. Si el dato es interno (foco, IDs, timers) → `useRef` sin fuerza.

## Los 5 casos de uso

### 1. Focus / scroll / medir elementos del DOM

El caso más frecuente. Ejecutar métodos nativos del navegador (`focus()`, `scrollIntoView()`) o medir cajas (`getBoundingClientRect()`, `ResizeObserver`) necesita el nodo real, y el ref es el puente entre React y ese nodo.

```jsx
const inputRef = useRef(null)
const boxRef = useRef(null)

// poner foco
inputRef.current?.focus()

// medir ancho (en el proyecto se usa ResizeObserver en useEffect)
const ancho = boxRef.current?.getBoundingClientRect().width
```

Nota el **operador opcional `?.`**: si el nodo aún no existe (ref sin montar), en vez de romper con `TypeError: Cannot read properties of null`, no hace nada.

En el proyecto real, `DemoUseRef.jsx` mide un `<div>` con `ResizeObserver` dentro de un `useEffect(..., [])` y guarda el ancho en `useState` — un patrón híbrido perfecto: el **nodo** va en el ref, el **dato que se pinta** va en el estado.

### 2. Guardar el valor anterior

Muchas veces, dentro de un efecto, necesitas comparar "ahora" con "antes". El truco: en cada render, el valor anterior ya está en el ref; lo lees, y después lo actualizas.

```jsx
const prevCountRef = useRef(0)

useEffect(() => {
  console.log('Antes:', prevCountRef.current, '→ Ahora:', count)
  prevCountRef.current = count   // guardar para el próximo render
}, [count])
```

¿Por qué no una simple variable local `let prev = count`? Porque las variables declaradas dentro del componente **mueren en cada render**. El ref, en cambio, sobrevive.

### 3. Timers (`setTimeout` / `setInterval`) con cleanup

Para cancelar un timer al desmontar (o al reiniciarlo) necesitas guardar su ID en algo que sobreviva al render y al scope del efecto.

```jsx
const timerRef = useRef(null)

const empezar = () => {
  clearInterval(timerRef.current)   // evitar timers duplicados
  timerRef.current = setInterval(() => {
    console.log('tick')
  }, 1000)
}

useEffect(() => {
  return () => clearInterval(timerRef.current)   // cleanup al desmontar
}, [])
```

¿Y el problema del "valor obsoleto"? Si guardaras el ID en una variable local del efecto, un segundo efecto no lo vería. El ref es compartido entre efectos y renders, así que siempre lees el ID **real**, no uno viejo capturado por un cierre (*closure*) obsoleto.

### 4. Valores que el efecto necesita sin entrar en el array de dependencias

A veces el efecto necesita leer, p. ej., **la última función/callback** recibida por props, pero no quieres que el efecto se re-ejecute cada vez que cambia ese callback. La solución: guarda el callback en un ref y refresca el ref en cada render.

```jsx
const callbackRef = useRef(onChange)

useEffect(() => {
  callbackRef.current = onChange   // siempre la versión más reciente
})

useEffect(() => {
  const id = setInterval(() => {
    callbackRef.current('tick')    // lee la última sin depender de ella
  }, 1000)
  return () => clearInterval(id)
}, [])                              // deps vacías: el interval no se reinicia
```

El ref actúa como una **ventanilla actualizada** que el efecto mira en el momento preciso, sin que el efecto tenga que "vivir" en el array de dependencias.

### 5. Inicializar una vez

El segundo argumento de `useRef(initialValue)` es el valor con el que arranca `current` la primera vez.

```javascript
const ref = useRef(valorInicial)
```

**Matiz importante (React 19):** el argumento `valorInicial` **se evalúa en cada render** (se calcula la expresión), pero **solo se usa la primera vez**; en renders posteriores React ignora ese valor y conserva `current`. Si el argumento es costoso de calcular (p. ej. un objeto grande), haz una *lazy init* manual:

```javascript
const ref = useRef(null)
if (ref.current === null) {
  ref.current = calcularValorCostoso()   // solo entra la primera vez
}
```

## useRef vs useState

| | `useState` | `useRef` |
|---|------------|----------|
| Cambio dispara re-render | Sí | No |
| Persiste entre renders | Sí | Sí |
| Acceso | vía variable del estado (tras el render) | `.current` en cualquier momento |
| Actualización | `setValor(nuevo)` | `ref.current = x` (directa) |
| Ideal para | datos que se pintan (título, lista, contador visible) | punteros, IDs, timers, últimos valores, nodos DOM |

Lectura rápida de la tabla: **si el usuario debe ver el cambio, es estado; si el cambio es interno, es ref.** Las dos cosas persisten entre renders; la diferencia de oro es la columna "re-render".

## Errores comunes

### Error 1: Esperar que la UI se actualice al hacer `ref.current = x`

**Qué pasa:** mutas el ref y la pantalla no cambia. React no observa `.current`; no hay re-render.

```jsx
function MalEjemplo() {
  const countRef = useRef(0)

  const handleClick = () => {
    countRef.current += 1
    // NADA se pinta: React no vuelve a ejecutar el componente
  }

  return (
    <>
      <p>Clics: {countRef.current}</p>
      <button onClick={handleClick}>+1</button>
    </>
  )
}
```

**Solución:** si el dato se muestra en pantalla, usa `useState`:

```jsx
function BienEjemplo() {
  const [count, setCount] = useState(0)
  return (
    <>
      <p>Clics: {count}</p>
      <button onClick={() => setCount((c) => c + 1)}>+1</button>
    </>
  )
}
```

O, si de verdad quieres el dato en un ref *y* pintarlo, fuerza el render a mano con un `useState` secundario (como `forceRender` del ejemplo Demo). Pero la solución habitual es estado: el ref es para lo que **no** se pinta.

### Error 2: Usar `ref` como "estado oculto" para datos que dependen del render

**Qué pasa:** guardas en un ref un valor que el JSX o un efecto "esperan" ver actualizado en el mismo ciclo, o que depende de datos del render. Los efectos con deps no se re-ejecutan al mutar el ref, así que leen versiones viejas sin aviso.

```jsx
function MalEjemplo({ usuario }) {
  const datosRef = useRef(usuario)

  useEffect(() => {
    // Solo se ejecuta al montar: si `usuario` cambia después,
    // datosRef se actualiza (si lo haces a mano) pero ESTE efecto
    // no se vuelve a lanzar, porque el ref no es una dependencia
    // que React vigile.
    guardar(datosRef.current)
  }, [])
}
```

**Solución:** los datos que el render o los efectos necesitan *reaccionar* van en `useState` (o en deps del efecto). El ref es para valores que **leen** cosas, no para valores de los que **dependen** las re-renders:

```jsx
function BienEjemplo({ usuario }) {
  const [datos, setDatos] = useState(usuario)

  useEffect(() => {
    guardar(datos)
  }, [datos])
}
```

### Error 3: Mutar un objeto dentro del ref sin crear uno nuevo

**Qué pasa:** si un efecto o memo compara el objeto por **identidad** (`===`), mutarlo por dentro no cambia la referencia: `ref.current` sigue siendo "el mismo objeto" a los ojos de quien compara.

```jsx
const configRef = useRef({ modo: 'claro' })

const cambiarModo = () => {
  configRef.current.modo = 'oscuro'   // mutación interna: misma identidad
  // algún useEffect([configRef.current]) NO notará el cambio
}
```

**Solución:** crea un objeto nuevo y asígnalo a `.current` (y, si debe re-pintar, usa estado):

```jsx
const cambiarModo = () => {
  configRef.current = { ...configRef.current, modo: 'oscuro' }  // nueva identidad
}
```

Y si la UI depende de `modo`, ni siquiera uses ref: `setConfig((c) => ({ ...c, modo: 'oscuro' }))`.

## Conceptos clave

- `useRef` devuelve un objeto mutable `{ current }` que **persiste entre renders**.
- Mutar `ref.current` **no** dispara re-render; React no observa `.current`.
- El atributo `ref={miRef}` en el JSX guarda el **nodo DOM real** (o `null` antes de montar).
- `useState` es para datos que se **pintan**; `useRef` es para datos **internos** (nodos, timers, IDs, valores anteriores).
- Los 5 casos de uso: focus/scroll/medir, valor anterior, timers con cleanup, valores para efectos sin deps, inicializar una vez.
- En React 19 el argumento de `useRef` **se evalúa en cada render** pero solo se aplica la primera vez (usa lazy init si es costoso).
- Nunca esperes pintar la UI con un ref; nunca uses un ref como estado del que dependan re-renders.

## Autoevaluación

1. Si hago `miRef.current += 1` dentro de un `onClick`, ¿la pantalla se actualiza sola?

<details>
<summary>Respuesta</summary>

No. Mutar un ref **no** dispara re-render. Si el dato se muestra en pantalla, usa `useState` (o fuerza el render a mano con un estado auxiliar, como `forceRender` del Demo).
</details>

2. ¿Cuál es la diferencia principal entre `useState` y `useRef`, más allá de la sintaxis?

<details>
<summary>Respuesta</summary>

Ambos persisten entre renders, pero `useState` **re-renderiza el componente al actualizarse** y `useRef` **no**. Por eso el estado es para lo que se pinta y el ref para lo interno (DOM, timers, últimos valores).
</details>

3. Quiero cancelar un `setInterval` en el cleanup de un `useEffect(..., [])`. ¿Dónde guardo el ID?

<details>
<summary>Respuesta</summary>

En un ref: `timerRef.current = setInterval(...)` y en el cleanup `clearInterval(timerRef.current)`. Una variable local del efecto no es visible para otros efectos/render posteriores.
</details>

4. ¿Es `useRef(inicial)` una buena forma de calcular algo caro solo una vez? Mira la nota de React 19.

<details>
<summary>Respuesta</summary>

A medias: el valor **solo se usa la primera vez**, pero la expresión del argumento **se evalúa en cada render**. Para algo costoso, inicializa con `null` y calcula dentro de un `if (ref.current === null)` (lazy init).
</details>
