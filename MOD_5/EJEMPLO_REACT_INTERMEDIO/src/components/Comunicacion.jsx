import { useState } from 'react'

function Hijo({ count, onIncrement }) {
  return (
    <div className="demo-row">
      <span className="badge">Hijo lee count: {count}</span>
      <button type="button" onClick={onIncrement}>
        Hijo → Padre (callback)
      </button>
    </div>
  )
}

function ListaHermano({ items, selected, onSelect }) {
  return (
    <div>
      <h3>Hermano A — lista</h3>
      <div className="demo-row">
        {items.map((item) => (
          <button
            key={item}
            type="button"
            className={selected === item ? '' : 'secondary'}
            onClick={() => onSelect(item)}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  )
}

function DetalleHermano({ selected }) {
  return (
    <div>
      <h3>Hermano B — detalle</h3>
      <p>
        Selección sincronizada vía el padre:{' '}
        <span className="badge">{selected ?? 'ninguna'}</span>
      </p>
    </div>
  )
}

export default function Comunicacion() {
  const [count, setCount] = useState(0)
  const [selected, setSelected] = useState(null)
  const items = ['React', 'Vue', 'Svelte']

  return (
    <div>
      <h2>Comunicación entre componentes</h2>

      <Hijo count={count} onIncrement={() => setCount((c) => c + 1)} />

      <hr style={{ border: 'none', borderTop: '1px dashed #ccd', margin: '1rem 0' }} />

      <p className="muted">
        Estado en el ancestro común (padre) → hermanos sincronizados sin
        prop drilling innecesario.
      </p>

      <ListaHermano
        items={items}
        selected={selected}
        onSelect={setSelected}
      />
      <DetalleHermano selected={selected} />
    </div>
  )
}
