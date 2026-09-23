# Unidad 03 — Clean Architecture

## Capas (implicación de dependencias hacia dentro)

```text
Entities / Domain     ← reglas de negocio puras (TS types, validadores)
        ↓
Use Cases             ← flujos: añadirAlCarrito, calcularDescuento
        ↓
Interface Adapters    ← presenters, mappers, reducers
        ↓
Frameworks / Drivers   ← React, Redux, fetch, localStorage
```

**Dependencias solo hacia adentro**: React no conoce el use case; el use case no importa React.

## En una app React real (sin dogma)

| Capa | Ejemplo |
|------|---------|
| Domain | tipos de `Pedido`, `calcularIva()`, reglas de stock |
| Application | `useCases/crearPedido.js` (orquesta api + domain) |
| Infrastructure | `api/pedidosHttp.js`, `storage/localPedidos.js` |
| UI | componentes y hooks que llaman al use case |

```js
// domain/precio.js — cero imports de React
export const conIva = (neto) => Math.round(neto * 1.21 * 100) / 100

// useCases/añadirLinea.js
export function añadirLinea(pedido, producto) { ... }

// UI: hook llama al use case, no al reverso
```

## Hexagonal / Ports & Adapters

Mismo espíritu: el dominio define **puertos** (interfaces); HTTP, mock o IndexedDB son **adaptadores** intercambiables → tests sin red.

## Cuándo merece la pena

| App | Enfoque |
|-----|---------|
| Landing / CRUD simple | Feature folders + shared |
| Domains complejos (fintech, e-commerce serio) | Clean / hexagonal en el core |
| Micro frontends | claves + contratos entre zonas |

## Errores comunes

- “Clean” con 10 capas y 3 archivos reales (ceremonia).
- Importar `react` en el dominio “porque es fácil”.

## En el ejemplo

`src/domain/`, `src/useCases/` y `features/` solo UI + adaptadores.
