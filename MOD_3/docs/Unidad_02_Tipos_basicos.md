# Unidad 02 — Tipos básicos

## Primitivos y colecciones

```ts
let isDone: boolean = false;
let decimal: number = 6;
let color: string = "blue";
let big: bigint = 100n;
let unique: symbol = Symbol("id");

let list: string[] = ["a", "b"];
let tuple: [string, number] = ["age", 26];   // posición fija
let maybe: string | null | undefined = null; // union type
```

## `any`, `unknown`, `never`, `void`

| Tipo | Significado |
|------|-------------|
| `any` | Cualquiera (desactiva el chequeo) — evitar |
| `unknown` | Cualquiera pero **hay que narrowar** antes de usar |
| `void` | Función sin `return` con valor |
| `never` | Nunca retorna (throw, infinite loop) |

```ts
function unreachable(): never {
  throw new Error("nunca retorna");
}

let input: unknown = "Hello";
const len: number = (input as string).length; // assertion
```

> En `.tsx` usa `input as string`; `<string>input` no compila en JSX.

## Funciones

```ts
function add(a: number, b: number): number {
  return a + b;
}
```

Los parámetros **no** son opcionales por defecto: TS exige que existan.

## En el ejemplo

Todo esto vive en [`../hello-world/src/fundamentals.ts`](../hello-world/src/fundamentals.ts) (sección *Basic Types*).
