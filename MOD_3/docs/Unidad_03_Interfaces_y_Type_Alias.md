# Unidad 03 — Interfaces y Type Alias

## Interfaces

Contrato de forma de un objeto:

```ts
interface User {
  name: string;
  age?: number; // opcional
}

function printLabel(options: { label: string }) {
  console.log(options.label);
}

function getUser(): { name: string; age?: number } {
  return { name: "Ana" };
}
```

### Declaration merging

Si declaras la **misma** interface dos veces, TS las fusiona:

```ts
interface User {
  name: string;
}

interface User {
  email: string;
}
// User tiene name + email
```

Útil para ampliar interfaces de librerías sin modificarlas.

### Index signature

```ts
interface Dictionary {
  [key: string]: Object[];
}
```

## Type Alias

Nombre para **cualquier** tipo (no solo objetos):

```ts
type Name = string | string[];

interface Colorful { color: string }
interface Circle { radius: number }

type ColorfulCircle = Colorful & Circle; // intersección

const circulo: ColorfulCircle = { color: "rojo", radius: 2 };
```

## Interface vs type

| | `interface` | `type` |
|---|-------------|--------|
| Objetos / clases | ✅ ideal | ✅ |
| Uniones, intersecciones, tuples | ❌ | ✅ |
| Declaration merging | ✅ | ❌ |
| `implements` en clases | ✅ | ✅ si es objeto |

**Regla práctica**: objetos que se extienden → `interface`; uniones/utilidades → `type`.

## En el ejemplo

`fundamentals.ts` → secciones *INTERFACES* y *Type Aliases*.
