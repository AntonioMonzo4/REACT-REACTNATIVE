import { useState } from 'react'
import { Boton, Tarjeta } from '@miorg/ui'

export function App() {
  const [clics, setClics] = useState(0)

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: '#0f172a',
        color: '#e2e8f0',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <div style={{ display: 'grid', gap: '1rem' }}>
        <Tarjeta titulo="Monorepo funcional">
          <p>
            Esta app (<code>@miorg/web</code>) importa <code>Boton</code> y{' '}
            <code>Tarjeta</code> desde el paquete local <code>@miorg/ui</code>{' '}
            resuelto con <code>workspace:*</code>.
          </p>
        </Tarjeta>
        <Tarjeta titulo="Contador compartido">
          <p>Clics en el Boton del workspace: {clics}</p>
          <Boton onClick={() => setClics((c) => c + 1)}>Púlsame</Boton>
        </Tarjeta>
      </div>
    </main>
  )
}
