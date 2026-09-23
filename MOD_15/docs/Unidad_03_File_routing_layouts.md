# Unidad 03 — File-based routing y layouts (App Router)

## Objetivos

- Entender el *file-based routing*: cómo una carpeta/archivo se convierte en una URL.
- Distinguir los archivos especiales del `app/`: `page`, `layout`, `loading`, `error`, `template`, `route`.
- Explicar qué es un layout **anidado** y por qué **persiste** al navegar.
- Leer `params` y `searchParams` (¡como promesa en Next 15+!) dentro de una `page`.
- Navegar entre rutas con `next/link` y evitar el full reload del navegador.

## Requisitos

- Unidades 01 y 02 leídas: React 19 y la frontera server/client.
- Saber qué es una URL y qué significa “ruta” (`/about`, `/posts/123`).
- JSX y composición de componentes (`children`) a nivel de curso M4–M14.
- Un proyecto Next creado con `create-next-app` (comandos en el README del módulo) para poder seguir los ejemplos con las manos.

## Qué es el file-based routing (y por qué importa)

En muchas SPA configuras las rutas en un archivo central (`<Route path="...">`, `Routes`, etc.). En Next.js **el sistema de archivos es la configuración**: creas `app/about/page.jsx` y, automáticamente, existe la ruta `/about`. Borras la carpeta, desaparece la ruta.

**Analogía**: piensa en el `app/` como en la planta de un edificio. Cada carpeta es una sala; el `page.jsx` es la puerta por la que entran los visitantes de esa sala; el `layout.jsx` es el pasillo/común que rodea varias salas. Nadie necesita un “plano de rutas” separado: el plano *es* la distribución de carpetas.

**App Router vs Pages Router** (dos generaciones de Next que puedes encontrar en internet):

- **Pages Router** (legado): rutas en `pages/`, con `getServerSideProps`/`getStaticProps` para datos.
- **App Router** (actual, el que usa este curso): rutas en `app/`, Server Components por defecto, `loading`/`error` por carpeta, `await` directo en el render y Server Actions.

Regla de oro: **no mezcles** `pages/` y `app/` en el mismo proyecto (lo verás en “Errores comunes”). Todo lo que sigue de aquí en adelante asume App Router.

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

Cómo se lee este árbol:

| Carpeta / archivo | Significado en la URL |
|-------------------|----------------------|
| `app/page.jsx` | `/` (raíz) |
| `app/about/page.jsx` | `/about` |
| `app/posts/page.jsx` | `/posts` |
| `app/posts/[id]/page.jsx` | `/posts/123` → recibe `params.id = "123"` |
| `app/(marketing)/page.jsx` | `/`… **sin** `/marketing` en la URL: es una *route group* para agrupar sin afectar la ruta |
| `app/layout.jsx` | envuelve **todas** las rutas de abajo; debe renderizar `<html>` y `<body>` |
| `app/not-found.jsx` | respuesta 404 del árbol |

El prefijo `[id]` es un **segmento dinámico**: cualquier valor de un tramo de la URL encaja ahí y llega como parámetro.

## `page`, `layout`, `loading`, `error`

Cada carpeta puede declarar estos “archivos mágicos”. El rol de cada uno (tabla original conservada):

| Archivo | Rol |
|---------|-----|
| `page.jsx` | contenido de la ruta |
| `layout.jsx` | envuelve children, **persiste** al navegar |
| `loading.jsx` | `Suspense` automático de la ruta |
| `error.jsx` | Error Boundary de la ruta (client) |
| `template.jsx` | como layout pero remonta en cada nav |
| `route.js` | endpoint GET/POST (API sin pages) |

Notas para novatos:

- Sin `page.jsx` no hay ruta visible: un `layout.jsx` solo no se puede visitar.
- `loading.jsx` es azúcar sintáctico de `<Suspense>`: te ahorra envolver manualmente la página.
- `error.jsx` **necesita** `'use client'` en su primera línea (es un Error Boundary de React y estos usan estado interno).
- `template.jsx` sirve cuando quieres que el shell se **remonte** (p. ej. para reiniciar animaciones) en cada navegación; el layout, en cambio, se conserva.
- `route.js` es la otra cara de la carpeta: en vez de devolver JSX, exporta `GET`, `POST`, etc. (Unidad 06).

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

**Qué significa**: cuando navegas de `/dashboard/a` a `/dashboard/b`, React reemplaza solo el `children`; el `nav` del layout no se desmonta ni parpadea (y su estado, si fuera client, se mantiene). Los layouts se **anidan** por carpeta: `app/layout.jsx` envuelve a `app/dashboard/layout.jsx`, que a su vez envuelve a `app/dashboard/page.jsx`.

**Por qué importa**: es la ventaja sobre las SPAs donde el `Navbar` vuelve a montarse en cada `Route` y pierdes estado/animaciones.

## Params y searchParams

```jsx
export default async function Post({ params, searchParams }) {
  const { id } = await params          // Next 15+: promesa
  const page = (await searchParams).page ?? '1'
  ...
}
```

Lectura para quien viene de React “pelado”:

- `params` = segmentos dinámicos de la URL (`/posts/123` → `{ id: '123' }`).
- `searchParams` = la query string (`/posts?page=2` → `{ page: '2' }`).
- En **Next 15+ ambos llegan como promesas**, por eso se les hace `await`. Si copias ejemplos antiguos que hacen `const { id } = params` sin esperar, verás `undefined`.
- Al leer `searchParams`, la página pasa a ser **dinámica** (no se puede SSG de forma trivial) — detalle crucial en la Unidad 04.

## Navegación

```jsx
import Link from 'next/link'

<Link href="/posts/1">Ver post</Link>
```

`next/link` prefetch + navegación cliente sin recargar.

**Qué significa**: en vez de un `<a href>` normal (que dispara una petición de documento completo y pinta la página en blanco), `Link` intercepta el clic, baja el JavaScript necesario, precarga la ruta apuntada (*prefetch* al estar en viewport) y actualiza la UI manteniendo los layouts vivos. Usa `<a>` solo para URLs externas.

## Errores comunes

### 1. Olvidar el root layout

**Ejemplo (mal):**

```text
app/
  page.jsx     ❌ sin layout.jsx raíz
```

**Solución**: crear `app/layout.jsx` con `<html>` y `<body>`:

```jsx
export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
```

Next lanza un error explícito si falta: el root layout es **obligatorio**.

### 2. Usar `useRouter` de `next/navigation` en un server component

**Ejemplo (mal):**

```jsx
import { useRouter } from 'next/navigation'
export default async function Page() {
  const router = useRouter()   // ❌ hooks de cliente en el servidor
}
```

**Solución**: los hooks (`useRouter`, `useSearchParams`, …) requieren `'use client'`. En el servidor, navega con `redirect('/login')` (Server) o empuja la interacción a un hijo client.

### 3. Crear `pages/` y `app/` a la vez

**Ejemplo (mal):**

```text
 proyecto/
   pages/index.jsx   ❌
   app/page.jsx      ❌  conflicto de routers
```

**Solución**: elige **un** router. Este curso trabaja con App Router (`app/`); elimina `pages/` (salvo que necesites legado puntual y sepas lo que haces). Coexistir provoca conflictos y comportamiento impredecible.

## En el ejemplo

Árbol de rutas descrito en el README del módulo (demo Next mínimo en `next-app/`). Al generar el proyecto con `create-next-app` ya vienes con `app/layout.jsx` y `app/page.jsx`; la práctica consiste en añadir `app/posts/page.jsx` (SSG con `await`), `app/posts/loading.jsx` y el segmento dinámico `[id]` para tocar params de punta a punta.

## Conceptos clave

- **File-based routing**: la carpeta `app/...` define la URL; `page.jsx` hace visitable la ruta.
- **App Router vs Pages Router**: `app/` (actual, Server Components) frente a `pages/` (legado); no se mezclan.
- **Root layout**: `app/layout.jsx` obligatorio con `<html>` y `<body>`; envuelve toda la app.
- **Layout anidado**: envuelve por carpeta y **persiste** al navegar; recibe `children`.
- **`loading.jsx` / `error.jsx`**: Suspense automático y Error Boundary por ruta.
- **`template.jsx`**: igual que layout pero remonta en cada navegación.
- **Segmento dinámico**: `[id]` captura un tramo de la URL como `params`.
- **Route group**: `(marketing)` agrupa sin añadir segmento a la URL.
- **`params`/`searchParams`**: en Next 15+ son promesas → hay que `await`.
- **`next/link`**: navegación cliente con prefetch, sin recargar el documento.

## Autoevaluación

1. Quiero la ruta `/productos/zapatillas`. ¿Qué archivo creo y cómo leo el “zapatillas”?

<details><summary>Respuesta</summary>

`app/productos/[slug]/page.jsx` (u otro nombre de carpeta dinámica). Dentro de la page: `const { slug } = await params` (Next 15+), y con eso construyes la consulta.

</details>

2. ¿Por qué mi navbar parpadea en cada cambio de página?

<details><summary>Respuesta</summary>

Probablemente estás renderizándola dentro de cada `page` en vez de en un `layout.jsx`. Súbela al layout (`app/layout.jsx` o el layout de la sección): el layout envuelve `children` y persiste entre navegaciones.

</details>

3. Levanto el proyecto y Next me pide un `<html>`. ¿Qué falta?

<details><summary>Respuesta</summary>

Falta el root layout `app/layout.jsx`, que es obligatorio y debe devolver `<html lang="..."><body>{children}</body></html>`.

</details>

4. Tengo `pages/about.jsx` y `app/about/page.jsx`. ¿Problema?

<details><summary>Respuesta</summary>

Sí: es un conflicto de routers. Coexisten Pages Router y App Router en el mismo proyecto. Elige `app/` (este curso) y elimina `pages/`.

</details>
