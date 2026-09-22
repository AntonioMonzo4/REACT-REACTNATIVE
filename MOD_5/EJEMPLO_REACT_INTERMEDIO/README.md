# Ejemplo React Intermedio — Módulo 5

Proyecto de práctica del **Módulo 5 (React Intermedio)**. Vite + React.

## Comandos

```bash
pnpm install
pnpm dev      # desarrollo
pnpm lint     # ESLint
pnpm build    # producción
pnpm preview
```

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
