import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }

export function Boton({ children, ...props }: Props) {
  return (
    <button
      style={{
        padding: '0.55rem 1rem',
        borderRadius: 8,
        border: 'none',
        background: '#2563eb',
        color: 'white',
        fontWeight: 600,
        cursor: 'pointer',
      }}
      {...props}
    >
      {children}
    </button>
  )
}
