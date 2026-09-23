# Unidad 01 — GitHub Actions

## Estructura

```yaml
# .github/workflows/ci.yml
name: CI
on:
  push:
    branches: [main]
  pull_request:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm
      - run: corepack enable
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm test:run
      - run: pnpm build
```

## Conceptos

| Elemento | Rol |
|----------|-----|
| **Workflow** | archivo en `.github/workflows/` |
| **Event** | `push`, `pull_request`, `schedule`, `workflow_dispatch` |
| **Job** | runner (`ubuntu-latest`, `windows-latest`); paralelo por defecto |
| **Step** | `uses:` action o `run:` shell |
| **Artifact** | sube `dist/` entre jobs |
| **Secret** | `secrets.TOKEN` en Settings → Secrets |

## Patrón release (tag)

```yaml
on:
  push:
    tags: ['v*']
```

## Errores comunes

- Lockfile distinto vs CI (`--frozen-lockfile` falla).
- Secrets logueados accidentalmente.
- Usar `master` cuando la rama es `main`.
- Olvidar `permissions:` mínimo (principio de menor privilegio).
