import { use, Suspense } from 'react'

function crearPromesa(ms, valor) {
  return new Promise((resolve) => setTimeout(() => resolve(valor), ms))
}

const temasPromise = crearPromesa(800, [
  { id: 1, nombre: 'App Router' },
  { id: 2, nombre: 'Server Actions' },
  { id: 3, nombre: 'React Compiler' },
])

function Temas() {
  const temas = use(temasPromise)
  return (
    <ul className="list">
      {temas.map((t) => (
        <li key={t.id}>{t.nombre}</li>
      ))}
    </ul>
  )
}

export default function LeerPromise() {
  return (
    <section className="card">
      <h2>use() + Suspense</h2>
      <Suspense fallback={<p className="muted">Resolviendo promesa…</p>}>
        <Temas />
      </Suspense>
      <p className="muted">
        La promesa se crea fuera del render; <code>use</code> suspende el hijo.
      </p>
    </section>
  )
}
