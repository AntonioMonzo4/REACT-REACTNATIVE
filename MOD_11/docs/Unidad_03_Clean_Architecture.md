# Unidad 03 — Clean Architecture

## Objetivos

- Comprender el principio de dependencias "hacia dentro" de Clean Architecture.
- Nombrar las cuatro capas (entities, use cases, adapters, frameworks) con ejemplos de React.
- Escribir un módulo de dominio sin ningún import de React.
- Distinguir cuándo merece la pena una arquitectura limpia y cuándo es exceso.
- Entender la relación entre Clean Architecture y el patrón hexagonal (ports & adapters).
- Localizar `src/domain/` y `src/useCases/` en el ejemplo `EJEMPLO_ARQUITECTURA`.

## Requisitos

- Haber leído la [Unidad 02 — Feature Based](Unidad_02_Feature_Based.md).
- Saber qué es un `import` / `export` en JavaScript.
- Tener claros los conceptos de "componente React" y "hook".
- Conocer a grandes rasgos qué es una API (`fetch`) y un store (Redux/Zustand), aunque no los domines.

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

**Qué es cada capa, en palabras de la vida real:**

- **Entities / Domain (el núcleo):** las reglas puras del negocio, escritas como matemáticas. Ejemplo: "el total de un pedido es la suma de sus líneas"; "no se puede comprar con stock negativo". **Aquí no entra React ni ningún framework**: es JavaScript (o TypeScript) puro, y por eso se puede probar en un microsegundo, sin renderizar nada.
- **Use Cases (casos de uso):** orquestan un paso concreto de la app: `añadirAlCarrito(producto)`, `crearPedido(datos)`. Saben *qué* hacer (llamar al dominio, guardar en la API), pero no *cómo* se pinta la pantalla.
- **Interface Adapters (adaptadores):** traductores entre el mundo interno y el externo: mappers de JSON a objetos, reducers, presenters. Convierten la respuesta del servidor al formato que espera tu dominio.
- **Frameworks / Drivers (el exterior):** React, Redux, `fetch`, `localStorage`. La parte más volátil: las librerías cambian, las reglas del negocio no.

**Dependencias solo hacia adentro**: React no conoce el use case; el use case no importa React.

**Qué significa esa frase:** las flechas de dependencia apuntan del exterior hacia el núcleo. El núcleo (domain) **no** importa nada de fuera; React (fuera) **sí** puede importar el núcleo. Si un día quieres reutilizar tus reglas de negocio en un CLI de Node, en un worker o en una app React Native, copias `domain/` y funciona: no arrastras React con él. Es como el motor de un coche: el motor no depende del volante, el volante depende del motor.

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

**Recorriendo el código de arriba abajo:**

1. `domain/precio.js` calcula el IVA con una fórmula pura. No hay `import React`, no hay `useState`, no hay DOM. Se podría ejecutar en la consola del navegador tal cual.
2. `useCases/añadirLinea.js` recibe un `pedido` y un `producto`, aplica las reglas del dominio (¿hay stock? ¿hay que aplicar descuento?) y devuelve el nuevo pedido. Tampoco pinta nada.
3. La **UI** (un hook o un componente) es quien llama a `añadirLinea(...)` y luego hace `setState` para que la pantalla se actualice. La flecha va de la UI hacia el use case: **el hook llama al use case, no al revés**.

La tabla anterior usa nombres ligeramente distintos (Application, Infrastructure) porque así se llaman en muchos libros; el espíritu es el mismo que el diagrama de capas.

## Hexagonal / Ports & Adapters

Mismo espíritu: el dominio define **puertos** (interfaces); HTTP, mock o IndexedDB son **adaptadores** intercambiables → tests sin red.

**Analogía:** el puerto USB de tu portátil es el **puerto**: un hueco con una forma definida. Le puedes enchufar un ratón, un disco o una memoria (**adaptadores**). El portátil no sabe qué hay al otro lado; solo habla el idioma USB. En código:

```js
// Puerto: el dominio solo declara QUÉ necesita, no cómo se hace
// (en JS suele modelarse como una función/objeto recibido por parámetro)
export function confirmarPedido(pedido, guardarPedido) {
  // guardarPedido es el puerto: en prod será HTTP, en test un mock
  return guardarPedido(pedido)
}
```

El beneficio más tangible: en los tests pasas un `guardarPedido` falso y **no necesitas red, ni servidor, ni `msw`**. También puedes cambiar `fetch` por `axios` o por IndexedDB sin tocar una sola regla de negocio.

## Cuándo merece la pena

| App | Enfoque |
|-----|---------|
| Landing / CRUD simple | Feature folders + shared |
| Domains complejos (fintech, e-commerce serio) | Clean / hexagonal en el core |
| Micro frontends | claves + contratos entre zonas |

**Cómo decidir:**

- **Landing o CRUD simple:** no hay reglas de negocio reales que proteger. Meter cuatro capas es ceremonia pura: tendrás 12 archivos de 5 líneas. Quédate con carpetas por feature (Unidad 02) y serás feliz.
- **Dominios complejos:** si tu app calcula intereses, valida seguros o gestiona inventario con mil reglas, esas reglas merecen vivir aisladas de React. Ahí Clean Architecture se paga sola: los tests son rapidísimos y puedes cambiar la UI sin miedo a romper la contabilidad.
- **Micro frontends:** cuando varias apps comparten zonas, lo que importa son los **contratos** entre ellas (qué exporta cada paquete), que es el espíritu modular de la Unidad 04.

## Errores comunes

**Error 1: "Clean" con 10 capas y 3 archivos reales (ceremonia).**

```text
src/domain/entities/valueObjects/agregados/pedidos/LineaPedido.js  ← 6 líneas
src/application/usecases/comandos/añadir/...                       ← 6 líneas
... y así 10 archivos más para un TODO list
```

**Solución:** empieza con **dos** zonas: `domain/` (reglas puras) y el resto. Añade capas solo cuando notes un dolor real (por ejemplo: "no puedo cambiar la API sin romper tests"). La regla de los_Componentes favoritos de todo arquitecto: *no ates zapatos con corbata*.

**Error 2: Importar `react` en el dominio "porque es fácil".**

```js
// ❌ Mal: el dominio ya no es portable ni testeable sin React
import { useState } from 'react'
export const conIva = (neto) => { ... }

// ✅ Bien: función pura, sin framework
export const conIva = (neto) => Math.round(neto * 1.21 * 100) / 100
```

**Solución:** si en `domain/` aparece `import ... from 'react'` (o `'@mui/material'`, o `'axios'`), es una fuga. Mueve esa lógica a un hook o a la capa de infraestructura y deja el dominio limpio. `pnpm lint` con una regla `no-restricted-imports` puede automatizar la vigilancia.

## Conceptos clave

- **Dependencias hacia dentro:** el núcleo no importa frameworks; el exterior importa el núcleo.
- **Domain / Entities:** reglas de negocio puras, sin React.
- **Use Cases:** pasos concretos de la app (añadirAlCarrito, crearPedido).
- **Interface Adapters:** mappers, reducers, presenters entre dominio y exterior.
- **Frameworks / Drivers:** React, Redux, fetch, localStorage (la parte volátil).
- **Puerto (port):** interfaz que el dominio declara sin saber quién la implementa.
- **Adaptador (adapter):** implementación concreta (HTTP, mock, IndexedDB) de un puerto.
- **Ceremonia:** estructura elaborada que no aporta valor al tamaño real del proyecto.

## Autoevaluación

**1. ¿Puede `domain/stock.js` hacer `fetch` a la API?**

<details>
<summary>Respuesta</summary>

No. `fetch` es infraestructura (drivers externos). El dominio solo aplica reglas; si necesita datos, el use case se los pasa como parámetro. Así `stock.js` se testea sin red y funciona en Node, navegador o React Native.

</details>

**2. ¿Hacia dónde apuntan las dependencias en Clean Architecture?**

<details>
<summary>Respuesta</summary>

Hacia dentro: los niveles externos (React, adapters) importan a los internos (use cases, domain), nunca al revés. El dominio no importa nada del exterior.

</details>

**3. Tienes un CRUD de blog de 4 pantallas. ¿Vale la pena hexagonal completa?**

<details>
<summary>Respuesta</summary>

No (es over-engineering). Según la tabla, para una landing o CRUD simple basta con feature folders + shared. Reserva la arquitectura limpia para dominios con reglas de negocio de verdad.

</details>

**4. ¿Cómo consigues tests sin red en un flujo `confirmarPedido`?**

<details>
<summary>Respuesta</summary>

Definiendo un **puerto**: la función recibe `guardarPedido` como dependencia. En producción le pasas la versión HTTP; en el test le pasas un mock que solo registra la llamada. Así el test no toca la red (patrón hexagonal).

</details>
