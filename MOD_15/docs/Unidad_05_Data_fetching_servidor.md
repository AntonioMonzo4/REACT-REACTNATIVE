# Unidad 05 — Data fetching en el servidor

## Objetivos

- Hacer `await` de datos directamente en una `page` (Server Component), sin `useEffect`.
- Montar `loading.jsx` y `error.jsx` para cubrir los estados de la ruta.
- Distinguir fetch **paralelo** (`Promise.all`) de **secuencial** y cuándo usar cada uno.
- Saber cómo se **mutan** datos (Server Actions / Route Handlers) y cómo invalidar caché (`revalidatePath` / `revalidateTag`).
- Conocer cuándo tiene sentido añadir SWR/React Query en las islas cliente.

## Requisitos

- Unidades 01–04: React 19, frontera server/client, file routing y las estrategias SSR/SSG/ISR.
- Haber hecho `fetch` + `useState`/`useEffect` en el cliente en módulos anteriores (M4–M14): necesitas ese patrón **para olvidarlo aquí**.
- Promesas, `async/await`, `Promise.all` y manejo básico de `try/catch`.
- Un `next-app` (create-next-app) donde poder copiar los snippets.

## El cambio de mentalidad: del efecto al render

En las SPAs de todo el curso hasta ahora, el flujo era:

1. Montar el componente con `data = null` y `loading = true`.
2. Disparar `fetch` en `useEffect`.
3. Pintar esqueleto, gestionar error, actualizar estado…

En el App Router, los Server Components **son funciones async que React ejecuta en el servidor**. Puedes simplemente esperar los datos *antes* de devolver JSX:

- No hay `useEffect` (no hay montaje/desmontaje en el cliente).
- No hay estado de “cargando” que mantener a mano: ese papel lo hace `loading.jsx`.
- No hay riesgo de “flash” del esqueleto si el HTML llega resuelto (SSG/SSR).

**Analogía**: antes pedías ingredientes mientras ya estabas sirviendo la mesa (y tapabas la mesa con un mantel = fallback). Ahora el chef (servidor) espera los ingredientes y solo abre la cocina cuando el plato está listo; si tarda, el *maître* (`loading.jsx`) avisa a los comensales.

## Patrón canónico (App Router)

```jsx
// app/posts/page.jsx  (Server Component)
export default async function PostsPage() {
  const res = await fetch('https://api.example.com/posts', {
    next: { revalidate: 60 },
  })
  if (!res.ok) throw new Error('Fallo al cargar posts')
  const posts = await res.json()

  return (
    <ul>
      {posts.map((p) => (
        <li key={p.id}>{p.title}</li>
      ))}
    </ul>
  )
}
```

Puntos clave:

- `await` directo en el componente — sin `useEffect`.
- Errores → `error.jsx` de la ruta.

Es decir: si lanzas un error (o el `fetch` rechaza), React lo captura con el Error Boundary de la carpeta; mientras resuelve, se muestra el `loading.jsx` de la misma carpeta. La combinación `page + loading + error` cubre el ciclo completo sin una línea de estado.

## Loading / error por ruta

```jsx
// app/posts/loading.jsx
export default function Loading() {
  return <p>Cargando posts…</p>
}
```

```jsx
// app/posts/error.jsx
'use client'
export default function ErrorPage({ error, reset }) {
  return (
    <div>
      <p>Algo falló cargando posts.</p>
      <button onClick={() => reset()}>Reintentar</button>
    </div>
  )
}
```

- `loading.jsx` se activa automáticamente como `Suspense` mientras la ruta resuelve (útil también con streaming).
- `error.jsx` recibe `error` y `reset()` (vuelve a intentar renderizar el segmento). **Debe** ser client component.

## Parallel y sequential

```jsx
export default async function Page() {
  const [user, posts] = await Promise.all([getUser(), getPosts()]) // parallel
  const comentarios = await getComments(posts[0].id)               // sequential
}
```

**Cómo leerlo**: dos `await` seguidos suman sus tiempos; `Promise.all` los lanza **a la vez** y espera al más lento (el total ≈ el mayor, no la suma). La versión *sequential* es inevitable cuando el segundo dato **depende** del primero: sin el `id` de `posts[0]` no puedes pedir sus comentarios.

Regla práctica de esta unidad:

| Situación | Estrategia |
|-----------|-----------|
| Los datos no se conocen entre sí | `Promise.all([...])` |
| El segundo necesita el resultado del primero | `await` secuencial |
| Un bloque no bloquea al resto de la página | Suspense anidado (streaming, Unidad 04) |

## Mutaciones

Server Actions o Route Handlers + `revalidatePath` / `revalidateTag`.

Desglose para novatos:

- **Lectura** → `await` en el Server Component (esta unidad).
- **Escritura** (crear/editar/borrar) → una **Server Action** (`'use server'`, Unidad 01) invocada desde un `<form>` o un handler de un client component; o bien un **Route Handler** (`POST /api/...`, Unidad 06) si necesitas un endpoint HTTP.
- **Refresco de lo que ya estaba cacheado** → dentro de la action: `revalidatePath('/posts')` regenera esa ruta, `revalidateTag('posts')` invalida todos los `fetch` etiquetados con `posts`.

Sin la invalidación, el usuario “crea” un post y no lo ve: la página sigue sirviendo el HTML/cache anterior. Ese es el bug número uno de este patrón.

## Librerías (fuera del mínimo)

El flujo anterior es el mínimo viable sin dependencias. Cuando la app crece:

- **SWR / React Query** en el cliente para islas interactivas (refetch, dedupe, reintentos, focus-sync) — solo donde la interacción lo exija, no como reflejo automático de todo el `fetch` del servidor.
- **Server Actions** para forms.
- caching tags para invalidación on-demand.

Nota de curso: no instales SWR/React Query “porque sí” en páginas que ya traen los datos desde el server; duplicarías caché y estado.

## Errores comunes

### 1. Traer datos en un client component con `useEffect`

**Ejemplo (mal):**

```jsx
'use client'
useEffect(() => { fetch('/api/posts').then(r => r.json()).then(setPosts) }, [])
```

**Solución**: si el dato no depende del navegador, pásalo a la `page` (server) con `await fetch` y recíbelo por props. Reservas el cliente para datos privados, tiempo real o que dependan de interacción.

### 2. Esperar `data` sin `Suspense`/`loading`

**Ejemplo (mal):**

```jsx
// app/posts/page.jsx sin app/posts/loading.jsx  → tacha “colgado” percibido
```

**Solución**: añade `loading.jsx` en la carpeta (Suspense automático) o envuelve los widgets lentos en `<Suspense fallback={...}>` si solo algunos tardan. Así el usuario ve la estructura de inmediato.

### 3. Exponer secrets o olvidar `NEXT_PUBLIC_`

**Ejemplo (mal):**

```javascript
// Compilado en el cliente por llevar NEXT_PUBLIC_:
const key = process.env.NEXT_PUBLIC_API_SECRET   // ❌ visible en el bundle
```

**Solución**: variables **sin** prefijo `NEXT_PUBLIC_` solo existen en el server — úsalas en Server Components/Actions/Route Handlers y nunca las loguees ni las metas en props al cliente. Cualquier `NEXT_PUBLIC_*` debe considerarse **pública** (está en el JS del navegador).

## En el ejemplo

Snippet del `page` raíz del `next-app` mínimo si se genera; si no, teoría + checklist en README. La práctica recomendada es abrir `app/page.jsx`, sustituir el contenido por el patrón canónico de arriba, crear `loading.jsx`/`error.jsx` hermanos y romper a propósito la URL del `fetch` para ver el Error Boundary en acción.

## Conceptos clave

- **Data fetching en el render**: `await` directo en el Server Component; sin `useEffect` ni estado de carga manual.
- **`loading.jsx`**: Suspense automático por ruta mientras se resuelve el render.
- **`error.jsx`**: Error Boundary client de la ruta; recibe `error` y `reset()`.
- **Fetch paralelo**: `Promise.all([...])` para dependencias independientes.
- **Fetch secuencial**: obligatorio cuando un dato depende de otro.
- **Mutaciones**: Server Actions o Route Handlers escriben; después se invalida la caché.
- **`revalidatePath`**: regenera una ruta concreta tras una mutación.
- **`revalidateTag`**: invalida por etiqueta todos los `fetch` que usaron `next.tags`.
- **Variables de entorno**: sin `NEXT_PUBLIC_` = solo servidor; con el prefijo = públicas.
- **SWR / React Query**: opcionales, para islas cliente; no sustituyen el `await` del server.

## Autoevaluación

1. ¿Por qué en un Server Component ya no escribo `useEffect(() => { fetch... }, [])`?

<details><summary>Respuesta</summary>

Porque el componente se ejecuta en el servidor durante el render: puedes esperar los datos con `await` antes de devolver JSX. No hay ciclo de montaje en el cliente, no hay estado que actualizar y el HTML sale ya resuelto (más `loading.jsx` para la espera).

</details>

2. Mi action crea un post correctamente pero la lista no se actualiza. ¿Qué falta?

<details><summary>Respuesta</summary>

La invalidación de caché: llama a `revalidatePath('/posts')` (o `revalidateTag('posts')` si usaste tags en el `fetch`) al final de la Server Action, para que Next regenere el HTML/cache de esa ruta.

</details>

3. Tengo `getUser()` y `getPosts()` sin relación, y luego `getComments(posts[0].id)`. ¿Cómo lo organizo?

<details><summary>Respuesta</summary>

Paralelo lo primero: `const [user, posts] = await Promise.all([getUser(), getPosts()])`; después, secuencial: `await getComments(posts[0].id)`, porque el segundo necesita el resultado del primero.

</details>

4. ¿Cuándo sí conviene SWR/React Query en el cliente?

<details><summary>Respuesta</summary>

En islas interactivas que necesitan refetch continuo, reintentos, sincronización al recuperar foco, etc. (p. ej. un contador en vivo). No como capa automática para datos que el Server Component ya trajo: duplicarías estado y peticiones.

</details>
