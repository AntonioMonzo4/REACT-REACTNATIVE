# Unidad 05 — Error Boundaries

## Qué son

Componentes de clase que **capturan errores de render** en su subtree y muestran un fallback, en lugar de dejar la app en blanco.

> React no ofrece error boundaries con hooks todavía: se implementan con **clase** (`componentDidCatch` / `getDerivedStateFromError`).

```jsx
import { Component } from 'react'

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary', error, info.componentStack)
    // aquí podrías enviar a un servicio de monitoring
  }

  render() {
    if (this.state.error) {
      return (
        this.props.fallback ?? (
          <div role="alert">
            <h2>Algo salió mal</h2>
            <p>{String(this.state.error.message)}</p>
            <button
              type="button"
              onClick={() => this.setState({ error: null })}
            >
              Reintentar
            </button>
          </div>
        )
      )
    }
    return this.props.children
  }
}
```

## Dónde colocarlos

1. **Alrededor de rutas o secciones** (no hace falta envolver toda la app si no quieres).
2. Alrededor de **Suspense + lazy** (fallos de chunk).
3. Cerca de widgets arriesgados (integraciones de terceros).

## Qué capturan / qué no

| Capturan | No capturan |
|----------|-------------|
| Errores en render | Event handlers (`onClick`) |
| Errores en lifecycle de clase | Async fuera de React (promesas sueltas) |
| Errores de constructores de hijos | Errores en el propio ErrorBoundary |
| Errores en `useEffect` del hijo (parcialmente, según React y qué error) | `JSON.parse` en un callback si no se propaga a render |

Para handlers: `try/catch` o `.catch` en la promesa.

## Reset

- Cambiar `key` del boundary para forzar remount.
- Botón que limpia `error` en el estado (como arriba).

## En el ejemplo

`src/components/ErrorBoundary.jsx` + demo en `DemoErrorBoundary.jsx`.
