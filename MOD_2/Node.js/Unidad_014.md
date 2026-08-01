1. ¿Por qué nació pnpm?

Volvamos a un ejemplo.

Tenemos dos proyectos.

Proyecto A

↓

React
Axios
ESLint
Proyecto B

↓

React
Axios
Vite

Con npm ocurre algo parecido a esto.

Disco duro

│

├── Proyecto A

│      └── node_modules

│            ├── react

│            ├── axios

│            └── ...

│

└── Proyecto B

       └── node_modules

             ├── react

             ├── axios

             └── ...

Hay dos copias de React.

Dos copias de Axios.

Dos copias de muchas dependencias.

¿Cuál es el problema?

Supongamos que React ocupa:

15 MB

Y tienes:

20 proyectos React.
Todos utilizan la misma versión.

Con npm tendrás aproximadamente:

20 × 15 MB

Solo para React.

Lo mismo ocurre con cientos de paquetes más.

2. ¿Qué problemas intenta resolver pnpm?

Principalmente tres.

Espacio en disco

npm duplica paquetes entre proyectos.

Velocidad

Cada instalación requiere copiar muchos archivos.

Integridad

Con npm es posible que un paquete acceda accidentalmente a dependencias que no ha declarado (dependiendo de la estructura del árbol de dependencias).

pnpm fuerza una estructura más estricta, lo que ayuda a detectar errores antes.

3. ¿Qué es pnpm?

pnpm significa:

Performant npm

Es un gestor de paquetes compatible con npm.

Lee el mismo:

package.json

Utiliza el mismo registro oficial de npm.

npm Registry

Pero instala las dependencias de una forma completamente distinta.

4. ¿Cómo instala npm?

Supongamos:

npm install react

El flujo simplificado es:

Descarga React

↓

Lo copia

↓

node_modules/react

Cada proyecto tendrá su propia copia.

5. ¿Cómo instala pnpm?

Con pnpm ocurre algo diferente.

pnpm add react

Flujo:

Descarga React

↓

Lo guarda en un almacén global (Store)

↓

Crea enlaces al proyecto

Es decir:

Store Global

│

└── React

        ▲

        │

────────┼────────────

        │

Proyecto A

Proyecto B

Proyecto C

Una única copia.

Muchos proyectos.

6. El Store Global

Esta es la pieza más importante de pnpm.

Existe una carpeta especial en tu ordenador.

Algo parecido a:

C:\Users\Antonio\AppData\Local\pnpm-store

(o la ruta equivalente en Linux o macOS).

Allí pnpm guarda una sola copia de cada versión de cada paquete.

Por ejemplo:

Store

├── React 19.0.0

├── Axios 1.8.0

├── Vite 7.0.0

└── ESLint 9.0.0

Nunca volverá a descargarlos mientras esa versión ya exista en el Store.

Analogía

Imagina una biblioteca.

Con npm sería como si cada estudiante comprara su propio libro.

Alumno A

↓

Libro React

Alumno B

↓

Libro React

Alumno C

↓

Libro React

Tres libros iguales.

Con pnpm.

Existe una biblioteca.

Todos consultan el mismo libro.

Biblioteca

↓

Libro React

↑

↑

↑

Alumno A

Alumno B

Alumno C
7. Hard Links

Aquí aparece uno de los conceptos más importantes.

Cuando pnpm instala React en un proyecto...

no copia los archivos.

Crea un Hard Link.

¿Qué es un Hard Link?

Un Hard Link es una segunda referencia al mismo archivo físico.

Imagina un archivo.

React.js

Con npm:

Proyecto A

↓

Copia React.js
Proyecto B

↓

Otra copia React.js

Dos archivos.

Con pnpm.

Store

↓

React.js

↑

↑

Proyecto A

Proyecto B

Existe un único archivo.

Los dos proyectos apuntan al mismo.

Ventajas
Muchísimo menos espacio.
Instalaciones más rápidas.
Menos duplicación.
8. Symlinks

Además de Hard Links, pnpm utiliza Symlinks (Enlaces simbólicos).

Los Symlinks funcionan como accesos directos.

Imagina Windows.

Acceso directo

↓

Chrome

No contiene Chrome.

Solo sabe dónde está.

Eso mismo hace pnpm para construir la estructura de node_modules.

9. ¿Cómo es node_modules con pnpm?

Con npm:

node_modules

├── react

├── axios

├── vite

Todo parece estar directamente dentro.

Con pnpm:

node_modules

│

├── .pnpm

│

├── react -> enlace

├── axios -> enlace

└── vite -> enlace

Internamente la estructura es bastante más compleja.

Pero para Node.js todo funciona exactamente igual.

¿Por qué Node.js no nota la diferencia?

Porque Node.js sigue enlaces simbólicos de forma transparente.

Cuando encuentra:

react

No le importa si es:

una carpeta real,
un enlace simbólico,
un Hard Link.

Simplemente carga el módulo.

10. Comparativa
Característica	npm	pnpm
Registro	npm Registry	npm Registry
package.json	✅	✅
Lock File	package-lock.json	pnpm-lock.yaml
Espacio en disco	Alto	Muy bajo
Velocidad	Buena	Muy alta
Duplicación	Sí	No (usa Store)
Monorepos	Bueno	Excelente
11. Comandos principales

Instalar dependencias:

pnpm install

Añadir una dependencia:

pnpm add react

Dependencia de desarrollo:

pnpm add -D eslint

Eliminar:

pnpm remove react

Actualizar:

pnpm update

Ejecutar scripts:

pnpm dev
pnpm build
pnpm test

No hace falta escribir run en los scripts habituales.

12. Monorepos

Aquí es donde pnpm brilla especialmente.

Imagina:

Empresa

│

├── Frontend

├── Backend

├── Shared UI

├── Mobile

└── Design System

Con npm podrías terminar con muchas dependencias duplicadas.

pnpm comparte el Store entre todos los paquetes y gestiona las relaciones entre ellos de forma muy eficiente.

Por eso herramientas como Turborepo y Nx suelen recomendar su uso.

13. Buenas prácticas
Usa pnpm en proyectos nuevos siempre que el equipo esté de acuerdo.
No mezcles package-lock.json y pnpm-lock.yaml; utiliza solo el correspondiente al gestor elegido.
Versiona siempre el pnpm-lock.yaml en Git.
Aprovecha pnpm dlx para ejecutar herramientas de forma temporal.
Familiarízate con la estructura de node_modules, aunque sea más compleja internamente.
Conceptos clave
pnpm utiliza el mismo package.json que npm.
Descarga los paquetes una única vez y los almacena en un Store Global.
Usa Hard Links para evitar duplicar archivos.
Usa Symlinks para construir la estructura de node_modules.
Consume menos espacio y suele instalar dependencias más rápido que npm.
Es una opción excelente para proyectos grandes y monorepos.