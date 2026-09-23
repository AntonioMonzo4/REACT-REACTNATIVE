# Unidad 06 — Generics

## Objetivos

- Entender **qué son los generics** y por qué existen en TypeScript.
- Saber leer y escribir la sintaxis `<T>` en clases, interfaces y funciones.
- Usar la clase `Greeter<T>` y la interface `ApiResponse<T>` como referencia.
- Comprender **cómo infiere TypeScript** el tipo y cuándo debes fijarlo a mano.
- Aplicar **restricciones** con `extends` (`<T extends object>`, `<K extends keyof T>`).
- Reconocer los errores típicos: abusar de `any`, olvidar el `<...>`, forzar la inferencia.

## Requisitos

- Haber completado la Unidad 05 (funciones tipadas, clases y módulos con `export`/`import type`).
- Tener claras las interfaces y los tipos literales (`type`).
- Tener `typescript` instalado y un `tsconfig.json` básico.
- Abrir el archivo de ejemplo `fundamentals.ts` (la sección *Generics* y `ApiResponse<T>` se usan como referencia).

---

## Qué son los generics y por qué existen

### El problema sin generics

Imagina que quieres una caja que guarde cualquier cosa: números, strings, usuarios… Sin generics, la tentación es usar `any`:

```typescript
class Box {
  value: any;
  constructor(value: any) {
    this.value = value;
  }
}
```

Funciona, pero has perdido **todo** el tipado: puedes guardar un número y sacar un objeto sin que TypeScript diga nada. El error aparece (si aparece) en producción.

Otra opción sería copiar y pegar la clase para cada tipo (`NumberBox`, `StringBox`, `UserBox`…). Mucho código duplicado, difícil de mantener.

### La solución: un "placeholder de tipo"

Los **generics** (genéricos) permiten **reutilizar el mismo código manteniendo el tipo**. La idea es sencilla: escribes el código con un **marcador de posición** (placeholder) en lugar de un tipo concreto, y cada persona que use tu código decide qué tipo va en ese hueco.

Piensa en él como el hueco de una prueba de rollo fotográfico: la cámara (la función o clase) es la misma, pero cada foto (cada llamada) puede usar un tipo de papel distinto. O, dicho de otro modo: `T` es a un tipo lo que un parámetro es a un valor: un hueco que se rellena en cada uso.

La convención es usar letras mayúsculas, siendo `T` la más habitual (*Type*). También se ven `K` (*Key*), `V` (*Value*), `U*…* pero cualquier identificador válido sirve.

### Comparación rápida

| Enfoque | Reutiliza código | Conserva el tipo | Ejemplo |
|---|---|---|---|
| `any` | sí | no | `class Box { value: any }` |
| Copiar la clase por tipo | no | sí | `NumberBox`, `StringBox`… |
| Generic `<T>` | **sí** | **sí** | `class Box<T> { value: T }` |

---

## Ejemplo: la clase `Greeter<T>`

```typescript
class Greeter<T> {
  greeting: T;
  constructor(message: T) {
    this.greeting = message;
  }
}

let greeter = new Greeter<string>("Hello, world");
```

Desglose:

| Parte | Qué significa |
|---|---|
| `class Greeter<T>` | declaras un **parámetro de tipo** `T` para toda la clase |
| `greeting: T` | la propiedad admite el tipo que se rellene en `T` |
| `constructor(message: T)` | el constructor solo acepta valores de ese tipo |
| `new Greeter<string>(...)` | aquí **fijas** `T` a `string` |

Ahora, con `T = string`:

```typescript
greeter.greeting.toUpperCase(); // OK: es un string
greeter.greeting = 42;          // Error: number no asignable a string
```

Y si fijas `T` a `number`:

```typescript
let n = new Greeter<number>(42);
n.greeting.toFixed(2); // OK
```

Una sola clase, dos tipos distintos, cero duplicación y cero `any`.

---

## Generics en interfaces: `ApiResponse<T>`

Los generics no son cosa solo de clases: **interfaces** y **type aliases** también aceptan parámetros de tipo. Este es el patrón que usarás constantemente al consumir APIs:

```typescript
export interface ApiResponse<T> {
  data: T;
}

// Uso
type UserResp = ApiResponse<{ name: string }>;
```

`ApiResponse<T>` dice: *"soy una respuesta cuyo campo `data` puede ser de cualquier tipo; tú eliges cuál"*. Al escribir `ApiResponse<{ name: string }>`, fijas `T` y obtienes:

```typescript
const respuesta: UserResp = {
  data: { name: "Luis" },
};

respuesta.data.name;       // OK
respuesta.data.email;      // Error: no existe 'email' en { name: string }
```

Así puedes tener una interfaz común para toda tu API (`users`, `posts`, `settings`…) sin repetir la estructura `{ data: ... }` una y otra vez.

> Nota: `ApiResponse` se exporta con `export`. Si en tu proyecto usas `verbatimModuleSyntax: true` y solo lo consumes como tipo, recuerda importarlo con `import type { ApiResponse } ...` (Unidad 05).

---

## Cómo infiere TypeScript el tipo

No siempre hace falta escribir `<string>` a mano. TypeScript **infiere** (adivina) el tipo del generic a partir de los argumentos que pasas.

### Inferencia en funciones

```typescript
function identity<T>(value: T): T {
  return value;
}

let a = identity("hola");   // TS deduce T = string
let b = identity(42);       // TS deduce T = number
```

`identity` es el "hello world" de los generics: devuelve exactamente lo que recibe, y el tipo de salida se mantiene. Gracias a eso, `a.toUpperCase()` compila y `b.toUpperCase()` no.

### Inferencia en constructores

En `new Greeter<string>("Hello, world")` la inferencia también podría hacer el trabajo: como pasas un string, TypeScript propondría `T = string`. La anotación explícita es útil cuando quieres **forzar** un tipo distinto del que se deduce, o cuando el argumento es ambiguo.

| Situación | ¿Fijar `<T>` a mano? |
|---|---|
| TS deduce bien el tipo y es el que quieres | no hace falta |
| Quieres obligar a un tipo concreto (p. ej. `string`) | sí |
| TS no tiene información suficiente (argumento `undefined`, genérico en interfaz…) | sí |
| El código queda más legible para el equipo | opcional, según convención |

---

## Restricciones: `extends` en generics

### Por qué restringir

A veces el código solo tiene sentido si `T` cumple ciertas condiciones. Por ejemplo, si vas a acceder a propiedades de `T`, no puedes permitir que sea un `number`. Para eso existen las **constraints** (restricciones) con la palabra clave `extends`:

```typescript
function soloObjetos<T extends object>(value: T): T {
  return value;
}
```

`T extends object` significa: *"T debe ser un subtipo de `object`"*. El llamador puede fijar cualquier objeto o interfaz, pero no `string` ni `number` (en la configuración estricta habitual, esos tipos no extienden `object` de forma útil aquí):

```typescript
soloObjetos({ name: "Luis" }); // OK
soloObjetos([1, 2, 3]);        // OK (los arrays son objetos)
soloObjetos(42);               // Error: number no cumple la restricción
```

### Restricción con `keyof`: `<K extends keyof T>`

`keyof T` devuelve unión de las **claves** de `T`. Combinado con `extends`, te permite pedir "cualquier clave válida de T":

```typescript
function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const punto = { x: 1, y: 2 };
getProp(punto, "x");      // OK, devuelve number
getProp(punto, "z");      // Error: "z" no es clave de typeof punto
```

Aquí conviven tres ideas:

| Concepto | Ejemplo | Significado |
|---|---|---|
| Parámetro de tipo | `<T>` | placeholder del tipo del objeto |
| `keyof T` | `keyof typeof punto` | `"x" \| "y"` (unión de claves) |
| Constraint | `K extends keyof T` | `K` solo puede ser una clave real de `T` |
| Índice | `T[K]` | el tipo del valor en esa clave |

Si intentas `getProp(punto, "z")`, el error aparece en tiempo de compilación, antes de ejecutar nada.

---

## Cuándo usar generics

Casos donde aportan claridad y seguridad:

- **APIs de respuesta genéricas**: `ApiResponse<T>`, `PaginatedResult<T>`… una sola interfaz para muchos tipos de datos.
- **Contenedores / estructuras de datos**: `List<T>`, `Box<T>`, `Stack<T>`… cualquier envoltorio que guarde elementos.
- **Helpers de tipo preservado**: funciones como `identity<T>(x): T` que devuelven el mismo tipo que reciben (clonado, primera clave, etc.).
- **Clases polimórficas**: como `Greeter<T>`, donde la misma lógica sirve para muchos tipos.

### Cuándo NO hace falta

| Caso | Mejor alternativa |
|---|---|
| Solo trabajas con un tipo concreto | anota ese tipo directamente |
| Un `number` suelto, un `string` fijo | tipo primitivo normal |
| El generic añade complejidad y nadie lo rellena de otra forma | simplifica |

Regla práctica: **introduce un generic cuando dos o más lugares necesiten el mismo código con tipos distintos**. Si solo hay un tipo, déjalo concreto.

---

## Errores comunes

### 1. Abusar de `any` "para que compile"

**Síntoma:**

```typescript
function malo<T>(x: any): any {
  return x;
}
```

Compila, pero `T` no se usa y el `any` desactiva la comprobación de tipos: pierdes **todo** el beneficio de TypeScript.

**Solución:** deja que el flujo del tipo atraviese la función:

```typescript
function bueno<T>(x: T): T {
  return x;
}
```

### 2. Olvidar el `<...>` cuando TS no puede inferirlo

**Error típico:**

```text
Generic type 'ApiResponse<T>' requires 1 type argument(s).
```

**Solución:** fija el parámetro de tipo:

```typescript
let r: ApiResponse<{ name: string }>;
// o con alias:
type UserResp = ApiResponse<{ name: string }>;
```

### 3. Poner la restricción en el lado equivocado

**Error:**

```text
Type 'K' does not satisfy the constraint 'keyof T'.
```

**Solución:** recuerda que `K extends keyof T` va **dentro** de la declaración, no en un sitio donde TS no pueda comprobarlo:

```typescript
// bien
function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
```

### 4. Esperar que el generic restrinja solo con existir

**Error:**

```text
Argument of type '42' is not assignable to parameter of type 'object'.
```

**Solución:** este error es **correcto**: significa que la restricción `T extends object` está haciendo su trabajo. Si de verdad necesitas recibir números, amplía la constraint (p. ej. `T extends object | number`) o replantea la función.

### 5. Confundir generic con `any` al leer la documentación

No son lo mismo: `any` apaga el tipado; `<T>` lo **pospone** hasta el momento de usar la función o clase. Con generics siempre habrá un tipo concreto al final, verificable por el compilador.

---

## Conceptos clave

- **Generic**: parámetro de tipo (placeholder `<T>`) que permite reutilizar código manteniendo el tipado.
- **Sintaxis**: `class Greeter<T>`, `interface ApiResponse<T>`, `function identity<T>(x: T): T`.
- **Parámetro de tipo**: `T` se rellena en cada uso; por convención se usa `T`, `K`, `V`, `U`.
- **Inferencia**: TS deduce `T` a partir de los argumentos; puedes fijarlo a mano cuando convenga.
- **Constraints**: `T extends object` limita qué tipos acepta; `K extends keyof T` limita a las claves reales de `T`.
- **`T[K]`**: tipo del valor de la clave `K` en `T`.
- **Casos de uso**: APIs (`ApiResponse<T>`), contenedores (`List<T>`, `Box<T>`), identity (`identity<T>(x): T`).
- **Antipatrones**: rellenar con `any` para que compile, olvidar `<...>` donde TS no infiere, restricciones mal colocadas.
- **`fundamentals.ts`**: referencia práctica de esta unidad junto con `ApiResponse<T>`.

## Autoevaluación

**1. ¿Qué ganas usando `class Greeter<T>` en lugar de una clase con `greeting: any`?**

<details>
<summary>Respuesta</summary>

Ganas reutilización **y** seguridad de tipos: una sola clase sirve para strings, números u objetos, pero cada instancia mantiene su tipo concreto. Con `any`, el compilador deja de comprobar accesos como `greeter.greeting.toUpperCase()`, y los errores se aplazan a runtime.
</details>

**2. Dado `type UserResp = ApiResponse<{ name: string }>`, ¿qué tipo tiene `data`? ¿Qué pasa si intentas leer `data.email`?**

<details>
<summary>Respuesta</summary>

`T` se fija en `{ name: string }`, así que `data` es `{ name: string }` y `data.name` es un `string`. Acceder a `data.email` produce un error de compilación porque `email` no existe en ese tipo.
</details>

**3. ¿Para qué sirve `<K extends keyof T>` en `getProp<T, K extends keyof T>(obj: T, key: K)`?**

<details>
<summary>Respuesta</summary>

Restringe `K` para que solo pueda ser un nombre de propiedad existente en `T`. Así `getProp(punto, "x")` compila, pero `getProp(punto, "z")` falla en compilación si `z` no es clave de `punto`. Además, el tipo de retorno `T[K]` se ajusta a la clave elegida.
</details>

**4. Un compañero dice: "pongo `any` porque el generic me da error". ¿Qué le respondes?**

<details>
<summary>Respuesta</summary>

Que `any` anula el tipado y esconderá errores reales. Lo correcto es comprobar por qué falla el generic: falta fijar el argumento de tipo (`ApiResponse<...>` sin `<T>`), la restricción no se cumple (`T extends object` con un number) o TS no puede inferirlo y hay que escribir `<T>` a mano. El error del compilador es información, no un obstáculo.
</details>

---

## En el ejemplo

`fundamentals.ts` → sección *Generics* + `ApiResponse<T>`.
