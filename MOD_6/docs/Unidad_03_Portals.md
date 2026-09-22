# Unidad 03 — Portals

## Qué es

Un **portal** renderiza un hijo en un nodo del DOM **fuera** de la jerarquía del padre, manteniendo el contexto de React (events, context).

```jsx
import { createPortal } from 'react-dom'

function Modal({ open, children, onClose }) {
  if (!open) return null

  return createPortal(
    <div className="overlay" role="dialog" aria-modal="true">
      <div className="modal">
        {children}
        <button type="button" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>,
    document.body,
  )
}
```

## Para qué sirve

- Modals, toasts, tooltips, dropdowns con `overflow: hidden` en ancestros.
- Evitar que `z-index`, `transform` o `overflow` del layout atrapen el UI flotante.

## Cómo no romper el árbol lógico

- Sigue siendo **hijo en React**: recibe props y **context** del punto donde se llama.
- El **evento bubbling** de React sigue la jerarquía React, no solo la del DOM.
- Crea el nodo destino una sola vez (p. ej. `#modal-root` en `index.html`) y haz `getElementById` de forma segura.

```html
<!-- index.html -->
<body>
  <div id="root"></div>
  <div id="modal-root"></div>
</body>
```

```jsx
const root = document.getElementById('modal-root')
```

## Accesibilidad mínima

- `role="dialog"`, `aria-modal="true"`.
- Cerrar con `Escape` y evitar clicks que “pasen” sin querer.
- Devolver foco al botón que abrió el modal.

## En el ejemplo

`src/components/DemoPortal.jsx` — modal montado en `#modal-root`.
