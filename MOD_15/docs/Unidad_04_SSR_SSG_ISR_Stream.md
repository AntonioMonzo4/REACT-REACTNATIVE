# Unidad 04 — SSR, SSG, ISR y Streaming

## Objetivos

- Diferenciar CSR, SSR, SSG, ISR y Streaming: **cuándo** se genera el HTML y para quién.
- Saber leer la tabla comparativa y elegir estrategia con el flujo de decisión de esta unidad.
- Configurar cada estrategia en el App Router con `dynamic` y `revalidate`.
- Entender las tres políticas de `fetch` (`no-store`, `revalidate`, `tags`) en el Next moderno.
- Reconocer cuándo una página “se cae” a dinámica sin que te esperes (ISR + `cookies()`).

## Requisitos

- Unidades 01–03: React 19, frontera server/client y estructura del `app/`.
- Saber qué es un *build* (`pnpm build`) y qué es una petición HTTP.
- Tener a mano el `next-app` mínimo del README del módulo para probar los flags.
- Haber entendido que un Server Component puede hacer `await` (Unidad 05 profundiza en *qué* pedir; aquí nos centramos en *cuándo* se genera el HTML).

## Las cinco estrategias explicadas para novatos

Imagina una revista:

- **CSR** (Client-Side Rendering): el navegador recibe la revista en blanco y el lector rellena las páginas él mismo con tinta traída de otra imprenta (API). Muy flexible, pero hay un instante en blanco y el SEO lo ve vacío.
- **SSR** (Server-Side Rendering): la imprenta **cada vez que alguien llama al timbre** (request) imprime una copia personalizada con las noticias del minuto. HTML siempre fresco, pero la imprenta trabaja sin parar.
- **SSG** (Static Site Generation): imprimes **una vez, al cerrar la edición** (build). Mil visitas leen el mismo ejemplar: rapidísimo y barato, pero si cambia una noticia hace falta nuevo build.
- **ISR** (Incremental Static Regeneration): imprimes la edición, pero si tienen más de 60 segundos (revalidación) tiras a la basura *esa copia* y la reimprime sola, sin redeploy completo. Punto intermedio entre SSG y SSR.
- **Streaming**: en vez de un folleto completo, envías **páginas por trozos** (Suspense): primero el esqueleto y luego los widgets que tardan, cada uno cuando está listo.

### Comparativa

Tabla original (conservada):

| Estrategia | Cuándo se genera HTML | Ideal |
|------------|----------------------|--------|
| **CSR** | en el navegador | apps con mucha interacción tras login |
| **SSR** | en **cada request** | datos frescos por usuario |
| **SSG** | en **build** | docs, blog, landing |
| **ISR** | build + **revalidación** (p. ej. 60 s) | catálogo, precios que cambian a menudo |
| **Streaming** | HTML **por trozos** (Suspense) | dashboards con widgets de distinta latencia |

Por qué importa cada fila: la estrategia determina latencia percibida, coste del servidor, comportamiento del SEO y frescura de los datos. Un error de elección no “rompe” la app, pero la deja lenta o con datos viejos —dos formas de perder usuarios.

## En App Router: cómo se configura

En el App Router no hay `getStaticProps` (eso era Pages Router): se configura con **export segment-scoped** en la `page`/`layout` y con las opciones de `fetch`.

```javascript
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

Cómo interpretarlo:

- `dynamic = 'force-dynamic'` → “esta ruta se renderiza en **cada request**” (SSR puro).
- `revalidate = false` → “no revalides nunca: HTML del build” (SSG).
- `revalidate = 60` → “sirve el HTML estático y, si pasaron 60 s, regenera en segundo plano la siguiente visita que toque” (ISR).
- El `<Suspense>` dentro del Server Component abre conductos de **streaming**: el HTML sale por trozos y cada hijo lento llega cuando termina.

## `fetch` y cache (Next moderno)

El cache ya no es un “todo o nada” de la página: Next extiende `fetch` con opciones propias para decidir la frescura **por recurso**:

```javascript
await fetch(url, { cache: 'no-store' })          // siempre fresco
await fetch(url, { next: { revalidate: 60 } })   // ISR del fetch
await fetch(url, { next: { tags: ['posts'] })  // on-demand revalidate
```

(conservado tal cual del material original; en tu editor verás la llave final de `tags` — la forma completa es `{ next: { tags: ['posts'] } }`).

- `cache: 'no-store'` → cero caché: ideal para datos privados/por usuario; además **fuerza** que la ruta sea dinámica.
- `next.revalidate` → *time-based*: caché con caducidad, el equivalente a ISR a nivel de petición.
- `next.tags` → *on-demand*: puedes invalidar después con `revalidateTag('posts')`, típicamente tras una Server Action. Es la forma moderna de “este post cambió, refresca solo esto”.

## Elige con criterio

```text
¿El dato es igual para todos y poco cambiante? → SSG/ISR
¿Depende de cookies/headers de sesión?         → SSR (o client)
¿Pesado y opcional?                            → Streaming + Suspense
¿Solo interacción tras el shell?               → CSR en islands
```

Paso a paso del diagrama:

1. *¿Igual para todos y poco cambiante?* (docs, landing, blog) → **SSG**; si cambia cada tanto pero no a cada request → **ISR**.
2. *¿Depende de cookies/headers de sesión?* → el HTML no puede ser compartido entre usuarios: **SSR** (o deja el shell estático y trae el dato en una isla client).
3. *¿Pesado y opcional?* (métricas, recomendaciones) → no bloquees el HTML principal: **Streaming + Suspense** con `fallback`.
4. *¿Solo es interacción tras el shell?* → pinta el estático y deja la parte reactiva en CSR.

## Errores comunes

### 1. ISR en ruta que usa `cookies()`

**Ejemplo (mal):**

```jsx
export const revalidate = 60
export default async function Page() {
  const tema = cookies().get('theme')   // ❌ la ruta se vuelve dinámica
}
```

**Solución**: al leer `cookies()`/`headers()`/`searchParams`, Next convierte la ruta en **dinámica** y el `revalidate` no aplica (no hay HTML compartible). Si necesitas personalización, deja el shell estático y trae el dato por usuario en el cliente, o acepta SSR para esa sección.

### 2. Hacer SSG de una página de usuario logueado

**Ejemplo (mal):**

```text
app/dashboard/page.jsx  con export const revalidate = false   ❌
```

**Solución**: un HTML estático es **igual para todos**: no puedes imprimir “la cuenta de María” en el build. Usa `dynamic = 'force-dynamic'` (o `fetch(..., { cache: 'no-store' })`) para que cada visitante reciba lo suyo.

### 3. Olvidar `dynamic` cuando necesitas frescura total

**Ejemplo (mal):** actualizas un artículo en la base de datos y la web sigue sirviendo la versión del build/de hace 60 s.

**Solución**: para deploys/entornos donde el dato debe ser inmediato, declara `export const dynamic = 'force-dynamic'` (o `cache: 'no-store'` en el `fetch`). Recuerda lo contrario también: en deploys **estáticos** sin servidor de revalidación, verifica que ISR esté soportado por tu hosting.

## En el ejemplo

Tabla y flags documentados; demo Next usa SSG en `/` y un route handler dinámico. Es decir: la raíz se genera en el `build` (rápida, cacheable) mientras que `app/api/...` (`route.js`) responde en cada request — el contraste perfecto para ver SSR/SSG conviviendo en un mismo proyecto.

## Conceptos clave

- **CSR**: el HTML se arma en el navegador; ideal tras login, malo para SEO inicial.
- **SSR**: render en cada request; frescura máxima, coste por visita.
- **SSG**: render en el build; el más rápido, solo para datos compartibles.
- **ISR**: SSG con revalidación periódica (`revalidate` en segundos).
- **Streaming**: HTML por trozos mediante `Suspense` en el server.
- **`export const dynamic`**: fuerza el modo de render de la ruta (`force-dynamic`, etc.).
- **`export const revalidate`**: caducidad del HTML generado (`false` = nunca, número = segundos).
- **`fetch` cacheado**: `no-store` (siempre fresco), `next.revalidate` (TTL), `next.tags` (invalidación on-demand).
- **Ruta dinámica implícita**: usar `cookies()`, `headers()` o `searchParams` anula el SSG/ISR de esa ruta.
- **`revalidatePath` / `revalidateTag`**: invalidación tras mutaciones (Server Actions).

## Autoevaluación

1. Tengo un blog con 200 artículos escritos una vez por semana. ¿SSR, SSG o ISR? ¿Por qué?

<details><summary>Respuesta</summary>

ISR (o SSG si no te importa redeployar). El dato es igual para todos y cambia poco: genera en build y revalida cada N segundos (`export const revalidate = 60`, p. ej.) para que los artículos nuevos/aparecen sin esperar a un deploy.

</details>

2. Mi página de perfil hace `cookies()` para el tema del usuario, pero puse `revalidate = 60`. ¿Se aplica la revalidación?

<details><summary>Respuesta</summary>

No: leer `cookies()`/`headers()`/`searchParams` vuelve la ruta dinámica, así que se renderiza por request y el `revalidate` queda sin efecto.

</details>

3. ¿Qué dos formas (de esta unidad) tengo de decirle a un `fetch` “nunca caches”?

<details><summary>Respuesta</summary>

`await fetch(url, { cache: 'no-store' })` y, a nivel de ruta, `export const dynamic = 'force-dynamic'`. Ambas llevan a HTML/render por request.

</details>

4. ¿Cuándo conviene Streaming en vez de SSR “clásico”?

<details><summary>Respuesta</summary>

Cuando la página mezcla widgets de latencias distintas: el shell rápido sale ya y cada bloque lento se sustituye con su `fallback` de `Suspense` cuando termina. El usuario ve contenido antes aunque el dato más pesado tarde.

</details>
