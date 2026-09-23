# Unidad 02 — React Testing Library

## Objetivos

- Entender la **filosofía de RTL**: probar lo que la persona ve y hace, no la implementación interna.
- Renderizar un componente con `render` y encontrar elementos con `screen`.
- Dominar el **orden de preferencia de queries** (`getByRole` > `getByLabelText` > `getByText`…).
- Diferenciar `queryBy*`, `getAllBy*` y `findBy*` y cuándo usar cada uno.
- Interactuar correctamente con `userEvent` (y saber por qué `fireEvent` es de segunda).
- Escribir tests **asíncronos** que esperen datos o efectos sin *flakiness*.

## Requisitos

- Haber completado **M4 (React desde Cero)** y **M5 (React Intermedio)**: componentes, props, eventos y `useState` (es lo que verás en el `Contador`).
- **Haber leído la Unidad 01**: necesitas Vitest instalado y configurado (`globals: true`, `jsdom`, setup de jest-dom) para que funcionen `expect` y `toBeInTheDocument`.
- Conocer `fetch` del **M8 (Consumo de APIs)** para el ejemplo asincrónico de `Posts`.
- **Secuencia entre unidades**: después va la **Unidad 03 (Mocking)**, porque los tests de UI que ya sabes hacer pronto necesitarán controlar la red y los temporizadores.

## Filosofía

**No** pruebas implementación (estado interno, clases privadas). Pruebas lo que la **persona ve y hace**: texto, roles ARIA, clics.

**Analogía**: testear tu componente es como **testear una puerta**. Lo que importa es que al empujar el picaporte se abre: no necesitas mirar el mecanismo interior de cerradura y muelles. Si en cambio pruebas el mecanismo interno (el `useState` privado, el `container.innerHTML`), cualquier refactor inocente "romperá" tu test aunque la puerta siga abriendo perfectamente.

**Qué significa "probar la implementación"**: afirmar cosas que el usuario jamás verá, por ejemplo `expect(estado.contador).toBe(1)` accediendo al estado privado, o comparar el HTML interno con `container.innerHTML`.

**¿Por qué importa?** RTL está diseñado para que tus tests **sobrevivan a los refactors**. Si mañana cambias `useState` por `useReducer`, o divides un componente en dos, el botón "Incrementar" seguirá ahí y tu test seguirá pasando. Ese es el objetivo.

```jsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Contador from './Contador'

test('incrementa al pulsar', async () => {
  render(<Contador />)
  const boton = screen.getByRole('button', { name: /incrementar/i })
  await userEvent.click(boton)
  expect(screen.getByText('1')).toBeInTheDocument()
})
```

Desglose línea a línea, porque este patrón se repite en todos los tests de UI:

| Línea | Qué hace |
|-------|----------|
| `render(<Contador />)` | Monta el componente en el DOM falso |
| `screen.getByRole('button', ...)` | Busca **como una persona**: un botón llamado "Incrementar" |
| `await userEvent.click(boton)` | Hace clic real (con `await`: React actualiza el estado) |
| `expect(...).toBeInTheDocument()` | Aserción: el "1" ya está visible en pantalla |

## Queries (orden de preferencia)

| Query | Ejemplo |
|-------|---------|
| `getByRole` | `getByRole('button', { name: 'Enviar' })` |
| `getByLabelText` | inputs con label |
| `getByPlaceholderText` | fallback |
| `getByText` | texto visible |
| `queryBy*` | devuelve `null` si no existe (assert negativo) |
| `findBy*` | async (aparece tras un efecto/promesa) |

**Qué significa cada familia de queries:**

- `getBy*` → **busca y devuelve** el elemento; si no lo encuentra, **lanza error** con sugerencias. Es el 90 % de tus casos.
- `queryBy*` → igual, pero devuelve `null` si no existe. Úsalo cuando quieras **comprobar que algo NO aparece** (p. ej. el mensaje de error se ocultó).
- `findBy*` → como `getBy*`, pero **espera** (reintenta hasta el timeout) hasta que aparezca. Es el predilecto para contenido que llega de forma asíncrona.

**Orden de preferencia mental**: primero `getByRole` (refleja accesibilidad y es lo más cercano a la experiencia real), luego `getByLabelText` en formularios, después `getByText`, y `getByPlaceholderText` solo como *fallback* cuando no haya label ni role útil.

## userEvent vs fireEvent

`userEvent` simula mejor (pointer + teclado + delays). Prefiere:

```js
await userEvent.type(input, 'hola')
await userEvent.keyboard('{Enter}')
```

**Por qué importa**: `fireEvent` dispara un evento DOM "seco" y síncrono; `userEvent` reproduce la secuencia real (foco → tecleo carácter a carácter → keydown/keyup), respetando los *delays* de escritura. Si no haces `await` al `userEvent`, el estado de React puede no haberse actualizado todavía cuando ejecutas tu `expect`.

Regla práctica: **usa `userEvent` en tests de UI; `fireEvent` solo si necesitas un evento muy concreto que `userEvent` no cubra.**

## Probar async

```jsx
test('muestra posts', async () => {
  render(<Posts />)
  expect(await screen.findByText(/cargando|post 1/i)).toBeInTheDocument()
})
```

Usa `findBy*` con timeout por defecto; evita `waitFor` salvo necesidad.

**Qué está pasando aquí**: al renderizar, el componente lanza una petición; el test no "duerme" con `setTimeout` a ciegas, sino que **espera activamente** a que el texto aparezca (`findByText` reintenta hasta el timeout por defecto). Eso evita tests intermitentes (*flaky*): los que fallan un día y pasan otro sin cambiar el código.

**¿Por qué importa?** Los tests lentos e intermitentes se ignoran; un equipo que no confía en sus tests rojos acabará desactivándolos. Los tests async bien escritos son rápidos y deterministas.

## Errores comunes

### 1. `getByText('Enviar')` falla si el texto está partido por `<span>`

```text
TestingLibraryElementError: Unable to find an element with the text: Enviar
```

**Solución**: usa role + name, que aguanta el texto repartido en varios nodos:

```jsx
screen.getByRole('button', { name: /enviar/i })
```

### 2. Olvidar `await userEvent.*`

```text
expected '0' to be '1'
```

**Solución**: el estado aún no se actualizó. Añade `await`:

```js
await userEvent.click(boton)
```

### 3. Testear el `useState` interno con `container.innerHTML`

```js
// frágil: rompe con cualquier cambio de markup
expect(container.innerHTML).toContain('contador: 1')
```

**Solución**: no lo hagas; consulta lo visible con queries (`getByText('1')`) y evita depender de la estructura HTML.

### 4. Múltiples elementos con el mismo texto

```text
TestingLibraryElementError: Found multiple elements with the text: Eliminar
```

**Solución**: usa `getAllBy` (devuelve array) o acota el contenedor con `within(lista)`:

```js
const items = screen.getAllByRole('listitem')
expect(items).toHaveLength(3)
```

## Conceptos clave

- **RTL**: prueba el DOM que ve la persona, no el estado interno.
- **`render`**: monta el componente en el DOM de jsdom.
- **`screen`**: puerta de entrada a todas las queries sobre el DOM renderizado.
- **Orden de queries**: `getByRole` → `getByLabelText` → `getByText` → `getByPlaceholderText`.
- **Prefijos**: `getBy*` (existe y falla si no), `queryBy*` (null si no existe), `findBy*` (espera hasta que aparezca).
- **`userEvent` vs `fireEvent`**: interacción real con `await` vs. evento DOM seco.
- **Async tests**: `findBy*` evita esperas ciegas y tests *flaky*.
- **No testear la implementación**: así los tests sobreviven a refactors.

## Autoevaluación

1. **¿Por qué se prefiere `getByRole('button')` antes que `getByText('Enviar')`?**

   <details><summary>Respuesta</summary>

   Porque el rol refleja lo que la persona y los lectores de pantalla realmente perciben, y el *name* del rol tolera cambios de markup (p. ej. el texto partido por `<span>`). `getByText` es más frágil y más probable que falle en refactors.

   </details>

2. **¿Qué diferencia hay entre `getByText`, `queryByText` y `findByText`?**

   <details><summary>Respuesta</summary>

   `getByText` devuelve el elemento o lanza error si no existe. `queryByText` devuelve `null` si no existe (ideal para afirmaciones negativas). `findByText` devuelve una promesa y espera (con timeout) hasta que el elemento aparezca, para contenido asíncrono.

   </details>

3. **Mi test de clic falla con `expected '0' to be '1'` aunque el componente funciona en el navegador. ¿Qué reviso?**

   <details><summary>Respuesta</summary>

   Reviso si olvidé el `await` en `await userEvent.click(...)`: sin él, el `expect` se ejecuta antes de que React actualice el estado. También confirmo que el query localiza el botón correcto (role + name).

   </details>

4. **Un test comprueba `container.innerHTML` y se rompe al cambiar las clases CSS. ¿Es buen test?**

   <details><summary>Respuesta</summary>

   No: está testeando la implementación (el markup interno) en vez del comportamiento visible. Debe consultar con queries de RTL (`getByRole`, `getByText`) sobre lo que la persona ve.

   </details>
