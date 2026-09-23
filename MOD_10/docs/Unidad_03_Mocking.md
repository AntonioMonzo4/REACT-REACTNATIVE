# Unidad 03 — Mocking

## Por qué

Aísla el unit bajo prueba: sin red real, sin timers reales, sin módulos pesados.

## fn / spies (Vitest `vi` ≡ Jest `jest`)

```js
import { vi } from 'vitest'

const fn = vi.fn()
fn('a')
expect(fn).toHaveBeenCalledWith('a')
expect(fn).toHaveBeenCalledTimes(1)
```

## Mock de módulo

```js
vi.mock('./api', () => ({
  fetchUser: vi.fn(),
}))

import { fetchUser } from './api'
fetchUser.mockResolvedValue({ id: 1, name: 'Ana' })
```

## Mock de fetch / red

```js
beforeEach(() => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve([{ id: 1 }]),
    }),
  )
})
```

En suites más serias: **MSW** (Mock Service Worker) intercepta en la red sin cambiar el código.

## Timers

```js
vi.useFakeTimers()
// avanzar el reloj
vi.advanceTimersByTime(1000)
vi.useRealTimers()
```

Con `userEvent` y fake timers cuida los delays (`userEvent.setup({ advanceTimers: vi.advanceTimersByTime })`).

## Qué no mockear

- En tests de integración de UI: deja correr la lógica real del componente.
- No mockees lo que estás intentando verificar (si pruebas el reducer, no lo sustituyas).

## En el ejemplo

Test del custom hook / fetch con `fetch` mockeado en `useFetch.test.js`.
