import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { add, clear, remove } from '../features/cart/cartSlice.js'
import { fetchProductos } from '../features/products/productsSlice.js'

const CATALOGO = [
  { id: 'p1', nombre: 'Teclado mecánico', precio: 89 },
  { id: 'p2', nombre: 'Ratón inalámbrico', precio: 39 },
  { id: 'p3', nombre: 'Monitor 27"', precio: 249 },
]

export default function DemoRedux() {
  const dispatch = useDispatch()
  const items = useSelector((s) => s.cart.items)
  const { data, status, error } = useSelector((s) => s.products)

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProductos())
    }
  }, [status, dispatch])

  const total = items.reduce((acc, i) => acc + i.precio * i.cantidad, 0)

  return (
    <section className="card">
      <h2>Redux Toolkit</h2>

      <h3>Carrito (slice síncrono)</h3>
      <div className="row">
        {CATALOGO.map((p) => (
          <button key={p.id} type="button" onClick={() => dispatch(add(p))}>
            + {p.nombre} (€{p.precio})
          </button>
        ))}
        <button type="button" className="secondary" onClick={() => dispatch(clear())} disabled={!items.length}>
          Vaciar
        </button>
      </div>
      <ul className="list">
        {items.length === 0 ? (
          <li className="muted">Carrito vacío</li>
        ) : (
          items.map((i) => (
            <li key={i.lineId}>
              {i.nombre} × {i.cantidad} — €{i.precio * i.cantidad}{' '}
              <button type="button" className="secondary" onClick={() => dispatch(remove(i.lineId))}>
                quitar
              </button>
            </li>
          ))
        )}
      </ul>
      <p className="badge">Total: €{total}</p>

      <h3>Productos (AsyncThunk)</h3>
      <div className="row">
        <button
          type="button"
          className="secondary"
          onClick={() => dispatch(fetchProductos())}
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Cargando…' : 'Recargar'}
        </button>
        <span className="muted">status: {status}</span>
      </div>
      {error && <p className="error">{error}</p>}
      <ul className="list">
        {data.map((p) => (
          <li key={p.id}>
            {p.title} —{' '}
            <button type="button" onClick={() => dispatch(add({ id: `api-${p.id}`, nombre: p.title, precio: 10 }))}>
              añadir €10
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
