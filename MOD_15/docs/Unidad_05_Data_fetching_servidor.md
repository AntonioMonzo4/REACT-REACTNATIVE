# Unidad 05 — Data fetching en el servidor

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

- `await` directo en el componente — sin `useEffect`.
- Errores → `error.jsx` de la ruta.

## Loading / error por ruta

```jsx
// app/posts/loading.jsx
export default function Loading() {
  return <p>Cargando posts…</p>
}
```

## Parallel y sequential

```jsx
export default async function Page() {
  const [user, posts] = await Promise.all([getUser(), getPosts()]) // parallel
  const comentarios = await getComments(posts[0].id)               // sequential
}
```

## Mutaciones

Server Actions o Route Handlers + `revalidatePath` / `revalidateTag`.

## Librerías (fuera del mínimo)

- **SWR / React Query** en el cliente para islas interactivas.
- **Server Actions** para forms.
- caching tags para invalidación on-demand.

## Errores comunes

- Traer datos en un **client component** con `useEffect` cuando el server ya podía.
- Esperar `data` como estado inicial sin `Suspense`/`loading`.
- Secrets en variables sin `NEXT_PUBLIC_` solo en el server (no exponer).

## En el ejemplo

Snippet del `page` raíz del `next-app` mínimo si se genera; si no, teoría + checklist en README.
