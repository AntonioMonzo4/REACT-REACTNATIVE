import { useCallback, useEffect, useState } from 'react'

export function useLocalStorage<T>(key: string, inicial: T) {
  const [valor, setValor] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw ? (JSON.parse(raw) as T) : inicial
    } catch {
      return inicial
    }
  })

  const set = useCallback(
    (v: T | ((prev: T) => T)) => {
      setValor((prev) => {
        const next = typeof v === 'function' ? (v as (p: T) => T)(prev) : v
        try {
          localStorage.setItem(key, JSON.stringify(next))
        } catch {
          /* quota */
        }
        return next
      })
    },
    [key],
  )

  useEffect(() => {
    const fn = (e: StorageEvent) => {
      if (e.key !== key) return
      try {
        if (e.newValue != null) setValor(JSON.parse(e.newValue) as T)
      } catch {
        /* ignore */
      }
    }
    window.addEventListener('storage', fn)
    return () => window.removeEventListener('storage', fn)
  }, [key])

  return [valor, set] as const
}
