# Unidad 01 — ¿Qué es un monorepo y por qué lo usan los equipos?
> 🧭 **Navegación:** [← Anterior: tema_025 · Unidad 04 — Page Objects, fixtures y CI](../../tema_025/docs/Unidad_04_Page_Objects_fixtures_y_CI.md) · [Índice del tema](../README.md) · [Siguiente: Unidad 02 — pnpm workspaces →](Unidad_02_pnpm_workspaces.md)

## Objetivos

Al terminar esta unidad podrás:

- Definir **monorepo** vs **multirepo** y listar sus ventajas y costes.
- Distinguir las capas típicas: `apps/` y `packages/`.
- Situar pnpm workspaces, Turborepo y Nx en el panorama de herramientas.
- Decir cuándo un proyecto *necesita* un monorepo y cuándo no.

## Requisitos

- Haber usado pnpm (M2 / Unidad 16 pnpm).
- Haber visto modularización y paquetes en M11 (Unidad 04).

## Multirepo vs monorepo

- **Multirepo**: cada app/lib vive en su propio repositorio Git. El clásico
  "frontend-web", "frontend-movil", "design-system", "api-client" separados.
- **Monorepo**: varias apps y paquetes viven en **un único repo** con una raíz
  compartida (`apps/`, `packages/`), un único historial de commits y un único CI.

Empresas del ecosistema React que trabajan en monorepo: Meta, Google (históricamente),
Vercel, muchas plantillas modernas de Nx/Turborepo. No es una moda de fin de semana:
es la forma por defecto de organizar frontends multi-app.

## Ventajas reales (las que importan en un equipo)

| Ventaja | Qué significa en el día a día |
|---------|-------------------------------|
| **Cambios atómicos** | Un PR puede tocar `packages/ui` + `apps/web` a la vez. Sin monorepo: dos PRs, dos versiones, coordinación manual. |
| **Tipos compartidos en tiempo real** | `import type { Tarea } from '@miorg/tipos'` usa el código fuente local, no un `npm publish` desfasado. |
| **Refactors globales** | Renombrar una exportación se hace con un solo `grep` + build del workspace. |
| **Una sola instalación** | Un `pnpm install`, un lockfile, una versión de TypeScript para todo. |
| **CI compartido** | Pipelines que solo construyen lo que cambió (aquí entra Turborepo). |

## Costes (por qué no todo proyecto lo necesita)

- **Complejidad de config**: tsconfig/ESLint que "heredan" de un paquete base.
- **Curva del equipo**: hay que enseñar filtros (`pnpm --filter`), pipeline, etc.
- **Ruido en CI** sin caché: si todo se compila siempre, un monorepo sin
  Turborepo es *más lento*, no más rápido.
- **Release versionado**: publicar paquetes a un registry añade trabajo
  (changesets, semantic-release…). Puedes posponerlo.

**Regla práctica**: si tienes 1 app y 0 libs compartidas, no necesitas monorepo.
Si tienes 2+ apps que comparten componentes o tipos, el monorepo empieza a pagar.

## Las tres capas de herramientas

Un monorepo moderno combina tres piezas, cada una con un trabajo:

| Capa | Herramienta típica | Trabajo |
|------|--------------------|---------|
| **Workspaces** | `pnpm-workspace.yaml` | Declarar qué carpetas son paquetes y vincular sus dependencias (`workspace:*`) |
| **Orquestador** | **Turborepo** (o Nx) | Pipeline de tareas (`build`, `lint`, `test`) con **caché** y ejecución paralela |
| **Release** | changesets / semantic-release | Versionar y publicar paquetes (lo vemos en U04) |

pnpm workspaces solo **monta** el grafo de paquetes; no sabe qué ejecutar en
qué orden ni cachea nada. Turborepo se sienta **encima** de pnpm y añade el
pipeline con caché. Es la combinación que usaremos en el ejemplo.

## Estructura canónica

```
EJEMPLO_MONOREPO/
├── package.json          # raíz: scripts que llaman a turbo
├── pnpm-workspace.yaml   # lista apps/* y packages/*
├── turbo.json            # pipeline: build → lint → check
├── apps/
│   └── web/              # la app Vite (depende de @miorg/ui)
└── packages/
    ├── ui/               # componentes compartidos (Button…)
    └── tsconfig/         # tsconfig base reutilizable
```

`apps/` = lo que se despliega. `packages/` = lo que se importa. No hay una
verdad absoluta, pero es el patrón que más se ve en proyectos React.

## Errores comunes

| Error | Síntoma | Solución |
|-------|---------|----------|
| Monorepo de un solo proyecto | Configura 3 herramientas para 1 app | Empieza simple; separa cuando exista 2ª app o lib compartida |
| Versiones fijas entre paquetes | "funciona en local, en CI no" | Usa `"@miorg/ui": "workspace:*"` siempre |
| Sin `name` en `package.json` | pnpm `--filter` no encuentra nada | Cada paquete necesita un nombre único (`@miorg/ui`) |

## Conceptos clave

- **Monorepo**: varios paquetes/apps en un repo con historial y CI compartidos.
- **`apps/` vs `packages/`**: desplegables vs importables.
- **workspace protocol** (`workspace:*`): enlazar paquetes locales en vez de publicarlos.
- **Orquestador** (Turborepo/Nx): ejecuta tareas por dependencia con caché.

## Autoevaluación

<details>
<summary><b>1. Tienes solo una app Vite. ¿Monorepo?</b></summary>

No. Un solo `package.json` en la raíz basta. El monorepo aporta cuando hay
múltiples apps o libs compartidas que evolucionan en el mismo equipo.
</details>

<details>
<summary><b>2. ¿Qué capa se encarga de la caché de build?</b></summary>

El orquestador (Turborepo/Nx), no pnpm workspaces. Workspaces solo gestiona
la instalación y el grafo de dependencias locales.
</details>

<details>
<summary><b>3. Ventaja número 1 de un monorepo para un equipo de 4 personas.</b></summary>

Cambios atómicos: un PR puede actualizar el componente en `packages/ui` y su
consumo en `apps/web` sin coordinar dos repos ni publicar versiones intermedias.
</details>

> 🧭 **Navegación:** [← Anterior: tema_025 · Unidad 04 — Page Objects, fixtures y CI](../../tema_025/docs/Unidad_04_Page_Objects_fixtures_y_CI.md) · [Índice del tema](../README.md) · [Siguiente: Unidad 02 — pnpm workspaces →](Unidad_02_pnpm_workspaces.md)
