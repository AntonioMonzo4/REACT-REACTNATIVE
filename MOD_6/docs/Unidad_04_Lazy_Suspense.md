# Unidad 04 — Lazy Loading, Suspense y Code Splitting

## Lazy loading de componentes

Dividir el bundle: cargar un componente **solo cuando se necesita**.

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

- `React.lazy` + **`import()` dinámico** → chunk separado.
- Debe ir dentro de **`<Suspense>`** (fallback mientras carga).
- En React Router: lazy en la ruta + Suspense en layout.

## Suspense para datos (React 18/19)

Con frameworks o librerías que “lanzan” promesas (o `use()` en React 19), Suspense también puede esperar datos. En una SPA clásica con `fetch` a mano, el patrón habitual sigue siendo `loading | error | data`.

## Error Boundaries + Suspense

Si el chunk **falla** al descargar, necesitas un Error Boundary alrededor (unidad 05), no solo Suspense.

## Code splitting estratégico

| Split | Ejemplo |
|-------|---------|
| Por ruta | `/admin` solo si el usuario entra |
| Por componente pesado | editor, gráficas, mapas |
| Por vendor | librerías grandes en chunk aparte (maneja Vite/webpack) |

```js
// Vite ya crea chunks con import() dinámico
const Heavy = lazy(() => import('./HeavyChart'))
```

## Cuándo NO

- Componentes de la pantalla inicial → mejor en el bundle principal (evitar waterfall).
- Archivos tiny → el overhead de chunks no compensa.

## En el ejemplo

`src/components/DemoLazy.jsx` — botón que carga `HeavyPanel` con `lazy` + `Suspense`.
