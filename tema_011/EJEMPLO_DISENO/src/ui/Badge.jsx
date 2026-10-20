import clsx from 'clsx'

const tonos = {
  blue: 'bg-blue-100 text-blue-800',
  green: 'bg-emerald-100 text-emerald-800',
  amber: 'bg-amber-100 text-amber-800',
}

export function Badge({ tone = 'blue', children }) {
  return (
    <span
      className={clsx(
        'inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold',
        tonos[tone],
      )}
    >
      {children}
    </span>
  )
}
