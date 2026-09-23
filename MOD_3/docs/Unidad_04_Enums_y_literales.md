# Unidad 04 — Enums, literales y `as const`

## Enums

Conjunto de constantes con nombre:

```ts
enum Color {
  Red,      // 0
  Green,    // 1
  Blue = 4, // 4
}

let c: Color = Color.Green;
```

- Numéricos por defecto; puedes asignar valores (`Blue = 4`).
- String enums son útiles para logs/serialización (`enum Dir { Up = "UP" }`).

## Literal types

TS puede restringir a **valores concretos**:

```ts
type Direction = "up" | "down" | "left" | "right";
let d: Direction = "up"; // "sideways" → error
```

## `as const`

Congela la forma del objeto/array en literales:

```ts
const point = { x: 4, y: 2 };            // { x: number; y: number }
const literalPoint = { x: 4, y: 2 } as const;
// { readonly x: 4; readonly y: 2 }
```

Útil para configuraciones y datos que **no** deben mutar.

## Template Literal Types

```ts
type SpaceChar = " " | "\n" | "\t";
type TrimLeft<S extends string> =
  S extends `${SpaceChar}${infer Rest}` ? TrimLeft<Rest> : S;

type Trimmed = TrimLeft<"    hello">; // 'hello'
```

(Se completa en la unidad de Conditional Types / `infer`.)

## En el ejemplo

`fundamentals.ts` → *Enums*, *Literal Types*, *Template Literal Types*.
