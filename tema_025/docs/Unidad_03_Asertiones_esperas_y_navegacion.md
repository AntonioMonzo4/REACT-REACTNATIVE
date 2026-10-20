# Unidad 03 — Asertiones, esperas y navegación en specs
> 🧭 **Navegación:** [← Anterior: Unidad 02 — Playwright: instalación, configuración y locators](Unidad_02_Playwright_configuracion_y_locators.md) · [Índice del tema](../README.md) · [Siguiente: Unidad 04 — Page Objects, fixtures y CI →](Unidad_04_Page_Objects_fixtures_y_CI.md)

## Objetivos

Al terminar esta unidad podrás:

- Escribir asertiones robustas con el expect de Playwright (`toBeVisible`, `toHaveURL`, `toHaveValue`…).
- Entender el auto-waiting y cuándo sí usar `waitForResponse` o `expect.poll`.
- Simular flujos completos: navegar, rellenar formularios, enviar y verificar el resultado.
- Mockear respuestas de red con `page.route` para tests deterministas.

## Requisitos

- Unidad 02 (config + locators).
- La app del ejemplo (`EJEMPLO_PLAYWRIGHT/`) corriendo vía `webServer`.

## Asertiones que esperan por ti

Todas las asertiones de Playwright son **auto-waiting**: reintentan hasta el timeout.

```ts
await expect(page.getByRole('alert')).toBeVisible()
await expect(page).toHaveURL(/dashboard/)
await expect(page.getByRole('heading', { level: 1 })).toHaveText('Dashboard')
await expect(page.getByLabel('Email')).toHaveValue('ana@curso.dev')
await expect(page.getByRole('button', { name: 'Entrar' })).toBeDisabled()
await expect(page.getByRole('listitem')).toHaveCount(3)
await expect(page.getByText('Todo correcto')).toBeHidden()
```

Regla: **asertiona el resultado visible del usuario**, no el estado interno de React.

## Flujo completo: formulario + navegación

El ejemplo tiene un login que muestra un dashboard con lista de tareas. Es una
SPA sin router: la señal de éxito es el heading. Si tu app usa React Router o
Next, añade también `await expect(page).toHaveURL(/dashboard/)`.

```ts
// tests/dashboard.spec.ts
import { test, expect } from '@playwright/test'

test('tras el login se ven las tareas del usuario', async ({ page }) => {
  await page.goto('/')
  await page.getByLabel('Email').fill('ana@curso.dev')
  await page.getByLabel('Contraseña').fill('secreta123')
  await page.getByRole('button', { name: 'Entrar' }).click()

  // Con router sería: await expect(page).toHaveURL(/dashboard/)
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
  await expect(page.getByRole('listitem')).toHaveCount(2)
})

test('añadir una tarea aparece en la lista', async ({ page }) => {
  await page.goto('/')
  await page.getByLabel('Email').fill('ana@curso.dev')
  await page.getByLabel('Contraseña').fill('secreta123')
  await page.getByRole('button', { name: 'Entrar' }).click()

  await page.getByLabel('Nueva tarea').fill('Comprar pan')
  await page.getByRole('button', { name: 'Añadir' }).click()

  // Ojo: listitem NO toma el nombre del contenido (solo de autor),
  // así que filtramos por texto visible en vez de usar { name }.
  await expect(
    page.getByRole('listitem').filter({ hasText: 'Comprar pan' }),
  ).toBeVisible()
})
```

Para no repetir el login en cada test (y hacer la suite más rápida) usaremos
**storageState** / fixtures en la U04.

## Esperas explícitas: cuándo sí

El auto-waiting cubre el 95 % de los casos. Solo necesitas esperas explícitas
cuando el "resultado" no es un elemento del DOM:

```ts
// Esperar una petición de red concreta
const respuesta = page.waitForResponse((r) =>
  r.url().includes('/api/tareas') && r.status() === 200,
)
await page.getByRole('button', { name: 'Refrescar' }).click()
await respuesta

// Esperar un estado que no es DOM (p. ej. localStorage tras guardar)
await expect
  .poll(() => page.evaluate(() => localStorage.getItem('tareas')))
  .toContain('Comprar pan')
```

Nunca uses `page.waitForTimeout(2000)` como estrategia principal: es la causa
número uno de tests flaky y lentos.

## Mock de red con `page.route`

Para specs deterministas (sin depender de una API real) interceptas la red:

```ts
test('muestra error si la API falla', async ({ page }) => {
  await page.route('**/api/tareas', (route) =>
    route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Fallo interno' }),
    }),
  )

  await page.goto('/')
  await page.getByLabel('Email').fill('ana@curso.dev')
  await page.getByLabel('Contraseña').fill('secreta123')
  await page.getByRole('button', { name: 'Entrar' }).click()

  await expect(page.getByRole('alert')).toContainText('Fallo interno')
})
```

Cuándo mockear:

- **Sí**: errores de red, respuestas imposibles de conseguir en dev (paginación, datos vacíos).
- **No**: el flujo feliz principal con tu propio backend de staging; ahí el E2E debe tocar lo real.

## Errores comunes

| Error | Síntoma | Solución |
|-------|---------|----------|
| Asertar sin esperar | "expected heading to be visible" intermitente | Usa aserturas de Playwright (auto-waiting), no `if (await visible)` |
| `{ name }` en `listitem` | El item existe en el snapshot y el locator no lo encuentra | `listitem` no toma el nombre del contenido: usa `.filter({ hasText })` |
| Patrón de route demasiado amplio | `**/api/**` también captura `/src/api/auth.ts` de Vite y la app queda en blanco | Acota el patrón (p. ej. `**/api/tareas`) |
| Mock en todos los specs | El E2E deja de validar la integración real | Mock solo para casos de error/datos especiales |
| Test que depende del orden | Falla solo con `--ui` o en CI | Cada test parte de estado limpio (login propio o fixture) |

## Conceptos clave

- **Auto-waiting**: las expect reintentan hasta el timeout (5 s por defecto).
- **`waitForResponse`**: esperar un evento de red, no un elemento.
- **`page.route`**: interceptar/mockear peticiones para specs deterministas.
- **storageState**: cookies/localStorage guardados para reutilizar sesión (U04).

## Autoevaluación

<details>
<summary><b>1. ¿Cuándo usarías `waitForResponse` y no `toBeVisible`?</b></summary>

Cuando el resultado que te interesa no es un elemento del DOM sino una llamada de red
(p. ej. verificar que se disparó un `POST /api/tareas` con status 201 antes de
asertar que la lista se actualiza).
</details>

<details>
<summary><b>2. Ventaja de mockear la API en el spec de "error 500".</b></summary>

Determinismo y velocidad: no necesitas provocar un fallo real en el servidor; el
spec valida que tu UI muestra el `role="alert"` correctamente sin tocar backend.
</details>

<details>
<summary><b>3. ¿Por qué `waitForTimeout(3000)` hace los tests peores?</b></summary>

Espera siempre 3 s aunque la app sea instantánea (lentitud acumulada) y no garantiza
nada si la app tarda 4 s (flaky). El auto-waiting de Playwright resuelve ambos casos.
</details>

> 🧭 **Navegación:** [← Anterior: Unidad 02 — Playwright: instalación, configuración y locators](Unidad_02_Playwright_configuracion_y_locators.md) · [Índice del tema](../README.md) · [Siguiente: Unidad 04 — Page Objects, fixtures y CI →](Unidad_04_Page_Objects_fixtures_y_CI.md)
