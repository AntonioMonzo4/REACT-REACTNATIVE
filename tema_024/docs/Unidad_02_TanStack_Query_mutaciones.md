# Unidad 02 — TanStack Query: mutaciones (useMutation)
> 🧭 **Navegación:** [← Anterior: Unidad 01 — TanStack Query: fundamentos (useQuery)](Unidad_01_TanStack_Query_fundamentos.md) · [Índice del tema](../README.md) · [Siguiente: Unidad 03 — React Hook Form →](Unidad_03_React_Hook_Form.md)

## Objetivos

Al terminar esta unidad podrás:

- Ejecutar escrituras (POST/PUT/PATCH/DELETE) con `useMutation`.
- Invalidar o actualizar el caché tras una mutación exitosa.
- Encadenar mutaciones, mostrar estados `isPending`/`isError`/`isSuccess` y resetear formularios.
- Aplicar **actualización optimista** (actualizar la UI antes de que el servidor responda).

## Requisitos

- [Unidad 01](Unidad_01_TanStack_Query_fundamentos.md) completada.
- Ejemplo del módulo: `EJEMPLO_QUERY_FORMS/src/hooks/usePosts.ts` (`useCrearPost`, `useBorrarPost`).

## useMutation: escribir en el servidor

Si `useQuery` es **leer**, `useMutation` es **escribir**. No usa caché propia de
forma idéntica: se dispara solo cuando tú llamas a `.mutate()`, y su trabajo
posterior es ayudarte a **reconciliar el caché** con lo que cambió en el servidor.

```tsx
// src/hooks/usePosts.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { crearPost } from '../api/posts'

export function useCrearPost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (datos: PostNuevo) => crearPost(datos),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}
```

Uso en un formulario (se integra con RHF en la [Unidad 05](Unidad_05_Integracion_RHF_Zod_y_Query.md)):

```tsx
const crear = useCrearPost()

crear.mutate(
  { title, body },
  {
    onSuccess: () => reset(),          // callback por llamada
    onError: (e) => mostrarToast(e.message),
  },
)
```

### Estados de `useMutation`

| Estado | Cuándo |
|--------|--------|
| `isPending` | `.mutate()` lanzado, esperando respuesta |
| `isSuccess` + `data` | El servidor respondió bien; `data` es lo devuelto por `mutationFn` |
| `isError` + `error` | Falló (red, 4xx/5xx) |
| `reset()` | Vuelve a estado idle (útil tras cerrar un modal) |

A diferencia de `useQuery`, **no hay reintentos por defecto** en mutaciones: un
POST duplicado por retry puede crear registros fantasma. Actívalo a sabiendas
solo si tu API es idempotente.

## Invalidar, actualizar o hacer nada

Tras la mutación hay tres estrategias:

1. **Invalidar** (la más común): `invalidateQueries` re-pide la lista al servidor.
   Simple y siempre correcto, a costa de un roundtrip.
2. **Actualizar el caché a mano**: `setQueryData` escribe el nuevo dato sin red.
   Más rápido, pero tú te encargas de la consistencia.
3. **No hacer nada**: si el cambio no afecta a ninguna lista en pantalla.

```tsx
// Opción 2: actualizar el detalle sin re-pedir
queryClient.setQueryData(['posts', id], (viejo: Post) => ({
  ...viejo,
  title: datos.title,
}))
```

## Borrar con invalidación

```tsx
export function useBorrarPost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => borrarPost(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}

// En la lista:
<button onClick={() => borrar.mutate(post.id)} disabled={borrar.isPending}>
  Borrar
</button>
```

`mutationFn` recibe el argumento pasado a `.mutate(arg)`: aquí el `id`.

## Actualización optimista

Optimista = **asumes** que el servidor aceptará, pintas el cambio al instante y,
si falla, haces rollback. Mejora la percepción de velocidad en acciones frecuentes
(like, borrar fila, mover tarjeta).

```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useBorrarPostOptimista() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => borrarPost(id),

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['posts'] })
      const anterior = queryClient.getQueryData<Post[]>(['posts'])

      queryClient.setQueryData<Post[]>(['posts'], (viejo) =>
        (viejo ?? []).filter((p) => p.id !== id),
      )

      return { anterior }   // contexto para el rollback
    },

    onError: (_e, _id, contexto) => {
      if (contexto?.anterior) {
        queryClient.setQueryData(['posts'], contexto.anterior)
      }
    },

    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}
```

El flujo es: cancelar refetch en vuelo → snapshot → pintar sin el item → si
error, restaurar snapshot → al final (éxito o error), revalidar contra el
servidor. El ejemplo del módulo usa la versión simple (sin optimista) para no
ocultar los conceptos; este snippet es el patrón a copiar en producción.

## Errores comunes

| Error típico | Causa | Solución |
|--------------|-------|----------|
| La lista no se actualiza tras crear | Falta `invalidateQueries` | Invalída en `onSuccess` la queryKey prefijo de la lista |
| Se crean dos registros al reintentar | `retry` alto en mutaciones no idempotentes | `retry: 0` (default) salvo que la API sea idempotente |
| El optimista no revierte | No guardaste el snapshot en `onMutate` | Devuelve el contexto con los datos anteriores y úsalo en `onError` |
| `.mutate` sin deshabilitar el botón | Doble submit | `disabled={mut.isPending}` en el botón |
| Confusión entre `onSuccess` del hook y de `.mutate` | Hay dos niveles | El del hook es global para esa mutación; el de `.mutate` es para esa llamada concreta |

## Conceptos clave

| Término | Qué significa en humano |
|---------|-------------------------|
| **`useMutation`** | Hook de Query para escrituras (POST/PUT/PATCH/DELETE) |
| **`mutationFn`** | La función que ejecuta la escritura (recibe el arg de `.mutate`) |
| **Invalidación** | Marcar queries para revalidar tras un cambio |
| **`setQueryData`** | Escribir el caché a mano sin petición de red |
| **Optimista** | Pintar el cambio antes de la respuesta del servidor, con rollback en error |
| **Rollback** | Restaurar el snapshot del caché si la mutación falla |

## Autoevaluación

**1. ¿Por qué `useQuery` tiene reintentos por defecto y `useMutation` no?**

<details>
<summary>Respuesta</summary>

Reintentar una lectura es seguro. Reintentar una escritura puede duplicar el
efecto (dos POST = dos registros) si el primer intento llegó al servidor pero
falló la respuesta. Solo activa retry en mutaciones idempotentes.

</details>

**2. Crear un post y no re-pedir la lista, ¿es correcto?**

<details>
<summary>Respuesta</summary>

Solo si actualizas el caché a mano con el dato devuelto por el servidor
(`setQueryData` con el post nuevo). Si no haces ninguna de las dos, la UI queda
desincronizada. Invalidar es el camino seguro por defecto.

</details>

**3. En la actualización optimista, ¿qué hace `cancelQueries`?**

<details>
<summary>Respuesta</summary>

Cancela refetchs en vuelo de esa clave para que no "pisen" tu escritura
optimista del caché con datos viejos del servidor mientras mutas.

</details>

**4. ¿Dónde reseteo el formulario tras un envío correcto?**

<details>
<summary>Respuesta</summary>

En el `onSuccess` de la llamada concreta: `crear.mutate(datos, { onSuccess: () => reset() })`,
o en el `onSuccess` del hook si el reset es siempre el mismo y no depende de la
llamada.

</details>

**5. Tengo `useMutation` para "dar like". ¿Optimista?**

<details>
<summary>Respuesta</summary>

Sí, es el caso de estudio clásico: el usuario espera ver el like al instante.
Pintas el cambio en `onMutate`, y si el servidor falla, reviertes y (opcional)
avisas. Combínalo con `setQueryData` sobre la lista de posts/likes.

</details>

---

> 🧭 **Navegación:** [← Anterior: Unidad 01 — TanStack Query: fundamentos (useQuery)](Unidad_01_TanStack_Query_fundamentos.md) · [Índice del tema](../README.md) · [Siguiente: Unidad 03 — React Hook Form →](Unidad_03_React_Hook_Form.md)
