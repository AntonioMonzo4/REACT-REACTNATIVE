import { Link, useParams } from 'react-router-dom'
import { USERS } from '../data/users.js'

export default function UserDetail() {
  const { userId } = useParams()
  const user = USERS.find((u) => String(u.id) === userId)

  if (!user) {
    return (
      <section className="card">
        <h1>Usuario no encontrado</h1>
        <p className="muted">
          No existe ningún usuario con id <code>{userId}</code>.
        </p>
        <Link to="/usuarios">Volver a la lista</Link>
      </section>
    )
  }

  return (
    <section className="card">
      <h1>
        {user.name} <span className="badge">id {userId}</span>
      </h1>
      <p className="muted">
        Leído de <code>useParams()</code> → <code>{'{ userId: '}"{userId}"{' }'}</code>
        (siempre string).
      </p>
      <Link to="/usuarios">Volver a la lista</Link>
    </section>
  )
}
