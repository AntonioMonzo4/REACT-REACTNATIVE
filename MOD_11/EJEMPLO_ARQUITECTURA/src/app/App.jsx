import { CarritoLista, useCarrito } from '../features/carrito/index.js'
import { ProductosPage } from '../features/productos/index.js'
import { Badge } from '../shared/atoms/Badge.jsx'

export default function App() {
  const carrito = useCarrito()

  return (
    <div className="app">
      <header className="header">
        <h1>
          M11 · Arquitectura <Badge>demo</Badge>
        </h1>
      </header>

      <ProductosPage onAdd={carrito.add} />
      <CarritoLista carrito={carrito} />
    </div>
  )
}
