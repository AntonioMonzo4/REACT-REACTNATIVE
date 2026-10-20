import { renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useFetch } from './useFetch'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('useFetch', () => {
  it('carga datos con éxito', async () => {
    const payload = [{ id: 1, title: 'post' }]
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(payload),
      }),
    )

    const { result } = renderHook(() => useFetch('/api/posts'))

    expect(result.current.cargando).toBe(true)

    await waitFor(() => expect(result.current.cargando).toBe(false))
    expect(result.current.data).toEqual(payload)
    expect(result.current.error).toBeNull()
  })

  it('expone el error cuando la respuesta no es ok', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: () => Promise.resolve({}),
      }),
    )

    const { result } = renderHook(() => useFetch('/api/posts'))

    await waitFor(() => expect(result.current.cargando).toBe(false))
    expect(result.current.error).toBe('HTTP 500')
    expect(result.current.data).toBeNull()
  })
})
