Qué es una arquitectura?

Cuando hablamos de la arquitectura de un programa nos referimos a cómo están organizadas sus piezas internas y cómo colaboran entre sí.

En Node.js, las piezas principales son:

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

Cada componente tiene una responsabilidad distinta.

Los componentes principales
1. Tu código

Es el código que escribes.

Por ejemplo:

console.log("Hola");

o

const express = require("express");
2. V8

Ya lo conocemos.

Su trabajo consiste en:

interpretar JavaScript,
optimizarlo,
convertirlo en código máquina.

Pero V8 no sabe leer archivos ni abrir conexiones de red.

Para eso necesita ayuda.

3. libuv

Aquí aparece una de las piezas más importantes de Node.js.

libuv es una biblioteca escrita en C que se encarga de gestionar las operaciones lentas del sistema.

Por ejemplo:

leer archivos,
escribir archivos,
acceder a Internet,
trabajar con sockets,
usar temporizadores.

Es decir, cuando escribes:

import fs from "node:fs/promises";

await fs.readFile("datos.txt");

No es V8 quien lee el archivo.

El trabajo real lo hace libuv.

¿Por qué existe libuv?

Imagina que leer un archivo tarda 3 segundos.

Si JavaScript esperase esos 3 segundos sin hacer nada, el programa quedaría bloqueado.

Ejemplo:

leerArchivoMuyGrande();

console.log("Hola");

Sin una arquitectura asíncrona:

Leer archivo...
(3 segundos)

Hola

Todo queda detenido.

Eso sería muy ineficiente.

La solución

Node.js delega las tareas lentas.

JavaScript
      │
      ▼
libuv
      │
      ▼
Sistema Operativo

Mientras tanto, JavaScript sigue ejecutando otras instrucciones.

El hilo principal

Una característica muy conocida de Node.js es que utiliza un único hilo principal para ejecutar JavaScript.

JavaScript
     │
     ▼
Main Thread

Eso significa que las instrucciones JavaScript se ejecutan una detrás de otra.

Por ejemplo:

console.log("A");
console.log("B");
console.log("C");

Salida:

A
B
C

No existe paralelismo aquí.

Entonces... ¿cómo atiende miles de usuarios?

La respuesta es sencilla.

JavaScript ejecuta el código.

libuv realiza el trabajo pesado.

Imagina un restaurante.

Modelo tradicional

Cada camarero cocina su propia comida.

Cliente 1 ← Camarero 1

Cliente 2 ← Camarero 2

Cliente 3 ← Camarero 3

Necesitas muchos camareros.

Modelo Node.js

Existe un único camarero.

Cuando recibe un pedido:

lo lleva a cocina,
sigue atendiendo otras mesas.
Cliente 1 ─┐
Cliente 2 ─┼──► Camarero
Cliente 3 ─┘        │
                    ▼
                 Cocina

El camarero nunca deja de atender clientes.

Eso hace Node.js.

Ejemplo práctico

Supongamos este código:

import fs from "node:fs/promises";

console.log("Inicio");

fs.readFile("archivo.txt");

console.log("Fin");

Lo que ocurre internamente es:

Inicio

↓

Node delega la lectura del archivo a libuv

↓

Continúa ejecutando JavaScript

↓

Fin

↓

Cuando el archivo termina de leerse...

↓

Se ejecuta el código correspondiente

El hilo principal nunca estuvo esperando.

¿Qué tareas delega Node.js?

Entre otras:

Lectura de archivos.
Escritura de archivos.
Consultas DNS.
Acceso a bases de datos (a través de sus drivers).
Operaciones de red.
Temporizadores.
Compresión de archivos.
Operaciones criptográficas.
¿Qué NO puede delegar?

El código JavaScript que tú escribes.

Por ejemplo:

let suma = 0;

for (let i = 0; i < 10_000_000_000; i++) {
    suma += i;
}

Mientras este bucle se ejecuta:

nadie puede atender nuevas peticiones,
nadie puede responder solicitudes,
la aplicación parece "congelada".

Esto se conoce como bloquear el Event Loop.

¿Por qué Node.js funciona tan bien?

Porque la mayoría de servidores pasan mucho más tiempo esperando que trabajando.

Por ejemplo:

Un servidor recibe una petición.

Después:

espera una consulta SQL,
espera una llamada HTTP,
espera leer un archivo,
espera una respuesta de Redis.

Durante esas esperas, Node.js puede atender otras solicitudes.

Por eso es excelente para aplicaciones con mucha entrada/salida (I/O), como:

APIs REST.
Chats.
Aplicaciones en tiempo real.
Streaming.
Microservicios.
¿Dónde entra el Event Loop?

Hasta ahora hemos hablado de él varias veces, pero aún no lo hemos explicado.

Sabemos que:

JavaScript tiene un solo hilo.
libuv realiza las tareas lentas.

Entonces queda una pregunta:

¿Quién decide cuándo ejecutar el código que estaba esperando?

La respuesta es:

El Event Loop.

Es el "director de orquesta" de Node.js.

Será el protagonista de la siguiente lección.

Conceptos clave
Node.js está formado por varias piezas que trabajan juntas.
V8 ejecuta JavaScript.
libuv gestiona las operaciones lentas y asíncronas.
JavaScript se ejecuta en un único hilo principal.
Node.js delega las tareas de entrada/salida para no bloquear ese hilo.
El Event Loop coordina cuándo se reanudan las operaciones completadas.