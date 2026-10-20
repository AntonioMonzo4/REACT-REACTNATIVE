import { useState } from 'react'
import { LoginForm } from './components/LoginForm'
import { Dashboard } from './components/Dashboard'
import type { Usuario } from './api/auth'

export function App() {
  const [usuario, setUsuario] = useState<Usuario | null>(null)

  if (!usuario) return <LoginForm onLogin={setUsuario} />
  return <Dashboard usuario={usuario} onLogout={() => setUsuario(null)} />
}
