import './style/App.css'
import { useTheme } from './context/useTheme.js'
import DemoRedux from './components/DemoRedux.jsx'
import DemoZustand from './components/DemoZustand.jsx'
import DemoJotai from './components/DemoJotai.jsx'

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  return (
    <button type="button" className="secondary" onClick={toggleTheme}>
      Tema: {theme}
    </button>
  )
}

function App() {
  return (
    <div className="app">
      <header className="topbar">
        <span className="brand">M9 · Gestión de Estado</span>
        <ThemeToggle />
      </header>

      <DemoRedux />
      <DemoZustand />
      <DemoJotai />
    </div>
  )
}

export default App
