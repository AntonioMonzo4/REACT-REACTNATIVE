# Unidad 04 — Hooks con generics

## Objetivos

- Anotar e inferir tipos en `useState`, incluida la **inicialización perezosa** (`lazy init`).
- Tipar `useRef` para cachés (`Map<K,V>`) y nodos DOM (`HTMLDivElement | null`).
- Modelar un reducer con **discriminated union** de actions y ver cómo TS bloquea dispatches inválidos.
- Escribir `useCallback`/`useMemo` cuyos callbacks tengan parámetros y retorno tipados.
- Firmar `useSyncExternalStore` con snapshots tipados y evitar los errores típicos de inferencia.

## Requisitos

- **TS básico del M3**: genéricos (`<T>`), uniones, tipos objeto.
- M4–M12: `useState`, `useRef`, `useReducer`, `useCallback`, `useMemo`; noción de `switch` en reducers (M8-M10).
- Unidad 01: ya viste `useState<Usuario | null>(null)`.

## useState

Los hooks de estado aceptan el **genérico del valor**. Cuando el inicial es obvio, TS lo infiere; cuando es `null` o una inicialización perezosa, conviene anotar:

```typescript
const [map, setMap] = useState<Record<string, number>>({})

// lazy init con tipo
const [items, setItems] = useState<string[]>(() => leerLocal())
```

**Qué significa:**

- `Record<string, number>` es un objeto con claves `string` y valores `number`: `setMap({ a: 1 })` ok, `setMap({ a: 'x' })` error.
- `useState<string[]>(() => leerLocal())` usa la **forma lazy**: se le pasa una **función** que TS ejecuta solo en el primer render; así `leerLocal()` no corre en cada render y el tipo sale del retorno de la función (o de la anotación).

**Por qué importa:** sin el genérico, `{}` infiere `{}` (objeto vacío) y después `setMap({ a: 1 })` puede dar sorpresas; con la anotación explícita, el contrato del estado queda claro desde la declaración.

**Cuidado clásico:** `useState(() => expr)` es lazy; `useState(expr)` evalúa en cada render (gasto + posible bug si `expr` tiene efectos). Si el inicial es caro o lee storage, siempre en forma de función.

## useRef

Un ref no es estado: no dispara re-render cuando cambia `.current`. Tiparlo bien sirve para **cachés** y **nodos DOM**:

```typescript
const cache = useRef<Map<string, Producto>>(new Map())
const nodo = useRef<HTMLDivElement | null>(null)
```

**Qué significa:**

- `Map<string, Producto>` — la caché solo admite esas claves/valores: `cache.current.get(id)` devuelve `Producto | undefined`, y `cache.current.set(1, x)` no compila (clave debe ser `string`).
- `HTMLDivElement | null` — el nodo empieza en `null` y se asigna al montar; la anotación explícita combina bien con `ref={nodo}` en un `<div>`.

**Por qué importa:** el ref tipado es la forma canónica de **memoizar algo que no debe re-renderizar** (última búsqueda, timer id, elemento scrolleable) con total seguridad de tipos.

### `useState` vs `useRef` — ¿cuándo uno u otro?

| Necesidad | Usa | ¿Re-renderiza al cambiar? |
|-----------|-----|----------------------------|
| El valor se pinta en la UI | `useState<T>` | Sí |
| Caché/último valor/nodo DOM interno | `useRef<T>` | No |

## useReducer

El reducer tipado es donde TS más aporta: modelás las **actions** como **discriminated union** y el `switch` queda verificado.

```typescript
type State = { count: number }
type Action = { type: 'inc' } | { type: 'add'; payload: number }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'inc': return { count: state.count + 1 }
    case 'add': return { count: state.count + action.payload }
  }
}

const [state, dispatch] = useReducer(reducer, { count: 0 })
// dispatch({ type: 'add', payload: 2 })
// dispatch({ type: 'add' }) // ❌ TS error
```

**Qué significa:**

- `Action` es unión de dos formas: `{ type: 'inc' }` (sin payload) y `{ type: 'add'; payload: number }` (con payload obligatorio).
- En `case 'add'`, TS hace **narrowing**: ya sabe que `action.payload` existe y es `number`.
- `dispatch({ type: 'add' })` **no compila**: falta `payload`. En JS sería un bug latente (`NaN` en el contador); en TS es error en el editor.

**Por qué importa:** el reducer es la "máquina de estados" de tu feature; tiparlo convierte errores de mensajes de action en errores de compilación antes de llegar a producción.

## useCallback / useMemo

Los callbacks y valores memorizados también se tipan con genéricos de función:

```typescript
const onSelect = useCallback((id: string) => setSel(id), [])
const total = useMemo(() => items.reduce((a, i) => a + i.p, 0), [items])
```

**Qué significa:**

- `onSelect: (id: string) => void` — quien consuma la prop `onSelect` no puede llamarlo con un número.
- El retorno de `useMemo` (`number`) se infiere del arrow function; `items` tipado hace `i.p` válido.

**Por qué importa:** memorizar sin tipar es fácil; tipar garantiza que la identidad estable que pasás a hijos `memo` mantiene el mismo contrato en cada render.

## useSyncExternalStore

Ya visto en M13 (hooks avanzados); aquí completa la versión con **snapshot tipado**:

```typescript
const snapshot = useSyncExternalStore(
  store.subscribe,
  () => store.getSnapshot(),
  () => store.getSnapshot(), // server snapshot
)
```

**Qué significa:** tres funciones — `subscribe` (suscripción), `getSnapshot` (valor en cliente) y `getServerSnapshot` (valor en SSR/hidratación). Si `store.getSnapshot()` está tipado (p. ej. `() => Estado`), el resultado `snapshot` hereda ese tipo.

**Por qué importa:** el tercer parámetro evita avisos de hidratación en SSR; y con el store tipado, todo el árbol que lee `snapshot` consume un tipo conocido, no `any`.

## En el ejemplo

`src/hooks/useContador.ts` y reducer tipado en `src/state/contador.ts` (`ContadorAction` como unión discriminada + chequeo `never` en el `default`), usado con `useReducer` en `src/App.tsx`.

## Errores comunes

**1. `useState()` sin inferir → `undefined` problemático; da el tipo o el inicial.**

```typescript
// ❌ no hay inicial: solo undefined y TS se queja (o infiere mal)
const [v, setV] = useState()

// ✅ da el tipo explícito (o un inicial)
const [v, setV] = useState<string | undefined>(undefined)
```

Solución: siempre un valor inicial o el genérico explícito; nunca llamar `useState()` "vacío".

**2. Discriminated unions mal cerradas en el reducer → `action.payload` en cualquier rama.**

```typescript
// ❌ action demasiado abierto: payload opcional → acceder sin comprobar
type Action = { type: string; payload?: number }

// ✅ cierra la unión: cada variante con su forma exacta
type Action = { type: 'inc' } | { type: 'add'; payload: number }
```

Solución: modelar cada action como **variante cerrada** (literal `type` + campos propios) para que el narrowing del `switch` funcione; revisar que todos los `case` devuelvan `State` (sin `default` que esconda fallos, o con un `never` check).

**3. Evaluar el inicial de `useState` en cada render.**

Solución: usar la forma lazy `useState(() => calcular())` cuando el cálculo es costoso o lee storage.

**4. `getSnapshot` inestable en `useSyncExternalStore`.**

Solución: devolver referencias estables (cacheadas) entre llamadas cuando no cambia el estado externo.

## Conceptos clave

- **`useState<T>` + lazy init**: `useState<string[]>(() => leerLocal())` — anotación explícita cuando la inferencia no basta; inicial perezoso.
- **`useRef<T>`**: caché (`Map<K,V>`) y nodo DOM (`HTMLDivElement | null`) sin re-renders.
- **Discriminated union de actions**: `{ type: 'inc' } | { type: 'add'; payload: number }` → narrowing en el `switch` y dispatch inválido = error TS.
- **`useCallback((id: string) => …)` / `useMemo(…): number`**: callbacks y valores memorizados con contrato tipado.
- **`useSyncExternalStore(sub, get, getServer)`**: store externo con snapshot tipado y soporte SSR.
- **Errores típicos**: `useState()` vacío, uniones de action "abiertas" (`type: string`), inicial no perezoso, snapshot inestable.

## Autoevaluación

**1. ¿Cuál es la diferencia entre `useState(leerLocal())` y `useState(() => leerLocal())`?**

<details>
<summary>Respuesta</summary>

En el primero, `leerLocal()` se ejecuta en **cada** render (desperdicio y posible bug si tiene efectos). En el segundo se pasa una función: React la llama solo en el primer render (lazy init), y el tipo del estado sale de su retorno. Para leer storage o cálculos caros, siempre la forma de función.

</details>

**2. Por qué `dispatch({ type: 'add' })` no compila en el ejemplo del reducer, y qué lo haría compilar?**

<details>
<summary>Respuesta</summary>

Porque `Action` es una unión discriminada donde `{ type: 'add' }` exige `payload: number`; falta la propiedad, así que TS rechaza el dispatch. Lo haría compilar añadiendo el payload: `dispatch({ type: 'add', payload: 2 })`. (En JS no habría error hasta el runtime, con `count + undefined = NaN`.)

</details>

**3. ¿Para qué sirve el `useRef<Map<string, Producto>>(new Map())` frente a usar estado para la caché?**

<details>
<summary>Respuesta</summary>

El ref guarda la caché **sin** provocar re-renders al modificarlo: es ideal para datos derivados/últimos resultados que no deben pintar la UI por sí solos. Si lo guardaras en `useState`, cada `set` re-renderizaría el componente. Además el genérico garantiza claves `string` y valores `Producto`.

</details>

**4. Menciona dos errores comunes de esta unidad y cómo se evitan.**

<details>
<summary>Respuesta</summary>

Cualquiera de: (1) `useState()` sin inicial/tipo → pasar inicial o `useState<T>(...)`; (2) action con `type: string` y `payload?` opcional → cerrar la unión discriminada por variante; (3) inicial no perezoso → `useState(() => calc())`; (4) `getSnapshot` inestable → devolver referencias cacheadas. (En el ejemplo: `src/hooks/useContador.ts` y `src/state/contador.ts`.)

</details>
