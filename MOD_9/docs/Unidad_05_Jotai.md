# Unidad 05 — Jotai

## Objetivos

- Entender el **modelo atómico**: estado en piezas pequeñas e independientes en lugar de un árbol único.
- Crear **átomos primitivos** y leerlos/escribirlos con `useAtom`.
- Derivar valores con **átomos de solo lectura** y saber por qué se recalculan solo cuando toca.
- Encapsular lógica de escritura en **átomos de write** (`get`/`set`).
- Usar **`<Provider scope>`** para aislar valores por subtree (el reemplazo más común de Context en Jotai).
- Situar Jotai frente a Redux/Zustand con la tabla de casos de uso.

## Requisitos

- **M4–M5 — Hooks**: `useState` es la referencia mental de un átomo primitivo ("como useState pero global"); `useMemo` para entender la *memoización* de los átomos derivados.
- **M6 — Unidad 01 (Context)**: saber por qué un Provider aísla valores; en Jotai verás el mismo concepto con `scope`.
- **Unidades 02–03 (Redux)** y **04 (Zustand)**: conocer el modelo de **store único con selectores** para poder contrastarlo con el modelo de átomos. No podrás apreciar "cuándo Jotai" sin haber visto "cuándo lo otro".
- **Secuencia**: es la última unidad técnica; cierra con la **06 (Comparativa)**, donde se pone todo en una tabla de decisión.

## Modelo atómico

En Redux/Zustand el estado suele ser un **árbol**; en Jotai son **átomos** independientes que se componen.

### Qué significa esto en la práctica

- En Redux/Zustand tienes **un** estado grande (`{ user, cart, theme, ... }`) con acciones que llegan a cualquier rama. El store es un árbol jerárquico.
- En Jotai tienes **muchos estados chicos** (`contadorAtom`, `temaAtom`, `usuarioAtom`...) sin jerarquía obligatoria. Cada componente se suscribe **solo** a los átomos que usa. No hay "el estado global": hay una **nube de átomos**.
- **Componer** = un átomo puede leer a otro. De ahí salen los derivados: el doble del contador no se guarda en ningún sitio; se **calcula** a partir del contador cuando este cambia.

> Analogía: RTK/Zustand es una **hoja de cálculo** con una pestaña maestra y fórmulas enganchadas a celdas. Jotai es una **caja de LEGO**: piezas pequeñas, independientes, que puedes combinar sin rehacer la caja entera. Si una pieza no se usa, no pesa.

**Por qué importa**: el coste de cambiar un átomo solo lo pagan los componentes que lo usan. En un store gigante con selectores mal hechos, un cambio en "tema" puede re-renderizar media app; en Jotai, `temaAtom` solo re-renderiza a quien lo `useAtom`.

**Instalación**

```bash
pnpm add jotai
```

## Átomos primitivos

```jsx
import { atom, useAtom } from 'jotai'

const contadorAtom = atom(0)
const temaAtom = atom('light')

function Contador() {
  const [valor, setValor] = useAtom(contadorAtom)   // como useState global
  return <button onClick={() => setValor((v) => v + 1)}>{valor}</button>
}
```

- `atom(valorInicial)`: crea el átomo. **Ojo**: esto se ejecuta a nivel de módulo (una sola vez), igual que en Zustand; no lo crees *dentro* del render de un componente o perderías el estado en cada render.
- `useAtom(atom)`: devuelve **tupla** `[valor, setValor]`, deliberadamente idéntica a `useState` para que la transición te resulte instantánea. Acepta updater funcional `setValor(v => v + 1)` como en el M5.
- **No hay Actions ni reducers**: escribir un átomo primitivo es asignarle un valor, punto. Si necesitas lógica alrededor, se encapsula en átomos de escritura (siguiente sección) o en un store "al estilo Redux" (Jotai tiene `atomWithReducer`, fuera del alcance de esta intro).
- Dos componentes distintos que hagan `useAtom(contadorAtom)` ven **el mismo contador**: es el estado global por definición, repartido en piezas.

## Átomos derivados (read-only)

```js
const dobleAtom = atom((get) => get(contadorAtom) * 2)

function Doble() {
  const [doble] = useAtom(dobleAtom)   // o useAtomValue
  return <span>{doble}</span>
}
```

Se recalcula **solo** cuando cambian los átomos de los que depende.

### Qué significa "derivado read-only"

- El primer argumento de `atom(fn)` es una **función de lectura**: `get(...)` lee otros átomos y devuelve el valor calculado. **No** tiene setter: `useAtom` te devolverá un setter que, en la práctica, no debes usar (para eso está `useAtomValue`, que solo lee y transmite menos re-renders).
- **Memoización**: mientras `contadorAtom` no cambie, `dobleAtom` devuelve el **mismo valor cacheado**; no se recalcula en cada render de cada componente. Es la misma idea que `useMemo` del M5, pero declarativa y a nivel de dato: los derivados forman un **grafo de dependencias** que Jotai recorre solo donde hizo falta.
- Comparación: en RTK esto sería un **selector** `selectDoble(state)`; en Zustand, derivarlo con `useMemo` fuera del selector (como viste en los errores comunes de la 04). Jotai lo convierte en un **ciudadano de primera clase**: un átomo más, con nombre, reutilizable.

Esto ataca directamente el "error de diseño" clásico de guardar en el store valores **calculados** (duplicidad: se desincronizan). En Jotai la tentación es menor: el derivado no se "guarda", se calcula.

## Escritura derivada

```js
const incrementarAtom = atom(
  null,
  (get, set) => set(contadorAtom, (c) => c + 1),
)
```

Átomo de **dos funciones**: `read` (aquí `null`, no devuelve nada interesante) y `write(get, set, ...args)`. Al hacer `useSetAtom(incrementarAtom)` obtienes una función que, al llamarla, **encapsula** la lógica de escritura.

Por qué existe:

- Agrupa pasos: si incrementar el contador además debe tocar otro átomo (p. ej. un "log de acciones"), lo haces en **un** sitio.
- Es el equivalente filosófico a una **action** de Redux o a un método del store de Zustand: un **nombre con intención** (`incrementar`) en vez de asignaciones sueltas por la UI.
- Deja a los componentes tontos: `onClick={incrementar}`, sin saber qué átomos hay por dentro.

## Scope (reemplaza mucha Context)

```jsx
import { Provider } from 'jotai'

<Provider scope={temaAtom}>   // valores aislados por subtree
  <App />
</Provider>
```

### Qué es `scope`

Por defecto, los átomos con **estado** comparten un "árbol de providers" global. Con `scope` marcas un átomo para que, dentro de ese `<Provider>`, tenga una **instancia aislada**: dos ramas con el mismo átomo no se pisan.

Cuándo lo necesitas (aquí Jotai se parece sospechosamente a Context, el M6):

- un tema/idioma **por portada** que no debe contaminar al resto,
- un wizard/paso a paso con estado local en cada sección,
- tests donde quieres un átomo limpio por caso.

Por qué importa: es el 80% de los usos de Context "de verdad" resueltos con un átomo + un Provider de una línea, sin escribir `createContext`, sin custom hook y con la misma granularidad de re-renders que el resto de Jotai.

## Cuándo Jotai vs el resto

| Caso | Buena opción |
|------|--------------|
| Muchos estados pequeños e independientes | **Jotai** |
| Un dominio de negocio claro (carrito, auth) | RTK / Zustand |
| Cliente server-state cacheado | React Query (M9+ fuera del temario base) |

Cómo razonarlo:

- Si tu estado cabe en **una lista de piezas sueltas** (contador, tema, sidebar abierto, filtro local...), el átomo brilla: nada de "dónde meto esta clave en el árbol".
- Si tu estado tiene **reglas de negocio** (carrito: no duplicar, calcular total, validar stock), un store con actions/reducers (RTK) o un store con métodos (Zustand) concentra mejor esa lógica y es más fácil de testear.
- Si el estado **no es tuyo** (vive en un servidor y solo lo lees), la respuesta sigue siendo React Query/SWR, no Jotai ni Redux.

## Errores comunes

**1. Crear el átomo dentro del componente.**

```text
Síntoma: cada render crea un atom() nuevo → el estado "se pierde" o se re-renderiza en bucle
```

Solución: declara los átomos a nivel de módulo (fuera de la función del componente).

```jsx
// Mal
function Contador() {
  const cAtom = atom(0)
  const [v, setV] = useAtom(cAtom)
  return <button onClick={() => setV(v + 1)}>{v}</button>
}

// Bien
const contadorAtom = atom(0)
function Contador() {
  const [v, setV] = useAtom(contadorAtom)
  return <button onClick={() => setV(v + 1)}>{v}</button>
}
```

**2. Usar `useAtom` en un derivado de solo lectura (o intentar escribir en él).**

```text
Síntoma: confusión al usar el setter que "no hace nada" / errores en runtime
```

Solución: los derivados se leen con `useAtomValue` (o `[valor] = useAtom` ignorando el setter).

```jsx
// Bien para derivados
const doble = useAtomValue(dobleAtom)
```

**3. Derivar objetos nuevos sin dependencias claras (el "selector gigante" de Jotai).**

```text
Síntoma: re-renders continuos aunque el dato "lógicamente" no cambió
```

Solución: deriva valores **estables** (primitivos, arrays que solo cambian si cambian las fuentes) o memoriza con `useMemo` en el componente.

```js
// Preferible: derivar de átomos, no crear identidades nuevas a cada paso
const totalAtom = atom((get) => get(preciosAtom).reduce((a, b) => a + b, 0))
```

**4. Meter en átomos datos que ya están en la URL (filtros, página).**

```text
Síntoma: compartir un enlace no restaura la vista; el back del navegador no funciona
```

Solución: lo que ya expresa la URL (query params) **no** se duplica en el store; Jotai no cambia esta regla de diseño (ver Unidad 06).

## En el ejemplo

`jotaiDemo.js` — átomos `contador` + `doble` derivado en la demo de la home.

Ábrelo con `src/components/DemoJotai.jsx`: verás el átomo primitivo, el derivado y cómo dos componentes comparten el mismo contador sin Provider alguno.

## Conceptos clave

- **Modelo atómico**: muchos estados chicos e independientes en vez de un árbol único.
- **Átomo primitivo**: `atom(valor)` + `useAtom` (API espejo de `useState`, pero compartido).
- **Declarar a nivel de módulo**: los átomos se crean una vez, fuera del render.
- **Átomo derivado**: `atom((get) => ...)`; memoizado, se recalcula solo al cambiar sus fuentes.
- **`useAtomValue`**: lectura de solo-salida, ideal para derivados.
- **Átomo de escritura**: segundo argumento `write(get, set)` → lógica con nombre (`incrementar`).
- **`<Provider scope={atom}>`**: aísla instancias por subtree; sustituye mucho Context.
- **Límite**: reglas de negocio de dominio → RTK/Zustand; server cache → React Query.

## Autoevaluación

**1. Diferencia en tus palabras un átomo primitivo de un átomo derivado. ¿Cuál tiene setter?**

<details><summary>Respuesta</summary>

El **primitivo** guarda un valor inicial (`atom(0)`) y su `useAtom` devuelve `[valor, setValor]`: se lee y se escribe. El **derivado** recibe una función de lectura (`atom((get) => get(...))`) que calcula su valor a partir de otros átomos; es de solo lectura (se lee con `useAtomValue`) y se recalcula memoizado solo cuando sus dependencias cambian.

</details>

**2. ¿Por qué es un error crear un átomo con `atom(0)` dentro del cuerpo de un componente?**

<details><summary>Respuesta</summary>

Porque cada render ejecuta `atom(0)` de nuevo y produce una **referencia nueva**: el componente apuntaría a un átomo distinto cada render, perdiendo (o reseteando) el estado y pudiendo provocar bucles de render. Se declaran a nivel de módulo, igual que no crearías un store nuevo dentro del render en Zustand.

</details>

**3. ¿Qué problema resuelve `<Provider scope={temaAtom}>` y a qué se parece del M6?**

<details><summary>Respuesta</summary>

Aísla la **instancia** de ese átomo dentro de la subtree donde se usa: dos ramas pueden tener valores distintos sin contaminarse. Es el equivalente a crear un Context nuevo (o varios Providers del mismo Context con valores distintos) en el M6, pero sin la ceremonia de `createContext` + hook y manteniendo la granularidad de re-renders de Jotai.

</details>

**4. Tu app tiene un carrito con reglas (no repetir, calcular total, validar stock) y además un tema y un sidebar abierto. ¿Qué pondrías en átomos y qué en store (RTK/Zustand)?**

<details><summary>Respuesta</summary>

Tema y sidebar (estados chicos e independientes) en átomos: cambios aislados y mucha menos estructura. El carrito, con reglas de negocio y varias operaciones relacionadas, en un store con actions/métodos (RTK o Zustand): concentra la lógica, es más testeable y los devtools te muestran cada transición. (Es el criterio de la tabla "Cuándo Jotai vs el resto".)

</details>
