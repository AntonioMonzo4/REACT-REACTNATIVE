# Unidad 04 — Enums, literales y `as const`

## Objetivos

- Entender qué es un **enum** y crear enums **numéricos** con valores por defecto y asignación manual.
- Usar **string enums** y saber por qué son útiles para logs y serialización.
- Restringir variables a **valores concretos** con los **literal types** (ej. `Direction = "up" | "down" | ...`).
- Aplicar **`as const`** para congelar objetos y arrays en literales (`readonly`).
- Conocer los **template literal types** (con el ejemplo `TrimLeft`) y a qué unidad apuntan para seguir.
- Localizar estos conceptos en `hello-world/src/fundamentals.ts`.

## Requisitos

- Haber completado la **Unidad 02 de este módulo** (tipos primitivos y bases de TypeScript).
- Haber leído la **Unidad 03** (interfaces y type alias), porque aquí usaremos uniones de literales y tipos con nombre.
- Proyecto `hello-world/` listo y archivo `hello-world/src/fundamentals.ts` abierto para practicar.

## ¿Qué es un enum?

Un **enum** (enumeración) es un **conjunto de constantes con nombre**. En lugar de recordar que `0` significa rojo y `1` verde, nombras los valores: `Color.Red`, `Color.Green`.

**Analogía:** es como los botones de un ascensor con etiquetas. No memorizas voltajes o códigos internos: pulsas "PB" y sabes que es planta baja. El enum pone nombre humano a valores que de otro modo serían números o strings sueltos.

**¿Por qué importa?** Evita el "número mágico" repartido por el código. Si mañana el significado de un valor cambia, lo cambias en un solo sitio (el enum), no en veinte archivos.

### Enums numéricos

Si no asignas valores, TypeScript empieza en **0** y va subiendo: `0, 1, 2...`. También puedes asignar valores **manualmente**.

```typescript
enum Color {
  Red,      // 0
  Green,    // 1
  Blue = 4, // 4
}

let c: Color = Color.Green;
```

- `Red` vale `0` y `Green` vale `1` (valores por defecto, automáticos).
- `Blue = 4` recibe el valor que tú indicas.
- `let c: Color = Color.Green` está bien; `let c: Color = 99` daría error, porque `99` no es un miembro del enum (a menos que actives opciones avanzantes de enums, que no vemos aquí).

| Miembro | Valor resultante | Origen del valor |
|---------|------------------|------------------|
| `Red`   | `0`              | Por defecto      |
| `Green` | `1`              | Por defecto      |
| `Blue`  | `4`              | Asignación manual (`Blue = 4`) |

### String enums

Los enums también pueden tener **strings** como valores. Son útiles para **logs y serialización**: si imprimes `Color.Red` en la consola o lo envías a un servidor, verás `"RED"` en lugar de un `0` que nadie entiende.

```typescript
enum Dir {
  Up = "UP",
}
```

**¿Por qué importa?** Un número en un log (`2`) no te dice nada; un string (`"UP"`, `"ERROR"`) se lee al instante y es estable si el orden de los miembros cambia (los enums numéricos dependen del orden para su valor por defecto).

## Literal types (tipos literales)

TypeScript puede restringir una variable no a todo `string`, sino a **valores concretos**: los **literal types**.

```typescript
type Direction = "up" | "down" | "left" | "right";
let d: Direction = "up"; // "sideways" → error
```

Aquí `Direction` es la **unión** de cuatro strings exactos. `d` solo puede recibir uno de esos cuatro; `"sideways"` (o `"Up"` con mayúscula) produce error.

**Analogía:** es como un cajón con casillas etiquetadas: solo caben esas cuatro fichas, no cualquier papel. **¿Por qué importa?** Impide valores tontos como `"upwards"` o `"Upp"` que compilarían igual con un `string` normal y fallarían (o no) en runtime.

## `as const`

`as const` **congela la forma** del objeto o array: las propiedades pasan a ser **literales** (`4` en lugar de `number`) y **readonly** (solo lectura).

```typescript
const point = { x: 4, y: 2 };            // { x: number; y: number }
const literalPoint = { x: 4, y: 2 } as const;
// { readonly x: 4; readonly y: 2 }
```

- Sin `as const`, TypeScript "ensancha" `4` a `number` (así funciona normalmente para poder modificar el valor).
- Con `as const`, el tipo es exactamente `4` y `2`, y no puedes hacer `literalPoint.x = 5`.

**Útil para configuraciones y datos que no deben mutar** (flags, rutas, datos de constantes). También verás `as const` en arrays: `const nums = [1, 2] as const` queda como tupla readonly `[1, 2]`.

## Template Literal Types

Los **template literal types** construyen tipos a partir de patrones de string, como si usaras plantillas de texto, pero a nivel de tipos.

```typescript
type SpaceChar = " " | "\n" | "\t";
type TrimLeft<S extends string> =
  S extends `${SpaceChar}${infer Rest}` ? TrimLeft<Rest> : S;

type Trimmed = TrimLeft<"    hello">; // 'hello'
```

En este ejemplo, `TrimLeft` "mirar" si el string empieza por un espacio, salto de línea o tabulación; si es así, se queda con el resto (`Rest`) y se repite (recursión) hasta que no queden espacios al principio. El resultado de `TrimLeft<"    hello">` es `'hello'`.

> **Nota:** este ejemplo usa **conditional types** (`extends ... ? ... :`) y **`infer`**, que se completa en la unidad de Conditional Types / `infer`. Aquí solo lo reconoces: los template literal types permiten manipular strings a nivel de tipo.

## En el ejemplo

`fundamentals.ts` → *Enums*, *Literal Types*, *Template Literal Types* (en `hello-world/src/fundamentals.ts`).

## Errores comunes

**1. Asignar un valor que no es miembro del enum**

```typescript
enum Color { Red, Green, Blue = 4 }
let c: Color = 99; // Error: Type '99' is not assignable to type 'Color'
```

*Solución:* usa un miembro existente (`Color.Red`, `Color.Green`, `Color.Blue`) o añade el valor al enum si de verdad lo necesitas.

**2. Confundir el valor por defecto de un enum numérico**

```typescript
enum Color { Red, Green, Blue = 4 }
// ¿Cuánto vale Green? → 1 (sigue contando desde 0; solo Blue está fijado a 4)
```

*Solución:* recuerda: sin asignación, el primer miembro es `0` y cada uno suma `1`. Si fijas `Blue = 4`, los siguientes miembros (si los hubiera) partirían de `5`.

**3. Escribir un literal con otro formato**

```typescript
type Direction = "up" | "down" | "left" | "right";
let d: Direction = "Up"; // Error: Type '"Up"' is not assignable to type 'Direction'
```

*Solución:* los literales distinguen mayúsculas y minúsculas; usa exactamente uno de los valores del tipo (`"up"`, no `"Up"`).

**4. Modificar una propiedad de un objeto `as const`**

```typescript
const literalPoint = { x: 4, y: 2 } as const;
literalPoint.x = 5; // Error: Cannot assign to 'x' because it is a read-only property
```

*Solución:* si el dato debe poder cambiar, no uses `as const`; si no debe cambiar (configuración), deja el error: es la protección que buscabas.

## Conceptos clave

- **Enum**: conjunto de constantes con nombre; evita números mágicos.
- **Enum numérico**: valores por defecto `0, 1, 2...`; puedes asignar a mano (`Blue = 4`).
- **String enum**: valores string (`Dir.Up = "UP"`); ideal para logs y serialización legible.
- **Literal type**: tipo formado por valores concretos (`"up" | "down" | ...`); solo acepta esos valores exactos.
- **`as const`**: congela objeto/array en literales y propiedades `readonly`; ideal para configuraciones que no deben mutar.
- **Template literal types**: construyen tipos a partir de patrones de string (ej. `TrimLeft`); se completa con conditional types e `infer` en la unidad correspondiente.
- **Referencia de práctica**: `hello-world/src/fundamentals.ts` → secciones *Enums*, *Literal Types* y *Template Literal Types*.

## Autoevaluación

**1. ¿Qué valor tienen `Red` y `Green` en `enum Color { Red, Green, Blue = 4 }`? ¿Y por qué?**

<details>
<summary>Respuesta</summary>

`Red` vale `0` y `Green` vale `1`. Al no llevar asignación, el enum numérico empieza en `0` y suma `1` por miembro; solo `Blue` está fijado explícitamente a `4`.

</details>

**2. ¿Cuándo conviene usar un string enum en vez de uno numérico?**

<details>
<summary>Respuesta</summary>

Cuando el valor se va a ver "afuera": en logs, mensajes de error, respuestas de API o serialización. Un string (`"UP"`, `"ERROR"`) se lee al instante y no depende del orden de los miembros, a diferencia del número por defecto.

</details>

**3. ¿Qué cambia `as const` en `const p = { x: 4, y: 2 } as const` respecto a sin él?**

<details>
<summary>Respuesta</summary>

Las propiedades pasan de `number` a los literales exactos `4` y `2`, y quedan `readonly`: no puedes hacer `p.x = 5`. Sirve para datos (como configuraciones) que no deben modificarse.

</details>

**4. ¿Por qué `let d: Direction = "Up"` da error si `Direction` incluye `"up"`?**

<details>
<summary>Respuesta</summary>

Porque los tipos literales distinguen mayúsculas y minúsculas: `"Up"` es un string distinto de `"up"`, y `Direction` solo admite los valores exactos de la unión (`"up"`, `"down"`, `"left"`, `"right"`).

</details>
