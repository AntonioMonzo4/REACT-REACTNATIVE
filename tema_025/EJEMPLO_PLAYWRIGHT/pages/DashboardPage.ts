import type { Page, Locator } from '@playwright/test'

export class DashboardPage {
  readonly heading: Locator
  readonly emailSesion: Locator
  readonly inputTarea: Locator
  readonly botonAnadir: Locator
  readonly lista: Locator
  readonly botonSalir: Locator

  constructor(page: Page) {
    this.heading = page.getByRole('heading', { name: 'Dashboard' })
    this.emailSesion = page.getByTestId('email-sesion')
    this.inputTarea = page.getByLabel('Nueva tarea')
    this.botonAnadir = page.getByRole('button', { name: 'Añadir' })
    this.lista = page.getByRole('list', { name: 'Lista de tareas' })
    this.botonSalir = page.getByRole('button', { name: 'Cerrar sesión' })
  }

  async anadirTarea(texto: string) {
    await this.inputTarea.fill(texto)
    await this.botonAnadir.click()
  }

  async logout() {
    await this.botonSalir.click()
  }
}

export async function loginComo(page: Page, email: string, password: string) {
  await page.goto('/')
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Contraseña').fill(password)
  await page.getByRole('button', { name: 'Entrar' }).click()
}
