# Unidad 01 — Jest y configuración

## Objetivos

- Entender **qué es un test automatizado** y por qué funciona como una red de seguridad para tu código.
- Diferenciar qué se prueba con **Jest/Vitest**, qué con **React Testing Library** y qué con **mocks/MSW**.
- Instalar y configurar **Vitest** (API de Jest) en un proyecto **Vite + React**.
- Escribir tu **primer test** con `describe`, `it` y `expect`.
- Usar los **matchers** más habituales (`toBe`, `toEqual`, `toThrow`, `toBeInTheDocument`…).
- Ejecutar la suite con los comandos reales del ejemplo (`pnpm test`, `pnpm test:run`, `pnpm coverage`).

## Requisitos

- Haber completado los módulos **M4 a M8** del roadmap:
  - **M4 — React desde Cero**: componentes, props, eventos, `useState`.
  - **M5 — React Intermedio**: `useReducer`, `useRef`, formularios.
  - **M6 — React Avanzado**, **M7 — React Router** y **M8 — Consumo de APIs** (`fetch`, `axios`).
- Conocer **pnpm** y la estructura de `package.json` (M2).
- No hace falta experiencia previa en testing: esta unidad parte de cero.
- **Secuencia entre unidades**: la 01 es la base obligatoria; después sigue la **Unidad 02** (RTL), que ya asume que Vitest está instalado y ejecutándose.

## Qué es un test (y por qué importa)

Un **test automatizado** es un programa pequeño que ejecuta tu código y **compara el resultado real con el resultado esperado**. Si coinciden, el test pasa (✅); si no, falla (❌) y te avisa.

**Analogía**: piensa en un test como en la **red de seguridad** o en el **cinturón de tu código**. No la notas cuando todo va bien, pero te salva cuando algo se rompe. Otra analogía útil: los tests son el **airbag de tu aplicación**; no conduces pensando en chocar, pero es bueno que esté ahí.

**¿Por qué importa en serio?**

- Cuando refactorizas (reorganizas) el código, los tests te dicen en segundos si **sigue funcionando igual**.
- Cuando trabajas en equipo, nadie puede "romper en silencio" una funcionalidad ya probada: el `pnpm test:run` del pipeline fallará.
- Cuando vuelves a un proyecto tras unas vacaciones, los tests son la **documentación viva** de lo que el código debe hacer.

**Qué significa "automatizado"**: a diferencia de probar a mano haciendo clics en el navegador, el test se ejecuta con un comando y se repite tantas veces como quieras, sin cansancio y sin olvidos.

## Qué prueba qué

No toda la misma herramienta sirve para lo mismo. Esta es la división que usaremos en todo el módulo:

| Herramienta | Prueba |
|-------------|--------|
| **Jest** | Lógica pura, utilidades, snapshots (runner + aserciones) |
| **React Testing Library** | Componentes *como los usa una persona* (DOM + interacciones) |
| **MSW / mocks** | Red sin tocar el backend real |

En palabras llanas:

- **Jest (o Vitest)** es el **runner**: el programa que descubre tus archivos `*.test.js`, los ejecuta y te dice qué pasó. También trae las **aserciones** (`expect`).
- **React Testing Library (RTL)** monta tus componentes en un DOM falso y te deja buscar botones, textos y hacer clics.
- **MSW / mocks** evitan que tus tests hagan peticiones reales a internet.

## Instalación (Vite + React)

En un proyecto Vite + React, la instalación completa es:

```bash
pnpm add -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

¿Qué instala cada paquete?

| Paquete | Para qué sirve |
|---------|----------------|
| `vitest` | El runner de tests (API compatible con Jest) |
| `@testing-library/react` | Renderizar componentes y buscar en el DOM |
| `@testing-library/jest-dom` | Aserciones extra como `toBeInTheDocument()` |
| `@testing-library/user-event` | Simular clics, tecleo y cambios como una persona |
| `jsdom` | Un navegador "falso" (DOM) dentro de Node |

> El ecosistema Vite usa **Vitest** (API compatible con Jest: `describe/it/expect/vi`). Si el curso pide "Jest", los conceptos son los mismos; los comandos de este módulo usan Vitest.

**¿Qué significa "API compatible con Jest"?** Que si ya leíste tutoriales con `describe`, `it`, `expect` y `jest.mock`, aquí funcionan igual; solo cambia el nombre del runner y que los mocks se escriben con `vi` en vez de `jest`.

### Configuración en `vite.config.js`

```js
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.js'],
  },
})
```

Significado de cada opción del bloque `test`:

- `environment: 'jsdom'` → los tests corren dentro de un **DOM falso** (puedes usar `document`, renderizar componentes). Sin esto, `document` no existe y todo lo de UI revienta.
- `globals: true` → `describe`, `it`, `expect` están **disponibles sin importarlos** en cada archivo, igual que en Jest.
- `setupFiles` → archivo que se ejecuta **antes** de cada test: aquí cargamos los matchers extra de RTL.

### Archivo de setup

```js
// src/test/setup.js
import '@testing-library/jest-dom/vitest'
```

Esa única línea es la que te regala aserciones como `toBeInTheDocument()`, `toHaveTextContent()` o `toBeDisabled()`.

### Scripts en `package.json`

```text
// package.json
"scripts": { "test": "vitest", "test:run": "vitest run", "coverage": "vitest run --coverage" }
```

| Comando | Qué hace |
|---------|----------|
| `pnpm test` | Vitest en modo **watch** (se relanza al guardar archivos) |
| `pnpm test:run` | Ejecuta la suite **una vez** y termina (ideal para CI) |
| `pnpm coverage` | Genera el **informe de cobertura** |

## Primer test

Con la instalación lista, tu primer test se ve así:

```js
import { add } from './math'

describe('add', () => {
  it('suma dos números', () => {
    expect(add(2, 3)).toBe(5)
  })
})
```

Léelo despacio, porque es el molde de todos los tests que escribirás en el curso:

- `describe('add', ...)` → **agrupa** los tests de la misma unidad (como un título de sección).
- `it('suma dos números', ...)` → el **caso concreto**: un enunciado en castellano de lo que debe ocurrir. También puedes usar `test(...)`; son intercambiables.
- `expect(...).toBe(...)` → la **aserción**: "espero que esto sea aquello". Si la igualdad no se cumple, el test falla y Vitest te muestra el diff.

**Qué significa "que el test falle"**: no es un error del programa, es la **red de seguridad funcionando**: te está diciendo que el comportamiento real no coincide con el esperado.

## Aserciones clave

| Matcher | Cuándo |
|---------|--------|
| `toBe` | primitivos / identidad |
| `toEqual` | deep equality |
| `toBeTruthy / toBeNull` | existencia |
| `toThrow` | excepciones |
| `toBeInTheDocument` | nodo en el DOM (RTL) |

Guía rápida de uso:

- `toBe` compara **por valor** en primitivos: `expect(5).toBe(5)`.
- `toEqual` compara **profundamente** objetos y arrays: `expect({a:[1]}).toEqual({a:[1]})`.
- `toBeTruthy` acepta cualquier valor "verdadero" (`1`, `'hola'`, `{}`); `toBeNull` comprueba `null` exacto.
- `toThrow` espera que una función **lance excepción**: `expect(() => parse('x')).toThrow()`.
- `toBeInTheDocument` viene del setup de jest-dom y verifica que un nodo está en el DOM renderizado.

## Errores comunes

### 1. `ReferenceError: expect is not defined`

```text
ReferenceError: expect is not defined
    at src/math.test.js:5:3
```

**Solución**: falta `globals: true` en el bloque `test` de `vite.config.js` (o no estás ejecutando los tests con Vitest):

```js
test: {
  environment: 'jsdom',
  globals: true,
  setupFiles: ['./src/test/setup.js'],
}
```

### 2. `ReferenceError: document is not defined`

```text
ReferenceError: document is not defined
```

**Solución**: el entorno por defecto es `node`, que no tiene DOM. Añade `environment: 'jsdom'` en `vite.config.js`.

### 3. `expect(...).toBeInTheDocument is not a function`

```text
TypeError: expect(...).toBeInTheDocument is not a function
```

**Solución**: falta el archivo de setup con `import '@testing-library/jest-dom/vitest'` y su referencia en `setupFiles`.

### 4. `No test files found`

```text
No test files found, exiting with code 1
```

**Solución**: los archivos de test no cumplen el patrón de Vitest (`*.test.js`, `*.spec.js` o carpeta `__tests__`). Renombra el archivo o revisa la ruta; también puede ser que hayas ejecutado el comando desde la carpeta equivocada.

## Conceptos clave

- **Test automatizado**: programa que compara resultado real vs. esperado; es la **red de seguridad** del código.
- **Runner**: el programa que descubre y ejecuta los tests (Jest en el checklist, **Vitest** en este módulo por Vite).
- **Aserción / matcher**: la comprobación concreta dentro de `expect(...)`.
- **`describe` / `it` / `expect`**: agrupar, enunciar y afirmar.
- **`jsdom`**: navegador falso que da `document` y `window` dentro de Node.
- **`globals: true`**: `describe`/`it`/`expect` disponibles sin imports.
- **`setupFiles`**: código que corre antes de cada test (carga de jest-dom).
- **Scripts**: `pnpm test` (watch), `pnpm test:run` (una vez), `pnpm coverage` (informe).
- **Compatibilidad Jest ↔ Vitest**: mismos conceptos; los mocks se escriben con `vi`.

## Autoevaluación

1. **¿Qué diferencia hay entre `pnpm test` y `pnpm test:run`?**

   <details><summary>Respuesta</summary>

   `pnpm test` ejecuta Vitest en modo *watch* (vuelve a lanzar los tests al guardar cambios). `pnpm test:run` ejecuta la suite **una sola vez** y termina, que es lo que usas en CI o cuando solo quieres ver el resultado.

   </details>

2. **¿Para qué sirve `environment: 'jsdom'` y qué error ves si falta?**

   <details><summary>Respuesta</summary>

   Proporciona un DOM falso (`document`, `window`) para poder renderizar componentes en Node. Si falta, aparece `ReferenceError: document is not defined`.

   </details>

3. **¿Cuál es la diferencia entre `toBe` y `toEqual`?**

   <details><summary>Respuesta</summary>

   `toBe` compara identidad/valor primitivo (referencia para objetos), mientras que `toEqual` hace una comparación profunda (deep equality) de objetos y arrays anidados.

   </details>

4. **Si el curso habla de "Jest" pero tu proyecto es Vite, ¿qué usas y qué cambia?**

   <details><summary>Respuesta</summary>

   Usas **Vitest**, que tiene la misma API (`describe`, `it`, `expect`) y además `vi` en lugar de `jest` para mocks. Los conceptos, la estructura de tests y los matchers son los mismos; solo cambian el nombre del runner y el comando de instalación.

   </details>
