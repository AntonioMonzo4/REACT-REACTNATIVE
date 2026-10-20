export type Usuario = { email: string }

/**
 * Autenticación simulada para el ejemplo E2E.
 * El spec de "credenciales inválidas" mockea la red en su lugar.
 */
export async function login(email: string, password: string): Promise<Usuario> {
  await new Promise((r) => setTimeout(r, 150))
  if (!email.includes('@') || password.length < 6) {
    throw new Error('Credenciales inválidas')
  }
  return { email }
}
