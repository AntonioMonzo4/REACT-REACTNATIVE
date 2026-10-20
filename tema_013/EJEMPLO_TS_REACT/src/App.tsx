import { useEffect, useReducer, useState } from 'react'
import './style/App.css'
import { UsuarioCard } from './components/UsuarioCard'
import { Formulario } from './components/Formulario'
import { CampoTexto } from './components/CampoTexto'
import { EstadoCarga, type EstadoCarga as Estado } from './components/EstadoCarga'
import { useLocalStorage } from './hooks/useLocalStorage'
import { contadorReducer } from './state/contador'
import { OPES, type Ope } from './lib/tema'
import type { Usuario } from './types'

function App() {
  const [usuarios, setUsuarios] = useLocalStorage<Usuario[]>('m14_usuarios', [])
  const [busca, setBusca] = useState('')
  const [ope, setOpe] = useState<Ope>('sumar')
  const [state, dispatch] = useReducer(contadorReducer, { count: 0 })
  const [carga, setCarga] = useState<Estado<string[]>>({ status: 'idle' })

  useEffect(() => {
    if (busca.length < 2) return
    let cancelado = false
    const t = setTimeout(() => {
      if (cancelado) return
      try {
        const filtrados = usuarios
          .filter((u) => u.nombre.toLowerCase().includes(busca.toLowerCase()))
          .map((u) => u.nombre)
        setCarga({ status: 'ok', datos: filtrados })
      } catch (e) {
        setCarga({
          status: 'error',
          mensaje: e instanceof Error ? e.message : 'Error desconocido',
        })
      }
    }, 300)
    return () => {
      cancelado = true
      clearTimeout(t)
    }
  }, [busca, usuarios])

  const onBusca = (v: string) => {
    setBusca(v)
    setCarga(v.length < 2 ? { status: 'idle' } : { status: 'loading' })
  }

  const saludar = (id: string) => {
    // type guard de ejemplo
    const u = usuarios.find((x) => x.id === id)
    if (u && typeof u.email === 'string' && u.email.length > 0) {
      alert(`Hola ${u.nombre} <${u.email}>`)
    }
  }

  return (
    <div className="app">
      <h1>M14 · TypeScript + React</h1>

      <section className="card">
        <h2>Alta + lista (props tipadas)</h2>
        <Formulario onAlta={(u) => setUsuarios((prev) => [...prev, u])} />
        <CampoTexto
          label="Filtrar (≥2 letras):"
          value={busca}
          onChange={(e) => onBusca(e.target.value)}
          placeholder="ana…"
        />
        <EstadoCarga
          estado={carga}
          renderDato={(nombres) => (
            <ul className="list">
              {nombres.length === 0 ? (
                <li className="muted">Sin coincidencias</li>
              ) : (
                nombres.map((n) => <li key={n}>{n}</li>)
              )}
            </ul>
          )}
        />
        <div className="row">
          {usuarios.map((u) => (
            <UsuarioCard key={u.id} usuario={u} destacado={u.email.endsWith('.dev')} onSaludar={saludar} />
          ))}
        </div>
      </section>

      <section className="card">
        <h2>Reducer tipado + generics</h2>
        <div className="row">
          <button type="button" onClick={() => dispatch({ type: 'inc' })}>
            +
          </button>
          <button type="button" onClick={() => dispatch({ type: 'dec' })}>
            −
          </button>
          <button type="button" onClick={() => dispatch({ type: 'add', payload: 5 })}>
            +5
          </button>
          <button type="button" className="secondary" onClick={() => dispatch({ type: 'reset' })}>
            reset
          </button>
          <span className="badge">{state.count}</span>
        </div>
        <label>
          Operación:{' '}
          <select value={ope} onChange={(e) => setOpe(e.target.value as Ope)}>
            {OPES.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </label>
        <p className="muted">
          <code>as const</code> en OPES → {OPES.join(' | ')} · elegido: {ope}
        </p>
      </section>
    </div>
  )
}

export default App
