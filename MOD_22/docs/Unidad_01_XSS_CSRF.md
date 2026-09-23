# Unidad 01 — XSS y CSRF

## XSS (Cross-Site Scripting)

| Tipo | Cómo | Defensa |
|------|------|---------|
| **Reflected** | payload en URL → respuesta | sanitizar output, CSP |
| **Stored** | guardado en BD y servido | sanitizar al guardar/leer |
| **DOM-based** | JS de la página usa input peligroso | no `innerHTML` con datos de usuario |

```jsx
// Peligroso
<div dangerouslySetInnerHTML={{ __html: commentFromUser }} />

// Seguro por defecto (React escapa texto)
<p>{commentFromUser}</p>
```

Si necesitas HTML rico: allowlist (p. ej. DOMPurify), nunca confiar en el cliente.

**CSP** (header):

```http
Content-Security-Policy: default-src 'self'; script-src 'self'; object-src 'none'
```

## CSRF (Cross-Site Request Forgery)

- El atacante hace que el navegador del usuario envíe **cookie autenticada** a tu API.

Defensas:

1. **SameSite=Lax/Strict** en cookies de sesión.
2. **CSRF token** (double submit) en forms/mutaciones cookie-based.
3. Requerir header custom (`X-Requested-With`) o fetch sin CORS simple.
4. Bearer JWT en memoria/localStorage → **no** aplica CSRF (pero sí XSS; elige el trade-off consciente).
5. Reconfirmar acciones sensibles (password actual).
