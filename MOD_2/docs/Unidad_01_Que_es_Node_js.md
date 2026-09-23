# Unidad 01 — ¿Qué es Node.js?

## Objetivos

Al terminar esta unidad sabrás:

- Qué es Node.js y por qué existe.
- Qué **no** es Node.js (no es un lenguaje nuevo).
- Por qué un frontend con React necesita Node en el ordenador.

---

## 1. La pregunta que lo cambió todo

En 2009, Ryan Dahl se planteó una idea sencilla:

> «¿Y si JavaScript pudiera ejecutarse **fuera del navegador**?»

De ahí nació **Node.js**.

Hasta ese momento, JavaScript solo vivía en el navegador (Chrome, Firefox…).  
Node permitió usar el **mismo lenguaje** en servidores, en la terminal y en herramientas de desarrollo.

---

## 2. ¿Qué es Node.js, en una frase?

**Node.js es un entorno (runtime) que permite ejecutar JavaScript fuera del navegador.**

Tres ideas clave:

| Idea | Explicación |
|------|-------------|
| **No es un lenguaje nuevo** | Sigue siendo JavaScript (mismas variables, funciones, bucles…) |
| **No reemplaza a JavaScript** | Lo complementa: le da un “hogar” fuera del navegador |
| **Añade superpoderes** | Archivos, servidores, red, terminal… que el navegador no te deja usar así |

---

## 3. ¿Qué puedes hacer con Node?

- Crear **servidores** web y APIs.
- **Leer y escribir archivos** en el disco.
- Conectarte a una **base de datos**.
- Escuchar **peticiones HTTP** (que alguien abra tu web o llame a tu API).
- **Automatizar tareas** (renombrar archivos, generar informes…).
- Ejecutar las **herramientas de desarrollo** que usas cada día: Vite, ESLint, TypeScript, Vitest…

> **Dato para el curso:** la mayoría de frontend no usa Node “para montar servidores”, sino para **ejecutar Vite y npm**. Eso lo verás todo el curso.

---

## 4. Entonces… ¿por qué Node si React va en el navegador?

Es la duda **más común** al empezar. Vamos por partes.

### 4.1 React no solo “se ejecuta”: primero hay que construirlo

Escribes esto en un archivo `.jsx`:

```jsx
function App() {
  return <h1>Hola</h1>;
}
```

El **navegador no entiende JSX**.  
Tampoco entiende, por sí solo:

- `import` / `export` modernos de la forma que los usa React.
- TypeScript (que hay que convertir a JavaScript).
- Muchos casos de “optimizar el bundle” para producción.

Necesitas una herramienta que **transforme** tu código en JavaScript estándar y optimizado.

### 4.2 Esa herramienta se ejecuta con Node.js

Ejemplos de herramientas que **viven en Node**:

- **Vite** → servidor de desarrollo y build (el que usarás en este curso)
- **Webpack** → bundler clásico
- **Babel** → traductor de sintaxis moderna/JSX
- **ESBuild** → transformador ultra rápido (usado por Vite)

Sin Node, en tu ordenador **no podrías lanzar** `npm create vite`, `pnpm dev`, etc.

### 4.3 Flujo completo (guárdalo)

```text
  Tú escribes código React (JSX)
              │
              ▼
     Node.js ejecuta Vite
              │
              ▼
   Vite transforma y empaqueta
              │
              ▼
  JavaScript que el navegador SÍ entiende
              │
              ▼
         Navegador (React se ejecuta aquí)
```

**Idea clave (para el examen y para la vida):**

> React **no necesita** Node para **ejecutarse** en el navegador,  
> pero **sí necesita** Node **durante el desarrollo** para construir, transformar y servir la aplicación.

---

## 5. Cómo comprobar que lo tienes instalado

Abre la terminal (PowerShell en Windows, zsh/bash en Mac/Linux):

```bash
node -v
npm -v
```

Ejemplo de salida:

```text
v22.x.x
10.x.x
```

- Si salen números → Node y npm están bien instalados.
- Si sale *«no se reconoce el comando»* → instala Node desde [nodejs.org](https://nodejs.org) (LTS) y vuelve a abrir la terminal.

**npm viene incluido con Node** (no hace falta instalarlo aparte).

---

## 6. Errores comunes de principiantes

| Error / duda | Realidad |
|--------------|----------|
| «¿Node es otro lenguaje?» | No. Es JavaScript + un entorno para ejecutarlo. |
| «Si React va al navegador, borro Node» | No. Sin Node no podrías usar Vite ni npm. |
| «Escribo `document` y falla en Node» | Correcto: `document` es del navegador, no de Node. |
| «Instalo Node y no veo npm» | Revisa la versión con `npm -v`; casi siempre viene solo. |

---

## 7. Mini repaso (autoevaluación)

Conteste sin mirar:

1. ¿Qué es Node.js en una frase?
2. ¿Node.js es un lenguaje nuevo?
3. ¿Quién necesita Node: el navegador al abrir la web, o tu equipo al desarrollar?
4. Nombra tres cosas que puedes hacer con Node.
5. ¿Qué herramienta de este curso se ejecuta con Node para levantar tu app React?

<details>
<summary><strong>Respuestas</strong></summary>

1. Un entorno para ejecutar JavaScript fuera del navegador.  
2. No; es el mismo JavaScript.  
3. Tu equipo **al desarrollar** (Vite/npm). El navegador ejecuta el JS ya construido.  
4. Servidores, archivos, bases de datos, automatización, herramientas de dev (cualquieras de la lista).  
5. Vite (vía `pnpm dev` / `npm run dev`).

</details>

---

## Conceptos clave

- **Node.js** = runtime para JavaScript fuera del navegador.
- No es un lenguaje distinto; añade APIs (archivos, red, process…) al lenguaje.
- En este curso, Node sirve sobre todo para **instalar dependencias** y **ejecutar Vite**.
- `node -v` y `npm -v` comprueban la instalación.
- JSX y TypeScript se transforman con herramientas de Node **antes** de que el navegador los vea.
