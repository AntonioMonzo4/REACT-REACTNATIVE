import { useMemo, useState } from 'react'
import { PRODUCTOS } from '../api.js'
import { SearchBar } from '../components/SearchBar.jsx'
import { ProductoCard } from '../components/ProductoCard.jsx'

export default function ProductosPage({ onAdd }) {
  const [q, setQ] = useState('')

  const filtrados = useMemo(
    () =>
      PRODUCTOS.filter((p) =>
        p.nombre.toLowerCase().includes(q.trim().toLowerCase()),
      ),
    [q],
  )

  return (
    <section className="card">
      <h2>Productos (feature)</h2>
      <SearchBar value={q} onChange={setQ} />
      <ul className="list">
        {filtrados.map((p) => (
          <ProductoCard key={p.id} producto={p} onAdd={onAdd} />
        ))}
      </ul>
      <p className="muted">La feature exporta su página; interna no se toca fuera.</p>
    </section>
  )
}
