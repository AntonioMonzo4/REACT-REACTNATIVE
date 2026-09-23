# Unidad 03 — useCallback (y repaso de useMemo)

En el Módulo 4 aprendiste `useMemo` para memorizar **valores** calculados. En esta unidad el foco es su hermano gemelo: **`useCallback`**, que memoriza **funciones**. Verás por qué una función "nueva en cada render" puede parecer idéntica al ojo humano pero romper las optimizaciones de React, y cómo `React.memo` y `useCallback` trabajan juntos (porque el uno sin el otro casi no sirve).

## Objetivos

- Recordar qué hace `useMemo` (M4) y por qué `useCallback` es su equivalente para funciones.
- Explicar la firma `useCallback(fn, deps)` y su equivalencia con `useMemo(() => fn, deps)`.
- Entender por qué una referencia de función nueva en cada render invalida `React.memo`.
- Distinguir cuándo **sí** conviene `useCallback` de cuándo es complejidad innecesaria.
- Comparar `useMemo` vs `useCallback` con una tabla y ejemplos propios.
- Identificar las 3 trampas clásicas (deps incorrectas, memo sin `React.memo`, objetos/arrays como deps).

## Requisitos

- Módulo 4: `useState`, `useEffect` y **`useMemo`** (memorización de valores).
- Opcional: Unidad 02 (`useReducer`) — los ejemplos de callbacks con `dispatch` se leen mejor si la conoces.
- Tener claro el concepto de **referencia** (`===`) en JavaScript: dos funciones con el mismo código **no** son la misma referencia.

## Repaso breve: useMemo (M4)

Si ya pasaste el M4, esto te resultará familiar: `useMemo` evita recalcular un valor caro en cada render. React guarda el resultado y solo lo vuelve a ejecutar cuando alguna de las `deps` cambia de referencia.

```jsx
const total = useMemo(() => items.reduce((a, b) => a + b.price, 0), [items])
```

**Qué significa:** mientras `items` no cambie, `total` es el mismo valor calculado, sin repetir el `reduce`.

**Por qué importa:** en listas grandes o cálculos pesados, recalcular en cada render (porque el padre se re-renderiza por cualquier clic) es tiempo de CPU regalado. `useMemo` es el "no repitas este cálculo si las entradas no cambiaron".

Ahora bien: ¿y si lo caro no es un **valor**, sino una **función** que pasas como prop a un hijo? Ahí entra `useCallback`.

## Qué es useCallback

`useCallback` memoriza una **función**: te devuelve siempre la **misma referencia** entre renders mientras sus dependencias no cambien.

```jsx
import { useCallback, useState } from 'react'

function Padre() {
  const [count, setCount] = useState(0)

  // Misma referencia entre renders mientras deps no cambien
  const increment = useCallback(() => {
    setCount((c) => c + 1)
  }, [])

  return <Hijo onIncrement={increment} />
}
```

- `useCallback(fn, deps)` → devuelve `fn` memorizada; al cambiar `deps`, se crea una nueva.
- Equivale a `useMemo(() => fn, deps)` para funciones: es exactamente lo mismo, solo cambia la sintaxis y la intención.

**Analogía:** piensa en una fábrica de galletas. Sin `useCallback`, cada render del padre abre una fábrica nueva y te entrega una galleta recién hecha (código idéntico, pero *otra* galleta, otra referencia). Con `useCallback(..., [])`, la fábrica se construye una sola vez y cada render te entrega la **misma** galleta de siempre. Para el hijo `React.memo`, que compara si "la galleta es la misma de antes" con `===`, esto lo cambia todo.

**Qué significa cada parte de la firma:**

- `fn`: la función que quieres memorizar.
- `deps`: array de dependencias, con las mismas reglas que `useEffect` y `useMemo`: cuando cualquiera cambie, React descarta la memoria y crea una función nueva.
- El valor devuelto: la referencia estable de `fn`.

## Por qué importa

En React, **toda función creada en el cuerpo del componente es una referencia nueva** en cada render. JavaScript no "recuerda" que dos flechas tienen el mismo cuerpo: `() => {}` en el render 1 y `() => {}` en el render 2 son dos objetos distintos, y `a === b` es `false`.

Si pasas esa función a un hijo envuelto en `React.memo`, el `memo` **no sirve de nada**: compara props, la prop `onIncrement` cambió de referencia, así que el hijo se re-renderiza siempre, igual que sin `memo`.

```jsx
// Mal: nueva función cada render → hijo re-renderiza siempre
const handle = () => setCount(count + 1)

// Bien con memo:
const handle = useCallback(() => setCount((c) => c + 1), [])
```

Fíjate en un detalle extra en la versión "mal": `setCount(count + 1)` cierra sobre `count` del render actual, por eso necesita deps `[count]` si lo memorizaras. La forma funcional `setCount((c) => c + 1)` no lee `count` de fuera, así que puede vivir tranquilamente en `[]`.

**Por qué importa en la práctica:** un padre con estado que cambia a cada tecla re-renderiza todos sus hijos. Si los hijos son caros (tablas, listas, gráficos) y están en `React.memo`, necesitan props estables para filtrar esos renders. `useCallback` es la herramienta que hace estables a los callbacks que les pasas.

## Cuándo usar useCallback

✅ **Sí:**

- Pasar callbacks a componentes envueltos en `React.memo` (el caso estrella: sin esto, `memo` no filtra).
- Callbacks en dependencias de `useEffect` / `useMemo` (a veces es mejor evitarlo y usar refs, pero cabe en el mismo criterio).
- Funciones que crean un nuevo objeto/estado caro de configurar, o wrappers que deben tener identidad estable.

❌ **No hace falta:**

- Funciones locales que solo usas tú (dentro del mismo render, en un `onClick` inline, etc.) y cuya identidad no consume nadie más.
- "Por si acaso" en todo el código: complica la lectura, añade deps que hay que mantener al día y no te da ninguna optimización si no hay nadie comparando referencias.

Regla práctica de oro: **`useCallback` solo paga si alguien compara tu referencia** (normalmente `React.memo`, a veces un effect con esa función en deps). Si nadie compara, es ruido.

## useMemo vs useCallback

| Hook | Memoriza | Devuelve |
|------|----------|----------|
| `useMemo(() => valor, deps)` | el **valor** | valor |
| `useCallback(fn, deps)` | la **función** | función |

```javascript
const total = useMemo(() => items.reduce((a, b) => a + b.price, 0), [items])
const onSelect = useCallback((id) => setSelected(id), [])
```

**Cómo recordarlo:** `useMemo` = memo de *resultado*; `useCallback` = memo de *función*. Y recuerda la equivalencia: `useCallback(fn, deps)` ≡ `useMemo(() => fn, deps)`. Si un día olvidas la firma de `useCallback`, puedes "descomponerla" a `useMemo` y seguir funcionando.

| Situación | Herramienta |
|-----------|-------------|
| Calcular un total, filtrar, ordenar una lista | `useMemo` |
| Crear un handler estable para un hijo `memo` | `useCallback` |
| Inicializar un objeto/estado caro una sola vez | `useMemo` |
| Poner una función en deps de un effect | `useCallback` (o ref) |

## Las 3 trampas

1. **Deps incorrectas → closure viejo.** Si olvidas una dependencia, el memo "miente": te devuelve una función que parece estable pero capturó valores de un render antiguo. Ejemplo clásico: `useCallback(() => setCount(count + 1), [])` sigue incrementando desde el `count` inicial para siempre. Solución: pasa todas las deps reales o usa la forma funcional del setter (`setCount((c) => c + 1)`) y pon `[]` con confianza.

2. **`useCallback` sin `React.memo` en el hijo.** Si el hijo no está memorizado, React lo re-renderiza con sus padres aunque la referencia de la función no cambie: memorizar no aporta nada visible. `useCallback` y `React.memo` son pareja; el primero sin el segundo normalmente no se nota.

3. **Arrays/objetos como deps: se comparan por referencia.** El array de deps se compara elemento a elemento con `Object.is`. Si pones `[items]` y cada render creas un `items` nuevo (`items = [...]` o `filter/map` en línea), la referencia cambia, el memo se invalida cada render y vas más lento que sin memo. Pásalos con cuidado o desestructura valores primitivos (`[items.length, query]` en lugar de `[items]`).

## En el ejemplo del proyecto

Ver `../EJEMPLO_REACT_INTERMEDIO/src/components/DemoUseCallback.jsx`: callback estable vs inline + `React.memo`, con "forzar render del padre" para comparar. Dentro verás dos hijos `memo` idéricos: uno recibe `increment` con `useCallback(..., [])` (no repinta su checksum al forzar renders del padre si no cambian sus props) y otro recibe `incrementUnstable` declarada inline (referencia nueva cada render → `memo` no filtra). También hay un `useMemo` para el "checksum" simulado, así que sirve de repaso cruzado con M4.

## Errores comunes

**1. Closure viejo: deps vacías con valor leído del render**

```jsx
// ERROR: siempre hace count + 1 sobre el count inicial (0 → 1 y para)
const handle = useCallback(() => setCount(count + 1), [])

// SOLUCIÓN A: setter funcional, no necesitas count en deps
const handle = useCallback(() => setCount((c) => c + 1), [])

// SOLUCIÓN B: si de verdad lees count, decláralo como dep
const handle = useCallback(() => setCount(count + 1), [count])
```

**2. `useCallback` sin `React.memo`: optimización invisible**

```jsx
// ERROR: el hijo se re-renderiza igual con su padre, aunque la referencia sea estable
function Padre() {
  const handle = useCallback(() => {}, [])
  return <Hijo onClick={handle} />
}
// Hijo NO memorizado → ¿de qué sirve memorizar handle?

// SOLUCIÓN: memoriza el hijo también
const Hijo = memo(function Hijo({ onClick }) { ... })
```

**3. Objeto/array nuevo en deps: se invalida en cada render**

```jsx
// ERROR: config es un objeto nuevo en cada render → deps cambian siempre
const config = { theme: 'dark', lang: 'es' }
const handler = useCallback(() => guardar(config), [config])

// SOLUCIÓN: desestructura valores primitivos como deps
const handler = useCallback(() => guardar({ theme, lang }), [theme, lang])
```

**4. "Por si acaso" memorizando todo**

```jsx
// ERROR: functions locales que nadie compara → solo añade ruido
const formatPrice = useCallback((n) => `${n} €`, [])
return <span>{formatPrice(price)}</span> // uso inline, nadie compara referencias

// SOLUCIÓN: déjala ser una función normal (o una constante fuera del componente)
const formatPrice = (n) => `${n} €` // definida fuera del componente
```

## Conceptos clave

- `useCallback(fn, deps)` devuelve la **misma referencia** de `fn` mientras `deps` no cambien.
- Equivalencia: `useCallback(fn, deps)` ≡ `useMemo(() => fn, deps)`.
- Toda función anónima creada en el cuerpo del componente es una **referencia nueva** en cada render.
- `React.memo` compara props con `===`: sin props estables (callbacks con `useCallback`), no filtra re-renders.
- `useMemo` memoriza **valores**; `useCallback` memoriza **funciones**.
- Regla de oro: solo usa `useCallback` cuando **alguien compare** la referencia (hijo `memo`, deps de effect…).
- Trampas: deps incorrectas (closure viejo), `useCallback` sin `React.memo`, arrays/objetos como deps por referencia.

## Autoevaluación

**1. ¿Qué devuelve `useCallback(() => x * 2, [x])` cuando `x` no cambia entre renders?**

<details>
<summary>Respuesta</summary>

La **misma referencia de función** de antes. React detecta que las deps (`[x]`) no cambiaron con `Object.is` y te devuelve la función memorizada en lugar de crear una nueva. Cuando `x` cambie, se crea una función nueva (referencia distinta).

</details>

**2. Un hijo está en `React.memo` pero se re-renderiza con cada clic del padre. El padre pasa `onClick={() => setN(n + 1)}`. ¿Por qué falla y cómo lo arreglas?**

<details>
<summary>Respuesta</summary>

Falla porque la flecha inline es una **referencia nueva en cada render** del padre; `React.memo` compara props con `===`, la prop `onClick` "cambió" y deja pasar el render. Arreglo:

```jsx
const onClick = useCallback(() => setN((v) => v + 1), [])
return <Hijo onClick={onClick} /> // Hijo envuelto en memo
```

Además, la forma funcional `setN((v) => v + 1)` evita meter `n` en deps (trampa del closure viejo).

</details>

**3. ¿Cuál es la diferencia entre `useMemo(() => total(), [items])` y `useCallback(total, [items])`?**

<details>
<summary>Respuesta</summary>

La primera memoriza el **valor** que devuelve `total()` (un número, string, objeto…). La segunda memoriza la **función** `total` en sí: te devuelve la función, no su resultado. Si `total` es un callback que le pasas a un hijo, quiere `useCallback`; si es un cálculo caro que usas en el render, quiere `useMemo`. Recuerda: `useCallback(total, [items])` ≡ `useMemo(() => total, [items])` (sin ejecutar `total`).

</details>

**4. Menciona las 3 trampas de `useCallback` y una señal de alarma para cada una.**

<details>
<summary>Respuesta</summary>

1. **Deps incorrectas / closure viejo**: señal = la UI muestra valores "congelados" (ej. un contador que siempre pone el mismo número). Revisa deps o usa setters funcionales.
2. **`useCallback` sin `React.memo`** en el hijo: señal = el profiler de DevTools muestra re-renders del hijo pese a referencias estables; el memo no está filtrando porque no existe.
3. **Arrays/objetos como deps por referencia**: señal = el efecto/memo se ejecuta en **cada** render aunque los datos "sean iguales". Desestructura primitivos o estabiliza la referencia (memorizar el array con `useMemo`, pasarlo desde arriba…).

</details>
