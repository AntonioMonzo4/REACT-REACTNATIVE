# Ejemplo React Avanzado — Módulo 6

Proyecto de práctica del **Módulo 6 (React Avanzado)**. Vite + React.

## Qué practica este ejemplo

Los seis bloques del Módulo 6 en una sola app: Context API con Provider y hook (tema claro/oscuro), custom hooks (`useLocalStorage`, `useDebounce`), un modal montado con `createPortal`, un ErrorBoundary de clase que captura un error lanzado a propósito, carga diferida con `React.lazy` + `Suspense` (chunk aparte) y optimización de renders con `React.memo`, `useCallback` y `useMemo`.

## Cómo recorrerlo

Orden sugerido: `ThemeContext`/`ThemeProvider` → hooks (`useTheme`, `useLocalStorage`, `useDebounce`) → `DemoPortal` → `ErrorBoundary`/`DemoErrorBoundary` → `DemoLazy` → `DemoOptimizacion`.

## Comandos

```bash
pnpm install
pnpm dev
pnpm lint
pnpm build
```

## Qué demuestra cada archivo

| Archivo | Concepto |
|---------|----------|
| `src/context/ThemeContext.js` + `ThemeProvider.jsx` | Context API, Provider, `useMemo` en el value |
| `src/hooks/useTheme.js` | Custom hook de contexto |
| `src/hooks/useLocalStorage.js` | Custom hook con lazy init + persistencia |
| `src/hooks/useDebounce.js` | Debounce de un valor |
| `src/components/DemoPortal.jsx` | `createPortal` en `#modal-root` |
| `src/components/ErrorBoundary.jsx` | Boundary de clase |
| `src/components/DemoErrorBoundary.jsx` | Lanzar error en render y recuperarse |
| `src/components/DemoLazy.jsx` + `HeavyPanel.jsx` | `React.lazy` + `Suspense` (chunk aparte) |
| `src/components/DemoOptimizacion.jsx` | `React.memo`, `useCallback`, `useMemo` |

## Temario Módulo 6 — estado

- [x] Context API
- [x] Custom Hooks (patrones)
- [x] Portals
- [x] Lazy Loading / Suspense / Code Splitting
- [x] Error Boundaries
- [x] Optimización (memo / useMemo / useCallback)
- [ ] Proyecto Dashboard empresarial
