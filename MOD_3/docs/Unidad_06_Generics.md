# Unidad 06 — Generics

Los generics permiten **reutilizar** código manteniendo el tipo:

```ts
class Greeter<T> {
  greeting: T;
  constructor(message: T) {
    this.greeting = message;
  }
}

let greeter = new Greeter<string>("Hello, world");
```

## En funciones y tipos

```ts
export interface ApiResponse<T> {
  data: T;
}

// Uso
type UserResp = ApiResponse<{ name: string }>;
```

- `T` es un **parámetro de tipo**: cada llamada puede fijarlo o dejar que TS lo infiera.
- Restricciones: `<T extends object>`, `<K extends keyof T>`.

## Cuándo usarlo

- APIs de respuesta genéricas (`ApiResponse<T>`).
- Contenedores (`List<T>`, `Box<T>`).
- Helpers que devuelven el mismo tipo que reciben (`identity<T>(x): T`).

## Errores comunes

- Abusar de `any` “para que compile” → pierdes el beneficio de TS.
- Olvidar el `<...>` cuando TS no puede inferirlo.

## En el ejemplo

`fundamentals.ts` → sección *Generics* + `ApiResponse<T>`.
