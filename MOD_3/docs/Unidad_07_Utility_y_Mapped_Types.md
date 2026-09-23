# Unidad 07 — Utility Types y Mapped Types

TypeScript trae **utility types** listos para transformar tipos:

```ts
type Partial<T>     // todas las props opcionales
type Required<T>    // todas las props obligatorias
type Readonly<T>    // todas readonly
type Pick<T, K>     // subconjunto de keys
type Omit<T, K>     // todo menos K
type Record<K, T>   // objeto con keys K y valor T
type Exclude / Extract
type ReturnType<F>
type NonNullable<T>
```

## Ejemplos típicos

```ts
interface User {
  name: string;
  age: number;
}

type UserPatch = Partial<User>;          // { name?: string; age?: number }
type UserPreview = Pick<User, "name">;   // { name: string }
type UserInput = Omit<User, "age">;      // { name: string }

type Flags = Record<"dark" | "lang", boolean>;
// { dark: boolean; lang: boolean }
```

## Mapped types (a mano)

```ts
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

type UserGetters = Getters<User>;
// { getName: () => string; getAge: () => number }
```

- `keyof T` → union de keys.
- `T[K]` → tipo del valor en esa key (indexed access).
- `as` en el mapped type renombra las keys.

## En el ejemplo

Base para *Conditional Types* y *Template Literal Types* de `fundamentals.ts`.
