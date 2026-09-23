# Unidad 02 — Tipos básicos

## Objetivos

- Declarar variables con los tipos primitivos de TypeScript: `boolean`, `number`, `string`, `bigint` y `symbol`.
- Crear y leer arrays y tuples, entendiendo la diferencia entre posición libre y posición fija.
- Usar **union types** (`|`) y los tipos anulables `null` y `undefined` para representar "quizá no hay valor".
- Distinguir en profundidad `any`, `unknown`, `void` y `never`, y saber **por qué evitar `any`**.
- Aplicar *narrowing* sobre `unknown` (con ejemplos) antes de usar un valor.
- Escribir funciones con tipos en parámetros y valor de retorno, y marcar parámetros opcionales con `?`.

## Requisitos

- Haber completado la [Unidad 01 — Introducción a TypeScript](./Unidad_01_Introduccion_TypeScript.md): qué es TS, cómo se compila con `tsc` y para qué sirve `strict` en el `tsconfig.json`.
- Tener el ejemplo [`../hello-world/`](../hello-world/) a mano; esta unidad se practica entera en [`../hello-world/src/fundamentals.ts`](../hello-world/src/fundamentals.ts).
- Conocer lo mínimo de JavaScript: `let`/`const`, funciones con `function` y cómo ejecutar un script con `pnpm run check` / `pnpm run build` (repasado en la Unidad 01).
- Todas las anotaciones de esta unidad suponen `strict: true`; con el modo estricto desactivado, varios de los avisos que explicamos aquí no aparecerían.

---

## Primitivos y colecciones

Los **primitivos** son los tipos atómicos: el "material básico" con el que se construye todo lo demás. Declaras una variable con `let` o `const`, pones `: tipo` y listo.

```typescript
let isDone: boolean = false;
let decimal: number = 6;
let color: string = "blue";
let big: bigint = 100n;
let unique: symbol = Symbol("id");
```

### Qué significa cada uno

| Tipo | Qué guarda | Ejemplo | Notas para principiantes |
|------|-----------|---------|--------------------------|
| `boolean` | Solo `true` o `false` | `false` | Ideal para banderas: ¿está activo?, ¿terminó? |
| `number` | Cualquier número (enteros, decimales, negativos, `NaN`...) | `6`, `3.14`, `-1` | En JS **no** hay tipos separados para enteros y flotantes: todo es `number` |
| `string` | Texto | `"blue"`, `'hola'` | Comillas simples o dobles son equivalentes |
| `bigint` | Enteros **muy** grandes que `number` no representa con precisión | `100n` | El sufijo `n` lo convierte en `bigint`; úsalo solo si de verdad necesitas enormes enteros |
| `symbol` | Identificador único e inmutable | `Symbol("id")` | Dos `Symbol("id")` **no** son el mismo valor; sirve como clave "secreta" en objetos |

**Por qué importa:** si declaras `let edad: number` y luego intentas `edad = "doce"`, `tsc` se queja al momento. Ese tipo de "typos" es justo lo que TypeScript viene a evitar.

**Analogía:** el tipo es la etiqueta del cajón. `boolean` es un cajón de dos casillas (`true`/`false`); `string` es un cajón de texto; `number` es el de números. Meter texto en el cajón de números hace que el revisor (`tsc`) te pare en seco.

### Arrays

Un **array** es una lista ordenada de valores. Se declara con el tipo del elemento seguido de `[]`:

```typescript
let list: string[] = ["a", "b"];
```

Esto significa: "`list` es un array de `string`". Si intentas hacer `list.push(42)`, error de compilación: dentro de ese cajón solo caben textos.

También existe la forma equivalente `Array<string>` (útil cuando el tipo ya lleva `[]`, por ejemplo array de arrays); para empezar, la sintaxis `string[]` es la más común.

```typescript
let numeros: number[] = [1, 2, 3];
// numeros.push("cuatro"); // ❌ Type 'string' is not assignable to type 'number'.
numeros.push(4);            // ✅
```

### Tuples

Una **tuple** (tupla) es un array con **posición fija y tipos definidos posición a posición**:

```typescript
let tuple: [string, number] = ["age", 26];   // posición fija
```

Aquí la posición 0 **siempre** es `string` y la posición 1 **siempre** es `number`. No es "una lista de cosas", es "un par con forma concreta".

```typescript
tuple = ["peso", 70.5]; // ✅ string en 0, number en 1
tuple = [70.5, "peso"]; // ❌ orden invertido: no compila
```

**¿Array o tuple?** Si todos los elementos son del mismo tipo y el orden/la longitud no son fijos → array. Si cada posición cumple una función distinta y el tamaño es fijo (clave/valor, etiqueta/dato, origen/destino) → tuple. En el ejemplo, `["age", 26]` es un tuple porque "age" describe qué es el 26.

### Union types y valores anulables

Una **union type** (unión de tipos) dice "este valor puede ser **esto o aquello**", uniendo tipos con `|` (barra vertical, "o"):

```typescript
let maybe: string | null | undefined = null; // union type
```

- **`null`** = "vacío a propósito": el programador dice "aquí no hay valor".
- **`undefined`** = "sin valor asignado" (es también lo que tiene una variable sin inicializar o una propiedad que no se tocó).

A los dos se les llama **anulables** (*nullable*). La anotación `string | null | undefined` se lee: "un `string`, **o** `null`, **o** `undefined`".

**Por qué importa:** con `strict` activo, si tu variable es solo `string` y le asignas `null`, TS te avisa. Solo puedes guardar `null` si lo declaraste en la unión. Eso te obliga a pensar de antemano: *¿y si no hay dato?* En vez de descubrirlo con un `undefined` runtime a mitad de la app.

```typescript
let usuario: string | null = null;
usuario = "Ana";          // ✅
// usuario = 42;          // ❌ number no está en la unión

if (usuario !== null) {
  console.log(usuario.length); // ✅ aquí TS ya sabe que es string (narrowing)
}
```

Ese último paso —comprobar el valor para que TS "recoja" el tipo correcto— se llama **narrowing** (estrechamiento) y aparece de nuevo en la sección de `unknown`.

---

## `any`, `unknown`, `never`, `void`

Estos cuatro tipos no guardan "una clase de dato" como `string` o `number`: describen **qué le pasa al valor** (o a la función) respecto al sistema de tipos. Por eso conviene entenderlos despacio.

| Tipo | Significado |
|------|-------------|
| `any` | Cualquiera (desactiva el chequeo) — evitar |
| `unknown` | Cualquiera pero **hay que narrowar** antes de usar |
| `void` | Función sin `return` con valor |
| `never` | Nunca retorna (throw, infinite loop) |

### `any`: el botón de emergencia que apaga TS

`any` le dice al compilador: "no mires este valor, déjalo pasar". Puedes hacer cualquier cosa con él sin error... hasta que el bug aparece en runtime.

```typescript
let cosa: any = "hola";
cosa.inventar().otraCosa(); // ❌ debería fallar, pero TS no dice nada
```

**Por qué evitar `any`:** no es "tipos más laxos", es **cero tipos** en esa zona. Cada `any` es un agujero negro por el que dejan de comprobarse datos; el error deja de salir en compilación y vuelve a salir (tarde, más caro) en ejecución. Regla práctica: si dudas entre `any` y `unknown`, elige **`unknown`**. Reserva `any` solo para fronteras con código JS sin tipos y de forma puntual y justificada.

### `unknown`: "cualquiera, pero con seguro"

`unknown` también admite cualquier valor... pero **no te deja hacer nada con él** hasta que compruebes o afirme su tipo. Es `any` con freno de mano.

```typescript
let input: unknown = "Hello";
// input.length;                // ❌ TS no sabe qué es input
// input.toUpperCase();         // ❌ igual

if (typeof input === "string") {
  console.log(input.length);   // ✅ TS ya sabe que es string (narrowing)
}

const len: number = (input as string).length; // assertion (forma directa)
```

**Narrowing de `unknown` — las dos vías:**

1. **Narrowing por comprobación (la segura).** Compruebas el valor en runtime (`typeof`, una comprobación de propiedad, etc.) y, dentro del bloque, TS "estrecha" el tipo automáticamente:

```typescript
function longitudDeTexto(valor: unknown): number {
  if (typeof valor === "string") {
    return valor.length; // ✅ aquí valor es string
  }
  return 0; // no era texto
}
```

2. **Aserción con `as` (la rápida).** Le afirma al compilador de qué tipo es, **sin comprobarlo**:

```typescript
let input: unknown = "Hello";
const len: number = (input as string).length; // assertion
```

> En `.tsx` usa `input as string`; `<string>input` no compila en JSX. (Repaso de la Unidad 01: dentro de JSX, `<string>` se leería como un elemento, no como tipo.)

**¿Cuándo usar cada una?** Si el dato puede no ser lo que esperas (una respuesta de red, un valor leído del DOM), **narrowing**: comprueba de verdad. Si **estás seguro** de la procedencia, `as` es cómodo. Nunca uses `as` para "callar" un error que no entiendes: solo retrasa el fallo.

### `void`: "esta función no devuelve nada útil"

`void` se usa en el **retorno** de funciones que no devuelven un valor (o devuelven `undefined`):

```typescript
function saludar(nombre: string): void {
  console.log("Hola, " + nombre);
  // sin return con valor
}
```

**Qué significa:** quien llama a `saludar(...)` no debe esperar un resultado que usar; el interés está en el **efecto** (imprimir, guardar, actualizar el DOM...). Si intentas usar su resultado (`const x = saludar("Ana"); x.toFixed()`), TS avisa.

### `never`: "este código no llega a terminar"

`never` representa valores que **nunca** ocurren: la función no retorna nunca (lanza una excepción o entra en bucle infinito).

```typescript
function unreachable(): never {
  throw new Error("nunca retorna");
}
```

Otros casos típicos: `while (true) { ... }` sin `break`, o un manejo de errores que siempre lanza. Es el tipo de "cero posibles valores": por eso el ejemplo se llama `unreachable` —si esa función se llamara, el programa no continúa después.

**Resumen en una frase para recordar la tabla:** `any` = "no miro" (evitar); `unknown` = "miro antes de usar"; `void` = "no devuelvo nada"; `never` = "no llego a devolver nada".

---

## Funciones

En TypeScript, las funciones se tipan en dos sitios: **parámetros** (qué entran) y **valor de retorno** (qué sale).

```typescript
function add(a: number, b: number): number {
  return a + b;
}
```

- `a: number`, `b: number` → cada parámetro **debe** recibir un número. Si llamas `add("1", 2)`, error en compilación.
- `: number` tras el paréntesis → la función **devuelve** un número. TS lo comprueba en el `return`.

**Cómo lee TS el cuerpo:** con `strict` activo, revisa que el valor de cada `return` es compatible con el tipo declarado. Si olvidas el `return` o devuelves un `string`, te lo señala al compilar.

```typescript
function add(a: number, b: number): number {
  return a + b;          // ✅ number
}
// function mal(a: number): number { return "nada"; }  // ❌ string no es number
```

> En muchos casos puedes **omitir** el tipo de retorno y TS lo deduce del `return` (aquí deduciría `number`). Escribirlo igualmente es buena práctica al empezar: te obliga a decidir "¿qué devuelve realmente esta función?".

### Los parámetros no son opcionales por defecto

**Los parámetros no son opcionales por defecto: TS exige que existan.** Si defines `function add(a, b)`, la llamada `add(5)` es un error: falta `b`. No hay "segundo parámetro por si acaso" a menos que tú lo digas.

```typescript
add(5);      // ❌ Expected 2 arguments, but got 1.
add(5, 10);  // ✅
```

**Por qué importa:** evita llamadas incompletas a medio programa (el bug clásico de "¿por qué `b` es `undefined` aquí?"). El compilador te obliga a pasar todos los datos que la función necesita.

### Cómo marcar un parámetro opcional: `?`

Si un parámetro **puede** omitirse, añade `?` justo después de su nombre:

```typescript
function presentar(nombre: string, saludo?: string): string {
  return (saludo ?? "Hola") + ", " + nombre;
}

presentar("Ana");                 // ✅ falta saludo → opcional
presentar("Ana", "Buenos días");  // ✅ también
```

Dentro de la función, un parámetro opcional tiene tipo `string | undefined`: conviene contemplar el caso de que no llegue (aquí, con `??` para elegir un texto por defecto).

**Regla rápida:** parámetro sin `?` → obligatorio, TS exige que lo pases; parámetro con `?` → opcional, puede venir o no, y su tipo incluye `undefined`.

---

## En el ejemplo

Todo esto vive en [`../hello-world/src/fundamentals.ts`](../hello-world/src/fundamentals.ts) (sección *Basic Types*).

Recorrido sugerido:

1. Abre el archivo y localiza los primitivos (`boolean`, `number`, `string`, `bigint`, `symbol`) al principio de la sección *Basic Types*.
2. Busca los arrays y la tuple (`[string, number]`) y comprueba que cambian un valor de sitio: verás el error de `tsc`.
3. Practica una union type: cambia `maybe` a un valor fuera de la unión y ejecuta `pnpm run check` desde [`../hello-world/`](../hello-world/) para leer el mensaje.
4. Reescribe `add` con un tercer parámetro opcional (`opcional?: string`), llama primero sin él y luego con él, y ejecuta `check` en ambos casos.
5. Añade una variable `let cosa: unknown` y experimenta: primero intenta usarla directamente (error), luego narrowa con `typeof`, y por último afirma con `as string` (recuerda: en `.tsx`, solo `as`).

---

## Errores comunes

### 1. Asignar un valor fuera de la unión declarada

**Qué error verás** (mensaje orientativo):

```text
Type 'number' is not assignable to type 'string | null'.
```

**Por qué pasa.** La anotación `string | null` solo admite `string` o `null`. Un `number` no está en la unión, aunque "a veces" te venga bien guardar un número.

```typescript
let dato: string | null = null;
dato = 42; // ❌ number no está permitido
```

**Cómo evitarlo.** Amplía la unión si de verdad necesitas más tipos, o guarda el valor en el tipo correcto:

```typescript
let dato: string | number | null = null;
dato = 42; // ✅ ahora sí

let texto: string | null = "hola";
texto = null; // ✅ también permitido
```

### 2. Usar un `unknown` sin comprobarlo antes

**Qué error verás:**

```text
Object is of type 'unknown'.
```

**Por qué pasa.** `unknown` puede ser cualquier cosa: TS no sabe si tiene `.length`, si es número, si es función... y **bloquea** cualquier uso hasta que narrowes o afirmes.

```typescript
let input: unknown = "Hello";
console.log(input.length); // ❌ Object is of type 'unknown'
```

**Cómo evitarlo.** Narrowa con una comprobación real, o afirma con `as` cuando estés seguro:

```typescript
let input: unknown = "Hello";

if (typeof input === "string") {
  console.log(input.length);      // ✅ narrowing: aquí es string
}

const len = (input as string).length; // ✅ assertion (sin comprobar en runtime)
```

### 3. Confiar en `any` y descubrir el bug tarde

**Qué error verás:** **ninguno en compilación** — ese es el problema. El fallo aparece en runtime, por ejemplo:

```text
TypeError: Cannot read properties of undefined (reading 'inventar')
```

**Por qué pasa.** Con `any`, TS deja de comprobar. Lo que en `unknown` habría sido un error al compilar, en `any` pasa desapercibido.

```typescript
let cosa: any = {};
cosa.inventar(); // TS calla... hasta que explota en runtime
```

**Cómo evitarlo.** Usa `unknown` y narrowa; evita `any` salvo fronteras puntuales y justificadas:

```typescript
let cosa: unknown = {};
if (typeof cosa === "object" && cosa !== null && "inventar" in cosa) {
  // aquí TS sabe que 'inventar' existe antes de llamarlo
  (cosa as { inventar: () => void }).inventar();
}
```

### 4. Olvidar un parámetro obligatorio

**Qué error verás:**

```text
Expected 2 arguments, but got 1.
```

**Por qué pasa.** Los parámetros **no** son opcionales por defecto: si la firma dice `(a: number, b: number)`, hay que pasar los dos.

```typescript
function add(a: number, b: number): number {
  return a + b;
}
add(5); // ❌ falta b
```

**Cómo evitarlo.** Pasa todos los argumentos, o marca como opcional el que pueda faltar con `?`:

```typescript
add(5, 10); // ✅ los dos

function add(a: number, b?: number): number {
  return a + (b ?? 0); // b puede ser undefined
}
add(5); // ✅ ahora vale
```

### 5. Devolver un tipo distinto del declarado

**Qué error verás:**

```text
Type 'string' is not assignable to type 'number'.
```

**Por qué pasa.** El `: number` de la firma es un contrato: **todo** `return` debe ser un número.

```typescript
function add(a: number, b: number): number {
  return a + b + ""; // ❌ devuelve string
}
```

**Cómo evitarlo.** Devuelve el tipo prometido o corrige la anotación si cambiaste de idea:

```typescript
function add(a: number, b: number): number {
  return a + b; // ✅
}
```

### 6. Confundir array con tuple al reordenar

**Qué error verás:**

```text
Type 'number' is not assignable to type 'string'.
```
```text
Type '[number, string]' is not assignable to type '[string, number]'.
```

**Por qué pasa.** En la tuple `[string, number]`, cada posición tiene su tipo; cambiar el orden o el tamaño invalida la tupla.

```typescript
let tuple: [string, number] = ["age", 26];
tuple = [26, "age"]; // ❌ orden invertido
```

**Cómo evitarlo.** Respeta el orden declarado, o usa un array homogéneo si no hay posiciones fijas:

```typescript
let pares: Array<string | number> = ["age", 26]; // array, orden libre
let tuple: [string, number] = ["age", 26];       // tuple, orden fijo
```

---

## Conceptos clave

- **Primitivos**: `boolean`, `number`, `string`, `bigint` (sufijo `n`), `symbol` (identificador único).
- En JS/TS **no** hay `int`/`float` separados: todo número es `number`.
- **Array** (`string[]`): lista homogénea, longitud libre.
- **Tuple** (`[string, number]`): array con posiciones fijas y tipo por posición.
- **Union type**: `A | B` = "A o B"; se escribe con `|`.
- **Anulables**: `| null | undefined` para declarar explícitamente "quizá no hay valor".
- **Narrowing**: comprobar el valor en runtime para que TS estreche el tipo (p. ej. `typeof x === "string"`).
- **`any`**: desactiva el chequeo → **evitar**; esculpe agujeros negros en la seguridad de tipos.
- **`unknown`**: admite cualquier valor pero **exige narrowar o `as`** antes de usarlo → el sustituto seguro de `any`.
- **`void`**: retorno de funciones que no devuelven un valor útil.
- **`never`**: el código no retorna nunca (`throw`, bucle infinito).
- **Funciones**: se anotan parámetros (`a: number`) y retorno (`: number`).
- **Parámetros no opcionales por defecto**: faltar un argumento es error de compilación.
- **`?` opcional**: `saludo?: string` permite omitirlo; su tipo pasa a incluir `undefined`.
- **Aserción `as`**: afirma el tipo al compilador sin convertir el valor; en `.tsx` es la única vía (`<string>x` no compila en JSX).
- **Práctica**: [`../hello-world/src/fundamentals.ts`](../hello-world/src/fundamentals.ts), sección *Basic Types*.

---

## Autoevaluación

**1. ¿Cuál es la diferencia entre un array `string[]` y una tuple `[string, number]`? Pon un ejemplo de cada uno y di qué pasaría si cambias el orden de la tuple.**

<details>
<summary>Respuesta</summary>

- `string[]` (array): lista **homogénea**, todos los elementos son `string` y la longitud es libre. Ej.: `let list: string[] = ["a", "b"];`
- `[string, number]` (tuple): **posición fija**, la 0 es `string` y la 1 es `number`. Ej.: `let tuple: [string, number] = ["age", 26];`
- Si cambias el orden (`[26, "age"]`), TS da error de compilación porque la posición 0 debe ser `string` y la 1 `number`.

</details>

**2. Tienes `let input: unknown`. ¿Por qué no puedes hacer `input.length` directamente? Muestra las dos formas válidas de usarlo (una comprobando y otra con aserción).**

<details>
<summary>Respuesta</summary>

Porque `unknown` puede ser cualquier cosa: TS **no** sabe si `input` tiene `.length` y bloquea el acceso hasta que narrowes o afirmes el tipo (error tipo `Object is of type 'unknown'`).

```typescript
// 1) Narrowing (seguro, comprueba en runtime)
if (typeof input === "string") {
  console.log(input.length);
}

// 2) Aserción (afirma sin comprobar)
const len = (input as string).length;
```

Y recuerda: en `.tsx`, solo `input as string` (`<string>input` no compila en JSX).

</details>

**3. ¿Por qué se dice que `any` es peligroso aunque "no da errores"? ¿Qué alternativa recomienda esta unidad y en qué se diferencia?**

<details>
<summary>Respuesta</summary>

`any` **desactiva el chequeo** del valor: TS deja de comprobar operaciones, llamadas y propiedades, así que "no da errores" en compilación — pero los bugs reaparecen en runtime, cuando ya es más caro detectarlos. Es el agujero negro del sistema de tipos.

La alternativa es **`unknown`**: admite cualquier valor como `any`, pero **exige** narrowar (p. ej. `typeof input === "string"`) o afirmar con `as` antes de usarlo, de modo que cualquier uso indebido sigue siendo error de compilación.

</details>

**4. Escribe una función `presentar` con un parámetro obligatorio `nombre: string` y otro opcional `saludo?: string`. ¿Qué error da `presentar()` sin argumentos? ¿Y qué tipo tiene `saludo` dentro de la función?**

<details>
<summary>Respuesta</summary>

```typescript
function presentar(nombre: string, saludo?: string): string {
  return (saludo ?? "Hola") + ", " + nombre;
}
```

- `presentar()` sin argumentos → error: **`Expected 1-2 arguments, but got 0`** (o similar): `nombre` es obligatorio porque los parámetros **no son opcionales por defecto**; solo lo es `saludo` por llevar `?`.
- Dentro de la función, `saludo` tiene el tipo **`string | undefined`**: puede llegar el texto o no, así que conviene contemplar el `undefined` (aquí, con `??`).

</details>
