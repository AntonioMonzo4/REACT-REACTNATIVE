# Unidad 03 — Query Params

## Qué son

La parte `?clave=valor&...` de la URL. Sirven para **estado compartible**: filtros, búsqueda, página, orden…

```text
/buscar?q=react&page=2
```

## useSearchParams

```jsx
import { useSearchParams } from 'react-router-dom'

function Buscar() {
  const [searchParams, setSearchParams] = useSearchParams()
  const q = searchParams.get('q') ?? ''
  const page = Number(searchParams.get('page') ?? '1')

  const handleSubmit = (e) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    setSearchParams({ q: fd.get('q'), page: '1' })
  }

  const nextPage = () => setSearchParams({ q, page: String(page + 1) })

  return (
    <form onSubmit={handleSubmit}>
      <input name="q" defaultValue={q} />
      <button type="submit">Buscar</button>
      <button type="button" onClick={nextPage}>Pág. {page + 1}</button>
    </form>
  )
}
```

## API

| Acción | Código |
|--------|--------|
| Leer | `searchParams.get('q')` |
| Escribir (reemplaza todas) | `setSearchParams({ q: 'react' })` |
| Borrar una clave | `searchParams.delete('q'); setSearchParams(searchParams)` |
| Conservar el resto | Copia el objeto actual y mezcla cambios |

`setSearchParams` actualiza la URL **y** re-renderiza (como `setState`).

## Buenas prácticas

1. **La fuente de verdad es la URL**: al abrir un enlace compartido debe verse igual (no guardes filtros solo en `useState`).
2. Valores por defecto en el código (`?? '1'`), no obligatorios en la URL.
3. Historial: `setSearchParams(params, { replace: true })` para no ensuciar el botón Atrás en cada tecla.
4. `Number(...)` / validación al leer: todo llega como string.

## Params vs Query (recordatorio)

- **Params** → identifican *qué* página/recurso (`/productos/:id`).
- **Query** → cómo *ver* o *filtrar* (`?orden=precio&disp=si`).

## En el ejemplo

`src/pages/Search.jsx` — `q` y `page` en la query con formulario + botones.
