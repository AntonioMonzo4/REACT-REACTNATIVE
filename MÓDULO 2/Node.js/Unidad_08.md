¿Qué son los scripts?

Cuando empezamos con JavaScript solemos ejecutar comandos largos.

Por ejemplo:

vite

o

vite build

o

eslint .

o

tsc

Imagina un proyecto grande.

Tendríamos que memorizar decenas de comandos.

Además, distintos desarrolladores podrían ejecutar comandos diferentes para hacer la misma tarea.

Necesitamos una forma de darles un nombre.

Ahí aparecen los scripts.

El campo scripts

Un ejemplo sencillo:

{
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  }
}

Aquí ocurre algo muy interesante.

La izquierda:

"dev"

es simplemente un nombre.

La derecha:

"vite"

es el comando real que se ejecutará.

Podemos imaginarlo así:

dev
 │
 ▼
vite

Y:

build
 │
 ▼
vite build
¿Qué ocurre cuando ejecutamos un script?

Supongamos este package.json.

{
  "scripts": {
    "dev": "vite"
  }
}

Ahora escribimos:

npm run dev

Internamente ocurre algo parecido a esto:

Terminal

↓

npm

↓

Abre package.json

↓

Busca "dev"

↓

Encuentra "vite"

↓

Ejecuta vite

Es decir:

npm run dev

es equivalente a ejecutar:

vite

La ventaja es que todos los miembros del equipo utilizan siempre el mismo comando.

¿Por qué no escribir directamente vite?

Porque muchas veces la herramienta ni siquiera está instalada de forma global.

Supongamos:

Proyecto

├── package.json
├── node_modules

Dentro de node_modules existe:

vite

Cuando ejecutamos:

npm run dev

npm añade automáticamente:

node_modules/.bin

al PATH temporal del proceso.

Gracias a eso encuentra vite aunque no esté instalado globalmente.

Este comportamiento es una de las razones por las que es preferible usar scripts frente a ejecutar binarios directamente.

Scripts más habituales
Desarrollo
{
  "scripts": {
    "dev": "vite"
  }
}

Se ejecuta con:

npm run dev

o

pnpm dev
Compilar
{
  "scripts": {
    "build": "vite build"
  }
}

Genera la versión optimizada para producción.

Vista previa
{
  "scripts": {
    "preview": "vite preview"
  }
}

Permite probar la aplicación ya compilada.

Linter
{
  "scripts": {
    "lint": "eslint ."
  }
}

Busca errores y problemas de estilo.

Tests
{
  "scripts": {
    "test": "vitest"
  }
}

Ejecuta las pruebas automáticas.

Scripts personalizados

No existe ninguna lista cerrada de nombres.

Podemos crear los que queramos.

{
  "scripts": {
    "hola": "echo Hola Mundo"
  }
}

Después:

npm run hola

Resultado:

Hola Mundo

Esto convierte a package.json en un pequeño "centro de automatización" del proyecto.

¿Qué son las dependencias?

Una dependencia es cualquier paquete que nuestro proyecto necesita.

Por ejemplo:

import React from "react";

Como utilizamos React, debemos instalarlo.

Campo dependencies

Ejemplo:

{
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "axios": "^1.8.0"
  }
}

Estas librerías son necesarias para que la aplicación funcione.

Si eliminamos React de una aplicación React, el proyecto dejará de funcionar.

¿Qué ocurre al instalar una dependencia?

Supongamos:

npm install axios

Internamente npm hace varias cosas:

Descarga Axios

↓

Lo instala en node_modules

↓

Añade Axios a dependencies

↓

Actualiza package-lock.json

Todo automáticamente.

El resultado:

{
  "dependencies": {
    "axios": "^1.8.0"
  }
}
¿Qué es devDependencies?

No todas las librerías son necesarias cuando la aplicación ya está funcionando en producción.

Ejemplo:

ESLint.
Prettier.
TypeScript.
Vite.
Vitest.

Estas herramientas solo se utilizan durante el desarrollo.

Por eso van aquí.

{
  "devDependencies": {
    "vite": "^7.0.0",
    "eslint": "^9.0.0"
  }
}
Analogía

Imagina que eres carpintero.

Para fabricar una mesa necesitas:

madera,
tornillos,
cola.

Esos serían:

dependencies

Pero también utilizas:

martillo,
sierra,
taladro.

Esas herramientas son necesarias para construir la mesa, pero no forman parte de la mesa terminada.

Eso serían las:

devDependencies
Comparativa
dependencies	devDependencies
Necesarias para ejecutar la aplicación	Necesarias para desarrollarla
Se utilizan en producción	Solo durante el desarrollo
Ejemplos: React, Axios, React Router	Ejemplos: Vite, ESLint, TypeScript, Vitest
¿Cómo se instalan?

Dependencias normales:

npm install react

o

pnpm add react

Dependencias de desarrollo:

npm install --save-dev eslint

Forma corta:

npm install -D eslint

Con pnpm:

pnpm add -D eslint
Error muy común

Muchos desarrolladores meten todo en dependencies.

No es lo correcto.

Por ejemplo:

{
  "dependencies": {
    "eslint": "...",
    "prettier": "...",
    "vite": "..."
  }
}

Aunque la aplicación funcione, estás indicando que esas herramientas son necesarias en producción, cuando en realidad solo las utilizas para desarrollar.

Mantener una separación clara ayuda a entender el proyecto y evita instalar paquetes innecesarios en algunos entornos.

Buenas prácticas
Utiliza nombres de scripts claros (dev, build, test, lint son convenciones ampliamente aceptadas).
Coloca en dependencies únicamente las librerías necesarias para ejecutar la aplicación.
Coloca en devDependencies las herramientas de desarrollo.
Evita crear scripts duplicados o con nombres ambiguos.
Aprovecha los scripts para que todo el equipo ejecute las mismas tareas de la misma forma.
Conceptos clave
scripts permite asignar nombres sencillos a comandos complejos.
npm run o pnpm run buscan el script correspondiente en package.json y lo ejecutan.
dependencies contiene las librerías necesarias para que la aplicación funcione.
devDependencies contiene herramientas utilizadas únicamente durante el desarrollo.
Una buena organización del package.json facilita el mantenimiento del proyecto.

¿Por qué existen campos avanzados?

Hasta ahora hemos visto campos que aparecen en casi cualquier proyecto:

name
version
scripts
dependencies
devDependencies

Pero si inspeccionas el package.json de React, Vite o cualquier librería popular, encontrarás muchos más.

¿Por qué?

Porque package.json no solo describe aplicaciones, también describe librerías que otros desarrolladores instalarán.

peerDependencies

Este es uno de los conceptos más difíciles para los principiantes.

Supongamos que desarrollas una librería llamada:

mi-react-ui

Internamente utiliza React.

mi-react-ui

↓

React

Una primera idea sería instalar React como dependencia.

{
  "dependencies": {
    "react": "^19.0.0"
  }
}

Parece correcto.

Pero aparece un problema.

El problema

Imagina esta aplicación.

Mi aplicación

↓

React 19

↓

mi-react-ui

↓

React 19

Ahora existen dos instalaciones distintas de React.

Eso puede provocar errores muy difíciles de depurar, especialmente porque React mantiene estado interno y espera ser una única instancia compartida.

La solución

En lugar de instalar React directamente, la librería dice:

"Yo necesito React, pero espero que quien instale mi librería ya lo tenga."

Eso se expresa así:

{
  "peerDependencies": {
    "react": "^19.0.0"
  }
}

Ahora el árbol queda así:

Aplicación

│

├── React

└── mi-react-ui

Solo existe una copia de React.

¿Cuándo usar peerDependencies?

Normalmente en librerías.

Ejemplos:

Componentes React.
Plugins de ESLint.
Plugins de Vite.
Plugins de Webpack.
Plugins de Babel.

No suele utilizarse en aplicaciones normales.

optionalDependencies

Algunas dependencias no son imprescindibles.

Si no pueden instalarse, la aplicación puede seguir funcionando con funcionalidades reducidas.

Ejemplo:

{
  "optionalDependencies": {
    "sharp": "^0.34.0"
  }
}

Si sharp falla durante la instalación, npm continúa sin detener el proceso.

Esto es útil para paquetes que dependen de características específicas del sistema operativo o de compilaciones nativas.

engines

Este campo indica qué versiones de herramientas son compatibles con el proyecto.

Ejemplo:

{
  "engines": {
    "node": ">=20",
    "npm": ">=10"
  }
}

Con esto comunicamos que el proyecto está pensado para ejecutarse con Node.js 20 o superior y npm 10 o superior.

Algunos gestores de paquetes mostrarán una advertencia si no se cumple este requisito.

¿Por qué es importante?

Imagina este equipo.

Ana

Node 24

↓

Funciona

--------------------

Luis

Node 16

↓

Error

Definir engines ayuda a reducir este tipo de diferencias entre entornos.

main

Cuando publicas una librería, debes indicar cuál es su punto de entrada principal.

Ejemplo:

{
  "main": "index.js"
}

Si alguien instala esa librería y hace:

import miLibreria from "mi-libreria";

Node.js buscará el archivo indicado en main (o utilizará exports, que veremos a continuación).

En aplicaciones creadas con React y Vite normalmente no tendrás que modificar este campo.

exports

exports es una evolución de main.

Permite controlar exactamente qué archivos de una librería son públicos.

Ejemplo:

{
  "exports": {
    ".": "./dist/index.js"
  }
}

Con este campo puedes impedir que los usuarios importen archivos internos que no forman parte de la API pública.

Es muy utilizado en librerías modernas.

files

Cuando publicas un paquete en npm, no siempre quieres subir todos los archivos del proyecto.

Con files puedes indicar cuáles se incluirán.

{
  "files": [
    "dist",
    "README.md"
  ]
}

De este modo puedes excluir:

Código fuente.
Pruebas.
Configuraciones internas.
Archivos temporales.
private

Ya vimos este campo brevemente, pero merece una mención adicional.

{
  "private": true
}

Con este valor npm bloqueará cualquier intento de publicar el proyecto en el registro oficial.

En aplicaciones React, Next.js o React Native suele ser recomendable mantenerlo activado, ya que normalmente no queremos publicar la aplicación como una librería reutilizable.

Otros campos útiles

Existen muchos más campos que puedes encontrar en proyectos reales.

Por ejemplo:

{
  "homepage": "...",
  "repository": "...",
  "bugs": "...",
  "keywords": [
    "react",
    "ui"
  ]
}

Estos campos proporcionan información adicional para quienes utilizan o mantienen el proyecto.

Un package.json profesional

Un proyecto profesional puede tener un aspecto parecido a este:

{
  "name": "frontend-profesional",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "engines": {
    "node": ">=20"
  },
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "test": "vitest"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "vite": "^7.0.0",
    "eslint": "^9.0.0",
    "typescript": "^5.0.0",
    "vitest": "^3.0.0"
  }
}

Aunque hay muchos campos posibles, la mayoría de aplicaciones utilizan una estructura muy similar a esta.

¿Quién utiliza cada campo?
Campo	Quién lo utiliza
name	npm, Registry
version	npm
scripts	npm, pnpm, Yarn
dependencies	npm, pnpm, Yarn
devDependencies	npm, pnpm, Yarn
peerDependencies	Gestores de paquetes y librerías
optionalDependencies	Gestores de paquetes
main	Node.js
exports	Node.js y herramientas modernas
engines	npm, pnpm, Yarn
private	npm
Buenas prácticas
Utiliza peerDependencies únicamente cuando desarrolles librerías o plugins.
Define engines si tu proyecto depende de versiones concretas de Node.js.
Mantén private: true en aplicaciones que no vayas a publicar.
Publica solo los archivos necesarios utilizando files.
Prefiere exports frente a main en librerías modernas para controlar mejor la API pública.
Conceptos clave
peerDependencies indica dependencias que deben ser proporcionadas por quien instala la librería.
optionalDependencies permite que una instalación continúe aunque una dependencia opcional falle.
engines documenta las versiones compatibles de Node.js y otras herramientas.
main y exports definen cómo se expone una librería al exterior.
files controla qué se publica en npm.
Muchos de estos campos son esenciales al desarrollar librerías, aunque en aplicaciones React se utilicen con menos frecuencia.