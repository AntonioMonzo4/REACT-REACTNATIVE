# Unidad 02 — CORS y OAuth

## CORS

- El navegador **impone** same-origin; CORS es el **permiso del servidor** (`Access-Control-Allow-*`).
- Preflight `OPTIONS` para métodos no simples y headers custom.

```http
Access-Control-Allow-Origin: https://tu-app.com
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET, POST, DELETE
```

| Error típico | Causa |
|--------------|-------|
| Blocked by CORS | falta header u origen mal escrito |
| `Allow-Origin: *` con cookies | inválido — origina concreto |
| Funciona en Postman, falla en browser | Postman no aplica CORS |

Reglas:

- **Nunca** `*` con credenciales.
- No confiar en CORS como seguridad de API: seguir validando authz en el server.
- Backend debe reflejar el origen exacto de la allowlist.

## OAuth 2.0 / OIDC

- Flujo **Authorization Code + PKCE** para SPAs y apps móviles.
- Access token corto; refresh token rotativo en cookie httpOnly (si es posible).
- Scopes mínimos (`openid profile email`).
- **No** usar password grant o client secret embebido en el bundle del front.

```text
App → redirige a IdP → código (+ code_verifier) → backend intercambia por tokens
```

IdPs comunes: Auth0, Keycloak, Google, Supabase, Firebase Auth.
