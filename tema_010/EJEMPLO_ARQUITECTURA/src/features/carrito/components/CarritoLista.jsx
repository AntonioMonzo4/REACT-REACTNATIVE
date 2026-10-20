import { Button } from '../../../shared/atoms/Button.jsx'
import { Badge } from '../../../shared/atoms/Badge.jsx'
import { calcularTotalPedido } from '../../../domain/pedido.js'
import { fmt } from '../../productos/api.js'

export default function CarritoLista({ carrito }) {
  const { lineas, remove, clear } = carrito
  const total = calcularTotalPedido(lineas)

  return (
    <section className="card">
      <h2>
        Carrito <Badge>{lineas.length}</Badge>
      </h2>
      <ul className="list">
        {lineas.length === 0 ? (
          <li className="muted">Vacío</li>
        ) : (
          lineas.map((l) => (
            <li key={l.id}>
              {l.nombre} × {l.cantidad} — {fmt(l.precio * l.cantidad)}{' '}
              <Button variant="ghost" onClick={() => remove(l.id)}>
                quitar
              </Button>
            </li>
          ))
        )}
      </ul>
      <div className="row">
        <strong>Total: {fmt(total)}</strong>
        <Button variant="ghost" onClick={clear} disabled={!lineas.length}>
          Vaciar
        </Button>
      </div>
    </section>
  )
}
