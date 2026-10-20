import { useState } from 'react'
import { api } from '../api/client.js'

export default function CrearPost() {
  const [titulo, setTitulo] = useState('')
  const [cuerpo, setCuerpo] = useState('')
  const [estado, setEstado] = useState(null)
  const [creado, setCreado] = useState(null)

  const onSubmit = async (e) => {
    e.preventDefault()
    setEstado('cargando')
    setCreado(null)
    try {
      const { data } = await api.post('/posts', {
        title: titulo,
        body: cuerpo,
        userId: 1,
      })
      setCreado(data)
      setEstado('ok')
      setTitulo('')
      setCuerpo('')
    } catch (err) {
      setEstado('error')
      setCreado({ error: err.response?.status ?? err.message })
    }
  }

  return (
    <section className="card">
      <h2>Crear post (POST con axios)</h2>
      <form onSubmit={onSubmit} className="stack">
        <label>
          Título:{' '}
          <input value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
        </label>
        <label>
          Cuerpo:{' '}
          <textarea
            value={cuerpo}
            onChange={(e) => setCuerpo(e.target.value)}
            rows={3}
            required
          />
        </label>
        <button type="submit" disabled={estado === 'cargando'}>
          {estado === 'cargando' ? 'Enviando…' : 'Enviar'}
        </button>
      </form>

      {estado === 'ok' && creado && (
        <p className="ok">
          Creado con id <strong>{creado.id}</strong> (JSONPlaceholder no persiste de
          verdad).
        </p>
      )}
      {estado === 'error' && <p className="error">Fallo: {String(creado?.error)}</p>}
    </section>
  )
}
