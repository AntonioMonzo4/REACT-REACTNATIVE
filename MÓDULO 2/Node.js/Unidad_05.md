Unidad 1.5 - El Event Loop

"El cerebro de Node.js"

Objetivos

Al finalizar esta unidad serás capaz de:

Entender cómo funciona realmente Node.js.
Saber por qué JavaScript puede ser asíncrono.
Comprender qué ocurre cuando utilizas:
setTimeout()
fetch()
fs.readFile()
Promise
async/await
Resolver ejercicios sobre el orden de ejecución del código.
Antes de empezar

Ya sabemos varias cosas:

✔ JavaScript tiene un único hilo de ejecución.

✔ Node utiliza V8.

✔ libuv realiza las tareas lentas.

Pero todavía existe una pregunta.

Si JavaScript solo puede hacer una cosa cada vez... ¿cómo puede ejecutar miles de operaciones al mismo tiempo?

La respuesta es:

No las ejecuta al mismo tiempo.

Y aquí está el error que comete casi todo el mundo cuando empieza.

El mayor mito de Node.js

Mucha gente dice:

"Node.js es multihilo."

No.

JavaScript en Node no es multihilo.

Lo que ocurre es esto:

JavaScript

↓

Hace una petición

↓

Otra librería (libuv) realiza el trabajo

↓

JavaScript sigue trabajando

↓

Cuando termina...

↓

El Event Loop recupera el resultado

Es decir:

JavaScript nunca deja de hacer una cosa para ponerse a esperar.

Una analogía

Imagina un restaurante.

Hay un único camarero.

Ese camarero eres tú.

Llega un cliente.

Te dice:

Quiero una pizza.

¿Te quedas durante veinte minutos mirando el horno?

No.

Llevas el pedido a cocina.

Mientras la cocina trabaja...

Atiendes otras mesas.

Cuando la pizza está lista...

La cocina te avisa.

La llevas.

Eso es exactamente el Event Loop.

Cliente

↓

Camarero

↓

Cocina

↓

Camarero

↓

Cliente

El camarero nunca cocina.

Solo coordina.

Entonces...

¿Quién cocina?

En Node:

JavaScript

es el camarero.

libuv

es la cocina.

Y

Event Loop

es quien pregunta continuamente:

¿Ya está listo algo?

El Call Stack

Antes de entender el Event Loop debemos entender otra estructura.

El Call Stack.

También llamado

Pila de llamadas.

¿Qué es?

Es donde JavaScript coloca las funciones que está ejecutando.

Imagina una pila de platos.

Solo puedes añadir arriba.

Solo puedes quitar arriba.

───────
función C
───────
función B
───────
función A
───────

Siempre funciona así.

LIFO

Last In

First Out.

Ejemplo
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
Paso 1
Call Stack

──────
uno()
──────
Paso 2

Dentro de uno().

──────
dos()
──────
uno()
──────
Paso 3

Dentro de dos().

──────
tres()
──────
dos()
──────
uno()
──────
Paso 4

Ejecuta:

console.log("Hola");
Paso 5

Termina tres().

Sale de la pila.

──────
dos()
──────
uno()
──────

Después sale dos().

──────
uno()
──────

Finalmente sale uno().

La pila queda vacía.

Vacía
¿Qué ocurre con una operación lenta?

Supongamos esto.

console.log("Inicio");

setTimeout(() => {
    console.log("Timeout");
}, 3000);

console.log("Fin");

Mucha gente cree que JavaScript hace esto:

Inicio

↓

Esperar 3 segundos

↓

Timeout

↓

Fin

Pero no.

Lo que realmente ocurre
Paso 1
console.log("Inicio");

Salida

Inicio
Paso 2

Encuentra

setTimeout(...)

JavaScript dice:

Yo no sé esperar.

Así que entrega el temporizador a Node.

JavaScript

↓

libuv

Y continúa inmediatamente.

Paso 3

Ejecuta

console.log("Fin");

Salida

Fin
Paso 4

Tres segundos después...

libuv dice:

Ya terminó.

Pero JavaScript podría estar ocupado.

Entonces no ejecuta directamente el callback.

Lo coloca en una cola de espera.

Callback Queue

──────────────
console.log("Timeout")
──────────────
¿Qué hace el Event Loop?

Aquí entra el protagonista.

El Event Loop está haciendo continuamente algo parecido a esto:

¿Está vacío el Call Stack?

↓

Sí

↓

¿Hay algo esperando?

↓

Sí

↓

Mételo en el Call Stack

Entonces:

Callback Queue

↓

Call Stack

↓

console.log("Timeout")

Y aparece finalmente:

Timeout
Flujo completo
console.log("Inicio")

↓

Call Stack

↓

Inicio

↓

setTimeout()

↓

libuv

↓

console.log("Fin")

↓

Fin

↓

3 segundos

↓

Callback Queue

↓

Event Loop

↓

Call Stack

↓

Timeout
Resultado final
Inicio

Fin

Timeout

Aunque el temporizador era de tres segundos, JavaScript nunca estuvo esperando.

Siguió ejecutando instrucciones mientras otra parte del sistema se encargaba del tiempo de espera.

Lo más importante de esta primera parte

Quédate con estas cuatro ideas:

El Call Stack es donde JavaScript ejecuta las funciones.
Las operaciones lentas se delegan a libuv.
Cuando terminan, sus callbacks se colocan en una cola de espera.
El Event Loop mueve esos callbacks al Call Stack cuando este queda libre.


El problema

Imagina este código:

setTimeout(() => {
    console.log("A");
}, 0);

Promise.resolve().then(() => {
    console.log("B");
});

Pregunta.

¿Qué se imprimirá?

Muchísima gente responde:

A
B

Porque piensa:

"El timeout es de 0 milisegundos."

Pero la respuesta correcta es:

B
A

¿Por qué?

Porque las Promises tienen prioridad.

Para entenderlo debemos conocer las colas.

Node.js tiene varias colas

Podemos simplificarlo así:

                  Event Loop
                       │
      ┌────────────────┴────────────────┐
      │                                 │
      ▼                                 ▼
Microtask Queue                 Callback Queue
(Prioridad alta)               (Prioridad normal)

No todas las tareas son iguales.

Callback Queue (Macrotasks)

Aquí llegan tareas como:

setTimeout
setInterval
Operaciones de I/O
Eventos
setImmediate (en Node)

Ejemplo:

setTimeout(() => {
    console.log("Hola");
}, 1000);

Después de un segundo:

Callback Queue

───────────────
console.log()
───────────────

Esperando.

Microtask Queue

Esta cola tiene prioridad.

Aquí llegan:

Promise.then()
Promise.catch()
Promise.finally()
queueMicrotask()

Y en Node.js también:

process.nextTick() (con una prioridad aún mayor que las demás microtareas).
¿Por qué existen dos colas?

Porque algunas operaciones deben ejecutarse inmediatamente después del código actual.

Por ejemplo:

Promise.resolve().then(() => {
    console.log("Promise");
});

Una Promise normalmente representa una continuación lógica del trabajo que ya estaba haciendo el programa.

Sería extraño retrasarla detrás de temporizadores o eventos.

¿Cómo decide el Event Loop?

Cada vez que el Call Stack queda vacío, el Event Loop sigue este orden:

¿Call Stack vacío?

↓

Sí

↓

¿Hay Microtasks?

↓

Sí

↓

Ejecutarlas TODAS

↓

¿Quedan más?

↓

Sí

↓

Seguir

↓

No

↓

Mirar Callback Queue

Fíjate en un detalle muy importante:

No ejecuta una microtarea y luego una callback.

Ejecuta todas las microtareas primero.

Primer ejemplo
console.log("A");

Promise.resolve().then(() => {
    console.log("B");
});

console.log("C");
Paso 1

Call Stack

console.log("A")

Salida

A
Paso 2

Encuentra

Promise.resolve().then(...)

No ejecuta el callback inmediatamente.

Lo coloca en:

Microtask Queue

───────────
console.log("B")
───────────
Paso 3

Continúa.

console.log("C");

Salida

C
Ahora

El Call Stack está vacío.

El Event Loop pregunta:

¿Hay microtareas?

Sí.

Entonces ejecuta:

B

Resultado final:

A
C
B
Segundo ejemplo
console.log("A");

setTimeout(() => {
    console.log("B");
}, 0);

Promise.resolve().then(() => {
    console.log("C");
});

console.log("D");
Paso 1
A
Paso 2

El timeout va a:

Callback Queue
Paso 3

La Promise va a:

Microtask Queue
Paso 4
D

Ahora el Stack está vacío.

El Event Loop hace:

Primero:

Microtask Queue

↓

C

Después:

Callback Queue

↓

B

Resultado:

A
D
C
B
¿Y si hay muchas Promises?

Mira este código:

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
¿Qué ocurre?

Cuando termina el código principal:

Microtask Queue:

1

2

3

Callback Queue:

Timeout

El Event Loop vacía completamente la Microtask Queue antes de mirar la Callback Queue.

Salida:

Inicio
Fin
1
2
3
Timeout
process.nextTick(): una prioridad especial en Node.js

Node.js añade una cola adicional para process.nextTick().

Su prioridad es incluso mayor que la de las Promises.

Por ejemplo:

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

La salida será:

Inicio
Fin
nextTick
Promise
Timeout

Orden de prioridad en Node.js:

Call Stack (código síncrono).
process.nextTick().
Microtask Queue (Promise, queueMicrotask()).
Callback Queue (setTimeout, setInterval, etc.).
Error muy común

Muchos desarrolladores creen que:

setTimeout(fn, 0);

significa:

"Ejecuta inmediatamente."

No.

Significa:

"Ejecuta cuando hayan terminado todas las tareas actuales y todas las microtareas pendientes, y cuando el Event Loop vuelva a procesar la cola de callbacks."

Por eso setTimeout(..., 0) no garantiza ser lo siguiente que se ejecute.

Conceptos clave
Existen distintas colas de tareas, no una sola.
Las microtareas (Promise.then(), queueMicrotask()) tienen prioridad sobre las callbacks de setTimeout().
En Node.js, process.nextTick() tiene una prioridad aún mayor.
El Event Loop vacía primero todas las microtareas antes de procesar las callbacks normales.


El ciclo completo

En cada iteración, Node.js recorre siempre las mismas fases:

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

Cuando termina una vuelta...

Empieza otra.

Y otra.

Y otra.

Mientras el proceso siga vivo.

¿Qué es una iteración?

Imagina que el Event Loop fuera un vigilante de seguridad.

Hace continuamente la misma ronda.

Puerta 1

↓

Puerta 2

↓

Puerta 3

↓

Puerta 4

↓

Empieza otra vez

Cada recorrido completo es una iteración del Event Loop.

Fase 1 - Timers

Aquí se ejecutan los callbacks de:

setTimeout()

setInterval()

Pero hay un detalle muy importante.

Error muy común

Muchos creen que:

setTimeout(fn, 1000);

significa:

"Se ejecutará exactamente dentro de un segundo."

No.

Significa:

"No se ejecutará antes de un segundo."

Puede tardar más.

Nunca menos.

¿Por qué?

Porque cuando termina el temporizador, el callback todavía tiene que esperar a que llegue la fase Timers de una nueva iteración del Event Loop.

Ejemplo
setTimeout(() => {
    console.log("Hola");
}, 1000);

Después de un segundo:

Temporizador terminado

↓

Esperar a la fase Timers

↓

Ejecutar callback
Fase 2 - Pending Callbacks

Esta fase gestiona algunos callbacks internos del sistema operativo.

Como desarrollador de React o Node, raramente trabajarás directamente con ella.

Es utilizada principalmente por el propio runtime.

Fase 3 - Idle / Prepare

También es una fase interna.

Node.js realiza tareas de preparación antes de pasar a la parte más importante del ciclo.

No suele ser relevante para el desarrollo diario.

Fase 4 - Poll

Esta es la fase más importante de todas.

Aquí ocurre gran parte del trabajo útil.

El Poll se encarga de:

Esperar nuevas conexiones.
Procesar operaciones de red.
Recibir datos.
Gestionar la lectura y escritura de archivos.
Ejecutar callbacks de operaciones de entrada/salida (I/O).

Por ejemplo:

import fs from "node:fs/promises";

await fs.readFile("datos.txt");

Cuando la lectura termina:

El callback queda preparado para ejecutarse en la fase Poll.

Fase 5 - Check

Aquí se ejecutan los callbacks registrados con:

setImmediate()

Este método es propio de Node.js y no existe en los navegadores.

Se utiliza cuando quieres ejecutar una función justo después de que termine la fase Poll.

Ejemplo:

setImmediate(() => {
    console.log("Immediate");
});
Fase 6 - Close Callbacks

Aquí se ejecutan callbacks relacionados con el cierre de recursos.

Por ejemplo:

sockets,
conexiones,
streams.

Normalmente no trabajarás directamente con esta fase.

¿Dónde se ejecutan las Promises?

Aquí hay una diferencia importante respecto a las fases.

Las Promises no pertenecen a ninguna de ellas.

Después de que termina cada callback, Node.js hace una comprobación:

¿Hay process.nextTick()?

↓

Sí

↓

Ejecutarlos todos

↓

¿Hay microtasks?

↓

Sí

↓

Ejecutarlas todas

↓

Continuar con la siguiente fase

Es decir, entre una fase y la siguiente, Node.js vacía las colas de mayor prioridad.

Ejemplo completo
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

La salida garantizada es:

Inicio
Fin
Promise

Pero entre Timeout e Immediate hay un matiz importante.

Si este código se ejecuta en el contexto principal del programa, el orden entre ambos no está garantizado y puede variar según el momento y la versión de Node.js.

En cambio, si ambos se programan dentro de un callback de entrada/salida (por ejemplo, después de fs.readFile()), setImmediate() suele ejecutarse antes que setTimeout(..., 0) porque el Event Loop pasa de la fase Poll a la fase Check antes de comenzar una nueva iteración en Timers.

Esta es una de las preguntas clásicas en entrevistas sobre Node.js.

Resumen visual
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

Entre cada fase:

1. process.nextTick()
2. Microtask Queue (Promises)
¿Necesito memorizar todas las fases?

Para trabajar con React:

No.

Para trabajar con Node.js profesionalmente:

Conviene conocerlas, especialmente:

Timers.
Poll.
Check.

Las demás existen principalmente para el funcionamiento interno del runtime.

Conceptos clave
El Event Loop está dividido en varias fases.
setTimeout() se procesa en Timers.
Las operaciones de entrada/salida se gestionan en Poll.
setImmediate() se ejecuta en Check.
Las Promises y process.nextTick() no pertenecen a una fase concreta; se procesan entre fases con mayor prioridad.

Node.js vs Navegador

Objetivo

Comprender las diferencias entre ejecutar JavaScript en un navegador y ejecutarlo en Node.js, qué APIs ofrece cada entorno y cómo afecta esto al desarrollo con React y React Native.

Índice
El mismo lenguaje, distintos entornos
APIs del navegador
APIs de Node.js
APIs compartidas
¿Por qué React necesita ambos?
Casos prácticos
Buenas prácticas
Resumen
Ejercicios
1. El mismo lenguaje, distintos entornos

Uno de los errores más comunes es pensar que:

JavaScript = Navegador

No.

JavaScript es solo un lenguaje.

Puede ejecutarse en muchos entornos diferentes:

              JavaScript
                    │
     ┌──────────────┼──────────────┐
     │              │              │
     ▼              ▼              ▼
 Navegador       Node.js          Bun
     │              │
     ▼              ▼
 APIs Web       APIs Node

El código que escribes es JavaScript.

Lo que cambia son las herramientas disponibles.

Una analogía

Imagina que sabes conducir.

Ese conocimiento es el mismo.

Pero no es igual conducir:

un coche,
una moto,
un camión.

El conductor eres tú.

El vehículo cambia.

Con JavaScript ocurre exactamente igual.

2. El navegador

Un navegador está pensado para trabajar con páginas web.

Por eso ofrece herramientas relacionadas con ellas.

Manipular HTML
document.querySelector("h1");
Modificar estilos
document.body.style.background = "black";
Almacenamiento
localStorage.setItem("usuario", "Antonio");
Cookies
document.cookie
Historial
history.back();
Geolocalización
navigator.geolocation
Cámara
navigator.mediaDevices
Drag & Drop
document.addEventListener(...)
Canvas
canvas.getContext("2d");
WebSocket
new WebSocket(...)

Todo esto existe porque un navegador trabaja con una interfaz gráfica.

3. Node.js

Node no tiene una página web.

Por tanto:

No existe

document

No existe

window

No existe

localStorage

Porque no tendría sentido.

En cambio dispone de otras APIs.

Sistema de archivos
import fs from "node:fs";

Leer archivos.

Crear archivos.

Eliminar archivos.

Sistema operativo
import os from "node:os";

Conocer:

CPU
RAM
Usuarios
Plataforma
Rutas
import path from "node:path";

Construir rutas compatibles entre Windows, Linux y macOS.

Variables de entorno
process.env
Procesos
process
HTTP
import http from "node:http";

Crear servidores.

Streams
import stream from "node:stream";

Procesar grandes cantidades de datos.

Comparativa
Navegador	Node.js
document	fs
window	process
localStorage	path
navigator	os
history	http
Canvas	streams
DOM	sistema operativo
4. APIs compartidas

Algunas APIs existen en ambos.

Por ejemplo:

Console
console.log()
JSON
JSON.parse()
Promise
Promise.resolve()
Array
const numeros = [1,2,3];
Math
Math.random()
Date
new Date()
Fetch

Hace unos años esto era exclusivo del navegador.

Hoy en día, Node.js moderno también incorpora fetch() de forma nativa.

Por eso este código funciona tanto en el navegador como en versiones recientes de Node.js:

const respuesta = await fetch("https://api.example.com");

const datos = await respuesta.json();
5. ¿Por qué React necesita ambos?

Aquí está la gran pregunta.

Cuando desarrollas una aplicación React intervienen dos entornos distintos.

Durante el desarrollo

Trabajas con:

VS Code

↓

Node.js

↓

Vite

↓

React

Node ejecuta:

Vite
ESLint
TypeScript
Babel
npm
pnpm

Todo esto ocurre fuera del navegador.

Cuando el usuario abre la web

Solo existe:

Usuario

↓

Google Chrome

↓

React

↓

DOM

Node.js ya no participa.

El navegador descarga los archivos generados durante el proceso de compilación y ejecuta el JavaScript resultante.

Ejemplo real

Supongamos este proyecto.

mi-app/

src/

public/

package.json

Cuando ejecutas:

pnpm dev

Sucede esto:

Terminal

↓

Node.js

↓

Vite

↓

Compila React

↓

Levanta un servidor local

↓

http://localhost:5173

Después abres esa dirección.

Ahora el navegador descarga:

HTML

↓

CSS

↓

JavaScript

↓

React

A partir de ese momento, React vive en el navegador.

Error muy común

Muchos principiantes intentan hacer esto dentro de un componente React:

import fs from "node:fs";

Y obtienen un error.

¿Por qué?

Porque ese componente se ejecuta en el navegador.

El navegador no puede acceder directamente a tu disco duro por motivos de seguridad.

Si una aplicación web pudiera leer cualquier archivo de tu ordenador, sería un enorme riesgo.

Entonces, ¿cómo lee React un archivo?

React no lo hace directamente.

Normalmente el flujo es:

React

↓

Petición HTTP

↓

Servidor (Node, FastAPI...)

↓

Lee archivo

↓

Devuelve datos

↓

React muestra los datos

React solicita la información a un servidor, y es el servidor quien tiene permisos para acceder al sistema de archivos.

¿Y React Native?

Aquí aparece un tercer entorno.

JavaScript

↓

React Native

↓

Android

o

iOS

React Native no trabaja con el DOM.

En su lugar, comunica el código JavaScript con componentes nativos del sistema operativo mediante un puente (bridge) o, en las versiones más recientes, mediante la nueva arquitectura basada en JSI y Fabric.

Por eso tampoco existen objetos como:

document

ni

window.document
Conceptos clave
JavaScript es el mismo lenguaje en todos los entornos.
El navegador ofrece APIs relacionadas con la web y el DOM.
Node.js ofrece APIs relacionadas con el sistema operativo y el servidor.
React se desarrolla con Node.js, pero se ejecuta principalmente en el navegador.
React Native se ejecuta sobre Android o iOS y dispone de un conjunto diferente de APIs.

Casos de uso de Node.js

Objetivo

Conocer los principales usos de Node.js en el desarrollo moderno, cuándo es una buena elección y cuándo conviene utilizar otras tecnologías.

Índice
¿Por qué Node.js tuvo tanto éxito?
Desarrollo Frontend
Desarrollo Backend
APIs REST
Aplicaciones en tiempo real
Microservicios
Automatización
Herramientas de desarrollo
Server Side Rendering (SSR)
¿Cuándo NO usar Node.js?
Casos reales de empresas
Resumen
Ejercicios
1. ¿Por qué Node.js tuvo tanto éxito?

Antes de Node.js era habitual encontrar esta situación:

Frontend
│
└── JavaScript

Backend
│
├── Java
├── PHP
├── Python
└── C#

Esto implicaba:

Dos lenguajes.
Dos equipos especializados.
Mayor tiempo de desarrollo.
Mayor coste de mantenimiento.

Con Node.js apareció la posibilidad de utilizar JavaScript en ambos lados.

Frontend
│
└── JavaScript

Backend
│
└── JavaScript (Node.js)

Esto facilitó el trabajo de muchos equipos, aunque no significa que JavaScript sea siempre la mejor opción para el backend.

2. Desarrollo Frontend

Aunque parezca curioso, el uso más común de Node.js para un desarrollador frontend no es crear servidores, sino ejecutar herramientas.

Cuando escribes:

pnpm dev

ocurre algo parecido a esto:

Terminal
      │
      ▼
Node.js
      │
      ▼
Vite
      │
      ▼
Compila React
      │
      ▼
Servidor de desarrollo
      │
      ▼
http://localhost:5173

Node.js también ejecuta:

Vite
Webpack
Babel
TypeScript
ESLint
Prettier
Vitest
Jest

Sin Node.js, el desarrollo moderno con React sería muy diferente.

3. Desarrollo Backend

Uno de los usos más conocidos.

Con Node.js puedes crear servidores web.

Ejemplo:

import http from "node:http";

const server = http.createServer((req, res) => {
    res.end("Hola Mundo");
});

server.listen(3000);

En proyectos reales suele utilizarse un framework como:

Express
Fastify
NestJS
Hono

Estos frameworks simplifican la creación de APIs y aplicaciones web.

4. APIs REST

Imagina una aplicación React.

Cuando el usuario inicia sesión:

React

↓

POST /login

↓

Servidor Node

↓

Base de datos

↓

Respuesta JSON

↓

React

Node.js es muy utilizado para desarrollar este tipo de APIs porque maneja muy bien operaciones de entrada/salida (I/O).

5. Aplicaciones en tiempo real

Aquí es donde Node.js destaca especialmente.

Ejemplos:

Chats.
Videojuegos online.
Notificaciones.
Colaboración en tiempo real.
Edición compartida de documentos.
Sistemas de seguimiento en directo.

Ejemplo de un chat:

Usuario A

↓

Servidor Node

↓

Usuario B

Gracias a tecnologías como WebSockets, el servidor puede enviar información a los clientes sin que estos tengan que preguntar constantemente.

6. Microservicios

En lugar de tener una única aplicación enorme, muchas empresas dividen el sistema en pequeños servicios independientes.

Por ejemplo:

                API Gateway
                     │
 ┌──────────┬──────────┬──────────┐
 ▼          ▼          ▼          ▼
Usuarios   Pagos     Pedidos   Notificaciones

Cada servicio puede estar desarrollado con una tecnología distinta.

Node.js es una opción frecuente para servicios que realizan muchas operaciones de red.

7. Automatización

Node.js también se utiliza para crear scripts.

Por ejemplo:

Renombrar miles de archivos.
Generar documentación.
Convertir imágenes.
Leer archivos CSV.
Enviar correos automáticamente.
Generar informes.

Ejemplo:

Script Node

↓

Lee carpeta

↓

Procesa imágenes

↓

Guarda resultados
8. Herramientas de desarrollo

Muchísimas herramientas que utilizas diariamente están escritas en Node.js.

Algunos ejemplos:

Vite
ESLint
Prettier
TypeScript Compiler (tsc)
npm
pnpm
Yarn

Cuando ejecutas:

pnpm lint

o

pnpm build

es Node.js quien ejecuta esas herramientas.

9. Server Side Rendering (SSR)

React puede renderizarse de dos formas.

Renderizado en el navegador (CSR)
Navegador

↓

Descarga JavaScript

↓

React genera el HTML
Renderizado en el servidor (SSR)
Cliente

↓

Servidor Node.js

↓

Genera HTML

↓

Envía HTML al navegador

↓

React se hidrata

Este enfoque ofrece ventajas como:

Mejor SEO.
Primera carga más rápida.
Mejor experiencia en conexiones lentas.

Frameworks como Next.js utilizan Node.js para realizar este tipo de renderizado.

10. ¿Cuándo NO usar Node.js?

Aunque es una herramienta muy potente, no siempre es la mejor elección.

No suele ser la opción ideal para:

Cálculos intensivos

Ejemplo:

Simulaciones científicas.
Procesamiento matemático complejo.
Modelos físicos.

¿Por qué?

Porque esas tareas pueden bloquear el hilo principal.

Procesamiento de vídeo

Ejemplos:

Edición de vídeo.
Conversión de formatos.
Renderizado 3D.

Suelen utilizarse herramientas especializadas o lenguajes como C++ o Rust para estas tareas.

Inteligencia Artificial

Aunque puedes consumir modelos de IA desde Node.js, el entrenamiento y la mayoría de bibliotecas de ciencia de datos están más desarrollados en Python.

11. Casos reales

Piensa en una aplicación como una plataforma de streaming.

React

↓

API Node.js

↓

Base de datos

↓

Servicio de autenticación

↓

Servicio de pagos

↓

Servicio de recomendaciones

↓

Almacenamiento de vídeos

Node.js puede encargarse de:

API.
Autenticación.
Notificaciones.
Comunicación en tiempo real.

Mientras que otros servicios especializados realizan tareas más exigentes.

¿Qué usarás tú como desarrollador Frontend?

En tu día a día utilizarás Node.js para:

Crear proyectos con React.
Instalar dependencias.
Ejecutar Vite.
Lanzar el servidor de desarrollo.
Compilar la aplicación.
Ejecutar pruebas.
Ejecutar ESLint y Prettier.
Automatizar tareas.

Si más adelante desarrollas backend con Node.js, ya tendrás una base sólida para trabajar con frameworks como Express o NestJS.

Conceptos clave
Node.js se utiliza mucho más que para crear servidores.
Es una pieza esencial del ecosistema moderno de JavaScript.
Destaca en aplicaciones con muchas operaciones de entrada/salida y tiempo real.
Es el motor que permite ejecutar herramientas de desarrollo como Vite o TypeScript.
No es la mejor opción para todas las cargas de trabajo; conocer sus fortalezas y limitaciones es parte de elegir la tecnología adecuada.