import './style/App.css'
import Contador from './components/Contador.jsx'
import FormularioLogin from './components/FormularioLogin.jsx'

function App() {
  return (
    <div className="app">
      <h1>Módulo 10 — Testing</h1>
      <section className="card">
        <h2>Contador (probado con RTL)</h2>
        <Contador />
      </section>
      <section className="card">
        <h2>Login (probado con fetch mockeado)</h2>
        <FormularioLogin onLogin={(u) => alert(`Bienvenido ${u.email}`)} />
      </section>
      <section className="card muted">
        Ejecuta <code>pnpm test:run</code> para ver la suite.
      </section>
    </div>
  )
}

export default App
