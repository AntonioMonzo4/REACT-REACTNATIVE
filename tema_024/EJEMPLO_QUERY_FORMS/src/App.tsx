import { FormularioPost } from './components/FormularioPost'
import { ListaPosts } from './components/ListaPosts'

export function App() {
  return (
    <>
      <header>
        <h1>TanStack Query + React Hook Form + Zod</h1>
        <p className="subtitulo">
          Demo del Módulo 25: caché de servidor con Query, formularios con RHF y
          validación de esquemas con Zod contra JSONPlaceholder.
        </p>
      </header>
      <FormularioPost />
      <ListaPosts />
    </>
  )
}
