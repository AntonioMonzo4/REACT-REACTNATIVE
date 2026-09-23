# Unidad 01 — React 19

## `use()` — leer promesas

```jsx
import { use, Suspense } from 'react'

function Temas({ temasPromise }) {
  const temas = use(temasPromise)   // suspende hasta resolver
  return <ul>{temas.map((t) => <li key={t.id}>{t.nombre}</li>)}</ul>
}

// En el padre:
const temasPromise = fetchTemas()   // se dispara una vez
<Suspense fallback={<p>Cargando…</p>}>
  <Temas temasPromise={temasPromise} />
</Suspense>
```

- `use` es el primer hook que **puede** llamarse en condicionales según docs (pero sigue siendo peligroso inestable — mejor top level).
- Funciona con Context también (`use(SomeContext)`).

## Server Actions

```js
// app/actions.js
'use server'

export async function crearPost(formData) {
  const title = formData.get('title')
  await db.posts.create({ data: { title } })
  revalidatePath('/posts')
}
```

```jsx
<form action={crearPost}>
  <input name="title" />
  <button>Enviar</button>
</form>
```

- La función se ejecuta **en el servidor**; el cliente solo recibe el resultado.
- Con `useActionState` puedes leer `state`, `pending`, `error`.

## `ref` como prop (sin forwardRef)

```jsx
function Campo({ ref, ...props }) {
  return <input ref={ref} {...props} />
}
// <Campo ref={miRef} />
```

## Cambios de hooks y layout

| Cambio | Nota |
|--------|------|
| `use` | async en render |
| Actions + `useActionState` | forms con estado |
| `useOptimistic` | UI optimista mientras muta |
| `useFormStatus` | pending del form padre |
| Layouts | pueden ser async en App Router |

## Errores comunes

- Llamar Server Action en un Event Handler de cliente sin `'use server'` exportado.
- `forwardRef` aún funciona pero es innecesario en 19.
- Promesas en props sin `Suspense` → error de React.

## En el ejemplo

Nota: demo local sin Server Components completos (el ejemplo M15 es estático con Vite para no requiere red); teoría + snippets para Next.
