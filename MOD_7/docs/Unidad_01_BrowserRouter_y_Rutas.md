# Unidad 01 — BrowserRouter y Rutas

## Objetivos

- Instalar `react-router-dom` con `pnpm` y comprender por qué una SPA necesita un router propio.
- Entender la estructura mínima de una app con rutas: `BrowserRouter`, `Routes`, `Route`, `Link`, `NavLink` y `Navigate`.
- Diferenciar el papel de cada componente de React Router mediante una tabla de referencia rápida.
- Configurar enlaces de navegación activos con `NavLink` y su `className` funcional basado en `isActive`.
- Conocer las variantes de router (`BrowserRouter`, `HashRouter`, `MemoryRouter`) y cuándo conviene usar cada una.
- Aplicar las 4 reglas de oro de React Router v6+ para evitar bugs de navegación.

## Requisitos

- Haber completado los módulos **M4–M6**: componer JSX, crear componentes funcionales, pasar props y manejar listas con `map`.
- Saber importar módulos con `import { ... } from '...'` y usar exports con nombre.
- Familiaridad con `src/App.jsx` como raíz de la app y con `main.jsx` como punto de montaje.

## ¿Por qué una SPA necesita un router?

En una web **multi-página** tradicional, cada clic en un enlace dispetcha una petición al servidor y el navegador **recarga la página entera**: pierdes el estado de React, parpadea la pantalla y el servidor decide qué HTML devolver. Piensa en un formulario a medio cumplimentar: si el usuario navega, todo desaparece.

Una **SPA** (Single Page Application) en cambio carga **un solo HTML** y React reemplaza el contenido en el cliente. Si seguimos usando `<a href="/acerca">`, el navegador haría su recarga por defecto y rompería la ilusión de continuidad. Ahí entra `react-router-dom`: **simula** el cambio de página leyendo y escribiendo la **History API** del navegador (`history.pushState` / `popstate`). El usuario ve URLs distintas (`/`, `/acerca`, `/usuarios/42`), puede usar el botón Atrás, compartir enlaces… pero **nunca hay recarga real**: solo React desmonta un componente y monta otro.

**Analogía del mapa de metro:** el navegador es el vagón, la URL es la estación en la que estás, y el router es el mapa que decide qué estación corresponde a cada vía. `Link` es el pasillo entre estaciones (te mueve sin salir del tren); un `<a href>` clásico sería… bajarte y volver a subir (recarga).

## Instalación

El paquete oficial no está en React; se instala aparte en el proyecto:

```bash
pnpm add react-router-dom
```

Una vez instalado, todos los componentes se importan desde `'react-router-dom'`. No hace falta configurar nada más: el router empieza a leer la URL del navegador en cuanto montamos `<BrowserRouter>`.

## Estructura básica

Este es el esqueleto completo de una app con rutas. Léelo línea a línea: cada pieza tiene un rol.

```jsx
import { BrowserRouter, Routes, Route, Link, NavLink, Navigate } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <nav>
        <NavLink to="/">Inicio</NavLink>
        <NavLink to="/acerca">Acerca</NavLink>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/acerca" element={<Acerca />} />
        <Route path="/antiguo" element={<Navigate to="/acerca" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
```

¿Qué está pasando aquí?

1. **`BrowserRouter`** envuelve toda la app (incluido el `<nav>`): es el que “escucha” la URL. Sin él, `Link` y `useParams` no funcionan.
2. **`<nav>` con `NavLink`**: los enlaces del menú. No usan `href`, usan `to`, y React Router intercepta el clic para navegar sin recargar.
3. **`Routes`** es el contenedor de definiciones: recibe todas las `Route` y elige **cuál coincide** con la URL actual.
4. Cada **`Route`** es un par `path` → `element`: “si la URL es `/acerca`, monta `<Acerca />`”.
5. **`Navigate`** en `/antiguo` redirige automáticamente a `/acerca` (útil cuando renombras rutas antiguas). El prop `replace` reemplaza la entrada del historial en lugar de apilar una nueva (evita bucles al pulsar Atrás).
6. **`path="*"`** es el comodín: si ninguna ruta de arriba coincide, se renderiza `<NotFound />` (nuestra página 404).

### Tabla de componentes

| Componente | Papel |
|------------|--------|
| `BrowserRouter` | Envuelve la app y lee la URL del historial del navegador |
| `Routes` | Contenedor: elige **una** ruta que coincida |
| `Route` | Asocia `path` → `element` (componente) |
| `Link` | `<a>` que navega sin recargar (SPA) |
| `NavLink` | `Link` + clase activa automática (`isActive`) |
| `Navigate` | Redirección programática (equivale a un redirect) |
| `path="*"` | Comodín: 404 si ninguna ruta coincide |

**Por qué importa cada uno:**

- `BrowserRouter` es el **contexto compartido**: todos los demás componentes leen de él. Envuelve “el mundo” de la navegación.
- `Routes` + `Route` son el **directorio de estaciones**: declaras qué pantalla va en cada URL.
- `Link` y `NavLink` son los **botones del usuario**: navegan manteniendo viva la SPA. `NavLink` además sabe si está “activa”.
- `Navigate` es la **flecha automática**: la usas dentro de un `Route` (redirect) o condicionalmente en un componente (guarda de acceso).
- `path="*"` es la **red de seguridad**: sin él, una URL desconocida dejaría la zona de `Routes` vacía y el usuario vería blanco.

## NavLink activo

`NavLink` recibe una función en `className` a la que le entrega `isActive` (booleano). Así pintas la pestaña seleccionada sin escribir lógica a mano:

```jsx
<NavLink
  to="/acerca"
  className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
>
  Acerca
</NavLink>
```

Cuando la URL actual coincide con `to`, React Router llama a tu función con `{ isActive: true }` y el enlace recibe la clase `nav-link active`. Fuera de esa ruta, solo `nav-link`. Es el patrón estándar para menús y pestañas: el estado “activo” lo calcula el router, no tú.

> Nota: la función recibe además `isPending` (útil con rutas que cargan datos), pero en esta unidad solo necesitamos `isActive`.

## Variantes de router

No hay un único router: `react-router-dom` exporta varios “envoltorios” que deciden **de dónde sale la URL**. Elige según el entorno:

| Router | Cuándo usarlo |
|--------|---------------|
| `BrowserRouter` | Producción normal (URLs limpias: `/usuarios/1`) |
| `HashRouter` | Hosting estático sin rewrite de rutas (URLs `/#/usuarios/1`) |
| `MemoryRouter` | Tests (no toca el historial real) |

- **`BrowserRouter`** lee la URL real del navegador (`/usuarios/1`). Es lo que usarás casi siempre en desarrollo y producción; requiere que el servidor devuelva `index.html` para cualquier ruta (SPA rewrite).
- **`HashRouter`** guarda las rutas después del `#` (`/#/usuarios/1`). El servidor solo ve `/`, así que funciona en hostings estáticos (GitHub Pages, carpetas compartidas) **sin** configurar rewrites. La contrapartida: URLs menos limpias.
- **`MemoryRouter`** mantiene el historial “en memoria”, sin tocar el navegador. Ideal para tests con React Testing Library: puedes renderizar la app en la ruta que quieras y comprobar la navegación sin afectar al historial real de la pestaña.

**Por qué importa:** cambiar de router no obliga a reescribir `Routes`, `Route` o `Link`: solo cambias el envoltorio exterior. Desacoplas “qué rutas tengo” de “de dónde leo la URL”.

## Reglas

1. **`BrowserRouter` envuelve todo** el que necesita navegar (típicamente en `main.jsx` o `App.jsx`).
   Si un componente con `Link` o `useParams` queda **fuera** del `BrowserRouter`, React lanza un error de contexto (p. ej. *useNavigate() may be used only in the context of a `<Router>`*). Por eso la convención es montarlo lo más arriba posible: envuelve `<nav>`, `<Routes>` y cualquier cosa que navegue.

2. Dentro de `Routes`, **solo se renderiza la ruta que coincide** (no varias a la vez).
   A diferencia de renderizar varios `if`, `Routes` hace el trabajo de comparar la URL actual con cada `path` y montar **el mejor candidato**. Si defines `/` y `/acerca`, estar en `/` no pinta también `/acerca`: el contenedor elige una sola. (Puedes anidar rutas con `<Outlet />`, pero eso es U03.)

3. El orden de los `<Route>` importa menos que en v6… en React Router v6+ el **ranking** es automático (más específico gana), pero evita solapes confusos.
   Antes de v6, el primer `path` que coincidía “ganaba” y un `path="/"` mal colado podía capturar todo. En v6 el router **puntúa** cada ruta (los tramos fijos pesan más que los dinámicos y que `*`) y elige la más específica. Aun así, dos rutas ambiguas (p. ej. `/usuarios/nuevo` y `/usuarios/:id`) conviene escribirlas sin ambigüedades para que el comportamiento sea evidente al leer el código.

4. `Link`/`NavLink` **nunca** con `href` a mano: pierdes la navegación SPA.
   `<a href="/acerca">` dispara la recarga por defecto del navegador: React se desmonta, se pierde el estado y ves un parpadeo. El atributo correcto es `to="/acerca"`. Reserva los `<a href>` para enlaces **externos** (otro dominio) o anclas internas de la propia página (`#seccion`).

## En el ejemplo

En `../EJEMPLO_REACT_ROUTER/` puedes ver todo esto aplicado:

- `src/App.jsx` define `<BrowserRouter>`, `Routes` y el `NavLink` del `Layout`.
- `src/components/Layout.jsx` (o el equivalente del ejemplo) aporta la estructura compartida: el `<nav>` con los `NavLink` y el punto de salida donde React Router monta la ruta activa. Cada página del ejemplo se renderiza **dentro** de ese envoltorio, siguiendo la regla 1.

Abre esos archivos mientras lees: verás que la estructura de esta unidad es exactamente la que ya conoces, solo que explicada pieza por pieza.

## Errores comunes

### 1. `<Link>` con `href` en vez de `to`

```jsx
// Mal: recarga la página completa, se pierde el estado de React
<a href="/acerca">Acerca</a>

// Bien: navegación SPA sin recarga
<Link to="/acerca">Acerca</Link>
```

**Solución:** usa siempre `Link`/`NavLink` con `to` para rutas internas. Si necesitas un enlace externo de verdad, ahí sí `<a href="https://...">` con `target`/`rel` según convenga.

### 2. Olvidar envolver con `BrowserRouter`

```text
Error: useNavigate() may be used only in the context of a <Router> component.
```

```jsx
// Mal: <Routes> queda sin contexto
function App() {
  return <Routes>...</Routes>
}

// Bien: el Router envuelve todo lo que navega
function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  )
}
```

**Solución:** monta `<BrowserRouter>` en `App.jsx` o `main.jsx`, por encima de cualquier `Link`, `NavLink`, `Navigate`, `useNavigate` o `useParams`.

### 3. Usar `path="*"` pero no definir una ruta “catch-all”

```jsx
// Si el usuario entra a /no-existe y no hay "*", Routes no monta nada (blanco)
<Routes>
  <Route path="/" element={<Home />} />
</Routes>

// Bien: comodín al final
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="*" element={<NotFound />} />
</Routes>
```

**Solución:** añade siempre `path="*"` para capturar URLs desconocidas y mostrar tu 404.

### 4. Pintar la ruta activa a mano con `window.location`

```jsx
// Mal: duplicas lógica y rompes si cambias de HashRouter a BrowserRouter
className={window.location.pathname === '/acerca' ? 'active' : ''}

// Bien: deja que NavLink lo calcule con isActive
className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
```

**Solución:** usa `NavLink` con `className` (o `style`) funcional; el router ya conoce la URL actual.

## Conceptos clave

- Una **SPA** no recarga: `react-router-dom` gestiona la URL con la **History API** para que Atrás/Adelante y enlaces compartidos funcionen sin refresco.
- **Instalación:** `pnpm add react-router-dom`.
- **`BrowserRouter`** envuelve la app y aporta el contexto de navegación.
- **`Routes`** elige **una sola** ruta coincidente; **`Route`** une `path` con `element`.
- **`Link`/`NavLink`** usan `to` (nunca `href`) para navegar sin recargar.
- **`NavLink` + `className` funcional con `isActive`** pinta el menú activo de forma declarativa.
- **`Navigate`** hace redirects (con `replace` para no apilar historial).
- **`path="*"`** es el 404/comodín cuando nada coincide.
- **Variantes:** `BrowserRouter` (producción), `HashRouter` (hosting estático sin rewrite), `MemoryRouter` (tests).
- **Reglas:** Router envuelve todo · solo una ruta renderiza · ranking automático en v6+ (evita solapes) · nunca `href` a mano.

## Autoevaluación

<details>
<summary>Respuesta</summary>

Porque en una SPA el HTML ya está cargado y React solo intercambia componentes. Un `<a href>` normal le dice al navegador que vuelva a pedir el documento al servidor (recarga completa: se pierde el estado y hay parpadeo). `Link` intercepta el clic, actualiza la URL con la History API y deja que React monte/desmonte componentes sin refrescar la página.

</details>

<details>
<summary>Respuesta</summary>

| Componente | Rol |
|---|---|
| `BrowserRouter` | Envuelve la app y lee la URL del historial |
| `Routes` | Contenedor que elige **una** ruta que coincida |
| `Route` | Empareja `path` con `element` |
| `Link` | Enlace SPA (`to`, sin recarga) |
| `NavLink` | `Link` con estado activo (`isActive`) |
| `Navigate` | Redirect programático |
| `path="*"` | Comodín / 404 |

</details>

<details>
<summary>Respuesta</summary>

Pasan dos cosas: (1) si pulsas un `<a href>`, pierdes la navegación SPA porque el navegador recarga el documento entero; (2) si defines `path="*"` pero no la ruta comodín, una URL desconocida no coincide con ninguna `Route` y `Routes` no monta nada (pantalla en blanco). La solución es usar `Link to="..."` y añadir siempre `<Route path="*" element={<NotFound />} />`.

</details>

<details>
<summary>Respuesta</summary>

- **`BrowserRouter`:** producción normal con URLs limpias (`/usuarios/1`), siempre que el servidor haga rewrite a `index.html`.
- **`HashRouter`:** hosting estático sin capacidad de rewrite (GitHub Pages, etc.); la ruta viaja tras el `#` (`/#/usuarios/1`).
- **`MemoryRouter`:** tests; guarda el historial en memoria y no toca el historial real del navegador.

Solo cambia el envoltorio: `Routes`, `Route` y `Link` se usan igual en los tres.

</details>
