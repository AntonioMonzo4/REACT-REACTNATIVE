# Módulo 13 — Patrones Avanzados de React

Material del **Módulo 13** del roadmap (compound components, render props, HOC, hooks avanzados, DI).

## Para quién es este módulo

Este módulo es para ti si:

- Ya has completado **M4–M12** y sabes crear componentes, manejar estado (`useState`), efectos (`useEffect`) y contexto (`createContext`).
- Has escrito al menos un custom hook básico y entiendes `children` y el prop drilling.
- Quieres pasar de "escribir React que funciona" a **diseñar APIs de componentes reutilizables** con los patrones que usan librerías como Radix, MUI o React Router.
- Aceptas leer ejemplos en **JavaScript** (`.jsx`): el foco del módulo es el patrón, no el tipado (eso llega en el M14).

No necesitas haber visto TypeScript todavía; los cinco patrones se explican primero en JS puro para que la idea quede clara sin ruido de tipos.

## Contenido

### Teoría (`docs/`)

| Unidad | Tema |
|--------|------|
| [01 — Compound Components](docs/Unidad_01_Compound_Components.md) | Tabs/Familia con contexto implícito |
| [02 — Render Props](docs/Unidad_02_Render_Props.md) | Children como función; vs hooks |
| [03 — HOC](docs/Unidad_03_HOC.md) | `withX(Component)`, statics, legacy |
| [04 — Custom Hooks avanzados](docs/Unidad_04_Custom_Hooks_Avanzados.md) | Genéricos, `useSyncExternalStore`, anti-patrones |
| [05 — Dependency Injection](docs/Unidad_05_Dependency_Injection.md) | Props/context como servicios, factories |

### Práctica (`EJEMPLO_PATRONES/`)

Vite + React:

- `patterns/compound/Tabs.jsx` — Tabs/Tab/TabPanel
- `patterns/RenderPropsMouse.jsx` + `useMouse`
- `patterns/withTrace.jsx` — HOC de log
- `hooks/useMediaQuery.js`, `useDebounce.js`, `useSet.js`
- `services/ServicesProvider.jsx` — DI de `logger`

```bash
cd EJEMPLO_PATRONES
pnpm install
pnpm dev      # desarrollo
pnpm lint     # ESLint
pnpm build    # producción
```

## Cómo estudiar

| Fase | Qué haces | Duración orientativa |
|------|-----------|----------------------|
| 1. Leer | Lee las 5 unidades de `docs/` sin código; entiende la **idea** y la analogía de cada patrón | 1 sesión |
| 2. Ejecutar | Arranca `EJEMPLO_PATRONES` con `pnpm dev` y navega cada patrón en vivo | 1 sesión |
| 3. Romper | Modifica el ejemplo a propósito (saca un hijo de `Tabs`, anida render props) y observa los errores | 1 sesión |
| 4. Reescribir | Implementa un patrón **desde cero** sin mirar (p. ej. `Accordion` compound o `withAuth`) | 1 sesión |

## Práctica mínima

Lo mínimo para dar el módulo por entendido:

1. Ejecutar `pnpm install` + `pnpm dev` en `EJEMPLO_PATRONES` sin errores.
2. Abrir `Tabs.jsx` y explicar en voz alta de dónde sale el tab activo.
3. Explicar la diferencia entre render prop, HOC y custom hook con un ejemplo de cada uno.
4. Escribir un custom hook nuevo no visto en el curso (p. ej. `useWindowSize`) con cleanup correcto.

## Mapa con el README

- [x] Compound Components
- [x] Render Props
- [x] Higher Order Components (HOC)
- [x] Custom Hooks Avanzados
- [x] Dependency Injection
