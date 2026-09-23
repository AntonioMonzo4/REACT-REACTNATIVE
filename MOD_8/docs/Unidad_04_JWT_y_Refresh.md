# Unidad 04 — JWT y Refresh Tokens

## Objetivos

- Entender qué es un JWT y por qué se estructura en tres partes (`header.payload.signature`).
- Saber cómo viaja el token al servidor en la cabecera `Authorization: Bearer <token>`.
- Interpretar el campo `exp` y por qué la access token debe tener caducidad corta.
- Describir el flujo login → peticiones autenticadas → 401 → refresh → reintento.
- Diferenciar access token de refresh token con la tabla duración/envío/robo.
- Comparar opciones de guardado (localStorage, cookie httpOnly, memoria) y sus riesgos XSS/CORS.

## Requisitos

- Haber completado la **Unidad 03 (Axios)** o, como mínimo, manejar `fetch` con `try/catch`.
- Conocer la idea de autenticación básica del **módulo 7 (U05)**: qué es un token, por qué el cliente lo devuelve en cada petición. Sin eso, el flujo de esta unidad no tendrá ancla.

## Qué es un JWT (JSON Web Token)

Un **JWT** (JSON Web Token, pronúncialo "yot") es un estándar para transportar información de identidad entre dos partes de forma **verificable**. No es magia criptográfica: es un texto con estructura y con una firma. Su forma característica son tres bloques unidos por puntos:

```text
header.payload.signature
```

- **`header`**: metadatos, normalmente el tipo (`JWT`) y el algoritmo de firma (por ejemplo HS256). No guarda datos de usuario.
- **`payload`**: los claims o afirmaciones sobre el usuario: `sub` (quién), `exp` (cuándo caduca), roles, etc. **El payload es legible por cualquiera**: cualquiera que vea el token puede hacer base64 y leerlo. Por eso **no guardes contraseñas** ni datos sensibles ahí.
- **`signature`**: la firma calculada con el secreto del servidor sobre el header y el payload. Si alguien manipula el payload, la firma deja de cuadrar y el servidor lo detecta.

Flujo mental: el servidor **firma** con su secreto; el cliente **no** puede firmar, solo reenviar. En cada petición el servidor recalcula la firma y, si no coincide o el token está caducado, rechaza la petición.

### Cómo lo manda el cliente

El cliente no lo manda en el cuerpo: lo manda en una cabecera estándar:

```text
Authorization: Bearer <token>
```

La palabra `Bearer` + espacio + el token. "Bearer" (portador) significa: quien lo porta, lo usa. Por eso el robo del token importa tanto.

### `exp`: la caducidad

El payload incluye **`exp`** (expiration time), una marca de tiempo en la que el token deja de ser válido. Debe ser **corta**: la convención habitual es **15 min – 1 h** para la access token. Una caducidad corta limita la ventana de daño si alguien lo roba: tendrá poco tiempo para abusar de él.

## Flujo típico (login + refresh)

Este es el patrón que encontrarás en casi cualquier API con JWT. Léelo paso a paso; es texto porque en clase lo recorremos en la pizarra:

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

Desglose del recorrido:

1. **Login**: el usuario envía credenciales por `POST /login`. Si son válidas, el servidor responde con **dos** tokens: un `accessToken` (corta vida) y un `refreshToken` (larga vida, solo para renovar).
2. **Peticiones autenticadas**: mientras la access token está vigente, el cliente la adjunta en `Authorization: Bearer <accessToken>` a cada `GET/POST/PUT/DELETE` protegido. El servidor valida firma y `exp`; si todo cuadra, responde con los datos.
3. **Caducidad**: pasado el `exp`, el servidor responde **`401 Unauthorized`**. No es un error de programación: es la señal estándar de "tu access token ya no vale".
4. **Refresh**: con el `401`, el cliente llama a `POST /auth/refresh` enviando el `refreshToken`. El servidor lo valida (y suele rotarlo) y devuelve un **nuevo `accessToken`**.
5. **Reintento**: con la access token nueva, el cliente **reintenta la petición original** que había fallado. El usuario ni se entera: la UI solo ve que "al principio costó un pelín más".

> Nota de diseño: el refresh token **no** se adjunta a cada petición; solo viaja a `/refresh`. Así la mayoría de las llamadas llevan el "billete corto" y el "pase largo" casi nunca sale del cliente.

## Access + Refresh: por qué dos tokens

La pregunta clásica es "si al final los dos son tokens, ¿por qué no uno solo?". La tabla lo explica por la **duración** y el **riesgo de robo**:

| | Access | Refresh |
|---|--------|---------|
| Duración | corta | larga (días) |
| Envío | cada request | solo a `/refresh` |
| Al robarlo | poco tiempo de vida | el servidor debe poder revocar (lista negra / rotación) |

- **Access token**: es el que usas todo el rato, por eso debe morir pronto. Si lo roban, el ladrón tiene minutos, no días.
- **Refresh token**: vive mucho (días o semanas) pero casi nunca viaja; solo cuando toca renovar. Si lo roban, el servidor puede detectarlo (lista negra) o invalidarlo al rotarlo en el siguiente refresh.

Si usaras un único token de días de vida en cada petición, cada robo sería una ventana de acceso enorme. La pareja access/refresh es el compromiso entre comodidad (pocas renovaciones) y seguridad (ventana corta para el token más enviado).

## Dónde guardar el token

Una vez tienes el token, la pregunta práctica es **dónde** ponerlo en el navegador. No hay opción gratuita: cada sitio tiene un riesgo distinto.

| Ubicación | Riesgo |
|-----------|--------|
| `localStorage` | accesible por JS → XSS |
| Cookie `httpOnly` + `Secure` + `SameSite` | mejor frente a XSS; requiere CORS con `credentials` |
| Memory (estado React) | se pierde al refrescar; combina con refresh al montar |

- **`localStorage`**: es el más cómodo (sobrevive a recargas y pestañas) y el que usa la demo, pero **cualquier script inyectado (XSS)** puede leerlo con una línea. Es el clásico "fácil, pero a plena vista".
- **Cookie `httpOnly` + `Secure` + `SameSite`**: la opción más robusta frente a XSS porque el JavaScript del navegador no puede leer la cookie (`httpOnly`); `Secure` la limita a HTTPS y `SameSite` reduce el riesgo de CSRF. A cambio, el backend y el CORS deben estar configurados con `credentials: 'include'` y cabeceras `Access-Control-Allow-Credentials`.
- **Memory (estado React)**: el token vive solo en una variable/estado. Desaparece al refrescar la página, pero es inmune a XSS que lean storage. El patrón habitual es combinarlo con **refresh al montar**: al cargar la app, llamar a `/refresh` para recuperar un accessToken y quedarte con él en memoria.

### Nota: sin backend real

Si todavía no hay backend con JWT de verdad, no puedes "inventar" uno válido: el servidor es quien firma. En la demo, se usa un **"token" falso en `localStorage`** solo para practicar el patrón de UI (login, guardado, cabecera). Úsalo para aprender el flujo, no lo lleves a producción como si fuera seguridad real.

## Errores comunes

| Error | Por qué duele | Solución |
|-------|---------------|----------|
| Guardar la contraseña o datos sensibles en el payload del JWT | El payload es legible por cualquiera con base64 | Meter solo claims no sensibles (`sub`, `exp`, roles); nunca la contraseña |
| Access token de horas/días (robo = ventana enorme) | Si roban el token, abusan durante toda su vida | Access corta (15 min–1 h) + refresh con revocación/rotación |
| Olvidar `credentials: 'include'` / CORS al usar cookies | La cookie `httpOnly` no viaja o el navegador bloquea la respuesta | Backend con `Access-Control-Allow-Credentials` y origen exacto; cliente con `credentials: 'include'` |
| Confiar solo en el cliente: **la API debe verificar siempre** | Cualquiera puede tocar el JS o usar Postman sin pasar por tu UI | El servidor valida firma, `exp` y permisos en **cada** endpoint protegido |

Otros tropiezos frecuentes: mostrar un 401 genérico al usuario en vez de intentar refresh y reintento; guardar dos tokens en la misma clave y pisarse; o asumir que el payload "no se puede tocar" cuando sí es legible (solo la firma impide modificarlo sin ser detectado).

## En el ejemplo

`src/auth/token.js` (referencia: `../EJEMPLO_REACT_API/`) — set/get/remove de un token simulado en `localStorage`.

Es la capa mínima de "dónde guardo el token": funciones como `setToken`, `getToken` y `removeToken` que el resto de la app (interceptor de Axios, página de login) usan sin acoplarse a la cadena exacta de claves. Cuando tengas backend real, esas funciones son las que tocarás para pasar de token falso a JWT de verdad.

## Conceptos clave

- **JWT**: token con estructura `header.payload.signature`, **firmado con el secreto del servidor**.
- **Payload legible**: se lee con base64 → **no guardes contraseñas** ni secretos; el servidor valida la **firma**.
- **`Authorization: Bearer <token>`**: cabecera estándar con la que el cliente envía el JWT en cada petición.
- **`exp`**: caducidad del token; la access token debe ser **corta** (15 min–1 h).
- **Flujo login/refresh**: `POST /login` → `accessToken`+`refreshToken`; peticiones con Bearer; **401** al expirar → `POST /refresh` → nuevo access → **reintentar** la original.
- **Access vs refresh**: access = corta, se envía siempre, robo de poca ventana; refresh = larga, solo a `/refresh`, el servidor debe poder revocarla/rotarla.
- **Dónde guardar**: `localStorage` → XSS; cookie `httpOnly`+`Secure`+`SameSite` → mejor contra XSS pero exige CORS con credentials; memoria → se pierde al refrescar, combinar con refresh al montar.
- **Sin backend real**: la demo usa un token **falso** en `localStorage` solo para el patrón de UI.
- **Errores comunes**: password en el payload, access de días, olvidar `credentials`/CORS, confiar solo en el cliente.
- **Ejemplo**: `src/auth/token.js` de `../EJEMPLO_REACT_API/`.

## Autoevaluación

**1. ¿Por qué el payload de un JWT no debe contener la contraseña, aunque esté "codificado"?**

<details><summary>Respuesta</summary>

Porque el payload solo va en base64: cualquiera con el token puede leerlo. La firma impide *modificar* el contenido sin ser detectado, pero no ocultarlo. Por eso solo se guardan claims no sensibles (`sub`, `exp`, roles) y la contraseña jamás viaja en el JWT.

</details>

**2. ¿Qué hago cuando una petición autenticada devuelve 401 por token caducado?**

<details><summary>Respuesta</summary>

Enviar el `refreshToken` a `POST /auth/refresh`, recibir un `accessToken` nuevo, guardarlo y **reintentar la petición original** que había fallado. El 401 es la señal estándar de "access expirada", no un error definitivo.

</details>

**3. ¿Por qué la access token debe durar poco y el refresh token más, en lugar de un solo token de días?**

<details><summary>Respuesta</summary>

La access viaja en casi todas las peticiones, así que si la roban, una duración larga daría una ventana enorme de abuso. Con caducidad corta (15 min–1 h) el daño potencial se limita. La refresh, de días, casi no viaja (solo a `/refresh`) y el servidor puede revocarla o rotarla si detecta robo.

</details>

**4. Comparando localStorage y cookie httpOnly, ¿cuál prefieres y qué sacrificas?**

<details><summary>Respuesta</summary>

La cookie `httpOnly` + `Secure` + `SameSite` es mejor frente a XSS porque el JS no puede leerla; a cambio exige configurar CORS con `credentials: 'include'` en cliente y `Access-Control-Allow-Credentials` en el servidor. `localStorage` es más simple pero cualquier script inyectado puede robarlo; la opción en memoria es la más segura contra XSS pero se pierde al refrescar, por eso se combina con refresh al montar.

</details>
