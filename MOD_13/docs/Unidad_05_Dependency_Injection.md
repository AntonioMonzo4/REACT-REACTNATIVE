# Unidad 05 — Dependency Injection

## Qué es en React

En vez de importar un servicio **concreto**, el componente recibe la **implementación** por props/context → testeable y polimórfico.

```jsx
// Duro
import { enviarEmail } from '../api/email'
function Alta() { ... enviarEmail(...) }

// Inyectado
function Alta({ enviarEmail }) { ... }

// App root
<Alta enviarEmail={apiEmail.enviar} />
// Tests
<Alta enviarEmail={vi.fn()} />
```

## Context como contenedor de dependencias

```jsx
const ServicesCtx = createContext(null)

export function ServicesProvider({ value, children }) {
  return <ServicesCtx.Provider value={value}>{children}</ServicesCtx.Provider>
}

export function useServices() {
  return useContext(ServicesCtx)
}

// main.jsx
<ServicesProvider value={{ auth, cartApi, logger }}>
```

## Cuando inyectar

| Escenario | Estrategia |
|-----------|------------|
| Lógica interna de la feature | import directo suele bastar |
| Multi-tenant / skins / storages distintos | DI por contexto o factory |
| Tests unitarios | mocks de módulo **o** DI (elige uno y sé coherente) |
| Micro frontends | contratos en paquete compartido |

## IoC ligero

Factory functions:

```js
export const crearRepositorio = ({ fetcher, baseUrl }) => ({
  listar: () => fetcher(`${baseUrl}/items`),
})
```

## Errores comunes

- Context DI gigante sin documentar → hard to trace.
- Inyectar **estado** cuando lo que se necesita es un **servicio**.

## En el ejemplo

`ServicesProvider` con `logger` y `clock` reales/fake en tests y demo.
