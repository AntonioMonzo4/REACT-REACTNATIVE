import type { Usuario } from '../types'

type UsuarioCardProps = {
  usuario: Usuario
  destacado?: boolean
  onSaludar: (id: string) => void
}

export function UsuarioCard({ usuario, destacado = false, onSaludar }: UsuarioCardProps) {
  return (
    <div className={destacado ? 'card destacada' : 'card'}>
      <strong>{usuario.nombre}</strong>
      <span className="muted"> {usuario.email}</span>
      <button type="button" onClick={() => onSaludar(usuario.id)}>
        Saludar
      </button>
    </div>
  )
}
