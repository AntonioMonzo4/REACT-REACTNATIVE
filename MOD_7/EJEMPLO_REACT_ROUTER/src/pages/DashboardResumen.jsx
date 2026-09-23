export default function DashboardResumen() {
  return (
    <div>
      <h2>Resumen</h2>
      <p className="muted">
        Ruta hija <code>index</code>/<code>resumen</code> del layout del dashboard.
      </p>
      <div className="row">
        <span className="badge">Usuarios: 3</span>
        <span className="badge">Sesiones: 12</span>
        <span className="badge">Errores: 0</span>
      </div>
    </div>
  )
}
