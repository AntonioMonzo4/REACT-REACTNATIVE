# Ejemplo Testing — Módulo 10

Proyecto de práctica del **Módulo 10 (Testing)**. Vite + React + **Vitest** + React Testing Library.

> El checklist del roadmap nombra Jest; en Vite se usa **Vitest** (misma API: `describe`, `it`, `expect`, mocks con `vi`).

## Comandos

```bash
pnpm install
pnpm test:run   # ejecuta la suite una vez
pnpm test       # watch
pnpm coverage   # informe de cobertura
pnpm lint
pnpm build
```

## Tests incluidos

| Archivo | Nivel |
|---------|-------|
| `src/math.test.js` | Unit (función pura) |
| `src/components/Contador.test.jsx` | Componente (RTL + userEvent) |
| `src/hooks/useFetch.test.js` | Hook con `fetch` mockeado |
| `src/components/FormularioLogin.test.jsx` | Integration (éxito y error) |

## Temario Módulo 10 — estado

- [x] Jest (conceptos / Vitest)
- [x] React Testing Library
- [x] Mocking
- [x] Unit Testing
- [x] Integration Testing
- [ ] Cobertura > 80 % en el proyecto real
