# Unidad 06 — Node.js vs Navegador

## Objetivos

- Comprender que JavaScript es el mismo lenguaje en distintos entornos de ejecución.
- Conocer las APIs que ofrece el navegador y las que ofrece Node.js.
- Entender por qué React necesita ambos entornos durante su ciclo de vida.
- Evitar el error clásico de usar APIs de un entorno en el otro.

## Requisitos

- Unidad 01–05: conceptos básicos de JavaScript (variables, funciones, módulos).
- Saber qué es un archivo HTML y cómo se carga en un navegador.
- Tener Node.js instalado y haber ejecutado algún comando en la terminal.

## Índice

1. El mismo lenguaje, distintos entornos
2. APIs del navegador
3. APIs de Node.js
4. APIs compartidas
5. ¿Por qué React necesita ambos?
6. Casos prácticos
7. Buenas prácticas
8. Conceptos clave
9. Ejercicios

## 1. El mismo lenguaje, distintos entornos

Uno de los errores más comunes es pensar que:

> JavaScript = Navegador

No. JavaScript es solo un lenguaje. Puede ejecutarse en muchos entornos diferentes:

```text
              JavaScript
                    │
     ┌──────────────┼──────────────┐
     │              │              │
     ▼              ▼              ▼
 Navegador       Node.js          Bun
     │              │              │
     ▼              ▼              ▼
 APIs Web       APIs Node      APIs Node
```

**¿Qué significa esto?** El código que escribes es JavaScript (las mismas reglas de sintaxis). Lo que cambia son las herramientas (APIs) disponibles alrededor: qué objetos globales existen, a qué recursos del sistema puedes acceder.

**¿Por qué importa?** Si no distingues los entornos, escribes código que funciona en uno y falla en el otro. Es la causa número uno de errores en principiantes (`document is not defined`, `fs is not defined`, etc.).

### Una analogía

Imagina que sabes conducir. Ese conocimiento es el mismo. Pero no es igual conducir un coche, una moto o un camión. El conductor eres tú; el vehículo cambia. Con JavaScript ocurre exactamente igual: tú escribes el código y el "vehículo" (navegador, Node.js, Bun) cambia.

**Error típico:** instalar un paquete pensando que "es JavaScript y funciona en todas partes", cuando en realidad depende de APIs de un entorno concreto.

## 2. APIs del navegador

Un navegador está pensado para trabajar con páginas web. Por eso ofrece herramientas relacionadas con ellas (interfaz gráfica, documentos, red del usuario).

| Función | Ejemplo de API |
| --- | --- |
| Manipular HTML | `document.querySelector("h1")` |
| Modificar estilos | `document.body.style.background = "black"` |
| Almacenamiento | `localStorage.setItem("usuario", "Antonio")` |
| Cookies | `document.cookie` |
| Historial | `history.back()` |
| Geolocalización | `navigator.geolocation` |
| Cámara | `navigator.mediaDevices` |
| Drag & Drop | `document.addEventListener(...)` |
| Canvas | `canvas.getContext("2d")` |
| WebSocket | `new WebSocket(...)` |

**¿Por qué existen?** Todo esto existe porque un navegador trabaja con una interfaz gráfica: necesita mostrar documentos HTML, recordar datos del usuario, acceder al hardware del equipo (cámara, GPS) y comunicarse con servidores.

**Error típico:** llamar a `document.querySelector(...)` en un script de Node.js y recibir `ReferenceError: document is not defined`, porque en Node no hay página web ni DOM.

## 3. Node.js

Node no tiene una página web. Por tanto:

- **No existe** `document`
- **No existe** `window`
- **No existe** `localStorage`

**¿Por qué?** Porque no tendría sentido: no hay una interfaz gráfica que manipular ni un historial de navegador que recordar. En cambio, Node.js dispone de otras APIs enfocadas al sistema y al servidor.

### Sistema de archivos

```javascript
import fs from "node:fs";
```

Permite leer, crear y eliminar archivos. Es la API que el navegador **nunca** dará a una web por seguridad.

### Sistema operativo

```javascript
import os from "node:os";
```

Permite conocer CPU, RAM, usuarios y plataforma del equipo donde corre el script.

### Rutas

```javascript
import path from "node:path";
```

Construye rutas compatibles entre Windows, Linux y macOS. Evita errores por usar `/` o `\` de forma incorrecta.

### Variables de entorno

```javascript
process.env;
```

Guarda configuración sensible (claves, URLs de bases de datos) fuera del código fuente.

### Procesos

```javascript
process;
```

Da acceso al proceso actual: argumentos de la terminal, salida por consola, cierre del programa.

### HTTP

```javascript
import http from "node:http";
```

Crea servidores web. Es la base de APIs REST y backends en Node.js.

### Streams

```javascript
import stream from "node:stream";
```

Procesa grandes cantidades de datos poco a poco, sin cargarlos todos en memoria a la vez.

### Comparativa

| Navegador | Node.js |
| --- | --- |
| `document` | `fs` |
| `window` | `process` |
| `localStorage` | `path` |
| `navigator` | `os` |
| `history` | `http` |
| Canvas | Streams |
| DOM | Sistema operativo |

**¿Por qué importa esta tabla?** Cada celda representa lo que el entorno "sabe hacer". Elegir la columna equivocada es elegir la API equivocada.

**Error típico:** copiar un script de Node que usa `fs` y pegarlo en el navegador, o viceversa. La solución habitual es pedir los datos por HTTP (ver sección 5).

## 4. APIs compartidas

Algunas APIs existen en ambos entornos porque forman parte del propio lenguaje o de estándares comunes:

| API | Ejemplo |
| --- | --- |
| Console | `console.log()` |
| JSON | `JSON.parse()` |
| Promise | `Promise.resolve()` |
| Array | `const numeros = [1,2,3]` |
| Math | `Math.random()` |
| Date | `new Date()` |

### Fetch

Hace unos años `fetch` era exclusivo del navegador. Hoy en día, Node.js moderno también incorpora `fetch()` de forma nativa. Por eso este código funciona tanto en el navegador como en versiones recientes de Node.js:

```javascript
const respuesta = await fetch("https://api.example.com");

const datos = await respuesta.json();
```

**Error típico:** en Node versions antiguas (anteriores a la 18), `fetch` no existe y hay que instalar un paquete como `node-fetch`. Si te aparece `fetch is not defined`, primero comprueba tu versión de Node con `node -v`.

## 5. ¿Por qué React necesita ambos?

Aquí está la gran pregunta. Cuando desarrollas una aplicación React intervienen dos entornos distintos.

### Durante el desarrollo

Trabajas con este flujo:

```text
VS Code
   ↓
Node.js
   ↓
  Vite
   ↓
 React
```

Node.js ejecuta:

- Vite
- ESLint
- TypeScript
- Babel
- npm
- pnpm

Todo esto ocurre **fuera del navegador**, en tu equipo, en la terminal.

### Cuando el usuario abre la web

Solo existe este flujo:

```text
  Usuario
     ↓
Google Chrome
     ↓
   React
     ↓
    DOM
```

Node.js ya no participa. El navegador descarga los archivos generados durante el proceso de compilación y ejecuta el JavaScript resultante.

### Ejemplo real

Supongamos este proyecto:

```text
mi-app/
├── src/
├── public/
└── package.json
```

Cuando ejecutas:

```bash
pnpm dev
```

Sucede esto:

```text
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
```

Después abres esa dirección. Ahora el navegador descarga:

```text
HTML
 ↓
CSS
 ↓
JavaScript
 ↓
React
```

A partir de ese momento, React vive en el navegador.

### Error muy común

Muchos principiantes intentan hacer esto dentro de un componente React:

```javascript
import fs from "node:fs";
```

Y obtienen un error. ¿Por qué? Porque ese componente se ejecuta en el navegador. El navegador no puede acceder directamente a tu disco duro por motivos de seguridad: si una aplicación web pudiera leer cualquier archivo de tu ordenador, sería un enorme riesgo.

**Entonces, ¿cómo lee React un archivo?** React no lo hace directamente. Normalmente el flujo es:

```text
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
```

React solicita la información a un servidor, y es el servidor quien tiene permisos para acceder al sistema de archivos.

### ¿Y React Native?

Aquí aparece un tercer entorno:

```text
JavaScript
    ↓
React Native
    ↓
Android
  o
  iOS
```

React Native no trabaja con el DOM. En su lugar, comunica el código JavaScript con componentes nativos del sistema operativo mediante un puente (bridge) o, en las versiones más recientes, mediante la nueva arquitectura basada en JSI y Fabric.

Por eso tampoco existen objetos como `document` ni `window.document`.

**Error típico:** intentar maquetar una app móvil con `document.createElement(...)`. En React Native se usan componentes como `<View>` y `<Text>`, que el sistema operativo convierte en controles reales.

## 6. Casos prácticos

- **Quieres leer un archivo de configuración en desarrollo:** usa Node.js (por ejemplo en un script de Vite o en el backend), nunca en el componente de React.
- **Quieres guardar datos del usuario en el navegador:** usa `localStorage`.
- **Quieres guardar datos de forma segura:** usa un servidor con Node.js y una base de datos.
- **Quieres animar algo en pantalla:** usa el DOM y Canvas del navegador.

## 7. Buenas prácticas

- Antes de usar una API, pregúntate: *¿en qué entorno se ejecuta este código?*
- No importes módulos de Node (`node:fs`, `node:path`) dentro de componentes React para el navegador.
- Cuando el navegador necesite datos, pídelos por HTTP a un backend.
- Recuerda que React Native es un entorno distinto: no tiene DOM ni APIs web clásicas.
- Usa APIs compartidas (`console`, `JSON`, `fetch`) con confianza: funcionan en casi todos los entornos modernos.

## Conceptos clave

- JavaScript es el mismo lenguaje en todos los entornos; lo que cambian son las APIs disponibles.
- El navegador ofrece APIs relacionadas con la web y el DOM (`document`, `localStorage`, `history`...).
- Node.js ofrece APIs relacionadas con el sistema operativo y el servidor (`fs`, `path`, `os`, `http`, `process`).
- APIs como `console`, `JSON`, `Promise`, `Array` y `fetch` (modernas) están disponibles en ambos entornos.
- React se desarrolla con Node.js, pero se ejecuta principalmente en el navegador.
- Un componente React no puede usar `fs` porque el navegador no tiene acceso directo al disco: los datos llegan por HTTP desde un servidor.
- React Native se ejecuta sobre Android o iOS y dispone de un conjunto diferente de APIs, sin DOM.

## Ejercicios

1. Abre la consola del navegador y escribe `typeof document`. Ahora escribe `node -v` en la terminal y ejecuta `node -e "console.log(typeof document)"`. ¿Por qué los resultados difieren?
2. Crea un script `saludo.js` con `console.log("Hola")` y ejecútalo con `node saludo.js`. Después intenta ejecutar `import fs from "node:fs"` en la consola del navegador y anota el error.
3. Dibuja en papel el flujo completo de `pnpm dev`: desde la terminal hasta que React se ejecuta en el navegador.
4. Enumera 5 APIs del navegador y 5 de Node.js que no existan en el otro entorno.
