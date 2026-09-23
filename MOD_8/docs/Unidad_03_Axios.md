# Unidad 03 — Axios (y alternativas)

## Axios frente a fetch

| | `fetch` | Axios |
|---|---------|-------|
| Viene en el navegador | sí | paquete npm |
| Lanza en 4xx/5xx | no | sí (por defecto) |
| `res.data` | hay que `res.json()` | ya parseado |
| Timeouts | manual | `timeout` |
| Interceptors | no | sí |
| Upload progreso | XHR a mano | sí |

```bash
pnpm add axios
```

```js
import axios from 'axios'

const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 8000,
})

// GET
const { data } = await api.get('/posts', { params: { _limit: 5 } })

// POST
const { data: creado } = await api.post('/posts', {
  title: 'Hola',
  body: 'Mundo',
  userId: 1,
})
```

## Manejo de errores

```js
try {
  await api.get('/posts/999999')
} catch (err) {
  if (err.response) {
    // HTTP con status: err.response.status, err.response.data
  } else if (err.request) {
    // petición hecha sin respuesta (red)
  } else {
    // error al montar la petición
  }
}
```

## Interceptor (auth)

```js
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})
```

## ¿Cuándo cada uno?

- App pequeña / sin dependencias → `fetch` bien envuelto.
- Muchos endpoints, timeouts, interceptors → **axios**.
- React Query / SWR (M9+): traen cache, revalidación y retry por ti.

## En el ejemplo

Demo `DemoAxios` con `axios.get` y manejo de `err.response.status`.
