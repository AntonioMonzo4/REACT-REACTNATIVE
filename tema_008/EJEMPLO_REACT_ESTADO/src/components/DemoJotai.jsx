import { useAtom, useAtomValue } from 'jotai'
import { contadorAtom, dobleAtom } from '../jotaiDemo.js'

export default function DemoJotai() {
  const [contador, setContador] = useAtom(contadorAtom)
  const doble = useAtomValue(dobleAtom)

  return (
    <section className="card">
      <h2>Jotai</h2>
      <p className="muted">
        Átomo primitivo + átomo <strong>derivado</strong> (solo se recalcula cuando
        cambia el contador).
      </p>
      <div className="row">
        <button type="button" onClick={() => setContador((c) => c - 1)}>
          −
        </button>
        <span className="badge">contador: {contador}</span>
        <span className="badge">doble: {doble}</span>
        <button type="button" onClick={() => setContador((c) => c + 1)}>
          +
        </button>
        <button type="button" className="secondary" onClick={() => setContador(0)}>
          reset
        </button>
      </div>
    </section>
  )
}
