Introducción

Supongamos que creamos un proyecto React.

Nuestro package.json contiene:

{
    "dependencies": {
        "react": "^19.0.0"
    }
}

Todo parece correcto.

Subimos el proyecto a GitHub.

Nuestro compañero lo descarga.

Ejecuta:

npm install

Y...

Su aplicación falla.

¿Cómo es posible si ambos tenemos el mismo package.json?

La respuesta está en los Lock Files.

El problema

Veamos este ejemplo.

Hoy existe la versión:

React 19.0.0

Nuestro package.json dice:

{
    "dependencies": {
        "react": "^19.0.0"
    }
}

Mañana aparece:

React 19.1.0

Nuestro compañero instala el proyecto.

¿Instalará:

19.0.0

o

19.1.0

Depende.

Y ahí aparece el problema.

¿Qué significa el símbolo ^?

Por ahora basta con entender esto.

^19.0.0

No significa:

Instala exactamente la 19.0.0

Significa algo parecido a:

Instala una versión compatible.

Más adelante dedicaremos una unidad completa a SemVer, pero de momento quédate con la idea de que el package.json suele expresar rangos de versiones, no una versión única.

¿Qué es un Lock File?

Un Lock File es un archivo generado automáticamente por el gestor de paquetes.

Su objetivo es responder una pregunta muy sencilla:

¿Qué versiones exactas se instalaron la primera vez?

No las compatibles.

No las más recientes.

Las exactas.

Una analogía

Imagina que una receta dice:

Harina

Azúcar

Leche

Cada cocinero podría comprar una marca distinta.

Ahora imagina que la receta dice:

Harina Marca X

Azúcar Marca Y

Leche Marca Z

Ahora todos utilizarán exactamente los mismos ingredientes.

Eso hace un Lock File.

Tipos de Lock Files

Cada gestor de paquetes utiliza el suyo.

Gestor	Lock File
npm	package-lock.json
pnpm	pnpm-lock.yaml
Yarn	yarn.lock

Todos cumplen el mismo objetivo.

Garantizar instalaciones reproducibles.

¿Por qué package.json no es suficiente?

Volvamos al ejemplo.

{
    "dependencies": {
        "axios": "^1.8.0"
    }
}

Este archivo dice:

Necesito Axios.

Pero no dice exactamente:

qué versión se instaló,
qué dependencias internas tenía,
qué versiones de esas dependencias se descargaron.

Toda esa información queda registrada en el Lock File.

¿Qué ocurre durante una instalación?

Supongamos que ejecutamos:

npm install

Internamente sucede algo parecido a esto.

Lee package.json

↓

Calcula versiones

↓

Descarga paquetes

↓

Resuelve dependencias

↓

Crea node_modules

↓

Genera package-lock.json

La próxima vez:

npm install

ya no tendrá que volver a calcular todas las versiones si el Lock File está presente; utilizará la información almacenada en él para recrear exactamente el mismo árbol de dependencias.

Anatomía de un package-lock.json

Un ejemplo muy simplificado:

{
    "name": "mi-proyecto",
    "version": "1.0.0",
    "lockfileVersion": 3,
    "packages": {
        "": {
            "dependencies": {
                "react": "^19.0.0"
            }
        },
        "node_modules/react": {
            "version": "19.0.0"
        }
    }
}

Observa la diferencia.

En package.json:

React ^19.0.0

En package-lock.json:

React 19.0.0

El Lock File registra la versión exacta instalada.

¿Quién genera este archivo?

Nunca debemos escribirlo nosotros.

Lo generan automáticamente:

npm
pnpm
Yarn

Cada vez que instalamos, eliminamos o actualizamos dependencias.

¿Cuándo cambia?

Supongamos:

npm install axios

El Lock File cambia.

Ahora:

npm uninstall axios

También cambia.

Si ejecutamos:

npm update

Es posible que vuelva a cambiar.

En resumen:

Siempre que el árbol de dependencias cambie, el Lock File también puede cambiar.

¿Debe subirse a Git?

Esta es una de las preguntas más frecuentes.

La respuesta es:

Sí.

A diferencia de node_modules, el Lock File sí debe versionarse.

¿Por qué?

Porque queremos que todos los desarrolladores instalen exactamente las mismas versiones.

Un proyecto profesional suele incluir archivos como:

Proyecto

├── package.json
├── package-lock.json
└── .gitignore

Mientras que node_modules aparece en .gitignore, el Lock File forma parte del repositorio.

¿Qué pasa si lo borramos?

Si eliminamos:

package-lock.json

y ejecutamos:

npm install

npm generará uno nuevo.

Sin embargo, puede resolver las dependencias de forma diferente si desde la última instalación se han publicado nuevas versiones compatibles.

Por eso eliminar el Lock File sin un motivo claro puede hacer que distintos desarrolladores obtengan árboles de dependencias diferentes.

Diferencias entre package.json y el Lock File
package.json	Lock File
Lo editamos nosotros	Lo genera el gestor de paquetes
Describe el proyecto	Describe la instalación concreta
Define rangos de versiones	Guarda versiones exactas
Se utiliza para configurar el proyecto	Se utiliza para reproducir la instalación
¿Por qué es tan importante en equipos?

Imagina este escenario.

Ana

↓

npm install

↓

React 19.0.0

----------------------

Luis

↓

npm install

↓

React 19.1.0

Aunque ambos tengan el mismo código, podrían aparecer comportamientos distintos.

Con un Lock File compartido:

Ana

↓

React 19.0.0

----------------------

Luis

↓

React 19.0.0

El entorno es consistente para todos.

Buenas prácticas
Incluye siempre el Lock File en el repositorio.
No lo edites manualmente.
No elimines el Lock File como solución automática a cualquier problema.
Si cambias de gestor de paquetes (por ejemplo, de npm a pnpm), utiliza únicamente el Lock File correspondiente a ese gestor.
Revisa los cambios del Lock File en las revisiones de código cuando se añadan o actualicen dependencias.
Conceptos clave
Un Lock File registra las versiones exactas de todas las dependencias instaladas.
Garantiza instalaciones reproducibles entre distintos desarrolladores y entornos.
Cada gestor de paquetes tiene su propio formato de Lock File.
Debe incluirse en el control de versiones.
Es un archivo generado automáticamente y no suele modificarse a mano.



