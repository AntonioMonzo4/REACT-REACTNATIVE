# Unidad 05 — Funciones tipadas y clases

## Objetivos

- Entender qué es un **function type** y saber tipar parámetros y valor de retorno.
- Escribir **callbacks tipados** como `(user: User) => void` y usarlos con seguridad.
- Declarar **clases** en TypeScript: propiedades, constructor, miembros `static`, `extends`/`super` e `implements`.
- Aplicar **parameter properties** (`public`/`private`/`readonly` en el constructor) para escribir clases más cortas.
- Saber cuándo usar el **definite assignment assertion** (`!`) y por qué conviene evitarlo si hay alternativa.
- Exportar e importar módulos con tipos, incluido `import type` con `verbatimModuleSyntax: true`.

## Requisitos

- Haber completado las unidades anteriores de este módulo (tipos primitivos, interfaces, uniones).
- Tener `typescript` instalado y un `tsconfig.json` básico.
- Haber abierto el archivo de ejemplo `fundamentals.ts` (lo usaremos como referencia a lo largo de la unidad).
- Conocimiento mínimo de JavaScript: variables, funciones y `class` por encima.

---

## Function types: tipar funciones

### Qué es y por qué importa

En JavaScript, una función es simplemente un valor más: puedes guardarla en una variable, pasarla como argumento o devolverla desde otra función. El problema es que, por defecto, **nadie verifica qué tipos de datos recibe o devuelve esa función**. Si tu callback espera un objeto `User` y alguien le pasa un número, JavaScript no se queja… hasta que el programa falla en producción.

Un **function type** es la forma que tiene TypeScript de describir la "firma" de una función: qué parámetros acepta, qué tipos son esos parámetros y qué devuelve. Gracias a eso, el compilador puede comprobar cada llamada antes de que el código se ejecute.

La forma general de un function type es:

```text
(parámetro1: Tipo1, parámetro2: Tipo2) => TipoDeRetorno
```

Si la función no devuelve nada útil, se usa `void` como tipo de retorno.

### Tipar parámetros y retorno

Cuando declaras una función con `function`, TypeScript infiere los tipos a partir de los parámetros y del `return`. Pero puedes (y a veces debes) declararlos explícitamente:

```typescript
function onUser(user: User) {
  console.log(user.name);
}
```

Aquí `user: User` obliga a quien llame a `onUser` a pasar un objeto con forma de `User`. Si le pasas un string, obtendrás un error en tiempo de compilación, no un fallo en tiempo de ejecución.

El valor de retorno también se puede anotar. En este ejemplo, la función devuelve un `number`:

```typescript
function add(a: number, b: number): number {
  return a + b;
}
```

Si olvidas el tipo de retorno, TypeScript lo infiere mirando lo que hay en los `return`. Anotarlo explícitamente es útil cuando una función es parte de una API pública: documenta tu intención y te avisa si algún día dejas de devolver lo prometido.

### Callbacks tipados

Un **callback** es una función que pasas a otra función para que sea "llamada más tarde". Los callbacks son everywhere en JavaScript: eventos del DOM (`button.addEventListener("click", ...)`), peticiones HTTP, temporizadores, etc.

Para tipar un callback, se usa justamente un function type como tipo del parámetro. El ejemplo clásico:

```typescript
function getUserWithCallback(callback: (user: User) => void) {
  callback({ name: "Luis", email: "luis@ejemplo.com" });
}
```

Descompongamos la línea:

| Parte | Significado |
|---|---|
| `callback` | nombre del parámetro |
| `:` | "es de tipo…" |
| `(user: User) => void` | function type: recibe un `User`, no devuelve nada |

La función que pases como argumento **debe** aceptar un `User` y **puede** devolver lo que quiera (el `void` del tipo dice que el valor de retorno no se usa). Así se usa:

```typescript
getUserWithCallback(function (user: User) {
  console.log(user.email);
});
```

También funciona con funciones flecha:

```typescript
getUserWithCallback((user: User) => console.log(user.email));
```

Si intentas pasar una función que espera un `number` en lugar de un `User`, TypeScript te lo dirá en la línea de la llamada. Esa es toda la gracia de los callbacks tipados: el contrato entre quien llama y quien recibe queda escrito y verificado.

---

## Clases en TypeScript

### Qué es una clase

Una **clase** es un molde para crear objetos. Define qué datos guardan (propiedades) y qué pueden hacer (métodos). TypeScript añade a las clases de JavaScript la posibilidad de **tipar** cada propiedad y cada método, lo que convierte errores tontos en errores de compilación.

### Propiedades, constructor y métodos

```typescript
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
```

Elementos del ejemplo:

- `x: number; y: number;` → **propiedades** de instancia: cada objeto creado con `new Point(...)` tendrá su propio `x` y `y`.
- `constructor(...)` → función especial que se ejecuta al hacer `new`. Recibe los valores iniciales y los asigna con `this.x = x`.
- `static instances = 0;` → propiedad **estática**: pertenece a la clase misma, no a las instancias. Se accede como `Point.instances`, y sirve, por ejemplo, para contar cuántos objetos se han creado (el constructor la incrementa en cada llamada).

### Herencia: extends y super

La **herencia** permite que una clase "hija" reutilice las propiedades y métodos de una clase "padre". En el ejemplo, `Point3D` es un punto, pero con una coordenada extra:

```typescript
class Point3D extends Point {
  z: number;
  constructor(x: number, y: number, z: number) {
    super(x, y, z);
    this.z = z;
  }
}
```

- `extends Point` → `Point3D` hereda de `Point`: tendrá `x`, `y`, `instances`, etc.
- `super(...)` → llama al constructor de la clase padre. **Debe** ser la primera cosa que hagas en el constructor de una clase que extiende otra.
- Después de `super(...)`, puedes inicializar las propiedades nuevas (`this.z = z`).

> Nota: en este ejemplo del curso, el constructor de `Point` recibe `(x, y)`. Si le pasas un tercer argumento a `super`, revisa que la firma del padre coincida con lo que llamas (lo veremos en *Errores comunes*).

### Interfaces con implements

Una interface describe un **contrato**: qué métodos o propiedades debe tener un objeto. Con `implements`, una clase se compromete a cumplir ese contrato:

```typescript
interface Colored {
  paint(): void;
}

class Pixel extends Point implements Colored {
  paint() {
    console.log(`Pintando en (${this.x}, ${this.y})`);
  }
}
```

`Pixel` hace dos cosas a la vez:

1. Hereda de `Point` (tiene `x` e `y`).
2. Cumple `Colored` (tiene un método `paint()` que no devuelve nada).

Si olvidas implementar `paint()`, TypeScript no compila. Así las interfaces funcionan como una checklist automática para tus clases.

---

### Parameter properties

#### El problema que resuelven

La forma "clásica" de declarar una clase repite mucho código: primero declaras la propiedad, luego la asignas en el constructor:

```typescript
class Point {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}
```

#### La solución: modifieros en el constructor

TypeScript permite combinar la **declaración** y la **asignación** poniendo un modificador de acceso en los parámetros del constructor. Esto se llama **parameter properties**:

```typescript
class PointParams {
  constructor(
    public x: number,
    public y: number,
  ) {}
}
```

Al poner `public x: number`, TypeScript hace dos cosas por ti:

1. Crea la propiedad `x` en la clase con ese tipo.
2. Asigna el valor del parámetro a esa propiedad.

El código de arriba es **equivalente** a la versión larga, pero en cuatro líneas. Los modificadores disponibles son:

| Modificador | Efecto | Accesible desde fuera de la clase |
|---|---|---|
| `public` | propiedad pública (es el valor por defecto si no pones nada) | sí |
| `private` | solo se usa dentro de la clase | no |
| `readonly` | no se puede reasignar después de crear el objeto | sí (lectura) |

Se pueden combinar: `private readonly id: number` crea una propiedad privada y de solo lectura.

---

### Definite assignment: el operador `!`

#### Cuándo aparece el error

Por defecto, TypeScript asume que **todas** las propiedades se asignan dentro del constructor. Si declaras una propiedad y no la asignas ahí, obtienes un error del tipo:

> Property 'someUselessValue' has no initializer and is not definitely assigned in the constructor.

#### La solución con `!`

A veces la asignación real ocurre en otro sitio (una función de inicialización, inyección de dependencias, un framework…) y TypeScript no puede verlo. En esos casos puedes usar la **definite assignment assertion**:

```typescript
class PointDefinite {
  public someUselessValue!: number; // "ya lo asigno luego"
}
```

El signo `!` al final del nombre le dice a TypeScript: **"confía en mí: esta propiedad nunca será `undefined`, aunque tú no veas la asignación"**.

| Aspecto | Sin `!` | Con `!` |
|---|---|---|
| Compila | no (error) | sí |
| Riesgo | detectas el fallo antes | si te equivocas, el error aparece en runtime |
| Uso recomendado | siempre que puedas | solo cuando la asignación es real pero invisible para TS |

Regla práctica: el `!` **desactiva una comprobación de seguridad**. Úsalo con moderación; si puedes asignar la propiedad en el constructor o con un valor por defecto (`someUselessValue = 0;`), es mejor solución.

---

## Módulos: export e import tipados

### Qué son los módulos

Un **módulo** es un archivo que puede exportar cosas (tipos, funciones, clases) e importarlas en otros archivos. Así organizas tu proyecto en piezas pequeñas y reutilizables.

Para exportar, se usa la palabra clave `export`:

```typescript
export interface ApiResponse<T> {
  data: T;
}
```

Para importar en otro archivo:

```typescript
import { ApiResponse } from "./api";
```

La gran ventaja de TypeScript es que **los tipos viajan con el módulo**: quien importa `ApiResponse` sabe exactamente qué estructura tiene y el editor puede autocompletarla.

### `verbatimModuleSyntax` y `import type`

Cuando tu `tsconfig.json` activa:

```json
{
  "compilerOptions": {
    "verbatimModuleSyntax": true
  }
}
```

TypeScript exige que distingas claramente entre **importar un valor** y **importar solo un tipo**. Si un `import` solo trae interfaces o types (cosas que existen únicamente en tiempo de compilación y desaparecen del JavaScript final), debes usar la forma explícita:

```typescript
import type { ApiResponse } from "./api";
```

Comparación:

| Situación | Sintaxis correcta con `verbatimModuleSyntax` |
|---|---|
| Importas una interfaz/type y solo lo usas como tipo | `import type { Foo } from "./mod";` |
| Importas una clase, función o valor (se usa en el JS final) | `import { Foo } from "./mod";` |
| Importas ambos en el mismo archivo | separa los imports: `import type { A } ...` + `import { b } ...` |

Si usas la sintaxis equivocada, obtienes un error de compilación. El objetivo de esta opción es que los imports del código compilado sean **idénticos** a los que escribiste (sin que el compilador elimine o reescriba imports silenciosamente).

---

## Errores comunes

### 1. Pasar argumentos con tipos incorrectos a una función

**Error:**

```text
Argument of type 'string' is not assignable to parameter of type 'User'.
```

**Solución:** revisa que el objeto que pasas tenga la forma exacta que espera el parámetro:

```typescript
// mal
getUserWithCallback("Luis");

// bien
getUserWithCallback({ name: "Luis", email: "luis@ejemplo.com" });
```

### 2. Olvidar `super(...)` o llamarlo tarde en una subclase

**Error:**

```text
Constructors for derived classes must contain a 'super' call.
```
o
```text
A 'super' call must be the first statement in the constructor.
```

**Solución:** la primera línea del constructor de la clase hija debe ser `super(...)`:

```typescript
class Point3D extends Point {
  z: number;
  constructor(x: number, y: number, z: number) {
    super(x, y); // primero, y con los argumentos que acepta el padre
    this.z = z;
  }
}
```

### 3. No implementar el método que exige `implements`

**Error:**

```text
Class 'Pixel' incorrectly implements interface 'Colored'.
Type 'Pixel' is missing the following properties: paint
```

**Solución:** añade a la clase todos los métodos y propiedades que declara la interface:

```typescript
class Pixel extends Point implements Colored {
  paint() {
    console.log(`Pintando en (${this.x}, ${this.y})`);
  }
}
```

### 4. Propiedad sin inicializar (y sin `!` ni asignación)

**Error:**

```text
Property 'someUselessValue' has no initializer and is not definitely assigned in the constructor.
```

**Solución (elige una):**

```typescript
// Opción A: asignarla en el constructor (lo ideal)
class PointDefiniteA {
  public someUselessValue: number;
  constructor() {
    this.someUselessValue = 0;
  }
}

// Opción B: valor por defecto en la declaración
class PointDefiniteB {
  public someUselessValue = 0;
}

// Opción C: afirmación de asignación (solo si la asignación es real pero invisible)
class PointDefinite {
  public someUselessValue!: number; // "ya lo asigno luego"
}
```

### 5. Importar un tipo sin `import type` con `verbatimModuleSyntax`

**Error:**

```text
'ApiResponse' is a type and must be imported using a type-only import when 'verbatimModuleSyntax' is enabled.
```

**Solución:**

```typescript
import type { ApiResponse } from "./api";
```

### 6. Mezclar modos de acceso y no poder leer una propiedad desde fuera

**Error:**

```text
Property 'x' is private and only accessible within class 'PointParams'.
```

**Solución:** si la propiedad necesita leerse desde fuera de la clase, declárala como `public` (o simplemente sin modificador):

```typescript
class PointParams {
  constructor(
    public x: number,
    public y: number,
  ) {}
}
```

---

## Conceptos clave

- **Function type**: descripción de la firma de una función `(params) => retorno`.
- **Callback tipado**: función pasada como argumento cuyo tipo se declara, p. ej. `(user: User) => void`.
- **Clase**: molde con propiedades tipadas, constructor y métodos.
- **`static`**: miembro que pertenece a la clase, no a cada instancia (`Point.instances`).
- **`extends` + `super(...)`**: herencia; `super` llama al constructor del padre y debe ir primero.
- **`implements`**: obliga a la clase a cumplir el contrato de una interface.
- **Parameter properties**: `public`/`private`/`readonly` en los parámetros del constructor declaran y asignan la propiedad en una sola línea.
- **Definite assignment (`!`)**: le dice a TS que una propiedad se asignará más adelante; desactiva la comprobación, úsalo con cuidado.
- **Módulos**: `export` para sacar, `import` para traer.
- **`import type`**: obligatorio con `verbatimModuleSyntax: true` cuando solo importas tipos.

## Autoevaluación

**1. Escribe el function type de una función que reciba un `number` y devuelva un `string`.**

<details>
<summary>Respuesta</summary>

```typescript
(n: number) => string
```

Por ejemplo: `const toString = (n: number): string => String(n);`
</details>

**2. ¿Qué hace `static instances = 0` en la clase `Point`? ¿Cómo se accede a él?**

<details>
<summary>Respuesta</summary>

Es una propiedad **estática**: hay una única copia compartida por toda la clase (no una por objeto). Se accede con el nombre de la clase: `Point.instances`. Sirve aquí para contar cuántas instancias se han creado, ya que el constructor la incrementa.
</details>

**3. ¿Por qué el `!` de `public someUselessValue!: number;` puede ser peligroso?**

<details>
<summary>Respuesta</summary>

Porque engaña al compilador: le prometes que la propiedad nunca será `undefined`, pero TypeScript deja de comprobarlo. Si en realidad nadie la asigna, el error aparece en tiempo de ejecución (por ejemplo, al leer `undefined.x`). Conviene asignarla en el constructor o con un valor por defecto siempre que sea posible.
</details>

**4. Con `verbatimModuleSyntax: true`, ¿cómo debes importar la interface `ApiResponse` si solo la usas como tipo?**

<details>
<summary>Respuesta</summary>

```typescript
import type { ApiResponse } from "./api";
```

Si la importaras con la sintaxis normal (`import { ApiResponse } ...`), TypeScript emitiría un error porque `ApiResponse` es solo un tipo.
</details>

---

## En el ejemplo

`fundamentals.ts` → secciones *FUNCTION TYPES*, *CLASSES* y *MODULOS*.
