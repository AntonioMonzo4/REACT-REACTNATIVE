import { useState } from 'react'

export default function DashboardAjustes() {
  const [nombre, setNombre] = useState('Mi workspace')

  return (
    <div>
      <h2>Ajustes</h2>
      <label className="row">
        Nombre del workspace:{' '}
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          aria-label="nombre"
        />
      </label>
      <p className="muted">
        Estado local dentro de una ruta hija: se pierde al salir (no está en la URL).
      </p>
    </div>
  )
}
