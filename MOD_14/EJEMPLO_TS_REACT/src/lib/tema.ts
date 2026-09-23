export const OPES = ['sumar', 'restar', 'igual'] as const

export type Ope = (typeof OPES)[number]

export const TEMA = {
  light: { bg: '#ffffff', fg: '#111827' },
  dark: { bg: '#0f172a', fg: '#e2e8f0' },
} as const satisfies Record<'light' | 'dark', { bg: string; fg: string }>

export type TemaKey = keyof typeof TEMA
