import { useFavoritosStore } from '../store/useFavoritosStore.js'

const OPCIONES = ['react', 'typescript', 'vite', 'zustand', 'graphql']

export default function DemoZustand() {
  const favoritos = useFavoritosStore((s) => s.favoritos)
  const toggle = useFavoritosStore((s) => s.toggle)
  const clear = useFavoritosStore((s) => s.clear)

  return (
    <section className="card">
      <h2>Zustand + persist</h2>
      <p className="muted">
        Sin Provider. Los favoritos se guardan en <code>localStorage</code> (clave{' '}
        <code>m9_favoritos</code>): recarga y siguen ahí.
      </p>
      <div className="row">
        {OPCIONES.map((o) => (
          <button
            key={o}
            type="button"
            className={favoritos.includes(o) ? '' : 'secondary'}
            onClick={() => toggle(o)}
          >
            {favoritos.includes(o) ? '★' : '☆'} {o}
          </button>
        ))}
        <button type="button" className="secondary" onClick={clear} disabled={!favoritos.length}>
          Limpiar
        </button>
      </div>
      <p className="muted">{favoritos.length} favorito(s)</p>
    </section>
  )
}
