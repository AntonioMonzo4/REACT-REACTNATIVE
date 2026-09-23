import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './style/App.css'
import Layout from './components/Layout.jsx'
import RequireAuth from './components/RequireAuth.jsx'
import Home from './pages/Home.jsx'
import Users from './pages/Users.jsx'
import UserDetail from './pages/UserDetail.jsx'
import Search from './pages/Search.jsx'
import Dashboard from './pages/Dashboard.jsx'
import DashboardResumen from './pages/DashboardResumen.jsx'
import DashboardAjustes from './pages/DashboardAjustes.jsx'
import Login from './pages/Login.jsx'
import NotFound from './pages/NotFound.jsx'

const Reporte = lazy(() => import('./pages/Reporte.jsx'))

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="usuarios" element={<Users />} />
          <Route path="usuarios/:userId" element={<UserDetail />} />
          <Route path="buscar" element={<Search />} />

          <Route path="dashboard" element={<Dashboard />}>
            <Route index element={<DashboardResumen />} />
            <Route path="resumen" element={<DashboardResumen />} />
            <Route path="ajustes" element={<DashboardAjustes />} />
          </Route>

          <Route path="login" element={<Login />} />

          <Route
            path="informe"
            element={
              <RequireAuth>
                <Suspense fallback={<p className="muted">Cargando informe…</p>}>
                  <Reporte />
                </Suspense>
              </RequireAuth>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
