# Unidad 03 — File-based routing y layouts (App Router)

## Estructura

```text
app/
  layout.jsx        ← root layout (html/body) — obligatorio
  page.jsx          ← ruta  /
  about/
    page.jsx        ← ruta  /about
  posts/
    layout.jsx      ← layout anidado para /posts/*
    page.jsx        ← /posts
    [id]/
      page.jsx      ← /posts/123
  (marketing)/      ← route group: sin segmento en URL
    page.jsx
  not-found.jsx
```

## `page`, `layout`, `loading`, `error`

| Archivo | Rol |
|---------|-----|
| `page.jsx` | contenido de la ruta |
| `layout.jsx` | envuelve children, **persiste** al navegar |
| `loading.jsx` | `Suspense` automático de la ruta |
| `error.jsx` | Error Boundary de la ruta (client) |
| `template.jsx` | como layout pero remonta en cada nav |
| `route.js` | endpoint GET/POST (API sin pages) |

## Layout anidado

```jsx
// app/dashboard/layout.jsx
export default function DashLayout({ children }) {
  return (
    <div className="dash">
      <nav>…</nav>
      {children}
    </div>
  )
}
```

`children` es la página o layout hijo — **no** se recrea el shell en cada cambio.

## Params y searchParams

```jsx
export default async function Post({ params, searchParams }) {
  const { id } = await params          // Next 15+: promesa
  const page = (await searchParams).page ?? '1'
  ...
}
```

## Navegación

```jsx
import Link from 'next/link'

<Link href="/posts/1">Ver post</Link>
```

`next/link` prefetch + navegación cliente sin recargar.

## Errores comunes

- Olvidar `app/layout.jsx` con `<html><body>`.
- `useRouter` de `next/navigation` en un server component.
- Crear `pages/` y `app/` a la vez (conflicto de routers).

## En el ejemplo

Árbol de rutas descrito en el README del módulo (demo Next mínimo en `next-app/`).
