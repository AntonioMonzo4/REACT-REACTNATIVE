import { NavLink, Route, Routes, Link } from 'react-router-dom'
import './style/App.css'
import Posts from './pages/Posts.jsx'
import PostDetail from './pages/PostDetail.jsx'
import CrearPost from './pages/CrearPost.jsx'
import DemoAxios from './components/DemoAxios.jsx'
import DemoStorage from './components/DemoStorage.jsx'
import DemoToken from './components/DemoToken.jsx'

function Inicio() {
  return (
    <section className="card">
      <h2>Módulo 8 — Consumo de APIs</h2>
      <p className="muted">
        Demos contra JSONPlaceholder: fetch, axios, storage y token simulado.
        El detalle de posts usa <Link to="/posts">rutas con params</Link>.
      </p>
      <DemoToken />
      <DemoStorage />
      <DemoAxios />
    </section>
  )
}

function App() {
  return (
    <div className="app">
      <header className="topbar">
        <span className="brand">M8 · APIs</span>
        <nav className="nav">
          <NavLink to="/" end>
            Inicio
          </NavLink>
          <NavLink to="/posts">Posts</NavLink>
          <NavLink to="/crear">Crear</NavLink>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/posts/:postId" element={<PostDetail />} />
        <Route path="/crear" element={<CrearPost />} />
        <Route path="*" element={<p className="muted">404</p>} />
      </Routes>
    </div>
  )
}

export default App
