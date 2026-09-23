# Unidad 08 — Conditional Types e `infer`

## Objetivos

- Escribir **tipos condicionales** con la sintaxis `extends ? :` y saber leerlos en voz alta ("si T extiende de X, entonces..., si no...").
- Comprender la **distributividad** sobre uniones y detectar cuándo ocurre (y cuándo no).
- Usar **`infer`** para extraer tipos "escondidos": tipo de retorno de funciones y elementos de tuplas (`First<T>`).
- Practicar la **extracción de propiedades** con indexed access (`Building["room"]["walls"]`) y el recap de `keyof`.
- Recordar los **template literals + `infer`** (`TrimLeft`) y aplicar las buenas prácticas del curso (`unknown` > `any`, encadenar utilities, `strict: true`, tipar la frontera de la app).

## Requisitos

- **U06 — Generics**: los condicionales siempre viven dentro de un genérico (`type X<T> = T extends ...`). Sin entender `T`, este tema es incomprensible.
- **U07 — Utility y Mapped Types**: debes tener claro `keyof`, `T[K]` (indexed access) y cómo se leen las utilities, porque aquí las vas a **construir tú mismo**.
- Uniones (`string | number`), literales y template literal types básicos (`` `hola ${X}` ``).

---

## Qué es un tipo condicional

Un tipo condicional es un **`if` del compilador**. En JavaScript escribimos `cond ? a : b` para elegir un **valor**; en TypeScript podemos elegir un **tipo** según si un tipo encaja con otro. La sintaxis general es:

```typescript
// SomeType extends OtherType ? TrueType : FalseType
```

Se lee exactamente así, en español:

> **"si `SomeType` extiende (encaja con / es assignable a) `OtherType`, entonces el resultado es `TrueType`; si no, es `FalseType`"**.

**Analogía:** piensa en una puerta con un vigilante. Le das un tipo por la mano; el vigilante lo mira y dice "esto es un string, pasa por la puerta de la izquierda" o "esto no es un string, pasa por la derecha". Tú defines quién pasa por cada lado, y el compilador aplica la regla **antes de que exista el programa** (en tiempo de compilación).

**¿Por qué importa?** Porque muchas APIs genéricas necesitan *reaccionar* al tipo que reciben. ¿Devolvemos un array o un scalar? ¿Extraemos el elemento de la tupla o `never`? Sin condicionales, tendrías que escribir una interfaz por cada caso; con ellos, **una sola definición se adapta sola** a cualquier tipo que le pases.

### Ejemplo base y lectura paso a paso

```typescript
type ToArray<T> = T extends any ? T[] : never;

type StrArrOrNumArr = ToArray<string | number>;
// string[] | number[]  (distributivo sobre unions)
```

Léelo en voz alta: **"si `T` extiende de `any`, entonces `T[]`, si no `never`"**. Como `any` acepta todo, la rama falsa nunca se usa aquí... pero fíjate en el resultado: no es `(string | number)[]`, sino **`string[] | number[]`**. ¿Por qué? Porque algo llamado *distributividad* entró en juego. Vamos a ello.

---

## Distributividad sobre unions

Cuando el parámetro genérico aparece **"desnudo"** en el `extends` (tal cual, sin ir envuelto en un array, una tupla u otra estructura) y le llega una **unión**, TypeScript no evalúa la unión entera de golpe: **aplica el condicional a cada miembro por separado** y luego une los resultados con `|`.

Con `ToArray<string | number>` ocurre esto, como si TS escribiera:

1. `ToArray<string>` → `string extends any ? string[] : never` → `string[]`
2. `ToArray<number>` → `number extends any ? number[] : never` → `number[]`
3. Une los dos resultados → **`string[] | number[]`**

Ese es el famoso ejemplo de `ToArray`: **`string[] | number[]` (distributivo sobre unions)**, no `(string | number)[]`.

### ¿Y si no quiero que distribuya?

Envuelve el parámetro en una tupla. `[T]` ya no está "desnudo", así que TS evalúa la unión completa de una sola vez:

```typescript
type ToArrayNoDist<T> = [T] extends [any] ? T[] : never;

type A = ToArrayNoDist<string | number>; // (string | number)[]
```

| Situación | ¿Distribuye? | Resultado con `string | number` |
| --- | --- | --- |
| `T extends ...` (desnudo) | Sí | `string[] | number[]` |
| `[T] extends ...` (en tupla) | No | `(string | number)[]` |

> Regla práctica: **desnudo = distribuye**. Recuerda la palabra: el tipo "desnudo" se descompone miembro a miembro, como repartir la unión en sobres individuales.

---

## Inferencia con `infer`

`infer` es la palabra clave de "extrae aquí un tipo y déjamelo usar". Solo puede aparecer dentro de la rama `extends` de un tipo condicional, y su valor se usa en la **rama verdadera**. Es como decir: *"si encaja, **agarra** esa parte del tipo y llámala `R`"*.

### Extraer el tipo de retorno de una función

```typescript
type GetReturnType<T> = T extends (...args: unknown[]) => infer R
  ? R
  : never;

type Num = GetReturnType<() => number>; // number
```

Léelo: **"si `T` es una función que recibe cualquier argumentos y devuelve `infer R`, entonces devuelve `R`; si no, `never`"**. TS "agarra" el tipo que va después de la flecha y lo deja guardado en `R`. Con `() => number`, `R` se rellena con `number`.

### Extraer el primer elemento de una tupla

```typescript
type First<T extends Array<any>> = T extends [infer F, ...infer Rest]
  ? F
  : never;

type FirstStr = First<["hello", 1, false]>; // 'hello'
```

Aquí hay **dos** `infer` a la vez: `F` captura el primer elemento y `Rest` captura lo que sobra (la cola de la tupla). La lectura: **"si `T` es una tupla cuyo primer elemento es `F` y el resto es `Rest`, entonces devuelve `F`; si no, `never`"**. Con `["hello", 1, false]`, `F = "hello"`. (Si te preguntas para qué sirve `Rest`: es la base de utilidades recursivas que "pisan" una tupla elemento a elemento; aquí nos quedamos con `F`.)

---

## Extracción de propiedades (indexed access en profundidad)

En la U07 viste `T[K]` con una sola clave. Puedes **encadenar** corchetes como si fueran una ruta de archivo dentro de un objeto:

```typescript
interface Building {
  room: {
    door: string;
    walls: string[];
  };
}

type Walls = Building["room"]["walls"]; // string[]
```

Se lee como `casa/sala/paredes`: primero bajamos a `room` (su tipo es el objeto interior), y de ahí sacamos `walls` (que es `string[]`). **No estás extrayendo un valor**, estás extrayiendo **el tipo** que vive en esa ruta. Si alguna clave no existe, TS avisa al instante (un `keyof` inválido o una ruta equivocada es error de compilación, no `undefined` en producción).

---

## `keyof` (recap)

`keyof` devuelve la **unión de las claves** de un tipo. Es la pieza que casi siempre alimenta a los mapped types:

```typescript
type PointCoords = { x: number; y: number };
type P = keyof PointCoords; // "x" | "y"
```

Con `"x" | "y"` en la mano, puedes iterar (`[K in P]`), comprobar pertenencias (`K extends "x"`...) o construir tipos derivados. Recuerda la pareja de la U07: **`keyof T` → claves; `T[K]` → tipo del valor**.

---

## Template literals + infer (recap)

Los template literal types permiten "cortar" strings por patrones, y con `infer` puedes quedarte con el trozo que sobra. Ejemplo clásico recursivo de `fundamentals.ts`:

```typescript
type TrimLeft<S extends string> =
  S extends `${SpaceChar}${infer Rest}` ? TrimLeft<Rest> : S;
```

Léelo: **"si `S` empieza con un carácter de espacio (`SpaceChar`, definido en `fundamentals.ts`) seguido de `Rest`, entonces sigue recortando con `TrimLeft<Rest>`; si no, devuelve `S` tal cual"**. `infer Rest` se queda con todo lo que hay **después** del espacio; la recursión repite el proceso hasta que la cadena ya no empiece por espacio. Es el mismo patrón que `First<T>` pero aplicado a strings: **plantilla + `infer` + recursión**.

---

## Buenas prácticas

1. **Prefiere `unknown` + narrowing a `any`.** Con `any` desactivas los frenos del compilador: cualquier cosa pasa y los errores saltan (si acaso) en runtime. Con `unknown` te obligas a comprobar el tipo antes de usarlo (`typeof`, guards), y el error aparece en el editor.
2. **Encadena utilities (`Partial<Pick<...>>`) en vez de duplicar interfaces.** Cada interfaz escrita a mano es una fuente de verdad más que puede desincronizarse. Componer `Pick`, `Omit`, `Partial`... te da variantes que se actualizan solas.
3. **`strict: true` en `tsconfig` siempre que se pueda.** Sin modo estricto, `null` y `undefined` se escapan de los condicionales y muchas utilities dan resultados "sospechosamente" permisivos. El modo estricto es lo que hace que `NonNullable` y los `infer` se comporten como esperas.
4. **Tipa la frontera de la app (API, props de React) y deja lo interno inferir.** Los tipos "caros" (donde entra datos del exterior) merecen anotaciones cuidadas; el interior de las funciones, TS lo deduce muy bien. Anotar todo por anotar solo añade ruido.

---

## Errores comunes

### 1. Confundir el `extends` de herencia con el `extends` condicional

```typescript
interface Animal { vivo: boolean; }
interface Perro extends Animal { ladra: boolean; } // ✅ herencia de interfaces

type EsPerro<T> = T extends Perro ? "sí" : "no";  // ✅ condicional de tipos
```

Dentro de un `type X<T> = ...`, el `extends` **nunca** hereda: solo compara/evalúa. Si intentas `type X extends Y`, es un error de sintaxis.

**Solución:** herencia → `interface A extends B`. Decisión de tipo → `T extends U ? ... : ...`.

### 2. Esperar distributividad cuando el parámetro no está desnudo

```typescript
type NoDist<T> = T[] extends any[] ? "array" : "no-array";

type R = NoDist<string | number>; // "array" (se evalúa (string | number)[] de golpe)
```

`T[]` **no** es un parámetro desnudo, así que no hay reparto miembro a miembro.

**Solución:** si quieres distribución, escribe `T extends ...`; si no, envuelve en tupla `[T] extends ...`. (Vuelve a la tabla de distributividad.)

### 3. Olvidar el argumento de tipo al usar la utility

```typescript
type R = GetReturnType;
// Error: Generic type 'GetReturnType<T>' requires 1 type argument(s).

type R2 = GetReturnType<() => number>; // ✅ number
```

**Solución:** rellena siempre el genérico. El propio mensaje del error te dice cuántos faltan y cómo se llama el tipo.

### 4. Usar `any` en la frontera de la app "para que compile"

```typescript
function handle(data: any) {
  data.foo.bar; // 😱 TS no te avisa; el error (si llega) es en runtime
}

function handle(data: unknown) {
  data.foo; // ❌ Error en compilación: debo comprobar el tipo primero
}
```

**Solución:** en datos que vienen de fuera (API, formularios, props), usa `unknown` y hace narrow antes de tocar nada. Reserva el uso de `any` (y mejor, `// eslint-disable-next-line` justificado) para casos puntuales y conscientes, nunca como primera opción.

---

## Conceptos clave

- **Tipo condicional** = `T extends U ? TrueType : FalseType`; se lee "si `T` extiende de `U`, entonces..., si no...".
- El `extends` condicional **compara tipos**, no hereda (la herencia es de `interface`).
- **Distributividad**: un parámetro **desnudo** que recibe una unión reparte el condicional por miembro (`ToArray<string | number>` → `string[] | number[]`); envolviéndolo en `[T]` se evita.
- **`infer`** extrae una parte del tipo (`infer R`, `infer F`, `infer Rest`) y solo se usa en la rama verdadera.
- `GetReturnType<T>` devuelve el tipo de retorno; `First<T>` devuelve el primer elemento de una tupla.
- **Indexed access encadenado**: `Building["room"]["walls"]` baja por rutas de tipo como si fueran rutas de archivo.
- **`keyof T`** da las claves (`keyof PointCoords` → `"x" | "y"`).
- **Template literals + `infer` + recursión** permiten manipular strings a nivel de tipo (`TrimLeft`).
- Buenas prácticas: `unknown` > `any`, encadenar utilities, `strict: true`, tipar la frontera de la app y dejar inferir el interior.

## Autoevaluación

**1. Reescribe en palabras la lectura de `type ToArray<T> = T extends any ? T[] : never` y explica el resultado de `ToArray<string | number>`.**

<details>
<summary>Respuesta</summary>

Se lee: "si `T` extiende de `any`, entonces `T[]`, si no `never`". Como `T` aparece desnudo en el `extends` y recibe la unión `string | number`, el condicional **distribuye**: primero se aplica a `string` (→ `string[]`) y luego a `number` (→ `number[]`), y se unen los resultados. Final: `string[] | number[]` (no `(string | number)[]`).

</details>

**2. ¿Qué tipo devuelve `GetReturnType<() => number>`? ¿Y para qué sirve `infer R` exactamente?**

<details>
<summary>Respuesta</summary>

Devuelve `number`. `infer R` es un "hueco" de inferencia: le dice a TypeScript "si `T` es una función, agarra el tipo que está después de la flecha y guárdalo en `R`". La rama verdadera del condicional devuelve ese `R`. Si `T` no es una función, no se puede extraer nada y cae en la rama falsa: `never`.

</details>

**3. Dado `Building`, ¿qué tipo es `Building["room"]["walls"]`? ¿Qué pasaría si escribieras `Building["rooms"]` (con "s")?**

<details>
<summary>Respuesta</summary>

`Building["room"]["walls"]` es `string[]`: es indexed access encadenado, baja a la propiedad `room` y de ahí extrae `walls`. `Building["rooms"]` daría **error de compilación** porque `rooms` no es una clave de `Building` (el mensaje típico es "Property 'rooms' does not exist on type 'Building'").

</details>

**4. ¿Qué produce `type FirstStr = First<["hello", 1, false]>` y qué papel juega `Rest` aunque no se use en la respuesta final?**

<details>
<summary>Respuesta</summary>

`FirstStr` es `"hello"`. El patrón `[infer F, ...infer Rest]` "agarra" el primer elemento en `F` y la cola de la tupla en `Rest`. Aquí solo devolvemos `F`, pero `Rest` es imprescindible para que el patrón deresta (rest elements) encaje con cualquier longitud de tupla y, sobre todo, es la base de utilidades recursivas que consumen la tupla elemento a elemento.

</details>

---

*Verás todo esto en acción en `fundamentals.ts`, secciones **Conditional Types**, **Inferring** y **type extractions**.*
