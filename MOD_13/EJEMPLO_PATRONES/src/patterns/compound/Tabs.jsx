import { createContext, useContext, useState } from 'react'

const TabsCtx = createContext(null)

export function Tabs({ children }) {
  const [activo, setActivo] = useState(null)
  return (
    <TabsCtx.Provider value={{ activo, setActivo }}>{children}</TabsCtx.Provider>
  )
}

export function Tab({ id, children }) {
  const { activo, setActivo } = useContext(TabsCtx)
  const seleccionado = activo === id
  return (
    <button
      type="button"
      role="tab"
      aria-selected={seleccionado}
      className={seleccionado ? 'tab activa' : 'tab'}
      onClick={() => setActivo(id)}
    >
      {children}
    </button>
  )
}

export function TabPanel({ id, children }) {
  const { activo } = useContext(TabsCtx)
  if (activo !== id) return null
  return <div className="panel">{children}</div>
}
