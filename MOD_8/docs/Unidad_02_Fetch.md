# Unidad 02 — Fetch API

## Objetivos

- Hacer peticiones `GET` con `fetch` dentro de `useEffect` gestionando **loading, error y datos** como estados distintos.
- Entender **parte por parte** el patrón completo: flag `cancelado`, `setCargando`, `res.ok`, `res.json()` y `finally`.
- Enviar un **`POST` con JSON** (`method`, `Content-Type`, `JSON.stringify`) y leer la respuesta.
- Saber por qué `fetch` **no lanza error** con respuestas 4xx/5xx y por qué hay que comprobar `res.ok` siempre (y cómo se compara con axios).
- **Abortar** peticiones en vuelo con `AbortController` al desmontar el componente.

## Requisitos

- Unidad 01 — HTTP y REST (verbos, status codes, JSON, CORS).
- `async`/`await`, `try`/`catch`/`finally` y promesas (M2).
- Componentes, estado (`useState`) y efectos (`useEffect`) con función de limpieza (M4–M5).

## GET básico

El caso más habitual de una app React: al montar un componente, pedir una lista y pintarla. Usamos la API pública `https://jsonplaceholder.typicode.com`, que no requiere backend propio.

```jsx
useEffect(() => {
  let cancelado = false

  async function cargar() {
    setCargando(true)
    setError(null)
    try {
      const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const datos = await res.json()
      if (!cancelado) setPosts(datos)
    } catch (e) {
      if (!cancelado) setError(e.message)
    } finally {
      if (!cancelado) setCargando(false)
    }
  }

  cargar()
  return () => {
    cancelado = true   // no setear state tras desmontar
  }
}, [])
```

### Cada parte, explicada

- **`let cancelado = false`**: una variable normal (no es state) que actúa como **flag**. Solo vive durante esta ejecución del efecto. Sirve para saber si el componente sigue montado cuando la respuesta llega tarde.
- **`setCargando(true)` y `setError(null)`**: al empezar, activas el spinner y **limpias errores anteriores**. Si no lo haces, un error viejo seguiría visible mientras cargas datos nuevos.
- **`try` / `await fetch(...)`**: `fetch` devuelve una promesa con la *response* (cabeceras y body en bruto), no con los datos ya parseados.
- **`if (!res.ok) throw new Error(...)`**: comprueba el status (true para 200–299). Si el servidor devolvió 404 o 500, lanzas tú el error para que caiga en el `catch`. **Sin esta línea, un 500 pasaría desapercibido.**
- **`await res.json()`**: parsea el body JSON (también es una promesa). Solo llega aquí si la respuesta era buena.
- **`if (cancelado) ...` antes de cada `setState`**: si el componente se desmontó (o el efecto se volvió a ejecutar) mientras esperabas, **no toques el state**. Evitas el aviso *"Can't perform a React state update on an unmounted component"* y carreras de datos viejos pisando a los nuevos.
- **`catch`**: captura tanto errores de red (sin internet, CORS) como los que lanzaste tú con `res.ok`.
- **`finally`**: se ejecuta **siempre** (éxito o error), así que es el lugar idóneo para `setCargando(false)`. Como es el último, solo necesitas el flag aquí para no desmontar con estado pendiente.
- **`return () => { cancelado = true }`**: la **limpieza de `useEffect`**. Se ejecuta justo antes de desmontar o de repetir el efecto; ahí marcas el flag para que las respuestas tardías se descarten.
- **`[]` como dependencias**: el efecto corre **una sola vez** al montar.

## POST con JSON

Para crear un recurso usas `POST` y envías el body como **texto JSON**: los objetos JS no viajan solos, hay que serializarlos.

```js
const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ title: 'Hola', body: 'Mundo', userId: 1 }),
})
if (!res.ok) throw new Error(`HTTP ${res.status}`)
const creado = await res.json()
```

### Por qué cada opción

- **`method: 'POST'`**: sin esto, `fetch` hace un `GET` (por defecto solo lee).
- **`Content-Type: 'application/json'`**: le dice al servidor "el body es JSON". Sin ese header, muchos backends no lo parsean y responden `400 Bad Request`.
- **`JSON.stringify(datos)`**: convierte el objeto JS en un string; `fetch` no serializa objetos por ti.
- **`res.json()` al final**: la respuesta del `POST` suele traer el recurso creado (con su `id`), y lo necesitas para añadirlo a la lista sin recargar todo.
- **`if (!res.ok)`**: un `POST` también puede fallar (400 si el payload es inválido, 401 si no hay token…).

## Errores: no lanza con status 4xx/5xx

**`fetch` solo rechaza (rechaza la promesa → entra en `catch`) si falla la red**: sin conexión, DNS caído, CORS bloqueado… Pero si el servidor responde con `404`, `500` o cualquier otro status, la promesa **se resuelve con normalidad**. `fetch` considera que "hubo respuesta", aunque sea un error.

Por eso: **siempre comprueba `res.ok`** (true para 200–299) **antes** de `res.json()`.

```jsx
// Mal: el 500 pasa como si nada y datos quedaría undefined
const res = await fetch(url)
const datos = await res.json()

// Bien
const res = await fetch(url)
if (!res.ok) throw new Error(`HTTP ${res.status}`)
const datos = await res.json()
```

**Comparación con axios**: axios **sí** rechaza la promesa automáticamente ante un status fuera de 2xx (puedes leer `error.response.status`), mientras que `fetch` te deja la responsabilidad a ti. Algunos desarrolladores eligen axios justo por ese comportamiento; con `fetch`, la regla de oro es la misma línea en todos lados: `if (!res.ok) throw ...`.

```javascript
// Con axios (referencia): el 404 YA lanza error solo
// try {
//   const { data } = await axios.get(url)
// } catch (e) {
//   console.log(e.response.status) // 404
// }
```

## Abortar peticiones

Si el usuario navega fuera antes de que responda el servidor, quieres **cancelar** la petición en vuelo. `AbortController` es la API estándar del navegador para eso:

```js
const ctrl = new AbortController()
fetch(url, { signal: ctrl.signal })
// al limpiar el efecto:
ctrl.abort()
```

Cuando llamas a `ctrl.abort()`, `fetch` rechaza con un error de tipo `AbortError`. Puedes combinarlo con el flag `cancelado`, o directamente pasar el `signal` en el fetch del useEffect y abortar en la función de limpieza:

```jsx
useEffect(() => {
  const ctrl = new AbortController()

  async function cargar() {
    setCargando(true)
    try {
      const res = await fetch(url, { signal: ctrl.signal })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const datos = await res.json()
      setPosts(datos)
    } catch (e) {
      if (e.name !== 'AbortError') setError(e.message)
    } finally {
      setCargando(false)
    }
  }

  cargar()
  return () => ctrl.abort() // cancela si se desmonta
}, [])
```

Fíjate en `if (e.name !== 'AbortError')`: abortar **no es un error de verdad**, así que no debes pintarlo en la UI.

## Checklist

Antes de dar por buena una carga de datos, repasa esta lista:

- [x] **Loading, error y datos como estados distintos**: `cargando`, `error` y `posts` son tres piezas independientes; así puedes mostrar spinner, mensaje de fallo o lista sin mezclarlos.
- [x] **Cancelación / flag `cancelado` al desmontar**: la limpieza del efecto marca el flag (o aborta) para que ninguna `setState` se ejecute fuera del ciclo de vida del componente.
- [x] **`res.ok` antes de `res.json()`**: recuerda que `fetch` no lanza con 4xx/5xx; sin esta comprobación, un servidor caído parecería "datos vacíos".
- [x] **No guardes estado si el componente ya no está montado**: toda `setState` dentro del `try`/`catch`/`finally` va protegida por el flag o por el `AbortError`.

## Errores comunes

**1. Olvidar el flag y hacer `setState` tras desmontar**

```text
Warning: Can't perform a React state update on an unmounted component
```

```jsx
// Mal
useEffect(() => {
  fetch(url).then(r => r.json()).then(d => setPosts(d))
}, [])

// Bien: flag + return de limpieza
useEffect(() => {
  let cancelado = false
  fetch(url)
    .then(r => r.json())
    .then(d => { if (!cancelado) setPosts(d) })
  return () => { cancelado = true }
}, [])
```

**2. Confiar en que `fetch` lanza error ante un 404/500**

```text
Error: no salta el catch, pero la lista sale vacía con status 500
```

```jsx
// Mal
const res = await fetch(url)
const datos = await res.json() // podría fallar o dar undefined

// Bien
const res = await fetch(url)
if (!res.ok) throw new Error(`HTTP ${res.status}`)
const datos = await res.json()
```

**3. Enviar un objeto sin `JSON.stringify` o sin `Content-Type`**

```text
Error 400 Bad Request: el servidor no entiende el body
```

```jsx
// Mal
fetch(url, { method: 'POST', body: { title: 'Hola' } })

// Bien
fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ title: 'Hola' }),
})
```

**4. Pintar el AbortError como si fuera un fallo real**

```text
Error: sale "HTTP abort" en pantalla cuando el usuario cambia de página
```

```jsx
} catch (e) {
  if (e.name !== 'AbortError') setError(e.message)
}
```

**5. Mezclar todo en un solo estado**

```text
Error: mientras cargas, se ve el mensaje de error anterior
```

```jsx
// Estados separados + limpiar error al empezar
const [posts, setPosts] = useState([])
const [cargando, setCargando] = useState(false)
const [error, setError] = useState(null)

// dentro de cargar():
setCargando(true)
setError(null)
```

## En el ejemplo

`src/hooks/useFetch.js` envuelve estos patrones; lo usan varias demos. Ese hook centraliza el flag de cancelación, `res.ok`, `cargando` y `error`, para que cada componente solo consuma el resultado:

```javascript
// Uso típico (ver src/hooks/useFetch.js en ../EJEMPLO_REACT_API/)
const { data, cargando, error } = useFetch(url)
```

## Conceptos clave

- `fetch(url)` devuelve una **response** (status + headers + body); los datos JSON se obtienen con `await res.json()`.
- En `useEffect`: **flag `cancelado`** en la limpieza, `setCargando` al empezar, **`res.ok` antes de `res.json()`**, y `finally` para apagar el loading.
- `POST` con JSON necesita las **tres**: `method: 'POST'`, `headers: { 'Content-Type': 'application/json' }` y `body: JSON.stringify(...)`.
- `fetch` **solo rechaza con error de red**; ante 4xx/5xx la promesa se resuelve → comprueba siempre `res.ok` (a diferencia de axios, que rechaza solo).
- **`AbortController`**: `signal` en el fetch y `ctrl.abort()` en la limpieza para cancelar peticiones en vuelo; ignora el `AbortError`.
- Loading, error y datos son **estados distintos**; nunca hagas `setState` con el componente desmontado.

## Autoevaluación

**1. ¿Por qué `setCargando(true)` y `setError(null)` van al principio de la función `cargar()`, antes del `try`?**

<details>
<summary>Respuesta</summary>

Para reiniciar la UI de la petición anterior: activas el indicador de carga y limpias cualquier error viejo, de modo que durante la nueva petición solo se vea el estado "cargando", no un error que ya no aplica.

</details>

**2. El servidor responde `HTTP 500`. ¿Entra el `catch` si no has escrito `res.ok`? ¿Y si sí lo has escrito?**

<details>
<summary>Respuesta</summary>

Sin comprobar `res.ok`, **no** entra el `catch`: `fetch` solo rechaza ante fallos de red, y aquí hubo respuesta. Con `if (!res.ok) throw new Error(...)`, lanzas el error tú y el `catch` sí se ejecuta, mostrando el fallo en la UI.

</details>

**3. ¿Qué hace exactamente la función de limpieza del efecto (`return () => { cancelado = true }`) y qué evitaría si la sustituyes por `AbortController` + `ctrl.abort()`?**

<details>
<summary>Respuesta</summary>

Marca el flag para que, si la respuesta llega tarde, no se ejecute ningún `setState` tras desmontar. Con `AbortController` vas más allá: además de ignorar la respuesta, **cancelas de verdad la petición en la red**, el `fetch` rechaza con `AbortError` y el navegador descarta la conexión (útil si el servidor tarda mucho o el usuario cambia de filtro rápido).

</details>

**4. Tu `POST` devuelve siempre `400 Bad Request` aunque el JSON "parece" correcto. ¿Qué dos cosas revisas en la llamada?**

<details>
<summary>Respuesta</summary>

1) Que el body sea un string con `JSON.stringify(datos)` (si pasas el objeto crudo, no viaja bien). 2) Que envíes `headers: { 'Content-Type': 'application/json' }`, sin el cual el servidor no sabe que el body es JSON y responde 400. (Y revisa también `method: 'POST'`.)

</details>
