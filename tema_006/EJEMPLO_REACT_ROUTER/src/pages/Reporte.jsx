import { useAuth } from '../auth/useAuth.js'

export default function Reporte() {
  const { user } = useAuth()

  return (
    <section className="card">
      <h1>Informe (lazy)</h1>
      <p>
        Hola <strong>{user?.email}</strong>. Esta página se carga con{' '}
        <code>React.lazy</code>: en el build es un chunk aparte que solo se descarga
        al entrar en <code>/informe</code>.
      </p>
      <p className="muted">
        Ruta protegida con <code>RequireAuth</code> (si no hay sesión te redirige al
        login y al volver retomas esta URL).
      </p>
    </section>
  )
}
