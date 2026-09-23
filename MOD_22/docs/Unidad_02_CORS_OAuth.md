# Unidad 02 — CORS y OAuth

## Objetivos

Al terminar esta unidad serás capaz de:

- Explicar qué problema resuelve CORS y por qué **no** es una feature de seguridad de tu API.
- Leer un error de CORS en DevTools y saber qué header falta o qué origin está mal.
- Entender qué es un *preflight* `OPTIONS` y qué lo dispara.
- Configurar mentalmente una allowlist correcta de orígenes (y saber por qué `*` con credenciales está prohibido).
- Describir el flujo **Authorization Code + PKCE** de OAuth 2.0 / OIDC y por qué es el estándar para SPAs.
- Saber qué va en el access token, qué va en el refresh token y dónde vive cada uno.

## Requisitos

- Haber leído la Unidad 01 (XSS/CSRF): aquí se asume que entiendes cookies, sesiones y el concepto de "origen".
- Saber hacer un `fetch` y ver la pestaña **Network** de DevTools.
- Tener presente que hay un backend (Node, FastAPI...) que es quien **responde** con los headers CORS: tú como frontend no puedes arreglar CORS solo modificando el cliente.
- Conocimientos de OAuth previos **no** son necesarios: el flujo se explica paso a paso desde cero.

---

## La analogía del portero

Antes de tocar código, coloca la idea:

- **Same-origin policy** es la regla de la casa: el navegador dice que la pestaña de `mi-app.com` solo puede leer respuestas de `mi-app.com`.
- **CORS** (*Cross-Origin Resource Sharing*) es el **permiso del servidor** de *otro* sitio: cuando `api.tu-empresa.com` quiere dejar que `mi-app.com` le lea datos, lo anuncia con cabeceras `Access-Control-Allow-*`.

Esto es fundamental entenderlo al revés de como suele percibirse: **CORS no protege tu API, protege al usuario de su navegador**. El navegador necesita saber si el *dueño del recurso* autoriza la lectura desde otro origen. Si alguien llama a tu API con `curl` o desde un script, CORS no le afecta: tu API debe seguir validando autenticación y autorización en el servidor pase lo que pase.

```
Navegador (reglas)  →  ¿El servidor da permiso CORS?  →  Sí: JS puede leer la respuesta
                                    │
                                    └─ No: JS NO puede leerla (aunque la respuesta haya llegado)
```

Un detalle que confunde a todo el mundo: **el navegador a veces muestra la petición como fallida aunque el servidor la haya procesado bien**. La respuesta llega, pero el navegador se niega a entregarla al JavaScript del cliente. Por eso una API "rota" en CORS puede estar ejecutando INSERTs perfectamente mientras tú ves rojo en la consola.

---

## CORS

- El navegador **impone** same-origin; CORS es el **permiso del servidor** (`Access-Control-Allow-*`).
- Preflight `OPTIONS` para métodos no simples y headers custom.

### Preflight: la pregunta antes de la pregunta

Cuando la petición es "común" (GET/POST con headers típicos, sin credenciales raras), el navegador simplemente la envía y añade los headers CORS a la respuesta.

Pero cuando la petición es "peligrosa" —por ejemplo, un `PUT`, un `DELETE`, un `Content-Type: application/json`, o un header propio como `Authorization: Bearer ...`—, el navegador **no la lanza a ciegas**. Primero hace una pregunta previa:

> «Oye servidor, ¿aceptas peticiones de `https://tu-app.com` con método `DELETE` y header `Authorization`?»

Esa pregunta es una petición **`OPTIONS`** (el *preflight*). Si la respuesta del servidor no autoriza explícitamente ese origen/método/header, **la petición real ni siquiera se envía**. Por eso a veces ves en Network un `OPTIONS` rojo seguido de... nada.

```
1.  OPTIONS /api/reauses/1   (preflight)
2.  ← 200 con Access-Control-Allow-*
3.  DELETE /api/reauses/1     (la real)
4.  ← respuesta
```

### Cabeceras típicas

```http
Access-Control-Allow-Origin: https://tu-app.com
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET, POST, DELETE
```

- `Allow-Origin`: **qué origen** puede leer la respuesta. Puede ser uno concreto o `*`.
- `Allow-Credentials`: si vale `true`, se permiten cookies/credenciales del navegador en la petición cross-site. Atención: obliga a que `Allow-Origin` sea un origen concreto.
- `Allow-Methods` / `Allow-Headers`: qué métodos y headers acepta el preflight.

Del lado del frontend, si necesitas enviar credenciales lo indicas en el `fetch`:

```js
fetch('https://api.tu-app.com/datos', {
  credentials: 'include', // o 'same-origin' si todo es del mismo origen
});
```

### Tabla de errores típicos

| Error típico | Causa |
|--------------|-------|
| Blocked by CORS | falta header u origen mal escrito |
| `Allow-Origin: *` con cookies | inválido — origina concreto |
| Funciona en Postman, falla en browser | Postman no aplica CORS |

Profundicemos en cada fila, porque cubren el 90 % de los problemas reales:

**«Blocked by CORS» / "The value of the 'Access-Control-Allow-Origin' header..."**  
El navegador envió (o hizo preflight) y la respuesta no incluye `Access-Control-Allow-Origin`, o incluye un origen que no coincide con el de tu página (un espacio de más, `http` vs `https`, un dominio con/sin `www`...). Arreglo: en el **servidor**, añadir/reflejar el header correcto.

**`Allow-Origin: *` junto a `Allow-Credentials: true`**  
La especificación lo prohíbe: no puedes decir "todos los orígenes" y a la vez "sí, puede ir con cookies". El navegador rechaza la respuesta. Arreglo: reflejar el origen exacto de la allowlist.

**«Funciona en Postman/insomnia, falla en el navegador»**  
Postman es una aplicación de escritorio: **no aplica la same-origin policy**, así que nunca verás errores CORS ahí. Si algo funciona en Postman pero no en el navegador, CORS es el primer sospechoso (o algún header que solo envía el navegador).

### Reglas

- **Nunca** `*` con credenciales.
- No confiar en CORS como seguridad de API: seguir validando authz en el server.
- Backend debe reflejar el origen exacto de la allowlist.

Ampliemos las tres, porque son las que más se olvidan:

1. **Nunca `*` con credenciales.** Es ilegal según la spec y el navegador lo ignora. Pero además, aunque "funcionara", estarías diciendo que cualquier web del mundo puede llamar a tu API *con las cookies de tus usuarios*. Eso sería CSRF con permiso oficial.

2. **CORS ≠ seguridad de API.** CORS solo decide si el *JavaScript de un navegador* puede leer la respuesta. Un atacante con `curl` o con su propio backend no pasa por el navegador: puede mandar cualquier petición. Si tu API no valida tokens, sesiones y permisos, está abierta aunque CORS esté "perfecto". Piensa en CORS como el permiso de fotos del vecindario: sirve para que los vecinos legítimos sepan qué pueden ver, no como cerradura de tu casa.

3. **Refleja el origen exacto de la allowlist.** En vez de devolver `*` o el origen que te llegue sin comprobar, ten una lista (`https://tu-app.com`, `https://admin.tu-app.com`...) y, si el `Origin` de la petición está en ella, devuélvelo explícito. Si no está, no devuelvas el header (el navegador bloqueará). Nunca reflejes a ciegas cualquier `Origin` que te manden: estarías abriendo la puerta a cualquiera.

```js
// Ejemplo conceptual en el servidor (Node/Express)
const allowlist = new Set(['https://tu-app.com', 'https://admin.tu-app.com']);

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowlist.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Vary', 'Origin'); // importante para cachés
  }
  next();
});
```

---

## OAuth 2.0 / OIDC

OAuth 2.0 es un protocolo para **delegar acceso** sin compartir contraseñas: le dices a un proveedor (Google, Auth0, tu IdP de empresa) que tu app necesita ciertos permisos, y él se encarga de comprobar la identidad. **OIDC** (OpenID Connect) es la capa estándar encima que añade identidad (quién es el usuario) de forma normalizada: por eso casi siempre van juntos.

- Flujo **Authorization Code + PKCE** para SPAs y apps móviles.
- Access token corto; refresh token rotativo en cookie httpOnly (si es posible).
- Scopes mínimos (`openid profile email`).
- **No** usar password grant o client secret embebido en el bundle del front.

### Por qué Authorization Code + PKCE

Históricamente hubo muchos flujos OAuth. Para una SPA (JavaScript que vive en el navegador) los recomendados/hoy son *Authorization Code + PKCE*; el viejo *Implicit* está obsoleto y el *Resource Owner Password* (password grant) está prohibido para clientes públicos.

**PKCE** (*Proof Key for Code Exchange*) resuelve un problema concreto: en el navegador, cualquier script podría interceptar o suplantar el **código de autorización** intercambiándolo por tokens. PKCE añade dos valores:

- `code_verifier`: un secreto aleatorio generado por tu app al empezar.
- `code_challenge = BASE64URL(SHA256(code_verifier))`: su huella, que envías en el primer paso.

El servidor de tokens guarda el challenge. Cuando tu app presenta el `code` junto con el `code_verifier` original, el IdP calcula la huella, comprueba que coincide y solo entonces emite los tokens. Quien haya robado el código intermedio **no tiene el verifier**, así que no puede canjearlo.

```text
App → redirige a IdP → código (+ code_verifier) → backend intercambia por tokens
```

Paso a paso, para que quede película:

1. Tu SPA genera `code_verifier` y `code_challenge`, y redirige al navegador al IdP (`/authorize` con challenge, `client_id`, `redirect_uri`, `scope`, `state`, `nonce`...).
2. El usuario se autentica **en el IdP** (tu app nunca ve su contraseña).
3. El IdP redirige de vuelta a tu `redirect_uri` con un `code` (y comprueba el `state` para evitar CSRF del propio flujo).
4. Tu **backend** intercambia `code + code_verifier` por los tokens (aquí sí, porque el `client_secret` no puede vivir en el bundle del front).
5. El backend devuelve a la SPA solo lo que necesita: access token corto en memoria y refresh en cookie httpOnly si es posible.

- Access token corto; refresh token rotativo en cookie httpOnly (si es posible).
- Scopes mínimos (`openid profile email`).

¿Por qué *access token* corto? Es el que viaja en cada petición y el que más有机会 de robo tiene: si caduca en minutos, el daño de un robo es acotado. ¿Y el *refresh*? Es el que renueva el access, vive más tiempo (días/semanas) y por eso se guarda en una cookie `HttpOnly` (invisible al JS) con rotación: cada uso emite uno nuevo y el viejo se invalida, detectando reutilizaciones.

**Scopes mínimos**: pide solo lo que uses. `openid profile email` cubre el 90 % de las apps. Pedir `offline_access` o scopes de escritura cuando solo necesitas leer el email es pedir llave maestra para abrir una puerta de matasellos.

**No** usar password grant o client secret embebido en el bundle del front:

- *Password grant* (la app recoge la contraseña del usuario y la envía al IdP) obliga a que tu JS vea la contraseña, y rompe todo lo que ganas con OIDC (MFA, bloqueos, historial...).
- El *client secret* compilado en el front **no es secreto**: cualquiera puede extraerlo del bundle con las DevTools. Los clientes SPA son *públicos*; la confidencialidad la aporta PKCE + `redirect_uri` exacto, no un secreto escondido en el código.

### Identidad de proveedor (IdP) comunes

IdPs comunes: Auth0, Keycloak, Google, Supabase, Firebase Auth.

No inventes tus propios flujos: usa una librería/SDK o el backend de tu IdP. A menos que tu negocio sea "vender autenticación", delegar en un proveedor maduro te ahorra fallos de seguridad y meses de trabajo.

---

## Errores comunes

| Error | Por qué ocurre | Arreglo |
|-------|----------------|---------|
| `Blocked by CORS` en local pero no en prod | Origin de desarrollo no está en la allowlist | Añadir `http://localhost:5173` (o el puerto de tu Vite) a la allowlist del server |
| Todo funciona con `curl`, nada en el navegador | `curl` no aplica CORS; el navegador sí | Configurar los headers CORS en el **servidor**, no "arreglarlo" en el front |
| `Allow-Origin: *` + credenciales | Prohibido por la spec; el navegador lo rechaza | Reflejar el origen exacto si está en la allowlist |
| Preflight `OPTIONS` 404/405 | El server no responde al `OPTIONS` (o un middleware lo corta) | Manejar `OPTIONS` antes de las rutas y devolver los headers permitidos |
| El `fetch` funciona sin `Authorization` pero falla con él | El header dispara preflight y el server no permite `Authorization` en `Allow-Headers` | Incluir `Authorization` en `Allow-Headers` |
| Guardar `client_secret` en `VITE_*` | Cualquiera lo lee en el bundle | Cliente público + PKCE; secreto solo en el backend |
| Flujo OAuth con `redirect_uri` comodín | El IdP lo rechaza (bien) o, peor, lo acepta y es un secuestro de código | Registrar redirect URIs exactos, uno a uno |
| Confundir CORS con autenticación | CORS solo controla lectura JS cross-origin | Authz (roles, ownership) siempre en el server |

---

## Conceptos clave

- **Same-origin policy**: política del navegador que aísla pestañas por origen (protocolo + dominio + puerto).
- **Origen (origin)**: `protocolo + host + puerto`. Cambiar cualquiera de los tres cambia de origen.
- **CORS**: mecanismo mediante el cual el servidor autoriza explícitamente a otros orígenes a leer respuestas con JS.
- **Preflight**: petición `OPTIONS` previa que el navegador hace antes de peticiones "no simples" (métodos custom, headers custom, credenciales).
- **Método simple**: `GET`, `HEAD`, `POST` (con content-types básicos); lo demás dispara preflight.
- **`Access-Control-Allow-Origin` / `-Credentials` / `-Methods` / `-Headers`**: cabeceras de permiso que decide el servidor.
- **Allowlist de orígenes**: lista cerrada de orígenes permitidos; se refleja el origen exacto, nunca a ciegas.
- **CORS no es seguridad de API**: sigue exigiendo authn/authz en el servidor; CORS solo gobierna al navegador.
- **OAuth 2.0**: protocolo de delegación de acceso sin compartir contraseñas.
- **OIDC**: capa de identidad estándar sobre OAuth («quién es el usuario»), con `id_token`.
- **Authorization Code + PKCE**: flujo recomendado para SPAs/apps públicas; `code_verifier`/`code_challenge` evitan el robo del código.
- **Access vs refresh token**: access corto y viajero; refresh largo, rotativo y protegido (cookie httpOnly).
- **Scopes**: permisos granulares y mínimos (`openid profile email`).
- **IdP**: proveedor de identidad (Auth0, Keycloak, Google, Supabase, Firebase Auth).
- **Password grant / secret embebido**: malas prácticas para clientes públicos; no se usan.

---

## Autoevaluación

**1. Tu SPA en `https://tu-app.com` hace `fetch` a `https://api.tu-app.com` y la consola dice «Blocked by CORS policy». Postman sí funciona. ¿Dónde está el fallo y quién debe arreglarlo?**

<details>
<summary>Respuesta</summary>

El fallo está en el **servidor** (o su proxy): no devuelve `Access-Control-Allow-Origin` (o lo devuelve con un origen distinto al de la página). Postman funciona porque no aplica la same-origin policy. Lo arregla el backend añadiendo el header para el origen exacto `https://tu-app.com` (allowlist); no se puede "esquivar" modificando el cliente. Recordar además que si van cookies/credenciales, no puede usarse `*`: origen concreto + `Allow-Credentials: true`.

</details>

**2. ¿Por qué `Access-Control-Allow-Origin: *` junto con `Access-Control-Allow-Credentials: true` es incorrecto?**

<details>
<summary>Respuesta</summary>

La spec de CORS lo prohíbe: con credenciales no se permite el comodín `*`, porque permitiría que **cualquier** origen hiciera peticiones adjuntando cookies de tus usuarios (prácticamente CSRF autorizado). El navegador rechazará la respuesta. Solución: reflejar solo los orígenes exactos de tu allowlist.

</details>

**3. Explica con tus palabras qué es el preflight `OPTIONS` y qué lo dispara. ¿Puede el atacante saltárselo?**

<details>
<summary>Respuesta</summary>

Es una petición previa que hace el navegador para preguntar al servidor si acepta la petición real (origen, método, headers). Se dispara con métodos no simples (`PUT`, `DELETE`...), headers custom (`Authorization`, `Content-Type: application/json`) o credenciales. **No es una barrera de seguridad que el atacante tenga que "saltarse"**: quien llama con `curl` o con su propio backend no pasa por el navegador y no hace preflight. Por eso la autorización real (token, roles) debe validarse siempre en el servidor.

</details>

**4. Describe el flujo Authorization Code + PKCE en 5 pasos y señala dónde debe vivir el `client_secret` (si existe).**

<details>
<summary>Respuesta</summary>

1. La SPA genera `code_verifier`/`code_challenge` y redirige al IdP.  
2. El usuario autentica en el IdP.  
3. El IdP redirige a `redirect_uri` con un `code` (y `state`).  
4. El **backend** canjea `code + code_verifier` por tokens.  
5. El backend entrega al front access token corto (memoria) y refresh en cookie httpOnly rotativa si es posible.  

El `client_secret` —si el cliente fuera confidencial— **nunca** va embebido en el bundle del front: se queda en el backend. En SPAs el cliente es público y la protección la dan PKCE + `redirect_uri` exacto.

</details>
