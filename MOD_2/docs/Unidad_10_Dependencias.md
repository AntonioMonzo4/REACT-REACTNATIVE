# Unidad 10 — Dependencias

## Objetivos

- Saber qué es una **dependencia**.
- Diferenciar `dependencies` de `devDependencies`.
- Conocer campos avanzados: `peerDependencies`, `engines`, `exports`, etc.

---

## 1. ¿Qué es una dependencia?

Una **dependencia** es cualquier paquete que nuestro proyecto necesita para funcionar.

Por ejemplo:

```js
import React from "react";
```

Como utilizamos React, debemos instalarlo. En ese momento, React pasa a ser una dependencia del proyecto.

---

## 2. Campo `dependencies`

Ejemplo:

```json
{
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "axios": "^1.8.0"
  }
}
```

Estas librerías son necesarias para que la **aplicación funcione**.

Si eliminamos React de una aplicación React, el proyecto dejará de funcionar.

### ¿Qué ocurre al instalar una dependencia?

Supongamos:

```bash
npm install axios
```

Internamente npm hace varias cosas (todas automáticamente):

```text
Descarga Axios
      ↓
Lo instala en node_modules
      ↓
Añade Axios a "dependencies" en package.json
      ↓
Actualiza package-lock.json
```

El resultado en `package.json`:

```json
{
  "dependencies": {
    "axios": "^1.8.0"
  }
}
```

---

## 3. ¿Qué es `devDependencies`?

No todas las librerías son necesarias cuando la aplicación ya está en **producción** (en el servidor o en el navegador del usuario final).

Ejemplos de herramientas solo de desarrollo:

- ESLint
- Prettier
- TypeScript
- Vite
- Vitest

Estas herramientas solo se utilizan **mientras programas y construyes**. Por eso van aquí:

```json
{
  "devDependencies": {
    "vite": "^7.0.0",
    "eslint": "^9.0.0"
  }
}
```

### Analogía (carpintero)

Para **fabricar una mesa** necesitas:

- Madera, tornillos, cola → serían **`dependencies`** (forman parte de la mesa terminada).
- Martillo, sierra, taladro → serían **`devDependencies`** (herramientas para construirla; la mesa terminada no las “lleva dentro”).

### Comparativa

| | `dependencies` | `devDependencies` |
|--|----------------|-------------------|
| ¿Cuándo se usan? | Para **ejecutar** la app | Solo para **desarrollarla** |
| ¿En producción? | Sí | No (se omiten con `npm ci --omit=dev`, etc.) |
| Ejemplos | React, Axios, React Router | Vite, ESLint, TypeScript, Vitest |

### ¿Cómo se instalan?

Dependencias normales:

```bash
npm install react
# o con pnpm
pnpm add react
```

Dependencias de desarrollo:

```bash
npm install --save-dev eslint
# forma corta
npm install -D eslint
# con pnpm
pnpm add -D eslint
```

### Error muy común

Muchos desarrolladores meten **todo** en `dependencies`. No es lo correcto:

```json
{
  "dependencies": {
    "eslint": "...",
    "prettier": "...",
    "vite": "..."
  }
}
```

Aunque la aplicación funcione, estás indicando que esas herramientas son necesarias en producción, cuando en realidad solo las utilizas para desarrollar.

Mantener una separación clara ayuda a entender el proyecto y evita instalar paquetes innecesarios en algunos entornos.

### Buenas prácticas (dependencies vs devDependencies)

- Coloca en **dependencies** únicamente las librerías necesarias para **ejecutar** la aplicación en producción.
- Coloca en **devDependencies** las herramientas que solo usas **mientras desarrollas** (Vite, ESLint, TypeScript, Vitest…).
- Si no estás seguro, piensa: «¿La app en el servidor o en el navegador necesita este paquete **después del build**?» → dependencies. Si solo lo usas tú al programar → devDependencies.

A continuación veremos campos más avanzados de `package.json` que aparecen en librerías y proyectos profesionales.

---

## 4. ¿Por qué existen campos avanzados?

Hasta ahora hemos visto campos que aparecen en casi cualquier proyecto:

- `name`
- `version`
- `scripts`
- `dependencies`
- `devDependencies`

Pero si inspeccionas el `package.json` de React, Vite o cualquier librería popular, encontrarás muchos más.

**¿Por qué?** Porque `package.json` no solo describe **aplicaciones**, también describe **librerías** que otros desarrolladores instalarán.

---

## 4.1 `peerDependencies`

Este es uno de los conceptos más difíciles para los principiantes.

Supongamos que desarrollas una librería llamada `mi-react-ui` que internamente utiliza React:

```text
mi-react-ui
      │
      ▼
   React
```

Una primera idea sería instalar React como dependencia:

```json
{
  "dependencies": {
    "react": "^19.0.0"
  }
}
```

Parece correcto… hasta que pasa esto en la app que usa tu librería:

```text
Mi aplicación
      │
      ├── React 19          ← copia 1
      │
      └── mi-react-ui
              │
              └── React 19   ← copia 2
```

**Problema:** existen **dos instalaciones** de React. React mantiene estado interno y espera ser **una única instancia compartida**. Dos copias = errores muy difíciles de depurar.

**La solución:** en vez de instalar React tú, declaras:

> «Yo necesito React, pero espero que quien instale mi librería ya lo tenga.»

```json
{
  "peerDependencies": {
    "react": "^19.0.0"
  }
}
```

Resultado:

```text
Aplicación
   ├── React          ← solo una copia
   └── mi-react-ui    ← usa el React de la app
```

### ¿Cuándo usar `peerDependencies`?

- En **librerías**: componentes React, plugins de ESLint, Vite, Webpack, Babel…
- **No** suele usarse en aplicaciones normales (tú ya eres la app).

---

## 4.2 `optionalDependencies`

Algunas dependencias **no son imprescindibles**. Si fallan al instalarse, la app sigue funcionando con funciones reducidas.

```json
{
  "optionalDependencies": {
    "sharp": "^0.34.0"
  }
}
```

Si `sharp` falla (p. ej. binario incompatible con tu SO), npm **continúa** sin abortar. Útil para paquetes con compilaciones nativas.

---

## 4.3 `engines`

Indica qué versiones de herramientas son **compatibles** con el proyecto:

```json
{
  "engines": {
    "node": ">=20",
    "npm": ">=10"
  }
}
```

**¿Por qué importa?** Equipo real:

```text
Ana → Node 24 → funciona
Luis → Node 16 → error
```

Con `engines`, los gestores de paquetes avisan si tu versión no cumple.

---

## 4.4 `main`

Cuando publicas una **librería**, `main` dice cuál es su **punto de entrada**:

```json
{
  "main": "index.js"
}
```

Si alguien hace `import miLibreria from "mi-libreria"`, Node abre ese archivo (o usa `exports`, más moderno).

En una app React + Vite casi **no** tocarás este campo.

---

## 4.5 `exports`

Evolución de `main`: controla **qué archivos** de la librería son públicos.

```json
{
  "exports": {
    ".": "./dist/index.js"
  }
}
```

Así impides que otros importen archivos internos que no forman parte de la API pública. Muy usado en librerías modernas.

---

## 4.6 `files`

Al publicar en npm, no siempre quieres subir **todo** el proyecto:

```json
{
  "files": [
    "dist",
    "README.md"
  ]
}
```

Puedes excluir código fuente de prueba, configs internas, temporales, etc.

---

## 4.7 `private`

```json
{
  "private": true
}
```

**Bloquea** `npm publish` por accidente. Muy recomendable en apps React/Next/React Native (no son librerías para el registry).

---

## 4.8 Otros campos útiles

```json
{
  "homepage": "https://mi-app.com",
  "repository": "https://github.com/usuario/mi-app",
  "bugs": "https://github.com/usuario/mi-app/issues",
  "keywords": ["react", "ui"]
}
```

Aportan información a quien use o mantenga el proyecto.

---

## 4.9 Un `package.json` profesional

```json
{
  "name": "frontend-profesional",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "engines": {
    "node": ">=20"
  },
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "test": "vitest"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "vite": "^7.0.0",
    "eslint": "^9.0.0",
    "typescript": "^5.0.0",
    "vitest": "^3.0.0"
  }
}
```

La mayoría de aplicaciones usan una estructura muy parecida a esta.

### ¿Quién utiliza cada campo?

| Campo | Quién lo utiliza |
|-------|------------------|
| `name` | npm, Registry |
| `version` | npm |
| `scripts` | npm, pnpm, Yarn |
| `dependencies` | npm, pnpm, Yarn |
| `devDependencies` | npm, pnpm, Yarn |
| `peerDependencies` | Gestores de paquetes y librerías |
| `optionalDependencies` | Gestores de paquetes |
| `main` | Node.js |
| `exports` | Node.js y herramientas modernas |
| `engines` | npm, pnpm, Yarn |
| `private` | npm |

## Buenas prácticas

- Utiliza `peerDependencies` únicamente cuando desarrolles librerías o plugins.
- Define `engines` si tu proyecto depende de versiones concretas de Node.js.
- Mantén `private: true` en aplicaciones que no vayas a publicar.
- Publica solo los archivos necesarios utilizando `files`.
- Prefiere `exports` frente a `main` en librerías modernas para controlar mejor la API pública.

## Conceptos clave

- Una **dependencia** es un paquete que el proyecto necesita.
- `dependencies` → necesarias en **producción**; `devDependencies` → solo al **desarrollar**.
- `peerDependencies` → dependencias que **otro proyecto** (o quien instala la librería) debe proveer (p. ej. React en un kit de UI).
- `optionalDependencies` → si fallan, la instalación puede continuar.
- `engines` → versiones de Node/npm compatibles.
- `main` / `exports` → punto de entrada y API pública de una librería.
- `files` → qué se sube a npm al publicar.
- Muchos de estos campos son esenciales al desarrollar librerías; en una app React se usan con menos frecuencia.
