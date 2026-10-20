import { useOptimistic, useState, useTransition } from 'react'

async function guardar(id) {
  await new Promise((r) => setTimeout(r, 700))
  if (id % 2 === 0) throw new Error('Fallo simulado en el servidor')
  return id
}

export default function Optimista() {
  const [items, setItems] = useState([])
  const [optimistas, addOptimista] = useOptimistic(
    items,
    (lista, nuevo) => [...lista, { id: nuevo, pendiente: true }],
  )
  const [error, setError] = useState(null)
  const [pending, startTransition] = useTransition()

  const agregar = () => {
    const id = items.length + 1
    setError(null)
    startTransition(async () => {
      addOptimista(id)
      try {
        const ok = await guardar(id)
        setItems((prev) => [...prev, { id: ok, pendiente: false }])
      } catch (e) {
        setError(e instanceof Error ? e.message : 'error')
        // el estado optimista se descarta al fallar el transition
      }
    })
  }

  return (
    <section className="card">
      <h2>useOptimistic</h2>
      <div className="row">
        <button type="button" onClick={agregar} disabled={pending}>
          {pending ? 'Guardando…' : `Añadir ítem #${items.length + 1}`}
        </button>
      </div>
      <ul className="list">
        {optimistas.length === 0 ? (
          <li className="muted">Sin ítems</li>
        ) : (
          optimistas.map((it) => (
            <li key={it.id}>
              Ítem {it.id}
              {it.pendiente ? ' · optimista…' : ' · confirmado'}
            </li>
          ))
        )}
      </ul>
      {error && (
        <p role="alert" className="error">
          {error} (la lista optimista revierte en este demo)
        </p>
      )}
    </section>
  )
}
