import { useState, type FormEvent } from 'react'
import type { Usuario } from '../types'

type FormularioProps = {
  onAlta: (u: Usuario) => void
}

export function Formulario({ onAlta }: FormularioProps) {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!nombre.trim() || !email.includes('@')) {
      setError('Nombre y email válidos son obligatorios')
      return
    }
    setError(null)
    onAlta({ id: crypto.randomUUID(), nombre: nombre.trim(), email })
    setNombre('')
    setEmail('')
  }

  return (
    <form onSubmit={onSubmit} className="stack">
      <label>
        Nombre:{' '}
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          aria-label="nombre"
        />
      </label>
      <label>
        Email:{' '}
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          aria-label="email"
        />
      </label>
      {error && (
        <p role="alert" className="error">
          {error}
        </p>
      )}
      <button type="submit">Alta usuario</button>
    </form>
  )
}
