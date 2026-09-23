# Unidad 02 — Server Components vs Client Components

## Objetivos

- Entender qué es un Server Component y por qué corre en el **servidor**, no en el navegador.
- Saber qué significa exactamente la directiva `'use client'` y dónde colocar la frontera.
- Distinguir qué datos/props pueden cruzar del server al cliente (serialización).
- Aplicar el patrón “client shell + server data” en una página real.
- Evitar los errores típicos de frontera (layout raíz como client, funciones en props, fetch redundante).

## Requisitos

- Haber leído la Unidad 01 (React 19): hooks, `Suspense` y la idea de Server Actions.
- Dominar props, composición y `useState`/`useEffect` (M4–M14).
- Entender a grandes rasgos qué es “hacer fetch” de una API y qué es un *bundle* de JavaScript.
- Next.js no es requisito previo: los ejemplos usan rutas de `app/` que verás con detalle en la Unidad 03.

## El modelo de dos mundos: qué significa y por qué importa

En una SPA clásica (lo que venías haciendo): el servidor manda HTML casi vacío + JavaScript, y **todo** React vive en el navegador. Con Server Components, React introduce una segunda pista: algunos componentes se ejecutan en **Node.js** y envían al navegador solo su *resultado* (HTML/RSC payload), no su código.

**Analogía del restaurante**: el Server Component es la cocina —allí están las recetas secretas, la base de datos y las llaves (secrets)— y prepara platos ya emplatados. El Client Component es la mesa del comensal: mueve los cubiertos, abre cajitas, pide más salsa (interacción). La *frontera* es la ventanilla: por ella **solo** pasan platos terminados (datos serializables), nunca las recetas crudas ni los cuchillos de la cocina.

¿Por qué te importa? Porque decide tres cosas a la vez: cuánto JavaScript viaja al usuario, a qué tiene acceso tu código (DB/secrets vs. localStorage) y dónde puedes usar hooks de estado.

## Modelo de render

Comparativa oficial (conservada del material original):

| | Server Component | Client Component (`'use client'`) |
|---|------------------|-----------------------------------|
| Dónde corre | servidor (Node) | navegador (+ SSR inicial) |
| `useState`/`useEffect` | ❌ | ✅ |
| Acceso a DB / secrets | ✅ | ❌ |
| Bundle JS | no se envía al cliente | sí |
| `fetch` en el componente | en el servidor (cacheable) | en el cliente |

Lectura rápida de la tabla:

- **Server por defecto**: en el App Router, todo archivo de `app/` es Server Component salvo que tú digas lo contrario. No hay que “encenderlo”.
- **Los hooks de estado son señal de client**: si necesitas `useState`, necesitas `'use client'` (React no puede guardar estado en el servidor entre renders independientes).
- **El bundle**: cada `'use client'` arrastra hacia el navegador su código y el de sus dependencias; los Server Components no aparecen en el JavaScript descargado.

## Ejemplos: la frontera en código

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

Qué está pasando:

1. `page.jsx` espera los posts **en el servidor** (sin `useEffect`, sin estado de “cargando”).
2. `lista.jsx` solo se preocupa por la **interacción** (filtro en vivo) y por eso lleva `'use client'` en la primera línea.
3. El array `posts` cruza la frontera como **prop serializada**: el cliente recibe datos, no la función `getPosts` ni la conexión a la BD.

## Reglas de la frontera

1. **`'use client'` hacia abajo**: los hijos de un client component también son client (puedes pasar Server como children).
2. **Propagar data como props**: el server serializa props al cliente.
3. **No pases functions** del server al client (excepto Server Actions).
4. Lo más pesado de librerías (editor, charts) → `'use client'`.

Profundicemos en cada una:

1. *Hacia abajo*: `'use client'` no “contagia” hacia arriba (el padre puede seguir siendo server), pero todo lo que renderices **dentro** de ese árbol pasa a ser cliente. Por eso se dice que la frontera es un techo desde la perspectiva del padre y un suelo desde la del hijo.
2. *Props como puente*: el mecanismo de paso de platos por la ventanilla. React serializa props (JSON-like + promesas/Server Actions) al generar el payload RSC.
3. *Funciones prohibidas*: no puedes pasar un `onError` definido en el servidor o un callback arbitrario; React no puede enviar código ejecutable. La excepción son las Server Actions, que React *sí* serializa de forma segura.
4. *Librerías pesadas*: un editor tipo Monaco o una librería de charts necesita eventos y DOM → márcalas `'use client'` en un componente hoja, y deja que sus datos lleguen desde un padre server.

## Patrón “client shell + server data”

```jsx
// Server
export default async function Page() {
  const data = await api()
  return <DashboardClient initialData={data} />  // cliente recibe initialData
}
```

**Qué significa**: en vez de elegir “todo server” o “todo client”, partes la página en dos. El server trae los datos (rápido, cacheable, sin exponer secretos) y le pasa un `initialData` al componente interactivo. El cliente arranca con contenido pintado y solo refetcha si el usuario necesita datos frescos.

**Por qué importa**: es el patrón que usarás en casi todas las páginas reales: Server Component = *carga*, Client Component = *interacción*.

## Errores comunes

### 1. Poner `'use client'` en el layout raíz

**Ejemplo (mal):**

```jsx
// app/layout.jsx
'use client'          // ❌ Toda la app pasa a ser client
export default function RootLayout({ children }) { ... }
```

**Solución**: el `layout` raíz debe permanecer server (solo envuelve `<html><body>` y pasa `children`). Marca `'use client'` en el componente concreto que necesita estado (p. ej. `components/Contador.jsx`), no en la raíz. Ponerlo en el layout convierte **toda** la app client.

### 2. Hacer `fetch` en el cliente de datos que el server ya podría traer

**Ejemplo (mal):**

```jsx
'use client'
useEffect(() => { fetch('/api/posts').then(r => r.json()).then(setPosts) }, [])
```

**Solución**: si el dato no depende del navegador (no usa `localStorage`, no depende del scroll del usuario), tráelo en el Server Component con `await fetch(...)` y pásalo por props (Unidad 05). Ahorras estado de carga, agua y JavaScript.

### 3. Pasar tipos no serializables como props

**Ejemplo (mal):**

```jsx
<Panel fecha={new Date()} mapa={new Map()} render={() => x + y} />
// ❌ Date/Map/functions no cruzan la frontera (solo JSON-serializable o RSC payload)
```

**Solución**: serializa antes de cruzar (`fecha.toISOString()`, objeto plano, array) y para acciones usa Server Actions. Recuerda: **no pases functions** del server al client salvo que sean Server Actions.

## En el ejemplo

`docs/` + README; en Next: `app/(server)/page.jsx` vs `components/Contador.jsx` con directive. La demo de `EJEMPLO_MODERNO/` (Vite) no implementa Server Components de verdad —allí todo es client— pero el árbol de componentes está pensado para que, al pasarlo a Next, `page.jsx` siga siendo server y solo `Contador.jsx` (u hojas interactivas como `FormAction.jsx`) lleven la directiva `'use client'`.

## Conceptos clave

- **Server Component**: corre en Node; puede `await`, tocar BD/secrets; su código no viaja al navegador; no usa hooks de estado.
- **Client Component**: corre en el navegador; se marca con `'use client'`; soporta `useState`, efectos, eventos del DOM.
- **`'use client'`**: directiva que define la frontera; aplica hacia abajo en el árbol.
- **Serialización de props**: el único canal de datos del server al cliente (JSON-like + RSC payload).
- **Server Actions**: única excepción permitida para “pasar funciones” a través de la frontera.
- **Patrón shell + data**: Server trae datos iniciales → Client los recibe como `initialData` y gestiona la interacción.
- **Bundle JS**: el peso de JavaScript que descarga el usuario; crece con cada librería marcada `'use client'`.

## Autoevaluación

1. Mi página necesita `useState` para un buscador. ¿Dónde pongo `'use client'` y dónde no?

<details><summary>Respuesta</summary>

Solo en el componente (o subárbol) que usa `useState` — p. ej. `components/Lista.jsx` — nunca en `layout.jsx` raíz ni en la `page` que hace el `await` de los datos. El padre server pasa los datos por props y el hijo client filtra.

</details>

2. ¿Puedo pasarle al cliente una función `getPosts()` definida en el servidor? ¿Y una Server Action?

<details><summary>Respuesta</summary>

No a la primera: las funciones normales no son serializables y React las rechaza (solo datos). Sí a la segunda: las Server Actions (marcadas `'use server'`) son la única función que React serializa de forma segura para ejecutarla en el servidor.

</details>

3. ¿Qué gano si la librería de gráficos (charts) se queda en el servidor?

<details><summary>Respuesta</summary>

Nada, porque necesita DOM y eventos del navegador: hay que marcarla `'use client'`. Lo que sí ganas es poner la *carga de datos* de esos charts en un padre server, de modo que la librería pesada reciba solo `data` ya preparada y el resto de la página no pague su peso en el bundle.

</details>

4. Explica con una frase la tabla “Server vs Client” sin mirarla.

<details><summary>Respuesta</summary>

Los Server Components corren en el servidor, acceden a BD/secrets, no usan hooks de estado y no envían su JavaScript al cliente; los Client Components corren en el navegador (tras un SSR inicial), sí usan hooks y su código entra en el bundle.

</details>
