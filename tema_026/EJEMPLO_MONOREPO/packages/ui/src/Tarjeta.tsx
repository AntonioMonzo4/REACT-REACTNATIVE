import type { ReactNode } from 'react'

type Props = { titulo: string; children: ReactNode }

export function Tarjeta({ titulo, children }: Props) {
  return (
    <section
      style={{
        background: '#1e293b',
        borderRadius: 12,
        padding: '1rem 1.25rem',
        display: 'grid',
        gap: '0.5rem',
        maxWidth: 360,
      }}
    >
      <h2 style={{ margin: 0, fontSize: '1.1rem' }}>{titulo}</h2>
      <div>{children}</div>
    </section>
  )
}
