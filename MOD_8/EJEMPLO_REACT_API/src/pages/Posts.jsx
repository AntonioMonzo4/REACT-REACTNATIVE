import { Link } from 'react-router-dom'
import { useFetch } from '../hooks/useFetch.js'

export default function Posts() {
  const { data, cargando, error } = useFetch(
    'https://jsonplaceholder.typicode.com/posts?_limit=8',
  )

  if (cargando) return <p className="muted">Cargando posts…</p>
  if (error) return <p className="error">Error: {error}</p>

  return (
    <div>
      <h2>Posts (fetch)</h2>
      <ul className="list">
        {data?.map((p) => (
          <li key={p.id}>
            <Link to={`/posts/${p.id}`}>{p.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
