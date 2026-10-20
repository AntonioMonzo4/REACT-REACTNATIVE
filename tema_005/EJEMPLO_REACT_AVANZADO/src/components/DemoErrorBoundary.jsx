import { useState } from 'react'
import { ErrorBoundary } from './ErrorBoundary'

function Bomb() {
  throw new Error('Error de demostración en el render')
}

function ErrorBoundaryInline({ children }) {
  return <ErrorBoundary>{children}</ErrorBoundary>
}

export default function DemoErrorBoundary() {
  const [explode, setExplode] = useState(false)

  return (
    <div>
      <h2>Error Boundaries</h2>
      <p className="muted">
        Envuelve secciones que pueden fallar al render. Los errores en handlers
        no los capturan (usa try/catch ahí).
      </p>
      <ErrorBoundaryInline>
        <button
          type="button"
          className="secondary"
          onClick={() => setExplode(true)}
        >
          Lanzar error en render
        </button>
        {explode && <Bomb />}
        <p className="muted">Si no explota, este texto se ve normal.</p>
      </ErrorBoundaryInline>
    </div>
  )
}
