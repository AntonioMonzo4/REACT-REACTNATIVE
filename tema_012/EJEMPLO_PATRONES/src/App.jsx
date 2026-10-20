import { useState } from 'react'
import { Tabs, Tab, TabPanel } from './patterns/compound/Tabs.jsx'
import RenderPropsMouse from './patterns/RenderPropsMouse.jsx'
import { withTrace } from './patterns/withTrace.jsx'
import { useMouse } from './hooks/useMouse.js'
import { useDebounce } from './hooks/useDebounce.js'
import { useMediaQuery } from './hooks/useMediaQuery.js'
import { useSet } from './hooks/useSet.js'
import { useServices } from './services/useServices.js'

function ToggleInterno({ etiquetas, logger }) {
  return (
    <button
      type="button"
      onClick={() => {
        logger.info('toggle pulsado')
        etiquetas.has('avanzado')
          ? etiquetas.remove('avanzado')
          : etiquetas.add('avanzado')
      }}
    >
      Alternar etiqueta «avanzado» ({etiquetas.size} activas)
    </button>
  )
}

const Toggle = withTrace(ToggleInterno, 'Toggle')

function BadgeDemo() {
  const { logger } = useServices()
  const etiquetas = useSet(['react'])
  const [texto, setTexto] = useState('')
  const debounced = useDebounce(texto, 400)
  const esAncha = useMediaQuery('(min-width: 640px)')
  const ratonHook = useMouse()

  return (
    <div className="card">
      <h2>Hooks avanzados + DI + HOC</h2>
      <p className="muted">
        <code>useMediaQuery</code>: pantalla ancha = <strong>{String(esAncha)}</strong>{' '}
        · <code>useMouse</code> (hook): {ratonHook.x},{ratonHook.y}
      </p>
      <label>
        Debounce:{' '}
        <input value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="escribe…" />
      </label>
      <p className="muted">Valor debounced: «{debounced}»</p>
      <Toggle etiquetas={etiquetas} logger={logger} />
      <p className="muted">
        Etiquetas: {[...etiquetas.set].join(', ') || '(ninguna)'} · logger inyectado →{' '}
        <code>useServices().logger</code>
      </p>
    </div>
  )
}

export default function App() {
  return (
    <div className="app">
      <h1>M13 · Patrones avanzados</h1>

      <div className="card">
        <h2>Compound Components — Tabs</h2>
        <Tabs>
          <div className="row" role="tablist">
            <Tab id="perfil">Perfil</Tab>
            <Tab id="ajustes">Ajustes</Tab>
            <Tab id="about">Acerca</Tab>
          </div>
          <TabPanel id="perfil">Panel de perfil (estado en el padre Tabs).</TabPanel>
          <TabPanel id="ajustes">Panel de ajustes.</TabPanel>
          <TabPanel id="about">Patrón: contexto implícito entre hijos.</TabPanel>
        </Tabs>
      </div>

      <div className="card">
        <h2>Render Props vs Hook</h2>
        <p className="muted">Render props: mueve el ratón…</p>
        <RenderPropsMouse>
          {({ x, y }) => (
            <p>
              <code>children(pos)</code> → {x},{y}
            </p>
          )}
        </RenderPropsMouse>
      </div>

      <BadgeDemo />
    </div>
  )
}
