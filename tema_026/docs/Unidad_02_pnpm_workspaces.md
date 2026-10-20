# Unidad 02 — pnpm workspaces: el grafo de paquetes
> 🧭 **Navegación:** [← Anterior: Unidad 01 — ¿Qué es un monorepo y por qué lo usan los equipos?](Unidad_01_Que_es_un_monorepo.md) · [Índice del tema](../README.md) · [Siguiente: Unidad 03 — Turborepo: pipeline y caché →](Unidad_03_Turborepo_pipeline_y_cache.md)

## Objetivos

Al terminar esta unidad podrás:

- Crear un `pnpm-workspace.yaml` que declare `apps/*` y `packages/*`.
- Enlazar paquetes locales con el protocolo `workspace:*`.
- Usar `pnpm --filter` para ejecutar scripts solo en un paquete.
- Explicar qué pasa por debajo (hard links, virtual store) y por qué es rápido.

## Requisitos

- Unidad 01.
- pnpm instalado (M2 / U16 pnpm).

## Declarar el workspace

En la **raíz** del monorepo:

```yaml
# pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

```json
// package.json de la raíz
{
  "name": "ejemplo-monorepo",
  "private": true,
  "scripts": {
    "build": "turbo run build",
    "lint": "turbo run lint",
    "check": "turbo run check"
  }
}
```

`"private": true` en la raíz es obligatorio: la raíz **nunca** se publica.

Un `pnpm install` en la raíz instala las dependencias de **todos** los paquetes
con un único lockfile (`pnpm-lock.yaml` en la raíz).

## `workspace:*`: enlazar, no publicar

Dentro de `apps/web/package.json`:

```json
{
  "name": "@miorg/web",
  "private": true,
  "dependencies": {
    "@miorg/ui": "workspace:*",
    "react": "^19.2.0",
    "react-dom": "^19.2.0"
  }
}
```

`workspace:*` le dice a pnpm: **"no vayas al registry; usa la carpeta local
`packages/ui`"**. Ventajas:

- Cambias el `Button` de `packages/ui` y `apps/web` lo ve al instante (en local
  es un enlace; en CI se resuelve igual).
- Sin publicar versiones intermedias para desarrollar.

Al **publicar** el paquete (si algún día lo haces), pnpm reemplaza `workspace:*`
por la versión real automáticamente.

## Filtrar comandos

```bash
# Solo el paquete @miorg/ui
pnpm --filter @miorg/ui build

# El paquete y sus dependientes (apps que lo usan)
pnpm --filter @miorg/web... build

# Todos menos la raíz
pnpm -r lint
```

Esto es lo que Turborepo hará por ti con caché; pero `--filter` es útil para
iterar en local sin compilar todo.

## Nombres de paquetes: convención `@scope/nombre`

```json
// packages/ui/package.json
{
  "name": "@miorg/ui",
  "version": "0.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "peerDependencies": {
    "react": "^19.2.0"
  }
}
```

- **Scope `@miorg/`**: evita colisiones y deja claro qué es "tuyo".
- **`private: true`** si no vas a publicar (casi siempre al empezar).
- Apuntar `main`/`types` al **fuente TS** (`src/index.ts`) funciona en un
  monorepo porque la app se compila con su propio bundler (Vite); es el patrón
  más simple hasta que necesites publicar binarios o múltiples entrypoints.

## Cómo consume la app el paquete

```ts
// apps/web/src/App.tsx
import { Boton } from '@miorg/ui'

export function App() {
  return <Boton onClick={() => alert('desde el paquete compartido')}>Hola monorepo</Boton>
}
```

Vite resuelve `@miorg/ui` a través del enlace de pnpm. No hace falta `paths`
raro en tsconfig si el paquete expone bien `name`, `main` y `types` (y el
tsconfig base de U04/U02-heredado lo permite).

## Errores comunes

| Error | Síntoma | Solución |
|-------|---------|----------|
| Olvidar `private: true` en la raíz | `pnpm publish` intenta publicar todo | Raíz y casi todos los paquetes: `private: true` |
| Versión fija `"@miorg/ui": "0.0.1"` | Rompe al cambiar el paquete | `"workspace:*"` siempre en desarrollo |
| Instalar desde el subdir | Dos `node_modules`, lockfiles duplicados | `pnpm install` **solo en la raíz** del workspace |

## Conceptos clave

- **`pnpm-workspace.yaml`**: manifiesto de qué carpetas son paquetes.
- **`workspace:*`**: dependencia resuelta al código local del monorepo.
- **`--filter`**: ejecutar scripts selectivamente por nombre de paquete.
- **Scope `@org/pkg`**: convención de nombres para paquetes internos.

## Autoevaluación

<details>
<summary><b>1. ¿Dónde se ejecuta `pnpm install` en un monorepo?</b></summary>

En la raíz, una sola vez. Desde ahí pnpm lee `pnpm-workspace.yaml`, instala todo
y crea el lockfile único. Ejecutarlo dentro de un paquete puede crear un
segundo `node_modules` y romper los enlaces.
</details>

<details>
<summary><b>2. ¿Qué garantiza `workspace:*`?</b></summary>

Que la dependencia se resuelva al paquete local del monorepo en vez de ir al
registry de npm. Al publicar, pnpm la sustituye por la versión publicada real.
</details>

<details>
<summary><b>3. Comando para buildar solo la app y sus dependientes.</b></summary>

`pnpm --filter @miorg/web... build` (el `...` final incluye dependientes, es
decir, lo que depende de web; para dependencias usarías `...@miorg/web`).
</details>

> 🧭 **Navegación:** [← Anterior: Unidad 01 — ¿Qué es un monorepo y por qué lo usan los equipos?](Unidad_01_Que_es_un_monorepo.md) · [Índice del tema](../README.md) · [Siguiente: Unidad 03 — Turborepo: pipeline y caché →](Unidad_03_Turborepo_pipeline_y_cache.md)
