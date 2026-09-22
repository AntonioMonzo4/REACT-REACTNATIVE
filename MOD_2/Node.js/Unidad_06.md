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

