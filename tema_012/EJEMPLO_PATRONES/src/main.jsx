import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './style/index.css'
import './style/App.css'
import App from './App.jsx'
import { ServicesProvider } from './services/ServicesProvider.jsx'

const services = {
  logger: {
    info: (msg) => console.log('[logger]', msg),
    error: (msg) => console.error('[logger]', msg),
  },
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ServicesProvider services={services}>
      <App />
    </ServicesProvider>
  </StrictMode>,
)
