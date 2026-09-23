# Unidad 06 — Discriminated unions, guards y JSX + TS

## Discriminated unions en props

```tsx
type CargaProps =
  | { estado: 'idle' }
  | { estado: 'loading' }
  | { estado: 'error'; mensaje: string }
  | { estado: 'ok'; datos: string[] }

function Cargador({ estado }: CargaProps) {
  if (estado === 'error') return <p>{estado.mensaje}</p>
  if (estado === 'ok') return <ul>{estado.datos.map(...)}</ul>
  return <p>Esperando…</p>
}
```

## Type guards en handlers

```tsx
function esProducto(x: unknown): x is Producto {
  return typeof x === 'object' && x !== null && 'precio' in x
}
```

```tsx
onSelect={(item) => {
  if (esProducto(item)) setProd(item)
  else setOtro(item)
}}
```

## `satisfies` y `as const`

```tsx
const TEMA = {
  light: { bg: '#fff', fg: '#111' },
  dark: { bg: '#111', fg: '#eee' },
} as const satisfies Record<'light' | 'dark', { bg: string; fg: string }>
```

- `as const` → readonly y literales.
- `satisfies` → valida sin ensanchar el tipo a la anotación.

```tsx
const OPES = ['a', 'b'] as const
type Ope = (typeof OPES)[number] // 'a' | 'b'
```

## Errores comunes de JSX + TS

| Error típico | Solución |
|--------------|----------|
| `Type 'string' is not assignable to type 'ReactNode'` con `ReactNode` importado mal | `import type { ReactNode } from 'react'` |
| `children` no aceptado | Tipar `children: React.ReactNode` |
| `Element implicitly has an 'any'` en `event.target` | Tipar el SyntheticEvent |
| `No overload matches this call` en `<Comp />` | Revisar props opcionales vs required |
| `JSX element type 'X' does not have any construct or call signatures` | Falta `export default` o export con nombre mal |
| `Property 'x' does not exist on type` | Tipar el store/respuesta de API |

`verbatimModuleSyntax` / `erasableSyntaxOnly`: usa `import type` para tipos.

## En el ejemplo

`src/components/EstadoCarga.tsx` + `src/lib/tema.ts` con `satisfies`.
