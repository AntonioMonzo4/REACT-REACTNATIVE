¿Qué es un Runtime?

Un Runtime Environment (entorno de ejecución) es el software encargado de proporcionar todo lo necesario para que un programa pueda ejecutarse.

Un runtime se ocupa de tareas como:

Leer tu código.
Interpretarlo o compilarlo.
Gestionar la memoria.
Manejar errores.
Acceder al sistema operativo.
Proporcionar funciones ya preparadas (APIs).

Podemos imaginarlo como un traductor e intermediario entre tu programa y el sistema operativo.

Tu código JavaScript
          │
          ▼
      Runtime
          │
          ▼
Sistema Operativo
          │
          ▼
Hardware
Una analogía: el traductor

Imagina que tú solo hablas español y otra persona solo habla japonés.

No podéis comunicaros directamente.

Necesitáis un traductor.

Tú (Español)
       │
       ▼
   Traductor
       │
       ▼
Persona japonesa

Con JavaScript ocurre algo parecido.

JavaScript
      │
      ▼
 Runtime
      │
      ▼
Sistema Operativo

El runtime hace posible que ambos "hablen el mismo idioma".

JavaScript no sabe hacer casi nada por sí solo

Imagina que existiera únicamente el lenguaje JavaScript, sin navegador y sin Node.js.

¿Qué podrías hacer?

Podrías:

declarar variables,
usar funciones,
crear objetos,
escribir bucles,
realizar operaciones matemáticas.

Pero no podrías:

imprimir por pantalla,
acceder a Internet,
leer archivos,
crear un servidor,
usar temporizadores.

Por ejemplo:

console.log("Hola");

¿Quién ha creado console?

No JavaScript.

Es el runtime quien proporciona ese objeto.

Lo mismo ocurre con:

setTimeout(() => {}, 1000);

¿Quién crea setTimeout?

No el lenguaje JavaScript.

Lo proporciona el runtime.

Cada runtime ofrece herramientas distintas

Aquí aparece una idea fundamental.

El lenguaje JavaScript es el mismo.

Lo que cambia es el entorno donde se ejecuta.

En el navegador

Dispones de objetos como:

window
document
localStorage
fetch
navigator
history

¿Por qué?

Porque el navegador los proporciona.

Puedes hacer cosas como:

document.getElementById("titulo");

Pero eso solo funciona en un navegador.

En Node.js

No existe document.

document.getElementById("titulo");

Resultado:

ReferenceError: document is not defined

¿Por qué?

Porque Node.js no tiene una página web que manipular.

En cambio, Node ofrece otras herramientas:

fs
http
path
os
process

Por ejemplo:

import fs from "node:fs";

const contenido = fs.readFileSync("archivo.txt", "utf8");
console.log(contenido);

Esto sería imposible dentro del navegador por motivos de seguridad.

El lenguaje es el mismo

Observa este código:

const suma = (a, b) => a + b;

console.log(suma(4, 7));

Funciona en:

Google Chrome
Firefox
Edge
Node.js
Deno
Bun

¿Por qué?

Porque pertenece al lenguaje JavaScript.

Ahora mira este otro:

document.body.style.background = "red";

Solo funciona en el navegador.

Y este:

import fs from "node:fs";

Solo funciona en Node.js.

Entonces... ¿qué aporta Node.js?

Node.js añade capacidades que JavaScript, por sí solo, no tiene.

Entre ellas:

Sistema de archivos (fs).
Creación de servidores HTTP.
Acceso al sistema operativo.
Gestión de procesos.
Variables de entorno.
Instalación y ejecución de herramientas como Vite, ESLint o TypeScript.

Sin Node.js, no podrías ejecutar estas herramientas desde la terminal.

Resumen visual
                 JavaScript
                      │
        ┌─────────────┴─────────────┐
        │                           │
        ▼                           ▼
 Navegador                     Node.js
        │                           │
 document                    fs
 window                      http
 localStorage                path
 fetch                       process
 navigator                   os

La sintaxis del lenguaje es la misma. Lo que cambia son las APIs que el runtime pone a tu disposición.

Conceptos clave
JavaScript es el lenguaje.
Node.js es un runtime para ejecutar JavaScript fuera del navegador.
Un runtime actúa como intermediario entre tu código y el sistema operativo.
El navegador también es un runtime para JavaScript.
El lenguaje no cambia; cambian las APIs disponibles.