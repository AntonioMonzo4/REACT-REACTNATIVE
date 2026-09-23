# Unidad 09 — package.json

## Objetivos

- Entender qué es `package.json` y por qué todo proyecto JavaScript lo incluye.
- Saber quién lo crea y quién lo lee.
- Conocer la estructura básica (anatomía) y el formato JSON.
- Identificar los campos principales: `name`, `version`, `description`, `private`, `license`, `author` y `type`.
- Aplicar buenas prácticas al mantener el archivo.

## Requisitos

- Unidad 08: qué es npm, cómo se instalan dependencias y qué es `npm init`.
- Saber qué es un objeto clave-valor en JavaScript.
- Haber creado al menos un proyecto con `npm init` o `npm create vite@latest`.

## Índice

1. Introducción
2. El problema antes de `package.json`
3. ¿Qué es `package.json`?
4. ¿Quién crea este archivo?
5. ¿Quién lee este archivo?
6. ¿Cuándo se utiliza?
7. Anatomía básica
8. ¿Por qué JSON?
9. Campos principales
10. Buenas prácticas
11. Conceptos clave
12. Ejercicios

## Introducción

Cada proyecto moderno de JavaScript tiene un archivo llamado `package.json`. Lo encontrarás en proyectos de:

- React
- React Native
- Next.js
- Vue
- Angular
- Node.js
- Express
- NestJS
- Vite
- TypeScript

Prácticamente cualquier proyecto del ecosistema JavaScript lo incluye. La pregunta es: **¿por qué?**

## 1. El problema antes de `package.json`

Imagina que desarrollas una aplicación React. Utilizas:

- React
- React DOM
- Vite
- TypeScript
- ESLint
- Prettier
- Axios

Ahora envías el proyecto a un compañero. ¿Cómo sabe qué librerías tiene que instalar?

Antes no existía una respuesta estándar. Cada proyecto podía depender de una documentación manual, lo que provocaba errores y diferencias entre entornos (en tu equipo funcionaba, en el suyo no).

### La solución

Necesitamos un archivo que responda preguntas como:

- ¿Cómo se llama el proyecto?
- ¿Qué versión tiene?
- ¿Qué dependencias necesita?
- ¿Qué scripts existen?
- ¿Qué versión de Node.js requiere?
- ¿Es un proyecto privado?
- ¿Qué licencia tiene?

Ese archivo es: `package.json`.

**¿Por qué importa?** Es el acuerdo común entre tu máquina, la de tu compañero y servicios como CI/CD: todos leen el mismo archivo y llegan a las mismas conclusiones.

## 2. ¿Qué es `package.json`?

`package.json` es el archivo de configuración principal de un proyecto JavaScript. Podemos imaginarlo como el **DNI o el pasaporte del proyecto**. Contiene toda la información necesaria para que las herramientas del ecosistema sepan cómo trabajar con él.

### Una analogía

Piensa en una persona. Tiene:

- Nombre.
- Fecha de nacimiento.
- Nacionalidad.
- Dirección.
- Profesión.

Todo eso aparece en un documento de identidad. Un proyecto también necesita un documento equivalente:

```text
Proyecto
│
├── Nombre
├── Versión
├── Dependencias
├── Scripts
├── Licencia
└── Configuración
```

Ese documento es `package.json`.

**Error típico:** borrar `package.json` por error. Sin él, npm no sabe qué instalar ni qué scripts ejecutar; hay que recuperarlo (de Git) o regenerarlo con `npm init`.

## 3. ¿Quién crea este archivo?

Normalmente se crea mediante:

```bash
npm init
```

o

```bash
npm init -y
```

También puede generarlo automáticamente una herramienta como Vite:

```bash
npm create vite@latest
```

o

```bash
pnpm create vite
```

En cualquier caso, el resultado es un `package.json`.

## 4. ¿Quién lee este archivo?

No solo lo lee npm. Muchas herramientas lo utilizan:

```text
                 package.json
                       │
      ┌────────────────┼────────────────┐
      ▼                ▼                ▼
     npm             pnpm             Yarn
      │                │                │
      ├────────────┬───┴────────────┐
      ▼            ▼                ▼
    Vite      TypeScript       ESLint
      │
      ▼
    React
```

Es el punto de encuentro del ecosistema: gestores de paquetes, compiladores, linters y frameworks consultan el mismo archivo.

**¿Por qué importa?** Un error en `package.json` (una coma mal puesta, un script que no existe) puede romper el comando `dev`, el `build`, el lint, etc.

## 5. ¿Cuándo se utiliza?

Cada vez que ejecutas un comando como:

```bash
npm install
```

o

```bash
pnpm install
```

el gestor de paquetes abre `package.json` para responder preguntas como:

- ¿Qué dependencias debo instalar?
- ¿Qué versiones?
- ¿Hay scripts disponibles?
- ¿Es un proyecto ESM o CommonJS?

## 6. Anatomía básica

Un `package.json` típico puede ser así:

```json
{
  "name": "mi-proyecto",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "vite": "^7.0.0"
  }
}
```

A primera vista parece un simple objeto JSON. Pero cada propiedad tiene un propósito muy concreto. (Los campos `scripts`, `dependencies` y `devDependencies` se estudiarán en profundidad en el siguiente capítulo.)

## 7. ¿Por qué JSON?

Antes de analizar los campos, debemos entender el formato. `package.json` está escrito en **JSON** (JavaScript Object Notation).

JSON es un formato de intercambio de datos basado en pares clave-valor. Ejemplo:

```json
{
  "nombre": "Antonio",
  "edad": 25
}
```

En este caso:

- `"nombre"` es la clave.
- `"Antonio"` es el valor.

`package.json` sigue exactamente la misma estructura.

**Error típico:** introducir comentarios o comas finales. JSON es estricto: no admite `//` ni `,` antes de cerrar llaves; el archivo se rechaza con un error de sintaxis.

## 8. Campos principales

### Primer campo: `name`

```json
{
  "name": "mi-proyecto"
}
```

Indica el nombre del proyecto o paquete. Si publicas tu proyecto en el registro de npm, este será el nombre con el que otros desarrolladores podrán instalarlo. Por ejemplo:

```bash
npm install react
```

`react` es el valor del campo `name` del paquete publicado.

**Error típico:** intentar publicar un nombre que ya existe en el registro; npm lo rechazará.

### Campo `version`

```json
{
  "version": "1.0.0"
}
```

Representa la versión actual del proyecto. Sigue las reglas de Versionado Semántico (SemVer), que estudiaremos más adelante. Por ahora basta con saber que:

```text
1.0.0
│ │ │
│ │ └── PATCH
│ └──── MINOR
└────── MAJOR
```

**¿Qué significa?** Cambios grandes (MAJOR), funciones nuevas (MINOR) y correcciones (PATCH). Así, quien use tu paquete sabe qué esperar al actualizar.

### Campo `description`

```json
{
  "description": "Aplicación para gestionar tareas"
}
```

Es una breve descripción del proyecto. No afecta al funcionamiento, pero es muy útil si el paquete se publica: es lo que leen los demás en la página de npm.

### Campo `private`

```json
{
  "private": true
}
```

Cuando vale `true`, npm impide publicar el paquete por error. Es muy recomendable en aplicaciones que no están destinadas a ser librerías públicas.

**Error típico:** ejecutar `npm publish` en una app privada sin `private: true` y colgar accidentalmente código (o claves mal escondidas) en el registro público.

### Campo `license`

```json
{
  "license": "MIT"
}
```

Indica bajo qué licencia se distribuye el proyecto. En proyectos personales o internos suele mantenerse el valor por defecto o adaptarse según las necesidades de la organización.

**¿Por qué importa?** La licencia define si otros pueden usar, modificar o redistribuir tu código.

### Campo `author`

```json
{
  "author": "Antonio Monzó"
}
```

Identifica al autor o equipo responsable del proyecto. Útil para saber a quién preguntar o quién mantiene el paquete.

### Campo `type`

Uno de los campos más importantes:

```json
{
  "type": "module"
}
```

Determina cómo interpreta Node.js los archivos JavaScript del proyecto.

Si usamos:

```json
{
  "type": "module"
}
```

podemos escribir:

```javascript
import fs from "node:fs";
```

Si el proyecto utiliza CommonJS (o no define `type`), la sintaxis habitual es:

```javascript
const fs = require("node:fs");
```

En proyectos modernos con React y Vite se utiliza casi siempre:

```json
{
  "type": "module"
}
```

**Error típico:** mezclar `import` y `require` en el mismo proyecto mal configurado, o ver `require is not defined in ES module scope` porque falta `"type": "module"`.

## 9. Buenas prácticas

- Mantén `private: true` en aplicaciones que no vayas a publicar en npm.
- Utiliza `type: "module"` en proyectos modernos para trabajar con `import`/`export`.
- Rellena `description` y `author` si el proyecto se va a publicar.
- No edites `package.json` a mano para instalar dependencias; usa `npm install` o `pnpm add`, que lo actualizan automáticamente.
- Evita introducir comentarios o comas finales: el formato JSON es estricto.
- Somete el archivo a control de versiones (Git): es esencial para reproducir el proyecto en otro equipo.
- Tras editarlo a mano, verifica que el archivo sigue siendo JSON válido (por ejemplo, ejecutando `npm install`).

## Conceptos clave

- `package.json` es el archivo de configuración principal de un proyecto JavaScript (el "DNI" del proyecto).
- Resuelve el problema de saber qué dependencias, scripts y metadatos necesita un proyecto para funcionar en cualquier equipo.
- Se crea con `npm init` o automáticamente con herramientas como Vite (`npm create vite@latest`).
- Lo leen npm, pnpm, Yarn y también herramientas como Vite, TypeScript o ESLint: es el punto de encuentro del ecosistema.
- Está escrito en JSON: pares clave-valor, sin comentarios ni comas finales.
- `name`, `version`, `description`, `private`, `license` y `author` describen el proyecto.
- `version` sigue SemVer: `MAJOR.MINOR.PATCH`.
- `private: true` evita publicar por error en el registro de npm.
- `type` determina si el proyecto usa ESM (`import`/`export`) o CommonJS (`require`).
- En el siguiente capítulo estudiamos en detalle sus dependencias y campos avanzados (`scripts`, `dependencies`, `devDependencies`).

## Ejercicios

1. Crea un proyecto vacío con `npm init -y` y abre el `package.json` generado. Identifica `name` y `version`.
2. Añade a mano los campos `description`, `author` y `private` y comprueba que `npm install` no da error de sintaxis.
3. Vuelve a romper el archivo a propósito (añade una coma final), intenta `npm install` y anota el error. Después corrígelo.
4. Compara dos `package.json`: el de un proyecto Vue y el de un proyecto React. ¿Qué campos coinciden?
5. Explica con tus palabras qué pasaría si un compañero recibiera tu proyecto sin `package.json`.
