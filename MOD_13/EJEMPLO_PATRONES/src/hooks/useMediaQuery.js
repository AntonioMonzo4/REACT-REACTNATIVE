import { useCallback, useSyncExternalStore } from 'react'

function subscribe(query) {
  return (onStoreChange) => {
    const mq = window.matchMedia(query)
    mq.addEventListener('change', onStoreChange)
    return () => mq.removeEventListener('change', onStoreChange)
  }
}

export function useMediaQuery(query) {
  const sub = useCallback((cb) => subscribe(query)(cb), [query])

  return useSyncExternalStore(
    sub,
    () => window.matchMedia(query).matches,
    () => false,
  )
}
