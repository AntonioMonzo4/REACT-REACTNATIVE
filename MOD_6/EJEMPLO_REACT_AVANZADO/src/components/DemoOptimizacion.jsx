import { memo, useCallback, useMemo, useState } from 'react'

const ProductoItem = memo(function ProductoItem({ producto, onSelect, view }) {
  // trabajo simulado caro memorizado por producto
  const score = useMemo(() => {
    let n = 0
    for (let i = 0; i < 50_000; i++) n = (n + producto.precio) % 97
    return n
  }, [producto.precio])

  return (
    <li>
      <button
        type="button"
        className="secondary"
        onClick={() => onSelect(producto.id)}
      >
        {producto.nombre} — {producto.precio}€
      </button>{' '}
      <span className="badge">
        score {score} · view {view}
      </span>
    </li>
  )
})

const catalogo = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  nombre: `Producto ${i + 1}`,
  precio: 10 + i * 5,
}))

export default function DemoOptimizacion() {
  const [selected, setSelected] = useState(null)
  const [parentTick, setParentTick] = useState(0)

  const onSelect = useCallback((id) => setSelected(id), [])

  return (
    <div>
      <h2>Optimización — React.memo + useMemo + useCallback</h2>
      <p className="muted">
        El padre re-renderiza con “Forzar re-render”; los items solo repintan si
        cambian sus props de referencia (producto, onSelect, view).
      </p>

      <div className="demo-row">
        <button
          type="button"
          onClick={() => setParentTick((n) => n + 1)}
        >
          Forzar re-render del padre ({parentTick})
        </button>
        <span className="badge">Seleccionado: {selected ?? '—'}</span>
      </div>

      <ul className="list">
        {catalogo.map((p) => (
          <ProductoItem
            key={p.id}
            producto={p}
            onSelect={onSelect}
            view={parentTick}
          />
        ))}
      </ul>
      <p className="muted">
        <code>view</code> sube a propósito en el padre: si quisieras ignorarlo
        en el hijo, no lo pases como prop (demo de qué props disparan renders).
      </p>
    </div>
  )
}
