import { useEffect, useRef, useState } from 'react'

export default function DemoUseRef() {
  const inputRef = useRef(null)
  const clickCountRef = useRef(0)
  const boxRef = useRef(null)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const el = boxRef.current
    if (!el) return

    const observer = new ResizeObserver(([entry]) => {
      setWidth(Math.round(entry.contentRect.width))
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const focusInput = () => {
    inputRef.current?.focus()
  }

  const trackClicks = () => {
    clickCountRef.current += 1
    alert(`Clics (useRef, sin re-render): ${clickCountRef.current}`)
  }

  return (
    <div>
      <h2>useRef</h2>
      <p className="muted">
        Acceso al DOM, contador mutable y medición con ResizeObserver.
      </p>

      <div className="demo-row">
        <input ref={inputRef} placeholder="Púlsame foco…" />
        <button type="button" onClick={focusInput}>
          Focus
        </button>
        <button type="button" className="secondary" onClick={trackClicks}>
          Contar clics (ref)
        </button>
      </div>

      <div ref={boxRef} className="demo-row" style={{ background: '#e7f5ff', borderRadius: 8, padding: '0.75rem' }}>
        <span className="badge">Ancho: {width}px</span>
        <span className="muted">Redimensiona la ventana</span>
      </div>
    </div>
  )
}
