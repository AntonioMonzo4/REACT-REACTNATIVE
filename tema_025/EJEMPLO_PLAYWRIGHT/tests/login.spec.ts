import { test, expect } from '@playwright/test'

test('login con credenciales válidas entra al dashboard', async ({ page }) => {
  await page.goto('/')
  await page.getByLabel('Email').fill('ana@curso.dev')
  await page.getByLabel('Contraseña').fill('secreta123')
  await page.getByRole('button', { name: 'Entrar' }).click()

  // La app es SPA sin router: la señal de éxito es el heading, no la URL
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
  await expect(page.getByTestId('email-sesion')).toHaveText('ana@curso.dev')
})

test('credenciales inválidas muestran alerta accesible', async ({ page }) => {
  // La "API" del ejemplo vive en src/api (mock en cliente): con '123'
  // (menos de 6 caracteres) lanza el error del módulo auth.
  // Ojo: si mockeas la red con page.route, no uses un patrón tan amplio
  // como '**/api/**' — también capturaría /src/api/auth.ts de Vite.
  await page.goto('/')
  await page.getByLabel('Email').fill('mal@curso.dev')
  await page.getByLabel('Contraseña').fill('123')
  await page.getByRole('button', { name: 'Entrar' }).click()

  await expect(page.getByRole('alert')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Iniciar sesión' })).toBeVisible()
})

test('el botón Entrar se deshabilita mientras se envía', async ({ page }) => {
  await page.goto('/')
  await page.getByLabel('Email').fill('ana@curso.dev')
  await page.getByLabel('Contraseña').fill('secreta123')

  const boton = page.getByRole('button', { name: /Entrar/ })
  await boton.click()
  // Durante el envío simulado (150 ms) el texto cambia; Playwright espera el estado
  await expect(page.getByRole('button', { name: 'Entrando…' })).toBeVisible()
})
