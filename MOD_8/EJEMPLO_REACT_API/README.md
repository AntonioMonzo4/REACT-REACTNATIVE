# Ejemplo Consumo de APIs — Módulo 8

Proyecto de práctica del **Módulo 8 (Consumo de APIs)**. Vite + React + axios + react-router.

Usa la API pública [JSONPlaceholder](https://jsonplaceholder.typicode.com) (sin backend propio).

## Comandos

```bash
pnpm install
pnpm dev
pnpm lint
pnpm build
```

## Qué demuestra cada archivo

| Archivo | Concepto |
|---------|----------|
| `src/api/client.js` | Instancia axios con `baseURL` + interceptor de token |
| `src/hooks/useFetch.js` | GET con loading, error y cancelación |
| `src/pages/Posts.jsx` | GET lista + enlaces a detalle |
| `src/pages/PostDetail.jsx` | GET por `:postId` (`useParams`) |
| `src/pages/CrearPost.jsx` | POST con JSON desde un form |
| `src/components/DemoAxios.jsx` | params, `err.response.status` |
| `src/components/DemoStorage.jsx` | localStorage (tema) + sessionStorage (borrador) |
| `src/auth/token.js` | token simulado en localStorage (patrón JWT) |

## Temario Módulo 8 — estado

- [x] HTTP / REST
- [x] Fetch
- [x] Axios
- [x] JWT / Refresh (teoría + token simulado)
- [x] Cookies / LocalStorage / SessionStorage
- [ ] Proyecto Frontend conectado a una API propia
