import { test, expect } from '@playwright/test'
import { DashboardPage, loginComo } from '../pages/DashboardPage'

test.beforeEach(async ({ page }) => {
  await loginComo(page, 'ana@curso.dev', 'secreta123')
})

test('el dashboard muestra las tareas iniciales', async ({ page }) => {
  const dashboard = new DashboardPage(page)
  await expect(dashboard.heading).toBeVisible()
  await expect(dashboard.lista.getByRole('listitem')).toHaveCount(2)
})

test('añadir una tarea la incorpora a la lista', async ({ page }) => {
  const dashboard = new DashboardPage(page)
  await dashboard.anadirTarea('Comprar pan')
  // listitem no toma el nombre del contenido: filtramos por texto visible
  await expect(
    dashboard.lista.getByRole('listitem').filter({ hasText: 'Comprar pan' }),
  ).toBeVisible()
  await expect(dashboard.lista.getByRole('listitem')).toHaveCount(3)
})

test('logout vuelve al formulario de login', async ({ page }) => {
  const dashboard = new DashboardPage(page)
  await dashboard.logout()
  await expect(page.getByRole('heading', { name: 'Iniciar sesión' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Entrar' })).toBeVisible()
})
