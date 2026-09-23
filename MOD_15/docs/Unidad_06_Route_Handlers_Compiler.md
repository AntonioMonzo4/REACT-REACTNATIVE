# Unidad 06 — Route Handlers y React Compiler

## Route Handlers (API en App Router)

```js
// app/api/posts/route.js
import { NextResponse } from 'next/server'

export async function GET(request) {
  const posts = await db.posts.findMany()
  return NextResponse.json(posts)
}

export async function POST(request) {
  const body = await request.json()
  // validar...
  return NextResponse.json({ ok: true }, { status: 201 })
}
```

```js
// app/api/posts/[id]/route.js
export async function GET(request, { params }) {
  const { id } = await params
  return NextResponse.json({ id })
}
```

- Misma API web que Express/Fastify pero **co-localizada** con la ruta UI.
- Ideal para BFF (backend for frontend) y webhooks.

## React Compiler (experimental / rollout)

**Qué hace**: memoiza **automáticamente** componentes y hooks → menos re-renders sin escribir `useMemo`/`useCallback` a mano.

```js
// babel plugin / react-compiler (config en next.config)
```

| Reglas / límites actuales |
|---------------------------|
| No reemplaza entender cuándo un objeto es nuevo |
| No todo el ecosistema está 100 % compatible (verifica versiones) |
| Efectos y mutaciones siguen teniendo reglas propias |
| `memo` manual sigue siendo válido donde el compiler no aplica |

## Cuándo activarlo

1. Equipo con problemas de performance por recreación de callbacks.
2. Base de código grande sin `memo` disciplinado.
3. Medir **antes** (React DevTools Profiler) y **después**.

## Errores comunes

- Esperar que el compiler “arregle” un store que cambia identidad cada render.
- Config sin limpiar `useMemo` mal hechos a la vez (doble memoización inútil).

## En el ejemplo

README con flags de `next.config` y nota de Profiler.
