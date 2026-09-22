# Unidad 02 — Custom Hooks avanzados

Los custom hooks del M4 eran básicos (`useCounter`). Aquí patrones reutilizables.

## useLocalStorage

Sincroniza estado con `localStorage`:

```js
import { useState, useEffect } from 'react'

export function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw !== null ? JSON.parse(raw) : initial
    } catch {
      return initial
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* quota / private mode */
    }
  }, [key, value])

  return [value, setValue]
}
```

Puntos clave: **lazy init** en `useState`, efecto de escritura, try/catch.

## useFetch (con abort)

```js
import { useEffect, useState } from 'react'

export function useFetch(url) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError(null)

    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(setData)
      .catch((err) => {
        if (err.name !== 'AbortError') setError(err)
      })
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [url])

  return { data, loading, error }
}
```

Puntos clave: **cleanup con AbortController**, estados `loading`/`error`, dependencia de `url`.

## useDebounce

```js
import { useEffect, useState } from 'react'

export function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])

  return debounced
}
```

Útil en búsquedas: solo disparar la API cuando el usuario deja de escribir.

## Reglas (repaso)

1. Nombre **`use...`**.
2. Pueden llamar a otros hooks; **no** condicionales.
3. Extraer lógica **reutilizable** o **compleja**, no un solo `useState` trivial.
4. Un hook = una responsabilidad clara (o un grupo cohesionado).

## En el ejemplo

`src/hooks/useLocalStorage.js` y `src/hooks/useDebounce.js`.
