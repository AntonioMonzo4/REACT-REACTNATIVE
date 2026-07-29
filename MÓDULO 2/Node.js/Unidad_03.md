¿Qué es un motor (Engine)?

Un motor de JavaScript es un programa cuyo trabajo consiste en:

Leer código JavaScript.
Analizarlo.
Optimizarlo.
Convertirlo en instrucciones que entiende la CPU.
Ejecutarlo.

Podemos verlo así:

Archivo JavaScript
        │
        ▼
 Motor JavaScript
        │
        ▼
 Código máquina
        │
        ▼
 Procesador (CPU)

El motor es quien realmente "da vida" a nuestro código.

Antes de V8

Antes de 2008, la mayoría de navegadores utilizaban motores que interpretan JavaScript línea por línea.

Por ejemplo:

const a = 5;
const b = 8;
console.log(a + b);

El motor hacía algo parecido a:

Leer la primera línea.
Ejecutarla.
Leer la segunda.
Ejecutarla.
Leer la tercera.
Ejecutarla.

Este proceso era sencillo, pero no muy rápido.

El nacimiento de V8

En 2008, Google lanzó su navegador Google Chrome.

Necesitaba un motor mucho más rápido que los existentes.

Así nació V8.

Su principal innovación fue que no interpreta continuamente el código, sino que lo compila dinámicamente a código máquina utilizando una técnica llamada JIT (Just-In-Time Compilation).

En lugar de ejecutar el código línea por línea, V8 intenta convertir las partes más utilizadas del programa en instrucciones optimizadas para la CPU.

Resultado:

Menor tiempo de ejecución.
Menor consumo de recursos.
Mejor rendimiento.
¿Cómo funciona V8?

De forma simplificada, el proceso es el siguiente:

Código JavaScript
        │
        ▼
 Parser
        │
        ▼
 Árbol de Sintaxis (AST)
        │
        ▼
 Ignition (Intérprete)
        │
        ▼
 Código Bytecode
        │
        ▼
 TurboFan (Optimizador)
        │
        ▼
 Código Máquina
        │
        ▼
 CPU

No necesitas memorizar todos estos nombres, pero sí entender el flujo general.

Paso 1. Parser

El parser comprueba que el código sea válido.

Por ejemplo:

const nombre = "Antonio";

Es correcto.

Pero esto:

const = nombre;

Genera un error de sintaxis antes de ejecutarse.

Paso 2. AST (Abstract Syntax Tree)

El código se convierte en un árbol que representa su estructura.

Por ejemplo:

const suma = a + b;

Se representa internamente como algo parecido a:

Asignación
├── Variable: suma
└── Operación
      ├── a
      └── b

Este árbol facilita el análisis y la optimización.

Paso 3. Ignition

Ignition convierte el AST en bytecode.

El bytecode es un lenguaje intermedio, más cercano a la máquina que JavaScript, pero aún independiente del procesador.

Esto permite ejecutar el programa rápidamente sin compilar todo desde el principio.

Paso 4. TurboFan

Mientras el programa se ejecuta, V8 observa qué partes del código se usan con más frecuencia.

Por ejemplo:

for (let i = 0; i < 1_000_000; i++) {
    suma();
}

Como suma() se ejecuta muchas veces, TurboFan la optimiza y la convierte en código máquina altamente eficiente.

Esta optimización ocurre durante la ejecución del programa.

¿Qué significa JIT?

JIT significa Just-In-Time Compilation.

La idea es sencilla:

No compilar absolutamente todo desde el principio.
Ejecutar el programa rápidamente.
Optimizar solo las partes que realmente importan.

Es un equilibrio entre velocidad de inicio y rendimiento.

¿Qué aporta Node.js además de V8?

Aquí hay un detalle muy importante.

Muchas personas piensan que:

Node.js = V8

Pero no es cierto.

V8 es solo una parte de Node.js.

Node.js añade muchas funcionalidades que V8 no tiene:

Sistema de archivos (fs).
Servidores HTTP (http).
Variables de entorno (process.env).
Gestión de procesos.
Temporizadores.
Red.
APIs del sistema operativo.

Podemos verlo así:

           Node.js
 ┌──────────────────────────────┐
 │                              │
 │  APIs de Node.js             │
 │                              │
 │  fs                          │
 │  http                        │
 │  path                        │
 │  os                          │
 │  process                     │
 │                              │
 │───────────────┐              │
 │               ▼              │
 │           Motor V8           │
 └───────────────┬──────────────┘
                 ▼
           Sistema Operativo

V8 ejecuta JavaScript.

Node.js construye un entorno completo alrededor de V8.

¿Por qué es importante para React?

Cuando ejecutas un comando como:

pnpm dev

o

npm run dev

No es React quien interpreta tu código.

Ocurre algo parecido a esto:

Terminal
     │
     ▼
Node.js
     │
     ▼
Vite
     │
     ▼
V8 ejecuta JavaScript
     │
     ▼
Se construye la aplicación React
     │
     ▼
El navegador recibe JavaScript optimizado

Gracias a esta cadena de herramientas puedes escribir JSX, TypeScript o usar módulos modernos sin preocuparte por la compatibilidad del navegador.

Curiosidades
V8 está desarrollado principalmente en C++.
También es utilizado por otros proyectos, aunque no todos los runtimes usan V8 (por ejemplo, algunos emplean otros motores).
Es uno de los motores de JavaScript más rápidos y optimizados del mundo.
Conceptos clave
V8 es el motor que ejecuta JavaScript.
Node.js utiliza V8 para ejecutar tu código.
V8 convierte JavaScript en código máquina mediante compilación JIT.
Node.js no es solo V8; añade APIs para trabajar con archivos, red, procesos y mucho más.
Herramientas como Vite, TypeScript o ESLint se ejecutan gracias a Node.js, que a su vez utiliza V8.