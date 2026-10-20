# Ejemplo Monorepo — Módulo 27

Monorepo de práctica del **Módulo 27 (Monorepos con pnpm workspaces + Turborepo)**.
Una app Vite (`apps/web`) consume un paquete de UI local (`packages/ui`) y hereda
el tsconfig base (`packages/tsconfig`).

## Estructura

```
EJEMPLO_MONOREPO/
├── package.json          # scripts: build/check/lint/dev vía turbo
├── pnpm-workspace.yaml   # apps/* + packages/*
├── turbo.json            # pipeline con dependsOn ^build y outputs dist/**
├── apps/web/             # @miorg/web — Vite + React 19
└── packages/
    ├── ui/               # @miorg/ui — Boton, Tarjeta (peerDeps: react)
    └── tsconfig/         # @miorg/tsconfig — base.json compartido
```

## Comandos (siempre en la raíz)

```bash
pnpm install
pnpm build                              # turbo: ui → web, con caché
pnpm check                              # tsc de todos los paquetes
pnpm lint
pnpm exec turbo run build --dry-run     # ver el grafo sin ejecutar
pnpm exec turbo run build --force       # ignorar caché
pnpm --filter @miorg/web dev            # solo la app (vite dev)
```

## Qué demostrar en la práctica

1. `pnpm build` dos veces seguidas: la segunda es un cache hit.
2. Editar `packages/ui/src/Boton.tsx` y rebuildar: corre `ui` y `web`.
3. Editar solo `apps/web/src/App.tsx` y rebuildar: corre solo `web`.

## Temario Módulo 27 — estado

- [x] U01 — Conceptos de monorepo
- [x] U02 — pnpm workspaces y `workspace:*`
- [x] U03 — Turborepo: pipeline y caché
- [x] U04 — tsconfig heredado, peerDeps y CI
- [ ] Release real con changesets (extensión opcional)
