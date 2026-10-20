import { useRef } from 'react'
import './style/App.css'
import LeerPromise from './components/LeerPromise.jsx'
import CampoRef from './components/CampoRef.jsx'
import FormAction from './components/FormAction.jsx'
import Optimista from './components/Optimista.jsx'

function App() {
  const refExterno = useRef(null)

  return (
    <div className="app">
      <header className="topbar">
        <h1>M15 · React 19 moderno</h1>
        <button type="button" className="secondary" onClick={() => refExterno.current?.focus()}>
          Foco desde App
        </button>
      </header>

      <LeerPromise />
      <CampoRef ref={refExterno} />
      <FormAction />
      <Optimista />

      <section className="card muted">
        Server Components, App Router, ISR y React Compiler: teoría en{' '}
        <code>../docs/</code> — el proyecto Next completo se crea con{' '}
        <code>create-next-app</code> (ver README del módulo).
      </section>
    </div>
  )
}

export default App
