# Módulo 4 — React desde Cero

Material del **Módulo 4** del roadmap (componentes, props, hooks y estilos).

## Contenido

### Teoría (`docs/`)

| Unidad | Tema |
|--------|------|
| [01 — Introducción](docs/Unidad_01_Introduccion_a_React.md) | Qué es, historia, Virtual DOM, JSX, Babel, `key`, Strict Mode |
| [02 — Componentes](docs/Unidad_02_Componentes_y_composicion.md) | Functional Components, composición, Fragment, DevTools |
| [03 — Props y listas](docs/Unidad_03_Props_children_y_map.md) | Props, children, `key`, iterar con `map` |
| [04 — Eventos](docs/Unidad_04_Eventos.md) | `onClick`, `onChange`, `onSubmit` y catálogo |
| [05 — Estado](docs/Unidad_05_Estado_useState.md) | `useState`, controlados, condicionales, listas |
| [06 — Hooks básicos](docs/Unidad_06_Hooks_basicos.md) | `useEffect`, `useMemo`, custom hooks |
| [07 — Estilos](docs/Unidad_07_Estilos_en_React.md) | CSS, variables, dark mode, `className` |

### Práctica (`EJEMPLO_REACT/`)

Vite + React con componentes y hooks:

- `Navbar` — componente, `className`, `Fragment`
- `Props` — acceso, desestructuración, `key`
- `Eventos` — `onClick`, `onChange`…
- `ComponenteHooks` — `useState`, `useEffect`
- `ComponenteUseMemo` — `useMemo`
- Custom hook `useCounter`

```bash
cd EJEMPLO_REACT
pnpm install
pnpm dev      # desarrollo
pnpm lint     # ESLint
pnpm build    # producción
```

## Mapa con el README

- [x] ¿Qué es React? / Historia / Virtual DOM / JSX / Babel
- [x] `key` y reconciliación
- [x] React Strict Mode
- [x] Functional Components / composición / Fragment
- [x] Props y Children
- [x] React DevTools
- [x] `useState`
- [x] `onClick` / `onChange` / `onSubmit`
- [x] `useEffect` / `useMemo` / custom hooks (complemento)
- [x] Iterar con `map` y pasar props
- [x] Estilos CSS y dark mode
- [ ] Proyecto: Calculadora — *pendiente*
