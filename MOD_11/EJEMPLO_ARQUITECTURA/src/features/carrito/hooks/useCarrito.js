import { useCallback, useState } from 'react'

export function useCarrito() {
  const [lineas, setLineas] = useState([])

  const add = useCallback((producto) => {
    setLineas((prev) => {
      const existente = prev.find((l) => l.id === producto.id)
      if (existente) {
        return prev.map((l) =>
          l.id === producto.id ? { ...l, cantidad: l.cantidad + 1 } : l,
        )
      }
      return [...prev, { ...producto, cantidad: 1 }]
    })
  }, [])

  const remove = useCallback((id) => {
    setLineas((prev) => prev.filter((l) => l.id !== id))
  }, [])

  const clear = useCallback(() => setLineas([]), [])

  return { lineas, add, remove, clear }
}
