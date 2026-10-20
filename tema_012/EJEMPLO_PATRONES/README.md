# Ejemplo Patrones — Módulo 13

Proyecto de práctica del **Módulo 13 (Patrones Avanzados)**. Vite + React.

## Comandos

```bash
pnpm install
pnpm dev
pnpm lint
pnpm build
```

## Qué demuestra cada archivo

| Archivo | Patrón |
|---------|--------|
| `src/patterns/compound/Tabs.jsx` | Compound Components (contexto compartido) |
| `src/patterns/RenderPropsMouse.jsx` | Render props (children como función) |
| `src/hooks/useMouse.js` | Misma lógica como custom hook |
| `src/patterns/withTrace.jsx` | HOC |
| `src/hooks/useDebounce.js` + `useMediaQuery.js` + `useSet.js` | Custom hooks avanzados |
| `src/services/ServicesProvider.jsx` + `useServices.js` | Dependency Injection por contexto |

## Qué practica este ejemplo

Este proyecto es el **banco de pruebas** de los cinco patrones del Módulo 13 en un solo lugar. Al recorrerlo practicas:

- **Compound Components**: ver cómo `Tabs` guarda el estado y `Tab`/`TabPanel` lo leen sin props cableadas.
- **Render props vs hooks**: la **misma** lógica de posición del ratón implementada dos veces (`RenderPropsMouse.jsx` como children-función y `useMouse.js` como hook) para comparar cuándo conviene cada una.
- **HOC**: `withTrace` envuelve un componente y registra sus props al montar/desmontar, mostrando la firma `withX(Component)` y el reparto de `...rest`.
- **Custom hooks avanzados**: `useDebounce` (temporizadores + cleanup), `useMediaQuery` (listener global) y `useSet` (colección con copia inmutable) — patrones de nivel medio/avanzado.
- **Dependency Injection**: `ServicesProvider` inyecta servicios (`logger`) por contexto; los consumidores usan `useServices()` sin importar el módulo concreto.

## Cómo recorrerlo

Sigue este orden; cada paso apoya una unidad de `docs/`:

1. **Arranca**: `pnpm install` y `pnpm dev`; abre la app en el navegador.
2. **Unidad 01**: localiza `src/patterns/compound/Tabs.jsx`. Identifica el `createContext`, el `useState` del padre y cómo `Tab` lee `useContext`. Interactúa con las pestañas y observa qué panel se muestra.
3. **Unidad 02**: abre `src/patterns/RenderPropsMouse.jsx` y muévete por la pantalla; luego abre `src/hooks/useMouse.js` y compáralo: misma lógica, distinto patrón. Decide cuál usarías en un proyecto nuevo.
4. **Unidad 03**: lee `src/patterns/withTrace.jsx` y busca en las DevTools de React la capa extra del wrapper; comprueba cómo se propagan `...rest`.
5. **Unidad 04**: revisa `src/hooks/useDebounce.js`, `useMediaQuery.js` y `useSet.js`; verifica que todo listener/timer tiene su cleanup y que `useSet` crea copias nuevas.
6. **Unidad 05**: abre `src/services/ServicesProvider.jsx` y busca dónde (raíz) se decide qué servicios reales se inyectan; luego sigue el consumo con `useServices()`.
7. **Rompe a propósito**: comenta el `Provider`, saca un `Tab` fuera de `Tabs` o quita un cleanup y lee los errores; es la mejor forma de internalizar los fallos típicos documentados en cada unidad.
8. **Lint y build**: `pnpm lint` y `pnpm build` deben pasar limpios antes de dar el módulo por terminado.

## Temario Módulo 13 — estado

- [x] Compound Components
- [x] Render Props
- [x] Higher Order Components (HOC)
- [x] Custom Hooks Avanzados
- [x] Dependency Injection
