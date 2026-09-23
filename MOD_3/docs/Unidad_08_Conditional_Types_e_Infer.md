# Unidad 08 — Conditional Types e `infer`

## Sintaxis

```ts
// SomeType extends OtherType ? TrueType : FalseType
type ToArray<T> = T extends any ? T[] : never;

type StrArrOrNumArr = ToArray<string | number>;
// string[] | number[]  (distributivo sobre unions)
```

## Inferencia con `infer`

```ts
type GetReturnType<T> = T extends (...args: unknown[]) => infer R
  ? R
  : never;

type Num = GetReturnType<() => number>; // number

type First<T extends Array<any>> = T extends [infer F, ...infer Rest]
  ? F
  : never;

type FirstStr = First<["hello", 1, false]>; // 'hello'
```

`infer R` “extrae” una parte del tipo y la usa en la rama true.

## Extracción de propiedades

```ts
interface Building {
  room: {
    door: string;
    walls: string[];
  };
}

type Walls = Building["room"]["walls"]; // string[]
```

## `keyof`

```ts
type PointCoords = { x: number; y: number };
type P = keyof PointCoords; // "x" | "y"
```

## Template literals + infer (recap)

```ts
type TrimLeft<S extends string> =
  S extends `${SpaceChar}${infer Rest}` ? TrimLeft<Rest> : S;
```

## Buenas prácticas

1. Preferir `unknown` + narrowing a `any`.
2. Encadenar utilities (`Partial<Pick<...>>`) en vez de duplicar interfaces.
3. `strict: true` en `tsconfig` siempre que se pueda.
4. Tipar la frontera de la app (API, props de React) y dejar lo interno inferir.

## En el ejemplo

`fundamentals.ts` → *Conditional Types*, *Inferring*, *type extractions*.
