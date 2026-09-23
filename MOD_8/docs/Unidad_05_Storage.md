# Unidad 05 — Cookies, LocalStorage y SessionStorage

## Objetivos

- Distinguir `localStorage`, `sessionStorage` y cookies: cuándo vive cada uno, tamaño y quién lo lee.
- Guardar y leer datos con `localStorage` (`setItem` / `getItem` / `removeItem`) serializando objetos con `JSON`.
- Explicar los atributos de cookie `httpOnly`, `Secure` y `SameSite` y qué riesgo mitiga cada uno (XSS / CSRF).
- Elegir dónde va cada dato: token de sesión, tema, borrador de formulario y datos sensibles.
- Reconocer los errores típicos: tratar el storage como base de seguridad, olvidar `JSON.parse` y guardar datos obsoletos del servidor.

## Requisitos

- Haber leído la Unidad 04 (JWT y Refresh Tokens): sabes por qué existe la discusión "¿dónde guardo el token?".
- JS básico: `string`, `JSON.stringify` / `JSON.parse`, `try` / `catch`.
- Conviene tener a mano el ejemplo `../EJEMPLO_REACT_API/src/components/DemoStorage.jsx`.

---

## Qué es el almacenamiento del navegador

El navegador ofrece "cajas" donde la web puede guardar pares clave–valor que sobreviven a una recarga. Hay tres:

1. **`localStorage`** — vive hasta que la app o el usuario lo borre.
2. **`sessionStorage`** — vive mientras la pestaña esté abierta.
3. **Cookies** — se envían solas al servidor en cada petición a su dominio.

**Por qué importa:** una SPA que no quiere pedir login en cada recarga necesita recordar algo (un token, el tema elegido). Ese "algo" se guarda aquí. Elegir mal significa o bien perder la sesión al refrescar, o bien exponerla a scripts maliciosos.

## Comparativa

| | `localStorage` | `sessionStorage` | Cookie |
|---|----------------|------------------|--------|
| Vive hasta | borrarlo / sin caducidad | cerrar la pestaña | `Max-Age`/`Expires` |
| Tamaño | ~5 MB | ~5 MB | ~4 KB |
| Envío automático al servidor | no | no | sí (si `Domain`/`Path` coinciden) |
| Accesible desde JS | sí | sí | sí (salvo `httpOnly`) |
| Para auth | token en cliente | token temporal | `httpOnly` recomendado |

**Cómo leer la tabla:** solo la cookie viaja sola al servidor; por eso el servidor puede usarla para saber quién eres sin que tú montes cabeceras a mano. Pero si la cookie es legible por JS (sin `httpOnly`), cualquier script inyectado (XSS) la roba. `localStorage` no viaja: tienes que pegarlo tú en `Authorization`… y también lo puede leer cualquier script.

## Usar localStorage / sessionStorage

```js
localStorage.setItem('tema', 'dark')
const tema = localStorage.getItem('tema')   // string o null
localStorage.removeItem('tema')

sessionStorage.setItem('borrador', texto)   // muere al cerrar pestaña
```

Todo se guarda como **string**: para objetos usa `JSON.stringify` al guardar y `JSON.parse` al leer, con `try`/`catch` por si el valor está corrupto.

```js
try {
  localStorage.setItem('prefs', JSON.stringify({ lang: 'es', dense: true }))
  const prefs = JSON.parse(localStorage.getItem('prefs'))
} catch {
  // valor ilegible → usar defaults
}
```

## Cookies breves

```js
document.cookie = 'tema=dark; path=/; max-age=31536000; SameSite=Lax'
```

- **`httpOnly`**: JS no la lee → mitiga **XSS** para la sesión (solo el servidor la ve).
- **`Secure`**: solo viaja por HTTPS.
- **`SameSite=Lax|Strict`**: mitiga **CSRF** (no se envía en peticiones cross-site sospechosas).

`httpOnly` no se puede poner desde `document.cookie`: lo configura el servidor al enviar la cookie.

## Qué guardar dónde

| Dato | Sitio |
|------|-------|
| Token de sesión | cookie `httpOnly` (ideal) o storage si es demo |
| Tema, idioma, onboarding | `localStorage` |
| Borrador de un formulario que muere al salir | `sessionStorage` |
| Datos sensibles (passwords, tarjetas) | **nunca** en el cliente |

## Errores comunes

- **Confiar en el storage como base de seguridad**: cualquier script puede leerlo; la seguridad real la da el servidor.
- **Olvidar `JSON.parse`** → te llega un string y `prefs.lang` es `undefined`.
- **Guardar objetos enteros del servidor** que cambian y quedan obsoletos en el cliente.

## Conceptos clave

- `localStorage` / `sessionStorage`: pares clave–valor como **string**, ~5 MB, legibles por JS.
- `sessionStorage` muere al cerrar la pestaña; `localStorage` no.
- Las cookies se envían solas al servidor; `httpOnly` las oculta a JS (XSS), `SameSite` (CSRF), `Secure` (HTTPS).
- Token de sesión ideal: cookie `httpOnly`; tema/idioma: `localStorage`; borrador temporal: `sessionStorage`.
- Nunca guardes passwords ni datos de tarjeta en el cliente.

## Autoevaluación

1. ¿Qué storage eliges para el tema claro/oscuro y por qué?
   <details><summary>Respuesta</summary>
   `localStorage`: debe sobrevivir a cerrar la pestaña y no viaja al servidor.
   </details>

2. ¿Por qué `httpOnly` mitiga el robo de token por XSS?
   <details><summary>Respuesta</summary>
   Porque `document.cookie` y cualquier script no pueden leerlo; solo el navegador lo envía al servidor.
   </details>

3. ¿Qué pasa si haces `JSON.parse(localStorage.getItem('prefs'))` y el valor es `"hola"`?
   <details><summary>Respuesta</summary>
   Lanza excepción (`SyntaxError`); envuélvelo en `try`/`catch` y usa defaults.
   </details>

4. ¿Cuál es la diferencia práctica entre `localStorage` y `sessionStorage`?
   <details><summary>Respuesta</summary>
   `localStorage` vive hasta que se borre; `sessionStorage` muere al cerrar la pestaña.
   </details>
