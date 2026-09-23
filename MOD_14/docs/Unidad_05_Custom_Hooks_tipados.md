# Unidad 05 — Custom Hooks tipados

## Objetivos

- Diseñar un custom hook con **firma genérica**: `useLocalStorage<T>(key, inicial)`.
- Devolver tuplas **inmutables** con `as const` para preservar literales y orden.
- Tipar un hook de red con **discriminated union** de estado (`loading | ok | error`).
- Entender por qué el narrowing (`if (res.status === 'ok')`) te entrega `data` tipado.
- Evitar `any` en `JSON.parse`/`catch` y las violaciones de reglas de hooks.

## Requisitos

- **TS básico del M3**: genéricos, unions, `as` casts.
- M4–M6: haber escrito `useLocalStorage` y `useFetch` en JavaScript (el M13 revisó versiones avanzadas).
- Unidades 01 y 04: tipar props/estado y `useState<T>`.

## Firma genérica

El objetivo: **un solo hook** que sirva para guardar cualquier tipo de dato en `localStorage`, con la seguridad de tipos en cada uso.

```typescript
export function useLocalStorage<T>(key: string, inicial: T) {
  const [valor, setValor] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw ? (JSON.parse(raw) as T) : inicial
    } catch {
      return inicial
    }
  })

  const set = (v: T | ((prev: T) => T)) => {
    setValor((prev) => {
      const next = typeof v === 'function' ? (v as (p: T) => T)(prev) : v
      localStorage.setItem(key, JSON.stringify(next))
      return next
    })
  }

  return [valor, set] as const
}

// uso
const [tema, setTema] = useLocalStorage<'light' | 'dark'>('tema', 'light')
```

Recorramos la firma pieza por pieza:

| Fragmento | Qué significa |
|-----------|----------------|
| `<T>` | Genérico del **valor guardado**: cada llamada decide su `T` |
| `key: string` | Clave de `localStorage`, siempre string |
| `inicial: T` | Valor por defecto si no hay nada (o si el JSON falla) |
| `useState<T>(...)` | El estado interno solo admite `T` |
| `JSON.parse(raw) as T` | **Cast**: TS no puede saber la forma del JSON; tú prometes que coincide con `T` |
| `v: T \| ((prev: T) => T)` | Acepta valor directo **o** updater estilo React |
| `return [valor, set] as const` | Congela la tupla: orden y literales estables |

**En el uso**, `useLocalStorage<'light' | 'dark'>('tema', 'light')` fija `T` como la unión: `setTema('dark')` ok, `setTema('blue')` → error de compilación.

**Por qué importa:** el genérico hace que el hook sea **reutilizable sin `any`**: preferencias de tema, filtros, tokens de sesión… todos con el mismo código y con verificación de tipos en cada consumidor.

**Sobre `as T` en `JSON.parse`:** es un cast inevitable (el storage no guarda tipos), pero **concentrado** en un solo lugar con `try/catch` que cae a `inicial`. No lo repartas por la app.

## Hook de API

Un hook de red tipado devuelve el **estado completo de la petición** como unión discriminada, para que el consumidor haga narrowing:

```typescript
type UseFetchResult<T> =
  | { status: 'loading'; data: null; error: null }
  | { status: 'ok'; data: T; error: null }
  | { status: 'error'; data: null; error: string }

export function useFetch<T>(url: string): UseFetchResult<T> { ... }
```

**Qué significa:** en cada variante, los campos son **coherentes**:

- `status: 'loading'` → no hay `data` ni `error` (ambos `null`).
- `status: 'ok'` → `data: T` tipado con la forma de tu API, `error: null`.
- `status: 'error'` → `error: string`, `data: null`.

**Discriminated union → al hacer `if (res.status === 'ok')` el `data` está tipado:**

```typescript
const res = useFetch<Producto[]>('/api/productos')

if (res.status === 'loading') return <Spinner />
if (res.status === 'error') return <p>{res.error}</p>
// aquí TS ya sabe res.status === 'ok' → res.data: Producto[]
return <Lista productos={res.data} />
```

**Por qué importa:** es el patrón de la Unidad 06 llevado a hooks: el **tipo documenta los estados posibles** y el compilador garantiza que no accedés a `data` antes de que exista. Compara con el enfoque JS típico (`data`, `error`, `loading` como tres estados sueltos y contradictorios: `data` y `error` a la vez, etc.).

## En el ejemplo

`src/hooks/useLocalStorage.ts` — la implementación completa de `useLocalStorage<T>` de esta unidad (además con `useCallback` en el setter y sincronización del evento `storage` entre pestañas).

## Errores comunes

**1. Devolver tupla sin `as const` y perder literales.**

```typescript
// ❌ tipo amplio: set podría reordenarse en refactors sin que TS proteste
return [valor, set]

// ✅ tupla readonly exacta: [T, (v) => void]
return [valor, set] as const
```

Solución: `as const` al final del `return` congela la tupla; los destructuradores `const [v, set] = …` reciben los tipos correctos y la literales no se ensanchan.

**2. `any` en el catch de `JSON.parse`.**

```typescript
// ❌ si parseas y confías a ciegas
const data = JSON.parse(raw) // any silencioso

// ✅ try/catch + cast único a T (o validación con type guard)
try {
  return JSON.parse(raw) as T
} catch {
  return inicial
}
```

Solución: envolver en `try/catch`, caer a `inicial` y hacer el cast `as T` solo ahí (mejor aún: validar con un guard si los datos vienen de usuarios).

**3. Hook que llama a otro hook condicionalmente (reglas de hooks).**

```typescript
// ❌ si hay token cambia el número/orden de hooks → error de React
function usePerfil() {
  const token = useToken()
  if (!token) return null
  return useFetch('/me')   // ❌ hook dentro de if
}

// ✅ llama siempre; condiciona los DATOS
function usePerfil() {
  const token = useToken()
  const res = useFetch(token ? '/me' : 'about:blank')
  return token ? res : null
}
```

Solución: las llamadas a hooks van **siempre en top level y en el mismo orden**; la condicionalidad se maneja con los **valores** que les pasás (o con guardas de retorno después de llamar a todos).

**4. Mezclar estilos de retorno (a veces tupla, a veces objeto).**

Solución: elige un contrato (tupla estilo `useState` o objeto con nombres) y mantenlo en todos tus hooks; documentalo en la firma.

## Conceptos clave

- **`useLocalStorage<T>(key, inicial)`**: hook genérico de persistencia; cada consumidor fija `T`.
- **Cast único `JSON.parse(raw) as T`**: TS no infiere el storage; el cast vive encapsulado en `try/catch` con fallback a `inicial`.
- **`return [...] as const`**: tupla readonly estable; sin ella se pierden literales/orden.
- **`UseFetchResult<T>`**: union discriminada de estados de red; `if (res.status === 'ok')` → `res.data: T`.
- **Updater compatible**: `v: T | ((prev: T) => T)` replica la semántica de `useState`.
- **Reglas de hooks**: nunca hooks tras `if`/`return` temprano; condiciona **datos**, no **llamadas**.

## Autoevaluación

**1. ¿Por qué `JSON.parse(raw) as T` es un cast "aceptable" aquí y qué lo hace seguro-ish?**

<details>
<summary>Respuesta</summary>

Porque `JSON.parse` devuelve `any`/`unknown`: TS no puede saber la forma real guardada; el cast es la promesa "esto es un `T`". Se concentra en un único punto, dentro de `try/catch` que cae a `inicial` si el JSON está corrupto, en vez de esparcir `any` por el código. Para datos no confiables, mejor validar con un type guard antes de castear.

</details>

**2. ¿Qué se pierde al hacer `return [valor, set]` sin `as const`?**

<details>
<summary>Respuesta</summary>

Se pierde la tupla exacta: TS puede ampliar el tipo (p. ej. a un array de unión de ambos tipos en vez de `[T, setter]`), lo que debilita el destructurado y permite reordenar elementos en refactors sin error. Con `as const` la tupla es readonly con posiciones y literales fijas.

</details>

**3. En `useFetch`, ¿por qué dentro de `if (res.status === 'ok')` puedes acceder a `res.data` sin comprobar `undefined`?**

<details>
<summary>Respuesta</summary>

Porque `UseFetchResult<T>` es una unión discriminada por `status`: la variante `{ status: 'ok'; data: T; error: null }` garantiza `data: T` (no opcional). El `if` hace narrowing: TS descarta las otras variantes y dentro solo queda esa forma, con `data` obligatoriamente presente y tipado como `T`.

</details>

**4. Tu hook de perfil hace `if (!token) return null` y justo después `useFetch(...)`. ¿Qué rompe y cómo reescribes?**

<details>
<summary>Respuesta</summary>

Rompe las reglas de hooks: el `return` temprano hace que en un render se llame a menos hooks que en otro, cambiando el orden (React lanza "Rendered fewer hooks than expected"). Reescritura: llamar `useToken()` y `useFetch(...)` **siempre** en top level (p. ej. pasando una URL condicional o invalidando el resultado) y condicionar la salida **después**, con un guard de datos.

</details>
