import { useEffect } from 'react'

export function withTrace(Component, nombre = Component.name ?? 'Componente') {
  function Wrapped(props) {
    useEffect(() => {
      console.log(`[withTrace] monta ${nombre}`, props)
      return () => console.log(`[withTrace] desmonta ${nombre}`)
    })
    return <Component {...props} />
  }
  Wrapped.displayName = `withTrace(${nombre})`
  return Wrapped
}
