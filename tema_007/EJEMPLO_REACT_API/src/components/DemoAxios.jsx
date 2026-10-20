import { useState } from 'react'
import { api } from '../api/client.js'

export default function DemoAxios() {
  const [resultado, setResultado] = useState('')
  const [cargando, setCargando] = useState(false)

  const getConParams = async () => {
    setCargando(true)
    try {
      const { data } = await api.get('/comments', {
        params: { _limit: 3, postId: 1 },
      })
      setResultado(`OK 200 → ${data.length} comentarios: ${data.map((c) => c.email).join(', ')}`)
    } catch (err) {
      setResultado(`Error: ${err.response?.status ?? err.message}`)
    } finally {
      setCargando(false)
    }
  }

  const getInexistente = async () => {
    setCargando(true)
    try {
      await api.get('/posts/999999')
      setResultado('Inesperado: 2xx')
    } catch (err) {
      setResultado(
        err.response
          ? `err.response.status = ${err.response.status} (axios lanza en 4xx/5xx)`
          : `Sin respuesta de red: ${err.message}`,
      )
    } finally {
      setCargando(false)
    }
  }

  return (
    <section className="card">
      <h2>Axios</h2>
      <div className="row">
        <button type="button" onClick={getConParams} disabled={cargando}>
          GET con params
        </button>
        <button type="button" className="secondary" onClick={getInexistente} disabled={cargando}>
          GET inexistente (404)
        </button>
      </div>
      {resultado && <p className="muted break">{resultado}</p>}
    </section>
  )
}
