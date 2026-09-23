# Unidad 06 — Rutas lazy (code splitting por ruta)

## Objetivos

- Entender el problema de un bundle único y el objetivo del **code splitting por ruta**.
- Convertir una página pesada en componente diferido con **`React.lazy`** y mostrar su **`fallback`** con **`Suspense`**.
- Evitar repetir `Suspense` en cada ruta creando un wrapper reutilizable (**`LazyRoute`**).
- Combinar protección y carga diferida con el orden lógico **auth → lazy → página**.
- Medir el resultado con **`pnpm build`** (chunk `assets/Reporte-XXXX.js`) y la pestaña **Network** del navegador.
- Evitar los errores típicos: olvidar `Suspense`/`ErrorBoundary`, aplicar lazy a páginas minúsculas y la obligación del **`export default`**.

## Requisitos

- Haber completado la **U01–U05** de este módulo; en especial el patrón `RequireAuth` de la U05, porque aquí lo combinamos con lazy.
- Haber visto **`React.lazy` en el M6, unidad U04** (import diferido de componentes); en esta unidad lo aplicamos **por ruta**, con `Suspense` gestionando la espera.
- El ejemplo `../EJEMPLO_REACT_ROUTER/`, con `src/pages/Reporte.jsx` y su `lazy` declarado en `src/App.jsx`.

## Por qué: el bundle inicial y las rutas pesadas

Piensa en el bundle como una **mudanza**: el camión que sale de la empresa al principio debe llevar lo imprescindible —Home, layout, navegación—, porque es exactamente lo que el usuario ve al abrir la app. ¿Para qué arrastrar hasta la puerta el informe con gráficas, sus librerías pesadas y sus tablas enormes si quizá el usuario nunca hará clic en "Informe"?

**Qué significa** el bundle inicial (*initial bundle*): los archivos JS y CSS que el navegador descarga **antes** de poder pintar la primera pantalla. Cada kilobyte de más retrasa ese primer render, sobre todo en un móvil o una conexión justa.

**El problema**: si en `App.jsx` escribes `import Reporte from './pages/Reporte.jsx'`, ese import es **estático**: el bundler incluye la página en el bundle principal **aunque nadie visite `/informe`**. El import lo "arrastra" siempre, en cada carga de la app.

**La solución (code splitting)**: pedirle al bundler (Vite, en el ejemplo) que saque esa página a un archivo aparte —un **chunk**— y descargarlo **solo cuando el usuario navega a la ruta**. El bundle inicial se queda con lo que se ve al abrir; la ruta pesada se carga al navegar.

**Por qué importa**: la primera pantalla llega antes, no se gastan datos en contenido que quizá nunca se ve y la app **se siente** rápida, sin tocar el diseño de las páginas ni su código.

## React.lazy + Suspense

### El patrón completo con el ejemplo Reporte

`React.lazy` recibe una **función que devuelve un import dinámico** y devuelve un componente especial: al montarse, **suspende** hasta que su módulo llega del servidor. `Suspense` es el que "escucha" esa suspensión y muestra algo mientras tanto.

```jsx
import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'

const Reporte = lazy(() => import('./pages/Reporte.jsx'))

function App() {
  return (
    <Routes>
      <Route
        path="/informe"
        element={
          <Suspense fallback={<p>Cargando…</p>}>
            <Reporte />
          </Suspense>
        }
      />
    </Routes>
  )
}
```

Línea a línea:

- **`lazy(() => import('./pages/Reporte.jsx'))`**: la función con `import(...)` es **diferida**: el bundler la reconoce y separa `Reporte.jsx` (y solo lo que él usa) en su propio chunk. `lazy` envuelve ese import en un componente de React.
- **No hay `import Reporte from ...` arriba**: ese import estático volvería a enganchar la página al bundle inicial. La única forma de "invitar al bundler a partir" es el `import()` **dentro** de `lazy`.
- **`<Suspense fallback={<p>Cargando…</p>}>`**: mientras el chunk viaja por la red, React renderiza el `fallback` (un texto, un spinner, un esqueleto…). En cuanto el módulo llega, Suspense lo sustituye por `<Reporte />`.
- **La ruta no cambia**: sigue siendo un `<Route>` de toda la vida; lo único nuevo es **cuándo** llega el código de la página.

**Qué significa** "chunk separado": en el build final hay un fichero JS con hash para el informe, distinto del `index-XXXX.js` principal. **Por qué importa**: solo quien visita la ruta paga su peso.

### El fallback es la cara de la espera

El `fallback` es lo que el usuario ve durante la descarga. Si tarda medio segundo, un mensaje educado ("Cargando informe…") evita la sensación de pantalla rota. En apps grandes se usan esqueletos (bloques con la forma del contenido) para que la espera se perciba aún más corta. Suspense **no** decide si la ruta es pública o privada: solo gestiona la espera; la autorización es cosa del guardia de la U05.

## Envolver una sola vez (wrapper `LazyRoute`)

Si tienes cinco páginas lazy, no quieres copiar el bloque `<Suspense>` cinco veces: la repetición es exactamente donde aparecen los desajustes (un fallback distinto en cada ruta, uno olvidado, un copiado mal cerrado). La solución es un **wrapper**: un componente pequeño que aplica `Suspense` por ti.

```jsx
function LazyRoute({ Component }) {
  return (
    <Suspense fallback={<p>Cargando…</p>}>
      <Component />
    </Suspense>
  )
}

<Route path="/informe" element={<LazyRoute Component={Reporte} />} />
```

**Qué significa**: `LazyRoute` recibe el componente (ya diferido con `lazy`) por props y lo monta dentro de **un único** `Suspense`. Si mañana cambias el texto o el estilo del fallback, lo cambias **en un solo sitio**.

**Por qué importa**: es DRY (*Don't Repeat Yourself*) aplicado a la UI de carga. Alternativa igual de válida: envolver el `Routes` completo en un `<Suspense>` para que todas las rutas diferidas compartan el mismo fallback. Cuidado con esa opción: el fallback se dispararía ante **cualquier** suspensión que caiga dentro de ese `Suspense`. Por eso, a medida que la app crece, se prefiere un `Suspense` cercano a cada ruta o el wrapper `LazyRoute`.

## Combinación con protección (U05 + U06)

En el ejemplo, `/informe` es **a la vez** ruta privada y ruta lazy. El orden de los envoltorios importa y sigue una lectura natural:

```jsx
<Route
  path="/informe"
  element={
    <RequireAuth>
      <Suspense fallback={<p>Cargando informe…</p>}>
        <Reporte />
      </Suspense>
    </RequireAuth>
  }
/>
```

El orden lógico es **auth → lazy → página**:

1. **Auth**: primero se decide si el usuario *puede* ver la ruta. Si no hay sesión, `RequireAuth` retorna `<Navigate>` y `Reporte` **nunca llega a montarse**, así que ni siquiera se dispara el `import()` ni se descarga el chunk.
2. **Lazy**: solo quien pasó el guardia provoca la descarga del módulo; mientras baja, se ve el `fallback` de `Suspense`.
3. **Página**: cuando el chunk llega, Suspense sustituye el fallback por el informe real.

**Por qué importa** este orden: deja cada responsabilidad en su capa —el guardia decide **quién entra**, Suspense decide **qué se ve mientras baja el código**, la página decide **qué pintar**— y evita descargar contenido pesado para alguien que ni siquiera va a verlo. Es el patrón que usa el ejemplo: `RequireAuth` envolviendo a `Suspense`, y `Suspense` envolviendo al componente lazy. Si refactorizas a lazy, no olvidés el guardia: la ruta seguiría "funcionando", pero dejaría de estar protegida.

## Qué medir

Sin medir, el lazy es solo una promesa. Hay dos comprobaciones: una estática (build) y otra en vivo (Network).

```bash
pnpm build
```

Después, mira la carpeta de salida (`dist/` en el ejemplo):

```bash
ls dist/assets
# index-DT53Z16e.js    ← bundle inicial
# Reporte-Z8GZ1Q1b.js   ← chunk del informe (hash real del ejemplo)
# index-D1jvNtNT.css
```

| Dónde | Qué hacer | Qué buscar |
|-------|-----------|------------|
| Build | Ejecutar `pnpm build` y abrir `dist/assets/` | Un fichero **`Reporte-XXXX.js` aparte** de `index-XXXX.js`: el informe salió del bundle inicial |
| Network (DevTools) | Cargar la app en Home con la pestaña Network (filtro JS) | Al abrir **no** baja `Reporte-*.js`; solo los archivos del bundle inicial |
| Network al navegar | Hacer clic para entrar en `/informe` | Aparece en ese momento la petición del chunk `Reporte-*.js` |
| Tamaño inicial | Recargar en Home y mirar el total de JS de la primera carga | El total **no incluye** el peso del informe |

**Por qué importa** medir: el chunk con hash y la petición que aparece **solo al navegar** son la prueba de que el code splitting funciona. En `pnpm dev`, Vite también pide los módulos bajo demanda (verás peticiones al navegar), pero los nombres con hash solo aparecen en `pnpm build`: por eso la lista de `dist/assets/` es la comprobación definitiva.

## Errores comunes

### 1. Olvidar `Suspense` (o `ErrorBoundary`) → pantalla vacía

**Síntoma**: navegas a `/informe` y la zona queda **vacía** mientras carga (React avisa en consola que un componente suspendió sin un `Suspense` cerca). Y si la descarga del chunk **falla** (conexión caída), sin `ErrorBoundary` el usuario no ve ninguna explicación útil.

```jsx
// ❌ Mal: Reporte "suspende" y nadie muestra el fallback
<Route path="/informe" element={<Reporte />} />
```

```jsx
// ✅ Bien: Suspense con fallback para la espera
<Route
  path="/informe"
  element={
    <Suspense fallback={<p>Cargando…</p>}>
      <Reporte />
    </Suspense>
  }
/>
```

**Solución**: envuelve **todo** componente creado con `lazy()` en un `Suspense` (con el wrapper `LazyRoute` lo tienes garantizado). Para los fallos **durante** la descarga, añade un `ErrorBoundary` alrededor: Suspense cubre la espera, ErrorBoundary cubre el error de red o de módulo.

### 2. Lazy de páginas minúsculas: solo merece la pena si pesa

**Síntoma**: `lazy` aplicado a `Home.jsx` de veinte líneas. Resultado: añades una petición extra, un estado de "Cargando…" y un nuevo punto de fallo **a cambio de nada**, porque el chunk pesa casi lo mismo que ya era ligero.

```jsx
// ❌ Mal: página diminuta partida en dos por capricho
const Home = lazy(() => import('./pages/Home.jsx'))
```

```jsx
// ✅ Bien: lazy para lo que de verdad pesa
const Reporte = lazy(() => import('./pages/Reporte.jsx'))
```

**Solución**: aplica lazy a **rutas pesadas** (gráficos, editores, dashboards con muchas librerías). Si no estás seguro, compara tamaños en `pnpm build`: si el chunk es de pocos KB, déjalo en el bundle inicial. Regla práctica: el code splitting es para el **peso**, no por reflejo.

### 3. `lazy` requiere `export default`

**Síntoma**: la ruta se queda en el fallback o explota al renderizar; en consola, React indica que el tipo del componente es inválido (recibe `undefined`). Causa típica: el módulo exporta con **named export** (`export function Reporte`) y `lazy` solo sabe resolver el **default export** del módulo.

```jsx
// ❌ Mal: named export — lazy no la encuentra
export function Reporte() {
  return <section>Informe</section>
}
```

```jsx
// ✅ Bien: export default, lo que lazy espera resolver
export default function Reporte() {
  return <section>Informe</section>
}
```

**Solución**: usa `export default` en la página diferida (exactamente lo que hace `Reporte.jsx` en el ejemplo). Si no puedes tocar el módulo, adapta la promesa: `lazy(() => import('./pages/Reporte.jsx').then(m => ({ default: m.Reporte })))`.

## En el ejemplo

- `../EJEMPLO_REACT_ROUTER/src/pages/Reporte.jsx` — la página con **`export default`** (obligatorio para `lazy`) y un aviso de que su descarga es un chunk aparte.
- `../EJEMPLO_REACT_ROUTER/src/App.jsx` — `const Reporte = lazy(() => import('./pages/Reporte.jsx'))` y la ruta `/informe` envuelta en `RequireAuth` → `Suspense` → `Reporte`.
- Tras `pnpm build`, el chunk aparece como `dist/assets/Reporte-Z8GZ1Q1b.js` (hash real del ejemplo), separado de `index-*.js`.

## Conceptos clave

- **Bundle inicial**: el JS que baja al abrir la app; debe contener solo lo visible al empezar.
- **Code splitting**: partir el bundle; cada ruta pesada en su propio **chunk**, descargado al navegar.
- **`React.lazy`**: crea un componente diferido a partir de `import()`; **requiere `export default`** en el módulo.
- **`Suspense` + `fallback`**: qué mostrar mientras baja el chunk.
- **Wrapper `LazyRoute`**: un solo `Suspense` reutilizable para todas las rutas lazy.
- **Orden auth → lazy → página**: primero el guardia, después la descarga, al final la página.
- **Medición**: `pnpm build` → `assets/Reporte-XXXX.js`; Network → la petición aparece **al navegar**, no al abrir.
- **`ErrorBoundary`**: complementa a Suspense cuando el chunk **falla** al bajar.

## Autoevaluación

1. **¿Qué se parte con `lazy(() => import('./pages/Reporte.jsx'))` y cuándo se descarga?**

   <details><summary>Respuesta</summary>
   El módulo <code>Reporte.jsx</code> (y solo lo que él use) sale del bundle principal a un chunk aparte. Se descarga cuando React monta el componente diferido, es decir, cuando el usuario navega a <code>/informe</code> —no al abrir la app—.
   </details>

2. **Navegas a `/informe` y la zona sale en blanco. ¿Qué revisas primero?**

   <details><summary>Respuesta</summary>
   Que haya un <code>Suspense</code> con <code>fallback</code> alrededor del componente de <code>lazy</code> (o el wrapper <code>LazyRoute</code>). Después: que la página tenga <code>export default</code> y que la descarga del chunk no haya fallado —para ese caso, un <code>ErrorBoundary</code>—.
   </details>

3. **¿Por qué el orden debe ser `RequireAuth` → `Suspense` → página?**

   <details><summary>Respuesta</summary>
   Porque primero se autoriza el acceso: si no hay sesión, <code>RequireAuth</code> redirige y <code>Reporte</code> nunca se monta, así que ni siquiera se descarga el chunk. Solo quien pasa el guardia paga la espera de la carga diferida, y cada capa queda con una responsabilidad clara: quién entra / qué se ve mientras baja / qué se pinta.
   </details>

4. **¿Cómo demuestras que el split funciona sin tocar el código?**

   <details><summary>Respuesta</summary>
   Con <code>pnpm build</code> y mirar <code>dist/assets/</code>: debe existir <code>Reporte-XXXX.js</code> separado de <code>index-XXXX.js</code>. Y en DevTools → Network: al recargar en Home no baja ese chunk; al navegar a <code>/informe</code> aparece la petición del chunk justo en ese momento.
   </details>
