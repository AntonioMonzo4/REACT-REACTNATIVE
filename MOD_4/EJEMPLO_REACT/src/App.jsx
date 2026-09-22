import './style/App.css'
import Navbar from './components/Navbar'
import Props from './components/Props'
import Eventos from './components/Eventos'
import ComponenteHooks from './components/ComponenteHooks'
import ComponenteUseMemo from './components/ComponenteUseMemo'
import useCounter from './hooks/CustomHooks'

function App() {
  const { count, increment, decrement } = useCounter()

  return (
    <>
      <Navbar />
      <main className="app-main">
        <section className="example">
          <Props
            title="Props"
            description="Los props son inmutables: se pasan desde el componente padre."
          />
        </section>

        <section className="example">
          <h2>Eventos</h2>
          <Eventos />
        </section>

        <section className="example">
          <ComponenteHooks />
        </section>

        <section className="example">
          <ComponenteUseMemo />
        </section>

        <section className="example">
          <h2>Custom Hook: useCounter</h2>
          <button onClick={decrement}>−</button>
          <span className="counter">{count}</span>
          <button onClick={increment}>+</button>
        </section>
      </main>
    </>
  )
}

export default App
