# Unidad 02 — Calidad de código

## Stack mínimo

| Herramienta | Rol |
|-------------|-----|
| **ESLint** | errores + estilo (ya en todos los ejemplos) |
| **Prettier** | formato canónico (`printWidth: 80/100`) |
| **Husky** | hooks git (`pre-commit`) |
| **lint-staged** | lint solo de archivos staged |
| **commitlint** | convención de mensajes (`feat:`, `fix:`) |

## Configuración típica

```bash
pnpm add -D prettier husky lint-staged @commitlint/cli @commitlint/config-conventional
npx husky init
```

```js
// .lintstagedrc o package.json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{md,json}": ["prettier --write"]
  }
}
```

```js
// commitlint.config.js
module.exports = { extends: ['@commitlint/config-conventional'] }
```

```bash
echo "pnpm lint-staged" > .husky/pre-commit
echo "pnpm commitlint --edit \$1" > .husky/commit-msg
```

## Convenios de PR

- `feat: añade carrito persistente`
- Título = tipo + resumen; cuerpo = por qué + capturas.
- Changelog a partir de conventional commits (`standard-version` o CI).
