# Ejemplo TS + React — Módulo 14

Proyecto de práctica del **Módulo 14 (TypeScript + React)**. Vite + React + TS.

## Comandos

```bash
pnpm install
pnpm run check   # tsc
pnpm lint
pnpm build       # tsc -b && vite build
pnpm dev
```

## Qué demuestra cada archivo

| Archivo | Concepto |
|---------|----------|
| `src/components/UsuarioCard.tsx` | Props tipadas, optional |
| `src/components/Formulario.tsx` | `FormEvent`, `ChangeEvent` |
| `src/components/CampoTexto.tsx` | `forwardRef` + props de DOM |
| `src/components/EstadoCarga.tsx` | Discriminated union en props |
| `src/hooks/useLocalStorage.ts` | Generic `T` |
| `src/state/contador.ts` | Actions tipadas del reducer |
| `src/lib/tema.ts` | `as const` + `satisfies` |

## Qué practica este ejemplo

Este proyecto es la **versión en TypeScript** de los patrones que ya conoces de React en JS, con un énfasis distinto: cada archivo está diseñado para que el **compilador te enseñe**. En concreto:

- **Contratos de props**: `UsuarioCard.tsx` muestra el patrón `type Props` con opcionales (`edad?`) y callbacks tipados — si te equivocas de prop, el editor tacha el error al instante.
- **Eventos del DOM**: `Formulario.tsx` tipa `React.FormEvent<HTMLFormElement>` y `React.ChangeEvent<HTMLInputElement>`, incluyendo el uso de `currentTarget` con `FormData`.
- **Refs y reenvío de DOM**: `CampoTexto.tsx` usa `forwardRef` y **extiende** `InputHTMLAttributes` en vez de redeclarar atributos, con el orden correcto de `{...rest}`.
- **Estados de UI imposibles**: `EstadoCarga.tsx` modela `idle | loading | error | ok` como discriminated union — no puedes pintar "error" sin `mensaje`.
- **Persistencia genérica**: `useLocalStorage.ts` implementa `useLocalStorage<T>` con lazy init, updater compatible y `as const` en la tupla de retorno.
- **Máquina de estados tipada**: `src/state/contador.ts` define actions `{ type: 'inc' } | { type: 'add'; payload: number }`; un `dispatch` sin `payload` no compila.
- **Configuración de enums/temas**: `src/lib/tema.ts` combina `as const` + `satisfies` para validar la forma sin perder literales.

El objetivo transversal: que **`pnpm run check` pase limpio** y que, si rompes un tipo a propósito, sepas leer el mensaje y arreglarlo.

## Cómo recorrerlo

1. **Instala y verifica**: `pnpm install` y después `pnpm run check` — la base es que `tsc` no reporte errores.
2. **Leé tipo por tipo**: abre `src/components/UsuarioCard.tsx` y localizá `type UsuarioCardProps`; probá a quitar `nombre` en un uso y mirá cómo marca el editor.
3. **Eventos**: en `Formulario.tsx`, seguí el handler `onSubmit`: por qué `React.FormEvent<HTMLFormElement>` y no `Event`. Cambiá el genérico a propósito y leé el error.
4. **Refs**: en `CampoTexto.tsx`, verificá `useRef`/`forwardRef` y el orden de `{...rest}`; probá a invertirlo y observá el efecto con `className`.
5. **Uniones**: en `EstadoCarga.tsx`, intentá renderizar con `estado="error"` sin `mensaje` — debe fallar `pnpm run check`.
6. **Hooks y reducer**: compará `src/hooks/useLocalStorage.ts` y `src/state/contador.ts` con las unidades 04 y 05; cambiá un literal de action y mirá dónde truena.
7. **`satisfies`**: en `src/lib/tema.ts`, quitá una clave del objeto `TEMA` (o el `satisfies`) y comprobá qué error aparece y cómo el tipo fino se conserva.
8. **Cierra el ciclo**: `pnpm lint` y `pnpm build` (que ejecuta `tsc -b && vite build`) deben pasar; después `pnpm dev` para ver la app en vivo.

## Temario Módulo 14 — estado

- [x] Componentes / eventos / children / refs tipados
- [x] Hooks con generics y custom hooks tipados
- [x] Unions, guards, satisfies, errores comunes JSX+TS
- [ ] Proyecto: migrar EJEMPLO_REACT del M4 a TS
