# Unidad 04 — Modularización

## Qué es

Partir el código en **módulos con contratos claros** (imports permitidos, estado propio, tests).

## Estrategias

| Estrategia | Cuándo |
|------------|--------|
| Por feature (M2) | default en apps de producto |
| Por capa + dominio | herencia de arquitectura empresarial |
| Monorepo / packages | varios apps o libs compartidas (pnpm workspaces, Turbo) |

## Contrato de un módulo

```text
modulo-carrito/
  public/ (index.js)   ← export permitido
  internal/            ← no se importa fuera
  tests/
```

Reglas automatizables con ESLint:

```js
// no-restricted-imports / boundaries
'import/no-restricted-paths': ['error', {
  zones: [
    { target: './src/features/auth/**', from: './src/features/carrito/**' },
  ],
}]
```

## Tamaño de módulo

- **Cohesivo**: todo cambia por la misma razón.
- **Acoplado mínimo**: depende de `shared` y de pocos contratos.
- Si un módulo tiene 2 roles de equipo distintos, probablemente es dos.

## Estado y módulos

- Estado local del módulo → `useState`/store interno.
- Estado compartido → store global (M9) **exponiendo acciones**, no el árbol entero.

## En el ejemplo

`features/` con fronteras por `index.js` y nota de ESLint boundaries en README.
