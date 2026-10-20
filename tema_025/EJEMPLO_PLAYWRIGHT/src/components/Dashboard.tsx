import { useEffect, useState, type FormEvent } from 'react'
import { anadirTarea, obtenerTareas } from '../api/tareas'
import type { Tarea } from '../api/tareas'
import type { Usuario } from '../api/auth'

type Props = { usuario: Usuario; onLogout: () => void }

export function Dashboard({ usuario, onLogout }: Props) {
  const [tareas, setTareas] = useState<Tarea[]>([])
  const [texto, setTexto] = useState('')
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    let vivo = true
    obtenerTareas().then((lista) => {
      if (vivo) {
        setTareas(lista)
        setCargando(false)
      }
    })
    return () => {
      vivo = false
    }
  }, [])

  async function añadir(evento: FormEvent) {
    evento.preventDefault()
    const limpio = texto.trim()
    if (!limpio) return
    const nueva = await anadirTarea(limpio)
    setTareas((prev) => [...prev, nueva])
    setTexto('')
  }

  return (
    <main className="panel">
      <header className="cabecera">
        <h1>Dashboard</h1>
        <p>
          Sesión de <strong data-testid="email-sesion">{usuario.email}</strong>
        </p>
        <button type="button" onClick={onLogout}>
          Cerrar sesión
        </button>
      </header>

      <form onSubmit={añadir} className="anadir">
        <div className="campo">
          <label htmlFor="nueva-tarea">Nueva tarea</label>
          <input
            id="nueva-tarea"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Comprar pan"
          />
        </div>
        <button type="submit">Añadir</button>
      </form>

      {cargando ? (
        <p>Cargando tareas…</p>
      ) : (
        <ul aria-label="Lista de tareas" data-testid="lista-tareas">
          {tareas.map((t) => (
            <li key={t.id}>{t.texto}</li>
          ))}
        </ul>
      )}
    </main>
  )
}
