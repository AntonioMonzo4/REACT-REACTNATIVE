import { useEffect, useLayoutEffect, useRef, useState } from 'react'

export default function DemoUseLayoutEffect() {
  const ref = useRef(null)
  const [layoutWidth, setLayoutWidth] = useState(0)
  const [effectWidth, setEffectWidth] = useState(0)
  const [text, setText] = useState('Medida sincrónica (useLayoutEffect)')

  useLayoutEffect(() => {
    const el = ref.current
    if (el) setLayoutWidth(el.offsetWidth)
  }, [text])

  useEffect(() => {
    const el = ref.current
    if (el) setEffectWidth(el.offsetWidth)
  }, [text])

  return (
    <div>
      <h2>useLayoutEffect</h2>
      <p className="muted">
        Ambos miden tras el render; layout corre <strong>antes</strong> del paint,
        effect después. En demo no hay flash, pero es el orden correcto para
        correcciones de layout.
      </p>

      <div className="demo-row">
        <button
          type="button"
          onClick={() =>
            setText(
              text.startsWith('Medida')
                ? 'Texto más largo para cambiar el ancho del bloque…'
                : 'Medida sincrónica (useLayoutEffect)',
            )
          }
        >
          Cambiar ancho
        </button>
      </div>

      <div
        ref={ref}
        style={{
          display: 'inline-block',
          padding: '0.75rem 1rem',
          background: '#fff3bf',
          borderRadius: 8,
          marginBottom: '0.5rem',
        }}
      >
        {text}
      </div>

      <p className="demo-row">
        <span className="badge">layout offsetWidth: {layoutWidth}px</span>
        <span className="badge">effect offsetWidth: {effectWidth}px</span>
      </p>
    </div>
  )
}
