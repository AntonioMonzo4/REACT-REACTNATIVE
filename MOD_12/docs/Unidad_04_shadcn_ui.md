# Unidad 04 — shadcn/ui

## Qué es

**No es una librería npm**: es un **catálogo de componentes** (Radix primitives + Tailwind) que **copias a tu repo** (`components/ui/button.tsx`).

```bash
npx shadcn@latest init
npx shadcn@latest add button card dialog
```

- Editas el código **en tu proyecto** (sin upstream de librería).
- Accesibilidad y foco de **Radix** por debajo.
- Requiere Tailwind (y normalmente TypeScript).

## Por qué se volvió popular

1. Propiedad total del componente (no peleas con overrides de lib).
2. Headless good: lógica de dialog/popover sin UI “de otra marca”.
3. Tailwind tokens → encaja con design systems existentes.

## Cuándo

- Quieres componentes sólidos **y** control total.
- Stack Tailwind + (TS) ya decidido.

## Contras

- Actualizaciones: merge manual de diffs de los snippets.
- No hay “upgrade path” de librería; el código es tuyo.

## En el ejemplo

Patrón documentado; el demo implementa un `Dialog` estilo shadcn con Radix-free simple (details/aria) para no añadir deps pesadas — el README apunta al CLI real.
