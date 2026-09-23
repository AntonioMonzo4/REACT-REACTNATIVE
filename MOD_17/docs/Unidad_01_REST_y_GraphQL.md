# Unidad 01 — REST y GraphQL

## REST (recap + diseño)

- Recursos en URLs (`/posts`, `/posts/1`), verbos HTTP (`GET/POST/PUT/PATCH/DELETE`).
- **Idempotencia**: `PUT/DELETE` idempotentes; `POST` no.
- Estados útiles: `200/201/204/400/401/403/404/409/422/500`.
- HATEOAS ligero: links en respuestas (`"links": { "self": ..., "next": ... }`).
- Versionado: `/api/v1/...` o header.

### Diseño (guía rápida)

```text
GET    /api/posts           lista + filtros (?page=, ?q=)
GET    /api/posts/:id       detalle
POST   /api/posts           crea (201 + Location)
PUT    /api/posts/:id       reemplaza
PATCH  /api/posts/:id       actualiza parcial
DELETE /api/posts/:id       borra (204)
```

Errores con cuerpo consistente:

```json
{ "error": { "code": "VALIDATION_ERROR", "message": "...", "fields": { "title": "requerido" } } }
```

## GraphQL

- **Endpoint único** (`POST /graphql`), lenguaje de consultas.
- Cliente pide exactamente los campos que necesita → menos over/under-fetching.

```graphql
query {
  post(id: "1") {
    title
    author { name }
    comments(first: 5) { body }
  }
}
```

| | REST | GraphQL |
|---|------|---------|
| Caché HTTP | natural | compleja |
| Over-fetch | habitual | evitado |
| Mutaciones | verbos HTTP | schema de Mutation |
| Curva | baja | schema + resolvers |
| Realtime | SSE/polling | Subscriptions |

### Errores comunes

- Exponer GraphQL sin límites de profundidad/costo (DoS).
- N+1 en resolvers → **DataLoader**.
- Mutaciones no autorizadas por rol.

## En la práctica

- REST para CRUD simple y caché CDN.
- GraphQL cuando muchos clientes/consumidores necesitan shapes distintos.
