# Unidad 06 — Discriminated unions, guards y JSX + TS

## Objetivos

- Modelar **props de componente** como *discriminated unions* (`estado: 'idle' | 'loading' | …`).
- Escribir **type guards** (`x is Producto`) y usarlas dentro de handlers JSX.
- Entender `satisfies` vs `as const` y derivar unions desde arrays literales con `as const`.
- Diagnosticar los errores más comunes de **JSX + TS** con su solución (tabla).
- Configurar `import type` para `verbatimModuleSyntax` / `erasableSyntaxOnly`.

## Requisitos

- **TS básico del M3**: unions, type predicates a nivel introductorio, `typeof`/`in`.
- Unidades 01–05: props, eventos, hooks tipados y unions en reducers/hooks de red.
- Un proyecto Vite+TS con `tsconfig` estricto (el ejemplo usa `pnpm run check`).

## Discriminated unions en props

Muchos componentes son, en realidad, **máquinas de estados**: muestran una cosa si está cargando, otra si hay error, otra si hay datos. La forma idiomática de tiparlo es una unión discriminada en una prop clave:

```typescript
type CargaProps =
  | { estado: 'idle' }
  | { estado: 'loading' }
  | { estado: 'error'; mensaje: string }
  | { estado: 'ok'; datos: string[] }

function Cargador(props: CargaProps) {
  if (props.estado === 'error') return <p>{props.mensaje}</p>
  if (props.estado === 'ok')
    return <ul>{props.datos.map((d) => <li key={d}>{d}</li>)}</ul>
  return <p>Esperando…</p>
}
```

**Qué significa:**

- El **discriminante** es la propiedad `estado` (un literal). Cada variante del objeto trae **sus** campos: `mensaje` solo en `'error'`, `datos` solo en `'ok'`.
- Cada comparación `props.estado === 'error'` hace **narrowing** sobre el **objeto** `props`: TS descarta las variantes incompatibles y dentro de la rama sabe que `props.mensaje: string`.
- **Imposible** renderizar `<Cargador estado="ok" />` sin `datos`, o pasar `mensaje` en `'idle'` — no compila.

**Por qué importa:** convierte en **errores de compilación** los bugs clásicos de "pintamos la lista con `datos` undefined porque alguien dejó el estado en loading". Y el JSX resultante es legible: un `return` por estado.

## Type guards en handlers

Un **type guard** es una función que, al devolver `true`, **afirma** a TS qué tipo tiene el valor. Se escribe con la sintaxis de predicado `x is Tipo`:

```typescript
function esProducto(x: unknown): x is Producto {
  return typeof x === 'object' && x !== null && 'precio' in x
}
```

Uso típico dentro de un handler JSX (p. ej. un `onChange`/`onSelect` que recibe datos heterogéneos):

```typescript
onSelect={(item) => {
  if (esProducto(item)) setProd(item)
  else setOtro(item)
}}
```

**Qué significa:**

- `x is Producto` es la promesa verificable: "si devuelvo `true`, `x` es un `Producto`".
- El check real (`typeof`, `'precio' in x`,…) es lo que **sostiene** la promesa; si mintieras, el bug vuelve en runtime.
- Tras el `if`, `setProd(item)` recibe `item` ya estrechado a `Producto`; en el `else`, la otra rama tipada.

**Por qué importa:** es la forma correcta de "doblegar" a TS cuando el dato viene de `unknown` (API, JSON, `localStorage`) **sin** usar `as` a ciegas: el guard encapsula la verificación.

## `satisfies` y `as const`

Dos operadores que suenan parecido y hacen cosas distintas:

```typescript
const TEMA = {
  light: { bg: '#fff', fg: '#111' },
  dark: { bg: '#111', fg: '#eee' },
} as const satisfies Record<'light' | 'dark', { bg: string; fg: string }>
```

- **`as const`** → **readonly y literales**: `'light'` deja de ser `string` y pasa a ser el literal exacto; los objetos/arrays se marcan readonly. Impide mutar `TEMA.light.bg = 'x'` y conserva la forma exacta para narrowing.
- **`satisfies`** → **valida sin ensanchar el tipo a la anotación**: comprueba que `TEMA` cumple el contrato `Record<'light'|'dark', {bg,fg}>`, pero el tipo **inferido** de `TEMA` sigue siendo el detalle completo (literals y todas las claves), no la anotación ancha.

```typescript
// Sin satisfies: TEMA quedaría tipado "como" Record<…> (ancho)
// Con satisfies: tienes el error si falta una clave, y aun así conservas el tipo fino
```

**Derivar una unión desde un array `as const`:**

```typescript
const OPES = ['a', 'b'] as const
type Ope = (typeof OPES)[number] // 'a' | 'b'
```

**Qué significa:** `(typeof OPES)` es el tipo tuple readonly `readonly ['a', 'b']`; indexarlo con `[number]` "colapsa" el tuple en la **unión de sus literales**. Así defines una sola vez el array (para el runtime) y el tipo se deriva automáticamente — sin duplicar `'a' | 'b'` a mano.

**Por qué importa:** una sola fuente de verdad para enumeraciones de UI/opciones; si mañana añades `'c'` al array, el tipo `Ope` crece solo.

## En el ejemplo

`src/components/EstadoCarga.tsx` (discriminated union en props + `never` exhaustivo) + `src/lib/tema.ts` con `as const` y `satisfies`.

## Errores comunes de JSX + TS

Tabla de diagnóstico rápido — el mensaje que ves, la causa y la solución:

| Error típico | Solución |
|--------------|----------|
| `Type 'string' is not assignable to type 'ReactNode'` con `ReactNode` importado mal | `import type { ReactNode } from 'react'` |
| `children` no aceptado | Tipar `children: React.ReactNode` |
| `Element implicitly has an 'any'` en `event.target` | Tipar el SyntheticEvent |
| `No overload matches this call` en `<Comp />` | Revisar props opcionales vs required |
| `JSX element type 'X' does not have any construct or call signatures` | Falta `export default` o export con nombre mal |
| `Property 'x' does not exist on type` | Tipar el store/respuesta de API |

Lectura de los casos más confusos:

- **`ReactNode` importado mal**: si haces `import { ReactNode } from 'react'` como valor (sin `type`), bajo ciertos `tsconfig` el bundler/runtime se queja o el tipo llega distinto; la forma moderna es `import type { ReactNode } from 'react'`.
- **`No overload matches this call`**: el componente tiene props **required** que no pasaste, o la variante de la unión que intentas usar exige campos extra (vuelve a las discriminated unions).
- **`construct or call signatures`**: estás usando como componente algo que no exporta una función/clase React (mal `export`, typo en el nombre o import por defecto inexistente).

**Configuración de módulos:** con `verbatimModuleSyntax` / `erasableSyntaxOnly` activos, los **imports de tipos deben ir con `import type`** para que el compilador los elimine limpiamente:

```typescript
// ✅ tipos con import type (se borran al emitir JS)
import type { ReactNode } from 'react'
import { useState } from 'react'   // valores, import normal
```

**Por qué importa:** estos seis errores son los que más tiempo queman en proyectos React+TS; tener la tabla a mano convierte una hora de frustración en un cambio de una línea.

## Conceptos clave

- **Discriminated union en props**: un literal (`estado`) que abre/cierra variantes con **sus** campos; narrowing en cada `if`.
- **Type guard**: función con predicado `x is T` que verifica de verdad antes de afirmar; se usa en handlers con datos `unknown`.
- **`as const`**: readonly + literales; base para `(typeof ARR)[number]` (unión derivada).
- **`satisfies`**: valida contra un contrato **sin** ampliar el tipo inferido — errores tempranos con máxima precisión.
- **Tabla de errores JSX+TS**: `ReactNode` mal importado, `children` sin tipar, `event.target` any, overloads, exports, props de store.
- **`import type`**: obligatorio/ recomendado con `verbatimModuleSyntax` y `erasableSyntaxOnly`.

## Autoevaluación

**1. ¿Por qué `if (props.estado === 'error')` te permite escribir `props.mensaje` aunque la unión incluye variantes sin ese campo?**

<details>
<summary>Respuesta</summary>

Porque `estado` es la propiedad discriminante: al compararla con `'error'`, TS hace **narrowing** de `props` y descarta las variantes que no pueden coincidir, quedando solo `{ estado: 'error'; mensaje: string }`. Dentro de esa rama, `mensaje` existe y es `string`; en las otras ramas, intentarlo daría error.

</details>

**2. `esProducto` devuelve `x is Producto`. ¿Qué ganas frente a un cast `x as Producto`?**

<details>
<summary>Respuesta</summary>

Que la afirmación está **respaldada por un chequeo en runtime** (`'precio' in x`, etc.): si el dato no es un Producto, el guard devuelve `false` y caes a la otra rama tipada. Con `as`, TS te cree a ciegas: si el dato no coincide, el error aparece (silenciosamente) más tarde en runtime.

</details>

**3. ¿Cuál es la diferencia clave entre poner `as const` y `satisfies` en `TEMA`?**

<details>
<summary>Respuesta</summary>

`as const` cambia **el tipo resultante**: hace readonly y convierte strings en literales (`'#fff'` no es `string`). `satisfies` **no cambia** el tipo inferido: solo comprueba que el valor cumple el contrato (`Record<'light'|'dark', …>`) y lanza error si falta una clave o sobra una, conservando el tipo fino del valor. Se usan juntos: precisión + validación.

</details>

**4. Aparece `No overload matches this call` al renderizar `<Cargador estado="ok" />`. ¿Qué miras primero?**

<details>
<summary>Respuesta</summary>

Que la variante de la unión que estás usando esté completa: `{ estado: 'ok'; datos: string[] }` exige `datos`. Si no lo pasas, no hay "overload" (combinación de props) que encaje. Revisa props required vs opcionales de esa variante concreta de la discriminated union. (Ejemplo en el proyecto: `src/components/EstadoCarga.tsx` y `src/lib/tema.ts`.)

</details>
