import { useActionState, useState } from 'react'

async function crearUsuarioAction(prev, formData) {
  await new Promise((r) => setTimeout(r, 600))
  const nombre = String(formData.get('nombre') ?? '').trim()
  if (nombre.length < 3) {
    return { ...prev, error: 'Nombre demasiado corto', ok: false }
  }
  return { error: null, ok: true, nombre, id: crypto.randomUUID() }
}

export default function FormAction() {
  const [state, action, pending] = useActionState(crearUsuarioAction, {
    error: null,
    ok: false,
  })
  const [extra, setExtra] = useState('')

  return (
    <section className="card">
      <h2>useActionState (patrón Server Action)</h2>
      <p className="muted">
        En Next la action iría en un archivo <code>'use server'</code>; aquí se
        simula con una promesa.
      </p>
      <form action={action} className="row">
        <input name="nombre" placeholder="nombre (≥3)" aria-label="nombre" />
        <input
          value={extra}
          onChange={(e) => setExtra(e.target.value)}
          placeholder="extra (controlado 19)"
          aria-label="extra"
        />
        <button type="submit" disabled={pending}>
          {pending ? 'Enviando…' : 'Crear'}
        </button>
      </form>
      {state.ok && (
        <p className="ok">
          Creado {state.nombre} · id {state.id}
        </p>
      )}
      {state.error && (
        <p role="alert" className="error">
          {state.error}
        </p>
      )}
    </section>
  )
}
