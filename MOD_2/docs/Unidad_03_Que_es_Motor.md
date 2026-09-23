# Unidad 03 — ¿Qué es un Motor?

## Objetivos

- Entender qué hace un motor de JavaScript y por qué es imprescindible.
- Conocer la historia: cómo era JavaScript antes de V8 y qué cambió con él.
- Comprender el flujo interno de V8: Parser → AST → Ignition → TurboFan.
- Saber qué significa JIT (Just-In-Time Compilation).
- Aclarar la diferencia entre **Node.js** y **V8** (no son lo mismo).

## Requisitos

- Haber leído la Unidad 02 (¿Qué es un Runtime?).

---

## ¿Qué es un motor de JavaScript?

Un motor de JavaScript es un programa cuyo trabajo consiste en:

- Leer código JavaScript.
- Analizarlo.
- Optimizarlo.
- Convertirlo en instrucciones que entiende la CPU.
- Ejecutarlo.

Podemos verlo así:

```text
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
```

El motor es quien realmente **"da vida"** a nuestro código. Sin él, tu archivo `.js` sería simplemente un texto que nadie entiende.

> **¿Qué significa "código máquina"?** Son las instrucciones binarias que el procesador (CPU) de tu ordenador entiende directamente: sumar, comparar, mover datos de un sitio a otro. Ningún lenguaje de alto nivel (JavaScript, Python, Java...) habla así; por eso necesitamos un motor que haga de traductor.

---

## Antes de V8

Antes de 2008, la mayoría de navegadores utilizaban motores que **interpretan** JavaScript línea por línea.

Por ejemplo:

```javascript
const a = 5;
const b = 8;
console.log(a + b);
```

El motor hacía algo parecido a:

1. Leer la primera línea.
2. Ejecutarla.
3. Leer la segunda.
4. Ejecutarla.
5. Leer la tercera.
6. Ejecutarla.

Este proceso era sencillo, pero no muy rápido. Era como leer un recetario y cocinar plato por plato sin nunca memorizar nada: cada vez que repetías un plato, volvías a mirar la receta entera.

---

## El nacimiento de V8

En 2008, Google lanzó su navegador **Google Chrome**. Necesitaba un motor mucho más rápido que los existentes. Así nació **V8**.

Su principal innovación fue que **no interpreta continuamente el código**, sino que lo compila dinámicamente a código máquina utilizando una técnica llamada **JIT (Just-In-Time Compilation)**.

En lugar de ejecutar el código línea por línea, V8 intenta convertir las partes más utilizadas del programa en instrucciones optimizadas para la CPU.

Resultado:

- Menor tiempo de ejecución.
- Menor consumo de recursos.
- Mejor rendimiento.

---

## ¿Cómo funciona V8?

De forma simplificada, el proceso es el siguiente:

```text
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
```

No necesitas memorizar todos estos nombres, pero sí entender el flujo general.

### Paso 1: Parser

El parser comprueba que el código sea **válido**.

Por ejemplo, esto es correcto:

```javascript
const nombre = "Antonio";
```

Pero esto:

```javascript
const = nombre;
```

Genera un **error de sintaxis** antes de ejecutarse.

> **¿Qué significa esto?** Que el parser actúa como un revisor ortográfico: si la frase no está bien construida, ni siquiera intenta leerla con sentido. Por eso ves errores de sintaxis "antes" de que pase nada en tu programa.

### Paso 2: AST (Abstract Syntax Tree)

El código se convierte en un **árbol** que representa su estructura.

Por ejemplo:

```javascript
const suma = a + b;
```

Se representa internamente como algo parecido a:

```text
Asignación
├── Variable: suma
└── Operación
      ├── a
      └── b
```

Este árbol facilita el análisis y la optimización.

### Paso 3: Ignition

**Ignition** convierte el AST en **bytecode**.

El bytecode es un lenguaje intermedio, más cercano a la máquina que JavaScript, pero aún independiente del procesador.

Esto permite ejecutar el programa rápidamente sin compilar todo desde el principio.

> **Analogía:** el bytecode es como unas notas rápidas: no es el discurso final (código máquina), pero te deja empezar a hablar sin perder tiempo escribiendo el guion completo.

### Paso 4: TurboFan

Mientras el programa se ejecuta, V8 **observa** qué partes del código se usan con más frecuencia.

Por ejemplo:

```javascript
for (let i = 0; i < 1_000_000; i++) {
    suma();
}
```

Como `suma()` se ejecuta muchas veces, **TurboFan** la optimiza y la convierte en código máquina altamente eficiente.

Esta optimización ocurre **durante la ejecución del programa**.

---

## ¿Qué significa JIT?

JIT significa **Just-In-Time Compilation** (compilación "justo a tiempo").

La idea es sencilla:

- No compilar absolutamente todo desde el principio.
- Ejecutar el programa rápidamente.
- Optimizar solo las partes que realmente importan.

Es un **equilibrio entre velocidad de inicio y rendimiento**.

> **Errores comunes:**
> - Creer que JavaScript es "puro intérprete". Desde V8, gran parte del código acaba compilado a código máquina.
> - Creer que JIT compila todo el archivo antes de ejecutar. No: empieza rápido y optimiza sobre la marcha lo que detecta que se repite.

---

## ¿Qué aporta Node.js además de V8?

Aquí hay un detalle muy importante.

Muchas personas piensan que:

```text
Node.js = V8
```

**Pero no es cierto.** V8 es solo una parte de Node.js.

Node.js añade muchas funcionalidades que V8 no tiene:

- Sistema de archivos (`fs`).
- Servidores HTTP (`http`).
- Variables de entorno (`process.env`).
- Gestión de procesos.
- Temporizadores.
- Red.
- APIs del sistema operativo.

Podemos verlo así:

```text
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
```

- **V8** ejecuta JavaScript.
- **Node.js** construye un entorno completo alrededor de V8.

### Tabla: V8 vs Node.js

| Capacidad                        | ¿La tiene V8? | ¿La tiene Node.js? |
| -------------------------------- | ------------- | ------------------- |
| Ejecutar JavaScript              | Sí            | Sí (gracias a V8)   |
| Compilar con JIT                 | Sí            | Sí (gracias a V8)   |
| Leer/escribir archivos (`fs`)    | No            | Sí                  |
| Crear servidores (`http`)        | No            | Sí                  |
| Variables de entorno (`process`) | No            | Sí                  |
| Temporizadores (`setTimeout`)    | No            | Sí                  |

---

## ¿Por qué es importante para React?

Cuando ejecutas un comando como:

```bash
pnpm dev
```

o

```bash
npm run dev
```

**No es React quien interpreta tu código.** Ocurre algo parecido a esto:

```text
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
```

Gracias a esta cadena de herramientas puedes escribir **JSX**, **TypeScript** o usar **módulos modernos** sin preocuparte por la compatibilidad del navegador: Vite (con Node y V8 detrás) se encarga de traducirlo.

---

## Curiosidades

- V8 está desarrollado principalmente en **C++**.
- También es utilizado por otros proyectos, aunque no todos los runtimes usan V8 (por ejemplo, algunos emplean otros motores; Safari usa JavaScriptCore, Firefox usa SpiderMonkey).
- Es uno de los motores de JavaScript más rápidos y optimizados del mundo.

---

## Conceptos clave

- **V8** es el motor que ejecuta JavaScript.
- **Node.js utiliza V8** para ejecutar tu código.
- V8 convierte JavaScript en código máquina mediante **compilación JIT**.
- El flujo interno de V8 es: **Parser → AST → Ignition (bytecode) → TurboFan (código máquina) → CPU**.
- **Node.js no es solo V8**; añade APIs para trabajar con archivos, red, procesos y mucho más.
- Herramientas como **Vite, TypeScript o ESLint** se ejecutan gracias a Node.js, que a su vez utiliza V8.
