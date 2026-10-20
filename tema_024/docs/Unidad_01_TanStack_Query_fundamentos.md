# Unidad 01 — TanStack Query: fundamentos (useQuery)
> 🧭 **Navegación:** [← Anterior: tema_023 · Unidad 04 — Entrevistas técnicas](../../tema_023/docs/Unidad_04_Entrevistas.md) · [Índice del tema](../README.md) · [Siguiente: Unidad 02 — TanStack Query: mutaciones (useMutation) →](Unidad_02_TanStack_Query_mutaciones.md)

## Objetivos

Al terminar esta unidad podrás:

- Explicar qué problema resuelve **TanStack Query** (antes React Query) y por qué no es un "estado global" al uso.
- Configurar `QueryClientProvider` en una app React.
- Consumir datos remotos con `useQuery`: `data`, `isPending`, `isError`, `error`, `refetch`.
- Entender claves de caché (`queryKey`) y invalidación.
- Configurar `staleTime`, reintentos y refetchs.

## Requisitos

- React y hooks del camino del curso (M4–M6).
- Haber visto consumo de APIs con `fetch`/`axios` y `useFetch` casero (M8).
- TypeScript básico (M3/M14): el ejemplo del módulo está en TS.

## El problema que resuelve Query

En M8 construiste un `useFetch` con `useState` + `useEffect`. Funciona, pero en
una app real te faltan: caché entre pantallas, deduplicación de peticiones,
refetch al volver a la pestaña, reintentos, paginación, mutaciones que
invalidan listas, estados de error diferenciados… **TanStack Query** es la
librería estándar del ecosistema React para todo eso: no gestiona el estado de
tu UI (ese es Zustand/RTK), gestiona el **estado del servidor** (caché remota).

> Regla mental: **Query = datos del servidor**. **Zustand/Context = estado de la
> UI/negocio del cliente**. No dupliques en un store lo que Query ya cachea.

## Instalación y provider

```bash
pnpm add @tanstack/react-query
```

```tsx
// src/main.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { App } from './App'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,        // 30 s: datos "frescos", no re-piden
      retry: 1,                 // 1 reintento automático si falla
      refetchOnWindowFocus: false,
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>,
)
```

`QueryClient` es el motor de caché; el Provider lo reparte por el árbol. Una
sola instancia por app (o por test).

## useQuery en la práctica

El ejemplo del módulo (`EJEMPLO_QUERY_FORMS/`) consume JSONPlaceholder:

```tsx
// src/hooks/usePosts.ts
import { useQuery } from '@tanstack/react-query'
import { obtenerPosts } from '../api/posts'

export function usePosts() {
  return useQuery({
    queryKey: ['posts'],
    queryFn: obtenerPosts,
  })
}
```

`queryFn` debe **devolver una promesa** (y lanzar/throw si algo va mal: Query
captura el error por ti, no hace falta `try/catch` con `setError`).

Consumo en un componente:

```tsx
export function ListaPosts() {
  const { data, isPending, isError, error, refetch, isRefetching } = usePosts()

  if (isPending) return <p>Cargando…</p>
  if (isError) {
    return (
      <div role="alert">
        <p>{error.message}</p>
        <button onClick={() => refetch()}>Reintentar</button>
      </div>
    )
  }
  return <ul>{data.map((p) => <li key={p.id}>{p.title}</li>)}</ul>
}
```

### Estados que devuelve `useQuery`

| Estado | Significado |
|--------|-------------|
| `isPending` | Primera carga, sin datos |
| `isError` + `error` | Falló la petición (tras reintentos) |
| `data` | Hay datos (aunque puedan estar "stale") |
| `isFetching` / `isRefetching` | Hay una petición en vuelo (incluye refetch en segundo plano) |
| `isLoading` | Combinación de `isPending && isFetching` |

Distingue **pending** (nada que mostrar) de **refetching** (hay datos viejos en
pantalla y llegan nuevos): no sustituyas la UI completa por un spinner si ya
tienes caché.

## Claves de caché e invalidación

Cada consulta vive bajo una `queryKey` (un array, como una ruta). Mismo array =
mismo caché. Ejemplo con detalle:

```tsx
useQuery({
  queryKey: ['posts', id],
  queryFn: () => obtenerPost(id),
})
```

`invalidateQueries` marca claves como obsoletas y re-pide los que estén montados:

```tsx
queryClient.invalidateQueries({ queryKey: ['posts'] })
// afecta a ['posts'], ['posts', 1], ['posts', 2]… (prefijo)
```

El patrón de las mutaciones (borrar/crear y refrescar la lista) se ve en la
[Unidad 02](Unidad_02_TanStack_Query_mutaciones.md).

## Opciones que usarás pronto

| Opción | Para qué |
|--------|----------|
| `staleTime` | Cuánto consideras frescos los datos (ms) sin re-pedir |
| `gcTime` | Cuánto guarda Query los datos en caché tras no usarlos |
| `refetchOnWindowFocus` | Re-pedir al recuperar foco (útil en web, a veces ruidoso) |
| `retry` | Reintentos automáticos antes de marcar error |
| `enabled` | Consulta condicional (ej: no pedir hasta tener `id`) |

```tsx
useQuery({
  queryKey: ['posts', id],
  queryFn: () => obtenerPost(id),
  enabled: id !== undefined,   // no dispara mientras no haya id
})
```

## Errores comunes

| Error típico | Causa | Solución |
|--------------|-------|----------|
| Se dispara la petición dos veces en dev | React StrictMode simula doble mount | Es esperado en desarrollo; no "arregles" con flags raros |
| Caché vieja tras crear un registro | No invalidaste la lista | `invalidateQueries({ queryKey: ['posts'] })` en `onSuccess` de la mutación |
| `queryFn` no lanza errores | Devuelve `undefined` o traga el throw | Deja que el `fetch` lance; Query lo convierte en `isError` |
| Pantalla en blanco con `data.map` | Olvidaste comprobar `isPending`/`isError` | Normaliza: early returns antes de usar `data!` |
| Dos componentes piden lo mismo a la vez | No conoces la deduplicación | Con la misma `queryKey`, Query hace **una** petición y comparte el resultado |

## Conceptos clave

| Término | Qué significa en humano |
|---------|-------------------------|
| **TanStack Query** | Librería de caché y sincronización de datos remotos para React |
| **`queryKey`** | Identidad de una consulta (array); define la entrada de caché |
| **`queryFn`** | Función que ejecuta la petición y devuelve una promesa |
| **Stale** | Datos que superaron `staleTime` y deberían revalidarse |
| **Invalidación** | Marcar claves para re-pedirlas (normalmente tras una mutación) |
| **`QueryClientProvider`** | Reparte la instancia de caché por el árbol de React |

## Autoevaluación

**1. ¿TanStack Query sustituye a Redux/Zustand?**

<details>
<summary>Respuesta</summary>

No. Query gestiona **estado del servidor** (caché, revalidación, errores de red);
Zustand/RTK gestionan estado de cliente (UI, sesión, carrito, filtros locales).
Son complementarios: los datos remotos viven en Query; lo que decide la UI, en
un store o en `useState`.

</details>

**2. ¿Qué diferencia hay entre `isPending` y `isRefetching`?**

<details>
<summary>Respuesta</summary>

`isPending` = no hay datos aún (primera carga). `isRefetching` = hay datos
mostrados y se está trayendo una actualización. Un spinner a pantalla completa
solo tiene sentido en `isPending`; en `isRefetching` suele bastar un indicador
sutil.

</details>

**3. Creé un post y la lista no cambia. ¿Qué hago?**

<details>
<summary>Respuesta</summary>

Invalidar la query de la lista tras la mutación:
`queryClient.invalidateQueries({ queryKey: ['posts'] })` (en `onSuccess` del
`useMutation`). Query re-pedirá los que estén montados y actualizará la UI.

</details>

**4. Tengo una consulta que depende del `id` de la ruta y mientras tanto es
`undefined`. ¿Cómo evito la petición inválida?**

<details>
<summary>Respuesta</summary>

Con `enabled: id !== undefined` (o `enabled: !!id`): la consulta queda "pausada"
hasta que el parámetro sea válido.

</details>

**5. Dos pantallas usan `['posts']`. ¿Se hacen dos peticiones?**

<details>
<summary>Respuesta</summary>

No. Con la misma `queryKey`, Query deduplica: una sola petición en vuelo y una
copia compartida de datos en caché para ambas pantallas.

</details>

---

> 🧭 **Navegación:** [← Anterior: tema_023 · Unidad 04 — Entrevistas técnicas](../../tema_023/docs/Unidad_04_Entrevistas.md) · [Índice del tema](../README.md) · [Siguiente: Unidad 02 — TanStack Query: mutaciones (useMutation) →](Unidad_02_TanStack_Query_mutaciones.md)
