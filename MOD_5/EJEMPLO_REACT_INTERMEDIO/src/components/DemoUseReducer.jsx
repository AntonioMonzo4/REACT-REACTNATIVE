import { useReducer, useState } from 'react'

const initialTodos = { items: [], filter: 'all' }

function todoReducer(state, action) {
  switch (action.type) {
    case 'add': {
      const text = action.payload.trim()
      if (!text) return state
      return {
        ...state,
        items: [
          ...state.items,
          { id: crypto.randomUUID(), text, done: false },
        ],
      }
    }
    case 'toggle':
      return {
        ...state,
        items: state.items.map((t) =>
          t.id === action.payload ? { ...t, done: !t.done } : t,
        ),
      }
    case 'remove':
      return {
        ...state,
        items: state.items.filter((t) => t.id !== action.payload),
      }
    case 'clear_done':
      return { ...state, items: state.items.filter((t) => !t.done) }
    case 'set_filter':
      return { ...state, filter: action.payload }
    default:
      return state
  }
}

export default function DemoUseReducer() {
  const [state, dispatch] = useReducer(todoReducer, initialTodos)
  const [text, setText] = useState('')

  const visible = state.items.filter((t) => {
    if (state.filter === 'done') return t.done
    if (state.filter === 'active') return !t.done
    return true
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch({ type: 'add', payload: text })
    setText('')
  }

  return (
    <div>
      <h2>useReducer — Todo list</h2>
      <p className="muted">
        Estado complejo: items + filter; acciones tipadas por <code>type</code>.
      </p>

      <form className="demo-row" onSubmit={handleSubmit}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Nueva tarea"
          aria-label="Nueva tarea"
        />
        <button type="submit">Añadir</button>
      </form>

      <div className="demo-row">
        {['all', 'active', 'done'].map((f) => (
          <button
            key={f}
            type="button"
            className={state.filter === f ? '' : 'secondary'}
            onClick={() => dispatch({ type: 'set_filter', payload: f })}
          >
            {f}
          </button>
        ))}
        <button
          type="button"
          className="secondary"
          onClick={() => dispatch({ type: 'clear_done' })}
        >
          Limpiar hechas
        </button>
      </div>

      <ul className="list">
        {visible.map((t) => (
          <li key={t.id} className={t.done ? 'done' : ''}>
            <label>
              <input
                type="checkbox"
                checked={t.done}
                onChange={() => dispatch({ type: 'toggle', payload: t.id })}
              />{' '}
              {t.text}
            </label>{' '}
            <button
              type="button"
              className="secondary"
              onClick={() => dispatch({ type: 'remove', payload: t.id })}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>

      {visible.length === 0 && <p className="muted">Sin tareas en este filtro.</p>}
    </div>
  )
}
