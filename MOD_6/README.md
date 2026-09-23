# Módulo 6 — React Avanzado

Material del **Módulo 6** del roadmap (Context, hooks avanzados, portals, lazy, error boundaries, optimización).

## Para quién es este módulo

Para quien ya domina los fundamentos de React (componentes, props, estado, efectos y listas) y quiere pasar a patrones de nivel intermedio-avanzado: gestionar estado global con Context, extraer lógica reutilizable en custom hooks, renderizar contenido fuera del flujo del árbol con portals, dividir el bundle con lazy/Suspense, contener fallos con error boundaries y rendir mejor con memoización. Es el bloque previo al proyecto final (Dashboard empresarial).

## Cómo estudiar (orden recomendado)

| Fase | Unidades | Qué trabajas |
|------|----------|--------------|
| 1 | [01 — Context API](docs/Unidad_01_Context_API.md), [02 — Custom Hooks](docs/Unidad_02_Custom_Hooks.md) | Context y hooks avanzados |
| 2 | [03 — Portals](docs/Unidad_03_Portals.md), [04 — Lazy / Suspense](docs/Unidad_04_Lazy_Suspense.md) | Portals y lazy |
| 3 | [05 — Error Boundaries](docs/Unidad_05_Error_Boundaries.md), [06 — Optimización](docs/Unidad_06_Optimizacion.md) | Errores y optimización |
| 4 | Práctica `EJEMPLO_REACT_AVANZADO/` | Ejemplo integrado del módulo |

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

## Práctica mínima

- Leer las 6 unidades siguiendo el orden de la tabla de fases.
- Ejecutar el ejemplo (`pnpm install`, `pnpm dev`) y tocar el tema claro/oscuro.
- Lanzar el error a propósito y comprobar el fallback del ErrorBoundary.
- Abrir la pestaña de red para ver el chunk separado del panel lazy.
- Comparar los renders de la lista antes y después de `React.memo`.
- Pasar `pnpm lint` y `pnpm build` sin errores.

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
