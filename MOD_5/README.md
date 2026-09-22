# Módulo 5 — React Intermedio

Material del **Módulo 5** del roadmap (hooks avanzados, formularios y comunicación).

## Contenido

### Teoría (`docs/`)

| Unidad | Tema |
|--------|------|
| [01 — useRef](docs/Unidad_01_useRef.md) | Referencias DOM, valores mutables, timers |
| [02 — useReducer](docs/Unidad_02_useReducer.md) | Estado complejo, actions, reducer puro |
| [03 — useCallback](docs/Unidad_03_useCallback.md) | Memoizar funciones, memo + deps |
| [04 — useLayoutEffect](docs/Unidad_04_useLayoutEffect.md) | Medir layout antes del paint |
| [05 — Formularios](docs/Unidad_05_Formularios.md) | Controlados, no controlados, validación |
| [06 — Comunicación](docs/Unidad_06_Comunicacion.md) | Padre↔hijo, hermanos, prop drilling |

### Práctica (`EJEMPLO_REACT_INTERMEDIO/`)

Vite + React con demos montadas en `App.jsx`:

- `DemoUseRef` — foco, contador mutable, medición
- `DemoUseReducer` — todo list con reducer
- `DemoUseCallback` — callbacks estables + `React.memo`
- `DemoUseLayoutEffect` — medir antes de pintar
- `FormularioValidado` — touched, errores, submit
- `Comunicacion` — padre, hijo y hermanos

```bash
cd EJEMPLO_REACT_INTERMEDIO
pnpm install
pnpm dev      # desarrollo
pnpm lint     # ESLint
pnpm build    # producción
```

## Mapa con el README

- [x] useEffect (repaso M4 + limpieza en demos)
- [x] useRef
- [x] useMemo (M4 + M5)
- [x] useCallback
- [x] useReducer
- [x] useLayoutEffect
- [x] Formularios controlados
- [x] Validaciones
- [x] Padre → Hijo / Hijo → Padre / Hermanos
- [ ] useReducer + forms avanzados (librerías: Formik, React Hook Form) — *pendiente*
- [ ] Proyecto CRUD completo — *pendiente*
