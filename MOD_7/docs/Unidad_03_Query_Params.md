# Unidad 03 — Query Params

## Objetivos

- Entender qué son los query params (`?clave=valor`) y para qué sirven en una app React con router.
- Diferenciar cuándo usar **params** de ruta (`/productos/:id`) y cuándo usar **query params** (`?orden=precio`).
- Dominar el hook `useSearchParams`: leer, escribir, borrar y conservar claves.
- Aplicar las 4 buenas prácticas (URL como fuente de verdad, defaults con `??`, `replace: true`, `Number()` al leer).
- Explicar por qué `setSearchParams` re-renderiza el componente igual que `setState`.
- Revisar el ejemplo real en `../EJEMPLO_REACT_ROUTER/src/pages/Search.jsx`.

## Requisitos

- Haber completado **U01 y U02** (rutas básicas y params de ruta con `useParams`).
- Conocer `<Link>`, `Route` y `element` de React Router v6.

---

## ¿Qué son los query params?

Los query params son la parte de la URL que va **después del signo `?`**. Tienen forma `clave=valor` y pueden encadenarse con `&`:

```text
/buscar?q=react&page=2
```

Aquí hay dos query params: `q` con valor `react` y `page` con valor `2`. Si abres esa URL en el navegador, la app arranca en la página 2 del buscador con la búsqueda "react" ya aplicada. Ese es el poder de los query params: **la URL recuerda el estado**.

Piensa en una analogía: los **params de ruta** (`/productos/:id`) son como el *dirección exacta* de una casa (identifican **qué** recurso visitas). Los **query params** son como las *instrucciones dentro* de la casa: **cómo** quieres verlo (¿ordenado por precio? ¿en la página 3? ¿solo los disponibles?).

### Estado compartible

Los query params sirven para guardar lo que llamamos **estado compartible**: información que:

1. El usuario debe poder **compartir** (copiar el enlace y que otra persona vea lo mismo).
2. Debe **sobrevivir** a un refresh de la página (F5 no pierde los filtros).
3. Cambia mientras el usuario **interactúa** (escribe, pagina, ordena).

Los casos típicos son:

- **Filtros**: `?categoria=tecnologia&disp=si`
- **Búsqueda**: `?q=react`
- **Página**: `?page=2`
- **Orden**: `?orden=precio-asc`

Si guardas esto solo en `useState`, al compartir el enlace la otra persona verá una lista sin filtros y tendrá que volver a configurar todo. Con los query params, el enlace **es** el estado.

---

## `useSearchParams`

React Router expone el hook `useSearchParams`, que funciona muy parecido a `useState`: devuelve un par `[valor, setter]`.

- `searchParams`: un objeto con la query actual (para **leer**).
- `setSearchParams`: una función para **escribir** una nueva query (esto cambia la URL).

### Ejemplo completo: componente `Buscar`

```jsx
import { useSearchParams } from 'react-router-dom'

function Buscar() {
  const [searchParams, setSearchParams] = useSearchParams()
  const q = searchParams.get('q') ?? ''
  const page = Number(searchParams.get('page') ?? '1')

  const handleSubmit = (e) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    setSearchParams({ q: fd.get('q'), page: '1' })
  }

  const nextPage = () => setSearchParams({ q, page: String(page + 1) })

  return (
    <form onSubmit={handleSubmit}>
      <input name="q" defaultValue={q} />
      <button type="submit">Buscar</button>
      <button type="button" onClick={nextPage}>Pág. {page + 1}</button>
    </form>
  )
}
```

Vamos línea a línea para que quede claro **qué significa** cada cosa:

- **`searchParams.get('q') ?? ''`**: leemos la clave `q`. Si no existe en la URL, `get` devuelve `null`, y con `??` la convertimos en cadena vacía. Así el input nunca recibe `null`.
- **`Number(searchParams.get('page') ?? '1')`**: lo mismo con `page`, pero además convertimos a número porque todo llega como **string** desde la URL. Si no hay `page`, asumimos la 1.
- **`handleSubmit`**: al enviar el formulario leemos los campos con `FormData` (sin necesidad de estado controlado) y escribimos la query nueva. Fíjate que `page` vuelve a `'1'`: cada búsqueda nueva **reinicia la paginación**.
- **`nextPage`**: construye una query nueva con la página incrementada. Usamos `String(page + 1)` porque los valores de la query **siempre son strings**.
- **`defaultValue={q}`**: usamos `defaultValue` (no `value`) para que el input no esté "controlado"; React Router ya es quien manda sobre el estado del campo vía la URL.

---

## Tabla API de `useSearchParams`

| Acción | Código |
|--------|--------|
| Leer | `searchParams.get('q')` |
| Escribir (reemplaza todas) | `setSearchParams({ q: 'react' })` |
| Borrar una clave | `searchParams.delete('q'); setSearchParams(searchParams)` |
| Conservar el resto | Copia el objeto actual y mezcla cambios |

Dos matices importantes que suelen confundir al principio:

1. **`setSearchParams` reemplaza toda la query.** Si la URL es `?q=react&page=2` y llamas `setSearchParams({ orden: 'precio' })`, el resultado es `?orden=precio`… se fueron `q` y `page`. Por eso la fila "conservar el resto" dice que debas **copiar y mezclar**:

   ```jsx
   setSearchParams({ ...searchParams, orden: 'precio' })
   ```

2. **`searchParams.delete` no es inmutable.** Mutas el objeto y luego lo pasas a `setSearchParams` para que React Router lo aplique.

### ¿Por qué `setSearchParams` re-renderiza?

`setSearchParams` actualiza la URL **y** dispara un re-render del componente, exactamente igual que `setState`. La razón es que la URL es estado de la aplicación: al cambiar, cualquier componente que leyó esa query (`useSearchParams`, o incluso `useLocation().search`) necesita volver a pintarse con los nuevos valores. Por eso, tras `setSearchParams({ q: 'vue', page: '1' })`, el input, el texto de página y cualquier lista filtrada se actualizan **sin** que tengas que llamar a ningún `setState` adicional.

---

## 4 buenas prácticas (ampliadas)

### 1. La URL es la fuente de verdad

Guards en la URL lo que el usuario debiera poder **compartir o recargar**. Si los filtros viven solo en `useState`, pasa esto:

- Usuario configura `q=react`, `page=2`, ordena por precio.
- Copia el enlace de la barra de direcciones y se lo manda a un compañero.
- El compañero abre el enlace y ve… la lista por defecto, sin filtros. El estado se perdió.

Con la URL como fuente de verdad, **el enlace mismo es el estado**: quien lo abra verá exactamente lo mismo. En una app con búsqueda y paginación esto no es un lujo, es lo que la gente espera (piensa en cómo funcionan Google, Mercado Libre o cualquier listado).

### 2. Defaults con `??`, no obligatorios en la URL

La URL limpia (`/buscar`) debe funcionar tan bien como la URL con todo (`/buscar?q=react&page=3`). Declara los defaults **en el código**:

```jsx
const q = searchParams.get('q') ?? ''
const page = Number(searchParams.get('page') ?? '1')
```

Así no tienes que rellenar la URL con `page=1` cada vez que el usuario hace una búsqueda.

### 3. `replace: true` para no ensuciar el botón Atrás

Cada `setSearchParams` normal **empuja** una entrada en el historial. Si el usuario escribe carácter a carácter y haces `setSearchParams` en cada tecla, el botón Atrás del navegador se volverá inútil: tendría que retroceder "react", "reac", "rea"… Para escrituras de "paso intermedio" (por ejemplo, escribir en un input y escribir la query en vivo), usa:

```jsx
setSearchParams({ q: texto }, { replace: true })
```

`replace` **reemplaza** la entrada actual del historial en lugar de apilar una nueva. Reserva el empuje normal (sin `replace`) para cambios "definitivos" como enviar el formulario o pasar de página.

### 4. `Number()` y validación al leer

**Todo llega como string.** `?page=abc` te dará `NaN` si haces `Number(...)` sin verificar, y `?page=-5` te dará una página imposible. Valida al leer:

```jsx
const raw = Number(searchParams.get('page') ?? '1')
const page = Number.isFinite(raw) && raw >= 1 ? Math.floor(raw) : 1
```

El usuario puede editar la URL a mano; no des por buena la primera entrada.

---

## Params vs Query (recordatorio)

- **Params** → identifican *qué* página/recurso (`/productos/:id`).
- **Query** → cómo *ver* o *filtrar* (`?orden=precio&disp=si`).

Pregunta rápida para decidir: *¿sin este valor la página sería "otra página distinta"?* Si la respuesta es sí (cambia el recurso), usa **param**. Si la respuesta es no (es la misma página vista de otra forma), usa **query**. `/productos/zapatos` y `/productos/remeiras` son páginas distintas; `/productos?orden=precio` y `/productos?orden=nuevo` son la misma página con distinto orden.

---

## Errores comunes

### Error: "no me llega el parámetro" / siempre `null`

```text
const q = searchParams.get('q')   // null aunque "sé" que lo escribí
```

**Causa:** escribiste con `setSearchParams({ q: 'react' })` pero lees una clave distinta, o esperabas `searchParams.q` (no existe: se lee con `.get()`).
**Solución:** lee siempre con `searchParams.get('clave')` y aplica un default `?? ''`.

### Error: al escribir una clave desaparecen las demás

```jsx
// URL era ?q=react&page=2
setSearchParams({ orden: 'precio' })
// Ahora es ?orden=precio  (q y page se borraron)
```

**Solución:** `setSearchParams` **reemplaza** toda la query. Mezcla con spread:

```jsx
setSearchParams({ ...searchParams, orden: 'precio' })
```

### Error: el botón Atrás no funciona (o hay 30 entradas de historial)

**Causa:** `setSearchParams` en cada tecla, empujando una entrada al historial.
**Solución:** `setSearchParams(params, { replace: true })` para escrituras intermedias.

### Error: `NaN` o página "0" rara

```text
?page=abc  →  Number('abc')  →  NaN
```

**Causa:** convertir a número sin validar.
**Solución:** `Number()` + comprobar `Number.isFinite` y `>= 1`, con fallback a `1`.

### Error: los filtros "se pierden" al compartir el enlace

**Causa:** el estado vive en `useState` y la URL no refleja nada.
**Solución:** convierte la URL en la fuente de verdad: lee con `useSearchParams` y escribe con `setSearchParams`; `useState` solo para estado efímero que no deba compartirse.

---

## Conceptos clave

- Query params = parte `?clave=valor&...` de la URL; estado **compartible** (filtros, búsqueda, página, orden).
- Ejemplo canónico: `/buscar?q=react&page=2`.
- `useSearchParams` devuelve `[searchParams, setSearchParams]`, al estilo `useState`.
- Leer: `searchParams.get('q')` (devuelve string o `null`).
- Escribir: `setSearchParams({ ... })` **reemplaza** toda la query y **re-renderiza** el componente.
- Borrar una clave: `delete` + `setSearchParams`; conservar el resto: copia con spread.
- Defaults en código con `??`; historial con `{ replace: true }`; convertir con `Number()` y validar.
- **Params** = *qué* recurso; **Query** = *cómo* se ve/filtra.
- Ejemplo real: `../EJEMPLO_REACT_ROUTER/src/pages/Search.jsx`.

---

## Autoevaluación

**1. En `/buscar?q=react&page=2`, ¿cómo lees la página como número y con su default?**

<details>
<summary>Respuesta</summary>

```jsx
const page = Number(searchParams.get('page') ?? '1')
```

`get` devuelve `'2'` (string) o `null` si no existe; `?? '1'` pone el default y `Number` convierte a número.
</details>

**2. Tu URL es `?q=react&page=2` y quieres añadir `orden=precio` sin perder `q` ni `page`. ¿Qué haces?**

<details>
<summary>Respuesta</summary>

```jsx
setSearchParams({ ...searchParams, orden: 'precio' })
```

`setSearchParams` reemplaza toda la query, así que hay que copiar el objeto actual y mezclar el cambio.
</details>

**3. ¿Por qué `setSearchParams({ page: '3' })` actualiza la página visible sin llamar a `setState`?**

<details>
<summary>Respuesta</summary>

Porque `setSearchParams` cambia la URL **y** dispara un re-render (igual que `setState`). Los componentes que leen la query con `useSearchParams` se vuelven a pintar con los valores nuevos.
</details>

**4. ¿Es `id` un param o un query? ¿Y `orden` en `/productos?orden=precio`?**

<details>
<summary>Respuesta</summary>

`id` es **param** de ruta (`/productos/:id`): identifica *qué* recurso. `orden` es **query** (`?orden=precio`): indica *cómo* ver la misma página.
</details>

---

## En el ejemplo

`../EJEMPLO_REACT_ROUTER/src/pages/Search.jsx` — `q` y `page` en la query con formulario + botones.
