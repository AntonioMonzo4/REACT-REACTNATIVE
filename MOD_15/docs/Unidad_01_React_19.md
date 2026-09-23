# Unidad 01 — React 19

## Objetivos

- Ubicar qué cambia React 19 respecto a la versión que usaste en M4–M14.
- Leer una promesa en el render con el hook `use()` dentro de un `Suspense`.
- Escribir una Server Action y conectarla a un `<form action={...}>`.
- Recibir `ref` como una prop normal de componente, sin `forwardRef`.
- Distinguir los hooks nuevos: `useActionState`, `useOptimistic` y `useFormStatus`.

## Requisitos

- Módulos M4–M14 del curso: componentes funcionales, JSX, eventos, `useState`, `useEffect`, listas con `key`.
- Saber leer código con Promesas y `async/await` (si te suena raro, repasa el bloque de JS moderno antes de continuar).
- `Node.js` y `pnpm` instalados para poder correr la demo de `EJEMPLO_MODERNO/`.
- **No** hace falta saber Next.js todavía: estas APIs pertenececen a React “pelado”. En las Unidades 03–06 veremos cómo el App Router de Next las aprovecha al máximo.

## Por qué aparece React 19 y qué resuelve

Hasta React 18, tres tareas muy comunes requerían mucho *boilerplate* o librerías externas:

1. **Leer datos asíncronos**: montábamos `useState(null)` + `useEffect(() => { fetch... }, [])` en cada componente que necesitara información.
2. **Mandar datos al servidor**: escribíamos un endpoint (`fetch` + `route`/`api`) y a mano el `loading`/`error` en el cliente.
3. **Componer refs**: usábamos `forwardRef` como ceremonia obligatoria en todo componente que quisiera recibir un `ref`.

React 19 oficializa soluciones para los tres casos: el hook `use()`, las **Server Actions** y el `ref` como prop. Además añade hooks de formulario (`useActionState`, `useFormStatus`) y de UI optimista (`useOptimistic`).

**Analogía**: antes tenías que bajar al sótano (efectos, callbacks encadenados, refs anidadas) para cocinar cada plato; React 19 te deja los ingredientes ya preparados en la cocina. No desaprendes nada de lo anterior —los hooks viejos siguen funcionando— pero el código nuevo se escribe bastante más corto.

> Nota de curso: en este módulo usamos React 19 porque Next.js moderno lo incluye. Si tu base de React viene de M4–M14, empieza por esta unidad aunque no hayas tocado nunca un servidor.

## `use()` — leer promesas

### Qué significa

`use(promise)` es el primer hook pensado para **leer el resultado de una promesa directamente dentro del render**. Cuando la promesa aún no resolvió, el componente “se suspende”: React muestra el `fallback` del `Suspense` más cercano y, cuando la promesa resuelve, vuelve a renderizar con los datos reales. Es decir: el `await` ocurre *dentro* de React, no en un efecto.

```jsx
import { use, Suspense } from 'react'

function Temas({ temasPromise }) {
  const temas = use(temasPromise)   // suspende hasta resolver
  return <ul>{temas.map((t) => <li key={t.id}>{t.nombre}</li>)}</ul>
}

// En el padre:
const temasPromise = fetchTemas()   // se dispara una vez
<Suspense fallback={<p>Cargando…</p>}>
  <Temas temasPromise={temasPromise} />
</Suspense>
```

Detalles que conviene retener:

- `use` es el primer hook que **puede** llamarse en condicionales según docs (pero sigue siendo peligroso inestable — mejor top level).
- Funciona con Context también (`use(SomeContext)`).

### Por qué importa

Fíjate en la frase “se dispara una vez”: la promesa **se crea en el padre** y se pasa como prop. Así el dato no se refetcha en cada render, y varios hijos podrían compartir la misma promesa. El patrón completo (crear la promesa arriba → pasarla → leerla con `use` → envolver en `Suspense`) es exactamente el mismo que usarás en el App Router cuando Next convierta tu `page` en un Server Component con `await`.

## Server Actions

### Qué significa

Una **Server Action** es una función asíncrona que **se ejecuta en el servidor** pero se llama desde el cliente como si fuera una función normal: sin montar un endpoint a mano, sin escribir `fetch`. Basta marcar el archivo (o la función exportada) con la directiva `'use server'`.

```javascript
// app/actions.js
'use server'

export async function crearPost(formData) {
  const title = formData.get('title')
  await db.posts.create({ data: { title } })
  revalidatePath('/posts')
}
```

```jsx
<form action={crearPost}>
  <input name="title" />
  <button>Enviar</button>
</form>
```

Lo que ocurre cuando pulsas “Enviar”:

1. React serializa los campos del formulario (`formData`).
2. La petición viaja al servidor (vía RPC, no vías un URL que tú montes).
3. `crearPost` corre **en el servidor**, con acceso a `db`, secretos, etc.
4. El cliente solo recibe el resultado (y puedes actualizar la UI con el estado devuelto).

Apuntes originales, siguen en pie:

- La función se ejecuta **en el servidor**; el cliente solo recibe el resultado.
- Con `useActionState` puedes leer `state`, `pending`, `error`.

### Por qué importa

Es la forma moderna de hacer **mutaciones** (crear, borrar, actualizar) sin duplicar lógica: validas y escribes en el servidor, y el formulario conserva la accesibilidad nativa de HTML (`action`, progressive enhancement). En la Unidad 05 veremos que las Server Actions son la contraparte de las lecturas con `await` en el servidor: lees con `await` en el render y mutas con Server Actions.

## `ref` como prop (sin forwardRef)

### Qué significa

Desde React 19, `ref` es una **prop más** de los componentes funcionales. Ya no necesitas envolver el componente en `forwardRef` para que un padre pueda pasarle un `ref`:

```jsx
function Campo({ ref, ...props }) {
  return <input ref={ref} {...props} />
}
// <Campo ref={miRef} />
```

### Por qué importa

`forwardRef` existía porque `ref` era una “prop reservada” que React filtraba. Al normalizarlo, los componentes se leen igual que cualquier otro componente con props: menos ceremonia, menos adornos en el código y mejor composición (por ejemplo, reenviar el `ref` a un `<input>` interno sin helpers).

## Cambios de hooks y layout

Resumen en tabla de lo que trae la versión 19 (conservado del material original):

| Cambio | Nota |
|--------|------|
| `use` | async en render |
| Actions + `useActionState` | forms con estado |
| `useOptimistic` | UI optimista mientras muta |
| `useFormStatus` | pending del form padre |
| Layouts | pueden ser async en App Router |

Cómo se usan los dos hooks de formulario más prácticos:

```jsx
// Dentro de un client component
const [state, formAction, pending] = useActionState(enviar, initialState)
const { pending: pendingForm } = useFormStatus()   // en un hijo del <form>
```

Y `useOptimistic`: mientras la mutación viaja al servidor, muestras el resultado *como si* ya hubiera ocurrido; si el servidor falla, React revierte la UI a los datos reales.

## Errores comunes

### 1. Llamar a una Server Action sin `'use server'`

**Ejemplo (mal):**

```jsx
'use client'
async function crearPost(formData) {
  await db.posts.create(...)   // ❌ esto corre en el navegador: `db` no existe
}
<form action={crearPost}>...</form>
```

**Solución**: la función debe vivir en un archivo (o bloque) con `'use server'` como primera línea, y exportarse. En el cliente solo importas la referencia; el cuerpo se ejecuta en el servidor.

### 2. `forwardRef` “por costumbre” en código nuevo

**Ejemplo (mal):**

```jsx
const Campo = forwardRef((props, ref) => <input ref={ref} {...props} />)
```

**Solución**: en React 19 usa `function Campo({ ref, ...props })`. `forwardRef` aún funciona pero es innecesario en 19 (útil solo si tu librería aún debe soportar React 18).

### 3. Pasar una promesa por props sin `Suspense`

**Ejemplo (mal):**

```jsx
<Temas temasPromise={fetchTemas()} />   // ❌ React no sabe qué pintar mientras resuelve
```

**Solución**: envuelve el componente que llama a `use()` en `<Suspense fallback={...}>`. Sin ese borde, React no tiene UI de reserva y lanza error.

## En el ejemplo

El ejemplo de este módulo es deliberadamente **estático**: demo local sin Server Components completos (el ejemplo M15 es estático con Vite para no requiere red); teoría + snippets para Next. Es decir, en `EJEMPLO_MODERNO/` practicarás `use()`, `ref` prop, `useActionState` (con una action simulada que no toca red) y `useOptimistic`; las Server Actions “de verdad” con acceso a base de datos las montarás en el proyecto Next.js de la Unidad 06 en adelante.

## Conceptos clave

- **React 19**: versión mayor que estabiliza `use()`, Server Actions, `ref` como prop y hooks de formulario.
- **`use(promise)`**: lee una promesa en el render; suspende el componente hasta que resuelve.
- **`Suspense`**: define la UI de reserva (`fallback`) mientras algo asíncrono carga.
- **Server Action**: función asíncrona con `'use server'` que corre en el servidor y se invoca desde el cliente.
- **`useActionState`**: expone `state`, `pending` y `error` de una action de formulario.
- **`useOptimistic`**: muestra un estado “wishful” mientras la mutación está en vuelo y lo revierte si falla.
- **`useFormStatus`**: lee el estado (`pending`) del `<form>` padre desde un hijo.
- **`ref` como prop**: en 19 el `ref` llega como prop normal; `forwardRef` queda opcional.

## Autoevaluación

1. ¿Qué hace `use(temasPromise)` y qué debe envolver al componente que lo llama?

<details><summary>Respuesta</summary>

Lee el resultado de la promesa durante el render: si aún no resolvió, el componente se suspende y React muestra el `fallback` del `Suspense` más cercano; al resolver, re-renderiza con los datos. Por eso el componente que usa `use()` debe estar dentro de un `<Suspense>`.

</details>

2. ¿Dónde se ejecuta el cuerpo de una `crearPost(formData)` marcada con `'use server'`?

<details><summary>Respuesta</summary>

En el servidor. El cliente solo envía los datos del formulario y recibe el resultado; por eso dentro puedes usar `db`, claves y `revalidatePath` sin exponerlos al navegador.

</details>

3. ¿Por qué en React 19 ya no hace falta `forwardRef` para que un componente reciba un `ref`?

<details><summary>Respuesta</summary>

Porque `ref` pasó a ser una prop normal: `function Campo({ ref, ...props })` recibe el ref directamente. `forwardRef` seguía existiendo por compatibilidad, pero en 19 es innecesario.

</details>

4. Menciona dos situaciones en las que te fallaría el código de esta unidad y cómo lo arreglarías.

<details><summary>Respuesta</summary>

Ejemplos válidos: (a) pasar una promesa a `use()` sin `Suspense` → envolver en `<Suspense fallback={...}>`; (b) definir la action en el cliente sin `'use server'` → moverla a un archivo con esa directiva y exportarla; (c) esperar `pending` de un botón hijo sin `useFormStatus` o sin `useActionState` → usar esos hooks.

</details>
