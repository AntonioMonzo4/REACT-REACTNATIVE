# Unidad 04 — Lazy Loading, Suspense y Code Splitting

## Objetivos

- Entender qué es el **code splitting**: dividir el bundle para descargar solo lo que la pantalla necesita.
- Usar `React.lazy` + `import()` dinámico para cargar un componente bajo demanda.
- Envolver cargas asíncronas en `<Suspense>` y diseñar un `fallback` útil.
- Configurar **lazy en rutas** con React Router (componente lazy + Suspense en el layout).
- Distinguir los tres mundos de Suspense: **chunks de código**, **datos en React 18/19** y **errores** (Error Boundaries).
- Aplicar una estrategia de split (ruta / componente pesado / vendor) y saber **cuándo no** hacer lazy.
- Leer el ejemplo del módulo: `../EJEMPLO_REACT_AVANZADO/src/components/DemoLazy.jsx` (con `HeavyPanel`).

## Requisitos

Además de los componentes y JSX de **M4**, en esta unidad necesitas:

- **Imports dinámicos**: diferenciar `import Foo from './Foo'` (estático, al inicio) de `import('./Foo')` (dinámico, devuelve una **Promise** y el bundler lo trata aparte). Es JS moderno, no un invento de React.
- **RAE (React Arrow Functions) básico**: saber leer `lazy(() => import('./Dashboard'))`, es decir, una arrow function que devuelve la promesa del import.
- **Estado condicional con JSX** (`{show && <HeavyPanel />}`), como el del ejemplo `DemoLazy`.
- **Concepto de bundle/chunk** (M2: qué es un archivo de producción; aquí solo añadimos "el bundler puede partirlos").

En el ejemplo del módulo ya existe un `dist/assets/HeavyPanel-*.js` aparte: eso es exactamente un chunk.

## Lazy loading de componentes

### Qué significa

Por defecto, Vite/webpack empaquetan **todo** en un solo `bundle.js`. El navegador lo descarga entero antes de que la app arranque de verdad. El **lazy loading** de componentes dice: "este componente no lo descargues ahora, descárgalo cuando el usuario lo vaya a necesitar".

### Analogía: el catálogo de una tienda

Piensa en tu bundle como el catálogo completo impreso (portada, electrodomésticos, jardinería…). Si alguien solo viene a ver la portada, imprimirle las 400 páginas es despilfarro. El code splitting es sacar la sección de jardinería a un **folleto aparte** y entregárselo solo a quien pregunta por él. Mismo contenido, entrega en el momento justo.

### Código splitting en una frase

**Code splitting** = dividir el bundle en trozos (*chunks*) que se descargan por separado. `React.lazy` es la forma estándar de pedirle al bundler: "este componente va en su propio chunk".

```jsx
import { lazy, Suspense } from 'react'

const Dashboard = lazy(() => import('./Dashboard'))

function App({ view }) {
  return (
    <Suspense fallback={<p>Cargando…</p>}>
      {view === 'dashboard' ? <Dashboard /> : <Home />}
    </Suspense>
  )
}
```

Qué está pasando, paso a paso:

1. `lazy(() => import('./Dashboard'))` crea un **componente envoltorio**. El import NO se ejecuta todavía.
2. En el primer render donde React intenta pintar `<Dashboard />`, lanza la promesa del `import()` y **se suspende** (pausa ese render).
3. React busca el `<Suspense>` más cercano por encima y muestra su **`fallback`**.
4. Cuando el chunk llega, React re-renderiza y pinta el componente real. En cargas siguientes, el chunk ya está en caché: pintado casi instantáneo.

### Por qué importa

- Menos bytes en la carga inicial → **LCP/TTI mejores**, sobre todo en móvil y 3G.
- El usuario de la portada no paga el peso de la sección de admin.
- El bundler genera chunks **con nombres estables** que el navegador puede cachear por separado.

### Regla ineludible: debe ir dentro de `<Suspense>`

Un componente lazy renderizado sin ningún `<Suspense>` ancestral lanza el error clásico: *A component suspended while rendering, but no fallback UI was specified*. React **exige** un fallback: nunca deja un hueco en blanco sin avisar.

### React Router: lazy en la ruta

El patrón habitual: el componente lazy se define fuera y el `<Suspense>` envuelve el `<Routes>` del layout. Así, entrar en `/admin` dispara la descarga del chunk de admin:

```jsx
import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'

const Admin = lazy(() => import('./pages/Admin'))

function App() {
  return (
    <Suspense fallback={<p>Cargando ruta…</p>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Suspense>
  )
}
```

Mientras el chunk de `Admin` baja, el usuario ve el fallback (puedes poner un spinner o un esqueleto de layout); el resto de rutas, que son estáticas, siguen respondiendo al instante.

## Suspense para datos (React 18/19)

### Los dos modos de Suspense

| Modo | Para qué | Quién "lanza" la espera |
|------|----------|--------------------------|
| **Código** (esta unidad) | `React.lazy` + `import()` | el propio `lazy` |
| **Datos** | fetching que suspende el render | frameworks que **lanzan promesas** durante el render, o el hook **`use()`** de React 19 |

Con **React 19** existe `use(promise)`, que hace que un componente se suspenda hasta que la promesa resuelva: el `<Suspense>` cercano muestra el fallback mientras tanto. Los frameworks (Next.js App Router, Remix…) hacen algo equivalente por debajo: si la carga de datos está declarada, React espera con Suspense en lugar de renderizar vacío.

```jsx
// React 19: use() suspende el render hasta que la promesa resuelve
import { use } from 'react'

function UserList({ usersPromise }) {
  const users = use(usersPromise)
  return <ul>{users.map((u) => <li key={u.id}>{u.name}</li>)}</ul>
}

// envuelto en <Suspense fallback={<p>Cargando usuarios…</p>}>
```

### La SPA clásica con fetch

Si tu app es una SPA a mano (`useEffect` + `fetch`), **el patrón habitual sigue siendo `loading | error | data`**: Suspense no se entera de tu promesa porque tú no la lanzas durante el render, la manejas en el estado.

```jsx
function Perfil({ id }) {
  const [state, setState] = useState({ status: 'loading' })

  useEffect(() => {
    let cancelado = false
    setState({ status: 'loading' })

    fetch(`/api/users/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error(r.status)
        return r.json()
      })
      .then((data) => {
        if (!cancelado) setState({ status: 'data', data })
      })
      .catch((error) => {
        if (!cancelado) setState({ status: 'error', error })
      })

    return () => {
      cancelado = true
    }
  }, [id])

  if (state.status === 'loading') return <p>Cargando…</p>
  if (state.status === 'error') return <p role="alert">Error: {String(state.error.message)}</p>
  return <h1>{state.data.name}</h1>
}
```

**Por qué importa**: no creas que "Suspense reemplaza al fetch". Suspense **puede** cubrir datos si el dato llega *lanzando la promesa* (o con `use()`); en el fetch imperativo clásico, los tres estados siguen siendo tu amigo. El ejemplo anterior es intencionalmente el patrón imperativo de M4/M5: pinta también el estado `error` (idealmente con un Error Boundary, unidad 05).

## Error Boundaries + Suspense

Suspense gestiona la **espera**, no el **fallo**. Si el chunk **falla al descargar** (coincidencia: acabas de desplegar y el usuario tenía una pestaña vieja abierta; red caída; 404 en `assets/Admin-abc123.js`), la promesa del `import()` se rechaza. Entonces necesitas un **Error Boundary** alrededor (unidad 05), no más Suspense:

```jsx
// <Suspense> muestra el fallback mientras carga;
// si la carga falla, el boundary de unidad 05 pinta el suyo
<ErrorBoundary fallback={<p>No se pudo cargar la sección. Reintentar.</p>}>
  <Suspense fallback={<p>Cargando…</p>}>
    <Admin />
  </Suspense>
</ErrorBoundary>
```

Error típico en consola si no tienes boundary: *Failed to fetch dynamically imported module* (o `ChunkLoadError` en webpack) con la app en blanco. La combinación correcta es **boundary fuera, Suspense dentro**: el boundary atrapa errores de render y de chunks; el Suspense, la espera.

## Code splitting estratégico

No todo merece chunk propio. Este es el criterio que se usa en producción:

| Split | Ejemplo | Cuándo conviene |
|-------|---------|-----------------|
| **Por ruta** | `/admin` solo si el usuario entra | secciones enteras con URL propia; el visitante medio no las visita |
| **Por componente pesado** | editor de código, gráficas, mapas, markdown | librerías grandes que solo se usan en una pantalla concreta |
| **Por vendor** | React + librerías grandes en un chunk aparte | cambian poco: el browser lo cachea entre despliegues de tu código (lo maneja Vite/webpack) |

```javascript
// Vite ya crea chunks con import() dinámico
const Heavy = lazy(() => import('./HeavyChart'))
```

En el ejemplo del módulo, `npm run build` genera `dist/assets/HeavyPanel-*.js` **separado** del `index-*.js` principal: puedes abrir `dist/` y comprobarlo con tus propios ojos antes de creerte la teoría.

## Cuándo NO hacer lazy

El code splitting no es gratis. Dos contraejemplos claros:

- **Componentes de la pantalla inicial** (header, layout, hero): el usuario los necesita ya. Si los haces lazy, encadenas `bundle → chunk → render` y creas un **waterfall** (cascada de espera): el tiempo total empeora en lugar de mejorar. Van en el bundle principal.
- **Archivos tiny** (un icono, un helper de 2 KB): el overhead de una petición HTTP extra, el parseo del chunk y el estado de fallback **no compensan**. Parte archivos solo cuando el peso lo justifica.

Regla práctica: si **casi todos** los usuarios ven ese componente en los primeros segundos, es bundle principal. Si **pocos** lo ven o es **gordo**, es candidato a chunk.

## Ejemplo completo del módulo

`../EJEMPLO_REACT_AVANZADO/src/components/DemoLazy.jsx` — botón que carga `HeavyPanel` con `lazy` + `Suspense`:

```jsx
import { lazy, Suspense, useState } from 'react'

const HeavyPanel = lazy(() => import('./HeavyPanel'))

export default function DemoLazy() {
  const [show, setShow] = useState(false)

  return (
    <div>
      <h2>Lazy + Suspense + Code Splitting</h2>
      <p className="muted">
        <code>HeavyPanel</code> vive en otro chunk; se descarga al pulsar el botón.
      </p>
      <div className="demo-row">
        <button type="button" onClick={() => setShow((s) => !s)}>
          {show ? 'Ocultar panel' : 'Cargar panel pesado'}
        </button>
      </div>
      {show && (
        <Suspense fallback={<p className="muted">Cargando chunk…</p>}>
          <HeavyPanel />
        </Suspense>
      )}
    </div>
  )
}
```

Ábrelo en el navegador con las DevTools abiertas en la pestaña **Network**: al pulsar "Cargar panel pesado" verás llegar el archivo `HeavyPanel-*.js`. Eso es code splitting en carne (y en bytes) propia.

## Errores comunes

| Error (síntoma) | Causa probable | Solución |
|-----------------|----------------|----------|
| *A component suspended while rendering, but no fallback UI was specified* | `<Dashboard />` lazy sin ningún `<Suspense>` por encima | Envuelve el lazy en `<Suspense fallback={...}>` (en la ruta o en el layout) |
| *Failed to fetch dynamically imported module* / `ChunkLoadError` | el chunk no se pudo descargar (deploy nuevo con pestaña vieja, red, 404) | Error Boundary alrededor de Suspense (unidad 05) + UX de reintento |
| El chunk aparece **dentro** del bundle principal | dejaste un `import Heavy from './Heavy'` estático (o el bundler lo resolvió como estático) | solo debe existir el `import('./Heavy')` dinámico dentro de `lazy` |
| El waterfall en la pantalla de entrada (peor TTFB/TTI) | aplicaste lazy a componentes del primer pintado | vuelve esos componentes al bundle principal (imports estáticos) |
| Fallback parpadeante en cada navegación innecesaria | lazy a archivos diminutos o ya cacheados sin sentido | une esos módulos al bundle principal; el overhead no compensa |
| "Cargando…" eterno | el `import()` nunca resuelve (ruta mal escrita) o falta manejar el error | revisa la ruta del import y añade boundary para errores |

## Conceptos clave

- **Code splitting** = partir el bundle en **chunks**; `React.lazy(() => import(...))` es la vía estándar para un componente.
- `import()` dinámico devuelve una **Promise** y el bundler genera un archivo aparte; el import estático no.
- Todo componente lazy **debe** vivir bajo un `<Suspense>`: `fallback` mientras carga; sin él, React lanza error.
- **React Router**: componente `lazy` + `<Suspense>` envolviendo `<Routes>` (o el layout de la ruta).
- Suspense también sirve para **datos** en React 18/19 (frameworks que lanzan promesas o `use()`); la SPA clásica con `fetch` sigue con `loading | error | data`.
- **Chunk que falla → Error Boundary** (unidad 05); Suspense solo gestiona la espera, no el error.
- Splits útiles: **por ruta**, **por componente pesado**, **por vendor**; tablas de decisión arriba.
- **No lazy**: componentes del primer pintado (evita waterfalls) ni ficheros tiny (overhead sin beneficio).
- Ejemplo vivo: `../EJEMPLO_REACT_AVANZADO/src/components/DemoLazy.jsx` con `HeavyPanel` en su propio chunk.

## Autoevaluación

**1. ¿Qué dos piezas necesita obligatoriamente un componente creado con `React.lazy` para renderizarse sin romper la app?**

<details>
<summary>Respuesta</summary>

(1) Un `import()` dinámico dentro de `lazy(() => import('./X'))` y (2) un `<Suspense fallback={...}>` ancestral que muestre algo mientras el chunk baja. Sin el Suspense, React lanza "no fallback UI was specified".
</details>

**2. Tu SPA usa `fetch` en `useEffect`. ¿Puedes sustituir `loading | error | data` por un solo `<Suspense>`?**

<details>
<summary>Respuesta</summary>

No directamente: mientras manejes la promesa en el estado, React no la "lanza" durante el render y nada se suspende. Suspense para datos funciona si la promesa se lanza en el render o usas `use()` (React 19) / un framework que lo haga por ti. En el patrón imperativo clásico, sigues con los tres estados.
</details>

**3. ¿Por qué NO conviene hacer lazy el `Header` de la pantalla de entrada?**

<details>
<summary>Respuesta</summary>

Porque el usuario lo necesita en el primer pintado: el navegador tendría que descargar el bundle y **después** el chunk del header (waterfall), retrasando el render en lugar de acelerarlo. Todo lo visible de entrada va en el bundle principal.
</details>

**4. Tras un deploy, un usuario con la pestaña abierta pulsa una ruta y ve `ChunkLoadError` con la app en blanco. ¿Qué combina bien y qué unidad lo cubre?**

<details>
<summary>Respuesta</summary>

Un **Error Boundary** envolviendo el `<Suspense>` + lazy: el Suspense cubre la espera normal y el boundary atrapa el rechazo del `import()` mostrando un fallback con reintento en lugar de dejar la app en blanco. Se implementa en la unidad 05 (Error Boundaries).
</details>
