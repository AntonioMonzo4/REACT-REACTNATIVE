# Unidad 04 — ¿Qué es una Arquitectura?

## Objetivos

- Entender qué significa la "arquitectura" de un programa y la de Node.js en concreto.
- Conocer las piezas principales de Node.js: tu código, V8, el Event Loop y libuv.
- Comprender por qué Node.js usa un único hilo y cómo puede atender a miles de usuarios.
- Distinguir qué tareas delega Node.js (I/O) y qué tareas no puede delegar (tu código JS).
- Entender qué es "bloquear el Event Loop" y por qué es un error a evitar.

## Requisitos

- Haber leído la Unidad 03 (¿Qué es un Motor?) y, idealmente, la Unidad 02 (¿Qué es un Runtime?).

---

## ¿Qué es la arquitectura de un programa?

Cuando hablamos de la **arquitectura** de un programa nos referimos a cómo están organizadas sus piezas internas y cómo colaboran entre sí.

> **Analogía:** la arquitectura de un edificio no es el ladrillo, sino el plano: qué muro hay en cada sitio, dónde está la escalera y cómo se reparten los pisos. En un programa pasa igual: la arquitectura es el plano de sus componentes.

En Node.js, las piezas principales son:

```text
                 Node.js
┌───────────────────────────────────────┐
│                                       │
│  Tu código JavaScript                 │
│              │                        │
│              ▼                        │
│             V8                        │
│              │                        │
│              ▼                        │
│         Event Loop                    │
│              │                        │
│              ▼                        │
│            libuv                      │
│              │                        │
│              ▼                        │
│      Sistema Operativo                │
└───────────────────────────────────────┘
```

Cada componente tiene una **responsabilidad distinta**.

---

## Los componentes principales

### 1. Tu código

Es el código que escribes. Por ejemplo:

```javascript
console.log("Hola");
```

o

```javascript
const express = require("express");
```

### 2. V8

Ya lo conocemos (Unidad 03). Su trabajo consiste en:

- Interpretar JavaScript.
- Optimizarlo.
- Convertirlo en código máquina.

**Pero V8 no sabe leer archivos ni abrir conexiones de red.** Para eso necesita ayuda.

### 3. libuv

Aquí aparece una de las piezas más importantes de Node.js.

**libuv** es una biblioteca escrita en **C** que se encarga de gestionar las operaciones lentas del sistema. Por ejemplo:

- Leer archivos.
- Escribir archivos.
- Acceder a Internet.
- Trabajar con sockets.
- Usar temporizadores.

Es decir, cuando escribes:

```javascript
import fs from "node:fs/promises";

await fs.readFile("datos.txt");
```

**No es V8 quien lee el archivo.** El trabajo real lo hace **libuv**.

---

## ¿Por qué existe libuv?

Imagina que leer un archivo tarda **3 segundos**.

Si JavaScript esperase esos 3 segundos sin hacer nada, el programa quedaría **bloqueado**.

Ejemplo:

```javascript
leerArchivoMuyGrande();

console.log("Hola");
```

Sin una arquitectura asíncrona:

```text
Leer archivo...
(3 segundos)

Hola
```

Todo queda detenido. Eso sería muy ineficiente: un servidor con 1.000 usuarios tendría que hacer esperar a los demás mientras lee un archivo.

### La solución

Node.js **delega** las tareas lentas:

```text
JavaScript
      │
      ▼
    libuv
      │
      ▼
Sistema Operativo
```

Mientras tanto, JavaScript sigue ejecutando otras instrucciones.

---

## El hilo principal

Una característica muy conocida de Node.js es que utiliza un **único hilo principal** para ejecutar JavaScript.

```text
JavaScript
     │
     ▼
 Main Thread
```

Eso significa que las instrucciones JavaScript se ejecutan **una detrás de otra**. Por ejemplo:

```javascript
console.log("A");
console.log("B");
console.log("C");
```

Salida:

```text
A
B
C
```

**No existe paralelismo aquí.**

### Entonces... ¿cómo atiende miles de usuarios?

La respuesta es sencilla:

- **JavaScript** ejecuta el código.
- **libuv** realiza el trabajo pesado.

### Imagina un restaurante

**Modelo tradicional**

Cada camarero cocina su propia comida:

```text
Cliente 1 ← Camarero 1

Cliente 2 ← Camarero 2

Cliente 3 ← Camarero 3
```

Necesitas muchos camareros.

**Modelo Node.js**

Existe un **único camarero**. Cuando recibe un pedido:

- Lo lleva a cocina.
- Sigue atendiendo otras mesas.

```text
Cliente 1 ─┐
Cliente 2 ─┼──► Camarero
Cliente 3 ─┘        │
                    ▼
                 Cocina
```

El camarero **nunca deja de atender clientes**. Eso hace Node.js.

> **¿Qué significa esto de verdad?** Que "atender a miles de usuarios" no implica ejecutar miles de programas a la vez. Implica que, mientras un usuario espera a que le lean su archivo o responda su base de datos, el hilo principal está libre para atender a otros.

---

## Ejemplo práctico

Supongamos este código:

```javascript
import fs from "node:fs/promises";

console.log("Inicio");

fs.readFile("archivo.txt");

console.log("Fin");
```

Lo que ocurre internamente es:

1. Se imprime `Inicio`.
2. Node delega la lectura del archivo a **libuv**.
3. Continúa ejecutando JavaScript.
4. Se imprime `Fin`.
5. Cuando el archivo termina de leerse... se ejecuta el código correspondiente.

**El hilo principal nunca estuvo esperando.**

---

## ¿Qué tareas delega Node.js?

Entre otras:

- Lectura de archivos.
- Escritura de archivos.
- Consultas DNS.
- Acceso a bases de datos (a través de sus drivers).
- Operaciones de red.
- Temporizadores.
- Compresión de archivos.
- Operaciones criptográficas.

## ¿Qué NO puede delegar?

**El código JavaScript que tú escribes.**

Por ejemplo:

```javascript
let suma = 0;

for (let i = 0; i < 10_000_000_000; i++) {
    suma += i;
}
```

Mientras este bucle se ejecuta:

- Nadie puede atender nuevas peticiones.
- Nadie puede responder solicitudes.
- La aplicación parece "congelada".

Esto se conoce como **bloquear el Event Loop**.

> **Errores comunes:**
> - Creer que porque Node es "asíncrono", cualquier código pesado no afecta al servidor. Si es síncrono y ocupa el hilo principal, lo bloquea entero.
> - Hacer `JSON.stringify` o bucles gigantes dentro de peticiones HTTP sin medir: son causas típicas de bloqueo en producción.

---

## ¿Por qué Node.js funciona tan bien?

Porque la mayoría de servidores pasan **mucho más tiempo esperando que trabajando**.

Por ejemplo, un servidor recibe una petición. Después:

- Espera una consulta SQL.
- Espera una llamada HTTP.
- Espera leer un archivo.
- Espera una respuesta de Redis.

Durante esas esperas, Node.js puede atender **otras solicitudes**.

Por eso es excelente para aplicaciones con mucha **entrada/salida (I/O)**, como:

- APIs REST.
- Chats.
- Aplicaciones en tiempo real.
- Streaming.
- Microservicios.

---

## ¿Dónde entra el Event Loop?

Hasta ahora hemos hablado de él varias veces, pero aún no lo hemos explicado.

Sabemos que:

- JavaScript tiene un solo hilo.
- libuv realiza las tareas lentas.

Entonces queda una pregunta:

> **¿Quién decide cuándo ejecutar el código que estaba esperando?**

La respuesta es: **el Event Loop**. Es el "director de orquesta" de Node.js.

Será el protagonista de la siguiente lección (Unidad 05).

---

## Conceptos clave

- Node.js está formado por varias piezas que trabajan juntas.
- **V8** ejecuta JavaScript.
- **libuv** gestiona las operaciones lentas y asíncronas.
- JavaScript se ejecuta en un **único hilo principal**.
- Node.js **delega** las tareas de entrada/salida (I/O) para no bloquear ese hilo.
- Tu código JavaScript **no puede delegarse**: si tarda mucho, bloquea el Event Loop.
- El **Event Loop** coordina cuándo se reanudan las operaciones completadas.
