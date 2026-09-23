# Unidad 04 — Eventos

Los eventos en React son una forma de manejar las interacciones del usuario
con la interfaz (clic, teclado, envío de formulario...). Se pasan como **props**
a los elementos JSX (`onClick`, `onChange`…).

## onClick, onChange, onSubmit

```jsx
const Eventos = () => {
  const handleClick = () => {
    alert("Has hecho clic en el botón")
  }

  const handleChange = (e) => {
    console.log("Valor del input:", e.target.value)
  }

  return (
    <div>
      <button onClick={handleClick}>Haz clic aquí</button>
      <input type="text" onChange={handleChange} placeholder="Escribe algo..." />
    </div>
  )
}
```

| Evento | Cuándo |
|--------|--------|
| `onClick` | Clic en un elemento |
| `onChange` | Cambia el valor de un input |
| `onSubmit` | Se envía un formulario (`e.preventDefault()` habitual) |

Formulario típico:

```jsx
<form onSubmit={(e) => { e.preventDefault(); /* ... */ }}>
  <input onChange={(e) => setNombre(e.target.value)} />
  <button type="submit">Enviar</button>
</form>
```

## Otros eventos frecuentes

`onMouseEnter`, `onMouseLeave`, `onKeyDown`, `onKeyUp`, `onFocus`, `onBlur`,
`onDoubleClick`, `onContextMenu`, `onDrag`, `onDrop`, `onScroll`, `onLoad`,
`onError`, `onInput`, `onSelect`, `onReset`.

Patrón: **camelCase** + función manejadora (inline o nombrada). El evento
(`e`) expone `e.target.value`, `e.preventDefault()`, etc.

## En el ejemplo

[`Eventos.jsx`](../EJEMPLO_REACT/src/components/Eventos.jsx) — catálogo completo en comentarios.
