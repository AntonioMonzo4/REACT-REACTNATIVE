# Unidad 03 — Interfaces y Type Alias

## Objetivos

- Entender qué es una **interface** y usarla para describir la forma de un objeto.
- Marcar propiedades como **opcionales** con `?` y saber cuándo conviene hacerlo.
- Diferenciar el uso **inline** (objeto escrito en el momento) de una `interface` con nombre.
- Conocer el **declaration merging** y la **index signature**.
- Crear **type alias** para dar nombre a cualquier tipo y combinar tipos con la **intersección `&`**.
- Elegir con criterio entre `interface` y `type` usando una regla práctica.

## Requisitos

- Haber completado la **Unidad 02 de este módulo** (tipos primitivos, funciones y básicos de TypeScript).
- Tener el proyecto de práctica `hello-world/` funcionando (ver `hello-world/tsconfig.json`).
- Saber abrir y leer el archivo `hello-world/src/fundamentals.ts`, donde practicaremos los ejemplos.

## ¿Qué es una interface?

Una **interface** (interfaz) es un **contrato de forma** para un objeto. Le dice a TypeScript: *"cualquier objeto que tenga este tipo debe tener estas propiedades, con estos tipos"*. Si el objeto no cumple el contrato, TypeScript avisa antes de que el programa corra.

**Analogía:** es como el molde de una galleta. El molde no es la galleta en sí, pero define qué forma tendrán todas las galletas que salgan de él: mismo tamaño, mismos agujeros, mismo borde. Si intentas meter una masa con otra forma, no encaja.

**¿Por qué importa?** Sin interface, podrías pasar un objeto con propiedades equivocadas y el error aparecería (o no) en tiempo de ejecución, cuando el usuario ya está usando la app. Con interface, el error aparece en tu editor mientras escribes.

### Interface con propiedades opcionales (`?`)

Una propiedad marcada con `?` es **opcional**: puede existir o no. Es ideal para datos que no siempre tenemos (por ejemplo, la edad de un usuario puede no estar registrada).

```typescript
interface User {
  name: string;
  age?: number; // opcional
}
```

Con esto, `{ name: "Ana" }` es válido, y `{ name: "Ana", age: 30 }` también. Pero `{ age: 30 }` (sin `name`) es error, porque `name` es obligatorio.

### Uso inline vs interface

También puedes describir un objeto **en el momento**, sin crear una interface con nombre. Esto se llama uso **inline**:

```typescript
function printLabel(options: { label: string }) {
  console.log(options.label);
}

function getUser(): { name: string; age?: number } {
  return { name: "Ana" };
}
```

- En `printLabel`, el parámetro `options` debe ser un objeto con `label: string`.
- En `getUser`, la función debe devolver un objeto con `name: string` y, si aparece, `age?: number`.

**¿Cuándo usar cada uno?** Si vas a usar la forma **una sola vez** y es pequeña, el uso inline está bien. Si la forma se repite en varias funciones, o quieres darle un nombre que explique qué representa (`User`, `Product`...), crea una interface con nombre: el código queda más legible y es más fácil de mantener.

## Declaration merging (fusión de declaraciones)

Si declaras la **misma interface dos veces**, TypeScript no se queja: las **fusiona** en una sola. Esto se llama *declaration merging* (fusión de declaraciones).

```typescript
interface User {
  name: string;
}

interface User {
  email: string;
}
// User ahora tiene name + email
```

Tras las dos declaraciones, `User` exige `name` **y** `email`.

**¿Para qué sirve en la vida real?** Para **ampliar interfaces de librerías sin modificarlas**. Imagina que usas una librería que declara `interface Config` pero no incluye una propiedad tuya. Puedes declarar `interface Config` otra vez en tu código añadiendo tus propiedades; TypeScript las une y no tienes que tocar (ni copiar) el código de la librería. Es una forma segura de extender cosas que no posees.

## Index signature (firma de índice)

A veces no sabemos de antemano **qué nombres de propiedades** tendrá un objeto, solo qué **tipo** tendrán todas. La **index signature** lo expresa con `[clave: tipo]: valor`:

```typescript
interface Dictionary {
  [key: string]: Object[];
}
```

Esto significa: *"puedes usar cualquier string como clave, y siempre obtendrás un array de `Object`"*. Es la forma de describir mapas o diccionarios, como `{ "uno": [...], "dos": [...] }`.

## Type Alias

Un **type alias** (alias de tipo) es simplemente un **nombre para cualquier tipo**, no solo para objetos. Se crea con `type`.

**Analogía:** es como poner una etiqueta en una caja. Dentro de la caja puede haber lo que sea (un string, una unión, un objeto...), pero a partir de ahora hablas de la caja por su etiqueta.

```typescript
type Name = string | string[];
```

Aquí `Name` es un nombre que representa `string` **o** `string[]`. Donde escribas `Name`, TypeScript entenderá esa unión.

### Intersecciones `&`

El operador `&` crea una **intersección**: un tipo que cumple **todos** los tipos involucrados a la vez.

```typescript
interface Colorful { color: string }
interface Circle { radius: number }

type ColorfulCircle = Colorful & Circle; // intersección

const circulo: ColorfulCircle = { color: "rojo", radius: 2 };
```

`ColorfulCircle` exige `color` **y** `radius` juntos. Si falta uno, hay error. Es como decir: *"esto debe ser Colorful y, encima, Circle"*.

## Interface vs type

| Característica | `interface` | `type` |
|----------------|-------------|--------|
| Objetos / clases | ✅ ideal | ✅ |
| Uniones, intersecciones, tuples | ❌ | ✅ |
| Declaration merging | ✅ | ❌ |
| `implements` en clases | ✅ | ✅ si es objeto |

**Regla práctica**: objetos que se extienden → `interface`; uniones/utilidades → `type`.

Es una guía, no una ley: para objetos simples, ambas opciones suelen funcionar. Si dudas y vas a modelar objetos que crecerán o se ampliarán, empieza por `interface`.

## Errores comunes

**1. Falta una propiedad obligatoria**

```typescript
interface User {
  name: string;
  age?: number;
}

const u: User = { age: 30 }; // Error: falta "name"
```

*Solución:* añade `name` o, si realmente es opcional, márcalo con `?` en la interface (`name?: string`).

**2. Propiedad que no existe en la interface (exceso de propiedades)**

```typescript
interface User {
  name: string;
}

const u: User = { name: "Ana", email: "a@b.c" }; // Error: "email" no existe en User
```

*Solución:* añade `email?: string` a la interface, o quita la propiedad extra del objeto.

**3. Intentar fusionar dos `type` con el mismo nombre**

```typescript
type A = { x: number };
type A = { y: number }; // Error: Duplicate identifier 'A'
```

*Solución:* el declaration merging solo funciona con `interface`. Usa una sola declaración `type` (por ejemplo con intersección: `type A = { x: number } & { y: number }`), o cambia a `interface`.

**4. Olvidar que `&` exige ambos lados**

```typescript
const c: ColorfulCircle = { color: "rojo" }; // Error: falta "radius"
```

*Solución:* recuerda que la intersección combina todo: el objeto debe cumplir **todos** los tipos unidos.

## Conceptos clave

- **Interface**: contrato de forma para objetos; define qué propiedades deben existir y de qué tipo.
- **Propiedad opcional `?`**: puede estar presente o no; útil cuando el dato no siempre existe.
- **Uso inline**: describir la forma del objeto en el momento, sin nombre; vale para casos únicos y pequeños.
- **Declaration merging**: si repites el nombre de una `interface`, TypeScript las une; sirve para ampliar librerías sin editarlas.
- **Index signature** (`[key: string]: T`): describe objetos con claves dinámicas, tipo diccionarios.
- **Type alias** (`type`): da un nombre a **cualquier** tipo (uniones, literales, objetos...).
- **Intersección `&`**: tipo que cumple todos los tipos combinados a la vez.
- **Regla práctica**: objetos que se extienden → `interface`; uniones/utilidades → `type`.

## Autoevaluación

**1. ¿Qué es una interface y para qué sirve?**

<details>
<summary>Respuesta</summary>

Es un contrato de forma para un objeto: indica qué propiedades debe tener y de qué tipo cada una. Sirve para que TypeScript detecte errores de forma al escribir el código, antes de ejecutarlo.

</details>

**2. En `interface User { name: string; age?: number }`, ¿qué significa `age?: number`?**

<details>
<summary>Respuesta</summary>

Que `age` es opcional: el objeto puede llevar `age` de tipo `number`, o no llevarla en absoluto. Lo que no puede es llevarla con otro tipo (por ejemplo, un string).

</details>

**3. ¿Cuál es la diferencia entre el uso inline y una interface con nombre? ¿Cuándo conviene cada uno?**

<details>
<summary>Respuesta</summary>

El uso inline describe la forma directamente en la función o variable (ej. `{ label: string }`); la interface con nombre da un nombre reutilizable (`User`). Conviene el inline para formas pequeñas y de un solo uso; la interface con nombre cuando la forma se repite o se lee mejor con un nombre propio.

</details>

**4. ¿Qué produce el declaration merging y en qué te ayuda al usar una librería?**

<details>
<summary>Respuesta</summary>

Si declaras la misma `interface` dos veces, TypeScript las fusiona en una sola con todas las propiedades. Te permite ampliar interfaces de librerías añadiendo tus propiedades sin modificar (ni copiar) el código de la librería.

</details>

## En el ejemplo

`fundamentals.ts` → secciones *INTERFACES* y *Type Aliases* (en `hello-world/src/fundamentals.ts`).
