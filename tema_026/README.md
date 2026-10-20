# Módulo 27 — Monorepos con pnpm workspaces y Turborepo
> 🧭 **Navegación:** [← Anterior: tema_025 — Testing E2E con Playwright](../tema_025/README.md) · [Índice del curso](../GUIA_ESTUDIO.md) · [🏁 Índice general →](../README.md)

Material del **Módulo 27** del roadmap (organización de proyectos multi-app).
Módulo añadido tras revisar huecos del curso: M2 introduce pnpm y M11 habla de
paquetes, pero el patrón real de los equipos React — **monorepo con pnpm
workspaces + Turborepo** — no tenía material propio.

## Para quién es este módulo

- **Para ti si** tienes una app y empiezas a compartir componentes o tipos con
  otra app (web + móvil, web + landing, design system interno).
- **Para ti si** en una oferta te piden "experiencia en monorepos" (Turborepo,
  Nx, workspaces) y solo has trabajado con repos sueltos.
- **Para ti si** quieres un CI que solo rebuilda lo que cambia en un proyecto
  multi-paquete.
- **No hace falta** saber Turborepo ni Nx; sí conviene pnpm (M2/U16) y TS (M3/M14).

## Contenido

### Teoría (`docs/`)

| Unidad | Tema |
|--------|------|
| [01 — ¿Qué es un monorepo?](docs/Unidad_01_Que_es_un_monorepo.md) | mono vs multi, apps/packages, workspaces vs orquestador |
| [02 — pnpm workspaces](docs/Unidad_02_pnpm_workspaces.md) | `pnpm-workspace.yaml`, `workspace:*`, `--filter` |
| [03 — Turborepo](docs/Unidad_03_Turborepo_pipeline_y_cache.md) | `turbo.json`, `dependsOn`, caché local y remota |
| [04 — Packages compartidos y CI](docs/Unidad_04_Packages_compartidos_y_CI.md) | tsconfig heredado, peerDeps, Actions + caché, release |

Cada unidad incluye: objetivos, requisitos, prosa para novatos, código, **Errores
comunes** con solución, **Conceptos clave** y **Autoevaluación** con respuestas
plegadas.

### Práctica (`EJEMPLO_MONOREPO/`)

Monorepo mínimo pero real: una app Vite que importa un paquete de UI compartido
y hereda el tsconfig base.

```
EJEMPLO_MONOREPO/
├── package.json          # scripts vía turbo
├── pnpm-workspace.yaml   # apps/* + packages/*
├── turbo.json            # pipeline build/check/lint
├── apps/web/             # @miorg/web — Vite + React
└── packages/
    ├── ui/               # @miorg/ui — Botón y Tarjeta
    └── tsconfig/         # @miorg/tsconfig — base compilerOptions
```

```bash
cd EJEMPLO_MONOREPO
pnpm install          # una sola vez, en la raíz
pnpm build            # turbo: ui primero, luego web (con caché)
pnpm check            # tsc de todos los paquetes
pnpm lint
pnpm exec turbo run build --force   # sin caché (para ver el grafo completo)
pnpm --filter @miorg/web dev        # solo la app
```

## Cómo estudiar

| Fase | Qué haces | Producto |
|------|-----------|----------|
| **1. Conceptos** | Lee la U01 y decide si tu proyecto actual lo necesita. | Criterio, no solo entusiasmo con herramientas. |
| **2. Workspaces** | Lee la U02; mira `pnpm-workspace.yaml` y `workspace:*` del ejemplo. | Montas el grafo de paquetes sin Turborepo. |
| **3. Pipeline** | Lee la U03; corre `pnpm build` dos veces y observa la caché. | Ves `dependsOn` y cache hit en acción. |
| **4. Compartido + CI** | Lee la U04; cambia `Boton.tsx` y rebuilda solo lo afectado. | Patrón de packages + CI listo para copiar. |

## Práctica mínima

1. `pnpm install && pnpm build` en `EJEMPLO_MONOREPO/` y repite `pnpm build`:
   la segunda vez debe decir "cache miss, skipping" (o similar) y ser instantánea.
2. Edita `packages/ui/src/Boton.tsx` (cambia el estilo) y vuelve a `pnpm build`:
   ahora corre `ui` y `web`.
3. Edita solo `apps/web/src/App.tsx` y rebuilda: corre solo `web`.
4. `pnpm exec turbo run build --dry-run` para inspeccionar el grafo sin ejecutar.
5. Cambia `strict` en `packages/tsconfig/base.json` a `false`, ejecuta
   `pnpm check` y comprueba cómo el cambio afecta a todos los paquetes.
6. Responde las autoevaluaciones de las cuatro unidades sin mirar.

## Mapa con el README

- [x] Monorepo vs multirepo; cuándo conviene cada uno
- [x] Estructura canónica `apps/` + `packages/`
- [x] `pnpm-workspace.yaml` y el protocolo `workspace:*`
- [x] `pnpm --filter` y ejecución por paquete
- [x] Turborepo: pipeline, `dependsOn: ["^build"]`, outputs
- [x] Caché local (y noción de caché remota)
- [x] tsconfig base heredado con `extends`
- [x] peerDependencies en libs compartidas (evitar doble React)
- [x] CI de GitHub Actions con caché de `.turbo`
- [x] Panorama de release con changesets
- [ ] Publicar un paquete real a npm — *extensión opcional*

## Relación con el resto del roadmap

| Módulo | Relación |
|--------|----------|
| M2 / U16 pnpm | Ahí se vio el store de pnpm; aquí se aplica a workspaces |
| M11 | La modularización por "packages" que M11 describe cobra forma |
| M14 | El tsconfig heredado exige el TS de M14 |
| M16 | Un monorepo puede alojar la app Expo (`apps/mobile`) junto a la web |
| M19 | El CI del M19 se extiende aquí con turbo + caché |
| M25/M26 | Los ejemplos de Q+F y E2E encajan como paquetes/apps del workspace |

---

> 🧭 **Navegación:** [← Anterior: tema_025 — Testing E2E con Playwright](../tema_025/README.md) · [Índice del curso](../GUIA_ESTUDIO.md) · [🏁 Índice general →](../README.md)
