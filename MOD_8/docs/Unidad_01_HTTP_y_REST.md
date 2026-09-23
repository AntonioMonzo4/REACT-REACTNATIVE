# Unidad 01 — HTTP y REST

## Objetivos

- Entender qué es una **petición (request)** y una **respuesta (response)** de HTTP y qué partes lleva cada una.
- Conocer los **verbos** HTTP habituales (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`) y en qué se diferencian `PUT` y `PATCH`.
- Interpretar los **códigos de estado** más comunes (2xx, 4xx, 5xx) y saber qué acción tomar ante cada uno.
- Comprender qué es **REST** y por qué es una *convención* encima de HTTP, no un protocolo nuevo.
- Entender qué es **CORS**, por qué el navegador bloquea ciertas llamadas y cómo usar el **proxy de Vite** en desarrollo.

## Requisitos

- JavaScript asíncrono: `async`/`await`, promesas y `try/catch` (M2).
- Componentes funcionionales y `useEffect` (M4–M5).
- Tener completada la U01 es suficiente para esta unidad (esta misma).

## HTTP (HyperText Transfer Protocol)

### Qué es y por qué importa

HTTP es el lenguaje que usan tu navegador (y tu app de React) para hablar con un servidor. Puedes imaginarlo como **enviar una carta y recibir una respuesta por un repartidor**: tú escribes qué quieres (la *request*), el repartidor la lleva al servidor, y el servidor te devuelve un sobre con la respuesta (la *response*). Sin un protocolo común, cada web inventaría su propio idioma y nada sería interoperable.

### La request: método + URL + headers + body

Cada petición HTTP lleva al menos cuatro piezas:

- **Método**: qué quieres hacer (leer, crear, borrar…). Se indica con una palabra como `GET` o `POST`.
- **URL**: a qué recurso quieres acceder, p. ej. `https://jsonplaceholder.typicode.com/posts/1`.
- **Headers**: metadatos en formato clave/valor, p. ej. `Content-Type: application/json` o `Authorization: Bearer <token>`. Son como las etiquetas pegadas a la carta: no llevan el contenido, pero dicen cómo interpretarlo.
- **Body** (opcional): los datos que envías, típicamente un JSON. Solo lo llevan métodos como `POST`, `PUT` o `PATCH`; un `GET` normalmente no lleva body.

### La response: status + headers + body

El servidor responde con otra estructura parecida:

- **Status**: un código numérico que dice si todo fue bien (`200`) o qué salió mal (`404`). Es lo primero que debes mirar.
- **Headers**: metadatos de la respuesta, p. ej. `Content-Type: application/json`.
- **Body**: los datos que pediste (una lista de posts, un objeto, etc.), normalmente en JSON.

**Por qué importa**: en React casi todo tu código de red gira alrededor de leer el `status`, comprobar que la respuesta es buena y parsear el `body`.

### Verbos: qué operación representa cada uno

Los verbos HTTP describen la operación que quieres realizar sobre un recurso:

- `GET` — **leer**. No modifica nada. Es el más usado: pedir una lista o un detalle.
- `POST` — **crear** un recurso nuevo. Suele llevar body con los datos del recurso.
- `PUT` — **actualizar** un recurso completo: envías el objeto entero y reemplazas el que había.
- `PATCH` — **actualizar** un recurso **parcialmente**: solo envías los campos que cambian.
- `DELETE` — **borrar** un recurso.

**Diferencia clave entre `PUT` y `PATCH`**: con `PUT` envías el recurso completo (si olvidas un campo, puede quedar vacío); con `PATCH` envías solo lo que quieres modificar (`{ "precio": 19 }`) y el resto se queda igual. En la práctica, muchas APIs usan `PATCH` para editar un formulario con unos pocos campos.

## Códigos de estado (status codes)

El código de estado es el "semáforo" de la respuesta. Conviene memorizar los del 2xx (éxito), los 4xx (error del cliente: algo mal en tu petición) y el 5xx (error del servidor: falló por dentro).

| Status | Significado | Ejemplo |
|--------|-------------|---------|
| 200 | OK | `GET` exitoso: llegaron los datos |
| 201 | Created | `POST` que crea un recurso (devuelven el objeto creado) |
| 400 | Bad Request | payload inválido: JSON mal formado o campos faltantes |
| 401 | No autenticado | falta el token o expiró: "¿quién eres?" |
| 403 | Prohibido | token válido pero sin permiso: "ya sé quién eres, pero no puedes" |
| 404 | No existe | recurso inexistente, p. ej. `GET /posts/999999` |
| 500 | Error servidor | fallo interno del backend, p. ej. excepción no controlada |

Un truco para recordar la diferencia entre **401** y **403**: en `401` el servidor ni siquiera te conoce (te falta identificarte); en `403` ya te conoce, pero no tiene permiso para darte eso.

## REST

### Qué es

REST (**Representational State Transfer**) no es un protocolo ni una librería: es una **convención** (un conjunto de reglas recomendadas) para diseñar APIs *sobre* HTTP. Si HTTP es el repartidor, REST es el **manual de recetas de cocina REST**: te dice *cómo* nombrar los platos, *cómo* pedirlos y *cómo* dejar que el cocinero trabaje, sin inventar ingredientes nuevos.

### Sus ideas principales

- **Recursos en la URL con sustantivos plurales**: la URL identifica *qué* quieres, p. ej. `/api/productos/42` (el producto 42). Nunca lleva verbos: no existe `/api/crearProducto`.
- **Verbos HTTP = operaciones**: qué *haces* con el recurso lo dice el método (`GET` leer, `POST` crear…), no la URL.
- **Stateless (sin estado)**: cada petición debe llevar **toda la información necesaria** para entenderla, incluida la autenticación (token en los headers). El servidor no "recuerda" tu sesión anterior. **Por qué importa**: así cualquier servidor puede atender cualquier petición sin guardar memoria de sesiones, y escalar (añadir más servidores) es mucho más fácil.
- **JSON como formato habitual del body**: tanto lo que envías como lo que recibes suele ser JSON, que es el formato que `JSON.stringify()` y `res.json()` manejan en el navegador.

### Ejemplo de operaciones

```text
GET    /api/productos        → lista
GET    /api/productos/42     → uno
POST   /api/productos        → crea (body JSON)
PATCH  /api/productos/42     → actualiza parcial
DELETE /api/productos/42     → borra
```

Fíjate en el patrón: la URL solo cambia cuando cambia el **recurso**; la operación la define el **verbo**.

## CORS

### Qué bloquea el navegador

El navegador aplica la **política de mismo origen** (*same-origin policy*): por defecto, una web en `http://localhost:5173` **no puede leer** respuestas de otra origen como `http://localhost:8000` o `https://otra-api.com`. Si tu app de React y tu backend están en orígenes distintos, el navegador deja pasar la petición pero **bloquea la respuesta** en el código JS y verás un error de CORS en consola.

### Cómo lo autoriza el servidor

El servidor debe responder con cabeceras `Access-Control-Allow-*`, por ejemplo:

- `Access-Control-Allow-Origin: https://tu-app.com` (o `*`): qué orígenes pueden leer la respuesta.
- `Access-Control-Allow-Methods: GET, POST, PATCH, DELETE`: qué verbos están permitidos.
- `Access-Control-Allow-Headers: Content-Type, Authorization`: qué headers puedes enviar.

**Importante**: CORS lo controla el **servidor**, no tu código React. No "arreglas" CORS editando tu componente.

### Proxy en Vite (recomendado en desarrollo)

La solución más cómoda en desarrollo es que **Vite actúe de intermediario** (proxy): tu app llama a `/api/...` en su mismo origen y Vite reenvía la petición al backend real. El navegador solo ve un origen, así que no hay error de CORS.

```js
// vite.config.js
export default {
  server: { proxy: { '/api': 'http://localhost:8000' } },
}
```

Con esta configuración, `fetch('/api/productos')` llega a `http://localhost:8000/api/productos`, pero el navegador lo pide "a sí mismo", sin cruzar orígenes.

```bash
npm run dev
```

## En el ejemplo

Los demos asumen una API remota pública (`jsonplaceholder.typicode.com`) para no necesitar backend propio. Es una API de prueba: acepta `GET`, `POST`, etc. y devuelve datos falsos, ideal para practicar sin instalar nada.

## Errores comunes

**1. Enviar un verbo que no toca (crear con `GET` o leer con `POST`)**

```text
Error: la API devuelve 404 o 405 aunque la URL "existe"
```

```jsx
// Mal: un GET no crea nada
fetch('/api/productos', { method: 'GET' })

// Bien: crear con POST y body JSON
fetch('/api/productos', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ nombre: 'Teclado' }),
})
```

**2. Confundir 401 con 403**

```text
Error 401: "me dice que no estoy autenticado, pero mandé token…"
```

```jsx
// 401 → falta o caducó el token: revisa el header Authorization
// 403 → el token es válido pero ese usuario no tiene permiso
// Solución: en 401, renovar login; en 403, mostrar "no tienes permiso"
if (res.status === 401) renovarSesion()
if (res.status === 403) mostrarError('Sin permisos')
```

**3. Ignorar el status y asumir que todo fue bien**

```text
Error: muestro "lista vacía" cuando en realidad hubo un 500
```

```jsx
// Mal
const datos = await res.json()

// Bien: comprobar el status antes de leer el body
if (!res.ok) throw new Error(`HTTP ${res.status}`)
const datos = await res.json()
```

**4. Poner verbos en la URL (no REST)**

```text
Error de diseño: /api/crearProducto?id=42
```

```jsx
// Mal (no es REST)
fetch('/api/borrarProducto?id=42', { method: 'GET' })

// Bien: recurso sustantivo + verbo
fetch('/api/productos/42', { method: 'DELETE' })
```

**5. Olvidar el proxy de Vite y ver error de CORS en desarrollo**

```text
Error: Access to fetch at 'http://localhost:8000/api/x' has been blocked by CORS policy
```

```js
// vite.config.js
export default {
  server: { proxy: { '/api': 'http://localhost:8000' } },
}
```

```jsx
// Con el proxy, la app pide al mismo origen:
const res = await fetch('/api/productos')
```

## Conceptos clave

- **Request** = método + URL + headers + body; **Response** = status + headers + body.
- **Verbos**: `GET` leer, `POST` crear, `PUT` actualizar completo, `PATCH` actualizar parcial, `DELETE` borrar.
- **2xx** éxito, **4xx** error del cliente (400/401/403/404), **5xx** error del servidor (500).
- **401** = sin identificar; **403** = identificado pero sin permiso.
- **REST** = convención sobre HTTP: recursos con sustantivos plurales (`/api/productos/42`), verbos = operaciones, **stateless**, **JSON** en el body.
- **CORS**: el navegador bloquea otros orígenes salvo que el servidor envíe `Access-Control-Allow-*`; en dev, el **proxy de Vite** lo evita.

## Autoevaluación

**1. Tu app hace `GET /api/productos/42` y recibe `404`. ¿Qué significa y qué compruebas primero?**

<details>
<summary>Respuesta</summary>

Significa que el recurso `productos/42` no existe en el servidor (o la URL es incorrecta). Es un error 4xx, del lado del cliente: compruebas que la URL es la correcta y que el id `42` existe realmente (quizás la lista devolvía otros ids).

</details>

**2. ¿Cuál es la diferencia entre enviar `PUT` y `PATCH` para actualizar el precio de un producto?**

<details>
<summary>Respuesta</summary>

`PUT` envía el producto **completo** y reemplaza el existente; si olvidas campos, pueden perderse o quedar vacíos. `PATCH` envía **solo los campos a cambiar** (p. ej. `{ "precio": 19 }`) y el resto del recurso se mantiene.

</details>

**3. ¿Por qué una API REST es "stateless"? ¿Qué relación tiene con el token de autenticación?**

<details>
<summary>Respuesta</summary>

Porque cada petición lleva **toda la información** necesaria para procesarla; el servidor no recuerda sesiones anteriores. Por eso el token de autenticación se envía en los headers de **cada** request: si no lo mandas, el servidor no sabe quién eres aunque "hayas iniciado sesión" antes.

</details>

**4. Tu fetch a `http://localhost:8000/api/x` falla con error de CORS aunque el backend responde bien con Postman. ¿Qué solución usas en desarrollo con Vite?**

<details>
<summary>Respuesta</summary>

Configuras el proxy en `vite.config.js` (`server: { proxy: { '/api': 'http://localhost:8000' } }`) y en la app pides `/api/x` (mismo origen). Vite reenvía al backend y el navegador ya no ve cruce de orígenes. (En producción, lo resuelve el servidor añadiendo `Access-Control-Allow-*` o sirviendo todo desde el mismo dominio.)

</details>
