# Unidad 05 — El Event Loop

*"El cerebro de Node.js"*

## Objetivos

- Entender cómo funciona realmente Node.js por dentro.
- Saber por qué JavaScript puede ser asíncrono con un solo hilo.
- Comprender qué ocurre cuando utilizas `setTimeout()`, `fetch()`, `fs.readFile()`, `Promise` y `async/await`.
- Distinguir **microtasks** de **macrotasks** y conocer su orden de prioridad.
- Conocer las **fases** del Event Loop (Timers, Poll, Check...).
- Resolver ejercicios sobre el orden de ejecución del código.

## Requisitos

- Haber leído la Unidad 04 (¿Qué es una Arquitectura?). Se asume que ya sabes qué son V8, libuv y el hilo principal.

---

# Parte 1 — El problema de la asincronía

## Antes de empezar

Ya sabemos varias cosas:

- ✔ JavaScript tiene un **único hilo** de ejecución.
- ✔ Node utiliza **V8**.
- ✔ **libuv** realiza las tareas lentas.

Pero todavía existe una pregunta:

> Si JavaScript solo puede hacer una cosa cada vez... **¿cómo puede ejecutar miles de operaciones al mismo tiempo?**

La respuesta es: **no las ejecuta al mismo tiempo.**

Y aquí está el error que comete casi todo el mundo cuando empieza.

## El mayor mito de Node.js

Mucha gente dice:

> "Node.js es multihilo."

**No.** JavaScript en Node no es multihilo.

Lo que ocurre es esto:

```text
JavaScript
    │
    ▼
Hace una petición
    │
    ▼
Otra librería (libuv) realiza el trabajo
    │
    ▼
JavaScript sigue trabajando
    │
    ▼
Cuando termina...
    │
    ▼
El Event Loop recupera el resultado
```

Es decir: **JavaScript nunca deja de hacer una cosa para ponerse a esperar.**

## Una analogía

Imagina un restaurante. Hay un **único camarero**. Ese camarero eres tú.

1. Llega un cliente. Te dice: *"Quiero una pizza."*
2. **¿Te quedas durante veinte minutos mirando el horno?** No.
3. Llevas el pedido a cocina.
4. Mientras la cocina trabaja... **atiendes otras mesas.**
5. Cuando la pizza está lista... la cocina te avisa.
6. La llevas.

Eso es exactamente el Event Loop:

```text
Cliente
  │
  ▼
Camarero
  │
  ▼
Cocina
  │
  ▼
Camarero
  │
  ▼
Cliente
```

El camarero **nunca cocina**. Solo coordina.

Entonces... **¿quién cocina?**

- **JavaScript** es el camarero.
- **libuv** es la cocina.
- **Event Loop** es quien pregunta continuamente: *"¿Ya está listo algo?"*

---

# Parte 2 — El Call Stack

## ¿Qué es?

Antes de entender el Event Loop debemos entender otra estructura: el **Call Stack** (también llamado **pila de llamadas**).

Es donde JavaScript coloca las funciones que está ejecutando.

Imagina una **pila de platos**: solo puedes añadir arriba, solo puedes quitar arriba.

```text
─────────
función C
─────────
función B
─────────
función A
─────────
```

Siempre funciona así: **LIFO** (*Last In, First Out* — el último en entrar, el primero en salir).

## Ejemplo

```javascript
function uno() {
    dos();
}

function dos() {
    tres();
}

function tres() {
    console.log("Hola");
}

uno();
```

**Paso 1 — Call Stack**

```text
─────────
  uno()
─────────
```

**Paso 2 — Dentro de `uno()`**

```text
─────────
  dos()
─────────
  uno()
─────────
```

**Paso 3 — Dentro de `dos()`**

```text
─────────
 tres()
─────────
  dos()
─────────
  uno()
─────────
```

**Paso 4** — Ejecuta:

```javascript
console.log("Hola");
```

**Paso 5** — Termina `tres()`. Sale de la pila:

```text
─────────
  dos()
─────────
  uno()
─────────
```

Después sale `dos()`:

```text
─────────
  uno()
─────────
```

Finalmente sale `uno()`. **La pila queda vacía.**

---

# Parte 3 — setTimeout

## ¿Qué ocurre con una operación lenta?

Supongamos esto:

```javascript
console.log("Inicio");

setTimeout(() => {
    console.log("Timeout");
}, 3000);

console.log("Fin");
```

Mucha gente cree que JavaScript hace esto:

```text
Inicio
   │
   ▼
Esperar 3 segundos
   │
   ▼
Timeout
   │
   ▼
Fin
```

**Pero no.**

### Lo que realmente ocurre

**Paso 1**

```javascript
console.log("Inicio");
```

Salida:

```text
Inicio
```

**Paso 2** — Encuentra `setTimeout(...)`.

JavaScript dice: *"Yo no sé esperar."* Así que entrega el temporizador a **Node (libuv)**:

```text
JavaScript
    │
    ▼
  libuv
```

Y continúa **inmediatamente**.

**Paso 3** — Ejecuta:

```javascript
console.log("Fin");
```

Salida:

```text
Fin
```

**Paso 4** — Tres segundos después... libuv dice: *"Ya terminó."*

Pero JavaScript podría estar ocupado. Entonces **no ejecuta directamente el callback**: lo coloca en una cola de espera (**Callback Queue**).

```text
Callback Queue
──────────────────────
console.log("Timeout")
──────────────────────
```

## ¿Qué hace el Event Loop?

Aquí entra el protagonista. El Event Loop está haciendo continuamente algo parecido a esto:

```text
¿Está vacío el Call Stack?
        │
        ▼
       Sí
        │
        ▼
¿Hay algo esperando?
        │
        ▼
       Sí
        │
        ▼
Mételo en el Call Stack
```

Entonces:

```text
Callback Queue
      │
      ▼
 Call Stack
      │
      ▼
console.log("Timeout")
```

Y aparece finalmente:

```text
Timeout
```

## Flujo completo

```text
console.log("Inicio")
        │
        ▼
    Call Stack
        │
        ▼
      Inicio
        │
        ▼
   setTimeout()
        │
        ▼
      libuv
        │
        ▼
console.log("Fin")
        │
        ▼
       Fin
        │
        ▼
   3 segundos
        │
        ▼
 Callback Queue
        │
        ▼
   Event Loop
        │
        ▼
   Call Stack
        │
        ▼
    Timeout
```

**Resultado final:**

```text
Inicio
Fin
Timeout
```

Aunque el temporizador era de tres segundos, **JavaScript nunca estuvo esperando**. Siguió ejecutando instrucciones mientras otra parte del sistema se encargaba del tiempo de espera.

## Lo más importante de esta primera parte

Quédate con estas **cuatro ideas**:

1. El **Call Stack** es donde JavaScript ejecuta las funciones.
2. Las operaciones lentas se **delegan a libuv**.
3. Cuando terminan, sus callbacks se colocan en una **cola de espera**.
4. El **Event Loop** mueve esos callbacks al Call Stack cuando este queda libre.

---

# Parte 4 — Microtasks vs Macrotasks

## El problema

Imagina este código:

```javascript
setTimeout(() => {
    console.log("A");
}, 0);

Promise.resolve().then(() => {
    console.log("B");
});
```

**Pregunta.** ¿Qué se imprimirá?

Muchísima gente responde:

```text
A
B
```

Porque piensa: *"El timeout es de 0 milisegundos."*

Pero la respuesta correcta es:

```text
B
A
```

**¿Por qué?** Porque las Promises tienen **prioridad**. Para entenderlo debemos conocer las colas.

## Node.js tiene varias colas

Podemos simplificarlo así:

```text
                  Event Loop
                       │
      ┌────────────────┴────────────────┐
      │                                 │
      ▼                                 ▼
Microtask Queue                 Callback Queue
(Prioridad alta)               (Prioridad normal)
```

No todas las tareas son iguales.

### Callback Queue (Macrotasks)

Aquí llegan tareas como:

- `setTimeout`
- `setInterval`
- Operaciones de I/O
- Eventos
- `setImmediate` (en Node)

Ejemplo:

```javascript
setTimeout(() => {
    console.log("Hola");
}, 1000);
```

Después de un segundo:

```text
Callback Queue
───────────────────────
    console.log()
───────────────────────
```

Esperando.

### Microtask Queue

Esta cola tiene **prioridad**. Aquí llegan:

- `Promise.then()`
- `Promise.catch()`
- `Promise.finally()`
- `queueMicrotask()`

Y en Node.js también:

- `process.nextTick()` (con una prioridad **aún mayor** que las demás microtareas).

### ¿Por qué existen dos colas?

Porque algunas operaciones deben ejecutarse **inmediatamente después** del código actual.

Por ejemplo:

```javascript
Promise.resolve().then(() => {
    console.log("Promise");
});
```

Una Promise normalmente representa una **continuación lógica** del trabajo que ya estaba haciendo el programa. Sería extraño retrasarla detrás de temporizadores o eventos.

## ¿Cómo decide el Event Loop?

Cada vez que el Call Stack queda vacío, el Event Loop sigue este orden:

```text
¿Call Stack vacío?
        │
        ▼
       Sí
        │
        ▼
¿Hay Microtasks?
        │
        ▼
       Sí
        │
        ▼
Ejecutarlas TODAS
        │
        ▼
¿Quedan más?
     ┌──┴──┐
    Sí     No
     │      │
  Seguir   Mirar Callback Queue
```

**Fíjate en un detalle muy importante:** no ejecuta una microtarea y luego una callback. **Ejecuta todas las microtareas primero.**

## Primer ejemplo

```javascript
console.log("A");

Promise.resolve().then(() => {
    console.log("B");
});

console.log("C");
```

**Paso 1** — Call Stack: `console.log("A")`

Salida:

```text
A
```

**Paso 2** — Encuentra `Promise.resolve().then(...)`. No ejecuta el callback inmediatamente. Lo coloca en:

```text
Microtask Queue
─────────────────
console.log("B")
─────────────────
```

**Paso 3** — Continúa: `console.log("C")`

Salida:

```text
C
```

**Ahora** el Call Stack está vacío. El Event Loop pregunta: *"¿Hay microtareas?"* → Sí. Entonces ejecuta:

```text
B
```

**Resultado final:**

```text
A
C
B
```

## Segundo ejemplo

```javascript
console.log("A");

setTimeout(() => {
    console.log("B");
}, 0);

Promise.resolve().then(() => {
    console.log("C");
});

console.log("D");
```

**Paso 1** — Sale `A`.

**Paso 2** — El timeout va a **Callback Queue**.

**Paso 3** — La Promise va a **Microtask Queue**.

**Paso 4** — Sale `D`.

Ahora el Stack está vacío. El Event Loop hace:

1. Primero **Microtask Queue** → `C`.
2. Después **Callback Queue** → `B`.

**Resultado:**

```text
A
D
C
B
```

## ¿Y si hay muchas Promises?

Mira este código:

```javascript
console.log("Inicio");

Promise.resolve().then(() => {
    console.log("1");
});

Promise.resolve().then(() => {
    console.log("2");
});

Promise.resolve().then(() => {
    console.log("3");
});

setTimeout(() => {
    console.log("Timeout");
}, 0);

console.log("Fin");
```

**¿Qué ocurre?** Cuando termina el código principal:

- **Microtask Queue:** `1`, `2`, `3`
- **Callback Queue:** `Timeout`

El Event Loop **vacía completamente la Microtask Queue** antes de mirar la Callback Queue.

**Salida:**

```text
Inicio
Fin
1
2
3
Timeout
```

## `process.nextTick()`: una prioridad especial en Node.js

Node.js añade una cola adicional para `process.nextTick()`. Su prioridad es **incluso mayor** que la de las Promises.

Por ejemplo:

```javascript
console.log("Inicio");

process.nextTick(() => {
    console.log("nextTick");
});

Promise.resolve().then(() => {
    console.log("Promise");
});

setTimeout(() => {
    console.log("Timeout");
}, 0);

console.log("Fin");
```

La salida será:

```text
Inicio
Fin
nextTick
Promise
Timeout
```

**Orden de prioridad en Node.js:**

1. Call Stack (código síncrono).
2. `process.nextTick()`.
3. Microtask Queue (`Promise`, `queueMicrotask()`).
4. Callback Queue (`setTimeout`, `setInterval`, etc.).

## Error muy común

Muchos desarrolladores creen que:

```javascript
setTimeout(fn, 0);
```

significa: *"Ejecuta inmediatamente."*

**No.** Significa:

> "Ejecuta cuando hayan terminado todas las tareas actuales y todas las microtareas pendientes, y cuando el Event Loop vuelva a procesar la cola de callbacks."

Por eso `setTimeout(..., 0)` **no garantiza** ser lo siguiente que se ejecute.

## Conceptos clave (Parte 4)

- Existen distintas **colas de tareas**, no una sola.
- Las **microtareas** (`Promise.then()`, `queueMicrotask()`) tienen prioridad sobre las callbacks de `setTimeout()`.
- En Node.js, **`process.nextTick()`** tiene una prioridad aún mayor.
- El Event Loop **vacía primero todas las microtareas** antes de procesar las callbacks normales.

---

# Parte 5 — Fases del Event Loop

## El ciclo completo

En cada iteración, Node.js recorre siempre las mismas fases:

```text
┌──────────────────────┐
│      Timers          │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Pending Callbacks    │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Idle / Prepare       │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Poll                 │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Check                │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Close Callbacks      │
└──────────────────────┘
```

Cuando termina una vuelta... empieza otra. Y otra. Y otra. **Mientras el proceso siga vivo.**

### ¿Qué es una iteración?

Imagina que el Event Loop fuera un **vigilante de seguridad**. Hace continuamente la misma ronda:

```text
Puerta 1
   │
   ▼
Puerta 2
   │
   ▼
Puerta 3
   │
   ▼
Puerta 4
   │
   ▼
Empieza otra vez
```

Cada recorrido completo es una **iteración** del Event Loop.

---

## Fase 1 — Timers

Aquí se ejecutan los callbacks de:

- `setTimeout()`
- `setInterval()`

Pero hay un detalle muy importante.

### Error muy común

Muchos creen que:

```javascript
setTimeout(fn, 1000);
```

significa: *"Se ejecutará exactamente dentro de un segundo."*

**No.** Significa: *"No se ejecutará **antes** de un segundo."*

- Puede tardar **más**.
- Nunca **menos**.

**¿Por qué?** Porque cuando termina el temporizador, el callback todavía tiene que esperar a que llegue la fase **Timers** de una nueva iteración del Event Loop.

### Ejemplo

```javascript
setTimeout(() => {
    console.log("Hola");
}, 1000);
```

Después de un segundo:

```text
Temporizador terminado
        │
        ▼
Esperar a la fase Timers
        │
        ▼
Ejecutar callback
```

---

## Fase 2 — Pending Callbacks

Esta fase gestiona algunos callbacks internos del sistema operativo.

Como desarrollador de React o Node, **raramente** trabajarás directamente con ella. Es utilizada principalmente por el propio runtime.

---

## Fase 3 — Idle / Prepare

También es una fase **interna**. Node.js realiza tareas de preparación antes de pasar a la parte más importante del ciclo.

No suele ser relevante para el desarrollo diario.

---

## Fase 4 — Poll

Esta es la fase **más importante** de todas. Aquí ocurre gran parte del trabajo útil.

El Poll se encarga de:

- Esperar nuevas conexiones.
- Procesar operaciones de red.
- Recibir datos.
- Gestionar la lectura y escritura de archivos.
- Ejecutar callbacks de operaciones de entrada/salida (I/O).

Por ejemplo:

```javascript
import fs from "node:fs/promises";

await fs.readFile("datos.txt");
```

Cuando la lectura termina, el callback queda preparado para ejecutarse en la fase **Poll**.

---

## Fase 5 — Check

Aquí se ejecutan los callbacks registrados con:

```javascript
setImmediate(() => {
    console.log("Immediate");
});
```

`setImmediate()` es propio de Node.js y **no existe en los navegadores**. Se utiliza cuando quieres ejecutar una función **justo después** de que termine la fase Poll.

---

## Fase 6 — Close Callbacks

Aquí se ejecutan callbacks relacionados con el **cierre de recursos**. Por ejemplo:

- sockets
- conexiones
- streams

Normalmente no trabajarás directamente con esta fase.

---

## ¿Dónde se ejecutan las Promises?

Aquí hay una diferencia importante respecto a las fases: **las Promises no pertenecen a ninguna de ellas.**

Después de que termina cada callback, Node.js hace una comprobación:

```text
¿Hay process.nextTick()?
        │
        ▼
       Sí
        │
        ▼
Ejecutarlos todos
        │
        ▼
¿Hay microtasks?
        │
        ▼
       Sí
        │
        ▼
Ejecutarlas todas
        │
        ▼
Continuar con la siguiente fase
```

Es decir, **entre una fase y la siguiente**, Node.js vacía las colas de mayor prioridad.

## Ejemplo completo

```javascript
console.log("Inicio");

setTimeout(() => {
    console.log("Timeout");
}, 0);

setImmediate(() => {
    console.log("Immediate");
});

Promise.resolve().then(() => {
    console.log("Promise");
});

console.log("Fin");
```

La salida **garantizada** es:

```text
Inicio
Fin
Promise
```

Pero entre `Timeout` e `Immediate` hay un matiz importante:

- Si este código se ejecuta en el **contexto principal** del programa, el orden entre ambos **no está garantizado** y puede variar según el momento y la versión de Node.js.
- En cambio, si ambos se programan **dentro de un callback de entrada/salida** (por ejemplo, después de `fs.readFile()`), `setImmediate()` suele ejecutarse antes que `setTimeout(..., 0)` porque el Event Loop pasa de la fase **Poll** a la fase **Check** antes de comenzar una nueva iteración en **Timers**.

Esta es una de las preguntas clásicas en **entrevistas** sobre Node.js.

## Resumen visual

```text
                Event Loop

        ┌──────────────────────┐
        │ Timers               │
        └──────────┬───────────┘
                   │
                   ▼
        Pending Callbacks
                   │
                   ▼
          Idle / Prepare
                   │
                   ▼
              Poll (I/O)
                   │
                   ▼
         Check (setImmediate)
                   │
                   ▼
         Close Callbacks
```

Entre cada fase:

1. `process.nextTick()`
2. Microtask Queue (Promises)

## ¿Necesito memorizar todas las fases?

- Para trabajar con **React**: **no**.
- Para trabajar con **Node.js profesionalmente**: conviene conocerlas, especialmente:
  - **Timers**
  - **Poll**
  - **Check**

Las demás existen principalmente para el funcionamiento interno del runtime.

---

## Ejercicios de orden de ejecución

Resuelve primero cada ejercicio **sin mirar la respuesta**. Después despliega el `<details>` para comprobar.

### Ejercicio 1

**¿Cuál es la salida?**

```javascript
console.log("1");

setTimeout(() => {
    console.log("2");
}, 0);

console.log("3");
```

<details>
<summary>Ver respuesta</summary>

```text
1
3
2
```

**Explicación:** `console.log` es síncrono y se ejecuta en el Call Stack (`1`, luego `3`). El callback de `setTimeout` va a la Callback Queue aunque el retardo sea 0, y solo se ejecuta cuando el Call Stack está vacío.

</details>

---

### Ejercicio 2

**¿Cuál es la salida?**

```javascript
console.log("A");

Promise.resolve().then(() => {
    console.log("B");
}).then(() => {
    console.log("C");
});

console.log("D");
```

<details>
<summary>Ver respuesta</summary>

```text
A
D
B
C
```

**Explicación:** `A` y `D` son síncronos. El primer `.then` va a la Microtask Queue y se ejecuta al vaciar el stack (`B`). Ese primer `.then` devuelve otra promesa, de modo que el segundo `.then` (`C`) se encola como **nueva microtarea** y se ejecuta en el mismo "vaciado" de microtareas, justo después de `B`.

</details>

---

### Ejercicio 3

**¿Cuál es la salida?**

```javascript
console.log("Inicio");

setTimeout(() => {
    console.log("Timeout");
}, 0);

setImmediate(() => {
    console.log("Immediate");
});

Promise.resolve().then(() => {
    console.log("Promise");
});

process.nextTick(() => {
    console.log("nextTick");
});

console.log("Fin");
```

<details>
<summary>Ver respuesta</summary>

```text
Inicio
Fin
nextTick
Promise
```

...y después, en un orden **no garantizado** entre sí (en el módulo principal):

```text
Timeout
Immediate
```

(o al revés, según la versión y el momento exacto de Node.js).

**Explicación:**

1. Síncrono: `Inicio`, `Fin`.
2. `process.nextTick` tiene prioridad máxima → `nextTick`.
3. Microtasks → `Promise`.
4. Solo después, el Event Loop procesa las macrotasks de Timers/Check → `Timeout` e `Immediate`.

</details>

---

### Ejercicio 4

**¿Cuál es la salida?**

```javascript
console.log("Start");

setTimeout(() => {
    console.log("Timer 1");
}, 1000);

setTimeout(() => {
    console.log("Timer 2");
}, 0);

Promise.resolve().then(() => {
    console.log("Micro 1");
    Promise.resolve().then(() => {
        console.log("Micro 2");
    });
});

console.log("End");
```

<details>
<summary>Ver respuesta</summary>

```text
Start
End
Micro 1
Micro 2
Timer 2
Timer 1
```

**Explicación:**

1. Síncrono: `Start`, `End`.
2. Microtask actual: `Micro 1`; al resolverse encola `Micro 2`, que se ejecuta en el **mismo** vaciado de microtareas.
3. Callback Queue: primero `Timer 2` (retardo 0) y, pasado un segundo, `Timer 1`.
4. Ojo: `setTimeout(..., 1000)` **nunca** se ejecuta antes de 1000 ms, pero puede tardar **más** si el Event Loop está ocupado.

</details>

---

## Conceptos clave (Unidad completa)

- El **problema**: con un solo hilo no puede haber paralelismo real; la asincronía se responde delegando a libuv y coordinando con el Event Loop.
- El **Call Stack** es donde se ejecuta el código síncrono (LIFO).
- `setTimeout` delega el temporizador y su callback espera en la **Callback Queue**.
- Existen **dos colas principales**: Microtask Queue (prioridad alta) y Callback Queue / macrotasks (prioridad normal).
- **`process.nextTick` > microtasks (Promises) > macrotasks (setTimeout)**.
- El Event Loop está dividido en **fases**: Timers, Pending Callbacks, Idle/Prepare, Poll, Check, Close Callbacks.
- `setTimeout()` se procesa en **Timers**; las operaciones de E/S en **Poll**; `setImmediate()` en **Check**.
- Las Promises y `process.nextTick()` **no pertenecen** a una fase concreta; se procesan **entre fases** con mayor prioridad.
- `setTimeout(fn, 0)` **no** significa "inmediatamente".
