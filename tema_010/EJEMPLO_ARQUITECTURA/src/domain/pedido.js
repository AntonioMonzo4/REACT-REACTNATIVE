export function conIva(neto) {
  return Math.round(neto * 1.21 * 100) / 100
}

export function calcularTotalPedido(lineas) {
  return lineas.reduce((acc, l) => acc + l.precio * l.cantidad, 0)
}
