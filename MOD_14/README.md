# Módulo 14 — TypeScript + React

Material del **Módulo 14** del roadmap (tipos en componentes, eventos, hooks y patrones TS+JSX).

## Para quién es este módulo

Este módulo es para ti si:

- Has completado **M4–M12** (React de JS) y **M3** (TypeScript básico: tipos, interfaces, unions, genéricos a nivel de función).
- Quieres dejar de escribir React "a ciegas" y ganar autocompletado, refactor seguro y errores **antes** de ejecutar.
- Vas a migrar proyectos existentes de JS a TS (hay un proyecto pendiente de migración en el *Mapa con el README*).
- Te interesa el React moderno: `forwardRef`, custom hooks tipados, discriminated unions, `satisfies`.

No hace falta saber React types a fondo: el módulo construye desde `Props` hasta `satisfies`, asumiendo solo los fundamentos de TS del M3 y tu experiencia de React en JS.

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

## Cómo estudiar

| Fase | Qué haces | Duración orientativa |
|------|-----------|----------------------|
| 1. Leer | Lee las 6 unidades; en cada una, captá el **por qué** antes que la sintaxis | 1–2 sesiones |
| 2. Ejecutar | `pnpm install` + `pnpm run check` + `pnpm dev` en `EJEMPLO_TS_REACT`; navega con el editor al lado | 1 sesión |
| 3. Romper | Cambia tipos a propósito (pasa `tone="blu"`, quita `payload` del dispatch, borra `datos`) y lee los mensajes de `pnpm run check` | 1 sesión |
| 4. Reescribir / Migrar | Migra un componente JS del M4 a `.tsx` tipado (ver proyecto pendiente) | 1 sesión |

## Práctica mínima

Lo mínimo para dar el módulo por entendido:

1. `pnpm install` y `pnpm run check` en `EJEMPLO_TS_REACT` sin errores de TypeScript.
2. Escribir un componente con props tipadas + un handler `React.FormEvent` correcto sin mirar.
3. Tipar un reducer con discriminated union y verificar en runtime que un dispatch inválido no compila.
4. Explicar la diferencia entre `as const` y `satisfies` con un ejemplo.

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
