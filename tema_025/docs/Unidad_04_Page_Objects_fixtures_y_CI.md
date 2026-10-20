# Unidad 04 — Page Objects, fixtures y E2E en CI
> 🧭 **Navegación:** [← Anterior: Unidad 03 — Asertiones, esperas y navegación](Unidad_03_Asertiones_esperas_y_navegacion.md) · [Índice del tema](../README.md) · [Siguiente: tema_026 · Unidad 01 — ¿Qué es un monorepo? →](../../tema_026/docs/Unidad_01_Que_es_un_monorepo.md)

## Objetivos

Al terminar esta unidad podrás:

- Extraer flujos repetidos a **fixtures** de Playwright (`storageState`, test.extend).
- Organizar specs con el patrón **Page Object** sin sobre-ingeniería.
- Ejecutar Playwright en **GitHub Actions** con caché de navegadores.
- Interpretar un informe y una traza (`trace`) para depurar un fallo en CI.

## Requisitos

- Unidades 01–03.
- Haber visto M19 (CI/CD con GitHub Actions).

## Fixtures: no repitas el login 20 veces

La fixture `storageState` guarda cookies/localStorage tras un login y las reutiliza:

```ts
// auth.setup.ts  (corre una vez como "setup project")
import { test as setup, expect } from '@playwright/test'

const authFile = '.auth/user.json'

setup('login y guardar sesión', async ({ page }) => {
  await page.goto('/')
  await page.getByLabel('Email').fill('ana@curso.dev')
  await page.getByLabel('Contraseña').fill('secreta123')
  await page.getByRole('button', { name: 'Entrar' }).click()
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
  await page.context().storageState({ path: authFile })
})
```

```ts
// playwright.config.ts
export default defineConfig({
  projects: [
    { name: 'setup', testMatch: /auth\.setup\.ts/ },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], storageState: '.auth/user.json' },
      dependencies: ['setup'],
    },
  ],
})
```

Ahora todos los specs del proyecto `chromium` arrancan ya logueados. Solo el spec
de "login fallido" usa un proyecto o `test.use({ storageState: { cookies: [] } })`.

## Page Objects ligeros

Un Page Object encapsula **cómo interacts con una pantalla**, no la lógica del test:

```ts
// pages/DashboardPage.ts
import type { Page, Locator } from '@playwright/test'

export class DashboardPage {
  readonly heading: Locator
  readonly inputTarea: Locator
  readonly botonAnadir: Locator
  readonly lista: Locator

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { name: 'Dashboard' })
    this.inputTarea = page.getByLabel('Nueva tarea')
    this.botonAnadir = page.getByRole('button', { name: 'Añadir' })
    this.lista = page.getByRole('list')
  }

  async anadirTarea(texto: string) {
    await this.inputTarea.fill(texto)
    await this.botonAnadir.click()
  }
}
```

```ts
// tests/tareas.spec.ts
import { test, expect } from '@playwright/test'
import { DashboardPage } from '../pages/DashboardPage'

test('añadir tarea', async ({ page }) => {
  const dashboard = new DashboardPage(page)
  await page.goto('/dashboard')
  await dashboard.anadirTarea('Comprar pan')
  await expect(dashboard.lista.getByText('Comprar pan')).toBeVisible()
})
```

**Cuándo sí**: pantallas reutilizadas por muchos specs. **Cuándo no**: un spec único;
no crees una clase por cada componente.

## E2E en CI (GitHub Actions)

```yaml
# .github/workflows/e2e.yml
name: E2E
on: [pull_request]

jobs:
  playwright:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - uses: actions/cache@v4
        with:
          path: ~/.cache/ms-playwright
          key: playwright-${{ runner.os }}-${{ hashFiles('**/pnpm-lock.yaml') }}
      - run: pnpm exec playwright install --with-deps chromium
      - run: pnpm exec playwright test
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 7
```

Notas:

- Instala **solo Chromium** en CI (barato); local puedes correr los 3 engines.
- La caché de `~/.cache/ms-playwright` evita re-descargar ~150 MB en cada PR.
- El `upload-artifact` del informe al fallar es lo que te permite depurar sin
  tener que reproducir el fallo en local.

## Depurar fallos: trace y report

```bash
pnpm exec playwright test --ui            # depurar en local
pnpm exec playwright show-trace trace.zip # inspeccionar una traza grabada
```

La traza graba snapshots, red y console: es la "caja negra" del test. En CI,
con `trace: 'on-first-retry'` la tienes sin coste extra en los éxitos.

## Errores comunes

| Error | Síntoma | Solución |
|-------|---------|----------|
| Page Object con asertiones dentro | Specs poco legibles, dobles fallos | El PO expone locators/acciones; el test aserta |
| Instalar 3 browsers en CI | CI lento y caro | Chromium en CI; multi-browser local o nightly |
| Subir `node_modules` o `.auth` al repo | Repos sucios, credenciales locales | `.gitignore`: `.auth/`, `test-results/`, `playwright-report/` |

## Conceptos clave

- **Fixture `storageState`**: sesión reutilizable sin repetir login.
- **Page Object**: abstracción ligera de una pantalla; sin asertiones dentro.
- **Trace**: grabación depurable de un fallo en CI.
- **Setup project**: proyecto Playwright que corre antes de los tests (auth).

## Autoevaluación

<details>
<summary><b>1. ¿Qué va primero en CI: el proyecto `setup` o el `chromium`?</b></summary>

El `setup` (por `dependencies: ['setup']` en el proyecto chromium). Si no, los specs
arrancarían sin `storageState` válido y fallarían por no estar logueados.
</details>

<details>
<summary><b>2. ¿Dentro de un Page Object ponemos `expect(...)`?</b></summary>

No es lo habitual. El PO encapsula localización y acciones; las asertaciones se quedan
en el test para que el fallo lea directamente "qué esperaba el escenario".
</details>

<details>
<summary><b>3. ¿Cómo evitas re-descargar Chromium en cada PR?</b></summary>

Cacheando `~/.cache/ms-playwright` con `actions/cache` y usando como key el hash del
lockfile; solo se re-descarga cuando cambian las dependencias (y por tanto la versión).
</details>

> 🧭 **Navegación:** [← Anterior: Unidad 03 — Asertiones, esperas y navegación](Unidad_03_Asertiones_esperas_y_navegacion.md) · [Índice del tema](../README.md) · [Siguiente: tema_026 · Unidad 01 — ¿Qué es un monorepo? →](../../tema_026/docs/Unidad_01_Que_es_un_monorepo.md)
