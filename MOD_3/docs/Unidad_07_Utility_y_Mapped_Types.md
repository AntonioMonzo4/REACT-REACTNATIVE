# Unidad 07 — Utility Types y Mapped Types

## Objetivos

- Entender qué son los **utility types** y por qué TypeScript los trae incorporados de serie.
- Dominar las utilities esenciales: `Partial`, `Required`, `Readonly`, `Pick`, `Omit`, `Record`, `Exclude`/`Extract`, `ReturnType` y `NonNullable`.
- Derivar tipos nuevos a partir de interfaces reales (`User`, `UserPatch`, `UserPreview`, `UserInput`, `Flags`) sin duplicar código.
- Escribir **mapped types** a mano usando `[K in keyof T]`, `keyof T`, `T[K]` (indexed access) y el renombrado de claves con `as`.
- Construir el tipo `Getters<T>` combinando mapped types con template literal types (`get${Capitalize<...>}`).

## Requisitos

- **U06 — Generics**: casi todo lo que viene aquí son tipos con parámetros (`<T>`, `<T, K>`). Si todavía no te queda claro qué es `T` y cómo se "rellena" cuando usas el tipo, vuelve a esa unidad antes de continuar: sin generics, los utility types no tienen sentido.
- Manejo cómodo de `interface`, `type`, uniones con `|` y literales de cadena (`"name"`).
- Toca de pasada template literal types (`` `hola ${X}` ``), pero los verás a fondo en la U08 y en `fundamentals.ts`.

---

## Qué son los utility types

TypeScript incluye de serie una pequeña "caja de herramientas" de tipos: son los **utility types**. No hace falta instalar nada ni importarlos: están en el propio compilador. Básicamente son **tipos genéricos ya escritos** que transforman otros tipos: los vuelven opcionales, los recortan, los renombran, les quitan `null`...

**Analogía:** imagina a un sastre con un patrón base de traje (esa es tu `interface User`). En lugar de dibujar un patrón nuevo cada vez que quiere un traje sin bolsillos, o solo la chaqueta, o una versión "borrador" donde falta la medida de los brazos, usa **plantillas ya hechas** que recortan o modifican el patrón original. Los utility types son esas plantillas: no inventan ropa nueva, **transforman la que ya tienes**.

**¿Por qué importa?** Porque evitan la duplicación de interfaces. Sin ellos escribirías `UserPatch` a mano, luego otra versión para la vista previa del perfil, luego otra para el formulario de registro... y cuando `User` cambie, tendrás que actualizarlas todas a mano (y se te escapará alguna). Con utilities escribes **una sola fuente de verdad** (`User`) y derivas todas las variantes; si la fuente cambia, todas sus variantes se actualizan solas.

### Tabla de referencia rápida

| Nombre | Qué hace | Ejemplo |
| --- | --- | --- |
| `Partial<T>` | Vuelve **opcionales** todas las propiedades de `T` | `Partial<User>` → `{ name?: string; age?: number }` |
| `Required<T>` | Elimina los `?`: todas las propiedades quedan **obligatorias** | `Required<UserPatch>` → `{ name: string; age: number }` |
| `Readonly<T>` | Marca todas las propiedades como `readonly` (no se pueden reasignar) | `Readonly<User>` → `{ readonly name: string; readonly age: number }` |
| `Pick<T, K>` | Se queda **solo** con las claves indicadas en `K` | `Pick<User, "name">` → `{ name: string }` |
| `Omit<T, K>` | Se queda con **todo menos** las claves indicadas en `K` | `Omit<User, "age">` → `{ name: string }` |
| `Record<K, T>` | Crea un objeto cuyas claves son `K` y cuyo valor es siempre `T` | `Record<"dark" \| "lang", boolean>` → `{ dark: boolean; lang: boolean }` |
| `Exclude<T, U>` | De la unión `T`, **elimina** los tipos asignables a `U` | `Exclude<"a" \| "b" \| 1, string>` → `1` |
| `Extract<T, U>` | De la unión `T`, se queda **solo** con los asignables a `U` | `Extract<"a" \| "b" \| 1, string>` → `"a" \| "b"` |
| `ReturnType<F>` | Devuelve el tipo que **devuelve la función** `F` | `ReturnType<() => number>` → `number` |
| `NonNullable<T>` | **Quita** `null` y `undefined` del tipo `T` | `NonNullable<string \| null>` → `string` |

> En serio: no hace falta memorizar la tabla entera de golpe. Lo importante es entender el **patrón** (transformar, recortar, filtrar) y saber que esas utilities ya existen; cuando las necesites, las buscas en un minuto.

---

## Ejemplos concretos

Partimos de una interfaz base:

```typescript
interface User {
  name: string;
  age: number;
}
```

Y derivamos variantes sin escribir ninguna interfaz nueva:

```typescript
type UserPatch = Partial<User>;          // { name?: string; age?: number }
type UserPreview = Pick<User, "name">;   // { name: string }
type UserInput = Omit<User, "age">;      // { name: string }

type Flags = Record<"dark" | "lang", boolean>;
// { dark: boolean; lang: boolean }
```

Léelos así, en lenguaje natural:

- **`UserPatch`** es un *parche* de usuario: cuando tu API recibe una actualización parcial (`PATCH`), quizá solo llega el `name`... o solo la `age`. Si el tipo exigiera los dos campos, no podrías representar ese caso. `Partial` dice: "tráeme lo que puedas".
- **`UserPreview`** es lo que ves en una lista: solo el nombre, para no cargar datos de más.
- **`UserInput`** es lo que un formulario de registro debe enviar: el nombre sí, pero la edad la calcula el servidor, así que la **quitamos** con `Omit`.
- **`Flags`** es un mapa de booleanos con claves conocidas: ¿modo oscuro activado? ¿idioma en inglés? `Record` construye ese objeto a partir de la unión de claves.

### ¿Cuándo conviene usar cada una?

- **`Partial<T>`** → actualizaciones/patches de API, estados de formulario "empezando vacíos", opciones de configuración donde casi todo es opcional.
- **`Required<T>`** → el momento en que el borrador ya está completo y todo se vuelve obligatorio (por ejemplo, antes de enviar un formulario).
- **`Readonly<T>`** → constantes, configuración inyectada, props de React que el hijo no debe tocar: si alguien intenta reasignar, el compilador le para los pies.
- **`Pick<T, K>`** → vistas ligeras: listar solo el campo que se muestra en pantalla.
- **`Omit<T, K>`** → heredar todo **menos** algo peligroso o interno (p. ej. `Omit<User, "password">` o quitar `age` como en `UserInput`).
- **`Record<K, T>`** → diccionarios y mapas con claves conocidas: traducciones, flags, estados de un enum traducidos a textos, etc.
- **`Exclude<T, U>` / `Extract<T, U>`** → filtrar uniones: "qué variantes de este tag me quedan", "dame solo los eventos de tipo 'click'".
- **`ReturnType<F>`** → cuando quieres que otro tipo coincida con lo que devuelve una función, sin repetir el tipo a mano.
- **`NonNullable<T>`** → cuando vienen datos de una API que puede ser `null` y necesitas el tipo "limpio" para trabajar.

---

## Mapped types (a mano)

Los utility types de la tabla de arriba no son magia: en el fondo, la mayoría son **mapped types**, y tú puedes escribirlos. Un mapped type **recorre las propiedades de un tipo existente** y "remezcla" cada una según una regla. Su aspecto es este:

```typescript
type NuevoTipo<T> = {
  [K in keyof T]: NuevoValor;
};
```

Se lee así: **"para cada clave `K` *en* las claves de `T`, crea una propiedad llamada `K` cuyo valor sea `NuevoValor`"**. Es un `for`... pero del compilador: en vez de iterar valores en tiempo de ejecución, iteras **propiedades en tiempo de compilación**.

Necesitas conocer tres piezas:

- **`keyof T`** → une todas las claves de `T` como literales. Con `User`, `keyof User` es `"name" | "age"`.
- **`T[K]`** (*indexed access*) → el **tipo del valor** que vive en esa clave. `User["name"]` es `string`, `User["age"]` es `number`.
- **`as`** dentro del mapped type → **renombra** la clave resultante (se llama *key remapping*) y permite usar template literals encima.

### Ejemplo completo: `Getters<T>`

```typescript
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

type UserGetters = Getters<User>;
// { getName: () => string; getAge: () => number }
```

Desglosemos la línea larga, paso a paso:

1. `keyof T` recorre las claves de `User`: primero `K = "name"`, luego `K = "age"`.
2. `as \`get${...}\`` renombra la clave: `"name"` pasa a ser `` `getName` `` y `"age"` a `` `getAge` `` (aquí entra en juego `Capitalize`, que convierte la primera letra en mayúscula: `name` → `Name`).
3. El `string & K` es un pequeño truco técnico: le dice a `Capitalize` "trata esto como string", para que no se queje cuando `K` sea una clave genérica. Tú puedes leerlo como el pegamento que hace que la plantilla funcione con cualquier `T`.
4. `: () => T[K]` define el valor de cada getter: una función **sin argumentos** que devuelve el tipo original de esa propiedad (`User["name"]` → `string`, `User["age"]` → `number`).

El resultado es una interfaz de getters "generada sola":

```typescript
// equivalente a escrito a mano:
{
  getName: () => string;
  getAge: () => number;
}
```

**¿Por qué molestarte?** Porque si mañana `User` gana un campo `email`, `UserGetters` tendrá `getEmail` **sin tocar una línea** de la definición de `Getters`. Esa es la potencia de combinar generics + mapped types + template literals.

---

## Errores comunes

### 1. Pasar a `Pick`/`Omit` una clave que no existe

```typescript
type Mal = Pick<User, "nombre">; // Error: Type '"nombre"' is not assignable to type 'keyof User'
```

TS espera exactamente `"name"` (en inglés, con esa ortografía). El compilador te da la pista en el mensaje: míralo, no lo ignores.

**Solución:** usa el nombre real de la propiedad: `Pick<User, "name">`.

### 2. Creer que `Partial` es "profundo"

```typescript
type Deep = Partial<{ a: { b: string } }>;
// sigue siendo { a?: { b: string } }  →  si pones `a`, su `b` es obligatorio
```

`Partial` solo opcionaliza el **primer nivel**. Dentro de `a`, la estructura no cambia.

**Solución:** si necesitas opcionales anidados, no existe una utility estándar para eso; escribe tu propia utility recursiva (o reformula tu tipo). Y de paso: `Required` y `Readonly` tampoco son profundos.

### 3. Confundir `keyof T` con `T[K]`

```typescript
type Keys  = keyof User;     // "name" | "age"   → las CLAVES
type Value = User["name"];   // string           → el TIPO del VALOR
```

**Solución:** memoriza la pareja: **`keyof` = claves** (qué nombres de propiedades hay), **`T[K]` = valor** (qué tipo vive ahí).

### 4. Usar `Getters` (u otra utility) sin darle el tipo

```typescript
type Malo = Getters;
// Error: Generic type 'Getters<T>' requires 1 type argument(s).

type Bueno = Getters<User>; // ✅
```

**Solución:** siempre rellena los parámetros: `Partial<User>`, `Pick<User, "name">`, `Getters<User>`, etc. El error te está diciendo exactamente cuántos faltan.

### 5. Escribir un mapped type sin `keyof`

```typescript
type Malo<T> = { [K in T]: T[K] };
// Error: Type 'T' does not satisfy the constraint 'string | number | symbol'.
// (K debe recorrer las CLAVES de un objeto, no cualquier tipo)

type Bueno<T> = { [K in keyof T]: T[K] }; // ✅
```

**Solución:** `in` siempre va detrás de **`keyof T`** (o detrás de una unión de claves ya conocidas). `in T` solo funciona si `T` es un tipo de clave válido.

---

## Conceptos clave

- Los **utility types** vienen de serie en TypeScript: transforman tipos existentes sin duplicar interfaces.
- `Partial` / `Required` / `Readonly` cambian los **modificadores** (`?` y `readonly`) de todas las propiedades (solo a nivel superficial).
- `Pick<T, K>` selecciona claves y `Omit<T, K>` descarta claves: dos caras de la misma moneda.
- `Record<K, T>` construye objetos-mapas a partir de una unión de claves.
- `Exclude` y `Extract` filtran uniones; `ReturnType` extrae el tipo de retorno; `NonNullable` elimina `null | undefined`.
- Un **mapped type** recorre propiedades: `[K in keyof T]` itera las claves.
- **`keyof T`** da las claves; **`T[K]`** (indexed access) da el tipo del valor de esa clave.
- El **`as`** del mapped type renombra claves y permite combinarlo con template literals.
- `Getters<T>` es el ejemplo canónico: genera `getName`, `getAge`... automáticamente para cualquier `T`.
- Utilities + mapped types son la base sobre la que se apoyan las Conditional Types de la U08.

## Autoevaluación

**1. ¿Qué tipo produce `Partial<User>` y para qué te serviría en una API REST?**

<details>
<summary>Respuesta</summary>

Produce `{ name?: string; age?: number }`: ambas propiedades pasan a ser opcionales. Te sirve para endpoints de actualización parcial (p. ej. `PATCH /users`), donde el cliente puede enviar solo `name`, solo `age`, o ambos.

</details>

**2. Diferencia entre `Pick<User, "name">` y `Omit<User, "age">`. ¿Son intercambiables aquí?**

<details>
<summary>Respuesta</summary>

`Pick<User, "name">` se queda **solo** con `name` (`{ name: string }`). `Omit<User, "age">` se queda con todo **menos** `age` (también `{ name: string }`). En este caso particular el resultado es el mismo porque `User` solo tiene dos campos, pero el **intento** es opuesto: `Pick` piensa en "qué quiero", `Omit` piensa en "qué no quiero". Con una interfaz de 10 campos, elegir uno u otro cambia el resultado por completo.

</details>

**3. En `Getters<T>`, ¿qué papel juega `keyof T`, cuál `T[K]` y cuál el `` as `get${...}` ``?**

<details>
<summary>Respuesta</summary>

- `keyof T`: recorre las claves del tipo (`"name" | "age"`).
- `T[K]`: obtiene el tipo del valor de cada clave (`string`, `number`), que es lo que devuelve el getter.
- `` as `get${Capitalize<...>}` ``: renombra cada clave generando `getName`, `getAge`, etc.

</details>

**4. ¿Qué produce `type A = Record<"x" | "y", number>`? ¿Y por qué es mejor que escribir la interfaz a mano?**

<details>
<summary>Respuesta</summary>

Produce `{ x: number; y: number }`. Es mejor porque si mañana añades `"z"` a la unión de claves, la interfaz se actualiza sola: solo cambias la unión `"x" | "y" | "z"` y no tocas la estructura. Además deja intención explícita: "todas mis claves tienen el mismo tipo de valor".

</details>

---

*Verás todos estos conceptos en acción en `fundamentals.ts`, secciones **Conditional Types** y **Template Literal Types**. Esta unidad es la base directa de la U08 (Conditional Types e `infer`).*
