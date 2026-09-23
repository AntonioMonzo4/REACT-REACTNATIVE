# Unidad 02 — Features del checklist

## Objetivos

Al terminar esta unidad serás capaz de:

- Implementar el bloque **auth y roles** completo (registro, login, logout, reset) con guard en rutas **y** autorización en la API.
- Construir un **CRUD** con paginación, filtros por query params, validación cliente y manejo de errores 400/422 del servidor.
- Montar un **dashboard** con KPIs (estados loading/error) y tablas/gráficos **lazy**.
- Añadir **notificaciones** in-app accesibles (`aria-live` + toast) y, opcionalmente, SSE/WebSocket desde M17.
- Configurar **modo oscuro** (clase `dark` + Tailwind, persistencia, `prefers-color-scheme`) e **i18n** ES/EN con placeholders (sin concatenar oraciones).
- Escribir un plan de **testing** (unit + componentes + 1 integration) sujeto a CI obligatorio (M19).

## Requisitos

- Haber completado la Unidad 01: fases F1–F5 definidas y stack elegido (columna A o B).
- React M4–M15: formularios y validación (M5), code-splitting (M6), rutas (M7), estado (M9), tests (M10), estructura (M11), Tailwind (M12), rendimiento (M20).
- Auth básica de M7/M8 y conceptos de seguridad de M22 (esto último sobre todo para roles y validación server).
- Backend mínimo con endpoints funcionando (M17) o, al menos, un plan claro de los mismos.
- **No** hace falta haber hecho nunca i18n, dark mode ni dashboards: cada sección empieza de cero.

---

## Cómo leer esta unidad

Esta unidad es una **lista de features**, no un tutorial lineal. Cada sección corresponde a una o varias tarjetas de tu tablero (las mismas de las fases F1–F4 de la Unidad 01). La idea es que sepas *qué construir, con qué módulos del curso apoyarte y qué tiene de especial cada feature*.

Regla de oro que atraviesa todo: **el frontend es la cara bonita, el servidor es la fuente de verdad**. El cliente valida para dar buena UX (errores al instante, mensajes amables); el servidor valida para seguridad (roles, ownership, tipos, tamaños). Nunca inviertas los papeles.

---

## Auth y roles

- Registro / login / logout / reset password (teoría M8, práctica M7 routes).
- Roles: `admin | user`; guard en rutas y **en API**.

### El circuito completo de auth

Desglosemos las cuatro operaciones base que casi toda app de empresa necesita:

1. **Registro**: formulario con validación (M5) → `POST /auth/register` → el servidor valida uniqueness de email, hashea la contraseña (**nunca** guardarla en claro) → crea usuario y, opcionalmente, lo loguea devolviendo tokens.
2. **Login**: `POST /auth/login` → servidor comprueba credenciales (con rate limit, M22) → devuelve access (+ refresh según hayas elegido en M22) → el front lo guarda donde decidiste (memoria/cookie) y actualiza el estado global de auth (M9).
3. **Logout**: borra el estado de auth en el cliente **y** llama al endpoint de logout/revocación en el servidor (recuerda `jti` + denylist de M22): no basta con borrar la variable local.
4. **Reset password**: pide email → servidor envía token de un solo uso → formulario nuevo con contraseña → servidor invalida el token tras usarlo. El frontend solo maqueta el flujo; la seguridad (expiración, un solo uso) vive en el server.

Con las rutas protegidas ya vistas en M7 (`RequireAuth` o similar), el siguiente nivel son los **roles**.

### Roles: guard en rutas y en API

- Roles: `admin | user`; guard en rutas y **en API**.

La tentación clásica de quien empieza: *«oculto el botón de borrar si no es admin»* y ya está. Falso. Cualquier persona con DevTools o `curl` puede llamar al endpoint directamente. **La autorización real es del servidor**: el guard de React es solo UX (evitar mostrar interfaces inútiles).

```text
/auth/login → token → RequireRole admin en /dashboard/*
```

Ese esquema de la unidad, en palabras:

1. El usuario hace login y obtiene un token que incluye su rol (claim `role`).
2. En el front, las rutas `/dashboard/*` están envueltas por un componente `RequireRole`: si el rol del estado no es `admin`, redirige (o muestra 403). Es la capa de *comodidad*.
3. En la API, el middleware comprueba el rol **en cada request** a endpoints sensibles. Si falta o es insuficiente → `403 Forbidden`. Es la capa de *seguridad*.

```jsx
// Front: UX únicamente — la API sigue validando
function RequireRole({ role, children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <p>No tienes permiso (403).</p>;
  return children;
}
```

```js
// API: aquí es donde de verdad se decide
function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') return res.status(403).json({ error: 'forbidden' });
  next();
}
```

Dos reglas que resumen la sección: **guard en rutas** para no enseñar lo que no pueden usar; **guard en API** para que no puedan obtenerlo de todas formas.

---

## CRUD y archivos

- Lista paginada + filtros (query params).
- Formularios validados (M5) + errores servidor (400/422).
- Subida: input file → FormData → endpoint con límite de tamaño/tipo.

### Lista paginada + filtros

- Lista paginada + filtros (query params).

En una app de empresa casi nunca se pide "todos los registros": se pagina y se filtra. La convención es usar **query params** en la URL, con la doble ventaja de que el estado de la lista es *compartible y recargable* (recargas y sigues en la página 3 del filtro "activos"):

```
GET /api/items?page=2&size=20&status=active&sort=created_at
```

Del lado React: el hook que carga datos lee `page`/`filtros` (de `useSearchParams` o del store), muestra estados de carga y error (M9/M10), y los controles "Anterior/Siguiente" solo actualizan la URL. El backend responde, idealmente, `{ items, page, total }` para pintar la paginación.

### Formularios validados + errores del servidor

- Formularios validados (M5) + errores servidor (400/422).

Aquí hay **dos** anillos de validación y debes usar los dos:

1. **Cliente (M5)**: validas en el `submit` o al cambiar el campo (longitud, formato, obligatorios), marcas `aria-invalid` + mensaje asociado (¡accesibilidad!) y evitas una llamada inútil. Es UX.
2. **Servidor**: responde `400` (malformada) o `422` (semánticamente inválida, p. ej. email ya registrado) con un cuerpo estructurado. El front debe **mostrar esos errores en el campo correcto** (o como toast si son globales) en vez de un `alert('error')`.

Nunca confíes en que el cliente es el único que valida: alguien llamará a tu API sin pasar por tu formulario.

### Subida de archivos

- Subida: input file → FormData → endpoint con límite de tamaño/tipo.

El flujo estándar:

```js
const fd = new FormData();
fd.append('file', fileInput.files[0]);

await fetch('/api/uploads', {
  method: 'POST',
  headers: { Authorization: `Bearer ${token}` }, // NO pongas Content-Type a mano
  body: fd, // el navegador pone el multipart boundary solo
});
```

Detalle clave: con `FormData` **no** fijes `Content-Type: multipart/form-data` tú: el navegador debe generar el `boundary` que separa las partes. Si lo pones a mano sin boundary, el servidor no parsea nada.

Y la seguridad (repasa M22): límite de tamaño y allowlist de tipos **en cliente (UX) y en servidor (verdad)**; storage no público sin auth. Un endpoint de subida sin validación es un disco duro público para el mundo.

---

## Dashboard

- KPIs de API (fetch + estados loading/error).
- Tablas/gráficos **lazy** (M6/M20).

### KPIs con estados honestos

- KPIs de API (fetch + estados loading/error).

Un dashboard es, en el fondo, una cuadrícula de datos remotos: *«128 usuarios activos, 42 pedidos hoy, +12 % esta semana»*. Lo que distingue a uno profesional de uno de tutorial es que **maneja los tres estados**: cargando (skeleton o spinner), error (con reintento, no una pantalla roja muerta) y éxito.

```jsx
{status === 'loading' && <Skeleton />}
{status === 'error' && <ErrorRetry onRetry={refetch} />}
{status === 'ready' && <KpiGrid items={data.kpis} />}
```

Un mismo `fetch` por KPI o uno agrupado (`GET /api/dashboard`) son válidos; prioriza lo que menos *waterfalls* (esperas encadenadas) genere.

### Tablas y gráficos lazy

- Tablas/gráficos **lazy** (M6/M20).

Un gráfico pesa (librerías de charts, datasets). Cargarlos en el bundle inicial haría lento el arranque de toda la app para algo que solo ve quien entra al dashboard. Aplica lo de M6 (code-splitting con `React.lazy` + `Suspense`) y lo de M20 (métricas, bundle por ruta):

```jsx
const SalesChart = React.lazy(() => import('./SalesChart'));
```

Regla práctica: si el usuario promedio no lo ve en la pantalla inicial, **no** debe viajar en el chunk inicial.

---

## Notificaciones

- In-app: cola con `aria-live` + toast.
- (Opcional) SSE/WebSocket desde M17.

### Notificaciones in-app accesibles

- In-app: cola con `aria-live` + toast.

Las notificaciones in-app son mensajes efímeros ("Guardado correctamente", "3 elementos borrados"). Tres piezas:

1. **Cola**: un array en el store/estado con `id`, mensaje y tipo (success/error/info). Al enviar, se añade; al pasar X segundos o pulsar cerrar, se elimina. Eso evita que dos toasts "peleen" por el mismo hueco.
2. **Toast**: el componente visual que se pinta normalmente en una esquina (portal fuera del árbol de la app si hace falta).
3. **`aria-live`**: el atributo que hace que un lector de pantalla **anuncie** el mensaje sin mover el foco. Sin esto, las notificaciones son invisibles para usuarios de tecnologías de apoyo. Clásico: `aria-live="polite"` para avisos y `assertive` solo para errores urgentes.

```jsx
<div aria-live="polite" aria-atomic="true" className="sr-only">
  {queue.map((n) => <p key={n.id}>{n.message}</p>)}
</div>
```

(El toast visual puede ir aparte; lo crítico es que el contenido esté en una región `aria-live`.)

### (Opcional) Tiempo real con SSE/WebSocket

- (Opcional) SSE/WebSocket desde M17.

Si tu backend (M17) lo soporta, puedes ir más allá de los toasts disparados por acciones del usuario: **SSE** (*Server-Sent Events*) o **WebSocket** para que el servidor empuje "Pedido #5 aprobado" a todos los conectados. SSE es más simple (unidireccional servidor→cliente, se apoya en HTTP) y suele bastar para notificaciones; WebSocket abre canal doble (chat, colaboración). Como es opcional, solo si F4 te lo permite: prioriza lo core antes.

---

## Modo oscuro

- `class="dark"` en `<html>` + Tailwind (M12); persistir en localStorage; respetar `prefers-color-scheme`.

Funciona en tres capas:

1. **Clase `dark` en `<html>`**: con Tailwind configurado en *class strategy*, añadir `dark` al elemento raíz hace que todas las variantes `dark:*` de tus componentes cobren vida. Sin tocar cada pantalla.
2. **Persistencia en `localStorage`**: al cargar, lees la preferencia guardada y la aplicas antes del primer render (evita el *flash* blanco→oscuro); al cambiarla, la guardas.
3. **Respetar `prefers-color-scheme`**: si el usuario **nunca** eligió, se apoya en la preferencia del sistema (`window.matchMedia('(prefers-color-scheme: dark)')`). Es decir: tu elección manual gana; si no hay elección, manda el sistema.

```js
// Al arrancar (antes de pintar): guardada > sistema > claro
const saved = localStorage.getItem('theme'); // 'dark' | 'light' | null
const system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
document.documentElement.classList.toggle('dark', saved ?? system === 'dark');
```

Detalle de M12: recuerda definir `darkMode: 'class'` en la config de Tailwind, o las variantes `dark:` no harán nada y pensarás que has roto el CSS.

---

## i18n

- Diccionario ES/EN; `lang` en html; no concatenar oraciones (placeholders).

Internacionalizar **no** es "meter Google Translate": es estructurar los textos para poder cambiar de idioma sin reescribir componentes.

- Diccionario ES/EN: dos archivos (o uno por locale) con claves estables: `es = { login.title: 'Iniciar sesión' }`, `en = { login.title: 'Sign in' }`. Los componentes piden `t('login.title')`; cambiar de idioma = cambiar de diccionario, cero toques de JSX.
- `lang` en html: `<html lang="es">` (o la que corresponda). Es lo que usan lectores de pantalla y buscadores para saber cómo pronunciar/interpretar la página; actualízalo al cambiar de idioma.
- **No concatenar oraciones (placeholders)**: el error clásico es `'Hola ' + user + ', tienes ' + n + ' mensajes'`. En otro idioma el orden es distinto, hay plural/género, etc. Usa placeholders: `'Hola {name}, tienes {count} mensajes'` y una función `t('greeting', { name, count })` que sustituya. Así cada idioma define su propio orden sin tocar el código.

```js
// ❌ Frágil
t('greeting') + name + t('mid') + count + t('end')

// ✅ Con placeholders
t('greeting', { name, count }) // es: "Hola {name}, tienes {count} mensajes"
                               // en: "Hi {name}, you have {count} messages"
```

---

## Testing

- Unit (hooks/lógica) + componentes + 1 integration del happy path.
- CI obligatorio (M19).

Cuando la app ya tiene features, el testing es lo que te deja refactorizar sin miedo. El plan mínimo recomendado (y que encaja con el checklist M23):

| Nivel | Qué cubres | Ejemplo |
|-------|------------|---------|
| **Unit** | Hooks y lógica pura | `useAuth` guarda/limpia token; `formatKpi` |
| **Componentes** | Render + interacción aislada | El form de login muestra errores con `aria-invalid` |
| **Integration (×1)** | El happy path de punta a punta | Login → navega a dashboard → ve el KPI |

- Unit (hooks/lógica) + componentes + 1 integration del happy path.

No persigas el 100 %: persigue la **crítica** (auth, roles, CRUD). Una suite de 10 tests que cubren permisos y validación vale más que 200 tests de snapshots inútiles. La cobertura ≥ 80 % de la Opción B se consigue cubriendo eso, no testeando getters trivialísimos.

- CI obligatorio (M19).

Los tests solo cuentan si **corren automáticamente en cada PR**: para eso existe la plantilla de M19. Un test que nadie ejecuta en CI es un test que se romperá en silencio. En la Unidad 03 vemos el pipeline exacto; aquí basta con decidirlo: `test:run` en CI, obligatorio, sin excepciones.

---

## Errores comunes

| Error | Consecuencia | Qué hacer |
|-------|--------------|-----------|
| Proteger solo en el front (esconder botones) | `curl` / DevTools saltan el guard | Autorización **siempre en la API** (403), guard en rutas solo para UX |
| Confundir 401 y 403 | Redirects a login infinitos o mensajes falsos | 401 = no autenticado (refresh/login); 403 = sin permiso (mostrar denegación) |
| Ignorar los errores 400/422 del server | El usuario ve "error genérico" | Mapear la respuesta de validación a cada campo del form |
| Poner `Content-Type` manual en `FormData` | El servidor no parsea el multipart (falta boundary) | Dejar que el navegador lo ponga |
| Validar tipo/tamaño de archivo solo en el cliente | Se salta con DevTools | Validación doble: cliente (UX) + servidor (verdad) |
| Estado de página/filtros solo en React state | Al recargar o compartir link, se pierde | Query params en la URL como fuente de verdad |
| Cargar librería de gráficos en el bundle inicial | First load lento para todos | `React.lazy` + `Suspense` (M6/M20) |
| Toasts sin región `aria-live` | Invisibles para lectores de pantalla | `aria-live="polite"` (crítico) en la cola |
| Concatenar strings de idioma | Frases rotas en ES/EN, orden imposible | Placeholders en el diccionario |
| Olvidar `darkMode: 'class'` o el `lang` | Dark no aplica; a11y/SEO mal | Config Tailwind + `<html lang>` actualizado |
| Tests que no corren en CI | Se rompen sin que nadie note | Plantilla M19 con `test:run` obligatorio |

---

## Conceptos clave

- **Guard de ruta**: componente que envuelve rutas y redirige/oculta según auth o rol (UX, no seguridad).
- **Autorización en API**: comprobación de rol/ownership en el servidor; única barrera real (`403`).
- **401 vs 403**: sin autenticar vs autenticado sin permiso.
- **Query params**: `?page=&status=` como estado de lista compartible y recargable.
- **Paginación servidor**: responde `items + page + total`; evita cargar "todo".
- **Validación cliente vs servidor**: UX inmediata vs fuente de verdad (400/422).
- **`FormData`**: cuerpo multipart para subidas; el navegador fija el `boundary`.
- **KPIs**: indicadores clave del dashboard; requieren estados loading/error/success.
- **Code-splitting / lazy**: cargar gráficos y pantallas pesadas fuera del bundle inicial (M6/M20).
- **Cola de notificaciones**: lista de toasts con id/tipo/tiempo de vida.
- **`aria-live`**: región que el lector de pantalla anuncia automáticamente (accesibilidad de toasts).
- **SSE / WebSocket**: canales servidor→cliente (SSE) o bidireccional (WS) para tiempo real (M17); opcional.
- **Dark mode por clase**: `class="dark"` en `<html>` + variantes `dark:` de Tailwind; persistencia + `prefers-color-scheme`.
- **i18n**: diccionario por locale + `t(clave)`; `lang` en html; placeholders en vez de concatenación.
- **Plural/género/placeholders**: razón por la que no se concatenan oraciones traducidas.
- **Pirámide de tests**: unit → componentes → pocos integration; priorizar lógica crítica.
- **CI obligatorio**: los tests corren en cada PR (M19); sin CI, no cuentan como red de seguridad.

---

## Autoevaluación

**1. El botón "Borrar usuario" no aparece para el rol `user`, pero alguien llama con `DELETE /api/users/123` usando su propio token. ¿Qué debe devolver la API y por qué el guard de React no sirve aquí?**

<details>
<summary>Respuesta</summary>

La API debe responder **`403 Forbidden`** (está autenticado, pero su rol `user` no tiene ese permiso; `401` sería si ni siquiera tuviera token válido). El guard de React **no sirve** porque es solo presentación: el bundle JS es público y cualquiera puede ejecutar la petición con DevTools, `curl` o Postman sin pasar por tu UI. La autorización real se valida en el servidor en cada request.

</details>

**2. Tu lista de productos pierde los filtros al recargar la página. ¿Cómo lo arreglas y qué query params usarías?**

<details>
<summary>Respuesta</summary>

Mover el estado de página/filtros del `useState` a la **URL** (query params con `useSearchParams`): p. ej. `/productos?page=2&status=active&sort=name`. El efecto de carga lee esos parámetros, y los controles (paginación, selects) solo actualizan la URL. Así recargar, compartir el link o usar "atrás/adelante" del navegador conserva el estado; el backend recibe los mismos params (`GET /api/items?page=2&status=active`).

</details>

**3. ¿Por qué no debes poner `Content-Type: multipart/form-data` a mano en el `fetch` con `FormData`? ¿Y qué doble validación necesita una subida de archivos?**

<details>
<summary>Respuesta</summary>

Porque el navegador debe generar el parámetro `boundary` que separa las partes del multipart; si fijas el `Content-Type` tú (sin boundary), el servidor no puede parsear el body. Doble validación: **cliente** para UX (previsualizar errores de tipo/tamaño al instante) y **servidor** como fuente de verdad (allowlist de MIME/extensión, límite de tamaño, nombre seguro, storage no público sin auth), porque el cliente se salta con DevTools.

</details>

**4. Tu i18n actual hace `'Hola ' + name + ', tienes ' + count + ' mensajes'`. ¿Qué problema tiene y cómo lo modelas con placeholders?**

<details>
<summary>Respuesta</summary>

El problema es que **congela el orden y la gramática** del español: en inglés el nombre puede ir al principio, y con plural/género/u otros idiomas la frase necesita estructuras distintas (`{count} mensaje/mensajes`, idiomas con orden SOV, etc.). No se pueden construir oraciones concatenando fragmentos. Solución: una clave con **placeholders** — `es: 'Hola {name}, tienes {count} mensajes'`, `en: 'Hi {name}, you have {count} messages'` — y una función `t('greeting', { name, count })` que sustituya los valores. Cada locale reordena la frase libremente sin tocar componentes; además, `count` permite aplicar reglas de plural por idioma.

</details>
