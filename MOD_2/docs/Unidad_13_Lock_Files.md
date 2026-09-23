# Unidad 13 — Lock Files

## Objetivos

- Entender por qué el mismo `package.json` puede producir instalaciones distintas en dos equipos.
- Comprender qué es un Lock File y qué información guarda exactamente.
- Conocer el Lock File de cada gestor de paquetes (npm, pnpm, Yarn).
- Diferenciar `package.json` del Lock File y saber cuándo cambia cada uno.
- Aprender buenas prácticas: versionar el Lock File, no editarlo a mano, no borrarlo sin motivo.

## Requisitos

- Saber qué es `package.json` y el campo `dependencies`.
- Haber ejecutado `npm install` en un proyecto.
- Tener una noción básica de Git (saber qué significa subir un proyecto a GitHub).
- (Recomendado) Haber leído la Unidad 12 sobre `node_modules`.

---

Supongamos que creamos un proyecto React.

Nuestro `package.json` contiene:

```json
{
  "dependencies": {
    "react": "^19.0.0"
  }
}
```

Todo parece correcto.

Subimos el proyecto a GitHub.

Nuestro compañero lo descarga.

Ejecuta:

```bash
npm install
```

Y...

Su aplicación falla.

¿Cómo es posible si ambos tenemos el mismo `package.json`?

La respuesta está en los Lock Files.

## El problema

Veamos este ejemplo.

Hoy existe la versión:

```text
React 19.0.0
```

Nuestro `package.json` dice:

```json
{
  "dependencies": {
    "react": "^19.0.0"
  }
}
```

Mañana aparece:

```text
React 19.1.0
```

Nuestro compañero instala el proyecto.

¿Instalará la `19.0.0` o la `19.1.0`?

Depende.

Y ahí aparece el problema: dos personas con el mismo `package.json` pueden terminar con versiones distintas en su disco.

### ¿Qué significa el símbolo ^?

Por ahora basta con entender esto:

```text
^19.0.0
```

No significa:

> Instala exactamente la 19.0.0.

Significa algo parecido a:

> Instala una versión compatible.

Más adelante dedicaremos una unidad completa a SemVer, pero de momento quédate con la idea de que el `package.json` suele expresar rangos de versiones, no una versión única.

## ¿Qué es un Lock File?

Un Lock File es un archivo generado automáticamente por el gestor de paquetes.

Su objetivo es responder una pregunta muy sencilla:

> ¿Qué versiones exactas se instalaron la primera vez?

No las compatibles.

No las más recientes.

Las exactas.

### Una analogía

Imagina que una receta dice:

- Harina
- Azúcar
- Leche

Cada cocinero podría comprar una marca distinta, y el resultado final variaría un poco en cada cocina.

Ahora imagina que la receta dice:

- Harina Marca X
- Azúcar Marca Y
- Leche Marca Z

Ahora todos utilizarán exactamente los mismos ingredientes, y todos obtendrán el mismo resultado.

Eso hace un Lock File: convierte una lista de "cosas compatibles" en una lista concreta de "esta versión exacta de cada cosa".

## Tipos de Lock Files

Cada gestor de paquetes utiliza el suyo, con su propio nombre y formato, pero todos persiguen la misma meta.

| Gestor | Lock File |
| --- | --- |
| npm | `package-lock.json` |
| pnpm | `pnpm-lock.yaml` |
| Yarn | `yarn.lock` |

Todos cumplen el mismo objetivo:

Garantizar instalaciones reproducibles (que cada equipo obtenga exactamente el mismo árbol de dependencias).

## ¿Por qué package.json no es suficiente?

Volvamos al ejemplo.

```json
{
  "dependencies": {
    "axios": "^1.8.0"
  }
}
```

Este archivo dice:

> Necesito Axios.

Pero no dice exactamente:

- qué versión se instaló,
- qué dependencias internas tenía,
- qué versiones de esas dependencias se descargaron.

Toda esa información queda registrada en el Lock File. El `package.json` es el *deseo*; el Lock File es el *resultado* de esa instalación.

## ¿Qué ocurre durante una instalación?

Supongamos que ejecutamos:

```bash
npm install
```

Internamente sucede algo parecido a esto:

```text
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
```

La próxima vez que ejecutes:

```bash
npm install
```

ya no tendrá que volver a calcular todas las versiones si el Lock File está presente; utilizará la información almacenada en él para recrear exactamente el mismo árbol de dependencias.

## Anatomía de un package-lock.json

Un ejemplo muy simplificado:

```json
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
```

Observa la diferencia.

En `package.json`:

```text
React ^19.0.0
```

En `package-lock.json`:

```text
React 19.0.0
```

El Lock File registra la versión exacta instalada (sin el `^`), junto con toda la estructura interna de paquetes.

## ¿Quién genera este archivo?

Nunca debemos escribirlo nosotros.

Lo generan automáticamente los gestores de paquetes:

- npm
- pnpm
- Yarn

Cada vez que instalamos, eliminamos o actualizamos dependencias. Tu única tarea es dejar que hagan su trabajo.

## ¿Cuándo cambia?

Supongamos:

```bash
npm install axios
```

El Lock File cambia.

Ahora:

```bash
npm uninstall axios
```

También cambia.

Si ejecutamos:

```bash
npm update
```

Es posible que vuelva a cambiar.

En resumen:

Siempre que el árbol de dependencias cambie, el Lock File también puede cambiar. Por eso sus cambios aparecen en `git status` después de tocar dependencias, y eso es normal.

## ¿Debe subirse a Git?

Esta es una de las preguntas más frecuentes.

La respuesta es:

Sí.

A diferencia de `node_modules`, el Lock File sí debe versionarse.

¿Por qué?

Porque queremos que todos los desarrolladores instalen exactamente las mismas versiones.

Un proyecto profesional suele incluir archivos como:

```text
Proyecto
├── package.json
├── package-lock.json
└── .gitignore
```

Mientras que `node_modules` aparece en `.gitignore`, el Lock File forma parte del repositorio.

## ¿Qué pasa si lo borramos?

Si eliminamos:

```text
package-lock.json
```

y ejecutamos:

```bash
npm install
```

npm generará uno nuevo.

Sin embargo, puede resolver las dependencias de forma diferente si desde la última instalación se han publicado nuevas versiones compatibles.

Por eso eliminar el Lock File sin un motivo claro puede hacer que distintos desarrolladores obtengan árboles de dependencias diferentes (justo el problema que veníamos a evitar).

## Diferencias entre package.json y el Lock File

| package.json | Lock File |
| --- | --- |
| Lo editamos nosotros | Lo genera el gestor de paquetes |
| Describe el proyecto | Describe la instalación concreta |
| Define rangos de versiones (`^19.0.0`) | Guarda versiones exactas (`19.0.0`) |
| Se utiliza para configurar el proyecto | Se utiliza para reproducir la instalación |

## ¿Por qué es tan importante en equipos?

Imagina este escenario **sin** Lock File:

```text
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
```

Aunque ambos tengan el mismo código, podrían aparecer comportamientos distintos (y el típico "en mi máquina funciona").

Con un Lock File compartido:

```text
Ana
   ↓
React 19.0.0
----------------------
Luis
   ↓
React 19.0.0
```

El entorno es consistente para todos.

## Buenas prácticas

- Incluye siempre el Lock File en el repositorio: es la garantía de que todos instalan lo mismo.
- No lo edites manualmente; lo escribe y actualiza el gestor de paquetes.
- No elimines el Lock File como solución automática a cualquier problema (borra `node_modules` y reinstala primero).
- Si cambias de gestor de paquetes (por ejemplo, de npm a pnpm), utiliza únicamente el Lock File correspondiente a ese gestor y elimina el antiguo.
- Revisa los cambios del Lock File en las revisiones de código cuando se añadan o actualicen dependencias: ahí se ven las versiones exactas que entran al proyecto.

## Conceptos clave

- Un Lock File registra las versiones exactas de todas las dependencias instaladas.
- Garantiza instalaciones reproducibles entre distintos desarrolladores y entornos.
- Cada gestor de paquetes tiene su propio formato de Lock File (`package-lock.json`, `pnpm-lock.yaml`, `yarn.lock`).
- Debe incluirse en el control de versiones, a diferencia de `node_modules`.
- Es un archivo generado automáticamente y no suele modificarse a mano.
- El `package.json` define rangos; el Lock File fija la instalación concreta.
