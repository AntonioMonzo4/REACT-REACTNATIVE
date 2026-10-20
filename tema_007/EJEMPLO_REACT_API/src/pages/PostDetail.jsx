import { Link, useParams } from 'react-router-dom'
import { useFetch } from '../hooks/useFetch.js'

export default function PostDetail() {
  const { postId } = useParams()
  const { data, cargando, error } = useFetch(
    `https://jsonplaceholder.typicode.com/posts/${postId}`,
  )

  if (cargando) return <p className="muted">Cargando post…</p>
  if (error) return <p className="error">Error: {error}</p>

  return (
    <div>
      <h2>{data?.title}</h2>
      <p>{data?.body}</p>
      <Link to="/posts">← Volver</Link>
    </div>
  )
}
