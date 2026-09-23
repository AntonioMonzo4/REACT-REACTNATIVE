import { useSearchParams } from 'react-router-dom'

const ALL = [
  'react',
  'react-router',
  'typescript',
  'vite',
  'next.js',
  'react native',
  'hooks',
  'jsx',
]

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams()
  const q = searchParams.get('q') ?? ''
  const page = Number(searchParams.get('page') ?? '1')

  const results = ALL.filter((item) => item.includes(q.toLowerCase()))
  const pageSize = 3
  const pages = Math.max(1, Math.ceil(results.length / pageSize))
  const slice = results.slice((page - 1) * pageSize, page * pageSize)

  const onSubmit = (e) => {
    e.preventDefault()
    const nextQ = new FormData(e.currentTarget).get('q')
    setSearchParams({ q: nextQ, page: '1' })
  }

  const goPage = (p) => {
    const params = { page: String(p) }
    if (q) params.q = q
    setSearchParams(params, { replace: true })
  }

  return (
    <section className="card">
      <h1>Buscar</h1>
      <form onSubmit={onSubmit} className="row">
        <input name="q" defaultValue={q} placeholder="filtrar…" aria-label="q" />
        <button type="submit">Buscar</button>
      </form>

      <p className="muted">
        URL actual: <code>?q={q || '(vacío)'}&amp;page={page}</code> — comparte el
        enlace y verás los mismos resultados.
      </p>

      <ul className="list">
        {slice.length === 0 ? (
          <li className="muted">Sin resultados</li>
        ) : (
          slice.map((item) => <li key={item}>{item}</li>)
        )}
      </ul>

      <div className="row">
        <button
          type="button"
          className="secondary"
          disabled={page <= 1}
          onClick={() => goPage(page - 1)}
        >
          ← Anterior
        </button>
        <span className="muted">
          Pág. {page} / {pages}
        </span>
        <button
          type="button"
          className="secondary"
          disabled={page >= pages}
          onClick={() => goPage(page + 1)}
        >
          Siguiente →
        </button>
      </div>
    </section>
  )
}
