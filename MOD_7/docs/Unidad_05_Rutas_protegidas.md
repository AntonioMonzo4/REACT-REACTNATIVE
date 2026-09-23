# Unidad 05 — Rutas protegidas

## Objetivos

- Entender qué es una ruta protegida y por qué el redirect debe **guardar el destino original**.
- Implementar el patrón **`RequireAuth`** como envoltorio reutilizable de `children`.
- Leer el destino recordado con `location.state?.from?.pathname` y volver a él tras el login.
- Usar `replace` tanto en el redirect del guardia como en el `navigate` del login para no romper el botón Atrás.
- Distinguir la protección **en el cliente** de la autorización **en la API** (cookies `httpOnly`, roles, sesión expirada).
- Reconocer y corregir los errores típicos: perder la URL, quedar atrapado en un bucle al pulsar Atrás y creer que "ocultar el enlace" protege la ruta.

## Requisitos

- Haber completado la **U01 a la U04** de este módulo: `BrowserRouter` y `Routes` (U01), params (U02), query params (U03) y rutas anidadas (U04).
- Un estado de autenticación al que pueda llamar el guardia: el **Context de autenticación del M6** o la carpeta `auth/` del ejemplo de este módulo (`AuthContext`, `AuthProvider` y el hook `useAuth`).
- Tener a mano el ejemplo `../EJEMPLO_REACT_ROUTER/` para recorrer en vivo la ruta protegida `/informe`.

## La idea: rutas que solo se ven con sesión

Piensa en un concierto: la puerta la vigila un guardia. Si tienes entrada (sesión), pasas y ves el escenario. Si no, el guardia no te ignora: te lleva a taquilla (login), anota de **dónde venías** y, cuando compras tu entrada, te devuelve a **ese mismo puesto**, no a la salida del recinto.

Así de sencillo es la idea de esta unidad:

1. Ciertas rutas (`/informe`, `/perfil`, el panel de administración…) **solo deben pintarse si hay sesión**.
2. Si el usuario llega sin sesión, **redirigimos al login**.
3. El redirect **guarda a dónde iba** el usuario (eso viaja en `state.from`).
4. Tras entrar, el login **lee ese destino** y navega hasta él.

**Qué significa** "proteger una ruta": antes de renderizar el componente de la página, comprobamos una condición (aquí: `user` distinto de `null`). Si la condición falla, no pintamos la página: emitimos un redirect con `<Navigate>`.

**Por qué importa**: sin este mecanismo, cualquiera podría escribir `/informe` en la barra de direcciones y llegar a la interfaz privada. Y si redirigimos "a ciegas" al login, perdemos el contexto: el usuario entra, se loguea y cae en Home sin entender por qué le sacaron de donde estaba. Guardar el destino es la diferencia entre un redirect torpe y una experiencia profesional.

## RequireAuth (patrón envoltorio)

### ¿Qué significa "envoltorio"?

Un **envoltorio** (wrapper) es un componente que no dibuja nada propio: recibe contenido en `children` y decide **si se lo muestra o no**. Piensa en el guardia de la puerta: no es el escenario ni el artista; solo decide quién entra. En React Router esto se conoce como **route guard** (guardia de ruta).

La ventaja de este patrón es la **reutilización**: el mismo `RequireAuth` protege `/informe`, `/perfil` o cualquier futura ruta privada sin copiar y pegar la lógica en cada una.

### Ejemplo completo, explicado línea a línea

Este es el `RequireAuth` tal como vive en el ejemplo:

```jsx
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/useAuth.js'

export default function RequireAuth({ children }) {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}
```

Vamos pieza por pieza:

- **`{ children }`**: el contenido que el padre quiera proteger (en el ejemplo de uso, `<Informe />`). El envoltorio no conoce la página: solo sabe si la deja pasar o no.
- **`const { user } = useAuth()`**: lee el usuario del Context de autenticación. Si `user` es `null`, no hay sesión. El estado **no vive en el guardia**: vive arriba en el árbol (el `AuthProvider` del ejemplo, envuelto en `main.jsx`), y el guardia solo lo consulta. Por eso, cuando el login cambia `user`, todas las rutas protegidas "se enteran" solas en el siguiente render.
- **`const location = useLocation()`**: obtiene la ubicación actual —entre otros datos, la ruta que el usuario intentaba visitar—. Es lo que guardaremos para poder volver.
- **`<Navigate to="/login" replace state={{ from: location }} />`**: si no hay sesión, este `return` corta el render: la página privada **nunca se pinta**. Tres atributos clave:
  - `to="/login"`: adónde vamos.
  - `state={{ from: location }}`: **el destino original viaja dentro del estado de navegación**, como una etiqueta pegada a la maleta del viaje.
  - `replace`: sustituye la entrada actual del historial en lugar de apilar una nueva (lo detallamos más abajo).
- **`return children`**: si hay sesión, el guardia se aparta y pintamos la página tal cual.

**Por qué importa** el orden de los returns: en React, el primero que se ejecuta gana. El `return <Navigate ...>` está **antes** de `return children`, así que sin sesión no hay ninguna forma de que llegue a ejecutarse el render de la página protegida.

### Uso con children: envolver la ruta

Definir el guardia no sirve de nada si no lo colocas en la ruta. Se usa envolviendo el elemento:

```jsx
<Route
  path="/informe"
  element={
    <RequireAuth>
      <Informe />
    </RequireAuth>
  }
/>
```

**Qué significa**: al coincidir la URL `/informe`, React Router renderiza `<RequireAuth>`, no `<Informe>` directamente. RequireAuth mira la sesión; si la hay, devuelve `children` (es decir, `<Informe />`) y el usuario ve su informe; si no la hay, devuelve el `<Navigate>` y jamás se monta `<Informe />`.

Fíjate en que `<Informe />` queda **entre las etiquetas** de RequireAuth: ese "algo entre medias" es exactamente lo que la prop `children` captura. El guardia es genérico: protegería con la misma línea cualquier otra página, o incluso un fragmento con varias, porque solo mira `user`.

## Login y retorno

### Leer el destino guardado

El login es la segunda mitad del pacto: **quien redirige guarda; quien recibe, lee**.

```jsx
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth.js'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname ?? '/'

  const onSubmit = (e) => {
    e.preventDefault()
    const email = new FormData(e.currentTarget).get('email')
    login(email)
    navigate(from, { replace: true })
  }

  // (resto del formulario: input de email y botón)
}
```

Desglose:

- **`location.state?.from?.pathname`**: `state` es el objeto que RequireAuth pasó con `state={{ from: location }}`. De ahí extraemos `.pathname`, solo la ruta (p. ej. `/informe`), sin query ni hash.
- **Los `?.` (optional chaining)**: si el usuario entró a `/login` **directamente** (por un marcador o escribiendo la URL), no hay `state`, y acceder a `.from.pathname` reventaría. Con `?.` la expresión queda en `undefined` en lugar de lanzar un error.
- **`?? '/'`** (nullish coalescing): si no hay destino guardado, usamos la casa segura, `/`. Así el login siempre puede navegar a **alguna** parte.
- **`navigate(from, { replace: true })`**: justo después de `login(email)` —que actualiza el Context y hace que RequireAuth deje de redirigir— llevamos al usuario a su ruta original.

**Por qué importa** leer `from` aquí: es lo que cierra el bucle *guardar → recordar → volver*. Sin esta línea, el redirect del guardia sería a mitad de camino: sacas al usuario de `/informe` pero nunca lo devuelves.

### Por qué `replace` (en el guardia y en el login)

El navegador guarda el historial como una **pila de tarjetas**: cada navegación normal (`push`) añade una tarjeta encima; `replace` dice "no apiles otra: **sustituye** la actual".

- **En RequireAuth**: sin `replace`, la pila quedaría `[Home, /informe, /login]`. Si el usuario pulsa **Atrás**, vuelve a `/informe`… donde el guardia, aún sin sesión, **redirige otra vez** al login: parece que Atrás no funciona y el usuario queda atrapado saltando entre las dos pantallas. Con `replace`, la tarjeta `/informe` **se sustituye** por `/login`: la pila queda `[Home, /login]` y Atrás lleva a Home, como el usuario espera.
- **En `navigate(from, { replace: true })`**: la pila ya es `[Home, /login]` y no queremos que termine en `[Home, /login, /informe]`, porque al pulsar Atrás aparecería **otro vez el formulario de login** a alguien que acaba de entrar. Con `replace`, `/login` se cambia por `/informe`: `[Home, /informe]` y Atrás sale de la zona con naturalidad.

Regla práctica: **todo redirect automático y todo retorno "programado" usan `replace`**; `push` se reserva para la navegación que el usuario sí quiere poder deshacer (cambiar de sección y volver con Atrás).

## Detalles de producción

La demo de clase usa un Context y un usuario en memoria. En un proyecto real hay matices importantes:

| Tema | Nota |
|------|------|
| Dónde vive el usuario | En el cliente: Context (demo), store (Redux/Zustand) u otro estado global. El **token** suele vivir en una **cookie `httpOnly`** (el JS no la lee; la manda el navegador sola en cada petición) o, menos recomendable, en `localStorage`. |
| Proteger solo el cliente | **Insuficiente.** El guardia de React Router solo pinta u oculta UI: cualquiera puede llamar a la API a mano desde la consola o con `curl`. La **API también debe autorizar** (validar token o sesión en cada endpoint privado). |
| Roles | Basta una prop extra: `<RequireAuth roles={['admin']}>` con un chequeo dentro del guardia (`if (!roles.includes(user.role)) …`). El patrón es el mismo: condición → o children, o redirect. |
| Sesión expirada | Cuando el token caduca, se limpia `user` (a menudo desde un interceptor de peticiones). Como el guardia lee `user` en cada render, **redirige solo**, sin código extra en cada página privada. |

**Por qué importa** la fila de la API: en seguridad, "está oculto" no es lo mismo que "está protegido". El cliente es **suficiente para la experiencia** (no enseñar formularios a extraños) e **insuficiente para la seguridad**: la autoridad real es el servidor.

## En el ejemplo

Todo lo de esta unidad está montado en `../EJEMPLO_REACT_ROUTER/`:

- `src/components/RequireAuth.jsx` — el envoltorio tal como lo hemos explicado.
- `src/auth/` — `AuthContext.js` (el Context), `AuthProvider.jsx` (estado `user`, `login`, `logout`) y `useAuth.js` (hook para consumirlo). El `AuthProvider` envuelve la app en `src/main.jsx`.
- `src/pages/Login.jsx` — lee `location.state?.from?.pathname ?? '/'` y hace `navigate(from, { replace: true })`.
- Ruta `/informe` protegida en `src/App.jsx`: el `element` envuelve la página (en el ejemplo, `Reporte.jsx`, cuyo título es "Informe") con `<RequireAuth>`.

Prueba el recorrido completo: sin sesión, entra a `/informe` → caes en `/login` → envía el email → vuelves a `/informe`. Ahora pulsa Atrás: sales limpio, sin bucle.

## Errores comunes

### 1. Redirect sin `state.from` → pierdes la URL

**Síntoma**: entras a `/informe` sin sesión, haces login y acabas en Home (`/`) aunque tu intención era ver el informe. El destino original se "pierde".

```jsx
// ❌ Mal: el destino no viaja con el redirect
if (!user) {
  return <Navigate to="/login" replace />
}
```

```jsx
// ✅ Bien: guardas la ubicación completa en state
if (!user) {
  return <Navigate to="/login" replace state={{ from: location }} />
}
```

**Solución**: añade `state={{ from: location }}` en el guardia y léelo en el login con `location.state?.from?.pathname ?? '/'`. Un redirect sin `state.from` solo te deja a medias: rediriges, pero no puedes devolver.

### 2. `<Navigate>` sin `replace` → bucle al pulsar Atrás

**Síntoma**: tras loguearte, Atrás te devuelve al login (o a una URL que vuelve a redirigir) y cuesta salir; el historial se llena de pasos repetidos y el botón parece roto.

```jsx
// ❌ Mal: apila /login detrás de /informe en el historial
return <Navigate to="/login" state={{ from: location }} />
```

```jsx
// ✅ Bien: sustituye la entrada actual y Atrás queda limpio
return <Navigate to="/login" replace state={{ from: location }} />
```

**Solución**: usa `replace` en todo redirect automático **y** en el retorno `navigate(from, { replace: true })`. Así `/informe` no queda "atrapado" detrás del login y el usuario no rebota entre ambas pantallas.

### 3. Ocultar el link no basta → hay que envolver la ruta

**Síntoma**: comentas el enlace al informe en el menú, pero `/informe` sigue mostrando la página a cualquiera que escriba la URL. **Un guardia solo protege lo que envuelve.**

```jsx
// ❌ Mal: escondiste la puerta, pero la ventana sigue abierta
// <NavLink to="/informe">Informe</NavLink>   ← comentado
<Route path="/informe" element={<Informe />} />
```

```jsx
// ✅ Bien: la ruta en sí pasa por el guardia
<Route
  path="/informe"
  element={
    <RequireAuth>
      <Informe />
    </RequireAuth>
  }
/>
```

**Solución**: envuelve el `element` de **cada** ruta privada con `<RequireAuth>`. Y en producción, recuerda además que la API debe rechazar las peticiones sin sesión: la UI protegida no es una barrera.

## Conceptos clave

- **Ruta protegida**: solo renderiza su página si se cumple una condición (sesión); si no, redirige al login.
- **`RequireAuth` / route guard**: envoltorio que recibe `children` y devuelve children o `<Navigate>`.
- **`state.from`**: el destino original guardado en la navegación; el login lo lee con `location.state?.from?.pathname`.
- **`?? '/'`**: valor por defecto cuando no hay destino guardado (entrada directa al login).
- **`replace`**: sustituye la entrada del historial; evita el bucle Atrás login ↔ ruta privada y evita re-ver el formulario tras volver.
- **Cliente vs API**: el guardia cuida la UI; la **API también debe autorizar** de verdad.
- **Cookies `httpOnly`**: lugar habitual del token; inaccesible para el JS del navegador.
- **Roles y sesión expirada**: extensiones del mismo patrón (condición → children o redirect).

## Autoevaluación

1. **Un usuario sin sesión escribe `/informe` en la barra de direcciones. ¿Qué ve y en qué orden ocurre?**

   <details><summary>Respuesta</summary>
   RequireAuth lee `user`, que es `null`, y retorna <code>&lt;Navigate to="/login" replace state={{ from: location }} /&gt;</code>. La página del informe nunca se pinta: aparece el login y <code>location.state.from</code> recuerda <code>/informe</code> para volver después.
   </details>

2. **¿Por qué el `<Navigate>` del guardia lleva `replace` y el `navigate()` de vuelta del login también?**

   <details><summary>Respuesta</summary>
   Para no apilar entradas intermedias en el historial. Sin <code>replace</code> en el redirect, <code>/informe</code> queda detrás del login: Atrás devuelve al informe, el guardia redirige otra vez y el usuario queda atrapado. Sin <code>replace</code> al volver, Atrás mostraría de nuevo el formulario de login a quien acaba de entrar. Con <code>replace</code> en ambos sitios, la pila queda <code>[Home, /informe]</code> y Atrás sale limpio.
   </details>

3. **¿Qué significa `location.state?.from?.pathname ?? '/'` y cuándo se usa el `/`?**

   <details><summary>Respuesta</summary>
   Lee la ruta original guardada por RequireAuth. Los <code>?.</code> evitan el error cuando no hay <code>state</code> (el usuario abrió <code>/login</code> directamente); en ese caso <code>from</code> sería <code>undefined</code> y <code>?? '/'</code> lleva al home. Es la casa segura del login.
   </details>

4. **¿Es suficiente proteger todas las rutas privadas con RequireAuth? ¿Por qué?**

   <details><summary>Respuesta</summary>
   No. RequireAuth solo controla lo que se <strong>pinta</strong> en el cliente: cualquiera puede llamar a la API desde la consola o con <code>curl</code>. La API también debe validar la sesión (token o cookie) en cada endpoint privado; roles y expiración se gestionan con la misma idea (condición → permitir o rechazar).
   </details>
