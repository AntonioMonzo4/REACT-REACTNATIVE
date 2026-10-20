import { useBorrarPost, usePosts } from '../hooks/usePosts'

export function ListaPosts() {
  const { data, isPending, isError, error, refetch, isRefetching } = usePosts()
  const borrar = useBorrarPost()

  if (isPending) {
    return <p className="estado cargando">Cargando posts…</p>
  }

  if (isError) {
    return (
      <div className="estado error" role="alert">
        <p>No se pudo cargar la lista: {error.message}</p>
        <button type="button" onClick={() => void refetch()}>
          Reintentar
        </button>
      </div>
    )
  }

  if (data.length === 0) {
    return <p className="aviso-vacio">No hay posts todavía.</p>
  }

  return (
    <div className="tarjeta">
      <h2>
        Posts (useQuery){' '}
        <button type="button" onClick={() => void refetch()} disabled={isRefetching}>
          {isRefetching ? 'Refrescando…' : 'Refrescar'}
        </button>
      </h2>
      <ul className="lista-posts">
        {data.map((post) => (
          <li key={post.id}>
            <div>
              <strong>
                #{post.id} — {post.title}
              </strong>
              <div className="meta">{post.body.slice(0, 60)}…</div>
            </div>
            <div className="acciones">
              <button
                type="button"
                className="peligro"
                disabled={borrar.isPending}
                onClick={() => borrar.mutate(post.id)}
              >
                Borrar
              </button>
            </div>
          </li>
        ))}
      </ul>
      {borrar.isError && (
        <p className="estado error" role="alert">
          No se pudo borrar: {borrar.error.message}
        </p>
      )}
    </div>
  )
}
