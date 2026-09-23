# Unidad 02 — Params (parámetros de ruta)

## Objetivos

- Comprender qué son los **params dinámicos** (`:nombre`) y por qué una misma ruta puede mostrar muchos recursos distintos.
- Leer el valor de los params con el hook `useParams()` dentro del componente de la ruta.
- Definir rutas con **varios params** y paths compuestos (p. ej. `/orgs/:orgId/proyectos/:projectId`).
- Construir enlaces dinámicos con `Link` y template strings de JavaScript.
- Diferenciar **params** de **query params** (identidad del recurso vs. filtros) con una tabla comparativa.
- Detectar y corregir los errores típicos: `:nombre` olvidado, filtros mal ubicados y comparaciones con strings.

## Requisitos

- Haber completado la **Unidad 01** de este módulo: `BrowserRouter`, `Routes`, `Route` y `Link` instalados con `pnpm add react-router-dom`.
- Saber desestructurar arrays/objetos en JSX (`const { id } = ...`) y usar template strings (`` `/usuarios/${id}` ``).
- Recordar de M4–M6 cómo crear componentes funcionales y recibir datos por props (aquí los datos llegan desde la URL).

## Qué son los params dinámicos

En la Unidad 01 cada ruta era fija: `/acerca` siempre muestra lo mismo. Pero un listado de usuarios no puede tener una ruta escrita a mano por cada persona (`/usuarios/1`, `/usuarios/2`, …). La solución es dejar **huecos** en el `path` marcados con dos puntos:

```jsx
<Route path="/usuarios/:userId" element={<UserDetail />} />
```

`:userId` es un **param dinámico**: le dice al router “esta posición de la URL puede ser **cualquier segmento**”. Cuando alguien visita `/usuarios/42`, React Router coincide la ruta y extrae `42`; si visita `/usuarios/ana`, extrae `ana`. El mismo componente `<UserDetail />` se monta en ambos casos, pero **sabrá a quién está mirando** gracias al valor del param.

**Analogía:** es como un formulario con un hueco: “Libro nº ____”. El hueco está siempre en la misma posición, pero quien lo rellena varía. La ruta es el formulario; el param es el número que se rellena.

**Por qué importa:** el param conecta la **URL** (lo que el usuario comparte o guarda en favoritos) con el **componente** (lo que React renderiza). Sin params, cada detalle necesitaría su propia ruta definida a mano.

## Ejemplo: UserDetail con useParams

El valor del param no llega por props: se lee con el hook **`useParams`**, que devuelve un objeto con todos los params de la ruta coincidente.

```jsx
import { useParams } from 'react-router-dom'

function UserDetail() {
  const { userId } = useParams()   // { userId: "42" } desde /usuarios/42
  return <h1>Usuario {userId}</h1>
}
```

Paso a paso:

1. El `path` declara el hueco: `/usuarios/:userId`.
2. El usuario entra a `/usuarios/42`.
3. `Routes` elige esa `Route` (en v6, el ranking puntúa el tramo fijo `/usuarios` y el dinámico `:userId`).
4. Al montar, `UserDetail` llama a `useParams()` y recibe `{ userId: "42" }`.
5. Desestructuras `userId` y lo usas para el título, para fetchear datos, para resaltar la fila de una tabla, etc.

Fíjate en el comentario: **el valor es `"42"` (string), no `42` (number)**. Ese detalle causa errores muy comunes; lo verás ampliado en “Errores comunes”.

En el ejemplo del curso, `src/pages/UserDetail.jsx` implementa exactamente este patrón: recibe el `userId` de la URL y muestra el detalle, mientras la lista de usuarios enlaza a cada perfil.

## Varias params y path compuesto

Nada impide tener **más de un** hueco, incluso con tramos fijos entre medias. Un path compuesto identifica un recurso dentro de otro (contexto jerárquico):

```jsx
<Route path="/orgs/:orgId/proyectos/:projectId" element={<Proyecto />} />

const { orgId, projectId } = useParams()   // /orgs/acme/proyectos/7
```

Con la URL `/orgs/acme/proyectos/7`:

- `orgId` → `"acme"`
- `projectId` → `"7"`

Los nombres de los params en `useParams()` son **exactamente** los que escribiste tras los dos puntos en el `path`. Si cambias `:orgId` por `:id` en la ruta, debes cambiar también la desestructuración.

**Por qué importa:** los paths compuestos hacen que la URL describa la jerarquía real de tus datos (`/orgs/.../proyectos/...`), lo que facilita permisos (¿pertenecen org y project juntos?) y enlaces relativos en rutas anidadas (U03/U04).

## Enlaces con params

Para llegar a una ruta dinámica, **construyes la URL con un template string**: unes la parte fija con el valor real del recurso.

```jsx
<Link to={`/usuarios/${user.id}`}>{user.name}</Link>

// o con ruta relativa desde un layout (ver Unidad 04):
<Link to="detalle">   // resuelve relativa a la ruta actual
```

- **Template string:** `` `/usuarios/${user.id}` `` genera `/usuarios/1`, `/usuarios/2`, etc., según el elemento del `map`. Como la ruta declarada es `/usuarios/:userId`, cualquier valor en esa posición coincide.
- **Ruta relativa:** `to="detalle"` (sin barra inicial) se resuelve **respecto a la ruta actual**, útil dentro de layouts anidados. Es un tema de la Unidad 04; aquí solo recuerda que un `to` puede ser absoluto (`/usuarios/1`) o relativo (`detalle`).

La regla práctica: **el `path` define el patrón; el `to` concreta un caso concreto** del patrón.

## Params vs query params

Ambos viajan en la URL, pero responden a preguntas distintas. Usa esta tabla como criterio de diseño:

| | Params (`/usuarios/42`) | Query (`/usuarios?rol=admin`) |
|---|-------------------------|-------------------------------|
| Identifican | ** recurso / página ** | filtros, orden, paginación, flags |
| SEO / compartir | sí (parte de la URL canónica) | sí |
| Obligatorios para render | normalmente sí | no (tienen defaults) |

- **Params** = *¿qué recurso muestro?* `/usuarios/42` es **el** usuario 42: sin ese segmento la página no sabe a quién referirse. Cambiar el param cambia de página/entidad.
- **Query params** = *¿cómo lo muestro o qué subconjunto?* `/usuarios?rol=admin&page=2` sigue siendo la **misma** página de usuarios, solo que filtrada u ordenada. Puedes quitar `?rol=admin` y la ruta sigue siendo válida (con default: “todos los roles”).

Compartir la URL con params comparte **el recurso**; compartir la URL con query comparte **la vista/filtro**. Ambas son útiles: solo no mezcles los conceptos.

**Por qué importa:** si pones el identificador en la query (`/usuarios?id=42`) o un filtro en el param (`/usuarios/admin`), tus URLs dejan de leerse como un mapa de la app y te compliquen el SEO, los enlaces canónicos y el trabajo con `useParams`.

## Errores comunes

### 1. Olvidar `:` en el path → `undefined` en `useParams`

El símbolo `:` es lo que marca el segmento como dinámico. Sin él, el router busca un segmento literal llamado “userId”, que nunca existirá, y `useParams` no encuentra nada:

```jsx
// Mal: falta los dos puntos, "userId" se trata como texto fijo
<Route path="/usuarios/userId" element={<UserDetail />} />

// Con /usuarios/42: userId no coincide con "userId" → la ruta no matchea
// y/o useParams() no trae el valor esperado

// Bien: hueco dinámico real
<Route path="/usuarios/:userId" element={<UserDetail />} />
```

```jsx
function UserDetail() {
  const { userId } = useParams()
  // Sin ":", userId es undefined → "Usuario " sale vacío en pantalla
  return <h1>Usuario {userId}</h1>
}
```

**Solución:** revisa que **cada** segmento variable del `path` empiece por `:` y que el nombre desestructurado coincida letra por letra.

### 2. Meter filtros en params (identidad vs. filtro)

```jsx
// Mal: "admin" es un filtro, no identifica un usuario ni una página propia
<Route path="/usuarios/:filtro" element={<Usuarios />} />

// Bien: el filtro vive en la query y puede omitirse
// /usuarios?rol=admin  →  useParams() no interviene; se lee con useSearchParams (U futuro)
<Link to="/usuarios?rol=admin">Solo admins</Link>
```

**Solución:** si **sin** el valor la página sigue siendo la misma página (solo cambia el subconjunto), va en **query param**. Si sin el valor **no hay página** (no sabes qué mostrar), va en **param de ruta**. Consulta la tabla “Params vs Query Params”.

### 3. Params son strings: `Number()` y `"42" !== 42`

`useParams` siempre devuelve **cadenas de texto**, venga de donde venga la URL. Comparar con `===` contra un número o usar el valor en aritmética produce bugs silenciosos:

```jsx
const { userId } = useParams()          // siempre string: "42"

userId === 42        // false  → "42" !== 42
userId + 1           // "421"  → concatenación, no suma
```

```jsx
// Bien: convierte explícitamente cuando necesitas un número
const id = Number(userId)               // 42 (number)
if (Number.isNaN(id)) return <NotFound />

if (id === 42) { /* ... */ }            // comparación correcta

// También válido para mostrar/comparar como texto:
userId === "42"                         // true (ambos strings)
```

**Solución:** decide el tipo **a propósito**: `Number(userId)` (o `parseInt(userId, 10)`) para matemáticas/IDs numéricos; mantén el string solo si el identificador es alfanumérico. Nunca asumas que el param “ya es número” porque en la URL no lleve comillas.

### 4. Desestructurar un nombre distinto al del path

```jsx
// Mal: el path dice :userId, pero pides id
<Route path="/usuarios/:userId" element={<UserDetail />} />
const { id } = useParams()   // undefined

// Bien: nombres idénticos
const { userId } = useParams()
```

**Solución:** el key del objeto devuelto por `useParams()` es literalmente el texto después de `:` en el `path`.

## En el ejemplo

`src/pages/UserDetail.jsx` — `/usuarios/:userId` con `useParams` y lista de usuarios.

Ábrelo junto a `src/App.jsx` (de `../EJEMPLO_REACT_ROUTER/`): verás la `Route` con `:userId` declarada en las rutas y, en la lista, un `<Link to={`/usuarios/${user.id}`}>` construyendo la URL con template string. Es el ciclo completo: **ruta con hueco → enlace que lo rellena → componente que lo lee**.

## Conceptos clave

- Los **params dinámicos** (`:nombre`) dejan huecos en el `path`; una misma ruta atiende infinitos valores.
- El valor se lee con **`useParams()`**, que devuelve un objeto (`{ userId: "42" }`) listo para desestructurar.
- Los **paths compuestos** (`/orgs/:orgId/proyectos/:projectId`) reflejan jerarquías; cada `:param` aporta su clave al objeto de params.
- Los enlaces se construyen con **template strings** (`` to={`/usuarios/${id}`} ``); el `path` define el patrón, el `to` concreta un caso.
- **Params identifican el recurso** (obligatorios para saber qué pintar); **query params** son filtros/orden/paginación con defaults opcionales.
- **Los params son strings:** usa `Number()` (o `parseInt`) antes de comparar con números o sumar; `"42" !== 42`.
- Olvidar el `:` o renombrar el segmento provoca `undefined` en `useParams`; los nombres deben coincidir exactamente.

## Autoevaluación

<details>
<summary>Respuesta</summary>

`:` marca un segmento como **dinámico**: acepta cualquier valor y React Router lo extrae como propiedad del objeto que devuelve `useParams()`. Sin los dos puntos, `/usuarios/userId` busca el texto literal `userId` en la URL; al no encontrarlo, la ruta no coincide (o no se aporta el valor) y en el componente obtienes `undefined`.

</details>

<details>
<summary>Respuesta</summary>

Van en **params de ruta** (los identificadores): el nombre de usuario y el ID del proyecto (`/orgs/:orgId/proyectos/:projectId`), porque sin ellos no sabes **qué** mostrar. Van en **query params** (los filtros): el tema y el idioma (`?tema=react&idioma=es`), porque con la misma página puedes mostrar otro subconjunto y ambos son opcionales con valores por defecto. Criterio: si quitas el dato y la página sigue siendo la misma, es query; si sin él no hay página, es param.

</details>

<details>
<summary>Respuesta</summary>

Porque `useParams()` siempre devuelve **strings**: `userId` es `"42"`, no `42`. Por eso `userId === 42` es `false` y `userId + 1` da `"421"` (concatena). Solución: convierte con `Number(userId)` o `parseInt(userId, 10)` antes de comparar o calcular, y verifica que no sea `NaN`.

</details>

<details>
<summary>Respuesta</summary>

```jsx
<Route path="/orgs/:orgId/proyectos/:projectId" element={<Proyecto />} />

// Con /orgs/acme/proyectos/7
const { orgId, projectId } = useParams()   // { orgId: "acme", projectId: "7" }
```

Los keys del objeto son **exactamente** los nombres escritos tras `:` en el `path`. Si renombras `:orgId` a `:id`, también debes cambiar la desestructuración; si no, leerás `undefined`.

</details>
