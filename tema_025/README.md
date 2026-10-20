# Módulo 26 — Testing E2E con Playwright
> 🧭 **Navegación:** [← Anterior: tema_024 — TanStack Query, React Hook Form y Zod](../tema_024/README.md) · [Índice del curso](../GUIA_ESTUDIO.md) · [Siguiente: tema_026 — Monorepos →](../tema_026/README.md)

Material del **Módulo 26** del roadmap (testing end-to-end). Módulo añadido tras
revisar huecos del curso: M10 cubre unit/integration con Jest y RTL, pero el
estándar de las empresas para validar flujos completos en navegador real es
**Playwright** (o Cypress). Aquí aprendes la pirámide completa.

## Para quién es este módulo

- **Para ti si** terminaste M10 (Testing) y tus tests usan siempre jsdom, nunca
  un navegador real.
- **Para ti si** quieres cubrir en CI los flujos críticos (login, alta, checkout)
  sin escribir specs frágiles llenos de `waitForTimeout`.
- **Para ti si** te han pedido "tests E2E" en una oferta y no sabes por dónde
  empezar con Playwright.
- **No hace falta** saber Playwright ni Cypress previamente; se apoya en M10
  (pirámide), M19 (GitHub Actions) y M21 (accesibilidad para `getByRole`).

## Contenido

### Teoría (`docs/`)

| Unidad | Tema |
|--------|------|
| [01 — ¿Qué es E2E y la pirámide?](docs/Unidad_01_Que_es_E2E_y_Pyramide.md) | unit vs integration vs E2E, Playwright vs Cypress, proporción |
| [02 — Configuración y locators](docs/Unidad_02_Playwright_configuracion_y_locators.md) | `playwright.config`, `webServer`, `getByRole`/`getByLabel` |
| [03 — Asertiones, esperas y red](docs/Unidad_03_Asertiones_esperas_y_navegacion.md) | auto-waiting, `waitForResponse`, `page.route` |
| [04 — Page Objects, fixtures y CI](docs/Unidad_04_Page_Objects_fixtures_y_CI.md) | `storageState`, PO, GitHub Actions con caché |

Cada unidad incluye: objetivos, requisitos, prosa para novatos, código, **Errores
comunes** con solución, **Conceptos clave** y **Autoevaluación** con respuestas
plegadas.

### Práctica (`EJEMPLO_PLAYWRIGHT/`)

Demo Vite + TypeScript + React 19 con login, dashboard y gestión de tareas, más
una suite Playwright que la ejercita en navegador real:

- Spec de login (éxito y credenciales inválidas con mock de red).
- Spec de dashboard (añadir tarea, lista, logout).
- Config con `webServer`, trazas al reintentar y report HTML.
- Fixture de autenticación con `storageState`.

```bash
cd EJEMPLO_PLAYWRIGHT
pnpm install
pnpm exec playwright install chromium   # una vez por máquina
pnpm run check        # tsc
pnpm lint
pnpm build
pnpm exec playwright test
pnpm exec playwright show-report
```

## Cómo estudiar

| Fase | Qué haces | Producto |
|------|-----------|----------|
| **1. Pirámide** | Lee la U01 y contrasta con lo que ya sabes de M10. | Sitúas el E2E sin miedo a duplicar cobertura. |
| **2. Primer spec** | Lee la U02, corre `playwright test tests/login` con `--ui`. | Ves auto-waiting y locators en acción. |
| **3. Red y errores** | Lee la U03 y el spec de error con `page.route`. | Sabes mockear solo cuando aporta. |
| **4. CI** | Lee la U04 y ejecuta la suite completa; mira el informe. | Tienes el patrón listo para tu proyecto. |

## Práctica mínima

1. `pnpm install && pnpm exec playwright install chromium` en `EJEMPLO_PLAYWRIGHT/`.
2. `pnpm exec playwright test --ui` y observa los 4 specs ejecutarse.
3. Cambia un texto del botón "Entrar" en la app y vuelve a correr: el spec falla;
   actualízalo y observa cómo el fallo te dice exactamente qué esperaba.
4. Comenta el `page.route` del spec de error y comprueba qué falla.
5. Añade un spec nuevo: "no se puede añadir tarea vacía" (botón deshabilitado o
   mensaje de validación).
6. Responde las autoevaluaciones de las cuatro unidades sin mirar.

## Mapa con el README

- [x] Unit vs integration vs E2E y pirámide de testing
- [x] Playwright vs Cypress
- [x] `playwright.config.ts` con `webServer`, projects y reporter
- [x] Locators accesibles: `getByRole`, `getByLabel`, `getByTestId`
- [x] Auto-waiting y asertiones (`toBeVisible`, `toHaveURL`, `toHaveCount`)
- [x] Mock de red con `page.route` y `waitForResponse`
- [x] Fixture `storageState` para no repetir login
- [x] Page Objects ligeros
- [x] E2E en GitHub Actions con caché de navegadores
- [ ] Suite E2E del proyecto final (M23) — *extensión*

## Relación con el resto del roadmap

| Módulo | Relación |
|--------|----------|
| M10 | Aquí se cierra la capa E2E que M10 dejó fuera de la pirámide base |
| M19 | El patrón de CI de esta unidad reutiliza los concepts de Actions |
| M21 | `getByRole`/`getByLabel` dependen del HTML accesible de M21 |
| M23 | El proyecto final debe incluir specs E2E de sus flujos críticos |
| M24 | Playwright se integra bien con lint-staged/pre-commit (lint de specs) |

---

> 🧭 **Navegación:** [← Anterior: tema_024 — TanStack Query, React Hook Form y Zod](../tema_024/README.md) · [Índice del curso](../GUIA_ESTUDIO.md) · [Siguiente: tema_026 — Monorepos →](../tema_026/README.md)
