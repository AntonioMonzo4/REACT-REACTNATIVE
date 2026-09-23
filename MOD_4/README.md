# Módulo 4 — React desde Cero

Material del **Módulo 4** del roadmap (componentes, props, hooks y estilos).

## Para quién es este módulo

Este módulo está pensado para ti si:

- Programas en otro lenguaje (o apenas estás empezando) y quieres
  **aprender React desde cero**, sin asumir conocimientos previos.
- Te suenan términos como *componente*, *props* o *hooks* pero aún no
  los has usado de verdad en código.
- Prefieres un orden claro: primero teoría breve, después código en el
  proyecto `EJEMPLO_REACT/`.
- Buscas una base sólida antes de avanzar a React Native, TypeScript o
  proyectos más grandes.

No necesitas saber React ni hooks previos. Sí conviene tener
**mínimos de HTML y CSS** y algo de JavaScript (constantes, funciones,
arrays).

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

## Cómo estudiar (orden recomendado)

Sigue las fases en orden: cada una aprovecha lo anterior. No saltes a
`useState` (fase 3) sin dominar props y composición (fases 1–2).

| Fase | Unidades | Qué consigues |
|------|----------|---------------|
| 1. Fundamentos | U01–U02 | Qué es React, Virtual DOM, JSX y cómo se escriben componentes y se componen entre sí |
| 2. Datos y user input | U03–U04 | Pasar props (incluido `children`), renderizar listas con `map` y `key`, reaccionar a clics y formularios |
| 3. Estado y efectos | U05–U06 | Guardar estado con `useState`, sincronizar con `useEffect`, memorizar con `useMemo` y crear custom hooks |
| 4. Puesta en marcha | U07 + práctica | Dar estilos (CSS, variables, dark mode) y aplicarlo todo en `EJEMPLO_REACT/` |

## Práctica

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

## Práctica mínima

Si solo puedes dedicar unas pocas horas a la semana, este es el
mínimo razonable antes de dar el módulo por terminado:

1. Leer la teoría de la fase actual (1 unidad de la tabla de arriba).
2. Ejecutar `pnpm dev` y tocar el ejemplo mientras lees cada
   componente.
3. Modificar algo pequeño sin mirar (renombrar una prop, cambiar un
   color, añadir un botón) y comprobarlo en el navegador.
4. Pasar `pnpm lint` y `pnpm build` antes de pasar a la siguiente
   unidad.
5. Cerrar el módulo con la autoevaluación de la U07 y dejar anotado
   el pendiente del proyecto.

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
