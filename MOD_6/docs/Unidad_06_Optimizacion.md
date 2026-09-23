# Unidad 06 — Optimización: React.memo, useMemo, useCallback, Profiler

## Objetivos

- Repasar con precisión los **4 casos** en los que un componente se re-renderiza (props, estado, padre, contexto).
- Aplicar `React.memo` con criterio (ejemplo `ListaItem`, comparación *shallow* de props) y saber **cuándo compensa**.
- Escribir un **comparador custom** de `memo` entendiendo el riesgo de ignorar cambios reales.
- Recordar `useMemo` (cálculos: `filter`, `sort`, reducciones) y `useCallback` (funciones para `memo`, repaso de M5).
- Interiorizar la **regla de oro: "mide primero, memóiza después"** y por qué abusar de la memoización empeora el código (a veces incluso el rendimiento).
- Usar las herramientas de medida: **React DevTools Profiler**, **highlight updates** y **Lighthouse / Bundle analyzer** (M20).
- Localizar la demo del curso: `../EJEMPLO_REACT_AVANZADO/src/components/DemoOptimizacion.jsx`.

## Requisitos

- **`memo`, `useMemo` y `useCallback` de M4–M5**: sabes qué hacen y cómo funcionan las dependencias (`deps`). En esta unidad no los descubrimos, los **aplicamos con estrategia**.
- **U01 Context**: entiendes que un cambio de contexto re-renderiza a todos los consumidores (`useContext`), porque la sección de "Context caro" de la tabla parte de ahí.
- Conocer el ciclo de vida básico de render de React (de M4) ayuda, pero lo repasamos en la primera sección.

## Ciclo de render (repaso): ¿cuándo se re-renderiza un componente?

Antes de optimizar hay que saber **qué** se está optimizando. Un componente de función se vuelve a ejecutar (re-renderiza) cuando ocurre **cualquiera** de estos 4 casos:

1. **Sus props cambiaron.** React compara las props con las del render anterior y, si detecta cambios, vuelve a renderizar. Nota: compara por referencia/valor de cada prop; una función creada "nueva" cada render **cuenta** como prop cambiada.
2. **Su estado cambió.** Su propio `setState` / `useState` con un valor nuevo (con la semántica de comparación de React) dispara un re-render solo de ese componente (y, por defecto, de sus hijos).
3. **Su padre re-renderizó (por defecto).** React **no** tiene `shouldComponentUpdate` automático en funciones: si el padre se ejecuta de nuevo, sus hijos también, salvo que los protejas con `memo`. Este es el caso más invisible y el que más rendimiento gasta en listas grandes.
4. **El contexto que consume cambió.** Si usa `useContext(AlgúnContexto)` y el valor del provider cambia, ese componente re-renderiza **aunque sus props y su estado sean idénticos**. Por eso un objeto de contexto mal memorizado ("valor crudo" en el provider) se paga en todos los consumidores.

**Analogía de la pizarra:** un profesor (React) solo vuelve a copiar en la pizarra de un alumno (re-render) si cambió el enunciado (props), si el alumno mismo escribió algo nuevo (estado), si rehizo la clase entera para todos (padre) o si cambió el temario del centro (contexto). Optimizar es evitar que rehaga la clase completa cuando solo cambió una tiza.

**Por qué importa:** cada re-render ejecuta JSX, crea elementos nuevos y, si el componente es caro (cálculos, listas grandes, hijos pesados), cuesta tiempo de CPU. El objetivo no es "cero renders" (React renderiza mucho y está bien), sino **no renders inútiles**.

## React.memo

`React.memo` es el HOC que convierte un componente de función en uno **memoizado**: React compara sus props con las anteriores con igualdad **shallow** (una capa: `===` por prop) y, si son iguales, **salta el re-render**.

Ejemplo clásico de item de lista:

```jsx
const ListaItem = memo(function ListaItem({ item, onToggle }) {
  return <li onClick={() => onToggle(item.id)}>{item.title}</li>
})
```

**Qué significa:** aunque el padre (`<Lista>`) se re-renderice mil veces, si `item` y `onToggle` siguen siendo **el mismo** `item` y la **misma** función, React no vuelve a ejecutar `ListaItem`. En una lista de 10.000 filas donde solo cambia el filtro de al lado, esa diferencia es enorme.

**Qué compara (shallow-equal de props):** mira cada prop por encima con `===`. Un objeto `{ id: 1 }` **nunca** es `===` a otro `{ id: 1 }` recién creado, aunque sean "iguales" en contenido; en cambio `item.id`, strings, números, booleanos y **las mismas referencias** de funciones/objetos sí pasan la comparación. Por eso `memo` solo funciona si le llegan props **estables**.

### ¿Cuándo compensa `memo`?

Solo compensa si se cumplen **a la vez**:

1. El componente es **caro** (renderiza mucho DOM, hace cálculos, se monta muchísimas veces en una lista grande), **y**
2. Las props **no** son funciones/objetos nuevos cada render (usa `useCallback` para callbacks y valores primitivos o referencias estables para datos).

Si tu componente es barato (un `<span>`) y las props cambian siempre de referencia, `memo` solo añade una comparación que **tampoco** ahorra nada: has cambiado un render barato por una comparación casi igual de cara. **`memo` sin props estables no sirve de nada; `memo` en componentes triviales casi nunca compensa.**

### Comparador custom (con cuidado)

A veces la igualdad shallow es demasiado estricta: quieres que "solo me importa el `id`":

```jsx
memo(Comp, (prev, next) => prev.id === next.id)
```

El segundo argumento es una función `(prevProps, nextProps) => boolean`: devuelve `true` si las props se consideran **iguales** (se salta el re-render) y `false` si hay que re-renderizar.

**Cuidado (por qué importa):** si tu comparador decide que `title`, `items` o `onSelect` "son iguales" cuando en realidad cambiaron, el componente quedará **obsoleto** (stale): mostrará datos viejos y nadie sabrá por qué. Reglas:

- Devuelve `true` (salta) solo para cambios que **realmente** no afectan al render de `Comp`.
- Si ignoras una prop, **ninguna** rama de `Comp` puede depender de ella.
- Es la herramienta **más peligrosa** de las tres: `memo` normal solo puede quedarse corto en rendimiento; un comparador malo puede romper la **corrección** de la UI.

## `useMemo` (repaso: cálculos)

`useMemo` memoriza **el resultado de un cálculo** mientras sus dependencias no cambien. Encaja con operaciones **derivadas** del estado/props: `filter`, `sort`, reducciones (`reduce`), agregaciones, búsquedas... típico de "lista grande + filtro".

```jsx
const visibles = useMemo(
  () => tareas.filter((t) => t.titulo.includes(query)).sort((a, b) => a.prioridad - b.prioridad),
  [tareas, query]
)
```

**Qué significa:** si `tareas` y `query` no cambian, React devuelve el **mismo** array (misma referencia) del render anterior sin volver a filtrar/ordenar. **Por qué importa:** (a) ahorras CPU en listas grandes; (b) y esto es igual de importante, le das una **referencia estable** a ese array, lo que hace que otros `memo` que reciban ese array puedan saltarse el re-render. Un `useMemo` mal usado (deps vacías cuando sí cambian cosas) deja **datos viejos**; repasa siempre tus dependencias.

## `useCallback` (repaso de M5: funciones para `memo`)

`useCallback` memoriza la **definición de una función**: mientras sus dependencias no cambian, recibe la **misma referencia** render tras render.

```jsx
const handleToggle = useCallback((id) => {
  setTareas((prev) => prev.map((t) => (t.id === id ? { ...t, hecho: !t.hecho } : t)))
}, [])
```

**Por qué importa junto a `memo`:** recuerda el ejemplo de `ListaItem`: si el padre le pasa `onToggle={handleToggle}` y `handleToggle` es una función **nueva** cada render, la prop `onToggle` falla la comparación shallow y `memo` **no ahorra nada**. Con `useCallback`, el hijo recibe siempre la misma referencia → `memo` se activa. Es la pareja clásica: **`useCallback` en el padre + `memo` en el hijo**. También evita re-renders innecesarios de hijos que reciben la función pero que no están con `memo`.

## Regla de oro: mide primero, memóiza después

> **Mide primero, memóiza después.** `useMemo` / `useCallback` / `memo` tienen coste; abusar empeora legibilidad y a veces rendimiento.

**Por qué abusar empeora las cosas:**

- **Tienen coste propio:** cada `useMemo`/`useCallback` guarda el valor en el árbol de hooks y ejecuta tu comparación de deps en cada render; cada `memo` añade una comparación shallow de props. En componentes baratos, **pagas la memoización para ahorrar un render que casi no costaba**.
- **Coste de memoria:** mantener arrays/objetos/funciones viejos vivos consume memoria y dificulta la recolección de basura.
- **Legibilidad y bugs de deps:** el código se llena de `useCallback(fn, [a, b, c])` que hay que mantener sincronizado; una dep olvidada produce **stale closures** (la función ve valores viejos) y datos desactualizados en `useMemo`.
- **Falsa sensación de "rendimiento":** sin medir, estás adivinando; a veces el hot spot real estaba en otra parte (un layout pesado, un effect que buclea, un chunk enorme).

Orden recomendado: **1)** escribe la versión simple, **2)** mide con Profiler en una interacción real, **3)** solo optimiza lo que el profiler marca en rojo, **4)** vuelve a medir para confirmar que mejoró.

## Herramientas

1. **React DevTools Profiler**: graba una interacción (botón "Record"), reproduce la acción y observa **qué componentes re-renderizaron y por qué** (el panel "Why did this render?" indica si fue por **props, state, hooks, context o parent**). Es tu fuente de verdad para decidir si un `memo` tiene sentido: si un componente caro no aparece re-renderizado en la grabación, no lo toques.
2. **highlight updates** en DevTools (opción "highlight updates when components render"): pinta un contorno alrededor de lo que se re-renderiza en pantalla en tiempo real. Ideal para descubrir, a ojo, que "todo el árbol" se repinta al escribir en un input.
3. **Lighthouse / Bundle analyzer** (M20): la optimización no es solo renders. Lighthouse mide métricas de carga y rendimiento reales; el bundle analyzer (por ejemplo, el plugin de webpack/Vite) te muestra el **tamaño de los chunks**: a veces el "lento" no son los renders sino que estás descargando 500 KB de librerías. No mires solo el árbol de React; mira también el **peso del bundle**.

## Patrones frecuentes

| Problema | Solución |
|----------|----------|
| Lista grande + filtro | `useMemo` en el array filtrado |
| Hijo memo con callbacks nuevos | `useCallback` + deps correctas |
| Context caro | partir contextos; valor con `useMemo` |
| Estado que solo usa un subtree | bajar el estado |

Explicación de cada fila:

- **Lista grande + filtro:** `filter`/`sort` en cada render de 5.000 elementos es caro y crea un array nuevo (rompe `memo` de los hijos). Solución: `const visibles = useMemo(() => ..., [datos, filtro])`.
- **Hijo memo con callbacks nuevos:** el `memo` del hijo no hace nada si cada render le llega un `onToggle` distinto. Solución: `useCallback` en el padre **con las deps correctas** (ni vacías por miedo, ni todas por prudencia).
- **Context caro:** el valor del provider (`value={{ usuario, permisos }}`) crea un objeto nuevo en cada render del provider → se disparan **todos** los consumidores. Solución: **partir** los contextos (uno de datos y otro de acciones, por ejemplo) y memorizar el valor con `useMemo` (`value={useMemo(() => ({ usuario, permisos }), [usuario, permisos])}`). Consumidores que solo necesitan `usuario` no se enteran de cambios de `permisos`.
- **Estado que solo usa un subtree:** si el estado vive arriba y solo lo consume una rama, cada cambio re-renderiza **todo** lo que cuelga del padre. Solución: **bajar el estado** (o moverlo con un estado derivado) hasta el componente que lo usa; el resto del árbol ni se entera. A veces la mejor "memoización" es **subir el estado de lugar**, no añadir hooks.

## En el ejemplo del curso

`../EJEMPLO_REACT_AVANZADO/src/components/DemoOptimizacion.jsx` — lista con `memo`, `useCallback` en el handler y `useMemo` en el score del item.

## Errores comunes

**1. Memorizar sin medir (abuso de `useMemo`/`useCallback`/`memo`).**

```jsx
// ERROR: cálculo trivial memorizado "por si acaso" → coste extra y ruido
const mayuscula = useMemo(() => texto.toUpperCase(), [texto])
```

```jsx
// SOLUCIÓN: mide primero (Profiler); si el componente no es hot spot, deja el código simple
const mayuscula = texto.toUpperCase()
```

**2. Pasarle a un hijo con `memo` callbacks u objetos nuevos en cada render.**

```jsx
// ERROR: onToggle es nueva cada render → memo del hijo nunca salta
<ListaItem item={item} onToggle={(id) => toggle(id)} filtro={filtros} />
```

```jsx
// SOLUCIÓN: useCallback + props estables (primitivos o memorizadas)
const onToggle = useCallback((id) => toggle(id), [toggle])
<ListaItem item={item} onToggle={onToggle} />
```

**3. Comparador custom que ignora props que el hijo sí usa.**

```jsx
// ERROR: si Comp renderiza con next.onSelect, quedará con la función vieja (stale)
const Comp = memo(Comp, (prev, next) => prev.id === next.id)
```

```jsx
// SOLUCIÓN: compara todas las props de las que Comp realmente depende
const Comp = memo(CompBase, (prev, next) =>
  prev.id === next.id && prev.onSelect === next.onSelect
)
```

**4. Contexto con valor crudo (objeto nuevo) en cada render del provider.**

```jsx
// ERROR: value es un objeto nuevo → se re-renderizan TODOS los consumidores
<Contexto.Provider value={{ usuario, permisos }}>{children}</Contexto.Provider>
```

```jsx
// SOLUCIÓN: memorizar el valor y partir el contexto si hace falta
const value = useMemo(() => ({ usuario, permisos }), [usuario, permisos])
<Contexto.Provider value={value}>{children}</Contexto.Provider>
```

**5. Deps de `useMemo` olvidadas → datos viejos.**

```jsx
// ERROR: si tareas cambia, visibles no se recalcula nunca más
const visibles = useMemo(() => filtrar(tareas), [])
```

```jsx
// SOLUCIÓN: incluye TODAS las dependencias del cálculo
const visibles = useMemo(() => filtrar(tareas, query), [tareas, query])
```

## Conceptos clave

- **4 causas de re-render**: cambiaron las **props**; cambió su **estado**; su **padre** re-renderizó (por defecto arrastra a los hijos); cambió el **contexto** que consume.
- **`React.memo`**: salta el re-render si las props son **shallow-iguales** (`===` por prop).
- **Cuándo compensa `memo`**: componente **caro** **y** props **estables** (nada de funciones/objetos nuevos por render).
- **Comparador custom** `memo(Comp, (prev, next) => ...)`: potente y **peligroso**; si ignoras una prop real, la UI queda stale.
- **`useMemo`**: memoriza **cálculos** (`filter`, `sort`, reducciones) mientras no cambien las deps; además da **referencias estables** a otros `memo`.
- **`useCallback`** (repaso M5): memoriza **funciones**; imprescindible para que `memo` de los hijos tenga éxito.
- **Regla de oro**: **"mide primero, memóiza después"**; abusar cuesta CPU/memoria, rompe la legibilidad y a veces empeora el rendimiento.
- **Herramientas**: **React DevTools Profiler** (grabar y ver **por qué** cada re-render: props/state/hooks/context/parent), **highlight updates**, **Lighthouse / Bundle analyzer** (M20) para el tamaño de chunks.
- **Patrones**: lista grande → `useMemo`; hijo memo → `useCallback`; Context caro → partir + `useMemo` del valor; estado de un subtree → **bajar el estado**.
- **Ejemplo del curso**: `DemoOptimizacion.jsx` (`memo` + `useCallback` + `useMemo` del score).

## Autoevaluación

**1. Nombra los 4 casos en los que un componente se re-renderiza y da un ejemplo de cada uno.**

<details>
<summary>Respuesta</summary>

1) **Props cambiaron**: le llega un `titulo` nuevo. 2) **Su estado cambió**: su `useState`/`setState` recibe un valor nuevo. 3) **Su padre re-renderizó** (por defecto): el padre cambió su estado y sus hijos se ejecutan de nuevo salvo que estén con `memo`. 4) **El contexto que consume cambió**: su `useContext` recibe un valor distinto del provider, aunque props y estado sean idénticos.

</details>

**2. ¿Cuándo compensa envolver un componente en `React.memo`? ¿Y por qué `memo` no sirve si el padre le pasa un callback nuevo cada render?**

<details>
<summary>Respuesta</summary>

Compensa cuando (1) el componente es **caro** (o se monta muchísimas veces) **y** (2) sus props son **estables**. `React.memo` compara props de forma **shallow**: una función creada en cada render del padre es un objeto nuevo (`fn1 !== fn2`), así que la comparación siempre falla y el `memo` no ahorra ningún render. Solución: `useCallback` en el padre (o memorizar el objeto) para que la referencia sea la misma.

</details>

**3. Explica la regla de oro "mide primero, memóiza después" y tres razones por las que abusar de la memoización empeora el código.**

<details>
<summary>Respuesta</summary>

Significa que no debes añadir `memo`/`useMemo`/`useCallback` por instinto: primero graba la interacción con el **Profiler**, identifica el componente realmente costoso y solo después memoizas (y vuelves a medir). Tres razones para no abusar: (1) la memoización tiene **coste propio** (guardar valores y comparar deps/props en cada render); (2) consume **memoria** y complica el garbage collector; (3) empeora la **legibilidad** y abre la puerta a **deps mal puestas** (stale closures, datos viejos) sin garantía real de ganancia.

</details>

**4. Tu app re-renderiza 40 componentes al cambiar de usuario en un provider. Usa la tabla de patrones: ¿qué haces?**

<details>
<summary>Respuesta</summary>

Es el patrón **"Context caro"**: probablemente el provider hace `value={{ usuario, permisos }}` (objeto nuevo en cada render), dispara a todos los consumidores. Aplico: **partir el contexto** (contexto de datos y contexto de acciones, o usuario vs. permisos) para que cada consumidor escuche solo lo que usa, y memorizar cada `value` con **`useMemo`** con deps correctas. Como alternativa/complemento, si el estado solo lo necesita una rama, **bajo el estado** a ese subtree para que el resto ni se entere.

</details>
