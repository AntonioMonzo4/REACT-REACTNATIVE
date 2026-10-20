import { Link } from 'react-router-dom'
import { USERS } from '../data/users.js'

export default function Users() {
  return (
    <section className="card">
      <h1>Usuarios</h1>
      <ul className="list">
        {USERS.map((u) => (
          <li key={u.id}>
            <Link to={`/usuarios/${u.id}`}>{u.name}</Link>
          </li>
        ))}
      </ul>
      <p className="muted">
        El <code>:userId</code> de la ruta se lee con <code>useParams</code> en la
        página de detalle.
      </p>
    </section>
  )
}
