# Módulo 5 — React Intermedio

Material del **Módulo 5** del roadmap: hooks avanzados, formularios y comunicación entre componentes.

Aquí pasas de "sé crear componentes" a "sé controlar el DOM, el estado complejo y los formularios".

## Para quién es este módulo

- Si ya has hecho el **Módulo 1 a 4** (JSX, props, estado, `useState` y `useEffect`) y quieres dar el siguiente paso.
- Si entiendes lo básico de React pero todavía no dominas `useRef`, `useReducer` o los formularios con validación.
- Si prefieres aprender **poco a poco**: cada unidad tiene teoría + práctica en el ejemplo.

No hace falta que sepas TypeScript todavía: las demos usan `.jsx` para que te centres en los hooks.

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

## Cómo estudiar (orden recomendado)

| Fase | Unidades | Qué harás |
|------|----------|-----------|
| 1 | U01 – U02 | Referencias (`useRef`) y estado complejo (`useReducer`) |
| 2 | U03 – U04 | Memoización (`useCallback`) y medidas de layout (`useLayoutEffect`) |
| 3 | U05 | Formularios controlados y validaciones |
| 4 | U06 + práctica | Comunicación padre/hijo y proyecto `EJEMPLO_REACT_INTERMEDIO` |

Sugerencia: tras cada fase, abre la demo correspondiente en `EJEMPLO_REACT_INTERMEDIO` y cambia código para ver qué pasa.

## Práctica mínima

- Ejecuta `pnpm dev` y recorre las 6 demos del ejemplo.
- Reescribe el todo list de `DemoUseReducer` con una acción nueva (p. ej. "editar").
- Añade una validación extra a `FormularioValidado`.
- Crea una comunicación hijo → padre nueva en `Comunicacion`.

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
