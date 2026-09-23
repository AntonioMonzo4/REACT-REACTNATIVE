# Unidad 03 — Memoización y Profiler

## Qué memoiza React

| API | Evita |
|-----|-------|
| `React.memo` | re-render si props **iguales** (shallow) |
| `useMemo` | recalcular valor caro |
| `useCallback` | nueva identidad de función (para props/efectos) |
| State colgado abajo | re-render de padres innecesarios |

```jsx
const Filas = memo(function Filas({ items, onSelect }) { … })
```

**No** memoizes sin costo de re-render alto o referencia inestable en props.

## Colgar estado

```jsx
// Mal: cambio en input re-renderiza toda la lista
<input onChange={…} /> <Lista items={items} />

// Mejor: estado en el hijo que solo se re-renderiza a sí mismo
<FiltroYLista />
```

## React DevTools Profiler

1. Abrir Profiler → **Record** → interactuar → **Stop**.
2. Flamegraph: barras ancha = tiempo de commit/render.
3. “Highlight updates” en Settings → ver qué parpadea.
4. Filtrar por commit; comparar grabaciones.

## why-did-you-render (WDUR)

```js
// solo en desarrollo
if (import.meta.env.DEV) {
  const whyDidYouRender = await import('@welldone-software/why-did-you-render')
  whyDidYouRender(React, { trackAllPureComponents: true })
}
```

Marca renders evitables (`<>` en la lista de updates).

## Trazas útiles

- `[WhyDidYouRender]` → identidad de props.
- `Profiler` de React → regresión entre builds.
