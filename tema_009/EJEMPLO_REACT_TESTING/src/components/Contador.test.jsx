import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import Contador from './Contador'

describe('Contador', () => {
  it('muestra el valor inicial', () => {
    render(<Contador inicial={5} />)
    expect(screen.getByText('Valor: 5')).toBeInTheDocument()
  })

  it('incrementa al pulsar Incrementar', async () => {
    const user = userEvent.setup()
    render(<Contador />)
    await user.click(screen.getByRole('button', { name: 'Incrementar' }))
    await user.click(screen.getByRole('button', { name: 'Incrementar' }))
    expect(screen.getByText('Valor: 2')).toBeInTheDocument()
  })

  it('reinicia al valor inicial', async () => {
    const user = userEvent.setup()
    render(<Contador inicial={10} />)
    await user.click(screen.getByRole('button', { name: 'Incrementar' }))
    await user.click(screen.getByRole('button', { name: 'Reiniciar' }))
    expect(screen.getByText('Valor: 10')).toBeInTheDocument()
  })
})
