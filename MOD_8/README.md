# Módulo 8 — Consumo de APIs

Material del **Módulo 8** del roadmap (HTTP/REST, fetch, axios, auth y storage).

## Contenido

### Teoría (`docs/`)

| Unidad | Tema |
|--------|------|
| [01 — HTTP y REST](docs/Unidad_01_HTTP_y_REST.md) | Verbos, status codes, recursos, CORS |
| [02 — Fetch](docs/Unidad_02_Fetch.md) | GET/POST, `res.ok`, abortar, errores |
| [03 — Axios](docs/Unidad_03_Axios.md) | `axios.create`, interceptors, errores |
| [04 — JWT y Refresh](docs/Unidad_04_JWT_y_Refresh.md) | Access/refresh, dónde guardar el token |
| [05 — Storage](docs/Unidad_05_Storage.md) | Cookies vs local/sessionStorage |

### Práctica (`EJEMPLO_REACT_API/`)

Vite + React + axios, contra JSONPlaceholder (API pública de prueba):

- `useFetch` — GET con loading/error/cancelación
- Lista de posts y detalle con params de ruta
- Crear post con POST (form)
- Demo axios: baseURL, params, `err.response.status`
- Demo storage: tema + borrador

```bash
cd EJEMPLO_REACT_API
pnpm install
pnpm dev      # desarrollo
pnpm lint     # ESLint
pnpm build    # producción
```

## Mapa con el README

- [x] HTTP
- [x] REST
- [x] Fetch
- [x] Axios
- [x] JWT (patrón y demo de token simulado)
- [x] Refresh Tokens (teoría; sin backend real)
- [x] Cookies / LocalStorage / SessionStorage
- [ ] Proyecto: Frontend conectado a una API propia — *pendiente* (pendiente: backend)
