import './style/App.css'
import { useTheme } from './hooks/useTheme'
import { ErrorBoundary } from './components/ErrorBoundary'
import DemoPortal from './components/DemoPortal'
import DemoErrorBoundary from './components/DemoErrorBoundary'
import DemoLazy from './components/DemoLazy'
import DemoOptimizacion from './components/DemoOptimizacion'
import DemoHooksAvanzados from './components/DemoHooksAvanzados'

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  return (
    <button type="button" className="header-btn" onClick={toggleTheme}>
      Tema: {theme}
    </button>
  )
}

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Módulo 6 — React Avanzado</h1>
        <ThemeToggle />
      </header>

      <section className="demo">
        <DemoHooksAvanzados />
      </section>

      <section className="demo">
        <DemoPortal />
      </section>

      <section className="demo">
        <ErrorBoundary>
          <DemoErrorBoundary />
        </ErrorBoundary>
      </section>

      <section className="demo">
        <DemoLazy />
      </section>

      <section className="demo">
        <DemoOptimizacion />
      </section>
    </div>
  )
}

export default App
