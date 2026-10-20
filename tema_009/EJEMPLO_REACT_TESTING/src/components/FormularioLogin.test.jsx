import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import FormularioLogin from './FormularioLogin'

afterEach(() => {
  vi.unstubAllGlobals()
})

async function rellenarYEnviar(user) {
  await user.type(screen.getByLabelText('Email'), 'alumno@curso.dev')
  await user.type(screen.getByLabelText('Password'), 'secreta')
  await user.click(screen.getByRole('button', { name: 'Entrar' }))
}

describe('FormularioLogin (integration)', () => {
  it('login correcto invoca onLogin con el usuario', async () => {
    const usuario = { email: 'alumno@curso.dev' }
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(usuario),
      }),
    )
    const onLogin = vi.fn()
    const user = userEvent.setup()

    render(<FormularioLogin onLogin={onLogin} />)
    await rellenarYEnviar(user)

    await screen.findByRole('button', { name: 'Entrar' })
    expect(onLogin).toHaveBeenCalledWith(usuario)
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('login fallido muestra alerta de error', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: false, status: 401 }),
    )
    const onLogin = vi.fn()
    const user = userEvent.setup()

    render(<FormularioLogin onLogin={onLogin} />)
    await rellenarYEnviar(user)

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Credenciales inválidas',
    )
    expect(onLogin).not.toHaveBeenCalled()
  })
})
