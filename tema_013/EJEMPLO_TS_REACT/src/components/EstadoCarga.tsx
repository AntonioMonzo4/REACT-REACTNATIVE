import type { ReactNode } from 'react'

export type EstadoCarga<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; mensaje: string }
  | { status: 'ok'; datos: T }

type Props<T> = { estado: EstadoCarga<T>; renderDato: (d: T) => ReactNode }

export function EstadoCarga<T>({ estado, renderDato }: Props<T>) {
  switch (estado.status) {
    case 'idle':
      return <p className="muted">Sin carga todavía</p>
    case 'loading':
      return <p className="muted">Cargando…</p>
    case 'error':
      return (
        <p role="alert" className="error">
          {estado.mensaje}
        </p>
      )
    case 'ok':
      return <div>{renderDato(estado.datos)}</div>
    default: {
      const _exhaustive: never = estado
      return _exhaustive
    }
  }
}
