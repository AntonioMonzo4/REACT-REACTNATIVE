# Unidad 04 — Packages compartidos, tsconfig heredado y CI
> 🧭 **Navegación:** [← Anterior: Unidad 03 — Turborepo: pipeline y caché](Unidad_03_Turborepo_pipeline_y_cache.md) · [Índice del tema](../README.md) · [🏁 Fin del curso →](../../README.md)

## Objetivos

Al terminar esta unidad podrás:

- Extraer un `tsconfig` base en `packages/tsconfig` y heredarlo desde apps/paquetes.
- Mantener un `packages/ui` como fuente única de componentes compartidos.
- Ejecutar el monorepo completo en **GitHub Actions** con Turborepo y caché.
- Trazar el camino de un release de paquetes (changesets) cuando toque publicar.

## Requisitos

- Unidades 01–03 del módulo.
- M19 (CI/CD) y M14 (TypeScript + React).

## `packages/tsconfig`: una sola verdad de compilerOptions

```json
// packages/tsconfig/base.json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "skipLibCheck": true,
    "noEmit": true,
    "verbatimModuleSyntax": true
  }
}
```

```json
// apps/web/tsconfig.json
{
  "extends": "../../packages/tsconfig/base.json",
  "compilerOptions": {
    "types": ["vite/client"]
  },
  "include": ["src"]
}
```

`extends` apila configs: el hijo solo declara **diferencias**. Cambios globales
(strict, jsx, module) se tocan en un sitio.

> Para que TS resuelva `extends` a un paquete, la forma más simple en un
> monorepo local es la **ruta relativa** (`../../packages/tsconfig/base.json`),
> como arriba. La alternativa con `@miorg/tsconfig` requiere resolver el
> nombre del paquete; la ruta relativa es la que verás en la mayoría de
> plantillas pequeñas.

## `packages/ui`: el paquete de componentes

```
packages/ui/
├── package.json      # name: @miorg/ui, main: ./src/index.ts
└── src/
    ├── index.ts      # export * from './Boton'
    └── Boton.tsx
```

```tsx
// packages/ui/src/Boton.tsx
import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }

export function Boton({ children, ...props }: Props) {
  return (
    <button
      style={{ padding: '0.5rem 1rem', borderRadius: 8, cursor: 'pointer' }}
      {...props}
    >
      {children}
    </button>
  )
}
```

Reglas de oro del paquete compartido:

- **Sin estado global** (ese es M8/M9): `ui` es presentación pura.
- **Peer deps** de React, no deps: evita duplicar React en el bundle.
- Versiona semánticamente cuando publiques; mientras sea `private`, cambia libre.

## CI en GitHub Actions con Turborepo

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]

jobs:
  monorepo:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm
      - uses: actions/cache@v4
        with:
          path: .turbo
          key: turbo-${{ runner.os }}-${{ hashFiles('pnpm-lock.yaml') }}
          restore-keys: turbo-${{ runner.os }}-
      - run: pnpm install --frozen-lockfile
      - run: pnpm exec turbo run lint check build
```

Lo que ganas:

- **Caché de `.turbo`**: el segundo build del PR repite resultados del primero
  si los inputs no cambian (con caché remota, incluso entre runners).
- **Un solo job** que cubre todos los paquetes, con orden garantizado por el grafo.

## Release de paquetes (cuando toque publicar)

Hoy casi todo el material del curso usa `private: true`. Cuando un paquete
(`@miorg/ui`) deba consumirse fuera del repo:

1. **changesets**: `pnpm add -D @changesets/cli` → `pnpm changeset` describe el
   cambio; el bot/CI abre un "Version PR" que actualiza `CHANGELOG` y `package.json`.
2. Publicación en npm/GitHub Packages desde CI solo en merge a `main`.

No lo ejecutamos aquí (no publicamos), pero es el estándar del ecosistema y
aparece en muchas ofertas junto a "monorepo".

## Errores comunes

| Error | Síntoma | Solución |
|-------|---------|------------|
| Duplicar React dentro de `ui` | "Invalid hook call" en runtime | `react`/`react-dom` como **peerDependencies** en `ui` |
| Editar compilerOptions en cada app | Deriva y bugs "solo en una app" | Hereda de `packages/tsconfig/base.json` |
| CI sin caché de `.turbo` | Cada build = 100 % del grafo | Añadir `actions/cache` sobre `.turbo` |

## Conceptos clave

- **tsconfig heredado**: una base, N hijos con solo diferencias.
- **peerDependencies** en libs compartidas: evitan duplicar React.
- **CI + caché de turbo**: el grafo completo, pero solo rebuildas lo sucio.
- **changesets**: flujo profesional de versionado/publicación de paquetes.

## Autoevaluación

<details>
<summary><b>1. ¿Por qué `react` va en peerDependencies de `@miorg/ui`?</b></summary>

Para que cada app aporte su propia copia de React (la que ya usa). Si `ui` lo
tuviera como dependencia normal, podrían convivir dos React y romper los hooks.
</details>

<details>
<summary><b>2. ¿Qué archivo de caché de turbo se cachea en CI?</b></summary>

La carpeta `.turbo` (task outputs internos de Turborepo) junto al lockfile como
parte de la key; así se reutilizan resultados entre runs del mismo lockfile.
</details>

<details>
<summary><b>3. Situación para aplicar changesets.</b></summary>

Cuando `@miorg/ui` se publica a un registry (npm/GitHub Packages) y hay que
coordinar versiones y changelogs consumibles por otros repos o equipos.
</details>

> 🧭 **Navegación:** [← Anterior: Unidad 03 — Turborepo: pipeline y caché](Unidad_03_Turborepo_pipeline_y_cache.md) · [Índice del tema](../README.md) · [🏁 Fin del curso →](../../README.md)
