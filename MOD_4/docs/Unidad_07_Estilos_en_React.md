# Unidad 07 — Estilos en React

## Opciones

| Método | Uso en este ejemplo |
|--------|---------------------|
| CSS clásico (`import './style/x.css'`) | ✅ `index.css`, `App.css`, `Navbar.css` |
| CSS Modules | no usado aquí |
| Styled components / Tailwind | ver proyectos avanzados |

## Variables y dark mode (`index.css`)

```css
:root {
  --accent: #aa3bff;
  --border: #e5e4e7;
  color-scheme: light dark;
}

@media (prefers-color-scheme: dark) {
  :root {
    --accent: #c084fc;
    --bg: #16171d;
  }
}
```

CSS custom properties + `prefers-color-scheme` → tema claro/oscuro sin JS.

## Capas del ejemplo

- `index.css` — reset, tipografía, variables, `#root`.
- `App.css` — `.app-main` (flex, centrado), `.example` (cards), botones/inputs.
- `Navbar.css` — `.navbar` flex horizontal.

```jsx
import "../style/Navbar.css"

function Navbar() {
  return <nav className="navbar">...</nav>
}
```

Las importaciones de CSS son globales; los nombres de clase deben ser únicos
(o usar CSS Modules: `styles.navbar`).

## En el ejemplo

[`EJEMPLO_REACT/src/style/`](../EJEMPLO_REACT/src/style/).
