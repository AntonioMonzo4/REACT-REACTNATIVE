# Unidad 03 — Axios (y alternativas)

## Objetivos

- Entender qué es Axios y por qué existe un "fetch con cara nueva" para consumir APIs.
- Comparar `fetch` y Axios con la tabla clásica y saber leer cada columna.
- Instalar Axios con `pnpm add axios` y crear un cliente con `axios.create` (baseURL, timeout).
- Hacer peticiones GET con `params` y POST con cuerpo, interpretando `res.data`.
- Manejar errores en sus tres casos: `err.response`, `err.request` y error al montar.
- Aplicar un interceptor de autenticación (`Authorization: Bearer`) y elegir bien entre fetch, Axios o React Query/SWR.

## Requisitos

- Haber completado la **Unidad 02 (Fetch)**: async/await, `res.ok`, `res.json()`, `try/catch` y CORS básico.
- Conviene haber visto el módulo 7 (U05) sobre autenticación básica: sin esa idea, el interceptor de la última sección no tendrá contexto.

## Por qué Axios si ya existe fetch

`fetch` viene de serie en el navegador: no instalas nada y funciona en cualquier parte. Eso es fantástico para una petición suelta, pero en cuanto tu app crece empiezan a faltar piezas: no lanza error automático con un 404, no tiene timeout declarativo, no tiene interceptors ni te informa del progreso de subida. **Axios** es una librería de npm que rellena esos huecos. Piensa en `fetch` como en un destornillador de la caja de herramientas de casa, y en Axios como en un destornillador con empuñadura ergonómica y punta magnética: sirven para lo mismo, pero uno está pensado para trabajar muchas horas seguidas.

### Tabla fetch vs axios

La siguiente tabla es el resumen que debes tener presente cuando alguien te pregunte "¿por qué no simplemente fetch?":

| | `fetch` | Axios |
|---|---------|-------|
| Viene en el navegador | sí | paquete npm |
| Lanza en 4xx/5xx | no | sí (por defecto) |
| `res.data` | hay que `res.json()` | ya parseado |
| Timeouts | manual | `timeout` |
| Interceptors | no | sí |
| Upload progreso | XHR a mano | sí |

¿Qué significa cada fila en la práctica?

- **Viene en el navegador**: `fetch` no requiere instalación; Axios sí, se descarga con el gestor de paquetes.
- **Lanza en 4xx/5xx**: con `fetch`, una respuesta 404 o 500 es una respuesta "normal" (la promesa se resuelve); debes comprobar `res.ok` a mano. Axios, en cambio, rechaza la promesa y entra en el `catch`, lo cual encaja mejor con `try/catch`.
- **`res.data`**: con `fetch` recibes una respuesta cruda y llamas a `await res.json()` para convertirla; Axios ya te entrega el JSON parseado en `res.data`.
- **Timeout**: `fetch` no tiene opción de "corta a los 8 segundos" (hay que montar un `AbortController`); Axios acepta `timeout: 8000` y listo.
- **Interceptors**: solo Axios permite enganchar código a *todas* las peticiones (por ejemplo, para adjuntar el token) sin repetirlo en cada llamada.
- **Upload progreso**: con `fetch` no hay evento de progreso; con Axios sí, y sin tocar XHR a mano.

## Instalación

Como cualquier dependencia de proyecto, se añade con el gestor de paquetes que uses. En este curso, pnpm:

```bash
pnpm add axios
```

Tras esto ya puedes `import axios from 'axios'` en cualquier archivo de tu app React.

## Cliente con axios.create

En lugar de llamar a `axios.get(...)` por todas partes con la URL completa repetida, creamos **un cliente propio** con `axios.create`. Es como guardar un contacto en la agenda con el número ya relleno: solo pulsas llamar. Aquí el "número" es la `baseURL` y el "buzzer" es el `timeout`:

```js
import axios from 'axios'

const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 8000,
})

// GET
const { data } = await api.get('/posts', { params: { _limit: 5 } })

// POST
const { data: creado } = await api.post('/posts', {
  title: 'Hola',
  body: 'Mundo',
  userId: 1,
})
```

Qué está pasando línea a línea:

- **`baseURL`**: la raíz común. Si escribes `api.get('/posts')`, Axios concatena por ti: `https://jsonplaceholder.typicode.com/posts`. Si un día cambia el dominio del backend, solo tocas este objeto.
- **`timeout: 8000`**: si el servidor no responde en 8 segundos, Axios aborta y lanza error. Evita pantallas de carga eternas.
- **GET con `params`**: `{ params: { _limit: 5 } }` se convierte en `?_limit=5`. Nunca montes la query string a mano si Axios lo hace por ti: así evitas errores de codificación.
- **`res.data`**: al hacer `const { data } = await api.get(...)`, `data` ya es el JSON parseado (el equivalente a lo que en fetch obtenerías con `await res.json()`).
- **POST con cuerpo**: el segundo argumento de `api.post(url, body)` es el objeto que viaja como JSON; Axios pone también las cabeceras `Content-Type: application/json` solito.

## Manejo de errores

Los fallos de red y de API no son la excepción: son parte del día a día. Axios agrupa los errores en **tres casos**, y distinguirlos te dice qué ha fallado de verdad:

```js
try {
  await api.get('/posts/999999')
} catch (err) {
  if (err.response) {
    // HTTP con status: err.response.status, err.response.data
  } else if (err.request) {
    // petición hecha sin respuesta (red)
  } else {
    // error al montar la petición
  }
}
```

### Los tres casos, explicados

1. **`err.response` — el servidor respondió, pero con error.**
   Hubo ida y vuelta: tu petición llegó, el backend contestó 4xx o 5xx. Aquí `err.response.status` te da el código (404, 500...) y `err.response.data` el cuerpo del error que suele mandar la API (un mensaje, un array de validación...). Es el caso que más te interesará para la UI: "usuario no encontrado" o "sin permisos".

2. **`err.request` — la petición salió, pero no llegó respuesta.**
   No hubo respuesta HTTP: el servidor estaba caído, la conexión a internet se cortó, CORS bloqueó la respuesta... La petición existe (`err.request` está relleno) pero `err.response` no. Aquí el mensaje al usuario debe ser de tipo "no hay conexión / reintenta más tarde".

3. **Ni `response` ni `request` — error al montar la petición.**
   Axios ni siquiera llegó a enviar nada: URL mal formada, `timeout` con valor inválido, algún fallo interno al construir la config. Es raro, pero si no entra en los dos anteriores, este es.

> Regla práctica: entra en `response` si hay status, en `request` si no hubo respuesta, y en el `else` si algo falló antes de salir.

## Interceptor (auth)

El interceptor es la joya de Axios. Es una función que se ejecuta **antes de que salga cada petición**, y te da la oportunidad de tocarla: añadir cabeceras, logging, reintentos... El caso más típico en React es adjuntar el token de autenticación:

```js
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})
```

Cómo leer este fragmento:

- `api.interceptors.request.use(fn)` registra una función que corre con la **configuración** de cada request (`config`).
- Leemos el token de `localStorage` (el patrón de la demo; en producción verás alternativas en la Unidad 04).
- Si existe, escribimos la cabecera `Authorization: Bearer <token>`. El backend espera exactamente ese formato: la palabra `Bearer`, un espacio y el token.
- Devolvemos `config` modificado: si no lo devuelves, la petición no sale.

Gracias a esto, en el resto de tu código haces `api.get('/perfil')` a secas y el token viaja solo, sin repetir la cabecera en cada llamada.

## ¿Cuándo cada uno?

Elegir no es cuestión de moda, sino de tamaño del problema:

- **App pequeña / sin dependencias → `fetch` bien envuelto.**
  Si solo tienes dos o tres llamadas, una utilidad propia tipo `getJson(url)` que compruebe `res.ok` y haga `res.json()` es más que suficiente y no añade dependencias.

- **Muchos endpoints, timeouts, interceptors → axios.**
  En cuanto repites cabeceras de auth, manejas 401/500 con status, necesitas timeout o progreso de subida, Axios ahorra código y errores tontos. Es el punto dulce de la mayoría de apps medias de React.

- **React Query / SWR (M9+): traen cache, revalidación y retry por ti.**
  Estas librerías no sustituyen a `fetch` ni a Axios en lo físico: las usan por debajo, pero añaden caché, revalidación en foco, reintentos y estados de carga. Cuando llegues al módulo 9, seguirás eligiendo Axios o fetch, pero dejarás de gestionar a mano la caché.

## Errores comunes

| Error | Por qué ocurre | Solución |
|-------|----------------|----------|
| `TypeError: Failed to fetch` tratada como 404 | Con `fetch` un 404 no lanza error; se resuelve igual | Comprobar `res.ok` a mano, o usar Axios (lanza en 4xx/5xx) |
| `undefined` al leer la respuesta | Olvidaste `await res.json()` o `res.data` | `const data = await res.json()` en fetch; `const { data } = await api.get()` en Axios |
| El `catch` nunca ve el status | Se lanza un error a mano antes de leer `err.response` | Acceder a `err.response?.status` dentro del `catch` de Axios |
| Las llamadas tardan "para siempre" | Sin timeout, una red lenta bloquea la UI | Poner `timeout` en `axios.create`, o `AbortController` con fetch |
| El interceptor no añade la cabecera | Falta `return config` o se registra en una instancia distinta de la que usas | Registrar el interceptor en el mismo cliente (`api`) con el que haces las peticiones |
| `params` aparecen codificados a mano y mal | Concatenar la query string con template literals | Pasar `{ params: { ... } }` y dejar que Axios construya la URL |

## Conceptos clave

- **Axios**: librería npm de peticiones HTTP; alternativa con más ergonomía que `fetch`.
- **Tabla fetch vs axios**: fetch viene de serie y no lanza en 4xx/5xx; Axios se instala, lanza, da `res.data`, timeout, interceptors y progreso de subida.
- **`axios.create`**: cliente con `baseURL` y `timeout` reutilizables; evita repetir la URL base.
- **GET con `params`**: los parámetros de query se pasan en un objeto y Axios los serializa.
- **POST**: el cuerpo va como segundo argumento y viaja como JSON.
- **Tres casos de error**: `err.response` (hubo HTTP de error), `err.request` (sin respuesta, red), `else` (fallo al montar).
- **Interceptor `request.use`**: engancha cada petición para adjuntar `Authorization: Bearer <token>` desde `localStorage`.
- **Cuándo usar cada uno**: fetch bien envuelto en apps pequeñas; Axios con muchos endpoints/timeouts/interceptors; React Query/SWR (M9+) cuando toque caché y revalidación.
- **Demo**: el ejemplo `DemoAxios` usa `axios.get` y maneja `err.response.status`.

## Autoevaluación

**1. Con `fetch`, ¿una respuesta 404 entra en el `catch`?**

<details><summary>Respuesta</summary>

No. `fetch` solo rechaza la promesa si falla la red; un 4xx/5xx se resuelve normalmente. Tienes que comprobar `res.ok` y lanzar tú el error. Axios sí lanza en 4xx/5xx por defecto, por eso entra en el `catch`.

</details>

**2. ¿Qué diferencia hay entre `err.response` y `err.request` en el `catch` de Axios?**

<details><summary>Respuesta</summary>

`err.response` significa que el servidor contestó con un status de error (4xx/5xx): puedes leer `err.response.status` y `err.response.data`. `err.request` significa que la petición salió pero no llegó respuesta (red caída, CORS, timeout): no hay status que leer.

</details>

**3. ¿Para qué sirve `axios.create({ baseURL, timeout })` y qué aporta el interceptor de auth?**

<details><summary>Respuesta</summary>

`axios.create` define un cliente reutilizable con la URL raíz y el tiempo máximo de espera, evitando repetirlos en cada llamada. El interceptor `request.use` se ejecuta antes de cada petición y adjunta `Authorization: Bearer <token>` leído de `localStorage`, sin tener que escribir la cabecera en cada endpoint.

</details>

**4. Si mi app tiene solo 3 llamadas a una API pública, ¿ Axios es obligatorio?**

<details><summary>Respuesta</summary>

No. Un `fetch` bien envuelto (comprobando `res.ok`, haciendo `res.json()` y envolviendo en `try/catch`) es suficiente. Axios merece la pena cuando hay muchos endpoints, timeouts, interceptors o progreso de subida; y en el M9+, React Query/SWR añadirán caché y retry por encima de cualquiera de los dos.

</details>
