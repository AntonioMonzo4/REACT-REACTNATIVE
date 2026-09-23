# Unidad 05 — Introducción a DDD

## Qué es

**Domain-Driven Design**: modelar el software según el **lenguaje del negocio** (ubiquitous language), no según las tablas de la BD.

## Piezas clave

| Concepto | Significado | Ejemplo e-commerce |
|----------|-------------|--------------------|
| **Ubiquitous language** | mismo nombre en código y en reuniones | `LineaPedido`, no `ItemRow` |
| **Entity** | identidad + ciclo de vida | `Cliente` (id) |
| **Value Object** | sin identidad, por valor | `Dinero(10, 'EUR')` |
| **Aggregate** | grupo con invariantes; un entry point | `Pedido` (líneas, total ≥ 0) |
| **Domain Event** | algo que pasó | `PedidoConfirmado` |
| **Bounded Context** | frontera de modelo | Catálogo ≠ Envíos ≠ Facturación |

## En frontend

No hace falta un backend hexagonal para aplicar DDD:

```js
// context/catalogo — el catálogo habla de Producto, Descuento
// context/envios — Direccion, CosteEnvio (¡no reusar Producto a ciegas!)
```

Dos contextos pueden llamar igual a “cliente” con **modelos distintos**.

## Tácticos mínimos útiles

1. Nombrar con el **lenguaje del negocio**.
2. Agrupar **agregados** en una feature.
3. Value objects inmutables (`Object.freeze` o solo functions).
4. Eventos de dominio para flujos multi-feature (`pedido:confirmado`).

## Cuándo complicarlo

| Caso | DDD |
|------|-----|
| CRUD de blog | overkill |
| Marketplace, seguros, banca | merece modelos explícitos |

## En el ejemplo

`domain/pedido.js` con `LineaPedido` y `calcularTotalPedido` (value semantics, sin React).
