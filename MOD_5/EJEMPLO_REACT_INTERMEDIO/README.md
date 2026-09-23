# Ejemplo React Intermedio — Módulo 5

Proyecto de práctica del **Módulo 5 (React Intermedio)**. Vite + React.

## Qué practica este ejemplo

Un ejemplo corto con 6 demos para aplicar lo del Módulo 5 sin teoría extra:

- **Hooks avanzados**: `useRef`, `useReducer`, `useCallback` y `useLayoutEffect`.
- **Formularios**: controlado, `touched`, errores y reset.
- **Comunicación**: padre → hijo, hijo → padre y hermanos.

Cada demo vive en un archivo de `src/components/` y se monta en `App.jsx`.

## Comandos

```bash
pnpm install
pnpm dev      # desarrollo
pnpm lint     # ESLint
pnpm build    # producción
pnpm preview
```

## Cómo recorrerlo

Orden sugerido (del más sencillo al más completo):

1. `DemoUseRef` — referencias al DOM y valores mutables.
2. `DemoUseReducer` — estado complejo con actions y reducer.
3. `DemoUseCallback` — callbacks estables + `React.memo`.
4. `DemoUseLayoutEffect` — medir el layout antes del paint.
5. `FormularioValidado` — formulario con validación.
6. `Comunicacion` — padre, hijo y hermanos.

Abre el archivo, ejecuta `pnpm dev` y modifica algo para ver el efecto.

## Qué demuestra cada archivo

| Archivo | Concepto |
|---------|----------|
| `src/components/DemoUseRef.jsx` | `useRef` en DOM, contador mutable, `ResizeObserver` |
| `src/components/DemoUseReducer.jsx` | `useReducer` + todo list (add/toggle/remove/filter) |
| `src/components/DemoUseCallback.jsx` | `useCallback` estable vs inestable + `React.memo` |
| `src/components/DemoUseLayoutEffect.jsx` | Medir ancho antes/después del paint |
| `src/components/FormularioValidado.jsx` | Formulario controlado, touched, aria, reset |
| `src/components/Comunicacion.jsx` | Padre→hijo, hijo→padre, hermanos vía padre |

## Temario Módulo 5 — estado

- [x] useRef, useReducer, useCallback, useLayoutEffect
- [x] Formularios controlados y validaciones
- [x] Comunicación padre/hijo/hermanos
- [ ] useReducer + librerías de forms (Formik / React Hook Form)
- [ ] Proyecto CRUD completo
