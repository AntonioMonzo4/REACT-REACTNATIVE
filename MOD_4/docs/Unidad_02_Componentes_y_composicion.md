# Unidad 02 — Functional Components y composición

## Functional component

Función que devuelve JSX. Recibe `props` y no tiene `this`:

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

También en flecha: `const Props = ({ title }) => { ... }`.

## Composición en `App`

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

- Componentes anidados como etiquetas HTML.
- `import` + uso con `<Nombre />` (Mayúscula inicial).

## Fragment

Agrupa sin nodo extra en el DOM:

```jsx
import { Fragment } from "react"
<Fragment>
  <a href="/cart">Cart</a>
</Fragment>
// o atajo: <> ... </>
```

## Estilos con `className`

```jsx
<main className="app-main">
  <button className="counter">+</button>
</main>
```

Las clases CSS se importan en el componente o en `main.jsx`/`App.jsx`.

## React DevTools

Extensión del navegador: pestaña **Components** para inspeccionar árbol, props y estado en cada render.

## En el ejemplo

- [`Navbar.jsx`](../EJEMPLO_REACT/src/components/Navbar.jsx) — componente, `Fragment`, `className`.
- [`App.jsx`](../EJEMPLO_REACT/src/App.jsx) — composición de secciones.
- [`main.jsx`](../EJEMPLO_REACT/src/main.jsx) — punto de entrada.
