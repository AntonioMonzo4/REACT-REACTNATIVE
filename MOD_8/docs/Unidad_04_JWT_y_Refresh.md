# Unidad 04 — JWT y Refresh Tokens

## JWT (JSON Web Token)

Tres partes: `header.payload.signature` (firmado con secreto del servidor).

- El cliente lo envía: `Authorization: Bearer <token>`.
- El payload es **legible** (no guardes contraseñas); el servidor valida la firma.
- `exp` define caducidad (suele ser corta: 15 min–1 h).

## Flujo típico

```text
POST /login { email, password }
← { accessToken, refreshToken }

GET /api/datos
→ Authorization: Bearer <accessToken>

401 expirado
POST /auth/refresh { refreshToken }
← { accessToken nuevo }
reintentar la petición original
```

## Access + Refresh

| | Access | Refresh |
|---|--------|---------|
| Duración | corta | larga (días) |
| Envío | cada request | solo a `/refresh` |
| Al robarlo | poco tiempo de vida | el servidor debe poder revocar (lista negra / rotación) |

## Dónde guardar el token

| Ubicación | Riesgo |
|-----------|--------|
| `localStorage` | accesible por JS → XSS |
| Cookie `httpOnly` + `Secure` + `SameSite` | mejor frente a XSS; requiere CORS con `credentials` |
| Memory (estado React) | se pierde al refrescar; combina con refresh al montar |

Sin backend real no hay JWT: la demo usa un "token" falso en `localStorage` solo para el patrón de UI.

## Errores comunes

- Guardar la contraseña o datos sensibles en el payload del JWT.
- Access token de horas/días (robo = ventana enorme).
- Olvidar `credentials: 'include'` / CORS al usar cookies.
- Confiar solo en el cliente: **la API debe verificar siempre**.

## En el ejemplo

`src/auth/token.js` — set/get/remove de un token simulado en `localStorage`.
