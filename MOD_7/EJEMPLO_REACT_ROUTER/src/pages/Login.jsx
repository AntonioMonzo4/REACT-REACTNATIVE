import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth.js'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname ?? '/'

  const onSubmit = (e) => {
    e.preventDefault()
    const email = new FormData(e.currentTarget).get('email')
    login(email)
    navigate(from, { replace: true })
  }

  return (
    <section className="card">
      <h1>Entrar</h1>
      <p className="muted">
        Login de demo (sin backend). Tras entrar volverás a{' '}
        <code>{from}</code> gracias a <code>state.from</code>.
      </p>
      <form onSubmit={onSubmit} className="stack">
        <label>
          Email:{' '}
          <input
            type="email"
            name="email"
            defaultValue="alumno@curso.dev"
            required
          />
        </label>
        <button type="submit">Entrar</button>
      </form>
    </section>
  )
}
