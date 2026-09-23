# Unidad 01 — Jest y configuración

## Qué prueba qué

| Herramienta | Prueba |
|-------------|--------|
| **Jest** | Lógica pura, utilidades, snapshots (runner + aserciones) |
| **React Testing Library** | Componentes *como los usa una persona* (DOM + interacciones) |
| **MSW / mocks** | Red sin tocar el backend real |

## Instalación (Vite + React)

```bash
pnpm add -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

> El ecosistema Vite usa **Vitest** (API compatible con Jest: `describe/it/expect/vi`). Si el curso pide “Jest”, los conceptos son los mismos; los comandos de este módulo usan Vitest.

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

```js
// src/test/setup.js
import '@testing-library/jest-dom/vitest'
```

```json
// package.json
"scripts": { "test": "vitest", "test:run": "vitest run", "coverage": "vitest run --coverage" }
```

## Primer test

```js
import { add } from './math'

describe('add', () => {
  it('suma dos números', () => {
    expect(add(2, 3)).toBe(5)
  })
})
```

## Aserciones clave

| Matcher | Cuándo |
|---------|--------|
| `toBe` | primitivos / identidad |
| `toEqual` | deep equality |
| `toBeTruthy / toBeNull` | existencia |
| `toThrow` | excepciones |
| `toBeInTheDocument` | nodo en el DOM (RTL) |

## En el ejemplo

`src/math.test.js` — tests unitarios puros sin DOM.
