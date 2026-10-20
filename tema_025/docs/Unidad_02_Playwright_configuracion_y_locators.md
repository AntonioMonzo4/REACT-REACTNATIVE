# Unidad 02 — Playwright: instalación, configuración y locators
> 🧭 **Navegación:** [← Anterior: Unidad 01 — ¿Qué es testing E2E y dónde encaja en la pirámide?](Unidad_01_Que_es_E2E_y_Pyramide.md) · [Índice del tema](../README.md) · [Siguiente: Unidad 03 — Asertiones, esperas y navegación →](Unidad_03_Asertiones_esperas_y_navegacion.md)

## Objetivos

Al terminar esta unidad podrás:

- Instalar Playwright en un proyecto Vite + React y generarlo con `pnpm exec playwright test`.
- Entender cada bloque de `playwright.config.ts` (`webServer`, `projects`, `reporter`).
- Elegir el **locator correcto**: `getByRole` → `getByLabel` → `getByText` → `getByTestId`.
- Escribir tu primer spec que arranca la app, rellena un formulario y comprueba texto.

## Requisitos

- Unidad 01 (pirámide E2E).
- Proyecto Vite funcionando (`pnpm dev` responde en el navegador).

## Instalación

En la raíz del proyecto (aquí: `EJEMPLO_PLAYWRIGHT/`):

```bash
pnpm add -D @playwright/test
pnpm exec playwright install chromium   # descarga el navegador (una vez)
```

Generar la configuración y una carpeta de tests:

```bash
pnpm exec playwright init
```

Esto crea `playwright.config.ts` y `tests/`. El config mínimo que usaremos:

```ts
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',   // graba la traza al primer reintento
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  // Arranca y para el dev server automáticamente
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
})
```

**`webServer`** es la pieza clave: sin él, tus specs fallarían porque nadie ha
arrancado Vite. Playwright espera a que la URL responda y lanza los tests encima.

Comandos:

```bash
pnpm exec playwright test                 # todo
pnpm exec playwright test tests/login     # un archivo
pnpm exec playwright test --ui            # modo interactivo (depurar)
pnpm exec playwright show-report          # abre el informe HTML
```

## Locators: cómo encontrar elementos

**Regla de oro: localiza como lo haría un usuario o un lector de pantalla.**
Si tu locator depende de un `div > div:nth-child(3)`, el test se romperá con
cualquier cambio de CSS.

| Locator | Cuándo | Ejemplo |
|---------|--------|---------|
| `getByRole` | Preferido. Botones, links, headings, campos | `page.getByRole('button', { name: 'Entrar' })` |
| `getByLabel` | Campos con `<label>` | `page.getByLabel('Email')` |
| `getByPlaceholder` | Inputs con placeholder | `page.getByPlaceholder('tu@correo.com')` |
| `getByText` | Cualquier texto visible | `page.getByText('Bienvenido')` |
| `getByTestId` | Último recurso; añade `data-testid` al JSX | `page.getByTestId('lista-posts')` |

Ejemplo real con la app del ejemplo:

```ts
// tests/login.spec.ts
import { test, expect } from '@playwright/test'

test('login con credenciales válidas redirige al dashboard', async ({ page }) => {
  await page.goto('/')                                   // baseURL + '/'
  await page.getByLabel('Email').fill('ana@curso.dev')
  await page.getByLabel('Contraseña').fill('secreta123')
  await page.getByRole('button', { name: 'Entrar' }).click()
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
})
```

`expect(...).toBeVisible()` **espera automáticamente** (auto-waiting): no hace falta
`setTimeout` ni `waitFor`. Si el heading tarda 2 s en aparecer, Playwright lo espera.

## El contrato accesible del DOM

`getByRole` funciona porque tu app usa HTML semántico (M21):

```tsx
// ✅ Locatable por rol y nombre accesible
<label htmlFor="email">Email</label>
<input id="email" type="email" required />
<button type="submit">Entrar</button>

// ❌ Locatable solo por selectores frágiles
<div class="form-wrapper">
  <input class="inp inp-dark" onChange={...} />
  <div class="btn" onClick={...}>Entrar</div>
</div>
```

Si escribes `getByRole` y falla, normalmente el problema está en el **HTML**, no
en el test. Eso es una señal de que el E2E te está ayudando a mejorar a11y.

## Errores comunes

| Error | Síntoma | Solución |
|-------|---------|----------|
| `page.click('.btn-primary')` | Se rompe al cambiar clases | Usa `getByRole('button', { name: ... })` |
| Dos elementos con el mismo texto | "strict mode violation" | Añade `{ exact: true }` o un locator más específico |
| Config sin `webServer` | "page.goto: net::ERR_CONNECTION_REFUSED" | Añade el bloque `webServer` del config |

## Conceptos clave

- **`webServer`**: Playwright arranca y detiene tu app automáticamente.
- **Locator**: descripción de cómo encontrar un elemento; prioriza roles y labels.
- **Auto-waiting**: Playwright reintenta la acción hasta el timeout por defecto (5 s).
- **`--ui`**: modo interactivo para depurar specs punto a punto.

## Autoevaluación

<details>
<summary><b>1. ¿Por qué `getByRole` es mejor que `getByTestId`?</b></summary>

Porque valida además la semántica accesible: si el rol o el nombre accesible desaparecen
(un botón deja de ser botón), el test falla — que es información útil. `getByTestId`
solo dice "este div está aquí" y no valida significado.
</details>

<details>
<summary><b>2. ¿Qué bloque del config evita tener que ejecutar `pnpm dev` a mano?</b></summary>

`webServer: { command: 'pnpm dev', url: '...' }`. Playwright espera a que la URL
responda, ejecuta los tests y cierra el proceso al terminar.
</details>

<details>
<summary><b>3. ¿Necesitas `await page.waitForTimeout(1000)` tras hacer clic?</b></summary>

No. Las acciones y asertiones de Playwright ya esperan (auto-waiting). Los `waitForTimeout`
solo añaden latencia y flakiness; respáldalos solo con justificación (animaciones reales).
</details>

> 🧭 **Navegación:** [← Anterior: Unidad 01 — ¿Qué es testing E2E y dónde encaja en la pirámide?](Unidad_01_Que_es_E2E_y_Pyramide.md) · [Índice del tema](../README.md) · [Siguiente: Unidad 03 — Asertiones, esperas y navegación →](Unidad_03_Asertiones_esperas_y_navegacion.md)
