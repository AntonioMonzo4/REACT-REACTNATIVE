# Unidad 06 — Optimización: React.memo, useMemo, useCallback, Profiler

## Ciclo de render (repaso)

Un componente re-renderiza si: props cambiaron, estado cambió, el padre re-renderizó (por defecto), o el contexto que consume cambió.

## React.memo

```jsx
const ListaItem = memo(function ListaItem({ item, onToggle }) {
  return <li onClick={() => onToggle(item.id)}>{item.title}</li>
})
```

Salta el re-render si las **props son shallow-iguales**. Solo compensa si:

1. El componente es **caro** o se monta muchas veces, **y**
2. Las props **no** son funciones/objetos nuevos cada render (usa `useCallback` / valores primitivos).

Comparador custom (con cuidado):

```jsx
memo(Comp, (prev, next) => prev.id === next.id)
```

## useMemo

Memoriza **cálculos** (`filter`, `sort`, reducciones caras) cuando cambian las deps.

## useCallback

Memoriza **funciones** (ver M5). Imprescindible junto a `memo` en hijos.

## Regla de oro

> **Mide primero, memóiza después.** `useMemo`/`useCallback`/`memo` tienen coste; abusar empeora legibilidad y a veces rendimiento.

## Herramientas

1. **React DevTools Profiler**: grabar interacción, ver qué componentes re-renderizaron y por qué (props/state/context/parent).
2. **highlight updates** en DevTools.
3. **Lighthouse / Bundle analyzer** (M20): tamaño de chunks, no solo renders.

## Patrones frecuentes

| Problema | Solución |
|----------|----------|
| Lista grande + filtro | `useMemo` en el array filtrado |
| Hijo memo con callbacks nuevos | `useCallback` + deps correctas |
| Context caro | partir contextos; valor con `useMemo` |
| Estado que solo usa un subtree | bajar el estado |

## En el ejemplo

`src/components/DemoOptimizacion.jsx` — lista con `memo`, `useCallback` en el handler y `useMemo` en el score del item.
