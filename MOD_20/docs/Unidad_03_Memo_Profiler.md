# Unidad 03 — Memoización y Profiler

## Objetivos

- Entender **qué memoiza cada API de React** (y qué no) sin memorizar recetas vacías.
- Usar `React.memo`, `useMemo` y `useCallback` solo cuando hay un problema de rendimiento medido.
- Aplicar la técnica de **colgar el estado** (*state colgado abajo*) para acotar re-renders.
- Grabar sesiones con el **React DevTools Profiler** e interpretar el flamegraph.
- Configurar **why-did-you-render (WDUR)** en desarrollo para cazar renders evitables.

## Requisitos

- Haber completado las **Unidades 01 y 02** (saber medir y haber visto el bundle).
- React M4–M15: estado con `useState`, efectos con `useMemo`/`useCallback` vistos por encima, listas y props.
- Extensión **React DevTools** instalada en Chrome/Firefox.
- Un ejemplo con interacción repetida (filtro de lista, formulario con `onChange`, tabla ordenable) donde poder grabar.

## Qué memoiza React

| API | Evita |
|-----|-------|
| `React.memo` | re-render si props **iguales** (shallow) |
| `useMemo` | recalcular valor caro |
| `useCallback` | nueva identidad de función (para props/efectos) |
| State colgado abajo | re-render de padres innecesarios |

```jsx
const Filas = memo(function Filas({ items, onSelect }) { … })
```

**No** memoizes sin costo de re-render alto o referencia inestable en props.

Detalle de cada fila de la tabla:

- **`React.memo`**: envuelve un componente y, antes de re-renderizarlo, compara sus props con una comparación **shallow** (una capa: `===` prop por prop). Si todas son iguales, React **salta** el re-render. Truco: `memo` solo aporta si las props que recibe el componente son estables o caras de procesar; si en cada render le pasas un objeto o función **nueva**, `memo` no evitará nada.
- **`useMemo(() => calcular(x), [x])`**: recuerda el valor calculado mientras `x` no cambie. Útil cuando el cálculo es **caro** (ordenar miles de filas, filtrados complejos), no para operaciones de microsegundos.
- **`useCallback(fn, [deps])`**: recuerda la **identidad** de la función, evitando que se cree una nueva en cada render. Importante cuando esa función se pasa como prop (para que `React.memo` del hijo funcione) o es dependencia de un efecto.
- **State colgado abajo**: a veces la mejor “memoización” es no provocar el render en absoluto: mover el estado que cambia mucho al componente más bajo posible (ver la sección siguiente).

La advertencia final esencial: **no** memoizes sin un costo de re-render alto o una referencia inestable en props. Memoizar por costumbre añade complejidad y memoria sin ganancia.

## Colgar estado

```jsx
// Mal: cambio en input re-renderiza toda la lista
<input onChange={…} /> <Lista items={items} />

// Mejor: estado en el hijo que solo se re-renderiza a sí mismo
<FiltroYLista />
```

Imagina un componente que tiene el `value` del buscador **y** una lista de 1.000 elementos. Con la estructura “mala”, cada tecla actualiza el estado del padre: el padre re-renderiza, y al re-renderizar vuelve a crear el JSX de `<Lista>`, que se re-renderiza **también** aunque `items` no haya cambiado. Son 1.000 filas repintadas por cada letra.

Colgando el estado (“Mejor”), el `input` y la `Lista` viven juntos dentro de un hijo (`FiltroYLista`). Cuando escribes, el estado cambia **solo en el hijo**: el padre no se entera, no re-renderiza, y la única parte que se actualiza es la que realmente depende del filtro. Es la técnica más barata de todas: no memoizas nada, simplemente **evitas** que el render suba por el árbol.

## React DevTools Profiler

1. Abrir Profiler → **Record** → interactuar → **Stop**.
2. Flamegraph: barras ancha = tiempo de commit/render.
3. “Highlight updates” en Settings → ver qué parpadea.
4. Filtrar por commit; comparar grabaciones.

Cómo usarlo en la práctica:

1. Abre DevTools, ve a la pestaña **Profiler** y pulsa el icono de grabación (círculo). Interactúa con la app (escribe en el filtro, abre el modal…) y pulsa **Stop**.
2. Verás el **flamegraph**: cada barra es un componente; a **más ancho, más tiempo** dedicó ese commit a renderizar. Busca barras anchas de componentes que “no deberían” estar trabajando (por ejemplo, la lista completa al escribir en un input).
3. En **Settings** del Profiler activa **“Highlight updates”**: los componentes que re-renderizan se iluminan en pantalla en tiempo real. Es la forma más rápida de detectar renders fantasma mientras interactúas.
4. Puedes **filtrar por commit** (la barra inferior muestra cada commit de React) y **comparar grabaciones** guardadas antes/después de tu cambio: si la barra de tu componente se estrecha, la optimización funcionó.

## why-did-you-render (WDUR)

```js
// solo en desarrollo
if (import.meta.env.DEV) {
  const whyDidYouRender = await import('@welldone-software/why-did-you-render')
  whyDidYouRender(React, { trackAllPureComponents: true })
}
```

Marca renders evitables (`<>` en la lista de updates).

WDUR es una librería de desarrollo que **instrumenta React** para decirte, en consola, *por qué* se re-renderizó un componente y si ese render era evitable. La configuración de arriba (Vite) solo se carga en `import.meta.env.DEV`, nunca en producción:

- `await import(...)` mantiene la librería **fuera del bundle de producción**.
- `trackAllPureComponents: true` rastrea todos los componentes “puros” (los envueltos en `memo` y afines).

Cuando un render es evitable, WDUR lo marca con un símbolo `<>` en la lista de *updates* de la consola: es tu señal de que una prop cambió de identidad sin cambiar de valor (típicamente un objeto o función creados “al vuelo” en el render del padre).

## Trazas útiles

- `[WhyDidYouRender]` → identidad de props.
- `Profiler` de React → regresión entre builds.

Dos tipos de traza complementarias:

- **`[WhyDidYouRender]`** en la consola: te muestra **la identidad de las props** que cambiaron (por ejemplo, “`onSelect` ahora es una función nueva”). Te dice exactamente qué arreglar: estabilizar esa referencia con `useCallback`, pasar primitivos, etc.
- **`Profiler` de React**: úsalo para detectar **regresiones entre builds**. Graba la misma interacción antes y después de un cambio (o de una actualización de dependencias) y compara: un commit claramente más ancho = has introducido rendimiento de sobra.

## Errores comunes

- **Memoizar “por si acaso”** sin un problema de rendimiento medido: añade complejidad y memoria sin ganancia (vuelve a la Unidad 01: primero mide).
- **Pasar props inestables a un componente con `memo`**: si en cada render del padre creas `items={array.filter(...)}` o `onSelect={() => ...}` nuevas, `memo` nunca igualará las props y no evitará ningún render.
- **`useCallback`/`useMemo` en cálculos baratos**: el coste de memoizar puede superar al del propio cálculo.
- **Usar WDUR en producción**: la instrumentación es pesada; configúrala solo tras `import.meta.env.DEV`.
- **Confundir “muchos renders” con “lento”**: un render barato mil veces puede ser irrelevante; confirma con el tiempo del flamegraph y con Lighthouse (Unidad 01).

## Conceptos clave

- **`React.memo`**: evita re-render del componente si sus props son iguales (comparación shallow).
- **`useMemo`**: memoriza un **valor** calculado caro entre renders.
- **`useCallback`**: memoriza la **identidad** de una función (props y dependencias de efectos).
- **State colgado abajo**: mover el estado al componente más bajo posible para que los padres no re-rendericen.
- **Profiler (React DevTools)**: graba commits y muestra un flamegraph; “Highlight updates” ilumina re-renders en pantalla.
- **Flamegraph**: gráfico donde la anchura de cada barra representa el tiempo de render/commit de un componente.
- **why-did-you-render (WDUR)**: librería solo-desarrollo que marca con `<>` los renders evitables y traza la identidad de las props (`[WhyDidYouRender]`).

## Autoevaluación

1. Tienes `<Filas items={datos} onSelect={elegir} />` con `Filas` envuelto en `memo`, pero `Filas` se re-renderiza en cada render del padre. ¿Qué deberías comprobar primero?

<details><summary>Respuesta</summary>

Comprobar la **estabilidad de las props**: si `datos` es un array nuevo (`datos.filter(...)` creado en el render) o `elegir` es una función anónima nueva, la comparación shallow de `memo` falla y el hijo re-renderiza igual. Soluciones: memoizar el array con `useMemo` y la función con `useCallback`… pero solo si el Profiler demuestra que el re-render importa (Unidad 01: medir primero).

</details>

2. En el Profiler ves que al escribir cada letra en un input se re-renderiza una lista de 1.000 filas. ¿Cuál es la solución estructural barata antes de tocar `memo`?

<details><summary>Respuesta</summary>

**Colgar el estado hacia abajo**: mover el `value` del input al componente que contiene también la lista (por ejemplo `<FiltroYLista />`), de modo que el cambio de estado solo re-renderice ese hijo y no suba por el árbol re-renderizando padres y la lista completa. Es más simple que memoizar y ataca la causa.

</details>

3. ¿Qué significa el símbolo `<>` de why-did-you-render en consola y qué traza lo acompaña?

<details><summary>Respuesta</summary>

Significa que hubo un **render evitable**: el componente re-renderizó aunque sus props no debían cambiar. Lo acompaña la traza `[WhyDidYouRender]`, que detalla la **identidad de las props** que cambiaron (p. ej. una función u objeto creado de nuevo en el render), indicándote exactamente qué referencia estabilizar.

</details>

4. ¿Por qué el código de WDUR va dentro de `if (import.meta.env.DEV)` con un `await import(...)`?

<details><summary>Respuesta</summary>

Para que **solo exista en desarrollo**: `import.meta.env.DEV` es falso en el build de producción y el `import()` dinámico evita que la librería entre en el bundle final. WDUR instrumenta React y es pesada; no debe viajar al código que usan las personas usuarias.

</details>
