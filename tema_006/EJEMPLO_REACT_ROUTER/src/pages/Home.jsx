export default function Home() {
  return (
    <section className="card">
      <h1>Inicio</h1>
      <p className="muted">
        Navega con la barra superior: params en <code>/usuarios/1</code>, query en{' '}
        <code>/buscar?q=react</code>, rutas anidadas en <code>/dashboard</code> y
        ruta lazy/protegida en <code>/informe</code>.
      </p>
      <ul>
        <li>Inicio — ruta exacta <code>/</code></li>
        <li>Usuarios — lista y detalle con <code>useParams</code></li>
        <li>Buscar — filtros en la URL con <code>useSearchParams</code></li>
        <li>Dashboard — layout con <code>Outlet</code></li>
        <li>Informe — requiere login + chunk lazy</li>
      </ul>
    </section>
  )
}
