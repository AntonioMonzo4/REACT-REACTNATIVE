import clsx from 'clsx'

const base =
  'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50'

const variantes = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700',
  secondary: 'border border-blue-600 text-blue-600 hover:bg-blue-50',
  ghost: 'text-blue-600 hover:bg-blue-50',
}

export function Button({ variant = 'primary', className, children, ...rest }) {
  return (
    <button type="button" className={clsx(base, variantes[variant], className)} {...rest}>
      {children}
    </button>
  )
}
