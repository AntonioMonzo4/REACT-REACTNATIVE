# Unidad 01 — Introducción a React

## ¿Qué es React?

Librería de JavaScript (Meta/Facebook) para construir interfaces: UI declarativa a partir de **componentes** reutilizables que se actualizan cuando cambia el estado.

## Historia (resumen)

- Creado en 2013 para Facebook; open source en GitHub.
- Evolución: `React.createClass` → ES6 classes → **function components + hooks** (React 16.8+).

## Virtual DOM

React no pinta el DOM real en cada cambio:

1. Renderiza un **árbol de elementos** en memoria (React elements).
2. Calcula el **diff** con el DOM actual.
3. Aplica solo los cambios mínimos (`reconciliación`).

Resultado: menos operaciones costosas sobre el DOM del navegador.

## JSX

Sintaxis parecida a HTML dentro de JS/TS. Babel (o SWC en Vite) lo transpila a `createElement(...)`:

```jsx
const element = <h1 className="titulo">Hola</h1>
// ≈ React.createElement("h1", { className: "titulo" }, "Hola")
```

Reglas:

- Una raíz (o `<>...</>` / `<Fragment>`).
- `className` en lugar de `class`.
- Expresiones entre llaves `{...}`.

## Babel / compilador

En proyectos modernos (Vite) el transformador de JSX es **SWC**, con el mismo papel que Babel: JSX/TS → JS.

## `key` y reconciliación

En listas, cada hijo necesita `key` **única** (el `id` del recurso). React la usa para emparejar elementos entre renders y evitar re-renderizar todo.

## React Strict Mode

```jsx
<StrictMode>
  <App />
</StrictMode>
```

Activa avisos en desarrollo: dobles renderizados, efectos montados/desmontados, APIs obsoletas. No afecta al build de producción.

## En el ejemplo

[`../EJEMPLO_REACT/src/main.jsx`](../EJEMPLO_REACT/src/main.jsx) — `StrictMode` + montaje de `App`.
