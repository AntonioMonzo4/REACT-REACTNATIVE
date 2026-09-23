# Unidad 02 — Server Components vs Client Components

## Modelo de render

| | Server Component | Client Component (`'use client'`) |
|---|------------------|-----------------------------------|
| Dónde corre | servidor (Node) | navegador (+ SSR inicial) |
| `useState`/`useEffect` | ❌ | ✅ |
| Acceso a DB / secrets | ✅ | ❌ |
| Bundle JS | no se envía al cliente | sí |
| `fetch` en el componente | en el servidor (cacheable) | en el cliente |

```jsx
// app/page.jsx — Server por defecto
import { getPosts } from '../lib/posts'
import Lista from './lista'

export default async function Page() {
  const posts = await getPosts()   // await en el server
  return <Lista posts={posts} />
}
```

```jsx
// app/lista.jsx
'use client'
import { useState } from 'react'

export default function Lista({ posts }) {
  const [q, setQ] = useState('')
  const filtrados = posts.filter((p) => p.title.includes(q))
  // ...
}
```

## Reglas de la frontera

1. **`'use client'` hacia abajo**: los hijos de un client component también son client (puedes pasar Server como children).
2. **Propagar data como props**: el server serializa props al cliente.
3. **No pases functions** del server al client (excepto Server Actions).
4. Lo más pesado de librerías (editor, charts) → `'use client'`.

## Patrón “client shell + server data”

```jsx
// Server
export default async function Page() {
  const data = await api()
  return <DashboardClient initialData={data} />  // cliente recibe initialData
}
```

## Errores comunes

- Poner `'use client'` en el layout raíz → **toda** la app client.
- `fetch` en client de datos que el server ya podría traer.
- Pasar Date/Map/className functions — solo JSON-serializable (o RSC payload).

## En el ejemplo

`docs/` + README; en Next: `app/(server)/page.jsx` vs `components/Contador.jsx` con directive.
