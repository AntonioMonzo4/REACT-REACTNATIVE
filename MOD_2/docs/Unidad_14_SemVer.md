# Unidad 14 — SemVer

## Objetivos

- Entender qué es SemVer (Versionado Semántico) y para qué sirve.
- Interpretar los tres números de una versión: MAJOR, MINOR y PATCH.
- Conocer las versiones de desarrollo (pre-release): alpha, beta y rc.
- Dominar los operadores de versión `^`, `~` y de comparación, con ejemplos de "válido / no válido".
- Relacionar SemVer con los lock files y con la decisión de npm a la hora de instalar.

## Requisitos

- Haber visto versiones de paquetes en un `package.json` (por ejemplo, `"react": "^19.0.0"`).
- Saber ejecutar `npm install`.
- (Recomendado) Haber leído la Unidad 13 sobre Lock Files, porque al final conectaremos ambos conceptos.
- No se requieren conocimientos previos de programación avanzada.

---

## 1. ¿Qué es SemVer?

SemVer significa **Semantic Versioning** (Versionado Semántico).

Es un estándar que define cómo numerar las versiones de un software para que otros desarrolladores sepan qué tipo de cambios incorpora una nueva versión, solo mirando los números.

La especificación oficial define un formato muy simple:

```text
MAJOR.MINOR.PATCH
```

Ejemplo:

```text
2.14.3
```

## 2. ¿Por qué existe?

Imagina que instalas React.

Hoy funciona perfectamente.

Mañana actualizas la librería y tu aplicación deja de funcionar.

¿Cómo sabes si esa actualización era segura?

Antes de SemVer, no había una forma consistente de comunicar el impacto de una nueva versión: cada proyecto numeraba como quería.

Con SemVer, el número de versión ya transmite información. Si cambió el primer número, hay que tener cuidado; si cambió el último, casi seguro es seguro actualizar.

## 3. Anatomía de una versión

Observa esta versión:

```text
3.8.12
```

Cada número tiene un significado:

```text
      3 . 8 . 12
      │   │    │
      │   │    └── PATCH
      │   └─────── MINOR
      └─────────── MAJOR
```

## 4. MAJOR

El primer número cambia cuando se introducen cambios incompatibles (*breaking changes*).

Ejemplo:

```text
React 18
   ↓
React 19
```

Puede que código antiguo deje de funcionar.

Normalmente será necesario adaptar parte de la aplicación.

Por eso un cambio de MAJOR suele requerir revisar la documentación antes de actualizar.

### Ejemplo

Supongamos una librería que tiene esta función:

```javascript
saludar(nombre)
```

En la siguiente versión cambia a:

```javascript
saludar(nombre, idioma)
```

El código anterior deja de funcionar correctamente (o al menos deja de comportarse igual).

Eso justifica incrementar el número MAJOR.

## 5. MINOR

El segundo número cambia cuando se añaden funcionalidades nuevas sin romper la compatibilidad.

Ejemplo:

```text
1.4.0
   ↓
1.5.0
```

Todo lo que funcionaba antes debería seguir funcionando.

Simplemente aparecen nuevas capacidades.

### Ejemplo

Una librería tiene:

```javascript
sumar(a, b)
```

En una nueva versión añade:

```javascript
multiplicar(a, b)
```

No ha eliminado nada.

Solo ha incorporado nuevas funciones.

Eso es un cambio MINOR: puedes adoptarlo con tranquilidad, porque nada de lo existente se rompe.

## 6. PATCH

El tercer número cambia cuando se corrigen errores sin modificar la API pública.

Ejemplo:

```text
1.5.2
   ↓
1.5.3
```

No aparecen funciones nuevas.

No desaparecen funciones.

Simplemente se corrigen errores o se mejora el rendimiento.

### Ejemplo

Una función calcula mal un impuesto en algunos casos.

Se corrige el algoritmo.

La interfaz no cambia.

Eso corresponde a un incremento PATCH.

## Resumen

| Tipo | Ejemplo | Significado |
| --- | --- | --- |
| MAJOR | 2.0.0 | Cambios incompatibles |
| MINOR | 1.4.0 | Nuevas funcionalidades compatibles |
| PATCH | 1.4.2 | Corrección de errores |

## 7. Versiones de desarrollo (Pre-release)

No todas las versiones son estables.

Es habitual encontrar versiones como:

```text
2.0.0-alpha
```

o

```text
2.0.0-beta
```

o

```text
2.0.0-rc.1
```

Estas etiquetas indican que la versión aún está en desarrollo y no debe usarse (salvo para probar) en producción.

### Alpha

```text
2.0.0-alpha
```

- Fase muy temprana.
- Puede contener errores importantes.
- Normalmente solo la utilizan los desarrolladores de la propia librería o quienes quieren probar novedades.

### Beta

```text
2.0.0-beta
```

- Más estable que Alpha.
- La mayoría de funcionalidades ya están implementadas.
- Se utiliza para recibir comentarios antes del lanzamiento definitivo.

### RC (Release Candidate)

```text
2.0.0-rc.1
```

- Prácticamente es la versión final.
- Solo se esperan pequeños ajustes o correcciones críticas antes del lanzamiento oficial.

## 8. Operadores de versión

Hasta ahora hemos visto versiones exactas.

Pero en `package.json` es habitual encontrar algo como esto:

```json
{
  "dependencies": {
    "react": "^19.1.0"
  }
}
```

¿Qué significa el símbolo `^`?

No significa:

> Instala exactamente la versión 19.1.0.

Significa:

> Instala una versión compatible según las reglas de SemVer.

Aquí es donde entran los operadores.

### Sin operador

```text
19.1.0
```

- Válido: solo esa versión exacta (`19.1.0`).
- No válido: cualquier otra (`19.1.1`, `19.2.0`, `20.0.0`).

### Operador ^

```text
^19.1.0
```

Permite actualizar cambios de PATCH y MINOR, pero no de MAJOR.

| Versión | ¿Válida con ^19.1.0? | Motivo |
| --- | --- | --- |
| 19.1.1 | Válido | Cambio de PATCH |
| 19.2.0 | Válido | Cambio de MINOR |
| 19.8.4 | Válido | Cambio de MINOR |
| 20.0.0 | No válido | Sería un cambio de MAJOR |

### Operador ~

```text
~19.1.0
```

Permite únicamente cambios PATCH (se mantiene el MINOR fijo).

| Versión | ¿Válida con ~19.1.0? | Motivo |
| --- | --- | --- |
| 19.1.1 | Válido | Cambio de PATCH |
| 19.1.5 | Válido | Cambio de PATCH |
| 19.1.20 | Válido | Cambio de PATCH |
| 19.2.0 | No válido | Cambio de MINOR |

### Operadores de comparación

También existen operadores como:

```text
>=20
<21
>=18 <20
```

Se utilizan para expresar rangos de versiones compatibles.

Los verás con frecuencia en el campo `engines` (que indica qué versión de Node.js necesita el proyecto) o en algunas librerías.

## 9. ¿Cómo decide npm qué instalar?

Supongamos este `package.json`:

```json
{
  "dependencies": {
    "react": "^19.1.0"
  }
}
```

En el registro existen estas versiones:

```text
19.1.0
19.1.1
19.2.0
19.3.4
20.0.0
```

Si no hay un lock file que fije una versión concreta, npm elegirá normalmente la versión más reciente que cumpla el rango especificado, es decir:

```text
19.3.4
```

No instalará la `20.0.0`, porque supondría un cambio MAJOR, que el operador `^` no permite.

## 10. Caso real

Imagina que publicas una aplicación con:

```text
Axios 1.8.0
```

En tu `package.json` escribes:

```text
^1.8.0
```

Un mes después aparece:

```text
1.9.0
```

Un compañero ejecuta:

```bash
npm install
```

Si el proyecto no tiene un lock file o este se ha regenerado, es posible que instale la `1.9.0` automáticamente porque sigue siendo compatible con el rango indicado.

Por eso los lock files son tan importantes: complementan a SemVer fijando una versión concreta para todo el equipo (los rangos dicen *qué se permite*, el lock file dice *qué se usó*).

## Buenas prácticas

- Comprende qué significa cada operador (`^`, `~`, `>=`...) antes de actualizar dependencias.
- Lee las notas de la versión (*release notes*) antes de aceptar un cambio MAJOR: ahí se listan las rupturas de compatibilidad.
- No asumas que una actualización es siempre segura, aunque el número parezca pequeño.
- Mantén actualizado el lock file junto con el `package.json` cuando cambies dependencias.

## Conceptos clave

- SemVer utiliza el formato MAJOR.MINOR.PATCH para comunicar el impacto de cada versión.
- Un cambio MAJOR puede romper compatibilidad con el código existente.
- Un cambio MINOR añade funcionalidades compatibles sin romper nada.
- Un cambio PATCH corrige errores sin modificar la API pública.
- Las versiones pre-release (`alpha`, `beta`, `rc`) indican software aún en desarrollo.
- Los operadores (`^`, `~`, `>=`, etc.) permiten definir rangos de versiones en el `package.json`.
- Con `^` son válidos PATCH y MINOR pero no MAJOR; con `~` solo es válido PATCH.
- npm utiliza esos rangos para decidir qué versión instalar cuando no hay una versión fijada por el lock file.
