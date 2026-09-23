# Módulo 13 — Patrones Avanzados de React

Material del **Módulo 13** del roadmap (compound components, render props, HOC, hooks avanzados, DI).

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

## Mapa con el README

- [x] Compound Components
- [x] Render Props
- [x] Higher Order Components (HOC)
- [x] Custom Hooks Avanzados
- [x] Dependency Injection
