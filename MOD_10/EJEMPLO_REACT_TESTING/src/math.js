export function add(a, b) {
  return a + b
}

export function calcularTotal(items) {
  return items.reduce((acc, i) => acc + i.precio * i.cantidad, 0)
}
