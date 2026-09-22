npm: Historia, funcionamiento y primeros pasos

Objetivo

Comprender por qué nació npm, qué problema resolvió, cómo funciona internamente y aprender a utilizar sus comandos fundamentales.

Índice
El problema antes de npm
¿Qué es un gestor de paquetes?
El nacimiento de npm
¿Qué es realmente npm?
El registro de npm (npm Registry)
¿Cómo funciona una instalación?
npm y Node.js
Instalación global vs local
Primer proyecto con npm
Comandos fundamentales
¿Cómo resuelve npm las dependencias?
Buenas prácticas
Resumen
Introducción

Cuando empiezas con JavaScript es normal pensar que todo consiste en escribir código.

Sin embargo, los proyectos profesionales utilizan cientos o incluso miles de librerías externas.

Por ejemplo, una aplicación React recién creada puede depender de más de 300 paquetes de forma directa o indirecta.

La pregunta es:

¿Cómo descargamos todas esas librerías?

Hoy la respuesta parece obvia:

npm

Pero hace años no existía.

Y desarrollar aplicaciones era mucho más complicado.

El problema antes de npm

Imagina que estamos en 2008.

Quieres utilizar una librería para manipular fechas.

No existe npm.

El proceso sería algo parecido a esto.

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

Ahora imagina que utilizas veinte librerías.

Tendrías veinte carpetas distintas.

Actualizar cualquiera de ellas sería un proceso manual.

Otro problema

Imagina este proyecto.

Proyecto

├── jquery.js
├── lodash.js
├── moment.js
├── axios.js
├── validator.js
├── ...

¿Qué ocurre cuando sale una nueva versión?

Había que:

Buscarla.
Descargarla.
Sustituir archivos.
Comprobar que nada se rompía.

Era un mantenimiento lento y propenso a errores.

El problema de las dependencias

Aquí aparece un concepto muy importante.

Supongamos que instalamos una librería.

Mi aplicación

↓

Axios

Todo parece sencillo.

Pero Axios también necesita otras librerías.

Mi aplicación

↓

Axios

↓

Librería A

↓

Librería B

Y la Librería B depende de otra.

Mi aplicación

↓

Axios

↓

Librería A

↓

Librería B

↓

Librería C

Sin un gestor de paquetes tendríamos que descargar todo esto manualmente.

Sería prácticamente imposible mantener proyectos grandes.

¿Qué es una dependencia?

Una dependencia es un paquete que nuestro proyecto necesita para funcionar.

Por ejemplo:

import axios from "axios";

En ese momento, Axios pasa a formar parte de nuestro proyecto.

Es una dependencia.

¿Qué es un gestor de paquetes?

Un gestor de paquetes es un programa que automatiza todo el proceso relacionado con las librerías.

Su trabajo consiste en:

Descargar paquetes.
Instalarlos.
Actualizarlos.
Eliminar paquetes.
Resolver dependencias automáticamente.
Comprobar versiones compatibles.

Podemos imaginarlo como una tienda inteligente.

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

Todo ello con un único comando.

El nacimiento de npm

En 2009 apareció Node.js.

Muy pronto la comunidad comenzó a publicar librerías reutilizables.

El número de paquetes crecía rápidamente.

Era evidente que hacía falta una forma sencilla de compartir código.

Así nació npm (Node Package Manager).

Aunque originalmente significaba Node Package Manager, hoy en día el proyecto se identifica simplemente como npm.

Con el tiempo se convirtió en el registro de paquetes más grande del mundo.

Actualmente contiene millones de paquetes publicados por desarrolladores y empresas.

¿Qué es realmente npm?

Cuando decimos "npm" solemos referirnos a tres cosas distintas.

1. La herramienta de línea de comandos

Es el programa que ejecutamos.

npm install
2. El registro (Registry)

Es el servidor donde están almacenados los paquetes.

Cuando escribes:

npm install react

npm busca React en su registro oficial.

Tu ordenador

↓

npm

↓

Registry

↓

Descarga React

↓

Instala React
3. El ecosistema

Millones de paquetes publicados por la comunidad.

React.

Vite.

ESLint.

Prettier.

TypeScript.

Express.

NestJS.

Y muchos más.

¿Qué ocurre cuando ejecutas npm install react?

Aunque parece un único comando, internamente suceden muchos pasos.

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

Todo este proceso dura normalmente solo unos segundos.

npm y Node.js

Una duda muy frecuente.

¿Tengo que instalar npm aparte?

La respuesta es no.

Cuando instalas Node.js, también se instala npm.

Puedes comprobarlo con:

node -v
npm -v

Por ejemplo:

Node.js

v24.2.0

npm

11.5.1

(Las versiones pueden variar con el tiempo.)

Instalación local vs instalación global

npm puede instalar paquetes de dos formas.

Instalación local
npm install react

El paquete solo estará disponible dentro del proyecto actual.

Es la forma recomendada para la mayoría de librerías.

Instalación global
npm install -g typescript

El paquete queda disponible para todo el sistema.

Podrás ejecutarlo desde cualquier carpeta.

Normalmente se reserva para herramientas de desarrollo que necesitas usar desde la terminal.

Tu primer proyecto con npm

Creamos una carpeta vacía.

mi-proyecto/

Entramos en ella.

cd mi-proyecto

Inicializamos npm.

npm init

npm hará varias preguntas:

Package name?

Version?

Description?

Entry point?

Author?

License?

Al finalizar aparecerá un nuevo archivo.

package.json

Este archivo será el "DNI" del proyecto.

Lo estudiaremos en profundidad en la siguiente unidad.

Comandos fundamentales
Crear un proyecto
npm init

Versión rápida:

npm init -y

Acepta todos los valores por defecto.

Instalar un paquete
npm install react

También puedes usar la forma corta:

npm i react
Eliminar un paquete
npm uninstall react
Actualizar un paquete
npm update
Mostrar paquetes instalados
npm list
Comprobar vulnerabilidades conocidas
npm audit
Intentar corregirlas automáticamente
npm audit fix
Ver paquetes desactualizados
npm outdated
¿Cómo resuelve npm las dependencias?

Supongamos que instalas React.

npm install react

React necesita otros paquetes para funcionar.

npm analiza esas dependencias y las descarga automáticamente.

Podemos representarlo así:

Tu proyecto
│
└── React
    │
    ├── Paquete A
    │   └── Paquete C
    │
    └── Paquete B

No tienes que instalar cada una manualmente. npm construye ese árbol de dependencias por ti y se asegura de que las versiones sean compatibles siempre que sea posible.

Buenas prácticas
Instala los paquetes localmente salvo que realmente necesites una herramienta global.
No copies carpetas node_modules entre proyectos; utiliza npm install para recrearlas.
Revisa periódicamente las actualizaciones y vulnerabilidades con npm outdated y npm audit.
Mantén tu versión de Node.js actualizada para aprovechar mejoras de rendimiento y compatibilidad.
Conceptos clave
npm nació para resolver el problema de gestionar librerías y sus dependencias.
Un gestor de paquetes descarga, instala, actualiza y elimina paquetes automáticamente.
npm hace referencia a la herramienta de línea de comandos, al registro de paquetes y al ecosistema de librerías.
Node.js y npm se instalan juntos.
La mayoría de las dependencias de un proyecto deben instalarse localmente.