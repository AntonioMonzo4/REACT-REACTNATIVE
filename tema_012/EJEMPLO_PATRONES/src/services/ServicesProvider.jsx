import { useMemo } from 'react'
import { ServicesCtx } from './ServicesContext.js'

export function ServicesProvider({ services, children }) {
  const value = useMemo(() => services, [services])
  return <ServicesCtx.Provider value={value}>{children}</ServicesCtx.Provider>
}
