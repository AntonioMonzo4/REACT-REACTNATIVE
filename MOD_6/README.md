# Módulo 6 — React Avanzado

Material del **Módulo 6** del roadmap (Context, hooks avanzados, portals, lazy, error boundaries, optimización).

## Contenido

### Teoría (`docs/`)

| Unidad | Tema |
|--------|------|
| [01 — Context API](docs/Unidad_01_Context_API.md) | Provider, consumer, uso y pitfalls |
| [02 — Custom Hooks](docs/Unidad_02_Custom_Hooks.md) | useLocalStorage, useFetch, useDebounce |
| [03 — Portals](docs/Unidad_03_Portals.md) | createPortal, modals fuera del overflow |
| [04 — Lazy / Suspense](docs/Unidad_04_Lazy_Suspense.md) | Code splitting por componente/ruta |
| [05 — Error Boundaries](docs/Unidad_05_Error_Boundaries.md) | Clase, fallback, dónde montar |
| [06 — Optimización](docs/Unidad_06_Optimizacion.md) | memo, useMemo/useCallback, Profiler |

### Práctica (`EJEMPLO_REACT_AVANZADO/`)

- `src/context/ThemeProvider.jsx` + `ThemeContext.js` — tema claro/oscuro con Provider + hook
- `useLocalStorage` / `useDebounce`
- Modal con **portal**
- **ErrorBoundary** + botón que lanza error
- Panel con **lazy + Suspense**
- Lista con **React.memo** y medición de renders

```bash
cd EJEMPLO_REACT_AVANZADO
pnpm install
pnpm dev
pnpm lint
pnpm build
```

## Mapa con el README

- [x] Context API
- [x] Custom Hooks (patrones)
- [x] Portals
- [x] Lazy Loading
- [x] Suspense
- [x] Error Boundaries
- [x] Optimización / React.memo / useMemo / useCallback
- [x] Code Splitting (lazy import)
- [ ] Proyecto Dashboard empresarial — *pendiente*
