import { useCallback, useState } from 'react'

export function useSet(initial = []) {
  const [set, setSet] = useState(() => new Set(initial))

  const add = useCallback((v) => {
    setSet((prev) => {
      if (prev.has(v)) return prev
      const next = new Set(prev)
      next.add(v)
      return next
    })
  }, [])

  const remove = useCallback((v) => {
    setSet((prev) => {
      if (!prev.has(v)) return prev
      const next = new Set(prev)
      next.delete(v)
      return next
    })
  }, [])

  const has = useCallback((v) => set.has(v), [set])

  return { set, add, remove, has, size: set.size }
}
