import { useEffect, useState } from 'react'

export default function RenderPropsMouse({ children }) {
  const [pos, setPos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const fn = (e) => setPos({ x: Math.round(e.clientX), y: Math.round(e.clientY) })
    window.addEventListener('pointermove', fn)
    return () => window.removeEventListener('pointermove', fn)
  }, [])

  return children(pos)
}
