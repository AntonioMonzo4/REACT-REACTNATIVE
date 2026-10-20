import { useState } from 'react'
import { getToken, removeToken, setToken } from '../auth/token.js'

export default function DemoToken() {
  const [token, setTokenState] = useState(getToken())

  const crear = () => {
    const fake = `jwt.${btoa(JSON.stringify({ sub: 'alumno', exp: Date.now() + 60000 }))}.firma`
    setToken(fake)
    setTokenState(fake)
  }

  const borrar = () => {
    removeToken()
    setTokenState(null)
  }

  return (
    <section className="card">
      <h2>Token simulado (patrón JWT)</h2>
      <p className="muted">
        Demo sin backend: guarda un string en <code>localStorage</code> y el
        interceptor de axios lo adjunta como <code>Authorization: Bearer</code>.
      </p>
      <div className="row">
        <button type="button" onClick={crear} disabled={Boolean(token)}>
          Crear token
        </button>
        <button type="button" className="secondary" onClick={borrar} disabled={!token}>
          Borrar
        </button>
      </div>
      <p className="muted break">
        {token ? token.slice(0, 64) + '…' : '(sin token — las llamadas salen sin Authorization)'}
      </p>
    </section>
  )
}
