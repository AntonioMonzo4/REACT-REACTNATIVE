# Unidad 02 — React Testing Library

## Filosofía

**No** pruebas implementación (estado interno, clases privadas). Pruebas lo que la **persona ve y hace**: texto, roles ARIA, clics.

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

## Queries (orden de preferencia)

| Query | Ejemplo |
|-------|---------|
| `getByRole` | `getByRole('button', { name: 'Enviar' })` |
| `getByLabelText` | inputs con label |
| `getByPlaceholderText` | fallback |
| `getByText` | texto visible |
| `queryBy*` | devuelve `null` si no existe (assert negativo) |
| `findBy*` | async (aparece tras un efecto/promesa) |

## userEvent vs fireEvent

`userEvent` simula mejor (pointer + teclado + delays). Prefiere:

```js
await userEvent.type(input, 'hola')
await userEvent.keyboard('{Enter}')
```

## Probar async

```jsx
test('muestra posts', async () => {
  render(<Posts />)
  expect(await screen.findByText(/cargando|post 1/i)).toBeInTheDocument()
})
```

Usa `findBy*` con timeout por defecto; evita `waitFor` salvo necesidad.

## Errores comunes

1. `getByText('Enviar')` falla si el texto está partido por `<span>` → usa role+name.
2. Olvidar `await userEvent.*` → el estado aún no se actualizó.
3. Testear el `useState` interno con `container.innerHTML` → frágil.
4. Múltiples elementos con el mismo texto → usa `getAllBy` o acota el contenedor.

## En el ejemplo

`Contador.test.jsx` — render, click y estado visible.
