import { memo, useCallback, useMemo, useState } from 'react'

// Hijo memorizado: solo re-renderiza si sus props cambian de referencia.
// El contador de renders sube desde el padre (prop) — sin mutar refs en render.
const ContadorRenders = memo(function ContadorRenders({
  onIncrement,
  label,
  parentTick,
}) {
  // Trabajo simulado para hacer visible el coste del render
  const checksum = useMemo(() => parentTick + label.length, [parentTick, label])

  return (
    <div className="demo-row">
      <span className="badge">
        {label} — padres vistos: {parentTick} (checksum {checksum})
      </span>
      <button type="button" onClick={onIncrement}>
        Incrementar desde hijo
      </button>
    </div>
  )
})

export default function DemoUseCallback() {
  const [count, setCount] = useState(0)
  const [unstable, setUnstable] = useState(0)
  const [parentTick, setParentTick] = useState(0)

  // Estable: deps [] → misma referencia entre renders del padre
  const increment = useCallback(() => {
    setCount((c) => c + 1)
  }, [])

  // Inestable: función nueva cada render → memo del hijo no evita re-render
  const incrementUnstable = () => {
    setUnstable((n) => n + 1)
  }

  return (
    <div>
      <h2>useCallback + React.memo</h2>
      <p className="muted">
        “Forzar render del padre”: el hijo con <strong>callback estable</strong>{' '}
        no repinta su checksum si no cambian props; el inestable sí recibe
        referencia nueva (y React.memo no filtra).
      </p>

      <div className="demo-row">
        <span className="badge">Padre count: {count}</span>
        <span className="badge">Padre unstable: {unstable}</span>
        <button
          type="button"
          className="secondary"
          onClick={() => setParentTick((n) => n + 1)}
        >
          Forzar render del padre ({parentTick})
        </button>
      </div>

      <ContadorRenders
        onIncrement={increment}
        label="callback estable"
        parentTick={parentTick}
      />
      <ContadorRenders
        onIncrement={incrementUnstable}
        label="callback inestable"
        parentTick={parentTick}
      />
      <p className="muted">
        Observa en DevTools que “callback estable” solo re-renderiza cuando sus
        props de verdad cambian; con la función inline, <code>memo</code> no
        protege.
      </p>
    </div>
  )
}
