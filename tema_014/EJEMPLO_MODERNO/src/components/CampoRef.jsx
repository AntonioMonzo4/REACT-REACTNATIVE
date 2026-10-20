import { useRef, useState } from 'react'

export default function CampoRef({ ref }) {
  const [ultimo, setUltimo] = useState('')
  const localRef = useRef(null)

  return (
    <section className="card">
      <h2>ref como prop (React 19)</h2>
      <div className="row">
        <input
          ref={(nodo) => {
            localRef.current = nodo
            if (typeof ref === 'function') ref(nodo)
            else if (ref) ref.current = nodo
          }}
          placeholder="escribe y pulsa foco externo"
          aria-label="campo ref"
        />
        <button type="button" onClick={() => localRef.current?.focus()}>
          Foco
        </button>
        <button type="button" className="secondary" onClick={() => setUltimo(localRef.current?.value ?? '')}>
          Leer valor
        </button>
      </div>
      {ultimo && <p className="muted">Último valor leído: «{ultimo}»</p>}
      <p className="muted">
        El padre puede pasar <code>ref</code> sin <code>forwardRef</code>.
      </p>
    </section>
  )
}
