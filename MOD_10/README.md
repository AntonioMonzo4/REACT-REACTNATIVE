# Módulo 10 — Testing

Material del **Módulo 10** del roadmap (Jest/Vitest, React Testing Library, mocking, unit e integration).

## Para quién es este módulo

Este módulo está pensado para ti si:

- Acabas de pasar los **M4–M9** (React desde cero, intermedio, avanzado, Router, APIs y estado) y **nunca has escrito un test**.
- Quieres dejar de "probar a mano" cada cambio y confiar en un comando como `pnpm test:run`.
- Te han pedido en un trabajo o en una prueba técnica "tests con Jest/Vitest y React Testing Library".
- Ya oíste hablar de cobertura y quieres entender de verdad qué mide el 80 % (y qué no).

**No hace falta** experiencia previa en testing: cada unidad arranca de cero, con analogías, prosa explicativa y errores comunes con su solución. Solo necesitas los fundamentos de React y `fetch` de los módulos previos.

## Cómo estudiar

| Fase | Qué haces | Resultado |
|------|-----------|-----------|
| **1. Leer** | Lee las unidades 01 → 05 en orden, sin saltarte la 01 (configura Vitest) | Entiendes qué es un test, RTL, mocking, unit e integration |
| **2. Ejecutar** | Entra en `EJEMPLO_REACT_TESTING/`, instala y lanza `pnpm test:run` | Ves pasar (o fallar) tests reales y aprendes a leer la salida |
| **3. Practicar** | Rompe algo a propósito (cambia un `expect`) y observa el error; luego repara | Aprendes a diagnosticar fallos, que es el 50 % del oficio |
| **4. Aplicar** | Escribe tests en **tu** proyecto: primero unit puros, luego un flujo de integración | Desbloqueas el checklist de cobertura > 80 % |

## Contenido

### Teoría (`docs/`)

| Unidad | Tema |
|--------|------|
| [01 — Jest y configuración](docs/Unidad_01_Jest_y_configuracion.md) | Runner, setup, matchers (Vitest en Vite) |
| [02 — React Testing Library](docs/Unidad_02_React_Testing_Library.md) | Queries por role, `userEvent`, async |
| [03 — Mocking](docs/Unidad_03_Mocking.md) | `vi.fn`, módulos, fetch, timers |
| [04 — Unit Testing](docs/Unidad_04_Unit_Testing.md) | Funciones puras y reducers |
| [05 — Integration Testing](docs/Unidad_05_Integration_Testing.md) | Flujos con providers y red mockeada |

Cada unidad incluye **Objetivos**, **Requisitos**, prosa para novatos (analogías y "qué significa / por qué importa"), **Errores comunes** (mensaje de error + solución), **Conceptos clave** y una **Autoevaluación** con respuestas desplegables.

### Práctica (`EJEMPLO_REACT_TESTING/`)

Vite + React + **Vitest** + RTL:

- `math.test.js` — unit puro
- `Contador.test.jsx` — render + click
- `useFetch.test.js` — hook con `fetch` mockeado
- `FormularioLogin.test.jsx` — integration (éxito y error)

```bash
cd EJEMPLO_REACT_TESTING
pnpm install
pnpm test:run   # suites
pnpm lint
pnpm build
pnpm coverage   # informe de cobertura
```

Detalle de los comandos:

| Comando | Cuándo usarlo |
|---------|----------------|
| `pnpm install` | Una vez, al entrar al ejemplo |
| `pnpm test:run` | Quieres ver **ahora** el resultado (CI, entrega) |
| `pnpm test` | Estás desarrollando y quieres reejecución automática al guardar |
| `pnpm lint` | Antes de entregar: estilo y errores detectables |
| `pnpm build` | Comprobar que el proyecto compila |
| `pnpm coverage` | Medir el % de líneas ejecutadas por tests |

## Práctica mínima

Lo mínimo razonable para dar este módulo por aprendido:

1. Ejecutar `pnpm install` y `pnpm test:run` en el ejemplo y que **pasen los 4 tests**.
2. Modificar un `expect` del ejemplo a propósito, ver el test **fallar** y **revertirlo**.
3. Explicar con tus palabras la diferencia entre **unit** e **integration** (y por qué se mockea solo la red).
4. Escribir **al menos 1 test unitario propio** en tu proyecto (una función o reducer real).
5. Escribir **al menos 1 test de integración** (un formulario con éxito y error) y ejecutar `pnpm coverage`.

## Mapa con el README

- [x] Jest (conceptos; runner Vitest nativo de Vite)
- [x] React Testing Library
- [x] Mocking
- [x] Unit Testing
- [x] Integration Testing
- [ ] Proyecto: Cobertura superior al 80 % — *pendiente* (medir en el proyecto real)
