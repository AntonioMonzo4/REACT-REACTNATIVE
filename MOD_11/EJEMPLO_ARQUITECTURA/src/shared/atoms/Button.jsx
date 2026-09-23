export function Button({ children, variant = 'primary', ...rest }) {
  const clase = variant === 'ghost' ? 'btn ghost' : 'btn'
  return (
    <button type="button" className={clase} {...rest}>
      {children}
    </button>
  )
}
