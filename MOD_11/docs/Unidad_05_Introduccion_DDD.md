# Unidad 05 — Introducción a DDD

## Objetivos

- Definir Domain-Driven Design y el concepto de *ubiquitous language*.
- Distinguir Entity de Value Object con ejemplos del dominio.
- Entender qué es un Aggregate y sus invariantes.
- Reconocer un Bounded Context y por qué dos contextos pueden nombrar igual a cosas distintas.
- Aplicar los "tácticos mínimos útiles" en una app de frontend.
- Saber cuándo DDD merece la pena y cuándo es exceso (overkill).

## Requisitos

- Haber leído la [Unidad 03 — Clean Architecture](Unidad_03_Clean_Architecture.md) (DDD y Clean suelen ir juntos).
- Haber leído la [Unidad 02 — Feature Based](Unidad_02_Feature_Based.md) (los bounded contexts en frontend se parecen a las features).
- Entender qué es un objeto en JavaScript y qué significa "inmutable" a grandes rasgos.
- No hace falta tener experiencia en backend: todos los ejemplos son de frontend o de conceptos puros.

## Qué es

**Domain-Driven Design**: modelar el software según el **lenguaje del negocio** (ubiquitous language), no según las tablas de la BD.

**Pongámoslo en palabras llanas.** DDD es una forma de diseñar software poniendo el **negocio** en el centro, no la base de datos ni la librería de moda. El síntoma clásico de que falta DDD es este: el producto habla de "presupuestos" y "anticipos", pero en tu código todo se llama `ItemRow1`, `DataObject2` y `tmpCalc`. Cuando el nombre del código no coincide con el nombre de la reunión, cada conversación obliga a traducir, y en la traducción se cometen errores.

La **ubiquitous language** (lenguaje ubicuo) es el acuerdo: *si en la reunión decimos "línea de pedido", en el código existe `LineaPedido` y nada se llama distinto*. Ni `ItemRow`, ni `OrderLineAux`. Un solo vocabulario, usado por negocio, diseño y código.

| Pieza | En la vida real |
|-------|-----------------|
| Lenguaje del negocio | lo que dice el CEO en la presentación |
| El código | debe usar esas mismas palabras |
| La base de datos | es un detalle interno, no el jefe del vocabulario |

## Piezas clave

| Concepto | Significado | Ejemplo e-commerce |
|----------|-------------|--------------------|
| **Ubiquitous language** | mismo nombre en código y en reuniones | `LineaPedido`, no `ItemRow` |
| **Entity** | identidad + ciclo de vida | `Cliente` (id) |
| **Value Object** | sin identidad, por valor | `Dinero(10, 'EUR')` |
| **Aggregate** | grupo con invariantes; un entry point | `Pedido` (líneas, total ≥ 0) |
| **Domain Event** | algo que pasó | `PedidoConfirmado` |
| **Bounded Context** | frontera de modelo | Catálogo ≠ Envíos ≠ Facturación |

**Desglose de cada concepto (este es el corazón de la unidad):**

- **Ubiquitous language:** ya explicado: una palabra = un nombre en el código, en los diagramas y en el Slack.
- **Entity (entidad):** un objeto con **identidad**. Dos `Cliente` con el mismo `id` son *el mismo cliente*. Tiene ciclo de vida: se crea, se actualiza, a veces se archiva. Si cambias sus atributos, sigue siendo él.
- **Value Object (objeto valor):** no tiene identidad, solo **valor**. `Dinero(10, 'EUR')` no es "el diez euros únicos del universo": si tienes dos con el mismo importe y moneda, son intercambiables. Dos `Dinero(10,'EUR')` iguales **son** el mismo valor. Por eso suelen ser inmutables: si quieres "modificar" un dinero, creas otro (no existen los euros "en edición").
- **Aggregate (agregado):** un grupo de objetos que el negocio siempre ve **junto**, con reglas que se mantienen siempre (*invariantes*), y un **único punto de entrada**. Ejemplo: `Pedido` es un agregado que contiene sus `LineaPedido` y su total. Nadie puede añadir una línea "por la puerta trasera" sin pasar por el agregado: así garantizas que `total >= 0` y que las líneas no se desincronicen. El agregado es la caja fuerte: solo hay una puerta.
- **Domain Event (evento de dominio):** un hecho del pasado que a todos les interesa: `PedidoConfirmado`, `StockAgotado`. Nadie lo "modifica" (ya pasó); se emite y otros reaccionan. Son ideales para coordinar varias features sin acoplarlas.
- **Bounded Context (contexto delimitado):** la **frontera** donde un modelo tiene un significado preciso. "Producto" en *Catálogo* (nombre, fotos, precio de venta) no es el mismo modelo que "Producto" en *Logística* (peso, dimensiones, SKU del almacén). Forzar un único modelo global para todo es un desastre: mejor modelos separados y traductores entre ellos.

## En frontend

No hace falta un backend hexagonal para aplicar DDD:

```js
// context/catalogo — el catálogo habla de Producto, Descuento
// context/envios — Direccion, CosteEnvio (¡no reusar Producto a ciegas!)
```

Dos contextos pueden llamar igual a “cliente” con **modelos distintos**.

**Qué significa esto:** DDD no es un plugin de servidor; es una mentalidad. En React puedes aplicarla agrupando tu código por contextos (muy parecido a las features de la Unidad 02):

- En `features/catalogo/` viven `Producto`, `Descuento`, `formatearPrecio`.
- En `features/envios/` viven `Direccion`, `CosteEnvio`, `calcularPlazo`.

Y ojo con la trampa clásica: **sí, "cliente" puede llamarse igual en dos sitios con formas distintas**. El `Cliente` de *cuentas* tiene email, plan y facturas; el "cliente" de *envíos* solo necesita `Direccion` y teléfono. Reusar el primero "porque ya existe" en el segundo es acoplar dos contextos que evolucionan por separado. Mejor duplicar el nombre y traducir en la frontera (un mapper) que crear un dios-objeto usado por todos.

## Tácticos mínimos útiles

1. Nombrar con el **lenguaje del negocio**.
2. Agrupar **agregados** en una feature.
3. Value objects inmutables (`Object.freeze` o solo functions).
4. Eventos de dominio para flujos multi-feature (`pedido:confirmado`).

**Cómo hacerlos en la práctica, sin reescribir el mundo:**

1. *Nombra con el lenguaje del negocio.* Revisa tus nombres hoy: `cartItem` vs `LineaPedido`, `clientStuff` vs `Cliente`. Cambia los que choquen con lo que se dice en las reuniones.
2. *Agrupa agregados en una feature:* `Pedido` con sus líneas y su `calcularTotalPedido` van juntos, en la misma carpeta (por ejemplo `domain/pedido.js` + `features/pedidos/`). Nadie de fuera manipula las líneas sueltas.
3. *Value objects inmutables:* en JavaScript, `Object.freeze(obj)` evita que se mute, o mejor aún: funciones puras que **devuelven** un valor nuevo. `Dinero.suma(a, b)` devuelve otro dinero; no modifica ninguno de los dos.
4. *Eventos multi-feature:* cuando "pedido confirmado" debe reaccionar el email, el stock y el CRM, emite un evento en vez de llamar a los tres directamente. La feature de pedidos **no importa** a las otras; solo avisa. Menos acoplamiento, igual que en la Unidad 04.

## Cuándo complicarlo

| Caso | DDD |
|------|-----|
| CRUD de blog | overkill |
| Marketplace, seguros, banca | merece modelos explícitos |

**Cómo decidirlo:** DDD cuesta (nombres cuidadosos, agregados, tests de invariantes). Solo merece la pena cuando las **reglas de negocio son complejas y valiosas**:

- *CRUD de blog:* altas, listados y borrados. No hay "invariantes" que defender. Unos nombres decentes y carpetas por feature bastan; meter agregados y eventos es puro espectáculo.
- *Marketplace, seguros, banca:* aquí un cálculo mal modelado cuesta dinero o incumple la ley. Los modelos explícitos (`Póliza`, `Cobertura`, `Prima`) se pagan solos en menos bugs y en conversaciones más claras con el negocio.

## En el ejemplo

`domain/pedido.js` con `LineaPedido` y `calcularTotalPedido` (value semantics, sin React).

Abre ese archivo en `EJEMPLO_ARQUITECTURA` y comprueba tres cosas DDD: (1) los nombres son del negocio, (2) `LineaPedido` se maneja por valor (funciones que devuelven nuevos objetos, sin React) y (3) `calcularTotalPedido` es una regla pura del agregado que puedes testear en milisegundos.

## Errores comunes

**Error 1: Llamar igual a cosas distintas (romper el ubiquitous language).**

```js
// ❌ Mal: tres nombres para el mismo concepto en la misma app
const itemRow = ...
const OrderLine = ...
const filaPedido = ...
```

**Solución:** elige **un** nombre que el negocio use (p. ej. `LineaPedido`) y renombra todo. Búscalo con `Ctrl+Shift+F` en el editor. Si negocio dice "presupuesto", en el código hay `Presupuesto`, no `Budget2`.

**Error 2: Un "objeto valor" que en realidad tiene identidad (o al revés).**

```js
// ❌ Mal: dos "clientes" con distinto id pero que comparas por id... ¿entity o VO?
// ❌ Mal: Dinero que mutas en sitio y deja de ser intercambiable
dinero.cantidad = 20 // ¡ahora tus tests fallan por sorpresa!
```

**Solución:** pregúntate "¿dos de estos con los mismos datos son el mismo o solo equivalentes?". Si dependen de un `id` único → Entity (con ciclo de vida). Si solo importa el valor → Value Object **inmutable**: `Object.freeze` o funciones que devuelven una copia nueva (`conCantidad(dinero, 20)`).

**Error 3: Aplicar un solo modelo global a todos los contextos ("God object").**

```js
// ❌ Mal: el Producto de catálogo arrastra peso, fotos, descuentos y direcciones
//    y lo usan catálogo, envíos, facturación y marketing...
```

**Solución:** define **bounded contexts**: `catalogo/Producto`, `envios/Producto` (o `Paquete`). Cada uno con sus campos. En la frontera, un traductor. Duplicar un poco de código es **barato**; acoplar dos contextos que evolucionan distinto sale caro.

## Conceptos clave

- **DDD:** modelar el software según el lenguaje del negocio, no según la BD.
- **Ubiquitous language:** una palabra del negocio = un nombre en el código.
- **Entity:** identidad + ciclo de vida (`Cliente` con id).
- **Value Object:** sin identidad, por valor, inmutable (`Dinero(10, 'EUR')`).
- **Aggregate:** grupo con invariantes y un único punto de entrada (`Pedido`).
- **Domain Event:** hecho del pasado que otros escuchan (`PedidoConfirmado`).
- **Bounded Context:** frontera donde un modelo tiene significado preciso.
- **Invariantes:** reglas que deben cumplirse siempre dentro de un agregado.
- **Tácticos mínimos:** nombrar bien, agrupar agregados, VOs inmutables, eventos.

## Autoevaluación

**1. ¿Entity o Value Object: un número de pedido de una compra?**

<details>
<summary>Respuesta</summary>

**Entity** (o al menos identificador de una entity): el número identifica *esa* compra concreta, tiene ciclo de vida (se crea, se paga, se anula) y no es intercambiable con otro número "igual". Una `Dinero(10,'EUR')` sí es intercambiable; el número de pedido, no.

</details>

**2. ¿Por qué el agregado `Pedido` es el único punto de entrada a sus líneas?**

<details>
<summary>Respuesta</summary>

Para proteger los invariantes (total ≥ 0, coherencia entre líneas y total). Si cualquiera pudiera añadir o borrar líneas por su cuenta, algún flujo olvidaría recalcular el total y la regla se rompería. La puerta única centraliza las reglas.

</details>

**3. Catálogo y Envíos quieren usar "cliente". ¿Comprometen el mismo modelo?**

<details>
<summary>Respuesta</summary>

No. Son **bounded contexts** distintos: pueden llamarse igual con modelos distintos (cuentas/facturas vs. dirección/teléfono). Se traduce en la frontera en vez de crear un objeto global compartido por todos.

</details>

**4. Tengo un CRUD de blog sencillo. ¿Merece la pena DDD completo?**

<details>
<summary>Respuesta</summary>

No: es overkill. Según la tabla, DDD merece la pena cuando el dominio es complejo (marketplace, seguros, banca). Para el blog basta con nombres claros y carpetas por feature.

</details>
