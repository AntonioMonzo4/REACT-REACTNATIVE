# Unidad 02 — Functional Components y composición

## Objetivos

- Crear functional components: funciones que devuelven JSX, sin usar `this`.
- Distinguir la forma `function` de la forma de flecha (arrow) y cuándo conviene cada una.
- Componer la interfaz anidando componentes dentro de `App` con `import` + `<Nombre />`.
- Usar `Fragment` (`<>...</>` o `<Fragment>`) para agrupar sin añadir un nodo extra al DOM.
- Aplicar `className` en los componentes para estilizarlos con CSS.
- Inspeccionar props y estado de los componentes con la pestaña **Components** de React DevTools.

## Requisitos

- Haber leído la [Unidad 01 — Introducción a React](./Unidad_01_Introduccion_a_React.md): qué es React, JSX y sus reglas (raíz única, `className`, llaves `{...}`), Virtual DOM y `key`.
- JavaScript básico: funciones, parámetros, desestructuración de objetos y módulos (`import`/`export`) — contenido de **M2/M3**.
- Tener a mano los archivos del ejemplo: [`Navbar.jsx`](../EJEMPLO_REACT/src/components/Navbar.jsx), [`App.jsx`](../EJEMPLO_REACT/src/App.jsx) y [`main.jsx`](../EJEMPLO_REACT/src/main.jsx).

---

## Functional component

**Qué significa.** Un **componente funcional** es simplemente una **función que devuelve JSX**. No es una clase, no tiene `this`, y su único trabajo es recibir datos (por `props`) y devolver cómo debe verse esa pieza de interfaz.

**Por qué importa.** Es la forma recomendada de escribir React desde los hooks (React 16.8+). Al ser funciones normales, son fáciles de leer, de testear y de reutilizar: entradas claras (`props`) y una salida clara (JSX).

Ejemplo real del curso, con el archivo [`../EJEMPLO_REACT/src/components/Navbar.jsx`](../EJEMPLO_REACT/src/components/Navbar.jsx):

```jsx
function Navbar() {
  const name = "Esto es un nombre ANTONIO"
  return (
    <nav className="navbar">
      <p className="nav-name">{name}</p>
    </nav>
  )
}
export default Navbar
```

Desglose de lo que ocurre:

| Parte | Qué es | Qué hace |
|---|---|---|
| `function Navbar()` | Declaración de la función | El nombre con mayúscula inicial identifica al componente |
| `const name = ...` | Lógica interna | Cualquier JavaScript normal dentro del componente |
| `return ( ... )` | JSX devuelto | Describe qué se pinta en pantalla |
| `export default Navbar` | Export por defecto | Permite importarlo en otros archivos |

### Sin `this`

**Qué significa.** En los componentes-clase antiguos había que escribir `this.props.nombre` o `this.setState(...)`. En los componentes funcionales **no existe `this`**: los datos entran como parámetros de la función y el estado se gestiona con hooks (más adelante).

**Por qué importa.** Menos ceremonia y menos errores clásicos de "olvidé el `function` y `this` apuntaba a otro sitio". Simplemente llamas a la función con sus parámetros.

### `function` frente a flecha (arrow)

También puedes declarar el componente con **función flecha**:

```jsx
const Props = ({ title }) => {
  // ...
}
```

Comparación de los dos estilos:

| Estilo | Ejemplo | Características |
|---|---|---|
| Declaración `function` | `function Navbar() { return ... }` | Nombre visible en errores y DevTools; estilo del ejemplo del curso |
| Función flecha | `const Navbar = () => ...` | Sintaxis más corta; no tiene su propio `this` (aquí no importa: no usamos `this`) |

Ambos son válidos y equivalentes a efectos prácticos. En este curso usaremos mayormente la forma `function`, como en [`Navbar.jsx`](../EJEMPLO_REACT/src/components/Navbar.jsx).

---

## Composición en `App`

**Qué significa.** La **composición** es montar la pantalla final anidando componentes dentro de otros, igual que anidas etiquetas HTML. `App` es el componente raíz que reúne al resto: navbar arriba, secciones debajo.

```jsx
function App() {
  return (
    <>
      <Navbar />
      <main className="app-main">
        <section className="example">...</section>
      </main>
    </>
  )
}
```

**Por qué importa.** En lugar de escribir una función gigante con toda la página, cada pieza vive en su archivo (`Navbar`, `Props`, `Eventos`...) y `App` solo decide cómo se ordenan. Así el código se divide en partes pequeñas, reutilizables y fáciles de cambiar por separado.

### Import + `<Nombre />` con mayúscula inicial

Para usar un componente en otro archivo hacen falta dos cosas:

1. **`import`**: traer el componente desde su archivo.
2. **Uso como etiqueta**: `<Nombre />`, empezando siempre por **mayúscula**.

```jsx
import Navbar from "./components/Navbar"

function App() {
  return (
    <>
      <Navbar />
      <main className="app-main">
        <section className="example">...</section>
      </main>
    </>
  )
}
```

| Regla | Ejemplo | Por qué |
|---|---|---|
| Mayúscula inicial en el nombre | `<Navbar />`, no `<navbar />` | React distingue: mayúscula = componente propio; minúscula = etiqueta HTML |
| `import` antes de usarlo | `import Navbar from "./components/Navbar"` | Sin import, JS no sabe qué es `Navbar` |
| Import por defecto ↔ `export default` | `export default Navbar` / `import Navbar from ...` | Si el archivo hace export con llaves `{ Navbar }`, el import también lleva llaves |

**Analogía.** Componer es como montar un mueble de LEGO: tienes piezas hechas (`Navbar`, botones, secciones) y en `App` decides en qué orden encajarlas. Si mañana cambias la barra de navegación, solo tocas `Navbar.jsx` y el resto de la aplicación no se entera.

---

## Fragment

**Qué significa.** JSX exige **un único elemento raíz**. Cuando necesitas varios elementos hermanos, puedes agruparlos con `Fragment`, que existe en dos formas: el Fragment con nombre (`<Fragment>`) y el atajo `<>...</>`.

```jsx
import { Fragment } from "react"
<Fragment>
  <a href="/cart">Cart</a>
</Fragment>
// o atajo: <> ... </>
```

**Por qué importa (y por qué no un `div`).** Podrías envolver todo en un `<div>`, pero eso **añade un nodo extra al DOM**. Ese div de relleno puede romper tus estilos: afecta a flexbox y grid, añade niveles a los selectores CSS y contamina la estructura. **Fragment agrupa sin añadir nodo extra al DOM**: en el navegador solo aparecen los elementos reales.

| Opción | Nodos que añade al DOM | Riesgo |
|---|---|---|
| `<div>` solo para agrupar | 1 extra | Puede romper flex/grid y selectores CSS |
| `<Fragment>` o `<> ... </>` | 0 | Ninguno: estructura limpia |

En el ejemplo, [`Navbar.jsx`](../EJEMPLO_REACT/src/components/Navbar.jsx) usa `<Fragment>` alrededor del enlace *Cart*:

```jsx
<li className="nav-item">
  <Fragment>
    <a href="/cart" className="nav-link">Cart</a>
  </Fragment>
</li>
```

Cuando no necesitas atributos en el fragment, el atajo `<> ... </>` (como usa [`App.jsx`](../EJEMPLO_REACT/src/App.jsx) para envolver `<Navbar />` y `<main>`) es más corto y significa exactamente lo mismo.

---

## Estilos con `className`

**Qué significa.** En JSX el atributo de clases CSS es `className` (no `class`, que es palabra reservada de JavaScript). Funciona igual que la etiqueta `class` del HTML: asocias un nombre de clase y defines sus estilos en un archivo CSS.

```jsx
<main className="app-main">
  <button className="counter">+</button>
</main>
```

**Por qué importa.** Los estilos viven fuera del componente: tú pones `className` en el JSX y el CSS decide cómo se ve. Las clases CSS se importan en el componente o en `main.jsx`/`App.jsx`:

```jsx
import "../style/Navbar.css"

function Navbar() {
  return (
    <nav className="navbar">
      <p className="nav-name">...</p>
    </nav>
  )
}
```

| Situación | Qué ocurre |
|---|---|
| `className="navbar"` en JSX | El elemento lleva `class="navbar"` en el DOM real |
| `import "../style/Navbar.css"` | Al cargar el componente se aplican sus reglas CSS |
| CSS importado en `main.jsx` o `App.jsx` | Los estilos afectan a toda la aplicación |

---

## React DevTools

**Qué significa.** **React DevTools** es una extensión del navegador (Chrome, Firefox, Edge...) que añade una pestaña especial para ver tu aplicación React. Su pieza central es la pestaña **Components**: muestra el **árbol de componentes** y, al seleccionar uno, permite inspeccionar sus **props** y su **estado** en cada render.

**Por qué importa.** Con las DevTools normales ves el DOM final; con React DevTools ves el *cómo y el porqué* de esa interfaz: qué datos recibió cada componente y cómo se compone el árbol. Es la herramienta con la que depuras de verdad.

| Pestaña | Qué muestra | Cuándo usarla |
|---|---|---|
| **Elements** (del navegador) | El DOM real: etiquetas, estilos, `class="navbar"` | Para revisar CSS y estructura HTML resultante |
| **Components** (React DevTools) | Árbol de componentes, props, estado, hooks | Para ver qué recibe `<Navbar />`, si renderiza y con qué datos |

Cómo usarlo en la práctica:

1. Instala la extensión oficial "React Developer Tools".
2. Abre tu app de ejemplo y pulsa `F12` para abrir las herramientas del navegador.
3. Entra en la pestaña **Components** y busca `<App />` en la raíz.
4. Haz clic en `<Navbar />` (o cualquier hijo): a la derecha verás sus **props** y, si tuviera estado u hooks, también esos valores.
5. Cambia un dato de la app y observa cómo se actualiza el árbol en cada render.

---

## En el ejemplo

- [`Navbar.jsx`](../EJEMPLO_REACT/src/components/Navbar.jsx) — componente funcional con `function`, uso de `Fragment` y `className`.
- [`App.jsx`](../EJEMPLO_REACT/src/App.jsx) — composición de secciones: `import` de componentes y su anidación dentro de `<>` / `<main className="app-main">`.
- [`main.jsx`](../EJEMPLO_REACT/src/main.jsx) — punto de entrada: monta `<App />` dentro de `StrictMode`.

---

## Errores comunes

**1. Olvidar el `import` del componente.**

```jsx
// ❌ Error: Navbar is not defined
function App() {
  return <Navbar />
}

// ✅ Solución: importarlo antes de usarlo
import Navbar from "./components/Navbar"

function App() {
  return <Navbar />
}
```

**2. Usar `this.props` dentro de un componente funcional.**

```jsx
// ❌ Error: en una función no hay `this`; saldrá undefined
function Saludo() {
  return <p>{this.props.name}</p>
}

// ✅ Solución: recibir props como parámetro (y desestructurar si quieres)
function Saludo({ name }) {
  return <p>{name}</p>
}
```

**3. Escribir el componente en minúsculas o sin el `return`.**

```jsx
// ❌ "navbar" en minúscula se trata como etiqueta HTML, no como componente;
//    y una función sin return devuelve undefined
function navbar() {
  <nav className="navbar"></nav>
}
return <navbar />

// ✅ Solución: mayúscula inicial y return con JSX
function Navbar() {
  return <nav className="navbar"></nav>
}
return <Navbar />
```

**4. Mezclar export por defecto con import con llaves.**

```jsx
// Navbar.jsx
export default function Navbar() {
  return <nav className="navbar" />
}

// ❌ App.jsx: si Navbar usa `export default`, el import NO lleva llaves
import { Navbar } from "./components/Navbar"

// ✅ Solución: import sin llaves para export default
import Navbar from "./components/Navbar"
```

---

## Conceptos clave

- **Functional component**: función que devuelve JSX; recibe `props` y no tiene `this`.
- **`function` vs flecha**: dos formas válidas de declarar el componente; el ejemplo del curso usa `function`.
- **Composición**: `App` anida otros componentes como etiquetas HTML (`<Navbar />`, secciones...).
- **`import` + `<Nombre />`**: hay que importar el componente y usarlo con **mayúscula inicial** (minúscula = etiqueta HTML).
- **`export default` ↔ import sin llaves**: el import con `{...}` solo si el export también lleva llaves.
- **Fragment**: `<Fragment>` o el atajo `<>...</>` agrupan elementos **sin añadir un nodo extra al DOM** (evita `div` que rompen estilos).
- **`className`**: el atributo de clases CSS en JSX; los estilos se importan en el componente o en `main.jsx`/`App.jsx`.
- **React DevTools**: extensión con pestaña **Components** para inspeccionar el árbol, las props y el estado en cada render.
- **Archivos de referencia**: [`Navbar.jsx`](../EJEMPLO_REACT/src/components/Navbar.jsx) (componente), [`App.jsx`](../EJEMPLO_REACT/src/App.jsx) (composición), [`main.jsx`](../EJEMPLO_REACT/src/main.jsx) (punto de entrada).

---

## Autoevaluación

**1. ¿Qué es un functional component y por qué no usa `this`?**

<details>
<summary>Respuesta</summary>

Es una función normal de JavaScript que devuelve JSX. No usa `this` porque los datos llegan como parámetros (`props`) y el estado, cuando lo haya, se maneja con hooks; no hay una instancia de clase de la que colgar propiedades, como ocurría con los componentes-clase antiguos.

</details>

**2. Para componer un componente dentro de `App`, ¿qué dos pasos hacen falta y por qué el nombre debe empezar por mayúscula?**

<details>
<summary>Respuesta</summary>

1) `import Navbar from "./components/Navbar"` (o el import con llaves si el export no es por defecto). 2) Usarlo como etiqueta `<Navbar />`. La mayúscula inicial es la forma en que React distingue tus propias etiquetas (componentes) de las etiquetas HTML en minúscula (`<nav>`, `<div>`...).

</details>

**3. ¿Por qué se usa Fragment en vez de un `div` para agrupar elementos?**

<details>
<summary>Respuesta</summary>

Porque Fragment (`<>...</>` o `<Fragment>`) agrupa sin añadir un nodo extra al DOM. Un `div` de relleno sí se inserta en el DOM y puede romper estilos de flexbox/grid o añadir niveles innecesarios a los selectores CSS.

</details>

**4. En React DevTools, ¿qué diferencia hay entre la pestaña Elements y la pestaña Components? ¿Qué verías al inspeccionar `<Navbar />`?**

<details>
<summary>Respuesta</summary>

**Elements** muestra el DOM real del navegador (etiquetas, clases, estilos); **Components** muestra el árbol de componentes de React. Al seleccionar `<Navbar />` en Components ves sus props (datos que recibe), y si tuviera estado o hooks, también esos valores en cada render.

</details>
