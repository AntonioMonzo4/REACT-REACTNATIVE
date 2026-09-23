import { useState } from 'react'

export default function DemoStorage() {
  const [tema, setTema] = useState(() => localStorage.getItem('tema') ?? 'light')
  const [sesiones] = useState(() => {
    const n = Number(sessionStorage.getItem('sesiones') ?? '0') + 1
    sessionStorage.setItem('sesiones', String(n))
    return n
  })
  const [borrador, setBorrador] = useState(() => sessionStorage.getItem('borrador') ?? '')

  const cambiarTema = (t) => {
    setTema(t)
    localStorage.setItem('tema', t)
  }

  const escribirBorrador = (v) => {
    setBorrador(v)
    sessionStorage.setItem('borrador', v)
  }

  return (
    <section className="card">
      <h2>Storage</h2>
      <div className="row">
        <span className="badge">localStorage tema: {tema}</span>
        <span className="badge">sesiones (esta pestaña): {sesiones}</span>
        <button type="button" className="secondary" onClick={() => cambiarTema(tema === 'light' ? 'dark' : 'light')}>
          Cambiar tema
        </button>
      </div>
      <label className="stack">
        Borrador (sessionStorage — muere al cerrar la pestaña):
        <input
          value={borrador}
          onChange={(e) => escribirBorrador(e.target.value)}
          placeholder="escribe algo y recarga…"
        />
      </label>
    </section>
  )
}
