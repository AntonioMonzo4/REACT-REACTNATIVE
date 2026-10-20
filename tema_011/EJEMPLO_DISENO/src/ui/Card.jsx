import clsx from 'clsx'

export function Card({ className, children }) {
  return (
    <section
      className={clsx(
        'rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900',
        className,
      )}
    >
      {children}
    </section>
  )
}
