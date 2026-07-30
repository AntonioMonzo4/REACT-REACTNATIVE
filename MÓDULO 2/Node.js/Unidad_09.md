Introducción

Si alguna vez has creado un proyecto React, seguramente habrás visto esto:

mi-proyecto/

├── node_modules/
├── package.json
├── package-lock.json
└── src/

Y probablemente alguien te dijo:

"No entres ahí."

O peor aún:

"No toques esa carpeta."

Pero...

¿Qué hay realmente dentro?

¿Qué es node_modules?

Es la carpeta donde el gestor de paquetes instala todas las dependencias del proyecto.

Por ejemplo:

npm install react

Después aparecerá:

node_modules/

└── react/

Pero React no viene solo.

También instala otras librerías.

node_modules/

├── react/
├── scheduler/
├── loose-envify/
├── js-tokens/
└── ...
Una analogía

Imagina que construyes una casa.

Necesitas:

ladrillos
cemento
puertas
ventanas

Cuando compras el material lo guardas en un almacén.

Ese almacén sería:

node_modules

Mientras construyes, vas utilizando ese material.

¿Cuándo se crea?

No existe desde el principio.

Supongamos este proyecto.

mi-proyecto/

package.json

Ejecutamos:

npm install

Entonces ocurre:

package.json

↓

npm

↓

Descarga paquetes

↓

Crea node_modules
¿Quién la crea?

Nunca la creamos nosotros.

La crean automáticamente:

npm
pnpm
Yarn

Nosotros únicamente ejecutamos comandos.

¿Qué contiene?

Aquí aparece un error muy común.

Muchos creen que solo contiene las librerías que instalaron.

Por ejemplo:

npm install axios

Piensan que aparecerá únicamente:

node_modules/

└── axios/

Pero no.

Dependencias transitivas

Axios depende de otras librerías.

Axios

↓

follow-redirects

Así que npm instala ambas.

node_modules/

├── axios/
└── follow-redirects/

Ahora imagina una aplicación React.

React

↓

Paquete A

↓

Paquete B

↓

Paquete C

Cuando instalas React realmente estás instalando un árbol de dependencias.

Dependencias directas

Son las que tú instalas.

Ejemplo:

npm install react axios
Proyecto

├── React
└── Axios
Dependencias transitivas

Son las dependencias de tus dependencias.

Proyecto

├── React
│
│   ├── Scheduler
│
│   └── Loose-envify
│
└── Axios
    │
    └── Follow-redirects

Tú nunca escribiste:

npm install scheduler

Sin embargo, está instalado.

Porque React lo necesita.

¿Cómo encuentra Node.js un módulo?

Supongamos este código.

import React from "react";

¿Cómo sabe Node.js dónde está React?

No existe una ruta.

No escribimos:

import React from "./node_modules/react";

Entonces...

¿cómo lo encuentra?

Module Resolution

Node.js sigue un algoritmo muy preciso.

Supongamos esta estructura.

mi-proyecto/

│

├── node_modules/

│      └── react/

│

└── src/

       └── App.js

Cuando encuentra:

import React from "react";

hace algo parecido a esto:

¿Existe node_modules?

↓

Sí

↓

¿Existe react?

↓

Sí

↓

Lo carga
¿Y si no lo encuentra?

Sube un nivel.

Proyecto

↓

node_modules

↓

No existe

↓

Sube una carpeta

↓

Busca otro node_modules

Este comportamiento permite reutilizar dependencias en algunas estructuras de proyectos, como los monorepos.

¿Qué archivo carga?

Supongamos:

react/

├── package.json
├── index.js
└── ...

Node primero abre:

package.json

Busca:

{
    "main": "index.js"
}

o

{
    "exports": { ... }
}

Y entonces sabe cuál es el archivo de entrada de esa librería.

¿Por qué pesa tanto?

Esta es probablemente la pregunta más frecuente.

Imagina esto.

Instalas:

npm install react

No ocupa únicamente React.

Instalas:

React.
Sus dependencias.
Las dependencias de esas dependencias.
Las dependencias de esas dependencias...

El árbol puede crecer rápidamente.

Por ejemplo:

Proyecto

↓

React

↓

20 paquetes

↓

100 paquetes

↓

250 paquetes

Cada uno contiene:

JavaScript.
Archivos de configuración.
Tipos de TypeScript.
Licencias.
Documentación.
Recursos adicionales.
Un ejemplo real

Un proyecto recién creado con Vite y React puede contener cientos de paquetes en node_modules, aunque tú solo hayas instalado unas pocas dependencias de forma explícita.

No significa que hayas hecho algo mal: es consecuencia del árbol de dependencias que necesita el ecosistema moderno.

¿Por qué no se sube a Git?

Supongamos:

Proyecto

│

├── node_modules/

└── package.json

Si haces:

git add .

Subirías miles de archivos.

Esto tiene varios problemas:

El repositorio crecería enormemente.
Los clones serían mucho más lentos.
Se versionarían archivos generados automáticamente.
Cualquier desarrollador puede recrearlos con npm install o pnpm install.

Por eso node_modules aparece casi siempre en .gitignore.

¿Qué pasa si la borramos?

Nada grave.

Puedes eliminarla completamente.

Después ejecutar:

npm install

o

pnpm install

Y el gestor volverá a crearla a partir de la información de package.json y del archivo de bloqueo (package-lock.json o pnpm-lock.yaml).

Esto demuestra que node_modules es un artefacto generado, no una parte del código fuente.

¿Qué problemas tiene node_modules?

Aunque funciona muy bien, tiene algunas limitaciones.

Por ejemplo:

Puede ocupar mucho espacio en disco.
Dos proyectos distintos pueden almacenar copias de la misma dependencia.
La estructura puede llegar a ser muy grande.

Precisamente estos problemas motivaron la aparición de gestores como pnpm, que estudiaremos más adelante.

Buenas prácticas
No modifiques archivos dentro de node_modules; cualquier reinstalación sobrescribirá esos cambios.
No subas node_modules al repositorio Git.
Si aparecen errores extraños relacionados con dependencias, una solución habitual es borrar node_modules y reinstalar.
Recuerda que la carpeta se genera automáticamente y no forma parte del código fuente.
Conceptos clave
node_modules contiene todas las dependencias necesarias para el proyecto.
Incluye tanto dependencias directas como transitivas.
Node.js utiliza un algoritmo de resolución de módulos para encontrar los paquetes.
El archivo package.json de cada paquete indica cuál es su punto de entrada.
El gran tamaño de node_modules se debe al árbol completo de dependencias.
Es una carpeta generada automáticamente y no debe versionarse con Git.