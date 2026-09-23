import { useContext } from 'react'
import { ServicesCtx } from './ServicesContext.js'

export function useServices() {
  const ctx = useContext(ServicesCtx)
  if (!ctx) throw new Error('useServices fuera de ServicesProvider')
  return ctx
}
