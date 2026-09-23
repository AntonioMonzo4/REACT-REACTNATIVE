import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="card">
      <h1>404</h1>
      <p className="muted">Ninguna ruta coincide con esta URL.</p>
      <Link to="/">Volver al inicio</Link>
    </section>
  )
}
