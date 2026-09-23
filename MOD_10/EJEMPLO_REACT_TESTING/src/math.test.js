import { describe, expect, it } from 'vitest'
import { add, calcularTotal } from './math'

describe('add', () => {
  it('suma dos números', () => {
    expect(add(2, 3)).toBe(5)
  })

  it('admite negativos', () => {
    expect(add(-1, 1)).toBe(0)
  })
})

describe('calcularTotal', () => {
  it('devuelve 0 con carrito vacío', () => {
    expect(calcularTotal([])).toBe(0)
  })

  it('suma precio * cantidad de cada línea', () => {
    const items = [
      { precio: 10, cantidad: 2 },
      { precio: 5, cantidad: 1 },
    ]
    expect(calcularTotal(items)).toBe(25)
  })
})
