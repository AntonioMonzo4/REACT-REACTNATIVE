# Módulo 10 — Testing

Material del **Módulo 10** del roadmap (Jest/Vitest, React Testing Library, mocking, unit e integration).

## Contenido

### Teoría (`docs/`)

| Unidad | Tema |
|--------|------|
| [01 — Jest y configuración](docs/Unidad_01_Jest_y_configuracion.md) | Runner, setup, matchers (Vitest en Vite) |
| [02 — React Testing Library](docs/Unidad_02_React_Testing_Library.md) | Queries por role, `userEvent`, async |
| [03 — Mocking](docs/Unidad_03_Mocking.md) | `vi.fn`, módulos, fetch, timers |
| [04 — Unit Testing](docs/Unidad_04_Unit_Testing.md) | Funciones puras y reducers |
| [05 — Integration Testing](docs/Unidad_05_Integration_Testing.md) | Flujos con providers y red mockeada |

### Práctica (`EJEMPLO_REACT_TESTING/`)

Vite + React + **Vitest** + RTL:

- `math.test.js` — unit puro
- `Contador.test.jsx` — render + click
- `useFetch.test.js` — hook con `fetch` mockeado
- `FormularioLogin.test.jsx` — integration (éxito y error)

```bash
cd EJEMPLO_REACT_TESTING
pnpm install
pnpm test:run   # suites
pnpm lint
pnpm build
pnpm coverage   # informe de cobertura
```

## Mapa con el README

- [x] Jest (conceptos; runner Vitest nativo de Vite)
- [x] React Testing Library
- [x] Mocking
- [x] Unit Testing
- [x] Integration Testing
- [ ] Proyecto: Cobertura superior al 80 % — *pendiente* (medir en el proyecto real)
