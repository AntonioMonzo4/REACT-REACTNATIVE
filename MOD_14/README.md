# Módulo 14 — TypeScript + React

Material del **Módulo 14** del roadmap (tipos en componentes, eventos, hooks y patrones TS+JSX).

## Contenido

### Teoría (`docs/`)

| Unidad | Tema |
|--------|------|
| [01 — Componentes tipados](docs/Unidad_01_Componentes_tipados.md) | Props, state, unions de UI |
| [02 — Eventos tipados](docs/Unidad_02_Eventos_tipados.md) | `FormEvent`, `ChangeEvent`, handlers custom |
| [03 — Children y refs](docs/Unidad_03_Children_y_refs.md) | `ReactNode`, `forwardRef`, props de DOM |
| [04 — Hooks con generics](docs/Unidad_04_Hooks_generics.md) | `useState<T>`, reducer con actions |
| [05 — Custom Hooks tipados](docs/Unidad_05_Custom_Hooks_tipados.md) | `useLocalStorage<T>`, fetch tipado |
| [06 — Uniones, guards y JSX](docs/Unidad_06_Uniones_guards_JSX.md) | `satisfies`, `as const`, errores TS+JSX |

### Práctica (`EJEMPLO_TS_REACT/`)

Vite + React + **TypeScript**:

- Componentes y formularios con eventos tipados
- `useLocalStorage<T>` y reducer con discriminated union
- Página de estados `idle | loading | error | ok`
- `pnpm run check` (tsc) + `pnpm lint` + `pnpm build`

```bash
cd EJEMPLO_TS_REACT
pnpm install
pnpm run check
pnpm lint
pnpm build
```

## Mapa con el README

- [x] Componentes tipados (props y state)
- [x] Eventos tipados
- [x] Children y refs con tipos
- [x] Hooks con generics (`useState<T>`, `useRef<T>`)
- [x] Custom Hooks tipados
- [x] Discriminated unions en props
- [x] Type guards en handlers
- [x] `satisfies` y `as const` con JSX
- [x] Errores comunes de JSX + TS y cómo resolverlos
- [ ] Proyecto: Migrar el ejemplo del Módulo 4 a TypeScript — *pendiente*
