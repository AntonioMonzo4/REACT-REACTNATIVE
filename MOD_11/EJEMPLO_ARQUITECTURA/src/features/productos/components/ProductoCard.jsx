import { Button } from '../../../shared/atoms/Button.jsx'
import { Badge } from '../../../shared/atoms/Badge.jsx'
import { fmt } from '../api.js'

export function ProductoCard({ producto, onAdd }) {
  return (
    <li className="producto">
      <span>
        {producto.nombre} <Badge>{fmt(producto.precio)}</Badge>
      </span>
      <Button onClick={() => onAdd(producto)}>Añadir</Button>
    </li>
  )
}
