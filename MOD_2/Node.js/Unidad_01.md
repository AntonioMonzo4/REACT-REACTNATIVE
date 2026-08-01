Qué es Node.js?

En 2009, Ryan Dahl tuvo una idea muy sencilla pero revolucionaria.

"¿Y si JavaScript pudiera ejecutarse fuera del navegador?"

Ese fue el nacimiento de Node.js.

Node no es un lenguaje nuevo.

Node tampoco reemplaza JavaScript.

Simplemente proporciona un entorno para ejecutar JavaScript fuera del navegador.

Ahora podemos hacer cosas como:

-crear servidores,
-leer archivos,
-escribir archivos,
-conectarnos a una base de datos,
-escuchar peticiones HTTP,
-automatizar tareas,
-ejecutar herramientas de desarrollo.


¿Qué significa esto para React?

Aquí aparece una de las dudas más comunes.

Si React se ejecuta en el navegador, ¿por qué necesito Node.js?

La respuesta es:

Porque React no solo se ejecuta, primero hay que construirlo.

Cuando escribes:

function App() {
  return <h1>Hola</h1>;
}

El navegador no entiende JSX.

Tampoco entiende:

-imports modernos,
-TypeScript,
-módulos como los usa React,
-optimizaciones de producción.

Necesitamos una herramienta que transforme ese código en JavaScript estándar.

Esa herramienta se ejecuta con Node.js.

Por ejemplo:

Vite
Webpack
Babel
ESBuild

Todas ellas funcionan gracias a Node.js.

Flujo completo
Desarrollador
      │
      ▼
Código React
(JSX)

      │
      ▼
Node.js ejecuta Vite

      │
      ▼
Vite transforma el código

      │
      ▼
JavaScript compatible

      │
      ▼
Navegador

Idea clave: React no necesita Node.js para ejecutarse en el navegador, pero sí lo necesita durante el desarrollo para construir, transformar y servir la aplicación.


