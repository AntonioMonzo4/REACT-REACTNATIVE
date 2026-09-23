import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../auth/useAuth.js'

export default function Layout() {
  const { user, logout } = useAuth()

  return (
    <div className="layout">
      <header className="topbar">
        <span className="brand">M7 · React Router</span>
        <nav className="nav">
          <NavLink to="/" end>
            Inicio
          </NavLink>
          <NavLink to="/usuarios">Usuarios</NavLink>
          <NavLink to="/buscar">Buscar</NavLink>
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/informe">Informe</NavLink>
        </nav>
        <div className="auth-box">
          {user ? (
            <>
              <span className="muted">{user.email}</span>
              <button type="button" className="secondary" onClick={logout}>
                Salir
              </button>
            </>
          ) : (
            <NavLink to="/login">Entrar</NavLink>
          )}
        </div>
      </header>

      <main className="content">
        <Outlet />
      </main>
    </div>
  )
}
