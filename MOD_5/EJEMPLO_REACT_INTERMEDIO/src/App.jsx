import './style/App.css'
import DemoUseRef from './components/DemoUseRef'
import DemoUseReducer from './components/DemoUseReducer'
import DemoUseCallback from './components/DemoUseCallback'
import DemoUseLayoutEffect from './components/DemoUseLayoutEffect'
import FormularioValidado from './components/FormularioValidado'
import Comunicacion from './components/Comunicacion'

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Módulo 5 — React Intermedio</h1>
        <p>Demos de hooks, formularios y comunicación entre componentes.</p>
      </header>

      <section className="demo">
        <DemoUseRef />
      </section>

      <section className="demo">
        <DemoUseReducer />
      </section>

      <section className="demo">
        <DemoUseCallback />
      </section>

      <section className="demo">
        <DemoUseLayoutEffect />
      </section>

      <section className="demo">
        <FormularioValidado />
      </section>

      <section className="demo">
        <Comunicacion />
      </section>
    </div>
  )
}

export default App
