# Unidad 01 — HTTP y REST

## HTTP (HyperText Transfer Protocol)

- **Request**: método + URL + headers + body.
- **Response**: status + headers + body.
- Verbos: `GET` (leer), `POST` (crear), `PUT`/`PATCH` (actualizar), `DELETE` (borrar).

| Status | Significado | Ejemplo |
|--------|-------------|---------|
| 200 | OK | GET exitoso |
| 201 | Created | POST que crea recurso |
| 400 | Bad Request | payload inválido |
| 401 | No autenticado | sin token |
| 403 | Prohibido | token sin permiso |
| 404 | No existe | recurso inexistente |
| 500 | Error servidor | fallo interno |

## REST

Convención sobre HTTP:

- Recursos en la URL: `/api/productos/42` (sustantivos, plurales).
- Verbos HTTP = operaciones.
- Stateless: cada request lleva lo necesario (auth incluida).
- JSON como formato habitual de body.

```text
GET    /api/productos        → lista
GET    /api/productos/42     → uno
POST   /api/productos        → crea (body JSON)
PATCH  /api/productos/42     → actualiza parcial
DELETE /api/productos/42     → borra
```

## CORS

El navegador bloquea llamadas a otro origen salvo que el servidor responda con `Access-Control-Allow-*`. En dev, Vite puede hacer proxy:

```js
// vite.config.js
export default {
  server: { proxy: { '/api': 'http://localhost:8000' } },
}
```

## En el ejemplo

Los demos asumen una API remota pública (`jsonplaceholder.typicode.com`) para no necesitar backend propio.
