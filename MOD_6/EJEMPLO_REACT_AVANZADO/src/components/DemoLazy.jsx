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
