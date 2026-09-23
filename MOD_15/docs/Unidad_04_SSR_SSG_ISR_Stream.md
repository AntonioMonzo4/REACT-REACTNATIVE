# Unidad 04 — SSR, SSG, ISR y Streaming

## Comparativa

| Estrategia | Cuándo se genera HTML | Ideal |
|------------|----------------------|--------|
| **CSR** | en el navegador | apps con mucha interacción tras login |
| **SSR** | en **cada request** | datos frescos por usuario |
| **SSG** | en **build** | docs, blog, landing |
| **ISR** | build + **revalidación** (p. ej. 60 s) | catálogo, precios que cambian a menudo |
| **Streaming** | HTML **por trozos** (Suspense) | dashboards con widgets de distinta latencia |

## En App Router

```js
// SSR (default en dynamic)
export const dynamic = 'force-dynamic'

// SSG
export const revalidate = false

// ISR cada 60s
export const revalidate = 60
```

```jsx
// Streaming con Suspense en el server
<Suspense fallback={<Esqueleto />}>
  <WidgetLento />
</Suspense>
```

## `fetch` y cache (Next moderno)

```js
await fetch(url, { cache: 'no-store' })          // siempre fresco
await fetch(url, { next: { revalidate: 60 } })   // ISR del fetch
await fetch(url, { next: { tags: ['posts'] } })  // on-demand revalidate
```

## Elige con criterio

```text
¿El dato es igual para todos y poco cambiante? → SSG/ISR
¿Depende de cookies/headers de sesión?         → SSR (o client)
¿Pesado y opcional?                            → Streaming + Suspense
¿Solo interacción tras el shell?               → CSR en islands
```

## Errores comunes

- ISR en ruta con `cookies()` → se vuelve dinámica y el revalidate no aplica.
- Hacer SSG de página de usuario logueado.
- Olvidar `dynamic` en deploys estáticos cuando necesitas frescura.

## En el ejemplo

Tabla y flags documentados; demo Next usa SSG en `/` y un route handler dinámico.
