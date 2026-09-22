import { useState } from 'react'

const initialValues = { email: '', password: '' }

function validate(values) {
  const errors = {}
  if (!values.email) {
    errors.email = 'El email es obligatorio'
  } else if (!/^\S+@\S+\.\S+$/.test(values.email)) {
    errors.email = 'Formato de email inválido'
  }
  if (!values.password) {
    errors.password = 'La contraseña es obligatoria'
  } else if (values.password.length < 6) {
    errors.password = 'Mínimo 6 caracteres'
  }
  return errors
}

export default function FormularioValidado() {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    const next = { ...values, [name]: value }
    setValues(next)
    setSubmitted(false)
    if (touched[name]) {
      setErrors(validate(next))
    }
  }

  const handleBlur = (e) => {
    const { name } = e.target
    setTouched((t) => ({ ...t, [name]: true }))
    setErrors(validate(values))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate(values)
    setErrors(errs)
    setTouched({ email: true, password: true })
    if (Object.keys(errs).length === 0) {
      setSubmitted(true)
      setValues(initialValues)
      setTouched({})
    }
  }

  const showError = (name) => (touched[name] ? errors[name] : undefined)

  return (
    <div>
      <h2>Formulario controlado + validación</h2>
      <p className="muted">
        Errores al <code>blur</code> y al submit; <code>touched</code> evita
        mensajes antes de tocar el campo.
      </p>

      <form onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={showError('email') ? 'true' : undefined}
            aria-describedby={showError('email') ? 'email-error' : undefined}
          />
          {showError('email') && (
            <span id="email-error" className="error">
              {showError('email')}
            </span>
          )}
        </div>

        <div className="field">
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={showError('password') ? 'true' : undefined}
            aria-describedby={
              showError('password') ? 'password-error' : undefined
            }
          />
          {showError('password') && (
            <span id="password-error" className="error">
              {showError('password')}
            </span>
          )}
        </div>

        <div className="demo-row">
          <button type="submit">Registrarse</button>
          {submitted && (
            <span className="success">¡Enviado! Formulario reseteado.</span>
          )}
        </div>
      </form>
    </div>
  )
}
