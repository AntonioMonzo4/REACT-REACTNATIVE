1. ¿Qué es SemVer?

SemVer significa Semantic Versioning (Versionado Semántico).

Es un estándar que define cómo numerar las versiones de un software para que otros desarrolladores sepan qué tipo de cambios incorpora una nueva versión.

La especificación oficial define un formato muy simple:

MAJOR.MINOR.PATCH

Ejemplo:

2.14.3
2. ¿Por qué existe?

Imagina que instalas React.

Hoy funciona perfectamente.

Mañana actualizas la librería y tu aplicación deja de funcionar.

¿Cómo sabes si esa actualización era segura?

Antes de SemVer, no había una forma consistente de comunicar el impacto de una nueva versión.

Con SemVer, el número de versión ya transmite información.

3. Anatomía de una versión

Observa esta versión:

3.8.12

Cada número tiene un significado:

      3 . 8 . 12
      │   │    │
      │   │    └── PATCH
      │   └─────── MINOR
      └─────────── MAJOR
4. MAJOR

El primer número cambia cuando se introducen cambios incompatibles (breaking changes).

Ejemplo:

React 18

↓

React 19

Puede que código antiguo deje de funcionar.

Normalmente será necesario adaptar parte de la aplicación.

Por eso un cambio de MAJOR suele requerir revisar la documentación antes de actualizar.

Ejemplo

Supongamos una librería que tiene esta función:

saludar(nombre)

En la siguiente versión cambia a:

saludar(nombre, idioma)

El código anterior deja de funcionar correctamente.

Eso justifica incrementar el número MAJOR.

5. MINOR

El segundo número cambia cuando se añaden funcionalidades nuevas sin romper la compatibilidad.

Ejemplo:

1.4.0

↓

1.5.0

Todo lo que funcionaba antes debería seguir funcionando.

Simplemente aparecen nuevas capacidades.

Ejemplo

Una librería tiene:

sumar(a, b)

En una nueva versión añade:

multiplicar(a, b)

No ha eliminado nada.

Solo ha incorporado nuevas funciones.

Eso es un cambio MINOR.

6. PATCH

El tercer número cambia cuando se corrigen errores sin modificar la API pública.

Ejemplo:

1.5.2

↓

1.5.3

No aparecen funciones nuevas.

No desaparecen funciones.

Simplemente se corrigen errores o se mejora el rendimiento.

Ejemplo

Una función calcula mal un impuesto en algunos casos.

Se corrige el algoritmo.

La interfaz no cambia.

Eso corresponde a un incremento PATCH.

Resumen
Tipo	Ejemplo	Significado
MAJOR	2.0.0	Cambios incompatibles
MINOR	1.4.0	Nuevas funcionalidades compatibles
PATCH	1.4.2	Corrección de errores
7. Versiones de desarrollo (Pre-release)

No todas las versiones son estables.

Es habitual encontrar versiones como:

2.0.0-alpha

o

2.0.0-beta

o

2.0.0-rc.1

Estas etiquetas indican que la versión aún está en desarrollo.

Alpha
2.0.0-alpha

Fase muy temprana.

Puede contener errores importantes.

Normalmente solo la utilizan los desarrolladores de la propia librería o quienes quieren probar novedades.

Beta
2.0.0-beta

Más estable que Alpha.

La mayoría de funcionalidades ya están implementadas.

Se utiliza para recibir comentarios antes del lanzamiento definitivo.

RC (Release Candidate)
2.0.0-rc.1

Prácticamente es la versión final.

Solo se esperan pequeños ajustes o correcciones críticas antes del lanzamiento oficial.

8. Operadores de versión

Hasta ahora hemos visto versiones exactas.

Pero en package.json es habitual encontrar algo como esto:

{
  "dependencies": {
    "react": "^19.1.0"
  }
}

¿Qué significa el símbolo ^?

No significa:

Instala exactamente la versión 19.1.0.

Significa:

Instala una versión compatible según las reglas de SemVer.

Aquí es donde entran los operadores.

Sin operador
19.1.0

Solo esa versión exacta.

Operador ^
^19.1.0

Permite actualizar:

PATCH
MINOR

Pero no MAJOR.

Ejemplos válidos:

19.1.1
19.2.0
19.8.4

Ejemplo no válido:

20.0.0
Operador ~
~19.1.0

Permite únicamente cambios PATCH.

Ejemplos válidos:

19.1.1
19.1.5
19.1.20

Ejemplo no válido:

19.2.0
Operadores de comparación

También existen operadores como:

>=20
<21
>=18 <20

Se utilizan para expresar rangos de versiones compatibles.

Los verás con frecuencia en el campo engines o en algunas librerías.

9. ¿Cómo decide npm qué instalar?

Supongamos este package.json:

{
  "dependencies": {
    "react": "^19.1.0"
  }
}

En el registro existen estas versiones:

19.1.0
19.1.1
19.2.0
19.3.4
20.0.0

Si no hay un lock file que fije una versión concreta, npm elegirá normalmente la versión más reciente que cumpla el rango especificado, es decir:

19.3.4

No instalará la 20.0.0, porque supondría un cambio MAJOR.

10. Caso real

Imagina que publicas una aplicación con:

Axios 1.8.0

En tu package.json escribes:

^1.8.0

Un mes después aparece:

1.9.0

Un compañero ejecuta:

npm install

Si el proyecto no tiene un lock file o este se ha regenerado, es posible que instale la 1.9.0 automáticamente porque sigue siendo compatible con el rango indicado.

Por eso los lock files son tan importantes: complementan a SemVer fijando una versión concreta para todo el equipo.

Buenas prácticas
Comprende qué significa cada operador antes de actualizar dependencias.
Lee las notas de la versión (release notes) antes de aceptar un cambio MAJOR.
No asumas que una actualización es siempre segura, aunque el número parezca pequeño.
Mantén actualizado el lock file junto con el package.json cuando cambies dependencias.
Conceptos clave
SemVer utiliza el formato MAJOR.MINOR.PATCH.
Un cambio MAJOR puede romper compatibilidad.
Un cambio MINOR añade funcionalidades compatibles.
Un cambio PATCH corrige errores sin modificar la API pública.
Los operadores (^, ~, >=, etc.) permiten definir rangos de versiones.
npm utiliza esos rangos para decidir qué versión instalar cuando no hay una versión fijada por el lock file.