# Unidad 04 — Autenticación en APIs

## Objetivos

Al terminar esta unidad podrás:

- Comparar Bearer JWT, cookie httpOnly, API Key y OAuth2/OIDC (y sus riesgos XSS/CSRF).
- Recordar el flujo JWT de login/refresh/revocación del M8 y aplicarlo en tu API.
- Explicar los roles de OAuth2 y por qué una SPA debe usar Authorization Code + PKCE.
- Aplicar las reglas de oro: secretos solo en servidor, tokens cortos, validar
  `iss/aud/exp`, rate limit y autorización con `403` en el servidor.
- Completar el checklist de implementación de una autenticación mínima viable.

## Requisitos

- Haber visto el flujo JWT del M8 (login con `fetch`, guardar token, mandarlo en
  `Authorization: Bearer`).
- Entender la diferencia entre `401` (no identificado) y `403` (identificado pero
  sin permiso) de la Unidad 01.
- Conocer CORS (Unidad 02): la configuración de orígenes forma parte de la
  seguridad, no es un adorno.
- No hace falta usar nunca Auth0/Keycloak: aquí solo entendemos el papel de cada rol.

## Comparativa de mecanismos

Antes de elegir "JWT sí" o "cookie sí", mira dónde vive el credential y qué ataques
le corresponden:

| Método | Dónde vive | XSS | CSRF | Uso típico |
|--------|------------|-----|------|------------|
| Bearer JWT (header) | memoria / storage | expuesto si roban storage | bajo | SPA + API |
| Cookie httpOnly | navegador | **protegida** | posible (mitigar) | SSR, apps misma origen |
| API Key | header | no aplica | no aplica | servidor↔servidor |
| OAuth2 / OIDC | proveedor externo | depende | flujo code+PKCE | "Entrar con Google" |

Cómo leer la tabla:

- **XSS** (cross-site scripting): si un atacante inyecta JS en tu página, ¿puede
  leer el token? En `localStorage` sí; una cookie `httpOnly` no la ve el JS.
- **CSRF** (cross-site request forgery): el navegador adjunta cookies solo porque
  sí; con cookies hay que mitigar (`SameSite`, CSRF tokens). El header
  `Authorization` no se adjunta solo → CSRF casi no aplica.
- **API Key**: identifica a un **servidor**, nunca a un usuario final.

## Flujo JWT (recap M8)

Los cuatro pasos que ya usaste en el frontend, ahora vistos desde la API:

1. `POST /auth/login` → access token corto + refresh.
2. Cliente envía `Authorization: Bearer`.
3. Middleware valida firma, exp, scope.
4. Refresh con rotación; revocación por lista o sesión.

Detalle de cada paso:

1. El usuario manda credenciales; el servidor responde con un **access token**
   (minutos) y un **refresh token** (días) para no repetir login.
2. En cada petición protegida, el cliente añade
   `Authorization: Bearer <access>`.
3. El servidor comprueba **firma** (¿quién lo emitió?), **exp** (¿caducó?) y
   **scope/rol** (¿puede hacer esto?). Si falla → `401`.
4. *Rotación*: al usar un refresh, te dan otro nuevo y el viejo queda anulado
   (si roban uno, solo sirve una vez). *Revocación*: lista negra de jti o
   registro de sesión para "cerrar sesión" de verdad en el servidor.

## OAuth2 (roles)

OAuth2 no es "hacer login": es un protocolo de **autorización delegada** para que
un tercero acceda a recursos en nombre de un usuario. Sus cuatro papeles:

| Rol | Quién |
|-----|-------|
| Resource Owner | usuario |
| Client | tu frontend/backend |
| Authorization Server | IdP (Auth0, Keycloak, Google) |
| Resource Server | tu API |

Traducción al día a día: el **usuario** (Resource Owner) dice "sí, esta app
(Client) puede leer mi email"; el **IdP** (Authorization Server, p. ej. Google)
emite el token; tu **API** (Resource Server) lo valida y da acceso.

Flujo recomendado SPA: **Authorization Code + PKCE** (no Implicit).

- **Implicit** devolvía el token en la URL (`#fragment`): visible en historial y
  logs → obsoleto para SPAs.
- **Authorization Code + PKCK** devuelve un *código* de un solo uso que se
  canjea por token con un `code_verifier`/`code_challenge` que solo tu SPA
  conoce, aunque intercepten la red.

## Reglas de oro

- Nunca JWT "secret" en el cliente; solo **público** va en JS.
  - Si tu JS conoce el secreto de firma, cualquier XSS forja tokens de admin.
    El **secreto/clave privada** vive solo en el servidor; el cliente únicamente
    transporta el token ya emitido (y quizá conoce el *clave pública* para
    verificar, que no sirve para firmar).
- Access token **corto** (min); refresh en cookie httpOnly si es posible.
  - Así, aunque roben el access (vive en memoria), caduca pronto; el refresh,
    que es el de larga vida, ni siquiera lo toca el JS.
- Validar **issuer, aud, exp, nbf** y `alg` (evitar `none`).
  - `iss`/`aud`: ¿de qué proyecto y para quién era este token?
    `exp`/`nbf`: ¿caducado o aún no válido? `alg`: rechaza tokens firmados con
    el algoritmo `none` o con algoritmos que no esperabas (ataque de confusión de
    algoritmo).
- Rate limit en `/login`; bloquear por fuerza bruta.
  - Limita intentos por IP/cuenta (p. ej. 5 fallos → bloqueo temporal) para que
    adivinar contraseñas no sea viable.
- Autorización **en el servidor**: rol/permiso por recurso (`403`, no solo `401`).
  - `401` = no sé quién eres; `403` = sé quién eres y no puedes. Esconder botones
    en el frontend no es autorización.
- WebSockets: autenticar en upgrade.
  - El `101` no vuelve a pasar por tu middleware HTTP: valida token en el
    handshake (Unidad 03, `?token=` o cookie).

## Checklist de implementación

- [ ] Login/logout con cookies o Bearer + refresh
- [ ] Middleware de auth en rutas protegidas
- [ ] Roles (admin/user) comprobados en backend
- [ ] CORS restringido a orígenes reales
- [ ] Errores genéricos en login (sin user enumeration)

Notas para marcar cada punto:

- *Sin user enumeration*: responde siempre "credenciales incorrectas" aunque no
  exista el usuario; si dices "ese email no existe", un atacante valida emails.
- *CORS restringido*: recuerda `allow_origins` concretos de la Unidad 02, no `*`.

## Conceptos clave

| Concepto | Definición corta |
|----------|------------------|
| **XSS** | Inyección de JS que roba tokens en memoria/storage |
| **CSRF** | Uso no autorizado de cookies adjuntadas por el navegador |
| **Access vs refresh** | Token corto para llamadas vs token largo para renovar sesión |
| **Rotación** | Cada uso de refresh emite uno nuevo y anula el anterior |
| **PKCE** | Protege el código de Authorization Code en SPAs públicas |
| **`iss/aud/exp/nbf`** | Claims que el servidor debe validar en cada request |
| **`401` vs `403`** | No identificado vs identificado sin permiso |
| **User enumeration** | Fuga al decir "ese usuario no existe" en el login |

## Autoevaluación

**1. ¿Por qué el "secret" de un JWT no puede estar nunca en el JavaScript del cliente?**

<details>
<summary>Respuesta</summary>

Cualquier XSS puede leer el JS del cliente y, con el secreto, **firmar** tokens
falsos (p. ej. con rol admin). El secreto/clave privada vive solo en el servidor;
en el cliente solo viaja el token ya emitido.

</details>

**2. ¿Cuándo devuelvo `401` y cuándo `403`?**

<details>
<summary>Respuesta</summary>

`401`: no hay token válido (no identificado / caducado). `403`: el token es
válido y el usuario está identificado, pero **no tiene permiso** para ese
recurso o rol. Ocultar botones en el frontend no sustituye al `403`.

</details>

**3. Mi SPA quiere "Entrar con Google". ¿Qué flujo OAuth2 elijo y cuál evito?**

<details>
<summary>Respuesta</summary>

**Authorization Code + PKCE**: devuelve un código de un solo uso canjeable por
token con un verificador que solo la SPA conoce. Evita el flujo **Implicit**,
que exponía tokens en la URL (historial, logs, referrers).

</details>

**4. Roban el localStorage de tu usuario. ¿Qué daños puede hacer y cómo los limitas?**

<details>
<summary>Respuesta</summary>

Puede usar el **access token** hasta que caduque → por eso es **corto** (minutos).
Si el refresh vive en una cookie `httpOnly`, el ladrón no lo ve desde el JS y no
puede prolongar la sesión; además puedes revocar la sesión en el servidor
(lista/jti) para invalidar todo.

</details>
