# Módulo 19 — CI/CD

Material del **Módulo 19** del roadmap.

## Contenido

| Unidad | Tema |
|--------|------|
| [01 — GitHub Actions](docs/Unidad_01_GitHub_Actions.md) | Workflows, jobs, secrets |
| [02 — Vercel y Netlify](docs/Unidad_02_Vercel_Netlify.md) | Builds, SPA redirects, previews |
| [03 — Firebase y pipeline](docs/Unidad_03_Firebase_y_Pipeline.md) | Hosting, CI → deploy, checklist |

### Plantilla

- [`plantillas/ci.yml`](plantillas/ci.yml) — copia a `.github/workflows/ci.yml`

## Práctica

1. Copia `plantillas/ci.yml` a `.github/workflows/ci.yml` de un ejemplo (p. ej. `MOD_10/EJEMPLO_REACT_TESTING`).
2. Ajusta package manager y scripts (`pnpm lint`, `pnpm test:run`, `pnpm build`).
3. `git push` → pestaña Actions del repo (requiere push; **pide confirmación**).
4. Conecta Vercel/Netlify al repo → preview por PR.

## Mapa con el README

- [x] GitHub Actions
- [x] Vercel
- [x] Netlify
- [x] Firebase Hosting
- [ ] Pipeline real en este repo — *pendiente (requiere push a GitHub)*
