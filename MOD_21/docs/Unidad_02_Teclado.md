# Unidad 02 — Navegación por teclado

## Reglas

- **Tab** en orden DOM (evitar `tabIndex > 0` salvo casos raros).
- Elementos interactivos → botones/enlaces nativos, no `div onClick`.
- **Skip link** al contenido:

```jsx
<a href="#main" className="skip">Saltar al contenido</a>
<main id="main" tabIndex={-1}>…</main>
```

- Modales: trap de foco, `Escape` cierra, foco al opener al salir.
- Menús: flechas + `aria-expanded`, `role="menu"` solo si imitas menú real.

## En React (trap simple)

```jsx
function Modal({ open, onClose, children }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    ref.current?.focus()
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null
  return (
    <div role="dialog" aria-modal="true" aria-labelledby="dlg-t" tabIndex={-1} ref={ref}>
      {children}
    </div>
  )
}
```

## Errores comunes

- `onClick` en `<div>`/`<span>` sin rol ni teclado → inaccesible.
- Portal de menú **detrás** del foco (orden de tabulación).
- Foco pierde al refrescar listas (recuperar foco o `aria-live`).
