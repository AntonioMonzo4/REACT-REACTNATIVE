# Unidad 06 — Rutas lazy (code splitting por ruta)

## Por qué

El bundle inicial solo debe traer lo que se ve al abrir la app. Cada ruta pesada se carga **al navegar**.

## React.lazy + Suspense

```jsx
import { lazy, Suspense } from 'react'

const Reporte = lazy(() => import('./pages/Reporte'))

<Route
  path="/informe"
  element={
    <Suspense fallback={<p>Cargando…</p>}>
      <Reporte />
    </Suspense>
  }
/>
```

- `lazy(() => import(...))` crea un **chunk** separado en el build.
- `Suspense` muestra el fallback mientras baja el módulo.

## Envolver una sola vez

Para no repetir `Suspense` en cada ruta, envuelve el `Routes` completo o crea un wrapper:

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

## Combinación habitual con protección

```jsx
<Route
  path="/informe"
  element={
    <RequireAuth>
      <Suspense fallback={<p>Cargando…</p>}>
        <Reporte />
      </Suspense>
    </RequireAuth>
  }
/>
```

El orden lógico: **auth → lazy → página**.

## Qué medir

- `pnpm build` → el informe aparece como chunk `assets/Reporte-XXXX.js`.
- Network al navegar a `/informe`: baja el chunk en ese momento.

## Errores comunes

- Olvidar `Suspense` (o `ErrorBoundary`) → pantalla vacía mientras carga.
- Lazy de páginas minúsculas: solo merece la pena si el módulo pesa.
- Default export: `lazy(import)` **requiere `export default`** en el componente.

## En el ejemplo

`src/pages/Reporte.jsx` con `export default`; lazy en `App.jsx` (chunk separado en el build).
