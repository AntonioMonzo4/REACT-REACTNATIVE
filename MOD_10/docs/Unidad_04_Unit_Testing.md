# Unidad 04 — Unit Testing

## Objetivos

- Definir **qué es una "unidad"** en este curso y elegir bien qué código merece tests unitarios.
- Escribir tests de **funciones puras** con `describe` / `it` / `expect` y ejemplos tipo carrito.
- Aplicar el patrón **Arrange–Act–Assert** de forma natural.
- Testear **reducers** de Redux (`cartReducer`) como si fueran funciones puras.
- Redactar **nombres de test que describen comportamiento**, no números.
- Garantizar tests **deterministas** (sin `Date.now()` ni orden de objetos indefinido).

## Requisitos

- Haber completado **M4 (React desde Cero)** y **M5 (React Intermedio)**, donde viste arrays (`reduce`, `map`) y `useReducer`.
- **M8 (Consumo de APIs)** para entender por qué una función que depende de la red *no* es unitaria pura.
- **M9 (Gestión de Estado)** si vas a copiar el `cartSlice` de Redux al ejemplo.
- Haber leído las **Unidades 01 y 03**: los tests unitarios usan `describe/it/expect` y, si hace falta, `vi.fn` de mocking.
- **Secuencia entre unidades**: la 04 es la base más rápida y barata; la **Unidad 05 (Integration)** monta estas mismas piezas dentro de flujos completos.

## Qué es unitario aquí

La **unidad más pequeña con valor**: función pura, reducer, utilidad de fecha, parser de CSV, lógica de descuento.

**Analogía**: un test unitario es como probar **cada pieza de un motor por separado** antes de montar el coche. Pruebas el pistón solo, no el coche entero. Es la forma más **rápida** de detectar el fallo exacto: si algo falla, sabes *qué pieza* es.

**Qué significa "unidad más pequeña con valor"**: no testees `getNombre()` que solo hace `return this.nombre` (cero valor, solo ruido); sí testea `calcularTotal`, que concentra una **regla de negocio** donde un error cuesta dinero.

**¿Por qué importa?**

- Los unit tests son los **más rápidos**: miles en milisegundos, sin render, sin red.
- Te dan **precisión**: el fallo apunta a un archivo concreto.
- Son la base: si `calcularTotal` ya está probado, en los tests de integración puedes confiar en ella y centrarte en el flujo.

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

Lectura del ejemplo:

- `describe('calcularTotal', ...)` agrupa **todas** las reglas de esa función.
- Cada `it` cubre **un caso**: el borde (carrito vacío) y el caso normal (2 artículos).
- El cálculo `10*2 + 5*1 = 25` es la **verificación concreta** de la regla de negocio.

Fíjate en que **no hay** `render`, ni DOM, ni mocks: la función recibe datos y devuelve datos. Eso es un unit puro.

## Reducers también son unitarios

```js
expect(cartReducer({ items: [] }, add({ id: '1', precio: 3 }))).toEqual({
  items: [{ id: '1', precio: 3, cantidad: 1, lineId: expect.any(String) }],
})
```

**Qué significa**: un reducer de Redux/`useReducer` es una **función pura** `(estadoAnterior, acción) → nuevoEstado`, así que se testea igual que `calcularTotal`: entradas y salida, sin renderizar nada.

**Truco de `expect.any(String)`**: dices "acepto **cualquier** string" para no acoplar el test a un `lineId` generado con `crypto.randomUUID()` o `Date.now()`. Mantienes el test **determinista** sin perder la comprobación de que el campo existe y es un string.

**¿Por qué importa?** Los reducers concentran la lógica de tu app de estado (M9): un error ahí corrompe toda la interfaz. Probarlos en aislamiento es la inversión con mejor retorno del módulo.

## Buenas prácticas

- Nombre de test = **comportamiento**: `it('devuelve 0 con carrito vacío')`, no `it('test 1')`.
- Arrange–Act–Assert.
- Un concepto por test; si necesitas 5 expects correlacionados, quizá son 2 tests.
- Deterministas: sin `Date.now()` real, sin orden de mapas indefinido.

Desglose:

| Fase | Significado | Ejemplo en el carrito |
|------|-------------|------------------------|
| **Arrange** (organizar) | Prepara entradas | `const items = [{ precio: 10, cantidad: 2 }]` |
| **Act** (actuar) | Ejecuta lo que pruebas | `const total = calcularTotal(items)` |
| **Assert** (afirmar) | Compara con lo esperado | `expect(total).toBe(20)` |

**Un concepto por test**: si un `it` comprueba el total, el IVA, el descuento y el redondeo, cuando falle no sabrás cuál de los cuatro se rompió. Mejor cuatro `it` pequeños con nombre de comportamiento.

**Determinismo**: un test es determinista si con las mismas entradas **siempre** da el mismo resultado. Lo rompen `Date.now()`, `Math.random()`, la red, y el orden de claves de un objeto/Map. Si dependes de la hora, congela el tiempo (Unidad 03, fake timers) o inyéctala como parámetro.

## Errores comunes

### 1. Test con nombre inútil

```js
it('test 1', () => { expect(calcularTotal([])).toBe(0) })
```

**Solución**: describe el **comportamiento**, no la posición:

```js
it('devuelve 0 con carrito vacío', () => { expect(calcularTotal([])).toBe(0) })
```

### 2. Test que depende de la fecha real

```text
AssertionError: expected 41 to be 42   (falla solo justo después de medianoche)
```

**Solución**: no uses `Date.now()` "vivo"; inyecta la fecha, congela el reloj con `vi.useFakeTimers()` o usa `expect.any(...)` cuando solo te interesa el tipo.

### 3. Un solo `it` con decenas de expects

**Solución**: reparte en varios `it`, uno por concepto, con Arrange–Act–Assert claro; así el fallo apunta al caso exacto.

## Conceptos clave

- **Unit test**: prueba la unidad más pequeña con valor (función pura, reducer, parser).
- **Función pura**: sin efectos externos; mismas entradas → misma salida.
- **Arrange–Act–Assert**: organizar, actuar, afirmar.
- **Nombre por comportamiento**: `it('devuelve 0 con carrito vacío')`.
- **Un concepto por test**: tests pequeños y diagnosticables.
- **Determinismo**: sin fechas/azar/red reales; usa `expect.any(String)` y fake timers.
- **Reducers = unitarios**: `(estado, acción) → estado` se testea sin render.
- **En el ejemplo**: `src/math.test.js` y `cartSlice.test.js` (si copias el slice del M9).

## Autoevaluación

1. **¿Qué hace que una función sea "unit-testeable" de forma ideal?**

   <details><summary>Respuesta</summary>

   Que sea **pura y pequeña**: recibe datos y devuelve datos sin tocar red, DOM, hora real ni estado global. Así el test es rápido, aislado y determinista.

   </details>

2. **Escribe el nombre correcto para un test de `calcularTotal` con carrito vacío.**

   <details><summary>Respuesta</summary>

   Algo como `it('devuelve 0 con carrito vacío', ...)`: describe el **comportamiento observable**. No vale `it('test 1')` ni `it('funciona')`, porque no comunican qué regla protegen.

   </details>

3. **¿Por qué se usa `expect.any(String)` en el test del reducer?**

   <details><summary>Respuesta</summary>

   Para aceptar **cualquier string** en campos generados de forma no determinista (`lineId`, ids aleatorios). Verificas que el campo existe y es un string sin acoplar el test a un valor concreto que cambia en cada ejecución.

   </details>

4. **¿Qué problema tienen los tests que llaman a `Date.now()` directamente?**

   <details><summary>Respuesta</summary>

   Rompen el **determinismo**: pueden pasar hoy y fallar mañana (p. ej. al cruzar medianoche o un año bisiesto). Solución: inyectar la fecha, congelar el reloj con fake timers o usar `expect.any(...)` cuando solo importa el tipo.

   </details>
