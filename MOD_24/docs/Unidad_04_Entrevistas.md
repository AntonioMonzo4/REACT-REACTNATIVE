# Unidad 04 — Entrevistas técnicas

## Objetivos

Al terminar esta unidad deberías poder:

- Responder las **preguntas frecuentes** de JavaScript (event loop, closures, `this`, igualdad, debounce/throttle) explicando el *por qué*, no solo la respuesta corta.
- Explicar **React** con precisión: cuándo re-renderiza, keys, efectos y sus dependencias, controlled vs uncontrolled, composición vs prop drilling.
- Dominar los puntos de **TypeScript** que suelen preguntar: `interface` vs `type`, generics, utility types, discriminated unions, narrowing.
- Resolver un ejercicio de **algoritmos básicos** *pensando en voz alta* y cubriendo edge cases (sin memorizar LeetCode).
- Actuar en un **pair/live coding**: clarificar requisitos, codear, testear, comunicar complejidad.
- Tener listo un **README de portfolio**, un **pitch de 2 minutos** y **2 features** de tu proyecto final explicadas con trade-offs.

## Requisitos

- Los módulos **M4–M15** de React (componentes, estado, hooks, renderizado) y bases de **TypeScript** del curso.
- M10 para los ejemplos de tests mencionados al hablar de edge cases.
- Tu **proyecto final (M23)** a mano: la práctica gira entorno a él.
- **No** hace falta haber hecho nunca una entrevista técnica, ni resolver ejercicios tipo concurso de belleza: aquí se entrena el *método*, no la memorización.

## Cómo funciona una entrevista técnica (sin mitos)

Una entrevista técnica rara vez busca "la respuesta mágica". Evalúa, en este orden aproximado:

1. **Comunicación**: ¿pregunta si no entiende? ¿explica su razonamiento?
2. **Razonamiento**: ¿prueba casos límite? ¿corrige su propio error sin dramatismo?
3. **Conocimiento**: ¿domina JS/React/TS a un nivel que pueda defender?
4. **Código**: ¿es legible? ¿está testeado?

Por eso este módulo entrena *pensar en voz alta* tanto como saber. Un candidato que dice "no lo sé, pero lo abordaría así…" suele ganar a uno que se inventa la respuesta.

## JavaScript (preguntas frecuentes)

- Event loop: macrotasks vs microtasks (`setTimeout` vs Promise).
- `this`, closures, prototipos vs `class`.
- Igualdad: `==` vs `===`; `null`/`undefined`.
- `const`/`let`, hoisting, temporal dead zone.
- Debounce/throttle (escribe uno).

### Event loop: macrotasks vs microtasks

JavaScript tiene **un solo hilo** para tu código, pero coordina tareas asíncronas con dos colas:

- **Macrotasks** (tareas): `setTimeout`, `setInterval`, I/O, eventos del DOM.
- **Microtareas**: callbacks de Promesas (`.then`, `await`), `queueMicrotask`.

Regla: **tras terminar el código sincrónico, se vacía COMPLETA la cola de microtareas y luego se toma UNA macrotask**. Repite.

```javascript
console.log('1: sincrónico')

setTimeout(() => console.log('4: macrotask (setTimeout)'), 0)

Promise.resolve().then(() => console.log('3: microtarea (then)'))

console.log('2: sincrónico')
```

Salida: `1, 2, 3, 4`. Aunque el `setTimeout(..., 0)` esté escrito antes, su callback es macrotask y espera a que las microtareas terminen.

```javascript
async function ejemplo() {
  console.log('A')
  await Promise.resolve()
  console.log('B')
}
ejemplo()
console.log('C')
// Salida: A, C, B  (await deja el resto como microtarea)
```

### `this`, closures, prototipos vs `class`

- **Closures**: una función recuerda el ámbito donde fue *creada*, incluso después de que ese ámbito haya terminado. Es la base de los módulos, de los *privados* con `#`/símbolos y de muchos hooks por debajo.
- **`this`**: en funciones normales depende de **cómo se llama** (método, constructor, `call/apply`), no de dónde está escrita. En **arrow functions** no tiene `this` propio: hereda el del contexto exterior (por eso en React se usan tanto dentro de clases/métodos).
- **Prototipos vs `class`**: `class` es azúcar sintáctico sobre el sistema de prototipos. `class` añade `extends`, `super`, `static` y mejoraron la semántica (métodos no enumerables, falta de `[[HomeObject]]` para `super`).

```javascript
class Persona {
  #privado = 'no sale'          // privado de verdad (campos privados)
  constructor(nombre) { this.nombre = nombre }
  saludar() { return `Hola, ${this.nombre}` }
}
```

### Igualdad: `==` vs `===`; `null`/`undefined`

- `===` compara **valor y tipo** sin conversión → úsalo por defecto.
- `==` convierte tipos antes de comparar → resultados famosos: `'' == 0` → `true`, `'1' == 1` → `true`, `null == undefined` → `true`.
- Excepción idiomática permitida: `x == null` detecta `null` **o** `undefined` de una vez (si lo ves en un repo, es intencional).
- `Object.is(a, b)`: como `===` pero distingue `NaN === NaN` (falso en ambos, `Object.is` → `false` también… de hecho `NaN` nunca es igual a sí mismo con `===` ni con `Object.is`; `Object.is` sí distingue `+0`/`-0`).

### `const`/`let`, hoisting, temporal dead zone

- `const`: no se puede *reasignar* (el **contenido** de un objeto/array sí cambia: `const a = []; a.push(1)` es legal).
- `let`: reasignable. **No uses `var`**: su scope es de función y salta del bloque, fuente de bugs.
- **Hoisting**: las declaraciones se "izan" al inicio, pero `let`/`const` quedan en la **temporal dead zone**: usarlas antes de declarar lanza `ReferenceError` (no `undefined`, como con `var`).

### Debounce/throttle (escribe uno)

Ambos limitan frecuencia de ejecución; se diferencian en *cuándo* ejecutan:

- **Debounce**: ejecuta solo cuando dejan de llegar llamadas (útil en **búsqueda mientras escribes**: una sola petición al final).
- **Throttle**: ejecuta como mucho una vez cada N ms (útil en **scroll/resize**: una vez por frame o por 100 ms).

```javascript
function debounce(fn, delay = 300) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

function throttle(fn, limit = 100) {
  let waiting = false
  return (...args) => {
    if (waiting) return
    waiting = true
    fn(...args)
    setTimeout(() => { waiting = false }, limit)
  }
}
```

Pistas de entrevista: menciona el **cleanup** (si el componente se desmonta, `clearTimeout`), y que la versión *leading/trailing* es una decisión de producto.

## React

- ¿Cuándo se re-renderiza un componente? (estado, contexto, padre).
- Keys y reconciliación; por qué `index` como key es frágil.
- `useEffect` deps; limpieza.
- Controlled vs uncontrolled; portales; lazy/Suspense.
- Levantamiento de estado; composition vs prop drilling.

### ¿Cuándo se re-renderiza?

Un componente React se vuelve a renderizar cuando:

1. Cambia su **propio estado** (`useState`, `useReducer`).
2. Cambia un **contexto** que consume.
3. **Su padre** se re-renderiza (por defecto, los hijos también).

```javascript
function Padre() {
  const [n, setN] = useState(0)
  return <button onClick={() => setN(n + 1)}>
    {n} <Hijo />
  </button>
}
// Clic en el botón => Padre renderiza => Hijo renderiza de nuevo,
// aunque las props de <Hijo /> no hayan cambiado.
```

Para evitarlo: `React.memo`, estado más abajo, o contexto más fino. En entrevista: "el estado cambia y React vuelve a llamar a la función; luego reconcilia con el DOM".

### Keys y reconciliación

React compara el árbol anterior con el nuevo para tocar solo el DOM necesario. La **key** identifica cada elemento entre renders.

```javascript
// ❌ key={index}: si el primero se elimina, React "reutiliza" posiciones
//    y los inputs del formulario se desplazan de sitio.
items.map((item, i) => <li key={i}>{item.text}</li>)

// ✅ identificador estable y único
items.map(item => <li key={item.id}>{item.text}</li>)
```

Por qué `index` es frágil: si reordenas o eliminas, las keys "viajan" con la posición y React empareja mal (estado interno, animaciones, foco acaban en el elemento equivocado).

### `useEffect` deps; limpieza

```javascript
useEffect(() => {
  const controller = new AbortController()
  fetch(`/api/pedidos`, { signal: controller.signal })
    .then(r => r.json())
    .then(setPedidos)
    .catch(() => { /* abortado: ignorar */ })
  return () => controller.abort()   // limpieza al desmontar o al repetir
}, [categoria])                     // solo cambia cuando cambia categoria
```

- Dependencias **incompletas**: el efecto ve un valor viejo (bug clásico).
- Dependencias **de más** o lógica derivada dentro del efecto: bucles de fetch.
- **Limpieza**: temporizadores, suscripciones, peticiones abortadas. Sin cleanup, montaje/desmontaje rápido = fugas y respuestas fantasma.
- Alternativa moderna: librerías de datos (React Query/SWR) o `use`/suspense según tu versión; en entrevista basta con demostrar que entiendes deps + cleanup.

### Controlled vs uncontrolled

| | Controlled | Uncontrolled |
|---|------------|--------------|
| Fuente de verdad | estado de React (`value` + `onChange`) | el propio input (ref) |
| Validar/transformar al escribir | sí, fácil | con eventos/refs |
| Resetear | cambiando el estado | `form.reset()` o ref |
| Código típico | `<input value={q} onChange={e => setQ(e.target.value)} />` | `<input ref={ref} />` |

### Portales; lazy/Suspense

- **Portales** (`createPortal`): renderizar en un nodo del DOM distinto (modales, tooltips, toast) manteniendo el árbol lógico de React.
- **`React.lazy` + `<Suspense>`**: cargar un componente bajo demanda con un *fallback* mientras llega.

```javascript
const Checkout = React.lazy(() => import('./Checkout'))

<Suspense fallback={<p>Cargando…</p>}>
  <Checkout />
</Suspense>
```

### Levantamiento de estado; composition vs prop drilling

- **Levantar estado**: si dos hermanos necesitan el mismo dato, el estado sube al padre más cercano y se baja por props.
- **Prop drilling**: bajar muchas capas de props → ruidoso. Soluciones: **composición** (`children`/props que son elementos), contexto, o un hook/zustand según el caso.

```javascript
// Composición evita pasar info irrelevante por 5 niveles
<Panel>
  <BotonGuardar onClick={guardar} />   {/* el Panel no necesita "saber" */}
</Panel>
```

## TypeScript

- `interface` vs `type`; generics; utility types (`Partial`, `Pick`, `Omit`).
- `as const`, discriminated unions, narrowing.
- React: `PropsWithChildren`, eventos, `forwardRef`/ref prop.

### `interface` vs `type`

```typescript
interface User { id: string; nombre: string }

type User = { id: string; nombre: string }
```

Diferencias prácticas:

- **`interface`** se puede *declaración-mergear* (reabrir para ampliar), es clásica en APIs de librerías.
- **`type`** es más general: uniones (`type ID = string | number`), tuplas, tipos condicionales, mapeados.

Regla de equipos: elige uno y sé coherente; muchos repos usan `interface` para objetos y `type` para el resto.

### Generics y utility types

```typescript
function first<T>(arr: T[]): T | undefined { return arr[0] }

type Parcial = Partial<User>     // todas las props opcionales
type SoloId  = Pick<User, 'id'>  // { id: string }
type SinId   = Omit<User, 'id'>  // { nombre: string }
```

`Partial`, `Pick`, `Omit`, `Record`, `Readonly` cubren el 90% de los casos del día a día; conócelas antes que tipos condicionales exóticos.

### `as const`, discriminated unions, narrowing

```typescript
type Estado = { estado: 'cargando' } 
            | { estado: 'ok'; datos: User[] } 
            | { estado: 'error'; mensaje: string }

function pintar(e: Estado) {
  // narrowing: el discriminante ('estado') cierra el tipo
  if (e.estado === 'ok') return e.datos.length
  if (e.estado === 'error') return `Fallo: ${e.mensaje}`
  return 'Cargando…'
}
```

```typescript
const CONFIG = { modo: 'prod' } as const
// { readonly modo: 'prod' } — literales, no ampliable a string
```

Las **discriminated unions** son la forma idiomática de estados de carga/error en React; úsalas en el portfolio y en la entrevista.

### React + TypeScript

- **`PropsWithChildren`**: `function Card({ children }: PropsWithChildren<Props>)` envuelve tus props y añade `children` tipado.
- **Eventos**: `onChange={(e: React.ChangeEvent<HTMLInputElement>) => …}`, `onClick={(e: React.MouseEvent<HTMLButtonElement>) => …}`. Si la función es inline, TS infiere: no anotes de más.
- **Refs**: en React 19 puedes pasar `ref` como prop normal; en versiones anteriores `forwardRef`. Menciona la que use tu proyecto.

```typescript
type Props = { titulo: string }
function Panel({ children, titulo }: PropsWithChildren<Props>) {
  return <section aria-label={titulo}>{children}</section>
}
```

## Algoritmos básicos

- Big-O de tu código; arrays/strings: two pointers, frequency map.
- Practica: FizzBuzz, reverse string, dedupe, flat, `promiseAll` limitado.
- No memorizar leetcode: **pensar en voz alta** y testear edge cases.

### Big-O (comunicar coste)

| Notación | Ejemplo típico |
|----------|----------------|
| O(1) | acceder a un objeto/clave |
| O(n) | recorrer un array |
| O(n log n) | ordenar (`Array.sort` en la práctica) |
| O(n²) | bucles anidados sobre la misma colección |
| O(2ⁿ) / O(n!) | recursión naïve, permutaciones — casi siempre "esto no escala" |

Di en voz alta: "buscar por `id` en un array es O(n); si lo hago en cada render conviene un `Map`/objeto: O(1)".

### Ejercicios de práctica

- **FizzBuzz**: bucle, módulo, orden de los tests (`% 15` antes que `% 3`).
- **reverse string**: `s.split('').reverse().join('')` o two pointers; menciona Unicode/emojis como matiz.
- **dedupe**: `new Set(arr)`, o `Set` manual para explicar O(n).
- **flat**: versión recursiva con profundidad; cuidado con ciclos.
- **`promiseAll` limitado**: implementa un `promisePool(tasks, n)` — excelente pregunta "fácil de leer, difícil de hacer bien" (índice compartido, errores, no lanzar de más).

```javascript
async function promiseAllLimit(fns, limit = 3) {
  const resultados = new Array(fns.length)
  let i = 0
  async function worker() {
    while (i < fns.length) {
      const idx = i++
      resultados[idx] = await fns[idx]()
    }
  }
  await Promise.all(Array.from({ length: limit }, worker))
  return resultados
}
```

La consigna: **no memorizar leetcode** → **pensar en voz alta** y testear edge cases (vacío, duplicados, un solo elemento, entrada ya ordenada, error de una tarea).

## Pair / live coding

- Clarifica requisitos y examples antes de codear.
- Casos límite y complejidad al final.
- Habla de tests (unidades M10) aunque no te lo pidan.

Guion de 20 minutos:

1. **Clarifica (2–3 min)**: ¿entradas/salidas? ¿casos límite? ¿puedo suponer X? Ejemplo concreto antes de tocar el teclado.
2. **Plan (1 min)**: enuncia la estrategia en una frase.
3. **Codea (10 min)**: nombres legibles, no optimices prematuramente.
4. **Prueba (3 min)**: recorre mentalmente 2–3 casos, incluidos los raros; si hay tiempo, escribe un test real (usa lo del **M10**).
5. **Complejidad y mejoras (2 min)**: Big-O y "si hubiera 10⁶ elementos, cambiaría X".

Incluso si no te lo pidan, **habla de tests**: "con Jest lo cubriría así: caso feliz, vacío y duplicado" marca la diferencia entre junior y junior que ya ha trabajado en equipo.

## Preparación práctica

1. README de portfolio con screenshots y “cómo ejecutar”.
2. 2 min pitch: quién eres, stack, proyecto top, qué buscas.
3. Elegir 2 features de tu proyecto final y explicarlas con trade-offs.

### 1. README de portfolio

Debe responder en 30 segundos: **qué es, cómo se ve, cómo se ejecuta**.

```markdown
# Tienda Demo
E-commerce en React + TS con carrito persistente.

![home](docs/screenshots/home.png)

## Cómo ejecutar
pnpm install
pnpm dev        # http://localhost:5173
pnpm test       # Jest (M10)

## Stack
React 19 · TypeScript · Vite · Jest
```

Screenshots (o gif) obligatorios; sin imagen, el reclutador no hace clic.

### 2. Pitch de 2 minutos

Guion que cabe en 120 segundos:

- **0–20 s**: quién eres y qué te define ("frontend junior, vengo de un bootcamp/me formé con un roadmap completo, me especializo en React + TS").
- **20–60 s**: tu mejor proyecto — problema, para quién, qué aportaste *tú*.
- **60–90 s**: una decisión técnica con trade-off (ver punto 3).
- **90–120 s**: qué buscas (rol, equipo, tecnologías).

Grábate con el móvil y **escúchate**: si te aburres tú, ellos también. Corta adjetivos vacíos ("passionado", "team player") y pon **hechos**.

### 3. Dos features con trade-offs del proyecto final

Prepara dos historias de tu proyecto (M23) a fondo. Fórmula: *qué pedía el usuario → qué hice → alternativa descartada → qué sacrifiqué*.

```text
Feature A: persistencia del carrito
- Pedía: que el carrito sobreviviera al refresh.
- Hice: localStorage en un reducer + tests de migración.
- Alternativa: backend con sesión → más fiel entre dispositivos,
  pero exigiría auth (M22) y retrasaba el MVP.
- Trade-off: pierde sincronización multi-dispositivo; gano cero
  infraestructura.

Feature B: lista de pedidos virtualizada
- Problema: 5 000 filas congelaban el scroll.
- Alternativa: paginación → menos código, peor experiencia de búsqueda.
- Trade-off: añado una dependencia y un edge case con foco/teclado
  a cambio de 60 fps estables.
```

Si puedes repetir este patrón sin leer, estás listo para la ronda de "cuéntame un proyecto".

## Errores comunes

- **Codear sin clarificar**: empiezas a escribir y a mitad descubres que la entrada era otra. Pregunta primero; **es valor, no debilidad**.
- **Silencio total durante el live coding**: el entrevistador no adivina tu razonamiento. Di en voz alta: enfoque, dudas, alternativas.
- **Optimizar antes de funcionar**: escribe la versión correcta, luego habla de complejidad.
- **Memorizar respuestas de LeetCode sin entender**: si te piden "explica tu código" y no puedes, es peor que no saberlo.
- **React: decir "se re-renderiza si cambian las props" a medias**: olvidas contexto y que *el padre* también dispara render.
- **Usar `index` como key sin saber por qué**: la pregunta clásica de junior; ten la respuesta de reordenamiento/foco lista.
- **`useEffect` con deps vacías para todo**: es "no entiendo el ciclo de vida".
- **`==` por costumbre** y no poder justificar cuándo `== null` tiene sentido.
- **Pitch de 5 minutos** o sin "qué buscas": el tiempo del entrevistador también es un requisito.
- **Portfolio sin "cómo ejecutar"**: si no arranca en 3 comandos, asumen que no funciona.

## Conceptos clave

- **Microtareas vs macrotasks**: Promesas vacían la cola de microtareas antes de la siguiente macrotask.
- **Closures**: funciones que recuerdan su ámbito de creación.
- **`===` por defecto**; `== null` como única excepción idiomática.
- **TDZ**: `let`/`const` usadas antes de declarar → `ReferenceError`.
- **Debounce / throttle**: "esperar a que paren" vs "ejecutar cada N ms".
- **Re-render**: estado propio, contexto o padre.
- **Keys estables**: nunca `index` en listas reordenables.
- **useEffect**: dependencias completas + función de limpieza.
- **Controlled vs uncontrolled**: quién es la fuente de verdad del input.
- **Composition vs prop drilling**: pasar comportamiento, no datos innecesarios.
- **Discriminated unions + narrowing**: estados cargando/ok/error.
- **Utility types**: `Partial`, `Pick`, `Omit`, `Record`.
- **Big-O**: comunicar coste con palabras ("búsqueda lineal", "dos bucles = cuadrático").
- **Clarificar → plan → codear → probar → complejidad**: guion del live coding.

## Autoevaluación

**1. ¿Qué imprime y por qué?**

```javascript
console.log('inicio')
setTimeout(() => console.log('timeout'), 0)
Promise.resolve().then(() => console.log('promise'))
console.log('fin')
```

<details>
<summary>Respuesta</summary>

```text
inicio
fin
promise
timeout
```

Primero corre todo el **código sincrónico** (`inicio`, `fin`). Después JavaScript vacía la cola de **microtareas** (el `.then` de la promesa) y solo entonces toma una **macrotask** (`setTimeout`), aunque su temporizador fuera 0 ms.

</details>

**2. ¿Cuándo se re-renderiza un componente en React y por qué `key={index}` es peligroso en listas reordenables?**

<details>
<summary>Respuesta</summary>

Se re-renderiza cuando: **(1)** cambia su propio estado, **(2)** cambia un contexto que consume, o **(3)** se re-renderiza su **padre** (los hijos lo hacen por defecto aunque sus props no cambien).

`key={index}` identifica los elementos por **posición**: si insertas, borras o reordenas, React empareja la posición vieja con el elemento nuevo y **reutiliza** el DOM/componente equivocado → estado interno (inputs, foco, animaciones) queda en la fila incorrecta. Se usa un id estable de los datos.

</details>

**3. Diferencia debounce y throttle y da un ejemplo de cada uno.**

<details>
<summary>Respuesta</summary>

- **Debounce**: solo ejecuta cuando **dejan de** llegar llamadas durante el retardo → búsqueda que consulta el servidor al dejar de teclear (una sola petición al final).
- **Throttle**: ejecuta como mucho **una vez cada N ms**, aunque sigan llegando llamadas → cálculo en `scroll`/`resize` o seguir la posición del ratón sin saturar.

</details>

**4. En el live coding, ¿qué haces ANTES de escribir código y qué mencionas DESPUÉS de que funcione?**

<details>
<summary>Respuesta</summary>

**Antes**: clarificar requisitos — entradas/salidas, casos límite, restricciones —, dar un ejemplo concreto y enunciar el enfoque en una frase (si hace falta, con el entrevistador).

**Después**: recorrer casos límite (vacío, duplicados, un solo elemento), hablar de **tests** (caso feliz/error/borde, como en M10) y mencionar la **complejidad** (Big-O) junto a posibles mejoras.

</details>
