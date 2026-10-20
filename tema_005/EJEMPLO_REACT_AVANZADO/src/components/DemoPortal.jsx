import { useState } from 'react'
import { createPortal } from 'react-dom'

export default function DemoPortal() {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <h2>Portals</h2>
      <p className="muted">
        El modal se monta en <code>#modal-root</code> (fuera de{' '}
        <code>#root</code>) pero sigue recibiendo props/context de React.
      </p>
      <button type="button" onClick={() => setOpen(true)}>
        Abrir modal
      </button>

      {open &&
        createPortal(
          <div
            className="overlay"
            role="dialog"
            aria-modal="true"
            aria-label="Ejemplo de portal"
            onClick={() => setOpen(false)}
          >
            <div
              className="modal"
              onClick={(e) => e.stopPropagation()}
            >
              <h3>¡Soy un portal!</h3>
              <p>
                Útil si un ancestro tiene <code>overflow: hidden</code> o{' '}
                <code>transform</code>.
              </p>
              <button type="button" onClick={() => setOpen(false)}>
                Cerrar
              </button>
            </div>
          </div>,
          document.getElementById('modal-root'),
        )}
    </div>
  )
}
