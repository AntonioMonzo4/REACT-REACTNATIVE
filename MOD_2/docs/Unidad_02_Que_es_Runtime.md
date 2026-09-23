# Unidad 02 — ¿Qué es un Runtime?

## Objetivos

- Entender qué es un Runtime Environment y por qué tu código no puede ejecutarse "solo".
- Saber qué tareas realiza un runtime (leer código, gestionar memoria, manejar errores, etc.).
- Distinguir el lenguaje JavaScript del entorno donde se ejecuta (navegador, Node.js, Deno, Bun...).
- Reconocer qué objetos (`console`, `document`, `fs`...) los aporta cada runtime y no el lenguaje.
- Comprender qué añade Node.js con respecto al JavaScript "puro".

## Requisitos

- Haber leído la Unidad 01 (introducción al curso y a JavaScript).

---

## ¿Qué es un Runtime?

Un **Runtime Environment** (entorno de ejecución) es el software encargado de proporcionar todo lo necesario para que un programa pueda ejecutarse.

**¿Qué significa esto en la práctica?** Que tu archivo `.js` por sí solo es solo texto. Alguien tiene que leerlo, entenderlo, ejecutarlo y conectarlo con el ordenador. Ese "alguien" es el runtime.

Un runtime se ocupa de tareas como:

- Leer tu código.
- Interpretarlo o compilarlo.
- Gestionar la memoria.
- Manejar errores.
- Acceder al sistema operativo.
- Proporcionar funciones ya preparadas (APIs).

Podemos imaginarlo como un **traductor e intermediario** entre tu programa y el sistema operativo.

```text
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
```

### Una analogía: el traductor

Imagina que tú solo hablas español y otra persona solo habla japonés.

No podéis comunicaros directamente. Necesitáis un traductor.

```text
Tú (Español)
       │
       ▼
   Traductor
       │
       ▼
Persona japonesa
```

Con JavaScript ocurre algo parecido:

```text
JavaScript
      │
      ▼
 Runtime
      │
      ▼
Sistema Operativo
```

El runtime hace posible que ambos "hablen el mismo idioma".

---

## JavaScript no sabe hacer casi nada por sí solo

Imagina que existiera únicamente el lenguaje JavaScript, sin navegador y sin Node.js.

**¿Qué podrías hacer?**

Podrías:

- Declarar variables.
- Usar funciones.
- Crear objetos.
- Escribir bucles.
- Realizar operaciones matemáticas.

**Pero no podrías:**

- Imprimir por pantalla.
- Acceder a Internet.
- Leer archivos.
- Crear un servidor.
- Usar temporizadores.

### Ejemplo: `console`

```javascript
console.log("Hola");
```

**¿Quién ha creado `console`?**

No JavaScript. Es el **runtime** quien proporciona ese objeto.

### Ejemplo: `setTimeout`

```javascript
setTimeout(() => {}, 1000);
```

**¿Quién crea `setTimeout`?**

No el lenguaje JavaScript. Lo proporciona el runtime.

> **Errores comunes:**
> - Pensar que `console` o `setTimeout` "vienen de fábrica" en JavaScript. Vienen del runtime.
> - Copiar código de un tutorial de navegador y ejecutarlo en Node (o al revés) sin comprobar si las APIs existen en ese entorno. Ese es el error `... is not defined` más frecuente de todos.

---

## Cada runtime ofrece herramientas distintas

Aquí aparece una idea fundamental:

> **El lenguaje JavaScript es el mismo. Lo que cambia es el entorno donde se ejecuta.**

### En el navegador

Dispones de objetos como:

- `window`
- `document`
- `localStorage`
- `fetch`
- `navigator`
- `history`

**¿Por qué?** Porque el navegador los proporciona.

Puedes hacer cosas como:

```javascript
document.getElementById("titulo");
```

Pero eso **solo funciona en un navegador**.

### En Node.js

No existe `document`:

```javascript
document.getElementById("titulo");
```

Resultado:

```text
ReferenceError: document is not defined
```

**¿Por qué?** Porque Node.js no tiene una página web que manipular.

En cambio, Node ofrece otras herramientas:

- `fs`
- `http`
- `path`
- `os`
- `process`

Por ejemplo:

```javascript
import fs from "node:fs";

const contenido = fs.readFileSync("archivo.txt", "utf8");
console.log(contenido);
```

Esto sería **imposible dentro del navegador** por motivos de seguridad (el navegador no deja que cualquier script lea archivos de tu disco).

---

## El lenguaje es el mismo

Observa este código:

```javascript
const suma = (a, b) => a + b;

console.log(suma(4, 7));
```

Funciona en:

- Google Chrome
- Firefox
- Edge
- Node.js
- Deno
- Bun

**¿Por qué?** Porque pertenece al **lenguaje JavaScript**.

Ahora mira este otro:

```javascript
document.body.style.background = "red";
```

Solo funciona en el **navegador**.

Y este:

```javascript
import fs from "node:fs";
```

Solo funciona en **Node.js**.

---

## Entonces... ¿qué aporta Node.js?

Node.js añade capacidades que JavaScript, por sí solo, no tiene. Entre ellas:

- Sistema de archivos (`fs`).
- Creación de servidores HTTP.
- Acceso al sistema operativo.
- Gestión de procesos.
- Variables de entorno.
- Instalación y ejecución de herramientas como Vite, ESLint o TypeScript.

Sin Node.js, no podrías ejecutar estas herramientas desde la terminal.

> **Dato práctico:** cuando ejecutas `npm run dev` en un proyecto de React, estás usando Node.js para lanzar Vite. Sin Node, esos comandos ni existirían.

---

## Resumen visual

```text
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
```

La sintaxis del lenguaje es la misma. Lo que cambian son las **APIs** que el runtime pone a tu disposición.

### Tabla comparativa

| Característica            | Navegador              | Node.js                     |
| ------------------------- | ---------------------- | --------------------------- |
| `document`, `window`      | Sí                     | No                          |
| `fetch`                   | Sí                     | Sí (desde Node 18+)         |
| Leer archivos (`fs`)      | No (por seguridad)     | Sí                          |
| Crear servidores HTTP     | No (solo consumirlos)  | Sí                          |
| `process.env`             | No                     | Sí                          |
| Acceso directo al disco   | No                     | Sí                          |

---

## Conceptos clave

- JavaScript es el **lenguaje**.
- Node.js es un **runtime** para ejecutar JavaScript fuera del navegador.
- Un runtime actúa como **intermediario** entre tu código y el sistema operativo.
- El navegador también es un runtime para JavaScript.
- El lenguaje no cambia; cambian las **APIs disponibles**.
- `console`, `setTimeout`, `document` o `fs` los proporciona el runtime, no el lenguaje.
