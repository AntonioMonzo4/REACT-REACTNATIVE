# Unidad 08 — npm

## Objetivos

- Comprender por qué nació npm y qué problema resolvió.
- Saber qué es un gestor de paquetes y qué es una dependencia.
- Entender cómo funciona npm por dentro (herramienta, registro y ecosistema).
- Aprender a utilizar los comandos fundamentales de npm.
- Conocer buenas prácticas de instalación y mantenimiento.

## Requisitos

- Unidad 06–07: qué es Node.js y para qué se usa.
- Tener Node.js (y por tanto npm) instalado, comprobado con `node -v` y `npm -v`.
- Saber abrir la terminal y desplazarte entre carpetas (`cd`).

## Índice

1. Introducción
2. El problema antes de npm
3. ¿Qué es un gestor de paquetes?
4. El nacimiento de npm
5. ¿Qué es realmente npm?
6. ¿Qué ocurre cuando ejecutas `npm install react`?
7. npm y Node.js
8. Instalación local vs instalación global
9. Primer proyecto con npm
10. Comandos fundamentales
11. ¿Cómo resuelve npm las dependencias?
12. Buenas prácticas
13. Conceptos clave
14. Ejercicios

## Introducción

Cuando empiezas con JavaScript es normal pensar que todo consiste en escribir código. Sin embargo, los proyectos profesionales utilizan cientos o incluso miles de librerías externas. Por ejemplo, una aplicación React recién creada puede depender de más de 300 paquetes de forma directa o indirecta.

La pregunta es:

> ¿Cómo descargamos todas esas librerías?

Hoy la respuesta parece obvia: **npm**. Pero hace años no existía, y desarrollar aplicaciones era mucho más complicado.

## 1. El problema antes de npm

Imagina que estamos en 2008. Quieres utilizar una librería para manipular fechas. No existe npm. El proceso sería algo parecido a esto:

```text
Internet
   ↓
Buscar la librería
   ↓
Entrar en la página web
   ↓
Descargar un ZIP
   ↓
Descomprimir
   ↓
Copiar archivos al proyecto
   ↓
Repetir para la siguiente librería
```

Ahora imagina que utilizas veinte librerías. Tendrías veinte carpetas distintas. Actualizar cualquiera de ellas sería un proceso manual.

### Otro problema

Imagina este proyecto:

```text
Proyecto
├── jquery.js
├── lodash.js
├── moment.js
├── axios.js
├── validator.js
├── ...
```

¿Qué ocurre cuando sale una nueva versión? Había que:

- Buscarla.
- Descargarla.
- Sustituir archivos.
- Comprobar que nada se rompía.

Era un mantenimiento lento y propenso a errores.

### El problema de las dependencias

Aquí aparece un concepto muy importante. Supongamos que instalamos una librería:

```text
Mi aplicación
   ↓
  Axios
```

Todo parece sencillo. Pero Axios también necesita otras librerías:

```text
Mi aplicación
   ↓
  Axios
   ↓
Librería A
   ↓
Librería B
```

Y la Librería B depende de otra:

```text
Mi aplicación
   ↓
  Axios
   ↓
Librería A
   ↓
Librería B
   ↓
Librería C
```

Sin un gestor de paquetes tendríamos que descargar todo esto manualmente. Sería prácticamente imposible mantener proyectos grandes.

**¿Qué es una dependencia?** Una dependencia es un paquete que nuestro proyecto necesita para funcionar. Por ejemplo:

```javascript
import axios from "axios";
```

En ese momento, Axios pasa a formar parte de nuestro proyecto. Es una dependencia.

**Error típico:** borrar la carpeta `node_modules` y quedar el proyecto "roto". No está roto: `npm install` puede reconstruirla a partir de `package.json` y `package-lock.json`.

## 2. ¿Qué es un gestor de paquetes?

Un gestor de paquetes es un programa que automatiza todo el proceso relacionado con las librerías. Su trabajo consiste en:

- Descargar paquetes.
- Instalarlos.
- Actualizarlos.
- Eliminar paquetes.
- Resolver dependencias automáticamente.
- Comprobar versiones compatibles.

Podemos imaginarlo como una tienda inteligente:

```text
Proyecto
   ↓
   npm
   ↓
Busca el paquete
   ↓
Descarga el paquete
   ↓
Descarga sus dependencias
   ↓
Las instala
   ↓
Actualiza package.json
```

Todo ello con un único comando.

**¿Por qué importa?** Un gestor de paquetes convierte un proceso manual, lento y propenso a errores en un comando de segundos.

**Error típico:** mezclar gestores (`npm install` y luego `pnpm add`) en el mismo proyecto. Cada gestor genera sus propios archivos de bloqueo; usar uno solo por proyecto evita discrepancias.

## 3. El nacimiento de npm

En 2009 apareció Node.js. Muy pronto la comunidad comenzó a publicar librerías reutilizables. El número de paquetes crecía rápidamente. Era evidente que hacía falta una forma sencilla de compartir código. Así nació npm (Node Package Manager).

Aunque originalmente significaba *Node Package Manager*, hoy en día el proyecto se identifica simplemente como **npm**. Con el tiempo se convirtió en el registro de paquetes más grande del mundo. Actualmente contiene millones de paquetes publicados por desarrolladores y empresas.

## 4. ¿Qué es realmente npm?

Cuando decimos "npm" solemos referirnos a tres cosas distintas.

### 1. La herramienta de línea de comandos

Es el programa que ejecutamos:

```bash
npm install
```

### 2. El registro (Registry)

Es el servidor donde están almacenados los paquetes. Cuando escribes:

```bash
npm install react
```

npm busca React en su registro oficial:

```text
Tu ordenador
   ↓
   npm
   ↓
 Registry
   ↓
Descarga React
   ↓
Instala React
```

### 3. El ecosistema

Millones de paquetes publicados por la comunidad: React, Vite, ESLint, Prettier, TypeScript, Express, NestJS... y muchos más.

## 5. ¿Qué ocurre cuando ejecutas `npm install react`?

Aunque parece un único comando, internamente suceden muchos pasos:

```text
Usuario
   ↓
npm install react
   ↓
Busca React en el Registry
   ↓
Obtiene la versión adecuada
   ↓
Comprueba dependencias
   ↓
Descarga todos los paquetes necesarios
   ↓
Crea node_modules
   ↓
Actualiza package.json
   ↓
Actualiza package-lock.json
```

Todo este proceso dura normalmente solo unos segundos.

**¿Por qué importa este recorrido?** Entenderlo te ayuda a interpretar errores: si falla la red, no se descarga; si falta `package.json`, no sabe dónde anotar la dependencia; si hay conflictos de versiones, avisa al resolver dependencias.

## 6. npm y Node.js

Una duda muy frecuente: *¿Tengo que instalar npm aparte?* La respuesta es no. Cuando instalas Node.js, también se instala npm. Puedes comprobarlo con:

```bash
node -v
npm -v
```

Por ejemplo:

```text
Node.js
v24.2.0

npm
11.5.1
```

(Las versiones pueden variar con el tiempo.)

**Error típico:** escribir `npm` y obtener "comando no reconocido". Significa que Node.js no está en el PATH o no se instaló bien; reinstala Node.js desde su web oficial.

## 7. Instalación local vs instalación global

npm puede instalar paquetes de dos formas.

### Instalación local

```bash
npm install react
```

El paquete solo estará disponible dentro del proyecto actual (en su carpeta `node_modules`). Es la forma recomendada para la mayoría de librerías.

### Instalación global

```bash
npm install -g typescript
```

El paquete queda disponible para todo el sistema. Podrás ejecutarlo desde cualquier carpeta. Normalmente se reserva para herramientas de desarrollo que necesitas usar desde la terminal.

**Error típico:** instalar `react` con `-g` y que el proyecto no lo encuentre. La librería de una app debe ir en local; lo global es para comandos de terminal.

## 8. Tu primer proyecto con npm

1. Creamos una carpeta vacía:

```text
mi-proyecto/
```

2. Entramos en ella:

```bash
cd mi-proyecto
```

3. Inicializamos npm:

```bash
npm init
```

npm hará varias preguntas:

```text
Package name?
Version?
Description?
Entry point?
Author?
License?
```

Al finalizar aparecerá un nuevo archivo: `package.json`. Este archivo será el "DNI" del proyecto. Lo estudiaremos en profundidad en la siguiente unidad.

## 9. Comandos fundamentales

### Crear un proyecto

```bash
npm init
```

Versión rápida:

```bash
npm init -y
```

Acepta todos los valores por defecto.

### Instalar un paquete

```bash
npm install react
```

También puedes usar la forma corta:

```bash
npm i react
```

### Eliminar un paquete

```bash
npm uninstall react
```

### Actualizar un paquete

```bash
npm update
```

### Mostrar paquetes instalados

```bash
npm list
```

### Comprobar vulnerabilidades conocidas

```bash
npm audit
```

### Intentar corregirlas automáticamente

```bash
npm audit fix
```

### Ver paquetes desactualizados

```bash
npm outdated
```

**¿Por qué importa cada uno?** `npm i` añade funcionalidad, `uninstall` la retira, `outdated` y `audit` te mantienen al día y a salvo de fallos de seguridad conocidos.

**Error típico:** ejecutar `npm audit fix` sin leer qué cambia: en ocasiones sube versiones mayores que pueden romper el proyecto. Revisa el diff después.

## 10. ¿Cómo resuelve npm las dependencias?

Supongamos que instalas React:

```bash
npm install react
```

React necesita otros paquetes para funcionar. npm analiza esas dependencias y las descarga automáticamente. Podemos representarlo así:

```text
Tu proyecto
│
└── React
    │
    ├── Paquete A
    │   └── Paquete C
    │
    └── Paquete B
```

No tienes que instalar cada una manualmente. npm construye ese árbol de dependencias por ti y se asegura de que las versiones sean compatibles siempre que sea posible.

**¿Por qué importa el árbol?** Cuando algo falla tras instalar un paquete, el problema suele estar en una dependencia de segundo nivel; `npm list` y los archivos de bloqueo te ayudan a rastrearlo.

## 11. Buenas prácticas

- Instala los paquetes localmente salvo que realmente necesites una herramienta global.
- No copies carpetas `node_modules` entre proyectos; utiliza `npm install` para recrearlas.
- Revisa periódicamente las actualizaciones y vulnerabilidades con `npm outdated` y `npm audit`.
- Mantén tu versión de Node.js actualizada para aprovechar mejoras de rendimiento y compatibilidad.
- Usa un solo gestor de paquetes por proyecto (npm, pnpm o Yarn, pero no mezcles).
- Sube a Git el `package.json` y el archivo de bloqueo, nunca la carpeta `node_modules`.

## Conceptos clave

- npm nació para resolver el problema de gestionar librerías y sus dependencias.
- Un gestor de paquetes descarga, instala, actualiza y elimina paquetes automáticamente.
- Una dependencia es un paquete del que tu proyecto necesita para funcionar.
- npm hace referencia a tres cosas: la herramienta de línea de comandos, el registro de paquetes (Registry) y el ecosistema de librerías.
- `npm install <paquete>` consulta el Registry, descarga el paquete y sus dependencias, crea `node_modules` y actualiza `package.json` y el archivo de bloqueo.
- Node.js y npm se instalan juntos; puedes verificarlo con `node -v` y `npm -v`.
- La instalación local (`npm install`) es para librerías del proyecto; la global (`-g`) solo para herramientas de terminal.
- La mayoría de las dependencias de un proyecto deben instalarse localmente.

## Ejercicios

1. Ejecuta `npm -v` y `node -v` en la terminal y anota las versiones.
2. Crea la carpeta `mi-primera-app`, entra en ella con `cd` y ejecuta `npm init -y`. Abre el `package.json` generado y busca el campo `name`.
3. Instala `lodash` en local (`npm i lodash`), comprueba con `npm list` que aparece y después elimínalo con `npm uninstall lodash`.
4. Explica con tus palabras la diferencia entre el Registry y la herramienta de línea de comandos de npm.
5. Ejecuta `npm outdated` y `npm audit` en un proyecto existente e interpreta la salida.
