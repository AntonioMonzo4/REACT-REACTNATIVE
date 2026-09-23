# Unidad 04 — Autenticación en APIs

## Comparativa de mecanismos

| Método | Dónde vive | XSS | CSRF | Uso típico |
|--------|------------|-----|------|------------|
| Bearer JWT (header) | memoria / storage | expuesto si roban storage | bajo | SPA + API |
| Cookie httpOnly | navegador | **protegida** | posible (mitigar) | SSR, apps misma origen |
| API Key | header | no aplica | no aplica | servidor↔servidor |
| OAuth2 / OIDC | proveedor externo | depende | flujo code+PKCE | "Entrar con Google" |

## Flujo JWT (recap M8)

1. `POST /auth/login` → access token corto + refresh.
2. Cliente envía `Authorization: Bearer`.
3. Middleware valida firma, exp, scope.
4. Refresh con rotación; revocación por lista o sesión.

## OAuth2 (roles)

| Rol | Quién |
|-----|-------|
| Resource Owner | usuario |
| Client | tu frontend/backend |
| Authorization Server | IdP (Auth0, Keycloak, Google) |
| Resource Server | tu API |

Flujo recomendado SPA: **Authorization Code + PKCE** (no Implicit).

## Reglas de oro

- Nunca JWT "secret" en el cliente; solo **público** va en JS.
- Access token **corto** (min); refresh en cookie httpOnly si es posible.
- Validar **issuer, aud, exp, nbf** y `alg` (evitar `none`).
- Rate limit en `/login`; bloquear por fuerza bruta.
- Autorización **en el servidor**: rol/permiso por recurso (`403`, no solo `401`).
- WebSockets: autenticar en upgrade.

## Checklist de implementación

- [ ] Login/logout con cookies o Bearer + refresh
- [ ] Middleware de auth en rutas protegidas
- [ ] Roles (admin/user) comprobados en backend
- [ ] CORS restringido a orígenes reales
- [ ] Errores genéricos en login (sin user enumeration)
