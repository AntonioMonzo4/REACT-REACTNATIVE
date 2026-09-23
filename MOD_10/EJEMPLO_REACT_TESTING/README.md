# Ejemplo Testing — Módulo 10

Proyecto de práctica del **Módulo 10 (Testing)**. Vite + React + **Vitest** + React Testing Library.

> El checklist del roadmap nombra Jest; en Vite se usa **Vitest** (misma API: `describe`, `it`, `expect`, mocks con `vi`).

## Qué practica este ejemplo

Este ejemplo no enseña React (eso ya lo viste en M4–M9): enseña **cómo se testea** lo que ya sabes construir. Cubre los cuatro niveles del módulo en un solo proyecto mínimo:

| Nivel | Qué demuestra el test |
|-------|------------------------|
| **Unit puro** | Una función se prueba sin DOM, sin red y sin render: entradas y salida (`math.test.js`) |
| **Componente (RTL)** | Render + interacción con `userEvent`: clic real, estado visible en pantalla (`Contador.test.jsx`) |
| **Hook + mocking** | Un custom hook con `fetch` **mockeado**: nunca toca la red real (`useFetch.test.js`) |
| **Integration** | Un formulario completo (éxito **y** error) con la API sustituida por un doble (`FormularioLogin.test.jsx`) |

Ideas que refuerza:

- **Queries por rol/label** y `await userEvent.*` (Unidad 02).
- **`vi.mock` / `fetch` falso** y aislamiento de la frontera de red (Unidad 03).
- Nombres de test por **comportamiento** y aserciones `expect` (Unidad 04).
- Flujos de **alto valor** (login) con resultado asíncrono (`findBy*`) (Unidad 05).
- Medir cobertura con `pnpm coverage` y pensar en **caminos críticos**, no solo en el número.

## Comandos

```bash
pnpm install
pnpm test:run   # ejecuta la suite una vez
pnpm test       # watch
pnpm coverage   # informe de cobertura
pnpm lint
pnpm build
```

| Comando | Resultado esperado |
|---------|--------------------|
| `pnpm install` | Instala React, Vitest, RTL, user-event y jsdom |
| `pnpm test:run` | Ejecuta los 4 archivos de test **una vez** y termina en verde |
| `pnpm test` | Vitest en *watch*: reejecuta al guardar un archivo |
| `pnpm coverage` | Informe de % de líneas/ramas ejecutadas |
| `pnpm lint` | ESLint sin errores |
| `pnpm build` | Build de producción con Vite |

## Tests incluidos

| Archivo | Nivel |
|---------|-------|
| `src/math.test.js` | Unit (función pura) |
| `src/components/Contador.test.jsx` | Componente (RTL + userEvent) |
| `src/hooks/useFetch.test.js` | Hook con `fetch` mockeado |
| `src/components/FormularioLogin.test.jsx` | Integration (éxito y error) |

## Cómo recorrerlo

Sigue este orden: cada paso solo asume lo anterior.

1. **Instala y observa**: `pnpm install` y luego `pnpm test:run`. Lee la salida: archivo, nombre de cada `it`, verde/rojo. No edites nada aún.
2. **Lee `src/math.test.js`**: es el test más simple (sin DOM). Identifica `describe`, `it` y cada `expect`. Compara con la función de `src/math.js`.
3. **Rompe algo a propósito**: cambia `toBe(5)` por `toBe(6)`, vuelve a ejecutar y **lee el diff del error**. Revierte. Este ejercicio te enseña más que páginas de teoría.
4. **Pasa a `src/components/Contador.test.jsx`**: fíjate en `render`, `screen.getByRole` y el `await userEvent.click(...)`. Prueba a quitar el `await` y observa el fallo; vuélvelo a poner.
5. **Abre `src/hooks/useFetch.test.js`**: busca el `vi.mock`/`global.fetch` y entiende **por qué** el test no necesita internet. Relaciónalo con la Unidad 03.
6. **Termina con `src/components/FormularioLogin.test.jsx`**: es el integration. Observa que solo se mockea la **frontera** (la API) y todo lo demás corre real; hay caso de **éxito** y caso de **error**.
7. **Mide**: `pnpm coverage` y abre el informe. Comprueba qué líneas están verde y cuáles no; pregúntate si las líneas sin cubrir son críticas.
8. **Aplica en tu proyecto**: copia el patrón de `math.test.js` para tus funciones puras y el de `FormularioLogin.test.jsx` para tus formularios.

## Temario Módulo 10 — estado

- [x] Jest (conceptos / Vitest)
- [x] React Testing Library
- [x] Mocking
- [x] Unit Testing
- [x] Integration Testing
- [ ] Cobertura > 80 % en el proyecto real
