Introducción

Cuando empiezas con React ejecutas comandos como:

npm run dev

o

pnpm dev

Y parece magia.

Pero realmente solo estás diciéndole a npm:

"Busca un script llamado dev y ejecútalo."

¿Qué problema resuelven los scripts?

Imagina un proyecto sin scripts.

Cada desarrollador tendría que recordar comandos como:

vite --host --port 3000

o

eslint src --fix

o

tsc --noEmit

o

vitest --watch

No solo serían largos, sino que cada miembro del equipo podría escribirlos de forma distinta.

La solución

Asignar un nombre sencillo a cada comando.

{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "test": "vitest"
  }
}

Ahora basta con escribir:

npm run dev
¿Qué ocurre internamente?

Cuando escribes:

npm run dev

npm hace aproximadamente esto:

Terminal

↓

npm

↓

Lee package.json

↓

Busca scripts

↓

Busca "dev"

↓

Encuentra:

vite

↓

Ejecuta vite

Es decir:

npm run dev

es equivalente a:

vite

pero con una diferencia muy importante.

¿Cómo encuentra Vite?

Supongamos esta estructura.

mi-proyecto/

├── node_modules/
│      └── .bin/
│            └── vite
│
└── package.json

Cuando ejecutas:

npm run dev

npm añade automáticamente la carpeta:

node_modules/.bin

al PATH del proceso.

Por eso puede encontrar el ejecutable de Vite aunque no esté instalado globalmente.

¿Qué es node_modules/.bin?

Dentro de node_modules existe una carpeta especial.

node_modules/

└── .bin/

Aquí npm coloca enlaces a los ejecutables de muchas dependencias.

Ejemplo:

.bin/

├── vite
├── eslint
├── prettier
├── tsc
└── vitest

Gracias a esto puedes ejecutar cualquiera de esas herramientas desde un script sin indicar la ruta completa.

Scripts automáticos

Hay algunos nombres que se han convertido en convenciones.

Por ejemplo:

{
  "scripts": {
    "dev": "...",
    "build": "...",
    "test": "...",
    "lint": "...",
    "start": "..."
  }
}

No son obligatorios, pero casi todos los proyectos modernos los utilizan porque resultan familiares para cualquier desarrollador.

Scripts personalizados

Puedes crear cualquier nombre.

{
  "scripts": {
    "saludar": "echo Hola Mundo"
  }
}

Después:

npm run saludar

Salida:

Hola Mundo

Esto demuestra que un script es simplemente un alias para un comando.

Encadenar scripts

Supongamos que quieres ejecutar varias tareas seguidas.

{
  "scripts": {
    "build": "vite build && vite preview"
  }
}

Flujo:

vite build

↓

termina correctamente

↓

vite preview

El operador && ejecuta el segundo comando solo si el primero finaliza sin errores.

Pasar argumentos

También puedes enviar argumentos al script.

npm run test -- --watch

El primer -- indica a npm:

"A partir de aquí, no interpretes más opciones; pásalas al comando."

Internamente se ejecutaría algo equivalente a:

vitest --watch
Variables de entorno

Un script puede utilizar variables de entorno.

Por ejemplo:

{
  "scripts": {
    "start": "NODE_ENV=production vite"
  }
}

Sin embargo, este formato no funciona igual en todos los sistemas operativos.

En Windows y Unix hay diferencias en la sintaxis.

Por eso es habitual utilizar herramientas como cross-env para escribir scripts portables.

Automatización en React

Piensa en todo lo que haces en un proyecto.

Desarrollar

↓

Compilar

↓

Analizar código

↓

Ejecutar tests

↓

Crear versión final

Cada paso puede asociarse a un script.

{
  "scripts": {
    "dev": "...",
    "build": "...",
    "lint": "...",
    "test": "...",
    "preview": "..."
  }
}

Esto permite que cualquier desarrollador ejecute exactamente las mismas tareas con los mismos comandos.

Ejemplo real

Un package.json de un proyecto React podría incluir:

{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "format": "prettier --write .",
    "test": "vitest"
  }
}

Fíjate en este script:

"build": "tsc && vite build"

No solo compila la aplicación.

Primero ejecuta TypeScript para comprobar errores y, solo si todo está correcto, genera la versión optimizada con Vite.

Este tipo de automatización es muy habitual en proyectos profesionales.

Scripts en npm vs pnpm

Si usas npm:

npm run dev

Si usas pnpm:

pnpm dev

pnpm detecta automáticamente que dev es un script y permite omitir la palabra run para los scripts más comunes.

Buenas prácticas
Utiliza nombres estándar (dev, build, test, lint, preview) siempre que sea posible.
Evita incluir lógica muy compleja en un único script; si crece demasiado, considera moverla a un archivo independiente.
Documenta los scripts importantes en el README.md del proyecto.
Aprovecha los scripts para automatizar tareas repetitivas y reducir errores humanos.
Conceptos clave
Los scripts son alias definidos en package.json para ejecutar comandos.
npm run lee el campo scripts y ejecuta el comando asociado.
npm añade temporalmente node_modules/.bin al PATH, permitiendo usar herramientas instaladas localmente.
Puedes crear scripts personalizados, encadenarlos y pasarles argumentos.
Los scripts son una de las herramientas de automatización más importantes del ecosistema JavaScript.