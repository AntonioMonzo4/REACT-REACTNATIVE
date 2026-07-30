Introducción

Cada proyecto moderno de JavaScript tiene un archivo llamado:

package.json

Lo encontrarás en proyectos de:

React
React Native
Next.js
Vue
Angular
Node.js
Express
NestJS
Vite
TypeScript

Prácticamente cualquier proyecto del ecosistema JavaScript lo incluye.

La pregunta es:

¿Por qué?

El problema antes de package.json

Imagina que desarrollas una aplicación React.

Utilizas:

React
React DOM
Vite
TypeScript
ESLint
Prettier
Axios

Ahora envías el proyecto a un compañero.

¿Cómo sabe qué librerías tiene que instalar?

Antes no existía una respuesta estándar.

Cada proyecto podía depender de una documentación manual, lo que provocaba errores y diferencias entre entornos.

La solución

Necesitamos un archivo que responda preguntas como:

¿Cómo se llama el proyecto?
¿Qué versión tiene?
¿Qué dependencias necesita?
¿Qué scripts existen?
¿Qué versión de Node.js requiere?
¿Es un proyecto privado?
¿Qué licencia tiene?

Ese archivo es:

package.json
¿Qué es package.json?

package.json es el archivo de configuración principal de un proyecto JavaScript.

Podemos imaginarlo como el DNI o el pasaporte del proyecto.

Contiene toda la información necesaria para que las herramientas del ecosistema sepan cómo trabajar con él.

Una analogía

Piensa en una persona.

Tiene:

Nombre.
Fecha de nacimiento.
Nacionalidad.
Dirección.
Profesión.

Todo eso aparece en un documento de identidad.

Un proyecto también necesita un documento equivalente.

Proyecto
│
├── Nombre
├── Versión
├── Dependencias
├── Scripts
├── Licencia
└── Configuración

Ese documento es package.json.

¿Quién crea este archivo?

Normalmente se crea mediante:

npm init

o

npm init -y

También puede generarlo automáticamente una herramienta como Vite:

npm create vite@latest

o

pnpm create vite

En cualquier caso, el resultado es un package.json.

¿Quién lee este archivo?

No solo lo lee npm.

Muchas herramientas lo utilizan.

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

Es el punto de encuentro del ecosistema.

¿Cuándo se utiliza?

Cada vez que ejecutas un comando como:

npm install

o

pnpm install

el gestor de paquetes abre package.json para responder preguntas como:

¿Qué dependencias debo instalar?
¿Qué versiones?
¿Hay scripts disponibles?
¿Es un proyecto ESM o CommonJS?
Anatomía básica

Un package.json típico puede ser así:

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

A primera vista parece un simple objeto JSON.

Pero cada propiedad tiene un propósito muy concreto.

¿Por qué JSON?

Antes de analizar los campos, debemos entender el formato.

package.json está escrito en JSON (JavaScript Object Notation).

JSON es un formato de intercambio de datos basado en pares clave-valor.

Ejemplo:

{
  "nombre": "Antonio",
  "edad": 25
}

En este caso:

"nombre" es la clave.
"Antonio" es el valor.

package.json sigue exactamente la misma estructura.

Primer campo: name
{
  "name": "mi-proyecto"
}

Indica el nombre del proyecto o paquete.

Si publicas tu proyecto en el registro de npm, este será el nombre con el que otros desarrolladores podrán instalarlo.

Por ejemplo:

npm install react

react es el valor del campo name del paquete publicado.

Campo version
{
  "version": "1.0.0"
}

Representa la versión actual del proyecto.

Sigue las reglas de Versionado Semántico (SemVer), que estudiaremos más adelante.

Por ahora basta con saber que:

1.0.0
│ │ │
│ │ └── PATCH
│ └──── MINOR
└────── MAJOR
Campo description
{
  "description": "Aplicación para gestionar tareas"
}

Es una breve descripción del proyecto.

No afecta al funcionamiento, pero es muy útil si el paquete se publica.

Campo private
{
  "private": true
}

Cuando vale true, npm impide publicar el paquete por error.

Es muy recomendable en aplicaciones que no están destinadas a ser librerías públicas.

Campo license
{
  "license": "MIT"
}

Indica bajo qué licencia se distribuye el proyecto.

En proyectos personales o internos suele mantenerse el valor por defecto o adaptarse según las necesidades de la organización.

Campo author
{
  "author": "Antonio Monzó"
}

Identifica al autor o equipo responsable del proyecto.

Campo type

Uno de los campos más importantes.

{
  "type": "module"
}

Determina cómo interpreta Node.js los archivos JavaScript del proyecto.

Si usamos:

{
  "type": "module"
}

podemos escribir:

import fs from "node:fs";

Si el proyecto utiliza CommonJS (o no define type), la sintaxis habitual es:

const fs = require("node:fs");

En proyectos modernos con React y Vite se utiliza casi siempre:

"type": "module"