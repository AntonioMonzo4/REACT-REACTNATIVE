# Unidad 02 — Eventos tipados

## Objetivos

- Entender qué es `React.SyntheticEvent` y por qué no usamos los eventos del DOM directamente.
- Tipar los handlers más comunes: `FormEvent`, `ChangeEvent`, `MouseEvent`.
- Escribir handlers **custom** (que no son eventos del DOM) con tipos propios.
- Usar helpers con genéricos de eventos sin caer en casts repetidos.
- Evitar los errores típicos: `e` implícito con props mal tipadas, `target` vs `currentTarget` y `FormEvent` sin genérico.

## Requisitos

- **TS básico del M3**: funciones como tipo, genéricos a nivel de función, casts (`as`).
- M4–M12: formularios en React (`onSubmit`, `onChange`), `preventDefault()`, `FormData`.
- Unidad 01 de este módulo: ya sabés tipar props y callbacks.

## React.SyntheticEvent

Cuando escribes `onClick={...}` en React, el objeto que llega **no** es el evento nativo del navegador: es un **`SyntheticEvent`**, un envoltorio unificado de React con la misma API en todos los navegadores (IE incluido, histópicamente) y con pooling/optimizaciones internas.

**Qué significa:** para tipar el handler, anotás el parámetro con el tipo sintético de React, **no** con `Event` de TS DOM:

```typescript
function Formulario() {
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value)
  }

  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log(e.currentTarget.dataset.id)
  }

  return (
    <form onSubmit={onSubmit}>
      <input onChange={onChange} />
      <button type="button" onClick={onClick}>OK</button>
    </form>
  )
}
```

Guía de los tres tipos del ejemplo:

| Tipo | Se usa en | Elemento genérico | Ejemplo de acceso típico |
|------|-----------|-------------------|---------------------------|
| `React.FormEvent<HTMLFormElement>` | `onSubmit` | `<form>` | `e.preventDefault()`, `e.currentTarget` |
| `React.ChangeEvent<HTMLInputElement>` | `onChange` de inputs | `<input>` | `e.target.value` |
| `React.MouseEvent<HTMLButtonElement>` | `onClick` de botones | `<button>` | `e.currentTarget.dataset.id` |

**Por qué importa:** el genérico (`<HTMLFormElement>`, `<HTMLInputElement>`) afinca el tipo de `currentTarget`/`target`. Con el genérico correcto, TS sabe que `e.target.value` existe; sin él, o con el elemento equivocado, te da errores o, peor, `any` silencioso.

**`target` vs `currentTarget`:** `target` es el elemento que disparó (puede ser un hijo si hubo delegación); `currentTarget` es el elemento al que está atado el handler (el form/input en cuestión). Para `FormData` conviene **`currentTarget`**: es siempre el form del handler.

## Handlers custom (no DOM)

No todo `onX` es un evento del DOM. Cuando defines **tus propios callbacks** (una API para otro componente), el parámetro es **tu dominio**, no un `SyntheticEvent`:

```typescript
type Item = { id: string }

function Lista({ onBorrar }: { onBorrar: (item: Item) => void }) {
  // ...
  return <button onClick={() => onBorrar({ id: '1' })}>x</button>
}
```

**Qué significa:**

- El `<button onClick={...}>` del DOM recibe un `MouseEvent` (lo maneja React).
- Dentro de ese handler llamas a `onBorrar({ id: '1' })`, que es **tu callback** tipado `(item: Item) => void` — nada de eventos.

**Por qué importa:** confundir ambos mundos es un error de diseño común: `onBorrar` no debería recibir un `MouseEvent`, debería recibir el **item** a borrar. La firma tipada te obliga a respetar esa separación: si escribís `onBorrar(e)`, TS protesta porque `e` (un evento) no es `Item`.

## Genéricos de eventos

A veces querés un helper reutilizable para adaptar un evento a tu tipo de dominio:

```typescript
function campo<T>(fn: (v: T) => void) {
  return (e: React.ChangeEvent<HTMLInputElement>) => fn(e.target.value as unknown as T)
}
```

**Qué significa:** `campo` devuelve un handler de `Change` que extrae `e.target.value` (siempre `string`) y se lo entrega a `fn` con el tipo `T` que elijas. El doble cast (`as unknown as T`) es el "agujero" donde conviertes `string` → `T`.

**Preferible helpers concretos a casts repetidos:** el patrón anterior es útil de vez en cuando, pero si el `as unknown as T` se reparte por todo el código, mejor crear helpers **concretos y tipados**:

```typescript
const onChangeTexto = (fn: (v: string) => void) =>
  (e: React.ChangeEvent<HTMLInputElement>) => fn(e.target.value)

const onChangeNumero = (fn: (v: number) => void) =>
  (e: React.ChangeEvent<HTMLInputElement>) => fn(Number(e.target.value))
```

**Por qué importa:** un cast es una promesa que TS ya no verifica; encapsularlo en un solo helper pequeño concentra el riesgo en un sitio documentado en vez de esparcirlo por la app.

## En el ejemplo

`src/components/Formulario.tsx` con `FormEvent<HTMLFormElement>` en el submit; los `onChange` de los inputs infieren `ChangeEvent` por el contexto del JSX.

## Errores comunes

**1. `onChange={(e) => ...}` con `e` implícito en props tipadas mal → tipa el handler en el tipo de prop, no solo en la función anónima.**

```typescript
// ❌ la prop está mal tipada: e llega como any y no hay ayuda
type P = { onChange: (e: any) => void }
<input onChange={(e) => console.log(e.target.value)} />

// ✅ tipa la PROP; la función anónima inferirá e: React.ChangeEvent<HTMLInputElement>
type P = { onChange: React.ChangeEventHandler<HTMLInputElement> }
```

Solución: anotá el tipo en la **declaración de la prop** (`React.ChangeEventHandler<HTMLInputElement>`); entonces la lambda `(e) => ...` recibe `e` ya tipado sin repetir la anotación.

**2. `e.target.value` en `HTMLDivElement` — usa `HTMLInputElement` en el tipo del evento.**

```typescript
// ❌ tipaste un div pero pedís .value
const onCambio = (e: React.ChangeEvent<HTMLDivElement>) => e.target.value

// ✅ el elemento real es input
const onCambio = (e: React.ChangeEvent<HTMLInputElement>) => e.target.value
```

Solución: el genérico del evento debe coincidir con el elemento real; también podés usar `e.currentTarget` (el elemento dueño del handler) para que TS dé el tipo exacto.

**3. `FormEvent` sin genérico → `currentTarget` demasiado ancho.**

```typescript
// ❌ FormEvent sin elemento: currentTarget es EventTarget genérico
const onSubmit = (e: React.FormEvent) => {
  const fd = new FormData(e.currentTarget) // error o tipado pobre
}

// ✅ afina al form
const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  const fd = new FormData(e.currentTarget)
}
```

Solución: siempre `React.FormEvent<HTMLFormElement>` (o el elemento correcto) para que `currentTarget` sepa que es un `<form>`.

## Conceptos clave

- **`SyntheticEvent`**: envoltorio de React sobre el evento DOM; se tipa con `React.XxxEvent<Element>`.
- **Genéricos del evento**: `FormEvent<HTMLFormElement>`, `ChangeEvent<HTMLInputElement>`, `MouseEvent<HTMLButtonElement>` — afinan `target`/`currentTarget`.
- **`target` vs `currentTarget`**: elemento disparador vs elemento dueño del handler; para `FormData` usa `currentTarget`.
- **Handlers custom**: callbacks de tu dominio (`(item: Item) => void`), separados de los eventos DOM.
- **Genéricos de helpers**: `campo<T>(fn)` adapta `value` a tu tipo; prefiere helpers concretos a `as unknown as T` repetidos.
- **Tipar en la prop**: `React.ChangeEventHandler<HTMLInputElement>` hace que la lambda reciba `e` tipado.

## Autoevaluación

**1. ¿Por qué el parámetro de `onSubmit` es `React.FormEvent<HTMLFormElement>` y no simplemente `Event`?**

<details>
<summary>Respuesta</summary>

Porque React entrega un `SyntheticEvent` unificado, no el evento nativo. El genérico `<HTMLFormElement>` tipa `currentTarget` como `<form>`, lo que permite `new FormData(e.currentTarget)` con tipos correctos. Con `Event` genérico perderías esas propiedades y tendrías errores o `any`.

</details>

**2. En `Lista`, ¿por qué `onBorrar` recibe `(item: Item)` y no un `MouseEvent`?**

<details>
<summary>Respuesta</summary>

Porque `onBorrar` es un callback de tu dominio (la API del componente), no un handler del DOM: quien consume `Lista` quiere saber **qué item** se borró, no detalles del click. El `MouseEvent` lo consume el `onClick` interno; dentro llamas a `onBorrar({ id: '1' })`. La firma tipada hace que pasar un evento por error no compile.

</details>

**3. Ves el error `Property 'value' does not exist on type 'EventTarget'`. ¿Dos causas posibles y sus soluciones?**

<details>
<summary>Respuesta</summary>

(1) El evento está tipado con el elemento equivocado o sin genérico (`ChangeEvent<HTMLDivElement>` o `FormEvent` solo) → usar `ChangeEvent<HTMLInputElement>` / `FormEvent<HTMLFormElement>`. (2) El handler es `any`/sin tipar porque la **prop** está mal declarada → tipar la prop con `React.ChangeEventHandler<HTMLInputElement>` para que `e` infiera correctamente.

</details>

**4. ¿Cuándo conviene un helper `campo<T>(fn)` y cuándo conviene helpers concretos?**

<details>
<summary>Respuesta</summary>

El helper genérico sirve cuando necesitás adaptar el string del input a varios tipos en un solo punto y podés controlar el cast. Conviene helpers concretos (`onChangeTexto`, `onChangeNumero`) cuando el `as unknown as T` empezaría a repetirse: concentran la conversión en código pequeño, tipado y verificable, evitando casts sueltos por la app.

</details>
