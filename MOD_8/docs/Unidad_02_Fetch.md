# Unidad 02 — Fetch API

## GET básico

```jsx
useEffect(() => {
  let cancelado = false

  async function cargar() {
    setCargando(true)
    setError(null)
    try {
      const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const datos = await res.json()
      if (!cancelado) setPosts(datos)
    } catch (e) {
      if (!cancelado) setError(e.message)
    } finally {
      if (!cancelado) setCargando(false)
    }
  }

  cargar()
  return () => {
    cancelado = true   // no setear state tras desmontar
  }
}, [])
```

## POST con JSON

```js
const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ title: 'Hola', body: 'Mundo', userId: 1 }),
})
if (!res.ok) throw new Error(`HTTP ${res.status}`)
const creado = await res.json()
```

## Errores: no lanza con status 4xx/5xx

`fetch` solo rechaza si falla la red. **Siempre comprueba `res.ok`** (true para 200–299).

## Abortar peticiones

```js
const ctrl = new AbortController()
fetch(url, { signal: ctrl.signal })
// al limpiar el efecto:
ctrl.abort()
```

## Checklist

- [x] Loading, error y datos como estados distintos
- [x] Cancelación / flag `cancelado` al desmontar
- [x] `res.ok` antes de `res.json()`
- [x] No guardes estado si el componente ya no está montado

## En el ejemplo

`src/hooks/useFetch.js` envuelve estos patrones; lo usan varias demos.
