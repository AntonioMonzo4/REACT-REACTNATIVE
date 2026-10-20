import { Button } from '../../../shared/atoms/Button.jsx'

export function SearchBar({ value, onChange }) {
  return (
    <div className="row">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar producto…"
        aria-label="Buscar producto"
      />
      <Button variant="ghost" onClick={() => onChange('')} disabled={!value}>
        Limpiar
      </Button>
    </div>
  )
}
