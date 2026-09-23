# Unidad 02 — Render Props

## Idea

El componente **no dibuja nada fijo**: pasa un callback que **recibe datos/estados** y devuelve la UI:

```jsx
<MousePosition>
  {({ x, y }) => <p>El ratón está en {x}, {y}</p>}
</MousePosition>
```

```jsx
function MousePosition({ children }) {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  useEffect(() => {
    const fn = (e) => setPos({ x: e.clientX, y: e.clientY })
    window.addEventListener('pointermove', fn)
    return () => window.removeEventListener('pointermove', fn)
  }, [])
  return children(pos)
}
```

## Variantes

- **Function as child** (arriba).
- **Function as prop**: `<MousePosition render={({x}) => ...} />` (más explícito).

## Render props vs HOC vs custom hooks

| Patrón | Mejor para |
|--------|------------|
| Custom hook | **lógica** sin UI (default moderno) |
| Render prop / children fn | lógica **+** UI configurable en runtime |
| HOC | inyectar props en componentes de terceros / legacy |

Muchos render props de hoy son hooks: `useMouse()` + componente propio.

## Errores comunes

- Callback que crea componente nuevo cada render → pierde estado (define fuera o usa `useMemo`).
- Anidar 5 render props → pirámide; extrae hooks.

## En el ejemplo

`MouseTracker.jsx` + hook `useMouse` comparados lado a lado.
