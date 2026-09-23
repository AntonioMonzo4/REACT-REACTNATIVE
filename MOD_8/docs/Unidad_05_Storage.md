# Unidad 05 — Cookies, LocalStorage y SessionStorage

## Comparativa

| | `localStorage` | `sessionStorage` | Cookie |
|---|----------------|------------------|--------|
| Vive hasta | borrarlo / sin caducidad | cerrar la pestaña | `Max-Age`/`Expires` |
| Tamaño | ~5 MB | ~5 MB | ~4 KB |
| Envío automático al servidor | no | no | sí (si `Domain`/`Path` coinciden) |
| Accesible desde JS | sí | sí | sí (salvo `httpOnly`) |
| Para auth | token en cliente | token temporal | `httpOnly` recomendado |

```js
localStorage.setItem('tema', 'dark')
const tema = localStorage.getItem('tema')   // string o null
localStorage.removeItem('tema')

sessionStorage.setItem('borrador', texto)   // muere al cerrar pestaña
```

Todo se guarda como **string**: `JSON.stringify` / `JSON.parse` con try/catch.

## Cookies breves

```js
document.cookie = 'tema=dark; path=/; max-age=31536000; SameSite=Lax'
```

- `httpOnly`: JS no la lee → mitiga XSS para la sesión.
- `Secure`: solo HTTPS.
- `SameSite=Lax|Strict`: mitiga CSRF.

## Qué guardar dónde

| Dato | Sitio |
|------|-------|
| Token de sesión | cookie httpOnly (ideal) o storage si es demo |
| Tema, idioma, onboarding | `localStorage` |
| Borrador de un formulario que muere al salir | `sessionStorage` |
| Datos sensibles (passwords, tarjetas) | **nunca** en el cliente |

## Errores comunes

- Confiar en storage como base de seguridad (cualquier script puede leerlo).
- Olvidar `JSON.parse` → llega un string.
- Guardar objetos enteros del servidor que cambian y quedan obsoletos.

## En el ejemplo

`DemoStorage` — tema en `localStorage`, contador de sesiones en `sessionStorage`.
