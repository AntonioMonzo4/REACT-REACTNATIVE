import { NavLink, Outlet } from 'react-router-dom'

export default function Dashboard() {
  return (
    <section className="card">
      <h1>Dashboard</h1>
      <nav className="subnav">
        <NavLink to="resumen" end>
          Resumen
        </NavLink>
        <NavLink to="ajustes">Ajustes</NavLink>
      </nav>
      <div className="nested-outlet">
        <Outlet />
      </div>
      <p className="muted">
        Layout anidado: el <code>Outlet</code> pinta <code>/dashboard/resumen</code>{' '}
        o <code>/dashboard/ajustes</code> sin recargar el padre.
      </p>
    </section>
  )
}
