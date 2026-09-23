# Unidad 05 — Funciones tipadas y clases

## Function types

```ts
function onUser(user: User) {
  console.log(user.name);
}

function getUserWithCallback(callback: (user: User) => void) {
  callback({ name: "Luis", email: "luis@ejemplo.com" });
}

getUserWithCallback(function (user: User) {
  console.log(user.email);
});
```

## Clases

```ts
class Point {
  x: number;
  y: number;
  static instances = 0;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    Point.instances++;
  }
}

class Point3D extends Point {
  z: number;
  constructor(x: number, y: number, z: number) {
    super(x, y, z);
    this.z = z;
  }
}

interface Colored {
  paint(): void;
}

class Pixel extends Point implements Colored {
  paint() {
    console.log(`Pintando en (${this.x}, ${this.y})`);
  }
}
```

### Parameter properties

```ts
class PointParams {
  constructor(
    public x: number,
    public y: number,
  ) {}
}
```

`public`/`private`/`readonly` en el constructor declaran y asignan la propiedad.

### Definite assignment

```ts
class PointDefinite {
  public someUselessValue!: number; // "ya lo asigno luego"
}
```

El `!` le dice a TS que **no** es `undefined` aunque no vea la asignación.

## Módulos

```ts
export interface ApiResponse<T> {
  data: T;
}
```

`export`/`import` tipados; con `verbatimModuleSyntax: true` debes usar `import type` si solo traes tipos.

## En el ejemplo

`fundamentals.ts` → *FUNCTION TYPES*, *CLASSES*, *MODULOS*.
