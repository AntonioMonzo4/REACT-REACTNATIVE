import { forwardRef, type InputHTMLAttributes } from 'react'

type CampoTextoProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
}

export const CampoTexto = forwardRef<HTMLInputElement, CampoTextoProps>(
  function CampoTexto({ label, id, ...rest }, ref) {
    return (
      <label>
        {label}{' '}
        <input ref={ref} id={id} {...rest} />
      </label>
    )
  },
)
