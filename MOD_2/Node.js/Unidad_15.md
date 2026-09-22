1. El problema antes de npx

Imagina que quieres crear un proyecto React.

Hace unos años hacíamos algo como esto:

npm install -g create-react-app

Después:

create-react-app mi-app

Funcionaba.

Pero tenía varios problemas.

Problema 1: Herramientas desactualizadas

Supongamos que instalaste:

npm install -g create-react-app

Hace un año.

Hoy ejecutas:

create-react-app mi-app

Y sigues utilizando la versión instalada hace un año, salvo que la actualices manualmente.

Problema 2: Contaminación del sistema

Cada herramienta instalada globalmente ocupa espacio.

Con el tiempo podrías terminar con:

Sistema

├── create-react-app
├── vite
├── eslint
├── typescript
├── prettier
├── firebase-tools
├── expo-cli
└── ...

Muchas de ellas quizá ya no las utilices.

La solución

En lugar de instalar una herramienta para siempre...

¿Y si solo la descargamos cuando la necesitemos?

Ahí nace npx.

2. ¿Qué es npx?

npx es una herramienta incluida con npm que permite ejecutar paquetes sin necesidad de instalarlos globalmente.

Por ejemplo:

npx create-vite@latest

Aunque nunca hayas instalado Vite.

¿Cómo puede funcionar?

Parece magia.

Pero internamente no lo es.

3. ¿Cómo funciona?

Cuando escribimos:

npx create-vite@latest

ocurre algo parecido a esto:

Terminal

↓

npx

↓

¿Está instalado localmente?

↓

NO

↓

¿Está instalado globalmente?

↓

NO

↓

Lo descarga temporalmente

↓

Lo ejecuta

↓

Finaliza

Una vez termina, la herramienta ya no forma parte de tu proyecto como dependencia.

4. Tres formas de utilizar una herramienta
Opción 1: Instalación global
npm install -g eslint

Disponible en cualquier proyecto.

Problemas:

Puede quedarse desactualizada.
Todas las aplicaciones compartirán la misma versión.
Opción 2: Instalación local
npm install -D eslint

Solo existe dentro del proyecto.

Ventajas:

Cada proyecto puede utilizar una versión distinta.
Es la práctica habitual para herramientas de desarrollo.
Opción 3: Ejecución temporal (npx)
npx create-vite@latest

No la instalas globalmente.

Solo la ejecutas cuando la necesitas.

Comparativa
Método	¿Se instala?	¿Dónde?	¿Cuándo usarlo?
npm install -g	Sí	Sistema	Herramientas de uso continuo (cada vez menos frecuente)
npm install	Sí	Proyecto	Dependencias del proyecto
npx	Temporal	Caché temporal	Herramientas de creación o ejecución puntual
5. ¿Qué ocurre internamente?

Supongamos:

npx cowsay Hola

Flujo simplificado:

npx

↓

Busca cowsay

↓

No existe

↓

Descarga el paquete

↓

Ejecuta el binario

↓

Muestra:

 ______
< Hola >
 ------

Todo esto ocurre sin añadir cowsay a package.json.

6. Casos de uso reales
Crear un proyecto Vite
npx create-vite@latest
Crear una aplicación con herramientas modernas

Muchos asistentes de creación de proyectos funcionan de esta forma.

Por ejemplo:

npx create-next-app@latest

o

npx create-expo-app@latest

La idea es la misma: descargar la herramienta más reciente, ejecutarla y terminar.

Ejecutar una herramienta puntual

También puedes lanzar utilidades que no necesitas mantener instaladas permanentemente.

Ejemplo:

npx eslint .

Aunque, si ESLint ya forma parte de tu proyecto, lo normal es ejecutarlo mediante un script:

npm run lint
7. Diferencias entre npm y npx

Es una duda muy habitual.

npm

Gestiona paquetes.

Ejemplos:

npm install react
npm uninstall react
npm update

Su función principal es instalar, eliminar y actualizar dependencias.

npx

No instala dependencias en tu proyecto.

Su objetivo es ejecutar un paquete.

Ejemplo:

npx create-vite@latest
¿Y pnpm dlx?

pnpm tiene un comando equivalente:

pnpm dlx create-vite

Hace prácticamente lo mismo que npx.

Descarga la herramienta temporalmente y la ejecuta.

Si en el futuro trabajas con pnpm, utilizarás con frecuencia pnpm dlx en lugar de npx.

8. Errores comunes
Error 1

Instalar globalmente todo.

npm install -g vite

No es necesario para crear proyectos con Vite.

Error 2

Pensar que npx añade paquetes al proyecto.

No los añade.

Después de ejecutar:

npx create-vite@latest

No encontrarás create-vite en el package.json del proyecto recién creado.

La herramienta solo se utilizó para generar la estructura inicial.

Error 3

Confundir el generador con la librería final.

Por ejemplo:

npx create-vite@latest

create-vite no es Vite.

Es un programa cuya única misión es crear un nuevo proyecto configurado con Vite.

Después de generar el proyecto, quien queda instalado como dependencia es vite, no create-vite.

Ejemplo completo
npx create-vite@latest mi-app

↓

Descarga create-vite

↓

Ejecuta el asistente

↓

Crea la carpeta mi-app

↓

Escribe package.json

↓

Añade Vite como dependencia del proyecto

↓

Termina

El generador desaparece.

El proyecto permanece.

Buenas prácticas
Utiliza npx (o pnpm dlx) para herramientas de creación de proyectos.
Instala localmente (devDependencies) las herramientas que utilizarás durante el desarrollo, como ESLint o TypeScript.
Evita instalar globalmente herramientas que cada proyecto puede gestionar por sí mismo.
Comprueba siempre el comando oficial de la documentación, ya que algunos proyectos recomiendan pnpm dlx, otros npx y otros incluso bunx.
Conceptos clave
npm gestiona dependencias.
npx ejecuta paquetes.
npx descarga temporalmente una herramienta si es necesario.
No modifica el package.json del proyecto cuando ejecuta herramientas puntuales.
pnpm dlx cumple el mismo papel en el ecosistema de pnpm.