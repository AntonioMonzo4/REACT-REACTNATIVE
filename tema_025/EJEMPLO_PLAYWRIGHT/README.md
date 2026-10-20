# Ejemplo Playwright — Módulo 26

Proyecto de práctica del **Módulo 26 (Testing E2E con Playwright)**. Vite +
React + TypeScript con una suite E2E que ejercita login y dashboard en
navegador real.

## Requisitos

- Node 20+ y pnpm.
- Una vez por máquina: `pnpm exec playwright install chromium`.

## Comandos

```bash
pnpm install
pnpm exec playwright install chromium

pnpm run check          # tsc
pnpm lint
pnpm build

pnpm exec playwright test          # suite E2E (arranca Vite solo)
pnpm exec playwright test --ui     # modo interactivo
pnpm exec playwright show-report   # informe HTML tras correr
```

## Estructura relevante

```
EJEMPLO_PLAYWRIGHT/
├── playwright.config.ts     # webServer, projects, trazas
├── pages/DashboardPage.ts   # Page Object ligero
├── tests/
│   ├── login.spec.ts        # éxito, error (mock de red), botón deshabilitado
│   └── dashboard.spec.ts    # lista, añadir tarea, logout
└── src/                     # la app bajo prueba
```

## Temario Módulo 26 — estado

- [x] U01 — Pirámide E2E y comparativa Playwright/Cypress
- [x] U02 — Configuración y locators accesibles
- [x] U03 — Asertiones, auto-waiting y mock de red
- [x] U04 — Page Objects, fixtures y CI
- [ ] Suite E2E en CI real (añadir `.github/workflows/e2e.yml` en tu proyecto)
