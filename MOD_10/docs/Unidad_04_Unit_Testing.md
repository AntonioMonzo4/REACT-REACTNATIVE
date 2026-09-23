# Unidad 04 — Unit Testing

## Qué es unitario aquí

La **unidad más pequeña con valor**: función pura, reducer, utilidad de fecha, parser de CSV, lógica de descuento.

```js
// math.js
export const calcularTotal = (items) =>
  items.reduce((acc, i) => acc + i.precio * i.cantidad, 0)

// math.test.js
import { calcularTotal } from './math'

describe('calcularTotal', () => {
  it('carrito vacío = 0', () => {
    expect(calcularTotal([])).toBe(0)
  })

  it('suma precio * cantidad', () => {
    expect(
      calcularTotal([
        { precio: 10, cantidad: 2 },
        { precio: 5, cantidad: 1 },
      ]),
    ).toBe(25)
  })
})
```

## Reducers también son unitarios

```js
expect(cartReducer({ items: [] }, add({ id: '1', precio: 3 }))).toEqual({
  items: [{ id: '1', precio: 3, cantidad: 1, lineId: expect.any(String) }],
})
```

## Buenas prácticas

- Nombre de test = **comportamiento**: `it('devuelve 0 con carrito vacío')`, no `it('test 1')`.
- Arrange–Act–Assert.
- Un concepto por test; si necesitas 5 expects correlacionados, quizá son 2 tests.
- Deterministas: sin `Date.now()` real, sin orden de mapas indefinido.

## En el ejemplo

`src/math.test.js` y `cartSlice.test.js` (si copias el slice del M9).
