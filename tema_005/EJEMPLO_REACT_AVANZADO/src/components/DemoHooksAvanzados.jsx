import { useState } from 'react'
import { useDebounce } from '../hooks/useDebounce'
import { useLocalStorage } from '../hooks/useLocalStorage'

export default function DemoHooksAvanzados() {
  const [query, setQuery] = useState('')
  const debounced = useDebounce(query, 400)
  const [notes, setNotes] = useLocalStorage('mod6-notes', 'Mis notas en localStorage')

  return (
    <div>
      <h2>Custom hooks — useDebounce + useLocalStorage</h2>

      <div className="demo-row">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Escribe… (debounce 400ms)"
          aria-label="Búsqueda con debounce"
        />
        <span className="badge">inmediato: {query || '—'}</span>
        <span className="badge">debounced: {debounced || '—'}</span>
      </div>

      <div className="demo-row">
        <input
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Nota persistente"
          aria-label="Nota persistente"
          style={{ minWidth: '16rem' }}
        />
        <span className="muted">Se guarda en localStorage al cambiar</span>
      </div>
    </div>
  )
}
